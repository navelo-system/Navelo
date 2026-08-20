"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Icon } from "@/components/store/base/Icon"
import { Badge } from "@/components/store/base/Badge"
import { Plus, Edit2, Trash2, Printer, LayoutGrid, ChevronRight, Check } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { PrintStatusModal } from "@/components/store/sections/pdv/modals/PrintStatusModal"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { usePrintPoints, dal } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { UI_STRINGS } from "@/constants/strings"

export interface PrintPointItem {
  id: string
  name: string
  serverIp: string
  port: string
  enabled: boolean
  bobbinSize: string
  increaseFont: boolean
  columns: number
  kitchenMonitorEnabled: boolean
  linkingCode: string
}

export interface PontosImpressaoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onNavigate: (subView: string) => void
}

function PrintPointListCard({
  points,
  onEdit,
  onDelete,
}: {
  points: PrintPointItem[]
  onEdit: (p: PrintPointItem) => void
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.printPoints
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" w="full" overflow="hidden">
      <Stack gap={0} w="full">
        {points.map((point, idx) => (
          <React.Fragment key={point.id}>
            {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
            <Box padding={5} hoverBg="primary/10" w="full">
              <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
                <Stack direction="row" align="center" gap={5} flex="1" minW="0">
                  <Box w="w-10" h="h-10" bg="bg-brand-primary/10" radius="full" shrink="0">
                    <Stack w="full" h="full" align="center" justify="center">
                      <Font variant="body-bold" color="primary" text={point.name.charAt(0).toUpperCase()} />
                    </Stack>
                  </Box>
                  <Stack gap={1} flex="1" minW="0">
                    <Font variant="body-bold" text={point.name} align="left" />
                    <Font variant="description" text={`Servidor: ${point.serverIp}:${point.port}`} color="muted" align="left" />
                    {point.enabled && (
                      <Box display="block md:hidden" w="full">
                        <Stack direction="row" justify="start" gap={0} w="full">
                          <Badge variant="success" label={UI_STRINGS.settings.formasPagamento.enabledBadge} icon={Check} />
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Stack>

                <Stack direction="row" align="center" gap={5} justify="between" mobileJustify="end" w="w-full md:w-auto">
                  {point.enabled && (
                    <Box display="hidden md:block">
                      <Badge variant="success" label={UI_STRINGS.settings.formasPagamento.enabledBadge} icon={Check} />
                    </Box>
                  )}
                  <Stack direction="row" gap={2.5}>
                    <Button variant="primary-icon-xs" icon={Edit2} onClick={() => onEdit(point)} />
                    <Button
                      variant="danger-icon-xs-confirm"
                      confirmTitle={s.deletePointTitle}
                      confirmSubtitle={s.deletePointTitle}
                      confirmParagraph="Tem certeza que deseja excluir este ponto de impressão?"
                      onConfirm={() => onDelete(point.id)}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  )
}

function PrintPointIdentificationCard({
  formName,
  setFormName,
  onNavigate,
}: {
  formName: string
  setFormName: (v: string) => void
  onNavigate: (subView: string) => void
}) {
  const s = UI_STRINGS.printPoints
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={s.nameLabel} />
        <Input label={s.nameLabel} placeholder={s.namePlaceholder} value={formName} onChange={(e) => setFormName(e.target.value)} required />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box cursor="pointer" onClick={() => onNavigate("catalogo-produtos")} w="full">
          <Stack direction="row" align="center" justify="between" w="full">
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={LayoutGrid} size={20} color="primary" />
              <Stack gap={1}>
                <Font variant="body-bold" text={s.categoriesLabel} />
                <Font variant="description" text={s.selectedProductsDesc} color="muted" />
              </Stack>
            </Stack>
            <Icon icon={ChevronRight} size={16} color="muted" />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function PrintPointNetworkSettingsCard({
  formEnabled, setFormEnabled,
  formServerIp, setFormServerIp,
  formPort, setFormPort,
  formBobbinSize, setFormBobbinSize,
  formIncreaseFont, setFormIncreaseFont,
  formColumns, setFormColumns,
  onTestPrint,
}: {
  formEnabled: boolean; setFormEnabled: (v: boolean) => void
  formServerIp: string; setFormServerIp: (v: string) => void
  formPort: string; setFormPort: (v: string) => void
  formBobbinSize: string; setFormBobbinSize: (v: string) => void
  formIncreaseFont: boolean; setFormIncreaseFont: (v: boolean) => void
  formColumns: number; setFormColumns: (v: number) => void
  onTestPrint: () => void
}) {
  const s = UI_STRINGS.printPoints
  const p = UI_STRINGS.printers
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text={s.autoPrintToggle} />
          <Switch checked={formEnabled} onChange={(e) => setFormEnabled(e.target.checked)} />
        </Stack>

        {formEnabled && (
          <>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Grid cols={2} gap={5}>
              <Input label={p.ipAddressLabel} placeholder={p.ipAddressPlaceholder} value={formServerIp} onChange={(e) => setFormServerIp(e.target.value)} required />
              <Input label={p.portLabel} placeholder={p.portPlaceholder} value={formPort} onChange={(e) => setFormPort(e.target.value)} required />
            </Grid>
            <Font variant="description" text={s.ipPrinterDesc} color="muted" />

            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text={p.paperWidthLabel} />
              <CustomSelect value={formBobbinSize} onChange={setFormBobbinSize}>
                <CustomSelectItem value="80MM" text={p.width80mm} icon={Printer} />
                <CustomSelectItem value="58MM" text={p.width58mm} icon={Printer} />
              </CustomSelect>
            </Stack>

            <Stack direction="row" align="center" gap={2.5} w="full">
              <Checkbox checked={formIncreaseFont} onChange={(e) => setFormIncreaseFont(e.target.checked)} />
              <Font variant="body" text={p.increaseFontLabel} />
            </Stack>

            <Stack gap={2.5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body" text={p.columnsNumberLabel} />
                <Font variant="body-bold" text={formColumns.toString()} />
              </Stack>
              <Input type="range" min="20" max="60" value={formColumns} onChange={(e) => setFormColumns(parseInt(e.target.value, 10))} />
            </Stack>

            <Button type="button" variant="primary" label={p.testPrintButton} onClick={onTestPrint} fullWidth />
          </>
        )}
      </Stack>
    </Box>
  )
}

function PrintPointKitchenMonitorCard({
  formKitchenEnabled,
  setFormKitchenEnabled,
  formLinkingCode,
  setFormLinkingCode,
  onLink,
}: {
  formKitchenEnabled: boolean
  setFormKitchenEnabled: (v: boolean) => void
  formLinkingCode: string
  setFormLinkingCode: (v: string) => void
  onLink: () => void
}) {
  const s = UI_STRINGS.printPoints
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text={s.kitchenMonitorTitle} />
          <Switch checked={formKitchenEnabled} onChange={(e) => setFormKitchenEnabled(e.target.checked)} />
        </Stack>

        {formKitchenEnabled && (
          <>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Stack direction="row" align="end" gap={2.5} w="full">
              <Box flex="1">
                <Input label={s.linkingCodeLabel} placeholder={s.linkingCodePlaceholder} value={formLinkingCode} onChange={(e) => setFormLinkingCode(e.target.value)} />
              </Box>
              <Button type="button" variant="primary" label={s.linkButton} onClick={onLink} />
            </Stack>
            <Font variant="description" text={s.kitchenAppDesc} color="muted" />
          </>
        )}
      </Stack>
    </Box>
  )
}

function checkPrintPointDirty(
  editingPoint: PrintPointItem | null,
  curr: { name: string; serverIp: string; port: string; enabled: boolean }
): boolean {
  if (editingPoint) {
    return curr.name !== editingPoint.name ||
      curr.serverIp !== editingPoint.serverIp ||
      curr.port !== editingPoint.port ||
      curr.enabled !== editingPoint.enabled
  }
  return Boolean(curr.name.trim() || curr.serverIp.trim())
}

function usePrintPointForm(tenantId?: string) {
  const [editingPoint, setEditingPoint] = React.useState<PrintPointItem | null>(null)
  const [formName, setFormName] = React.useState("")
  const [formEnabled, setFormEnabled] = React.useState(true)
  const [formServerIp, setFormServerIp] = React.useState("")
  const [formPort, setFormPort] = React.useState("3030")
  const [formBobbinSize, setFormBobbinSize] = React.useState("80MM")
  const [formIncreaseFont, setFormIncreaseFont] = React.useState(false)
  const [formColumns, setFormColumns] = React.useState(48)
  const [formKitchenEnabled, setFormKitchenEnabled] = React.useState(false)
  const [formLinkingCode, setFormLinkingCode] = React.useState("")

  const startCreate = () => {
    setEditingPoint(null); setFormName(""); setFormEnabled(true); setFormServerIp("")
    setFormPort("3030"); setFormBobbinSize("80MM"); setFormIncreaseFont(false); setFormColumns(48)
    setFormKitchenEnabled(false); setFormLinkingCode("")
  }

  const startEdit = (point: PrintPointItem) => {
    setEditingPoint(point); setFormName(point.name); setFormEnabled(point.enabled)
    setFormServerIp(point.serverIp); setFormPort(point.port); setFormBobbinSize(point.bobbinSize)
    setFormIncreaseFont(point.increaseFont); setFormColumns(point.columns)
    setFormKitchenEnabled(point.kitchenMonitorEnabled); setFormLinkingCode(point.linkingCode)
  }

  const save = async () => {
    if (!formName.trim()) return
    const pointId = editingPoint ? editingPoint.id : `pt-${Date.now()}`
    const payload = {
      id: pointId, name: formName, serverIp: formServerIp, port: formPort, enabled: formEnabled,
      bobbinSize: formBobbinSize, increaseFont: formIncreaseFont, columns: formColumns,
      kitchenMonitorEnabled: formKitchenEnabled, linkingCode: formLinkingCode,
      company_id: tenantId || "demo-tenant", tenant_id: tenantId || "demo-tenant"
    }
    if (editingPoint) await dal.printPoints.update(payload)
    else await dal.printPoints.create(payload)
    setEditingPoint(null)
  }

  const isDirty = checkPrintPointDirty(editingPoint, {
    name: formName, serverIp: formServerIp, port: formPort, enabled: formEnabled,
  })

  return {
    editingPoint, setEditingPoint, formName, setFormName, formEnabled, setFormEnabled,
    formServerIp, setFormServerIp, formPort, setFormPort, formBobbinSize, setFormBobbinSize,
    formIncreaseFont, setFormIncreaseFont, formColumns, setFormColumns,
    formKitchenEnabled, setFormKitchenEnabled, formLinkingCode, setFormLinkingCode,
    startCreate, startEdit, save, isDirty,
  }
}

function PrintPointFormView({
  form,
  tenantId,
  onNavigate,
  onCancel,
  setModalMsg,
}: {
  form: ReturnType<typeof usePrintPointForm>
  tenantId?: string
  onNavigate: (subView: string) => void
  onCancel: () => void
  setModalMsg: (msg: string | null) => void
}) {
  const s = UI_STRINGS.printPoints
  return (
    <Box as="form" onSubmit={async (e) => { e.preventDefault(); await form.save(); onCancel() }} w="full">
      <Stack gap={5} w="full">
        <PrintPointIdentificationCard formName={form.formName} setFormName={form.setFormName} onNavigate={onNavigate} />
        <PrintPointNetworkSettingsCard
          formEnabled={form.formEnabled} setFormEnabled={form.setFormEnabled}
          formServerIp={form.formServerIp} setFormServerIp={form.setFormServerIp}
          formPort={form.formPort} setFormPort={form.setFormPort}
          formBobbinSize={form.formBobbinSize} setFormBobbinSize={form.setFormBobbinSize}
          formIncreaseFont={form.formIncreaseFont} setFormIncreaseFont={form.setFormIncreaseFont}
          formColumns={form.formColumns} setFormColumns={form.setFormColumns}
          onTestPrint={() => setModalMsg("Imprimindo teste...")}
        />
        <PrintPointKitchenMonitorCard
          formKitchenEnabled={form.formKitchenEnabled} setFormKitchenEnabled={form.setFormKitchenEnabled}
          formLinkingCode={form.formLinkingCode} setFormLinkingCode={form.setFormLinkingCode}
          onLink={() => setModalMsg("Código de vinculação enviado!")}
        />
        <FormActions
          confirmLabel={form.editingPoint ? UI_STRINGS.pdv.cart.saveChangesButton : s.savePointTitle}
          onConfirm={() => { }} onCancel={onCancel} isSubmit
          leftAction={form.editingPoint ? (
            <Button
              type="button"
              variant="outline"
              label={s.deletePointTitle}
              icon={Trash2}
              onClick={async () => {
                if (form.editingPoint) {
                  await dal.printPoints.delete(form.editingPoint.id, tenantId)
                  onCancel()
                }
              }}
            />
          ) : undefined}
        />
      </Stack>
    </Box>
  )
}

function PrintPointListView({
  filtered, onNewPoint, onEdit, onDelete,
}: {
  filtered: PrintPointItem[]
  onNewPoint: () => void
  onEdit: (point: PrintPointItem) => void
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.printPoints
  return (
    <Stack gap={5} w="full">
      <Stack direction="row" align="center" justify="end" w="full">
        <Button variant="primary" label={s.newPointTitle} icon={Plus} onClick={onNewPoint} />
      </Stack>
      <PrintPointListCard
        points={filtered}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Stack>
  )
}

interface PrintPointHeaderSyncOpts {
  mode: "list" | "form"
  editingPoint: PrintPointItem | null
  searchQuery: string
  setSearchQuery: (q: string) => void
  handleBack: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function usePrintPointHeaderSync(opts: PrintPointHeaderSyncOpts) {
  const {
    mode, editingPoint, searchQuery, setSearchQuery, handleBack,
    setCustomBack, setCustomTitle, setCustomActions,
  } = opts
  const s = UI_STRINGS.printPoints

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingPoint ? s.editPointTitle : s.newPointTitle) : s.title)
    if (mode === "list") {
      setCustomActions?.(
        <MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={s.searchPlaceholder} />
      )
    } else setCustomActions?.(null)
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [mode, editingPoint, searchQuery, setSearchQuery, setCustomBack, setCustomTitle, setCustomActions, handleBack, s])
}

export const PontosImpressaoSection: React.FC<PontosImpressaoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onNavigate,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbPoints = usePrintPoints(tenantId)
  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [modalMsg, setModalMsg] = React.useState<string | null>(null)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const form = usePrintPointForm(tenantId)

  const points: PrintPointItem[] = React.useMemo(() => {
    if (dbPoints && dbPoints.length > 0) {
      return dbPoints.map((p) => ({
        id: p.id, name: p.name, serverIp: p.serverIp || "", port: p.port || "3030",
        enabled: p.enabled ?? true, bobbinSize: p.bobbinSize || "80MM",
        increaseFont: p.increaseFont ?? false, columns: p.columns ?? 48,
        kitchenMonitorEnabled: p.kitchenMonitorEnabled ?? false, linkingCode: p.linkingCode || ""
      }))
    }
    return []
  }, [dbPoints])

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      if (form.isDirty) {
        setIsDiscardModalOpen(true)
      } else {
        setMode("list")
        form.setEditingPoint(null)
      }
    } else {
      onCancel()
    }
  }, [mode, onCancel, form])

  usePrintPointHeaderSync({
    mode, editingPoint: form.editingPoint, searchQuery, setSearchQuery, handleBack,
    setCustomBack, setCustomTitle, setCustomActions,
  })

  const filtered = points.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Box position="relative" w="full">
      {mode === "list" ? (
        <PrintPointListView
          filtered={filtered}
          onNewPoint={() => { form.startCreate(); setMode("form") }}
          onEdit={(point) => { form.startEdit(point); setMode("form") }}
          onDelete={(id) => dal.printPoints.delete(id, tenantId)}
        />
      ) : (
        <PrintPointFormView
          form={form}
          tenantId={tenantId}
          onNavigate={onNavigate}
          onCancel={handleBack}
          setModalMsg={setModalMsg}
        />
      )}
      <PrintStatusModal isOpen={!!modalMsg} onClose={() => setModalMsg(null)} message={modalMsg || ""} />
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          setMode("list")
          form.setEditingPoint(null)
        }}
      />
    </Box>
  )
}
