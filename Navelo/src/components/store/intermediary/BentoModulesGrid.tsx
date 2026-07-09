import * as React from "react"
import { Grid } from "@/components/store/base/Grid"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { BENTO_ITEMS, BentoItem } from "@/src/constants/bento"

function BentoCard({ title, description, href, icon }: BentoItem) {
  return (
    <Box
      onClick={() => { window.location.href = href }}
      bg="bg-surface"
      padding={5}
      radius="default"
      border
      borderColor="border-slate-200"
      cursor="pointer"
      hoverBg="surface-sunken"
      w="full"
    >
      <Stack gap={2.5} align="start" justify="start">
        <Box w="w-12" h="h-12" radius="default" bg="bg-brand-primary/10">
          <Stack w="full" h="full" align="center" justify="center">
            <Icon icon={icon} size={24} color="primary" />
          </Stack>
        </Box>
        <Stack gap={1} align="start">
          <Font variant="body-bold" text={title} />
          <Font variant="auxiliary" text={description} />
        </Stack>
      </Stack>
    </Box>
  )
}

export function BentoModulesGrid() {
  return (
    <Grid cols={3} gap={5}>
      {BENTO_ITEMS.map((item: BentoItem) => (
        <BentoCard key={item.href} {...item} />
      ))}
    </Grid>
  )
}
