"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { Warning } from "@/components/store/base/Warning"
import { Input } from "@/components/store/base/Input"
import { Radio } from "@/components/store/base/Radio"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import {
  Laptop,
  Server,
  ChevronRight,
  CheckCircle,
  Cloud,
  Monitor,
  Check,
  Wifi,
  Search,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react"
import { UI_STRINGS, formatString } from "@/constants/strings"
import { useSyncStatus } from "@/lib/dal/hooks"
import {
  DeviceSyncSettings,
  SyncServerEnvironment,
  formatSyncDateTime,
  loadDeviceSyncSettings,
  saveDeviceSyncSettings,
  testLocalServerConnection,
} from "@/lib/sync/deviceSyncSettings"
import { getActiveLanHubBaseUrl, LAN_HUB_ACTIVE_EVENT, scanSubnetForHub, discoverLocalLanIps } from "@/lib/sync/lanDiscovery"

export interface CompanySyncFormProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

type SyncView = "main" | "identificacao" | "ambiente"

function useSyncChrome({
  sectionTitle,
  handleBack,
  handleSave,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}: {
  sectionTitle: string
  handleBack: () => void
  handleSave: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}) {
  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)
  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  })

  React.useEffect(() => {
    setCustomTitle?.(sectionTitle)
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        title={UI_STRINGS.common.save}
        onClick={() => handleSaveRef.current()}
      />
    )
    return () => {
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, sectionTitle])
}

