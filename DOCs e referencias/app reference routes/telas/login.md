# Tela de Login

**Arquivo:** `tela de login.png`

## Objetivo
Autenticar o usuário na plataforma e direcionar para o Dashboard correspondente ao nível de acesso do perfil.

## Hierarquia Visual
1. Container centralizado branco sobre fundo azul escuro.
2. Saudação em destaque ("Olá!").
3. Instrução secundária ("Escolha um usuário.").
4. Campo de seleção de usuário.
5. Campo de inserção de senha.
6. Links de recuperação/redefinição de senha.
7. Botão principal de ação ("Entrar").

## Seções
- **Formulário de Autenticação:** Box centralizado contendo os controles de entrada e submissão.

## Componentes
- **Dropdown/Select:** Componente para escolha do usuário do sistema.
- **Input Text (Password):** Campo de entrada de texto mascarado para a senha.
- **Button:** Botão de submissão do formulário.

## Campos
- **Selecione o Usuário:** Dropdown com a lista de usuários cadastrados (ex: "Administrador").
- **Senha:** Campo obrigatório identificado por asterisco (`* Senha`).

## Botões
- **Entrar:** Botão largo, azul escuro com texto em laranja, posicionado centralizado no rodapé do container.

## Navegação Identificável
- **Esquecer senha:** Link no canto inferior esquerdo para recuperação.
- **Redefinir senha:** Link no canto inferior direito para alteração de credenciais.

## Estados Visíveis
- **Placeholder/Valor Selecionado:** Dropdown exibe "Administrador".
- **Máscara de Senha:** Campo preenchido exibindo pontos no lugar dos caracteres originais.

## Observações
- O cabeçalho superior da janela mostra o nome do app ("PDV+ 19.1.1").

## Informações não identificáveis
- Nenhuma.
