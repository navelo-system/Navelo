"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Avatar } from "@/components/store/base/Avatar"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FileText, Share2, Trash2, ChevronDown, ChevronUp, Package } from "lucide-react"
import { Sale, Product, dal } from "@/lib/dal"
import { SaleShareModal } from "@/components/store/sections/pdv/modals/SaleShareModal"
import { SaleLinkModal } from "@/components/store/sections/pdv/modals/SaleLinkModal"
import { SaleExportModal } from "@/components/store/sections/pdv/modals/SaleExportModal"
import { UI_STRINGS } from "@/constants/strings"

export interface RawSaleItem {
  id?: string
  product_id?: string
  productId?: string
  product_name?: string
  name?: string
  title?: string
  productName?: string
  description?: string
  unit_price?: number
  unitPrice?: number
  price?: number
  unit_val?: number
  quantity?: number
  qty?: number
  amount?: number
  count?: number
  total_price?: number
  totalPrice?: number
  total?: number
  image?: string
  image_url?: string
  imageUrl?: string
  unit?: string
  unidade?: string
  category?: string
  product?: { id?: string; name?: string; product_name?: string; price?: number; unit_price?: number; image_url?: string; unit?: string }
}

export function parseSaleItems(items: unknown): RawSaleItem[] {
  if (Array.isArray(items)) return items as RawSaleItem[]
  if (typeof items === "string") {
    try {
      const parsed = JSON.parse(items)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

export function getSaleCode(sale: Sale): string {
  const customCode = (sale as unknown as { code?: string | number }).code
  if (customCode) return String(customCode).padStart(4, "0")
  if (sale.id) {
    const parts = sale.id.split("-")
    const last = parts[parts.length - 1]
    return last.slice(-4).toUpperCase()
  }
  return "0001"
}

function formatPrice(val?: number) {
  if (val === undefined || val === null || isNaN(val)) return "R$ 0,00"
  return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function resolveSaleItemDisplay(item: RawSaleItem, productMap: Map<string, Product>) {
  const itemProductId = item.product_id || item.productId || item.id || ""
  const matchedProduct = productMap.get(itemProductId)
  const name =
    item.name ||
    item.product_name ||
    item.productName ||
    item.title ||
    item.description ||
    item.product?.name ||
    item.product?.product_name ||
    matchedProduct?.name ||
    "Produto"
  const unitPrice =
    item.unitPrice ??
    item.unit_price ??
    item.price ??
    item.unit_val ??
    item.product?.unit_price ??
    item.product?.price ??
    matchedProduct?.price ??
    0
  const qty =
    item.quantity ??
    item.qty ??
    item.amount ??
    item.count ??
    1
  const totalPrice = item.totalPrice ?? item.total_price ?? item.total ?? (unitPrice * qty)
  const image =
    item.image ||
    item.image_url ||
    item.imageUrl ||
    item.product?.image_url ||
    matchedProduct?.image_url
  const unit = item.unit || item.unidade || item.product?.unit || matchedProduct?.unit || UI_STRINGS.common.unitDefault
  return { name, unitPrice, qty, totalPrice, image, unit }
}

export function SaleDetailItemRow({ item, productMap }: { item: RawSaleItem; productMap: Map<string, Product> }) {
  const disp = resolveSaleItemDisplay(item, productMap)

  return (
    <Box padding={2.5} bg="bg-brand-primary/10" hoverBg="secondary/10" radius="none" w="full" cursor="pointer">
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Avatar image={disp.image} icon={Package} fallback={disp.name.substring(0, 2)} />
          <Stack gap={1} align="start" flex="1" minW="0">
            <Font variant="body" text={disp.name} />
            <Font variant="auxiliary" color="muted" truncate text={`${disp.qty} ${disp.unit} x ${formatPrice(disp.unitPrice)}`} />
          </Stack>
        </Stack>
        <Box shrink="0">
          <Font variant="body" text={formatPrice(disp.totalPrice)} />
        </Box>
      </Stack>
    </Box>
  )
}

export function SaleDetailCustomerBox({ customerName }: { customerName?: string }) {
  const s = UI_STRINGS.negotiations
  if (!customerName || customerName === "Nao selecionado" || customerName === "Venda Avulsa") return null
  return (
    <Box padding={2.5} bg="bg-brand-primary/10" radius="none" w="full">
      <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
        <Avatar fallback={customerName.substring(0, 2).toUpperCase()} />
        <Stack gap={1} align="start" flex="1" minW="0">
          <Font variant="body" text={customerName} />
          <Font variant="auxiliary" color="muted" text={s.registeredCustomerLabel} />
        </Stack>
      </Stack>
    </Box>
  )
}

export function SaleDetailAccordionBox({
  sale,
  isAccordionOpen,
  onToggleAccordion,
}: {
  sale: Sale
  isAccordionOpen: boolean
  onToggleAccordion: () => void
}) {
  const s = UI_STRINGS.negotiations
  const saleItems = parseSaleItems(sale.items)
  const totalItemsCount = saleItems.reduce((acc: number, it: RawSaleItem) => acc + (it.quantity || it.qty || it.amount || 1), 0)

  return (
    <Box padding={2.5} bg="bg-brand-primary/10" radius="none" w="full" cursor="pointer" onClick={onToggleAccordion}>
      <Stack gap={2.5} w="full">
        <Stack direction="row" justify="between" align="center" w="full">
          <Stack gap={0}>
            <Font variant="auxiliary" color="muted" text={UI_STRINGS.pdv.cart.total} />
            <Font variant="auxiliary" color="muted" text={`Itens: ${totalItemsCount}`} />
          </Stack>
          <Stack direction="row" align="center" gap={2.5}>
            <Font variant="body-bold" color="primary" text={formatPrice(sale.total)} />
            <Icon icon={isAccordionOpen ? ChevronUp : ChevronDown} size={16} color="primary" />
          </Stack>
        </Stack>
        {isAccordionOpen && (
          <Box padding={1} w="full">
            <Stack gap={2.5} w="full">
              <Box border borderColor="border/30" w="full" />
              <Stack direction="row" justify="between" align="center" w="full">
                <Font variant="body-sm-medium" color="muted" text={s.saleLabel} />
                <Font variant="body-sm-medium" text={formatPrice(sale.total)} />
              </Stack>
              <Stack direction="row" justify="between" align="center" w="full">
                <Font variant="body-sm-medium" color="muted" text={`${sale.payment_method || UI_STRINGS.common.confirm}:`} />
                <Font variant="body-sm-medium" text={formatPrice(sale.total)} />
              </Stack>
              <Stack direction="row" justify="between" align="center" w="full">
                <Font variant="body-sm-medium" color="muted" text={s.totalPaidLabel} />
                <Font variant="body-sm-medium" text={formatPrice(sale.total)} />
              </Stack>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export function SaleDetailModal({
  selectedSale,
  onClose,
  productMap,
  isAccordionOpen,
  onToggleAccordion,
  onDuplicate,
  onDeleteRequest,
  onShareRequest,
  onPrintRequest,
}: {
  selectedSale: Sale | null
  onClose: () => void
  productMap: Map<string, Product>
  isAccordionOpen: boolean
  onToggleAccordion: () => void
  onDuplicate: () => void
  onDeleteRequest: () => void
  onShareRequest: () => void
  onPrintRequest: () => void
}) {
  const s = UI_STRINGS.negotiations
  if (!selectedSale) return null

  const parsedItems = parseSaleItems(selectedSale.items)

  return (
    <Modal
      isOpen={Boolean(selectedSale)}
      onClose={onClose}
      title={`Venda #${getSaleCode(selectedSale)}`}
      variant="default"
      showCancelButton
      successText="Duplicar pedido"
      onSuccess={onDuplicate}
    >
      <Stack gap={5} w="full">
        <SaleDetailCustomerBox customerName={selectedSale.customer_name} />
        <SaleDetailAccordionBox sale={selectedSale} isAccordionOpen={isAccordionOpen} onToggleAccordion={onToggleAccordion} />
        <Stack gap={2.5} w="full">
          <Font variant="body-bold" color="primary" text={s.productsInOrderTitle} />
          <Box maxH="240px" overflow="auto" w="full">
            <Stack gap={2.5} w="full">
              {parsedItems.length === 0 ? (
                <EmptyState icon={Package} title={s.noItemsDetailedTitle} subtitle={s.noItemsDetailedSubtitle} />
              ) : (
                parsedItems.map((item: RawSaleItem, idx: number) => (
                  <SaleDetailItemRow key={`${item.product_id || item.id || idx}-${idx}`} item={item} productMap={productMap} />
                ))
              )}
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" justify="center" align="center" gap={5} w="full">
          <Button variant="danger-pill-icon" icon={Trash2} onClick={onDeleteRequest} title={s.deleteNegotiationTitle} />
          <Button variant="secondary-pill-icon" icon={Share2} onClick={onShareRequest} title={s.shareNegotiationTitle} />
          <Button variant="primary-pill-icon-print" onClick={onPrintRequest} title={s.printReceiptTitle} />
        </Stack>
      </Stack>
    </Modal>
  )
}

export function NegotiationsModalsContainer({
  selectedSale,
  setSelectedSale,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  isShareModalOpen,
  setIsShareModalOpen,
  isLinkModalOpen,
  setIsLinkModalOpen,
  linkModalUrl,
  setLinkModalUrl,
  isExportModalOpen,
  setIsExportModalOpen,
  onGeneratePdf,
  onExportPdf,
  onExportCsv,
}: {
  selectedSale: Sale | null
  setSelectedSale: (s: Sale | null) => void
  isDeleteConfirmOpen: boolean
  setIsDeleteConfirmOpen: (v: boolean) => void
  isShareModalOpen: boolean
  setIsShareModalOpen: (v: boolean) => void
  isLinkModalOpen: boolean
  setIsLinkModalOpen: (v: boolean) => void
  linkModalUrl: string
  setLinkModalUrl: (u: string) => void
  isExportModalOpen: boolean
  setIsExportModalOpen: (v: boolean) => void
  onGeneratePdf: () => Promise<string | null>
  onExportPdf: () => void
  onExportCsv: () => void
}) {
  const s = UI_STRINGS.negotiations
  return (
    <>
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title={s.deleteNegotiationTitle}
        successText={s.confirmDeleteButton}
        onSuccess={async () => {
          setIsDeleteConfirmOpen(false)
          if (selectedSale) {
            await dal.sales.delete(selectedSale.id)
            setSelectedSale(null)
          }
        }}
        showCancelButton
      >
        <Font variant="body-sm-medium" text={s.deleteNegotiationParagraph} />
      </Modal>

      {selectedSale && (
        <SaleShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          pdfUrl={selectedSale.pdf_url || null}
          saleName={`Venda #${getSaleCode(selectedSale)}`}
          onGeneratePdf={onGeneratePdf}
          onOpenLinkModal={(url: string) => {
            setLinkModalUrl(url)
            setIsLinkModalOpen(true)
          }}
        />
      )}

      {selectedSale && (
        <SaleLinkModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          pdfUrl={linkModalUrl || selectedSale.pdf_url || ""}
          saleName={`Venda #${getSaleCode(selectedSale)}`}
        />
      )}

      <SaleExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportPdf={onExportPdf}
        onExportCsv={onExportCsv}
      />
    </>
  )
}