function SyncSettingsCard({
  isEnabled,
  onToggle,
  deviceName,
  environmentLabel,
  onOpenIdentification,
  onOpenEnvironment,
}: {
  isEnabled: boolean
  onToggle: (checked: boolean) => void
  deviceName: string
  environmentLabel: string
  onOpenIdentification: () => void
  onOpenEnvironment: () => void
}) {
  const cs = UI_STRINGS.companySync
  return (
    <Box bg="bg-white" border={true} borderColor="border-border" radius="default" padding={0} w="full" overflow="hidden">
      <Stack gap={0} w="full">
        <Box padding={5}>
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1}>
              <Font variant="body-bold" text={cs.enableTitle} />
              <Font variant="description" text={cs.enableDesc} />
            </Stack>
            <Switch checked={isEnabled} onChange={(e) => onToggle(e.target.checked)} />
          </Stack>
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={5} cursor="pointer" hoverBg="secondary/10" onClick={onOpenIdentification}>
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack direction="row" align="center" gap={5}>
              <Icon icon={Laptop} variant="circular-secondary" />
              <Stack gap={1}>
                <Font variant="body-bold" text={cs.identificationTitle} />
                <Font variant="description" text={deviceName} />
              </Stack>
            </Stack>
            <Icon icon={ChevronRight} size={20} color="muted" />
          </Stack>
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={5} cursor="pointer" hoverBg="secondary/10" onClick={onOpenEnvironment}>
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack direction="row" align="center" gap={5}>
              <Icon icon={Server} variant="circular-secondary" />
              <Stack gap={1}>
                <Font variant="body-bold" text={cs.serverEnvironmentTitle} />
                <Font variant="description" text={environmentLabel} />
              </Stack>
            </Stack>
            <Icon icon={ChevronRight} size={20} color="muted" />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function resolveSyncBanner(p: {
  enabled: boolean
  isOnline: boolean
  isSynced: boolean
  pendingCount: number
  lastCheckAt: string | null
  lastDataUpdateAt: string | null
}) {
  const cs = UI_STRINGS.companySync
  if (!p.enabled) {
    return { variant: "info" as const, title: cs.syncDisabledTitle, lines: [cs.syncDisabledText] }
  }
  if (!p.isOnline) {
    return { variant: "warning" as const, title: cs.offlineStatusTitle, lines: [cs.offlineStatusText] }
  }
  if (!p.isSynced) {
    return {
      variant: "warning" as const,
      title: cs.pendingStatusTitle,
      lines: [formatString(cs.pendingStatusText, { count: p.pendingCount })],
    }
  }
  return {
    variant: "success" as const,
    title: cs.syncedStatusTitle,
    lines: [
      formatString(cs.lastCheckLabel, { date: formatSyncDateTime(p.lastCheckAt) }),
      formatString(cs.lastDataUpdateLabel, { date: formatSyncDateTime(p.lastDataUpdateAt) }),
    ],
  }
}

function SyncStatusBanner({ settings, enabled }: { settings: DeviceSyncSettings; enabled: boolean }) {
  const syncStatus = useSyncStatus()
  const [hubHost, setHubHost] = React.useState(() => getActiveLanHubBaseUrl())
  React.useEffect(() => {
    const syncHost = () => setHubHost(getActiveLanHubBaseUrl())
    window.addEventListener(LAN_HUB_ACTIVE_EVENT, syncHost)
    return () => window.removeEventListener(LAN_HUB_ACTIVE_EVENT, syncHost)
  }, [])
  const banner = resolveSyncBanner({
    enabled,
    isOnline: syncStatus.isOnline,
    isSynced: syncStatus.isSynced,
    pendingCount: syncStatus.pendingCount,
    lastCheckAt: settings.lastCheckAt,
    lastDataUpdateAt: settings.lastDataUpdateAt,
  })
  const hubLine = settings.environment === "local"
    ? (hubHost
      ? formatString(UI_STRINGS.companySync.activeHubLabel, { host: hubHost.replace("/api/lan-sync", "") })
      : UI_STRINGS.companySync.lookingForHubText)
    : null
  return (
    <Warning
      variant={banner.variant === "info" ? "info" : banner.variant}
      icon={CheckCircle}
      title={banner.title}
      text={
        <Stack gap={1} w="full">
          {banner.lines.map((line) => (
            <Font key={line} variant="description" color={banner.variant === "success" ? "success" : "muted"} text={line} align="left" />
          ))}
          {hubLine && <Font variant="description" color="muted" text={hubLine} align="left" />}
        </Stack>
      }
    />
  )
}

function SyncMainView({
  enabled, setEnabled, saved, onSave, onBack, onOpenIdentification, onOpenEnvironment, chrome,
}: {
  enabled: boolean
  setEnabled: (v: boolean) => void
  saved: DeviceSyncSettings
  onSave: () => void
  onBack: () => void
  onOpenIdentification: () => void
  onOpenEnvironment: () => void
  chrome: Pick<CompanySyncFormProps, "setCustomBack" | "setCustomTitle" | "setCustomActions">
}) {
  const cs = UI_STRINGS.companySync
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const isDirty = enabled !== saved.enabled
  const environmentLabel = saved.environment === "local" ? cs.localEnvironment : cs.cloudEnvironment

  const handleBack = React.useCallback(() => {
    if (isDirty) setIsDiscardModalOpen(true)
    else onBack()
  }, [isDirty, onBack])

  useSyncChrome({
    sectionTitle: UI_STRINGS.common.syncTitle,
    handleBack,
    handleSave: onSave,
    ...chrome,
  })

  return (
    <>
      <Stack gap={5} w="full">
        <SyncSettingsCard
          isEnabled={enabled}
          onToggle={setEnabled}
          deviceName={saved.deviceName}
          environmentLabel={environmentLabel}
          onOpenIdentification={onOpenIdentification}
          onOpenEnvironment={onOpenEnvironment}
        />
        <SyncStatusBanner settings={saved} enabled={enabled} />
        <Font variant="description" color="muted" text={cs.syncDisclaimer} />
      </Stack>
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => { setIsDiscardModalOpen(false); onBack() }}
      />
    </>
  )
}

