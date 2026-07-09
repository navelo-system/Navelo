import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Form } from "@/src/components/store/advanced/Form"
import { Input } from "@/components/store/base/Input"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Keyboard, Mail, Lock, Search, Phone, Calendar, Image as ImageIcon, ShoppingCart, Package, QrCode, Coins, CreditCard, Wallet } from "lucide-react"

export const InputsSection: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = React.useState("")

  return (
    <RegistrySection
      title="Inputs & Forms"
      description="Sistema consolidado de campos de formulário e grids inteligentes."
      icon={Keyboard}
    >
      <Stack gap={5}>
        <Box padding={5} bg="bg-surface" radius="default">
          <Stack gap={5}>
            <Font variant="h3" text="Demonstração de Tipos (Input)" />
            <Form columns={2}>
              <Input label="Text Genérico" placeholder="Ex: João da Silva" />
              <Input label="E-mail" type="email" placeholder="contato@exemplo.com" icon={Mail} />
              <Input label="Senha" type="password" placeholder="••••••••" icon={Lock} />
              <Input label="Número (Quantidades)" type="number" placeholder="0" />
              <Input label="Busca" type="search" placeholder="Buscar produtos..." icon={Search} />
              <Input label="CPF" variant="cpf" placeholder="000.000.000-00" />
              <Input label="CNPJ" variant="cnpj" placeholder="00.000.000/0000-00" />
              <Input label="Telefone" variant="phone" placeholder="(11) 90000-0000" icon={Phone} />
              <Input label="Data" variant="date" icon={Calendar} />
              <Input variant="image-upload" label="Logotipo da Empresa" placeholder="Clique ou arraste a imagem aqui" icon={ImageIcon} />
            </Form>
          </Stack>
        </Box>

        <Box padding={5} bg="bg-surface" radius="default">
          <Form label="Cadastro de Cliente (Form Inteligente)" description="Exemplo de 2 colunas com número ímpar de campos. O último ocupa 100% da largura." columns={2}>
            <Input label="Nome Completo" placeholder="Ex: Maria Souza" />
            <Input label="CPF" variant="cpf" placeholder="000.000.000-00" />
            <Input label="E-mail" variant="email" placeholder="maria@exemplo.com" icon={Mail} />
            <Input label="Celular" variant="phone" placeholder="(11) 98888-8888" icon={Phone} />
            <Input label="Observações Adicionais" placeholder="Descreva particularidades do cliente..." />
          </Form>
        </Box>

        {/* CustomSelect Showcase */}
        <Box padding={5} bg="bg-surface" radius="default">
          <Stack gap={5}>
            <Font variant="h3" text="Custom Select Dropdown" />
            <Font variant="description" text="Dropdown totalmente customizado (não nativo) com animação de chevron e seleção visual de item ativo." />
            <CustomSelect
              value={selectedPayment}
              onChange={setSelectedPayment}
              placeholder="Selecione a forma de pagamento..."
            >
              <CustomSelectItem value="pix" text="PIX" icon={QrCode} />
              <CustomSelectItem value="dinheiro" text="Dinheiro" icon={Coins} />
              <CustomSelectItem value="debito" text="Cartão de Débito" icon={CreditCard} />
              <CustomSelectItem value="credito" text="Cartão de Crédito" icon={CreditCard} />
              <CustomSelectItem value="vale" text="Vale Alimentação" icon={Wallet} />
            </CustomSelect>
          </Stack>
        </Box>

        {/* EmptyState Showcase */}
        <Box padding={5} bg="bg-surface" radius="default">
          <Stack gap={5}>
            {/* eslint-disable-next-line no-restricted-syntax */}
            <Font variant="h3" text="Empty State" />
            <Font variant="description" text="Componente de estado sem dados reutilizável. Recebe ícone, título e subtítulo como props." />
            <Stack gap={5}>
              <EmptyState
                icon={ShoppingCart}
                title="Carrinho vazio"
                subtitle="Adicione produtos ao carrinho para iniciar uma venda."
              />
              <EmptyState
                icon={Package}
                title="Nenhum produto encontrado"
                subtitle="Tente ajustar os filtros ou buscar por outro termo."
              />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </RegistrySection>
  )
}

