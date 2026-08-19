---
name: correcao-arquitetura
description: >
  Protocolo de correção de arquitetura do design-system do Navelo. Executa
  um ciclo completo e exaustivo de verificação e correção combinando ESLint,
  auditoria de camadas por arquivo com geração de logs em Markdown, fix-audit,
  análise contextual de posicionamento de componentes, refatoração de imports
  e limpeza do projeto.
---

# Protocolo Correção de Arquitetura

Este documento define o pipeline exaustivo de governança visual e arquitetural. Ao acionar esta skill, você deve seguir estritamente as fases abaixo, em ordem, sem pular nenhum passo.

---

## Fluxo Operacional Procedimental

### FASE 1 — Auditoria Inicial via ESLint
1. Execute o comando de lint do projeto (`npm run lint` ou `npx eslint src`).
2. Colete todos os erros e avisos reportados.
3. Crie uma lista estruturada de pendências contendo:
   - Arquivo afetado
   - Linha/Coluna
   - Descrição exata do erro/aviso
   - Regra do ESLint infringida

### FASE 2 — Correção de Erros de Lint (1 a 1)
1. Para cada item da lista criada na **FASE 1**, aplique a correção cirúrgica correspondente.
2. Não tente corrigir todos de uma vez; execute as correções uma por uma, validando individualmente.
3. Ao concluir, execute `npm run lint` novamente para certificar-se de que a lista está 100% zerada antes de prosseguir.

### FASE 3 — Mapeamento de Componentes por Camada
1. Liste todos os arquivos `.tsx` presentes no diretório `src/components/store/`.
2. Classifique e divida os arquivos mapeados em quatro listas distintas de acordo com a pasta de origem:
   - **Camada Sections:** Arquivos sob `src/components/store/sections/`
   - **Camada Advanced:** Arquivos sob `src/components/store/advanced/`
   - **Camada Intermediary:** Arquivos sob `src/components/store/intermediary/`
   - **Camada Base:** Arquivos sob `src/components/store/base/`

### FASE 4 — Auditoria de Camada Item a Item
1. Inicie um loop sequencial por todos os arquivos listados na **FASE 3**.
2. Para cada arquivo individualmente:
   - Execute a análise de conformidade de design-system baseando-se nas regras da skill `audit-layers` (ex: verificar uso ilegal de `className` fora de base, margens proibidas, tags HTML primitivas, largura/altura fixas).
   - O resultado desta auditoria pontual para cada arquivo **deve ser salvo em um arquivo Markdown específico** dentro de `.asdd/state/audit-reports/<camada>_<nome_do_componente>.md` como uma checklist de correções pendentes para aquele arquivo.
   - Marque o progresso de auditoria do arquivo atual como concluído na lista global antes de mover para o próximo arquivo.

### FASE 5 — Loop de Correção de Camadas (`fix-audit`)
1. Após a geração de todos os relatórios Markdown individuais na **FASE 4**, inicie o loop de correção.
2. Para cada relatório de auditoria salvo em `.asdd/state/audit-reports/`:
   - Leia as pendências listadas.
   - Aplique as correções ponto a ponto utilizando a metodologia da skill `fix-audit` (ex: migrar estilos inline para Box props, substituir `className` por composição de base components, remover margens manuais).
   - Garanta zero drift visual após as alterações.
   - Remova ou marque o relatório `.md` como resolvido após sanar todas as violações do arquivo correspondente.

### FASE 6 — Análise de Posicionamento Conceitual
1. Execute a skill `component-placement-audit` em cada arquivo da lista para avaliar se a responsabilidade real do componente condiz com sua camada conceitual (por exemplo, se um componente em `intermediary` possui lógicas de negócio avançadas ou se um componente em `advanced` é apenas decorativo).
2. Se algum componente for identificado como posicionado de forma incorreta:
   - Mova o arquivo para a pasta da camada recomendada (`base`, `intermediary`, `advanced` ou `sections`).
   - Atualize todos os imports afetados em todo o codebase.
   - Certifique-se de que os barrel exports (`index.ts`) foram atualizados.

### FASE 7 — Limpeza Geral do Projeto
1. Execute rotinas para identificar imports mortos ou não utilizados no código.
2. Remova variáveis e imports obsoletos.
3. Identifique componentes órfãos (que não são importados em nenhum lugar do codebase) e verifique com o desenvolvedor se podem ser descartados de forma segura.
4. Execute uma rodada final de `npm run lint` para garantir que o projeto finalizou em um estado imaculado de conformidade.
