"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Badge } from "@/components/store/base/Badge"
import { Avatar } from "@/components/store/base/Avatar"
import { Checkbox } from "@/components/store/base/Checkbox"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Trash2, Search, Check } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useTenant } from "@/lib/context/TenantContext"
import { useOperators, dal } from "@/lib/dal/hooks"
import { ViewTransition } from "@/components/store/base/ViewTransition"

interface UserItem {
  id: string
  name: string
  role: string
  phone: string
  email: string
  password?: string
  commission?: string
  isCurrent: boolean
}

export interface UsuariosSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const OPERATOR_ROLES_FULL = [
  {
    key: "ADMIN",
    label: "Administrador",
    description: "Tem acesso ilimitado a todo o sistema"
  },
  {
    key: "SUPERVISOR",
    label: "Supervisor",
    description: "Usado apenas para autorizar ações administrativas / Não pode fazer login no sistema"
  },
  {
    key: "CASHIER",
    label: "Caixa",
    description: "Tem acesso limitado ao caixa, delivery, autoatendimento, mesas e comandas"
  },
  {
    key: "ATTENDANT",
    label: "Atendente",
    description: "Tem acesso limitado ao autoatendimento, mesas e comandas"
  },
  {
    key: "TOTEM",
    label: "Totem Autoatendimento",
    description: "Modo exclusivo para autoatendimento do cliente"
  }
]

