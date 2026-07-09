"use client"

import * as React from "react"
import { Modal } from "../../base/Modal"
import { ChangeCalculator } from "../../advanced/ChangeCalculator"
import { DiscountModal } from "./modals/DiscountModal"
import { CardTransactionModal } from "./modals/CardTransactionModal"
import { PdvSidebarDrawer } from "./modals/PdvSidebarDrawer"
import { DollarSign } from "lucide-react"

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
  discount: number
  onChangeDiscount: (val: number) => void
  isSidebarOpen: boolean
  onCloseSidebar: () => void
  onBackToDashboard: () => void
  launchAmount: number
  subtotal: number
}

export const PdvModals: React.FC<PdvModalsProps> = ({
  isChangeModalOpen,
  onCloseChangeModal,
  onConfirmChangePayment,
  isCardModalOpen,
  onCloseCardModal,
  formatPrice,
  onLaunchPayment,
  isDiscountModalOpen,
  onCloseDiscountModal,
  discount,
  onChangeDiscount,
  isSidebarOpen,
  onCloseSidebar,
  onBackToDashboard,
  launchAmount,
  subtotal,
}) => {
  const [calculatorAmount, setCalculatorAmount] = React.useState(0)

  return (
    <>
      <Modal
        isOpen={isChangeModalOpen}
        onClose={onCloseChangeModal}
        title="Calculadora de Troco"
        subtitle="Calcule o troco a ser entregue ao cliente."
        icon={DollarSign}
        successText="Confirmar Pagamento"
        onSuccess={() => {
          onConfirmChangePayment(Math.min(calculatorAmount, launchAmount))
          onCloseChangeModal()
        }}
      >
        <ChangeCalculator
          totalAmount={launchAmount}
          hideHeaderAndFooter={true}
          onChange={setCalculatorAmount}
        />
      </Modal>

      <CardTransactionModal
        isOpen={isCardModalOpen}
        onClose={onCloseCardModal}
        amountDue={launchAmount}
        formatPrice={formatPrice}
        onLaunchPayment={onLaunchPayment}
      />

      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={onCloseDiscountModal}
        discount={discount}
        onChangeDiscount={onChangeDiscount}
        subtotal={subtotal}
      />

      <PdvSidebarDrawer
        isOpen={isSidebarOpen}
        onClose={onCloseSidebar}
        onBackToDashboard={onBackToDashboard}
      />
    </>
  )
}