function SyncDeviceIdentityView({
  saved, onPersist, onBack, chrome,
}: {
  saved: DeviceSyncSettings
  onPersist: (next: DeviceSyncSettings) => void
  onBack: () => void
  chrome: Pick<CompanySyncFormProps, "setCustomBack" | "setCustomTitle" | "setCustomActions">
}) {
  const cs = UI_STRINGS.companySync
  const [deviceName, setDeviceName] = React.useState(saved.deviceName)
  const [localIps, setLocalIps] = React.useState<string[]>([])
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const isDirty = deviceName !== saved.deviceName

  React.useEffect(() => {
    let active = true
    void discoverLocalLanIps().then((ips) => {
      if (active) setLocalIps(ips)
    })
    return () => { active = false }
  }, [])

  const handleSave = React.useCallback(() => {
    const next = { ...saved, deviceName: deviceName.trim() || saved.deviceName }
    saveDeviceSyncSettings(next)
    onPersist(next)
    onBack()
  }, [saved, deviceName, onPersist, onBack])

  const handleBack = React.useCallback(() => {
    if (isDirty) setIsDiscardModalOpen(true)
    else onBack()
  }, [isDirty, onBack])

  useSyncChrome({
    sectionTitle: cs.identificationTitle,
    handleBack,
    handleSave,
    ...chrome,
  })

  const ipDisplay = localIps.length > 0 ? localIps.join(", ") : cs.detectingIpText

  return (
    <>
      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
        <Stack gap={2.5} w="full">
          <Input
            variant="outlined-label"
            label={cs.deviceNameLabel}
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
          <Stack gap={1} w="full">
            <Font variant="description" color="muted" text={formatString(cs.serialLabel, { serial: saved.deviceSerial })} />
            <Font variant="description" color="muted" text={formatString(cs.localIpLabel, { ip: ipDisplay })} />
          </Stack>
        </Stack>
      </Box>
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => { setIsDiscardModalOpen(false); onBack() }}
      />
    </>
  )
}

function EnvironmentOptionRow({
  icon, title, description, checked, onSelect,
}: {
  icon: typeof Cloud
  title: string
  description: string
  checked: boolean
  onSelect: () => void
}) {
  return (
    <Box padding={5} cursor="pointer" hoverBg="secondary/10" onClick={onSelect} w="full">
      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
        <Stack direction="row" align="center" gap={5} flex="1" minW="0">
          <Icon icon={icon} variant="circular-secondary" />
          <Stack gap={1} align="start">
            <Font variant="body-bold" text={title} />
            <Font variant="description" color="muted" text={description} />
          </Stack>
        </Stack>
        <Radio name="sync-server-environment" checked={checked} onChange={onSelect} />
      </Stack>
    </Box>
  )
}

async function runConnectionTest(serverIp: string): Promise<"ok" | "fail" | "missing"> {
  if (!serverIp.trim()) return "missing"
  const ok = await testLocalServerConnection(serverIp)
  return ok ? "ok" : "fail"
}

function LocalServerAutoDiscoveryCard({
  activeHub,
  isScanning,
  scanResult,
  onScan,
}: {
  activeHub: string
  isScanning: boolean
  scanResult: "idle" | "found" | "not_found"
  onScan: () => void
}) {
  const cs = UI_STRINGS.companySync
  const cleanHost = activeHub.replace("/api/lan-sync", "")
  return (
    <Box padding={5} w="full">
      <Stack gap={2.5} w="full">
        <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Wifi} variant="circular-secondary" />
            <Font variant="body-bold" text={cs.autoDiscoveryTitle} />
          </Stack>
          <Button
            variant="secondary"
            icon={Search}
            label={cs.scanAgain}
            onClick={onScan}
            disabled={isScanning}
          />
        </Stack>
        <Font variant="description" color="muted" text={cs.autoDiscoveryDesc} />
        {isScanning && <Warning variant="info" icon={Info} title={cs.searchingLocalHub} />}
        {!isScanning && cleanHost && (
          <Warning variant="success" icon={CheckCircle} title={formatString(cs.foundLocalHub, { host: cleanHost })} />
        )}
        {!isScanning && !cleanHost && scanResult === "not_found" && (
          <Warning variant="warning" icon={AlertTriangle} title={cs.hubNotFound} />
        )}
      </Stack>
    </Box>
  )
}