export const UsuariosSection: React.FC<UsuariosSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const tenantCtx = useTenant()
  const activeTenant = tenantCtx?.currentTenant
  const tenantId = activeTenant?.id || "demo-tenant"
  const currentUser = tenantCtx?.currentUser

  // Busca lista reativa de operadores no IndexedDB
  const dbOperators = useOperators(tenantId)

  const usersList: UserItem[] = React.useMemo(() => {
    if (!dbOperators || dbOperators.length === 0) {
      return [
        {
          id: `user-admin-${tenantId}`,
          name: "Administrador",
          role: "Administrador",
          phone: "",
          email: `admin@${tenantId}.app`,
          password: "123456789",
          commission: "% 0,00",
          isCurrent: true
        }
      ]
    }
    return dbOperators.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      phone: "",
      email: u.email || "",
      password: u.password,
      commission: (u as { commission?: string }).commission || "% 0,00",
      isCurrent: currentUser?.id === u.id || currentUser?.name === u.name
    }))
  }, [dbOperators, tenantId, currentUser])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [formName, setFormName] = React.useState("")
  const [formLogin, setFormLogin] = React.useState("")
  const [formPassword, setFormPassword] = React.useState("")
  const [formConfirmPassword, setFormConfirmPassword] = React.useState("")
  const [formCommission, setFormCommission] = React.useState("% 0,00")
  const [formRole, setFormRole] = React.useState("ADMIN")

  const handleDelete = async (id: string) => {
    try {
      await dal.users.delete(id, tenantId)
      setMode("list")
    } catch (err) {
      console.error("Erro ao excluir usuário:", err)
    }
  }

  const executeSave = async () => {
    if (!formName || !formLogin) return

    if (formPassword !== formConfirmPassword) {
      console.warn("A senha e a confirmação de senha não coincidem.")
      return
    }

    const selectedRoleObj = OPERATOR_ROLES_FULL.find(r => r.key === formRole || r.label === formRole)
    const roleLabel = selectedRoleObj?.label || "Caixa"

    try {
      if (editingUser) {
        await dal.users.update({
          id: editingUser.id,
          company_id: tenantId,
          tenant_id: tenantId,
          name: formName,
          email: formLogin,
          role: roleLabel,
          password: formPassword || editingUser.password || "123456789",
          commission: formCommission,
          active: true
        })
      } else {
        const newId = crypto.randomUUID()
        await dal.users.create({
          id: newId,
          company_id: tenantId,
          tenant_id: tenantId,
          name: formName,
          email: formLogin,
          role: roleLabel,
          password: formPassword || "123456789",
          commission: formCommission,
          active: true
        })
      }
    } catch (err) {
      console.error("Erro ao salvar operador:", err)
    }

    setMode("list")
  }

  React.useEffect(() => {
    if (mode === "form") {
      setCustomBack?.(() => () => setMode("list"))
      setCustomTitle?.(editingUser ? "Editar Usuário" : "Novo Usuário")
      setCustomActions?.(
        <Stack direction="row" align="center" gap={2.5}>
          {editingUser && !editingUser.isCurrent && (
            <Button
              type="button"
              variant="danger-icon"
              icon={Trash2}
              onClick={() => handleDelete(editingUser.id)}
            />
          )}
          <Button
            type="button"
            variant="primary-icon"
            icon={Check}
            onClick={executeSave}
          />
        </Stack>
      )
    } else {
      setCustomBack?.(() => () => onCancel())
      setCustomTitle?.("Usuários")
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar por nome ou perfil..."
        />
      )
    }
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, editingUser, searchQuery, formName, formLogin, formPassword, formConfirmPassword, formCommission, formRole, setCustomBack, setCustomTitle, setCustomActions, onCancel])

  const handleEdit = (user: UserItem) => {
    setEditingUser(user)
    setFormName(user.name)
    setFormLogin(user.email || user.name.toLowerCase().replace(/\s+/g, "."))
    setFormPassword(user.password || "")
    setFormConfirmPassword(user.password || "")
    setFormCommission(user.commission || "% 0,00")

    const roleObj = OPERATOR_ROLES_FULL.find(r => r.label === user.role || r.key === user.role)
    setFormRole(roleObj?.key || "CASHIER")
    setMode("form")
  }

  const handleCreateNew = () => {
    setEditingUser(null)
    setFormName("")
    setFormLogin("")
    setFormPassword("")
    setFormConfirmPassword("")
    setFormCommission("% 0,00")
    setFormRole("ADMIN")
    setMode("form")
  }
  const filtered = usersList.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ViewTransition viewKey={mode} flex="1" minH="0">
      <Stack gap={5} w="full">
        {mode === "list" && (
          /* ================= LISTAGEM DE USUÁRIOS ================= */
          <Box position="relative" w="full">
            {filtered.length > 0 ? (
              <Box display="flex" direction="col" w="full">
                {filtered.map((u, idx) => (
                  <Box key={u.id}>
                    <Box
                      w="full"
                      paddingY={2.5}
                      paddingX={2.5}
                      radius="none"
                      hoverBg="primary/10"
                      cursor="pointer"
                      onClick={() => handleEdit(u)}
                    >
                      <Stack direction="row" align="center" justify="between" w="full">
                        <Stack direction="row" align="center" gap={2.5} flex="1">
                          <Avatar fallback={u.name.substring(0, 2).toUpperCase()} />
                          <Stack gap={0} align="start">
                            <Stack direction="row" align="center" gap={2.5}>
                              <Font variant="body-bold" text={u.name} />
                              <Badge
                                variant={
                                  u.role === "ADMIN"
                                    ? "primary"
                                    : u.role === "SUPERVISOR"
                                    ? "secondary"
                                    : "outline"
                                }
                                label={u.role}
                              />
                            </Stack>
                            <Font variant="description" color="muted" text={`Login: ${u.email}`} />
                          </Stack>
                        </Stack>

                        <Button
                          type="button"
                          variant="danger-icon-xs-confirm"
                          confirmTitle="Excluir Usuário"
                          confirmSubtitle="Confirmar exclusão de usuário"
                          confirmParagraph="Tem certeza que deseja remover este usuário do sistema?"
                          onConfirm={() => handleDelete(u.id)}
                          disabled={u.isCurrent}
                          title={u.isCurrent ? "Não é possível excluir o usuário ativo" : "Excluir usuário"}
                        />
                      </Stack>
                    </Box>
                    {idx < filtered.length - 1 && (
                      <Box borderBottom={true} borderColor="border-border" w="full" />
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <EmptyState
                icon={Search}
                title="Nenhum usuário encontrado"
                subtitle="Tente pesquisar com outro termo ou cadastre um novo operador."
              />
            )}

            <Box position="fixed" bottom={6} right={6} zIndex="50">
              <Button
                variant="secondary-pill-icon"
                icon={Plus}
                onClick={handleCreateNew}
                title="Novo operador"
              />
            </Box>
          </Box>
        )}

        {mode === "form" && (
          /* ================= FORMULÁRIO DE CADASTRO / EDIÇÃO DE OPERADOR ================= */
          <Box
            as="form"
            onSubmit={(e) => {
              e.preventDefault()
              executeSave()
            }}
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            padding={5}
            w="full"
          >
            <Stack gap={5} w="full">
              <Input
                label="* Nome Completo"
                placeholder="Ex: João da Silva"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />

              <Input
                label="* Login do Usuário (PIN / Usuário)"
                placeholder="Ex: joao.silva ou 1234"
                value={formLogin}
                onChange={(e) => setFormLogin(e.target.value)}
                required
              />

              <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
                <Box flex="1">
                  <Input
                    label={editingUser ? "Nova Senha (deixe em branco para manter)" : "* Senha"}
                    type="password"
                    placeholder="••••••"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    required={!editingUser}
                  />
                </Box>
                <Box flex="1">
                  <Input
                    label={editingUser ? "Confirmar Nova Senha" : "* Confirmar Senha"}
                    type="password"
                    placeholder="••••••"
                    value={formConfirmPassword}
                    onChange={(e) => setFormConfirmPassword(e.target.value)}
                    required={!editingUser || Boolean(formPassword)}
                  />
                </Box>
              </Stack>

              <Input
                label="Comissão (%)"
                placeholder="% 0,00"
                value={formCommission}
                onChange={(e) => setFormCommission(e.target.value)}
              />

              {/* Seleção do Perfil / Role */}
              <Box padding={5} bg="bg-surface-sunken" radius="default" w="full">
                <Stack gap={2.5} w="full">
                  <Font variant="body-bold" text="* Nível de Acesso / Perfil" />
                  <Stack gap={2.5} w="full">
                    {OPERATOR_ROLES_FULL.map((r) => {
                      const isSelected = formRole === r.key
                      return (
                        <Box
                          key={r.key}
                          padding={2.5}
                          radius="default"
                          border={true}
                          borderColor={isSelected ? "border-brand-primary" : "border-border"}
                          bg={isSelected ? "bg-brand-primary/5" : "bg-white"}
                          cursor="pointer"
                          onClick={() => setFormRole(r.key)}
                        >
                          <Stack direction="row" align="center" justify="between" w="full">
                            <Stack gap={0} flex="1">
                              <Font variant="body-bold" text={r.label} />
                              <Font variant="description" color="muted" text={r.description} />
                            </Stack>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => setFormRole(r.key)}
                            />
                          </Stack>
                        </Box>
                      )
                    })}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
      </Stack>
    </ViewTransition>
  )
}
