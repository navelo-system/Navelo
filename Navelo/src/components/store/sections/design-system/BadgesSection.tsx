import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Stack } from "@/components/store/base/Stack"
import { Badge } from "@/components/store/base/Badge"
import { Tags, Settings, Component, Check, Trash, MousePointerClick, Info } from "lucide-react"

export const BadgesSection: React.FC = () => {
  return (
    <RegistrySection
      title="Badges & Status Tags"
      description="Indicadores de status visuais baseados em cores de feedback."
      icon={Tags}
    >
      <Stack gap={5}>
        <Stack direction="row" gap={5} wrap>
          <Badge variant="default" label="Default" />
          <Badge variant="primary" label="Primary" />
          <Badge variant="secondary" label="Secondary" />
          <Badge variant="success" label="Success" />
          <Badge variant="danger" label="Danger" />

          <Badge variant="outline" rounded="full" label="Pill Outline" />
          <Badge variant="primary" rounded="full" label="Pill Primary" />
          <Badge variant="secondary" rounded="full" label="Pill Secondary" />
          <Badge variant="success" rounded="full" label="Pill Badge" />
          <Badge variant="danger" rounded="full" label="Pill Danger" />
        </Stack>
        <Stack direction="row" gap={5} wrap>
          <Badge variant="default" label="Default" icon={Settings} />
          <Badge variant="primary" label="Primary" icon={Component} />
          <Badge variant="secondary" label="Secondary" icon={Tags} />
          <Badge variant="success" label="Success" icon={Check} />
          <Badge variant="danger" label="Danger" icon={Trash} />

          <Badge variant="outline" rounded="full" label="Pill Outline" icon={MousePointerClick} />
          <Badge variant="primary" rounded="full" label="Pill Primary" icon={Component} />
          <Badge variant="secondary" rounded="full" label="Pill Secondary" icon={Tags} />
          <Badge variant="success" rounded="full" label="Pill Badge" icon={Info} />
          <Badge variant="danger" rounded="full" label="Pill Danger" icon={Trash} />
        </Stack>
      </Stack>
    </RegistrySection>
  )
}
