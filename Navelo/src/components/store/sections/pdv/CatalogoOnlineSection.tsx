"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Switch } from "../../base/Switch"
import { Icon } from "../../base/Icon"
import { Badge } from "../../base/Badge"
import {
  Globe,
  ChevronRight,
  Copy,
  ExternalLink,
  LayoutGrid,
  Clock,
  CreditCard,
  MessageSquare,
  Truck,
  Settings,
  Check
} from "lucide-react"

export interface CatalogoOnlineSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  onNavigate: (subView: string) => void
}

const CATALOG_URL = "https://basenavelo.comercio.net.br"

export const CatalogoOnlineSection: React.FC<CatalogoOnlineSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  onNavigate
}) => {
  const [enabled, setEnabled] = React.useState(true)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Catálogo Online")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  const handleCopy = () => {
    navigator.clipboard.writeText(CATALOG_URL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleOpenUrl = () => {
    window.open(CATALOG_URL, "_blank")
  }

  return (
    <Box
      bg="bg-white"
      border={true}
      borderColor="border-border"
      radius="default"
      overflow="hidden"
      w="full"
    >
      {/* Linha: Habilitar */}
      <Box padding={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack gap={1}>
            <Font variant="body-bold" text="Habilitar" />
            <Font
              variant="description"
              text="Você terá uma página na internet com os seus produtos e com a cara da sua loja."
              color="muted"
            />
          </Stack>
          <Switch
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Linha: URL */}
      <Box padding={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Globe} size={16} color="primary" />
            <Font
              variant="description"
              text={CATALOG_URL}
              color={enabled ? "primary" : "muted"}
            />
          </Stack>
          <Stack direction="row" align="center" gap={2.5}>
            <Box
              cursor="pointer"
              onClick={handleOpenUrl}
              title="Abrir no navegador"
            >
              <Icon icon={ExternalLink} size={16} color={enabled ? "primary" : "muted"} />
            </Box>
            <Box
              cursor="pointer"
              onClick={handleCopy}
              title={copied ? "Copiado!" : "Copiar URL"}
            >
              <Icon icon={Copy} size={16} color={enabled ? "primary" : "muted"} />
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Linha: Identificação */}
      <Box
        padding={5}
        cursor="pointer"
        hoverBg="primary/10"
        onClick={() => onNavigate("identificacao")}
        w="full"
      >
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <Icon icon={LayoutGrid} size={20} color="primary" />
            <Stack gap={1}>
              <Font variant="body-bold" text="Identificação" />
              <Font variant="description" text="basenavelo" color="muted" />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Linha: Produtos */}
      <Box
        padding={5}
        cursor="pointer"
        hoverBg="primary/10"
        onClick={() => onNavigate("catalogo-produtos")}
        w="full"
      >
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <Icon icon={LayoutGrid} size={20} color="primary" />
            <Stack gap={1}>
              <Font variant="body-bold" text="Produtos" />
              <Font variant="description" text="52 produtos selecionados" color="muted" />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Linha: Horário de Atendimento */}
      <Box
        padding={5}
        cursor="pointer"
        hoverBg="primary/10"
        onClick={() => onNavigate("horario-atendimento")}
        w="full"
      >
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <Icon icon={Clock} size={20} color="primary" />
            <Stack gap={1}>
              <Font variant="body-bold" text="Horário de atendimento" />
              <Font variant="description" text="Todos os dias" color="muted" />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Linha: Formas de Pagamento */}
      <Box
        padding={5}
        cursor="pointer"
        hoverBg="primary/10"
        onClick={() => onNavigate("formas-pagamento")}
        w="full"
      >
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <Icon icon={CreditCard} size={20} color="primary" />
            <Font variant="body-bold" text="Formas de pagamento" />
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Linha: WhatsApp */}
      <Box
        padding={5}
        cursor="pointer"
        hoverBg="primary/10"
        onClick={() => onNavigate("whatsapp")}
        w="full"
      >
        <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
          <Stack direction="row" align="center" gap={5} flex="1">
            <Icon icon={MessageSquare} size={20} color="primary" />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="WhatsApp" align="left" />
              <Font
                variant="description"
                text="Ative esta opção para enviar notificações automáticas para os clientes."
                color="muted"
                align="left"
              />
            </Stack>
          </Stack>
          <Stack direction="row" align="center" justify="end" mobileJustify="end" gap={2.5} className="w-full md:w-auto">
            <Badge variant="success" label="habilitado" icon={Check} />
            <Icon icon={ChevronRight} size={16} color="muted" />
          </Stack>
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Linha: Opções de Entrega */}
      <Box
        padding={5}
        cursor="pointer"
        hoverBg="primary/10"
        onClick={() => onNavigate("opcao-entrega")}
        w="full"
      >
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <Icon icon={Truck} size={20} color="primary" />
            <Font variant="body-bold" text="Opções de entrega" />
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Linha: Opções de Pedido */}
      <Box
        padding={5}
        cursor="pointer"
        hoverBg="primary/10"
        onClick={() => onNavigate("opcao-pedido")}
        w="full"
      >
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <Icon icon={Settings} size={20} color="primary" />
            <Font variant="body-bold" text="Opções de pedido" />
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
    </Box>
  )
}
