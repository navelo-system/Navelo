import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { ChangeCalculator } from "@/components/store/advanced/ChangeCalculator"
import { DollarSign } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface ChangeCalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (amount: number) => void
  launchAmount: number
}

export function ChangeCalculatorModal({
  isOpen,
  onClose,
  onConfirm,
  launchAmount,
}: ChangeCalculatorModalProps) {
  const [calculatorAmount, setCalculatorAmount] = React.useState(launchAmount)
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const [prevLaunch, setPrevLaunch] = React.useState(launchAmount)
  const m = UI_STRINGS.pdv.modals

  if (isOpen !== prevIsOpen || launchAmount !== prevLaunch) {
    setPrevIsOpen(isOpen)
    setPrevLaunch(launchAmount)
    if (isOpen) {
      setCalculatorAmount(launchAmount)
    }
  }

  const handleConfirm = () => {
    const finalAmount = calculatorAmount > 0 ? calculatorAmount : launchAmount
    onConfirm(Math.min(finalAmount, launchAmount))
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={m.changeCalculatorTitle}
      subtitle={m.changeCalculatorSubtitle}
      icon={DollarSign}
      successText={m.confirmPaymentButton}
      onSuccess={handleConfirm}
    >
      <ChangeCalculator
        totalAmount={launchAmount}
        hideHeaderAndFooter={true}
        onChange={setCalculatorAmount}
      />
    </Modal>
  )
}
