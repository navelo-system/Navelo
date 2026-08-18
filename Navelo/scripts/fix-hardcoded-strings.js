/* eslint-disable */
/**
 * Codemod: fix-hardcoded-strings.js
 * 
 * Automaticamente:
 *  1. Roda ESLint e coleta todos os erros de string hardcoded
 *  2. Extrai o valor literal de cada string no arquivo/linha/coluna indicado
 *  3. Gera uma chave camelCase única para cada string nova
 *  4. Insere as strings novas no namespace `misc` de strings.ts
 *  5. Substitui os valores hardcoded por referências UI_STRINGS.misc.<key>
 *  6. Adiciona o import de UI_STRINGS nos arquivos que ainda não o têm
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const STRINGS_FILE = path.join(ROOT, 'src', 'constants', 'strings.ts')

// ─── helpers ────────────────────────────────────────────────────────────────

function toCamelKey(str) {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word, i) => i === 0
      ? word.charAt(0).toLowerCase() + word.slice(1).toLowerCase()
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('')
    .replace(/^(\d)/, '_$1') // não pode começar com número
    || 'item'
}

function makeUniqueKey(base, existing) {
  if (!existing.has(base)) return base
  let n = 2
  while (existing.has(`${base}${n}`)) n++
  return `${base}${n}`
}

/** Extrai o conteúdo da string literal na posição dada (line 1-indexed, col 1-indexed) */
function extractStringAt(content, line, col) {
  const lines = content.split('\n')
  const lineStr = lines[line - 1]
  if (!lineStr) return null

  // A coluna aponta para o char após "text=" ou "label=" etc.
  // O ESLint reporta a posição do início do nó (o abre-aspas da string)
  // Vamos buscar o delimitador a partir da coluna indicada
  let idx = col - 1 // 0-indexed
  
  // Retrocede para encontrar o início real da string (pode apontar para a prop)
  // Avança até encontrar uma aspa ou backtick
  while (idx < lineStr.length && lineStr[idx] !== '"' && lineStr[idx] !== "'") {
    idx++
  }
  
  if (idx >= lineStr.length) return null
  
  const quote = lineStr[idx]
  if (quote !== '"' && quote !== "'") return null
  
  let end = idx + 1
  while (end < lineStr.length && lineStr[end] !== quote) {
    if (lineStr[end] === '\\') end++ // skip escape
    end++
  }
  
  if (end >= lineStr.length) return null
  
  return lineStr.slice(idx + 1, end)
}

/** Lê o namespace misc do strings.ts e devolve { existingMap, existingKeys } */
function readMiscNamespace(content) {
  const map = new Map() // key -> value
  const miscMatch = content.match(/misc:\s*\{([^}]*)\}/s)
  if (!miscMatch) return { map, keys: new Set() }
  
  const block = miscMatch[1]
  const entryRe = /(\w+):\s*"([^"]*)"/g
  let m
  while ((m = entryRe.exec(block)) !== null) {
    map.set(m[1], m[2])
  }
  return { map, keys: new Set(map.keys()) }
}

/** Verifica em todos os namespaces se o valor já existe, retornando "ns.key" ou null */
function findExistingRef(content, value) {
  // regex para capturar  namespace: { ... key: "value" ... }
  const nsRe = /(\w+):\s*\{([^}]*)\}/gs
  let nsMatch
  while ((nsMatch = nsRe.exec(content)) !== null) {
    const ns = nsMatch[1]
    if (ns === 'misc') continue
    const block = nsMatch[2]
    const entryRe = /(\w+):\s*"([^"]*)"/g
    let m
    while ((m = entryRe.exec(block)) !== null) {
      if (m[2] === value) return `UI_STRINGS.${ns}.${m[1]}`
    }
  }
  return null
}

// ─── main ────────────────────────────────────────────────────────────────────

console.log('🔍  Rodando ESLint para coletar erros...')

let eslintJson
try {
  eslintJson = execSync(
    'npx eslint src/components/store/sections/pdv/pages/ --format json',
    { cwd: ROOT, encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }
  )
} catch (e) {
  // ESLint retorna exit code 1 quando há erros, mas ainda imprime JSON
  eslintJson = e.stdout
}

let results
try {
  results = JSON.parse(eslintJson)
} catch {
  console.error('❌ Falha ao parsear o output do ESLint como JSON.')
  process.exit(1)
}

// Coleta só os erros de string hardcoded
const errorsByFile = {}
for (const result of results) {
  for (const msg of result.messages) {
    if (msg.ruleId === 'no-restricted-syntax' && msg.message.includes('String literal hardcoded')) {
      ;(errorsByFile[result.filePath] = errorsByFile[result.filePath] || [])
        .push({ line: msg.line, col: msg.column })
    }
  }
}

const totalErrors = Object.values(errorsByFile).reduce((s, a) => s + a.length, 0)
console.log(`📋  ${totalErrors} erros encontrados em ${Object.keys(errorsByFile).length} arquivos.`)

