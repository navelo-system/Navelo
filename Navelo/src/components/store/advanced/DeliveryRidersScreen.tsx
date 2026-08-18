"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Switch } from "@/components/store/base/Switch"
import { Avatar } from "@/components/store/base/Avatar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Trash2, Bike, Check } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useTenant } from "@/lib/context/TenantContext"
import { useRiders, dal, Rider } from "@/lib/dal"
import { UI_STRINGS } from "@/constants/strings"

export interface DeliveryRidersScreenProps {
  onBack: () => void
  onSelectRider?: (rider: Rider) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

export const DeliveryRidersScreen: React.FC<DeliveryRidersScreenProps> = ({
  onBack,
  onSelectRider,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const d = UI_STRINGS.delivery
  const cust = UI_STRINGS.customers

  const dbRiders = useRiders(tenantId)
  const ridersList = React.useMemo(() => (Array.isArray(dbRiders) ? dbRiders : []), [dbRiders])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingRider, setEditingRider] = React.useState<Rider | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states (Print 3)
  const [name, setName] = React.useState("")
  const [document, setDocument] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [conectaEnabled, setConectaEnabled] = React.useState(false)
  const [conectaCode, setConectaCode] = React.useState("")

  const formRef = React.useRef<HTMLFormElement>(null)

  // Refs estáveis para callbacks do Header para evitar loops de render
  const onBackRef = React.useRef(onBack)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onBackRef.current = onBack
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
  })

  // Cleanup ao desmontar a tela
  React.useEffect(() => {
    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  }, [])

  // Atualização do cabeçalho sem disparar loops infinitos
  React.useEffect(() => {
    if (mode === "form") {
      setCustomBackRef.current?.(() => () => setMode("list"))
      setCustomTitleRef.current?.(editingRider ? d.editRiderTitle : d.newRiderTitle)
      setCustomActionsRef.current?.(null)
    } else {
      setCustomBackRef.current?.(() => () => onBackRef.current?.())
      setCustomTitleRef.current?.(d.ridersTitle)
      setCustomActionsRef.current?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder={d.searchRiderPlaceholder}
        >
          <Box />
        </MobileHeaderSearch>
      )
    }
  }, [mode, searchQuery, editingRider, d])

  const handleCreateNew = () => {
    setEditingRider(null)
    setName("")
    setDocument("")
    setPhone("")
    setConectaEnabled(false)
    setConectaCode("")
    setMode("form")
  }

  const handleEdit = (rider: Rider) => {
    setEditingRider(rider)
    setName(rider.name || "")
    setDocument(rider.document || "")
    setPhone(rider.phone || "")
    setConectaEnabled(!!rider.conecta_enabled)
    setConectaCode(rider.conecta_code || "")
    setMode("form")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const riderId = editingRider ? editingRider.id : `rider-${Date.now()}`

    const payload: Rider = {
      id: riderId,
      company_id: tenantId,
      tenant_id: tenantId,
      name: name.trim(),
      document: document.trim(),
      phone: phone.trim(),
      conecta_enabled: conectaEnabled,
      conecta_code: conectaCode.trim(),
      active: true,
    }

    try {
      if (editingRider) {
        await dal.riders.update(payload)
      } else {
        await dal.riders.create(payload)
      }
      if (onSelectRider) {
        onSelectRider(payload)
      }
      setMode("list")
    } catch (err) {
      console.error("Erro ao salvar entregador:", err)
    }
  }

  const filteredRiders = React.useMemo(() => {
    if (!searchQuery.trim()) return ridersList
    const q = searchQuery.toLowerCase()
    return ridersList.filter((r) => r.name.toLowerCase().includes(q))
  }, [ridersList, searchQuery])

  if (mode === "form") {
    return (
      <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full" padding={0}>
        <Box as="form" id="rider-form" ref={formRef} onSubmit={handleSubmit} w="full">
          <Stack gap={5} w="full">
            {/* CARD 1: Dados Pessoais (Print 3) */}
            <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border" w="full">
              <Stack gap={5} w="full">
                <Font variant="body-bold" text={cust.personalDataTitle} />
                <Stack gap={2.5} w="full">
                  <Input
                    placeholder={d.riderNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    mask="cpf-cnpj"
                    placeholder={d.riderDocumentPlaceholder}
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                  />
                  <Input
                    mask="phone"
                    placeholder={cust.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Stack>
              </Stack>
            </Box>

            {/* CARD 2: Conecta Entregador (Print 3) */}
            <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border" w="full">
              <Stack gap={5} w="full">
                <Stack direction="row" align="center" gap={2.5} w="full">
                  <Switch
                    checked={conectaEnabled}
                    onChange={(e) => setConectaEnabled(e.target.checked)}
                  />
                  <Font variant="body-sm-medium" text={d.enableConectaToggle} />
                </Stack>

                <Stack gap={2.5} w="full">
                  <Stack direction="row" align="center" gap={2.5} w="full">
                    <Box flex="1">
                      <Input
                        placeholder={d.conectaCodePlaceholder}
                        value={conectaCode}
                        onChange={(e) => setConectaCode(e.target.value)}
                      />
                    </Box>
                    <Button
                      variant="secondary-icon"
                      icon={Check}
                      title={d.linkRiderTitle}
                      type="button"
                      onClick={() => {
                        if (conectaCode.trim()) {
                          setConectaEnabled(true)
                        }
                      }}
                    />
                  </Stack>
                  <Font
                    variant="auxiliary"
                    color="muted"
                    text={d.conectaCodeHelpText}
                  />
                </Stack>
              </Stack>
            </Box>

            <Box paddingY={2.5} w="full">
              <Stack direction="row" gap={2.5} w="full">
                {editingRider && (
                  <Button
                    type="button"
                    variant="danger-pill-icon"
                    icon={Trash2}
                    onClick={async () => {
                      await dal.riders.delete(editingRider.id, tenantId)
                      setMode("list")
                      setEditingRider(null)
                    }}
                    title={d.deleteRiderTitle}
                  />
                )}
                <Box flex="1">
                  <Button
                    variant="primary"
                    label={d.saveRiderButton}
                    type="submit"
                    fullWidth={true}
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    )
  }

  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full" padding={0} position="relative">
      <Stack gap={5} w="full">
        {filteredRiders.length === 0 ? (
          <EmptyState
            icon={Bike}
            title={d.emptyRidersTitle}
            subtitle={d.emptyRidersSubtitle}
          />
        ) : (
          <Box display="flex" direction="col" w="full">
            {filteredRiders.map((rider, idx) => (
              <Box key={rider.id}>
                <Box
                  w="full"
                  paddingY={2.5}
                  paddingX={2.5}
                  radius="none"
                  hoverBg="primary/10"
                  cursor="pointer"
                  onClick={() => {
                    if (onSelectRider) {
                      onSelectRider(rider)
                    } else {
                      handleEdit(rider)
                    }
                  }}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                      <Avatar fallback={rider.name ? rider.name.charAt(0).toUpperCase() : "E"} />
                      <Stack gap={0} align="start" flex="1" minW="0">
                        <Font variant="body" text={rider.name} />
                        {(rider.phone || rider.document) && (
                          <Font
                            variant="auxiliary"
                            color="muted"
                            truncate={true}
                            text={rider.phone || rider.document || ""}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
                {idx < filteredRiders.length - 1 && (
                  <Box borderBottom={true} borderColor="border-border" w="full" />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Stack>

      {/* Botão FAB fixo no canto inferior direito para adicionar novo entregador */}
      <Box position="fixed" bottom="24px" right="24px" zIndex="30">
        <Button
          variant="secondary-pill-icon"
          icon={Plus}
          title={d.newRiderTitle}
          onClick={handleCreateNew}
        />
      </Box>
    </Box>
  )
}
