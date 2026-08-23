import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Edit2, MapPin } from "lucide-react"
import { CustomerAddress } from "@/src/types/domain"
import { UI_STRINGS } from "@/constants/strings"

export interface AddressListProps {
  addresses: CustomerAddress[]
  onEdit?: (address: CustomerAddress) => void
  onDelete?: (address: CustomerAddress) => void
}

interface AddressCardItemProps {
  addr: CustomerAddress
  isMultiple: boolean
  onEdit?: (address: CustomerAddress) => void
  onDelete?: (address: CustomerAddress) => void
}

function resolveAddressTexts(addr: CustomerAddress) {
  let streetText = addr.street
  if (addr.number && addr.number !== "S/N" && !addr.street.includes(addr.number)) {
    streetText = `${addr.street}, ${addr.number}`
  }

  const parts: string[] = []
  if (addr.neighborhood) parts.push(addr.neighborhood)
  if (addr.city) {
    parts.push(addr.state ? `${addr.city}/${addr.state}` : addr.city)
  }
  if (addr.zipCode) {
    parts.push(`CEP: ${addr.zipCode}`)
  }

  return {
    streetText,
    detailsText: parts.join(" - "),
    hasDetails: parts.length > 0,
  }
}

function AddressCardItem({ addr, isMultiple, onEdit, onDelete }: AddressCardItemProps) {
  const cust = UI_STRINGS.customers
  const { streetText, detailsText, hasDetails } = resolveAddressTexts(addr)

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit?.(addr)
  }

  return (
    <Box padding={5} border borderColor="border-border" radius="default" w="full">
      <Stack gap={2.5} w="full">
        <Stack direction="row" justify="between" align="center" w="full">
          <Box padding={2.5} bg="bg-brand-primary/10" radius="full">
            <Icon icon={MapPin} size={20} color="primary" />
          </Box>
          <Stack direction="row" gap={2.5} align="center">
            <Button
              type="button"
              variant="primary-icon-xs"
              icon={Edit2}
              onClick={handleEditClick}
              title={cust.editAddressTitle}
            />
            {onDelete && (
              <Button
                type="button"
                variant="danger-icon-xs-confirm"
                confirmTitle={cust.deleteAddressConfirmTitle}
                confirmSubtitle={cust.deleteAddressConfirmSubtitle}
                confirmParagraph={cust.deleteAddressConfirmParagraph}
                onConfirm={() => onDelete(addr)}
                title={cust.deleteAddressTitle}
              />
            )}
          </Stack>
        </Stack>

        <Stack gap={1} w="full" align="start">
          <Stack direction="row" align="center" gap={2.5} wrap={true}>
            <Font variant="body-bold" text={streetText} />
            {isMultiple && addr.isDefault && <Badge variant="primary" label={cust.defaultAddressBadge} />}
          </Stack>
          {hasDetails && <Font variant="description" text={detailsText} />}
          {addr.complement && <Font variant="auxiliary" color="muted" text={`Complemento: ${addr.complement}`} />}
        </Stack>
      </Stack>
    </Box>
  )
}

export function safeParseCustomerAddresses(addrs: unknown): CustomerAddress[] {
  if (Array.isArray(addrs)) return addrs
  if (typeof addrs === "string" && addrs.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(addrs)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // ignore
    }
  }
  return []
}

export function AddressList({ addresses, onEdit, onDelete }: AddressListProps) {
  const cust = UI_STRINGS.customers
  const safeList = safeParseCustomerAddresses(addresses)

  if (safeList.length === 0) {
    return <EmptyState icon={MapPin} title={cust.emptyAddressTitle} subtitle={cust.emptyAddressSubtitle} />
  }

  return (
    <Stack gap={2.5}>
      {safeList.map((addr) => (
        <AddressCardItem
          key={addr.id}
          addr={addr}
          isMultiple={safeList.length > 1}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  )
}
