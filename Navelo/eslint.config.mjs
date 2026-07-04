import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // BLOCO 1 — Design System: regras de composição e tokens
  // Cobre: todo o projeto exceto base/ onde className e tags HTML são permitidos
  {
    files: ["**/src/**/*.{ts,tsx}"],
    ignores: [
      "**/components/store/base/**"
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        // 1. Prohibit className Usage
        {
          selector: "JSXAttribute[name.name='className'][value.type='Literal']:not([value.value=/scrollbar|py-20|py-25|z-\\[|grid\\.svg|ambient-light|blur|animate-|min-h-|overflow-hidden|shrink-0|font-mono|ml-auto|border-white\\/10|bg-center|mask-image|bg-transparent|border-0|w-4|h-4|w-5|h-5|w-3\\.5|h-3\\.5|w-full|h-full|active:scale-|outline-none|ring-0|pointer-events-none|bg-gradient-|from-|via-|to-|inset-|group|object-cover|object-contain|-translate-/])",
          message: "className is strictly prohibited outside of 'src/components/store/base/'. Use composition with base components instead."
        },
        // 2. Prohibit Margins
        {
          selector: "JSXAttribute[name.name=/^(margin|marginX|marginY|marginTop|marginBottom|marginLeft|marginRight|m|mx|my|mt|mb|ml|mr)$/]",
          message: "Manual margins are prohibited. Use <Stack gap={...}> or <Grid gap={...}> for spacing between elements."
        },
        // 3. Prohibit Style Props on non-base components
        {
          selector: "JSXOpeningElement[name.name!=/[a-z]/]:not(:matches([name.name='Box'], [name.name='Stack'], [name.name='Grid'], [name.name='Font'], [name.name='Button'], [name.name='Input'], [name.name='Icon'], [name.name='Badge'], [name.name='Table'], [name.name='Tabs'], [name.name='Switch'], [name.name='CustomSelect'], [name.name='Modal'], [name.name='Logo'], [name.name='Avatar'])) > JSXAttribute[name.name=/^(padding|paddingX|paddingY|width|height|minWidth|minHeight|rounded|bg|bgOpacity|hoverBg|hoverBgOpacity|color|border|borderColor|borderWidth|borderTop|borderBottom|borderLeft|borderRight|shadow|inset|top|right|bottom|left|scale|alignSelf|breakAll)$/]",
          message: "Style props (padding, bg, color, width, height, etc.) are only allowed in 'base' components. Non-base components must use semantic variants or composition."
        },
        // 4. Prohibit directional padding/margin in layouts
        {
          selector: "JSXAttribute[name.name=/^(paddingTop|paddingBottom|paddingLeft|paddingRight|px|py|pt|pb|pl|pr)$/]:not([value.type='JSXExpressionContainer']):not([value.value=/sidebar|sidebar-wide/])",
          message: "Directional padding (paddingLeft, paddingTop, etc.) is prohibited in layouts. Use uniform padding={5} or authorized paddingY/paddingX in base components only."
        },
        // 5. Strict Tokens Enforcement (Gaps e Paddings válidos)
        {
          selector: "JSXAttribute[name.name=/^(gap|padding|paddingX|paddingY)$/] Literal:not([raw=/^(12\\.5|12|5|2\\.5|1|0|'section'|'title-content')$/])",
          message: "Raw string or number literals for gap/padding must follow the Design System tokens (5, 12, 2.5, 1, 0, 'section', 'title-content')."
        },
        // 6. Prohibit inline style Attribute
        {
          selector: "JSXAttribute[name.name='style']",
          message: "Inline styles (style prop) are strictly prohibited outside of 'src/components/store/base/'. Use base design system components (Box, Stack, Grid) with standard props for layout and styling."
        },
        // 7. Prohibit primitive HTML tags outside base/
        {
          selector: "JSXOpeningElement[name.name=/^[a-z]/]",
          message: "Primitive HTML tags are strictly prohibited outside 'src/components/store/base/'. Replace with design system components: div/section/button -> Box, span/p/h1-h6 -> Font, img -> Avatar, etc."
        }
      ]
    }
  },

  // BLOCO 2 — page.tsx: só pode renderizar RegistryMain e delegar para Sections
  {
    files: ["**/app/**/page.tsx"],
    ignores: [
      "**/app/api/**",
      "**/app/page.tsx"
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/^(Box|Stack|Font|Grid|Icon|Button|Input|Badge|Avatar|Table|Tabs|Switch|CustomSelect|Modal|Logo)$/]",
          message: "Base components (Box, Stack, Font, etc) are prohibited directly in page.tsx. The page must only render RegistryMain and delegate content to *Section components."
        }
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/store/base/**", "../components/store/base/**"],
              message: "Base components cannot be imported in page.tsx. Delegate your layout to a Section component."
            }
          ]
        }
      ]
    }
  },

  // BLOCO 3 — Qualidade de código e complexidade
  {
    files: ["**/src/**/*.{ts,tsx}"],
    ignores: [
      "**/components/store/base/**"
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "complexity": ["warn", { max: 10 }],
      "max-lines-per-function": ["warn", { max: 80, skipBlankLines: true, skipComments: true, IIFEs: true }],
      "max-params": ["warn", { max: 4 }],
      "max-depth": ["warn", { max: 3 }],
      "no-useless-return": "warn",
      "no-else-return": ["warn", { allowElseIf: false }],
      "no-await-in-loop": "warn"
    }
  },

  // BLOCO 4 — Design System: proibições de elementos nativos globais (inclui base/)
  // Garante que <dialog> e popup nativos nunca sejam usados; base/Select.tsx é exceção documentada para <select>
  {
    files: ["**/src/**/*.{ts,tsx}"],
    ignores: [
      "**/components/store/base/CustomSelect.tsx",
      "**/components/store/intermediary/EmptyState.tsx",
      "**/components/store/sections/design-system/**"
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='dialog']",
          message: "Proibido: <dialog> nativo. Use <Modal> do Design System (src/components/store/base/Modal.tsx)."
        },
        {
          selector: "JSXOpeningElement[name.name='Select']",
          message: "Proibido: o componente <Select> (wrapper nativo) foi descontinuado. Use <CustomSelect> do Design System."
        },
        {
          selector: "JSXOpeningElement[name.name='Font'] > JSXAttribute[name.name='text'][value.type='Literal'][value.value=/\\b(vazio|vazia|nenhum|nenhuma|empty|sem itens|sem registros|sem cadastros)\\b/i]",
          message: "Proibido: Se você está criando um estado vazio (empty state), use o componente <EmptyState> do Design System (src/components/store/intermediary/EmptyState.tsx) para manter a padronização."
        }
      ],
      "no-restricted-globals": [
        "error",
        { name: "alert",   message: "Proibido: use <Modal> do Design System em vez de alert() nativo." },
        { name: "confirm", message: "Proibido: use <Modal> do Design System em vez de confirm() nativo." },
        { name: "prompt",  message: "Proibido: use <Modal> do Design System em vez de prompt() nativo." }
      ]
    }
  }
]);

export default eslintConfig;
