import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { ChangeCalculator } from "@/components/store/advanced/ChangeCalculator"
import { DollarSign } from "lucide-react"

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
  const [calculatorAmount, setCalculatorAmount] = React.useState(0)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Calculadora de Troco"
      subtitle="Calcule o troco a ser entregue ao cliente."
      icon={DollarSign}
      successText="Confirmar Pagamento"
      onSuccess={() => {
        onConfirm(Math.min(calculatorAmount, launchAmount))
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
