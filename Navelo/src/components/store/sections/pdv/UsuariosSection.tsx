"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Grid } from "../../base/Grid"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { Input } from "../../base/Input"
import { CustomSelect, CustomSelectItem } from "../../base/CustomSelect"
import { Badge } from "../../base/Badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../base/Table"
import { Search, Plus, Edit2, Trash2, Mail, Phone, Lock, User, Shield } from "lucide-react"

interface UserItem {
  id: string
  name: string
  role: string
  phone: string
  email: string
  isCurrent: boolean
}

export interface UsuariosSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const UsuariosSection: React.FC<UsuariosSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [users, setUsers] = React.useState<UserItem[]>([
    { id: "1", name: "Administrador", role: "Administrador", phone: "(33) 99956-5081", email: "admin@navelo.com", isCurrent: true },
    { id: "2", name: "CAIXA", role: "Caixa", phone: "", email: "caixa@navelo.com", isCurrent: false },
    { id: "3", name: "Teste", role: "Administrador", phone: "", email: "teste@navelo.com", isCurrent: false }
  ])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [formName, setFormName] = React.useState("")
  const [formRole, setFormRole] = React.useState("Caixa")
  const [formPhone, setFormPhone] = React.useState("")
  const [formEmail, setFormEmail] = React.useState("")
  const [formPassword, setFormPassword] = React.useState("")

  React.useEffect(() => {
    if (mode === "form") {
      setCustomBack?.(() => () => setMode("list"))
      setCustomTitle?.(editingUser ? "Editar Usuário" : "Novo Usuário")
    } else {
      setCustomBack?.(() => () => onCancel())
      setCustomTitle?.("Usuários")
    }
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [mode, editingUser, setCustomBack, setCustomTitle, onCancel])

  const handleEdit = (user: UserItem) => {
    setEditingUser(user)
    setFormName(user.name)
    setFormRole(user.role)
    setFormPhone(user.phone)
    setFormEmail(user.email)
    setFormPassword("")
    setMode("form")
  }

  const handleCreateNew = () => {
    setEditingUser(null)
    setFormName("")
    setFormRole("Caixa")
    setFormPhone("")
    setFormEmail("")
    setFormPassword("")
    setMode("form")
  }

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
              ...u,
              name: formName,
              role: formRole,
              phone: formPhone,
              email: formEmail
            }
            : u
        )
      )
    } else {
      const newUser: UserItem = {
        id: Math.random().toString(),
        name: formName,
        role: formRole,
        phone: formPhone,
        email: formEmail,
        isCurrent: false
      }
      setUsers((prev) => [...prev, newUser])
    }

    setMode("list")
  }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Stack gap={5} w="full">
      {mode === "list" ? (
        /* ================= LISTAGEM DE USUÁRIOS ================= */
        <Box padding={5} bg="bg-white" radius="default" border={true} borderColor="border-border" w="full">
          <Stack gap={5} w="full">
            <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="center" w="full">
              <Box flex="1" w="full">
                <Input
                  placeholder="Buscar por nome ou perfil..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </Box>
              <Button
                variant="primary"
                label="Novo Usuário"
                icon={Plus}
                onClick={handleCreateNew}
              />
            </Stack>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead text="Usuário" />
                  <TableHead text="Perfil / Função" />
                  <TableHead text="Telefone" />
                  <TableHead text="E-mail" />
                  <TableHead text="Status" />
                  <TableHead text="Ações" align="right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell fontWeight="bold">
                      <Stack direction="row" align="center" gap={2.5}>
                        <Box w="w-8" h="h-8" bg="bg-brand-primary/10" radius="full">
                          <Stack w="full" h="full" align="center" justify="center">
                            <Font variant="body-sm-semibold" color="primary" text={u.name.charAt(0).toUpperCase()} />
                          </Stack>
                        </Box>
                        <Font variant="body-bold" text={u.name} />
                      </Stack>
                    </TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.phone || "—"}</TableCell>
                    <TableCell>{u.email || "—"}</TableCell>
                    <TableCell>
                      {u.isCurrent ? (
                        <Badge variant="success" label="Logado" />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="right" w="w-24">
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button
                          variant="outline-icon-xs"
                          icon={Edit2}
                          onClick={() => handleEdit(u)}
                        />
                        <Button
                          variant="danger-icon-xs"
                          icon={Trash2}
                          onClick={() => handleDelete(u.id)}
                          disabled={u.isCurrent}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Box>
      ) : (
        /* ================= FORMULÁRIO DE CADASTRO/EDIÇÃO ================= */
        <Box
          as="form"
          onSubmit={handleSave}
          bg="bg-white"
          border={true}
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
        >
          <Stack gap={5} w="full">
            <Grid cols={2} gap={5}>
              <Input
                label="* Nome do usuário"
                placeholder="Ex: João Silva"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                icon={User}
                required
              />

              <Stack gap={1} w="full">
                <Font variant="sub-tiny-bold" text="* Perfil / Função" />
                <CustomSelect
                  value={formRole}
                  onChange={(val) => setFormRole(val)}
                >
                  <CustomSelectItem value="Administrador" text="Administrador" icon={Shield} />
                  <CustomSelectItem value="Caixa" text="Caixa" icon={Shield} />
                  <CustomSelectItem value="Gerente" text="Gerente" icon={Shield} />
                </CustomSelect>
              </Stack>

              <Input
                label="Telefone"
                placeholder="Ex: (11) 99999-9999"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                icon={Phone}
                variant="phone"
              />

              <Input
                label="E-mail"
                placeholder="Ex: usuario@email.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                icon={Mail}
                type="email"
              />

              <Input
                label={editingUser ? "Nova Senha (deixe em branco para não alterar)" : "* Senha"}
                placeholder="Mínimo 6 caracteres"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                icon={Lock}
                type="password"
                required={!editingUser}
              />
            </Grid>

            {/* Ações */}
            <Box paddingY={2.5} w="full">
              <Stack direction="row" justify="end" gap={2.5} w="full">
                <Button
                  variant="outline"
                  label="Cancelar"
                  onClick={() => setMode("list")}
                />
                <Button
                  type="submit"
                  variant="primary"
                  label={editingUser ? "Salvar alterações" : "Adicionar usuário"}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Stack>
  )
}
