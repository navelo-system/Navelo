"use client"

import * as React from "react"
import { DiscountModal } from "@/components/store/sections/pdv/modals/DiscountModal"
import { ChangeCalculatorModal } from "@/components/store/sections/pdv/modals/ChangeCalculatorModal"
import { CardTransactionModal } from "@/components/store/sections/pdv/modals/CardTransactionModal"
import { PdvSidebarDrawer } from "@/components/store/sections/pdv/modals/PdvSidebarDrawer"
import { PrintStatusModal } from "@/components/store/sections/pdv/modals/PrintStatusModal"
import { KgProductWeightModal } from "@/components/store/sections/pdv/modals/KgProductWeightModal"
import { MockProduct } from "@/components/store/advanced/PdvCatalog"
import { UI_STRINGS } from "@/constants/strings"

interface PdvModalsProps {
  isChangeModalOpen: boolean
  onCloseChangeModal: () => void
  amountDue: number
  onConfirmChangePayment: (amount: number) => void
  isCardModalOpen: boolean
  onCloseCardModal: () => void
  formatPrice: (value: number) => string
  onLaunchPayment: (method: string, amount: number) => void
  isDiscountModalOpen: boolean
  onCloseDiscountModal: () => void
  onOpenDiscountModal: () => void
  discount: number
  onChangeDiscount: (val: number) => void
  isSidebarOpen: boolean
  onCloseSidebar: () => void
  onBackToDashboard: () => void
  launchAmount: number
  subtotal: number
  onNavigate: (view: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "ultimas-negociacoes" | "pdv-customizacao" | "numero-atendimento") => void
  onOpenObservationModal: () => void
  onOpenSangriaModal: (mode?: "sangria" | "suprimento") => void
  customerName?: string
  observationText?: string
  hasCartItems?: boolean
  onCancelOperation?: () => void
  isGavetaModalOpen: boolean
  onOpenGavetaModal: () => void
  onCloseGavetaModal: () => void
  isKgModalOpen?: boolean
  onCloseKgModal?: () => void
  selectedKgProduct?: MockProduct | null
  onConfirmKgProduct?: (product: MockProduct, quantity: number) => void
}

function PdvCheckoutModals(props: PdvModalsProps) {
  return (
    <>
      <ChangeCalculatorModal
        isOpen={props.isChangeModalOpen}
        onClose={props.onCloseChangeModal}
        onConfirm={props.onConfirmChangePayment}
        launchAmount={props.launchAmount}
      />
      <CardTransactionModal
        isOpen={props.isCardModalOpen}
        onClose={props.onCloseCardModal}
        amountDue={props.launchAmount}
        formatPrice={props.formatPrice}
        onLaunchPayment={props.onLaunchPayment}
      />
      <DiscountModal
        isOpen={props.isDiscountModalOpen}
        onClose={props.onCloseDiscountModal}
        discount={props.discount}
        onChangeDiscount={props.onChangeDiscount}
        subtotal={props.subtotal}
      />
    </>
  )
}

function PdvToolModals(props: PdvModalsProps) {
  return (
    <>
      <PdvSidebarDrawer
        isOpen={props.isSidebarOpen}
        onClose={props.onCloseSidebar}
        onBackToDashboard={props.onBackToDashboard}
        onNavigate={props.onNavigate}
        onOpenObservationModal={props.onOpenObservationModal}
        onOpenSangriaModal={props.onOpenSangriaModal}
        onOpenGavetaModal={() => { props.onCloseSidebar(); props.onOpenGavetaModal() }}
        discount={props.discount}
        subtotal={props.subtotal}
        customerName={props.customerName}
        observationText={props.observationText}
        hasCartItems={props.hasCartItems}
        onCancelOperation={props.onCancelOperation}
        onOpenDiscountModal={() => {
          props.onCloseSidebar()
          props.onOpenDiscountModal()
        }}
      />
      <PrintStatusModal
        isOpen={props.isGavetaModalOpen}
        onClose={props.onCloseGavetaModal}
        message={UI_STRINGS.pdv.gavetaModal.message}
      />
      <KgProductWeightModal
        isOpen={Boolean(props.isKgModalOpen)}
        onClose={props.onCloseKgModal || (() => {})}
        product={props.selectedKgProduct ?? null}
        onConfirm={props.onConfirmKgProduct || (() => {})}
      />
    </>
  )
}

export const PdvModals: React.FC<PdvModalsProps> = (props) => {
  return (
    <>
      <PdvCheckoutModals {...props} />
      <PdvToolModals {...props} />
    </>
  )
}
