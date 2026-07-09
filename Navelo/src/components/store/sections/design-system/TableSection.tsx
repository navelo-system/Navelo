import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Stack } from "@/components/store/base/Stack"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { FilterBar } from "@/components/store/intermediary/FilterBar"
import { LayoutGrid, Plus, MoreHorizontal } from "lucide-react"

export const TableSection: React.FC = () => {
  return (
    <RegistrySection
      title="Tabelas e Listagens (Data Grids)"
      description="Estruturas para exibição e filtragem de grandes volumes de dados."
      icon={LayoutGrid}
    >
      <Stack gap={5}>
        <FilterBar 
          searchPlaceholder="Buscar clientes por nome ou CPF..."
          actions={<Button variant="primary" icon={Plus} label="Novo Cliente" />}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead text="Nome do Cliente" />
              <TableHead text="Contato" />
              <TableHead text="Status" />
              <TableHead align="right" text="Última Compra" />
              <TableHead w="w-[50px]" text="" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell fontWeight="medium">João da Silva</TableCell>
              <TableCell>(11) 98888-8888</TableCell>
              <TableCell><Badge variant="success" label="Ativo" /></TableCell>
              <TableCell align="right">R$ 150,00</TableCell>
              <TableCell><Button variant="outline-icon-xs" icon={MoreHorizontal} /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell fontWeight="medium">Maria Souza</TableCell>
              <TableCell>(11) 97777-7777</TableCell>
              <TableCell><Badge variant="danger" label="Bloqueado" /></TableCell>
              <TableCell align="right">R$ 800,00</TableCell>
              <TableCell><Button variant="outline-icon-xs" icon={MoreHorizontal} /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell fontWeight="medium">Padaria Central</TableCell>
              <TableCell>(11) 3333-3333</TableCell>
              <TableCell><Badge variant="outline" label="Pendente" /></TableCell>
              <TableCell align="right">R$ 0,00</TableCell>
              <TableCell><Button variant="outline-icon-xs" icon={MoreHorizontal} /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </RegistrySection>
  )
}
