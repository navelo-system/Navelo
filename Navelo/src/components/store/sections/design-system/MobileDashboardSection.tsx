import * as React from "react"
import { RegistrySection } from "../../advanced/RegistrySection"
import { MobileBentoDashboard } from "../../advanced/MobileBentoDashboard"
import { Smartphone } from "lucide-react"

export const MobileDashboardSection: React.FC = () => {
  return (
    <RegistrySection
      title="Painel Mobile-First (Bento Grid)"
      description="Layout de menu em grade otimizado para SmartPOS, tablets e smartphones com cabeçalho de status, cards de caixa com controle de privacidade e botões de atalho circular."
      icon={Smartphone}
    >
      <MobileBentoDashboard />
    </RegistrySection>
  )
}

export default MobileDashboardSection
