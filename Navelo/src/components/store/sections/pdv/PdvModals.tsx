"use client"

import * as React from "react"
import { Modal } from "../../base/Modal"
import { ChangeCalculator } from "../../advanced/ChangeCalculator"
import { DiscountModal } from "./modals/DiscountModal"
import { CardTransactionModal } from "./modals/CardTransactionModal"
import { PdvSidebarDrawer } from "./modals/PdvSidebarDrawer"

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
}) => {
  return (
    <>
      <Modal isOpen={isChangeModalOpen} onClose={onCloseChangeModal}>
        <ChangeCalculator
          totalAmount={launchAmount}
          onConfirm={(receivedAmount) => onConfirmChangePayment(Math.min(receivedAmount, launchAmount))}
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
      />

      <PdvSidebarDrawer
        isOpen={isSidebarOpen}
        onClose={onCloseSidebar}
        onBackToDashboard={onBackToDashboard}
      />
    </>
  )
}