if (totalErrors === 0) {
  console.log('✅  Nenhum erro para corrigir.')
  process.exit(0)
}

// ─── Lê strings.ts ──────────────────────────────────────────────────────────
let stringsContent = fs.readFileSync(STRINGS_FILE, 'utf8')

// Garante que existe o namespace misc
if (!stringsContent.includes('misc:')) {
  stringsContent = stringsContent.replace('} as const', '  misc: {\n  },\n} as const')
  fs.writeFileSync(STRINGS_FILE, stringsContent, 'utf8')
  stringsContent = fs.readFileSync(STRINGS_FILE, 'utf8')
}

let { map: miscMap, keys: miscKeys } = readMiscNamespace(stringsContent)

// ─── Processa cada arquivo ───────────────────────────────────────────────────
let totalFixed = 0
let totalAdded = 0

for (const [filePath, errors] of Object.entries(errorsByFile)) {
  let fileContent = fs.readFileSync(filePath, 'utf8')
  
  // Verifica se já importa UI_STRINGS
  const hasImport = fileContent.includes("from \"@/constants/strings\"") ||
                    fileContent.includes("from '@/constants/strings'")
  
  // Ordena erros de baixo para cima para não deslocar posições ao substituir
  const sorted = [...errors].sort((a, b) => b.line - a.line || b.col - a.col)
  
  const linesToAdd = new Map() // key -> value (novas entradas para misc)
  const replacements = [] // { line, col, original, ref }
  
  // Primeiro passo: extrai os valores e determina as referências
  for (const { line, col } of sorted) {
    const value = extractStringAt(fileContent, line, col)
    if (value === null || value === '') continue
    
    // 1. Verifica se já existe em algum namespace
    const existingRef = findExistingRef(stringsContent, value)
    if (existingRef) {
      replacements.push({ line, col, value, ref: existingRef })
      continue
    }
    
    // 2. Verifica se já está no misc map
    let foundKey = null
    for (const [k, v] of miscMap) {
      if (v === value) { foundKey = k; break }
    }
    
    if (!foundKey) {
      // 3. Gera chave nova
      const base = toCamelKey(value).slice(0, 40) || 'item'
      const key = makeUniqueKey(base, miscKeys)
      miscKeys.add(key)
      miscMap.set(key, value)
      linesToAdd.set(key, value)
      foundKey = key
      totalAdded++
    }
    
    replacements.push({ line, col, value, ref: `UI_STRINGS.misc.${foundKey}` })
  }
  
  // Segundo passo: aplica substituições (de baixo para cima para preservar posições)
  const fileLines = fileContent.split('\n')
  
  for (const { line, col, value, ref } of replacements) {
    const lineStr = fileLines[line - 1]
    if (!lineStr) continue
    
    // Encontra a posição exata da string literal para substituir
    // O padrão é: ="value" ou ='value'
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`=["']${escapedValue}["']`)
    const match = pattern.exec(lineStr)
    
    if (match) {
      fileLines[line - 1] = lineStr.slice(0, match.index) + `={${ref}}` + lineStr.slice(match.index + match[0].length)
      totalFixed++
    } else {
      console.warn(`  ⚠️  Linha ${line}: não foi possível localizar: "${value}"`)
    }
  }
  
  let newContent = fileLines.join('\n')
  
  // Adiciona import se necessário
  if (!hasImport && replacements.some(r => r.ref.startsWith('UI_STRINGS'))) {
    newContent = newContent.replace(
      /^("use client"\n\n?)?/,
      (m) => m + (m ? '' : '') + `import { UI_STRINGS } from "@/constants/strings"\n`
    )
    // Abordagem alternativa: insere após o último import existente
    if (!newContent.includes('UI_STRINGS')) {
      newContent = newContent.replace(
        /(import .+\n)(?!import)/,
        `$1import { UI_STRINGS } from "@/constants/strings"\n`
      )
    }
  }
  
  fs.writeFileSync(filePath, newContent, 'utf8')
  console.log(`  ✅  ${path.basename(filePath)}: ${replacements.length} substituições`)
}

// ─── Atualiza strings.ts com as novas entradas misc ─────────────────────────
if (totalAdded > 0) {
  stringsContent = fs.readFileSync(STRINGS_FILE, 'utf8')

  // Reconstrói o bloco misc com todas as entradas acumuladas em miscMap
  let allMiscEntries = ''
  for (const [key, value] of miscMap) {
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    allMiscEntries += `    ${key}: "${escaped}",\n`
  }

  stringsContent = stringsContent.replace(
    /misc:\s*\{[^}]*\}/s,
    `misc: {\n${allMiscEntries}  }`
  )

  fs.writeFileSync(STRINGS_FILE, stringsContent, 'utf8')
  console.log(`\n📝  ${totalAdded} novas chaves adicionadas ao namespace misc em strings.ts`)
}

console.log(`\n🎉  Concluído! ${totalFixed} strings substituídas no total.`)
console.log('   Execute o ESLint novamente para verificar os resultados.')