function LocalServerManualIpSection({
  serverIp,
  setServerIp,
  showManual,
  setShowManual,
  testResult,
  isTesting,
  onTest,
}: {
  serverIp: string
  setServerIp: (v: string) => void
  showManual: boolean
  setShowManual: (v: boolean) => void
  testResult: "idle" | "ok" | "fail" | "missing"
  isTesting: boolean
  onTest: () => void
}) {
  const cs = UI_STRINGS.companySync
  return (
    <Box padding={5} w="full">
      <Stack gap={2.5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text={cs.manualIpToggle} />
          <Switch checked={showManual} onChange={(e) => setShowManual(e.target.checked)} />
        </Stack>
        {showManual && (
          <Stack gap={2.5} w="full">
            <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="end" gap={2.5} w="full">
              <Box flex="1">
                <Input
                  variant="outlined-label"
                  label={cs.serverIpLabel}
                  placeholder={cs.serverIpPlaceholder}
                  value={serverIp}
                  onChange={(e) => setServerIp(e.target.value)}
                />
              </Box>
              <Button
                variant="secondary"
                label={cs.testConnection}
                onClick={onTest}
                disabled={isTesting}
              />
            </Stack>
            {testResult === "ok" && <Warning variant="success" icon={CheckCircle} title={cs.testConnectionSuccess} />}
            {testResult === "fail" && <Warning variant="danger" icon={XCircle} title={cs.testConnectionFail} />}
            {testResult === "missing" && <Warning variant="warning" icon={AlertTriangle} title={cs.testConnectionMissingIp} />}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

function LocalServerSection({
  activeHub,
  isScanning,
  scanResult,
  onScan,
  serverIp,
  setServerIp,
  showManual,
  setShowManual,
  testResult,
  isTesting,
  onTest,
}: {
  activeHub: string
  isScanning: boolean
  scanResult: "idle" | "found" | "not_found"
  onScan: () => void
  serverIp: string
  setServerIp: (v: string) => void
  showManual: boolean
  setShowManual: (v: boolean) => void
  testResult: "idle" | "ok" | "fail" | "missing"
  isTesting: boolean
  onTest: () => void
}) {
  return (
    <>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <LocalServerAutoDiscoveryCard
        activeHub={activeHub}
        isScanning={isScanning}
        scanResult={scanResult}
        onScan={onScan}
      />
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <LocalServerManualIpSection
        serverIp={serverIp}
        setServerIp={setServerIp}
        showManual={showManual}
        setShowManual={setShowManual}
        testResult={testResult}
        isTesting={isTesting}
        onTest={onTest}
      />
    </>
  )
}

function useSyncEnvironmentState({
  saved, onPersist, onBack,
}: {
  saved: DeviceSyncSettings
  onPersist: (next: DeviceSyncSettings) => void
  onBack: () => void
}) {
  const [environment, setEnvironment] = React.useState<SyncServerEnvironment>(saved.environment)
  const [serverIp, setServerIp] = React.useState(saved.serverIp)
  const [showManual, setShowManual] = React.useState(() => Boolean(saved.serverIp.trim()))
  const [activeHub, setActiveHub] = React.useState(() => getActiveLanHubBaseUrl())
  const [isScanning, setIsScanning] = React.useState(false)
  const [scanResult, setScanResult] = React.useState<"idle" | "found" | "not_found">("idle")
  const [testResult, setTestResult] = React.useState<"idle" | "ok" | "fail" | "missing">("idle")
  const [isTesting, setIsTesting] = React.useState(false)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const isDirty = environment !== saved.environment || serverIp !== saved.serverIp
  const localEnabled = environment === "local"

  React.useEffect(() => {
    const syncHost = () => setActiveHub(getActiveLanHubBaseUrl())
    window.addEventListener(LAN_HUB_ACTIVE_EVENT, syncHost)
    return () => window.removeEventListener(LAN_HUB_ACTIVE_EVENT, syncHost)
  }, [])

  const handleScan = React.useCallback(async () => {
    setIsScanning(true)
    setScanResult("idle")
    const found = await scanSubnetForHub()
    setIsScanning(false)
    if (found) {
      setActiveHub(found)
      setScanResult("found")
    } else {
      setScanResult("not_found")
    }
  }, [])

  const handleSelectEnvironment = React.useCallback((env: SyncServerEnvironment) => {
    setEnvironment(env)
    if (env === "local" && !getActiveLanHubBaseUrl()) void handleScan()
  }, [handleScan])

  const handleSave = React.useCallback(() => {
    const next = { ...saved, environment, serverIp: serverIp.trim() }
    saveDeviceSyncSettings(next)
    onPersist(next)
    onBack()
  }, [saved, environment, serverIp, onPersist, onBack])

  const handleBack = React.useCallback(() => {
    if (isDirty) setIsDiscardModalOpen(true)
    else onBack()
  }, [isDirty, onBack])

  const handleTest = React.useCallback(async () => {
    setIsTesting(true)
    setTestResult(await runConnectionTest(serverIp))
    setIsTesting(false)
  }, [serverIp])

  return {
    environment, serverIp, setServerIp, showManual, setShowManual,
    activeHub, isScanning, scanResult, testResult, setTestResult,
    isTesting, isDiscardModalOpen, setIsDiscardModalOpen, localEnabled,
    handleScan, handleSelectEnvironment, handleSave, handleBack, handleTest,
  }
}

function SyncServerEnvironmentView({
  saved, onPersist, onBack, chrome,
}: {
  saved: DeviceSyncSettings
  onPersist: (next: DeviceSyncSettings) => void
  onBack: () => void
  chrome: Pick<CompanySyncFormProps, "setCustomBack" | "setCustomTitle" | "setCustomActions">
}) {
  const cs = UI_STRINGS.companySync
  const state = useSyncEnvironmentState({ saved, onPersist, onBack })

  useSyncChrome({
    sectionTitle: cs.serverEnvironmentTitle,
    handleBack: state.handleBack,
    handleSave: state.handleSave,
    ...chrome,
  })

  return (
    <>
      <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
        <Stack gap={0} w="full">
          <EnvironmentOptionRow
            icon={Cloud} title={cs.cloudTitle} description={cs.cloudDesc}
            checked={state.environment === "cloud"} onSelect={() => state.handleSelectEnvironment("cloud")}
          />
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <EnvironmentOptionRow
            icon={Monitor} title={cs.localTitle} description={cs.localDesc}
            checked={state.localEnabled} onSelect={() => state.handleSelectEnvironment("local")}
          />
          {state.localEnabled && (
            <LocalServerSection
              activeHub={state.activeHub}
              isScanning={state.isScanning}
              scanResult={state.scanResult}
              onScan={state.handleScan}
              serverIp={state.serverIp}
              setServerIp={(v) => { state.setServerIp(v); state.setTestResult("idle") }}
              showManual={state.showManual}
              setShowManual={state.setShowManual}
              testResult={state.testResult}
              isTesting={state.isTesting}
              onTest={state.handleTest}
            />
          )}
        </Stack>
      </Box>
      <DiscardChangesModal
        isOpen={state.isDiscardModalOpen}
        onClose={() => state.setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => { state.setIsDiscardModalOpen(false); onBack() }}
      />
    </>
  )
}

export function CompanySyncForm({
  onCancel, setCustomBack, setCustomTitle, setCustomActions,
}: CompanySyncFormProps) {
  const [view, setView] = React.useState<SyncView>("main")
  const [saved, setSaved] = React.useState<DeviceSyncSettings>(() => loadDeviceSyncSettings())
  const [enabled, setEnabled] = React.useState(saved.enabled)
  const chrome = { setCustomBack, setCustomTitle, setCustomActions }

  const handleSaveMain = React.useCallback(() => {
    const next = { ...saved, enabled }
    saveDeviceSyncSettings(next)
    setSaved(next)
    onCancel()
  }, [saved, enabled, onCancel])

  if (view === "identificacao") {
    return (
      <SyncDeviceIdentityView
        saved={saved}
        onPersist={setSaved}
        onBack={() => setView("main")}
        chrome={chrome}
      />
    )
  }

  if (view === "ambiente") {
    return (
      <SyncServerEnvironmentView
        saved={saved}
        onPersist={setSaved}
        onBack={() => setView("main")}
        chrome={chrome}
      />
    )
  }

  return (
    <SyncMainView
      enabled={enabled}
      setEnabled={setEnabled}
      saved={saved}
      onSave={handleSaveMain}
      onBack={onCancel}
      onOpenIdentification={() => setView("identificacao")}
      onOpenEnvironment={() => setView("ambiente")}
      chrome={chrome}
    />
  )
}
