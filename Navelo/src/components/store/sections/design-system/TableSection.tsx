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
              <TableHead>Nome do Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Última Compra</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">João da Silva</TableCell>
              <TableCell>(11) 98888-8888</TableCell>
              <TableCell><Badge variant="success" label="Ativo" /></TableCell>
              <TableCell className="text-right">R$ 150,00</TableCell>
              <TableCell><Button variant="outline-icon-xs" icon={MoreHorizontal} /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Maria Souza</TableCell>
              <TableCell>(11) 97777-7777</TableCell>
              <TableCell><Badge variant="danger" label="Bloqueado" /></TableCell>
              <TableCell className="text-right">R$ 800,00</TableCell>
              <TableCell><Button variant="outline-icon-xs" icon={MoreHorizontal} /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Padaria Central</TableCell>
              <TableCell>(11) 3333-3333</TableCell>
              <TableCell><Badge variant="outline" label="Pendente" /></TableCell>
              <TableCell className="text-right">R$ 0,00</TableCell>
              <TableCell><Button variant="outline-icon-xs" icon={MoreHorizontal} /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </RegistrySection>
  )
}
