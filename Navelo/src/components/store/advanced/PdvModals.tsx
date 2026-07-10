"use client"

import * as React from "react"
import { DiscountModal } from "@/components/store/sections/pdv/modals/DiscountModal"
import { ChangeCalculatorModal } from "@/components/store/sections/pdv/modals/ChangeCalculatorModal"
import { CardTransactionModal } from "@/components/store/sections/pdv/modals/CardTransactionModal"
import { PdvSidebarDrawer } from "@/components/store/sections/pdv/modals/PdvSidebarDrawer"

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
  return (
    <>
      <ChangeCalculatorModal
        isOpen={isChangeModalOpen}
        onClose={onCloseChangeModal}
        onConfirm={onConfirmChangePayment}
        launchAmount={launchAmount}
      />

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
