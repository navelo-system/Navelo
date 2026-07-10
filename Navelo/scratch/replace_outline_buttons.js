const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/Marcos/Desktop/pra usar dps/5 - Trabalho/PDV/navelo/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let hasChanges = false;

  // Regex para encontrar Button com variant="outline..."
  // Substitui variant="outline" por variant="secondary"
  // Substitui variant="outline-lg" por variant="secondary-lg"
  // Substitui variant="outline-pill-icon" por variant="secondary-pill-icon"
  // Substitui variant="outline-pill-icon-xs" por variant="secondary-pill-icon-xs"
  
  // Vamos usar uma abordagem de substituição direta baseada nas strings exatas de variantes de botões
  const replacements = [
    { from: /variant="outline-pill-icon-xs"/g, to: 'variant="secondary-pill-icon-xs"' },
    { from: /variant="outline-pill-icon"/g, to: 'variant="secondary-pill-icon"' },
    { from: /variant="outline-lg"/g, to: 'variant="secondary-lg"' },
    { from: /variant="outline"/g, to: 'variant="secondary"' }
  ];

  // Para garantir que só alteramos botões (Button ou imports de Button),
  // e não badges, a substituição da variant="outline" simples pode ser mais específica.
  // Mas no grep nós vimos que os únicos Badges eram em:
  // - UsuariosSection.tsx (admin) L179, L188
  // - TenantsSection.tsx (admin) L143, L157
  // - ClientesSection.tsx (admin) L187, L204
  // Fora esses Badges específicos, todos os outros locais com variant="outline" são botões!
  // Portanto, para ser 100% limpo, podemos fazer a substituição em todos os arquivos EXCETO se a tag for Badge,
  // ou simplesmente processar a tag Button usando regex.
  
  // Regex que captura <Button ... variant="outline" ... /> e afins:
  // Como o JSX pode ter múltiplas linhas, vamos aplicar uma regex que identifique a tag <Button ... />
  let newContent = content;
  
  // Substituições simples de variants de botões exatas:
  // 1. outline-pill-icon-xs -> secondary-pill-icon-xs
  newContent = newContent.replace(/<Button([^>]+)variant="outline-pill-icon-xs"/g, '<Button$1variant="secondary-pill-icon-xs"');
  // 2. outline-pill-icon -> secondary-pill-icon
  newContent = newContent.replace(/<Button([^>]+)variant="outline-pill-icon"/g, '<Button$1variant="secondary-pill-icon"');
  // 3. outline-lg -> secondary-lg
  newContent = newContent.replace(/<Button([^>]+)variant="outline-lg"/g, '<Button$1variant="secondary-lg"');
  // 4. outline -> secondary
  newContent = newContent.replace(/<Button([^>]+)variant="outline"/g, '<Button$1variant="secondary"');

  // Adicionalmente, em alguns arquivos como PdvCheckoutPayment.tsx a tag Button é escrita em múltiplas linhas:
  // <Button
  //   variant="outline"
  //   label="Dinheiro (Troco)"
  //   ...
  // />
  // Então precisamos de uma regex que capture variant="outline" dentro de <Button e de fechar a tag />
  // Para simplificar e cobrir 100% de segurança multilinhas:
  newContent = newContent.replace(/(<Button[\s\S]*?variant=")outline-pill-icon-xs"/g, '$1secondary-pill-icon-xs"');
  newContent = newContent.replace(/(<Button[\s\S]*?variant=")outline-pill-icon"/g, '$1secondary-pill-icon"');
  newContent = newContent.replace(/(<Button[\s\S]*?variant=")outline-lg"/g, '$1secondary-lg"');
  newContent = newContent.replace(/(<Button[\s\S]*?variant=")outline"/g, '$1secondary"');

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated: ${path.basename(file)}`);
  }
});
