/* eslint-disable react-hooks/set-state-in-effect */
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

export const ChangeCalculatorModal: React.FC<ChangeCalculatorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  launchAmount
}) => {
  const [calculatorAmount, setCalculatorAmount] = React.useState(launchAmount)
  const m = UI_STRINGS.pdv.modals

  React.useEffect(() => {
    if (isOpen) {
      setCalculatorAmount(launchAmount)
    }
  }, [isOpen, launchAmount])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={m.changeCalculatorTitle}
      subtitle={m.changeCalculatorSubtitle}
      icon={DollarSign}
      successText={m.confirmPaymentButton}
      onSuccess={() => {
        const finalAmount = calculatorAmount > 0 ? calculatorAmount : launchAmount
        onConfirm(Math.min(finalAmount, launchAmount))
        onClose()
      }}
    >
      <ChangeCalculator
        totalAmount={launchAmount}
        hideHeaderAndFooter={true}
        onChange={setCalculatorAmount}
      />
    </Modal>
  )
}
