import { i18n } from '@/i18n/index'

export type TagType = '' | 'success' | 'primary' | 'warning' | 'info' | 'danger'

export interface DictItem<T = string | number> {
  label: string
  value: T
  color?: TagType
  remark?: string
}

export const TYPE_OPTIONS: DictItem<boolean>[] = [
  { label: i18n.global.t('tag.builtIn'), value: true, color: 'warning' },
  { label: i18n.global.t('tag.custom'), value: false, color: 'success' },
]

export const STATUS_OPTIONS: DictItem<string>[] = [
  { label: i18n.global.t('tag.enabled'), value: 'active', color: 'success' },
  { label: i18n.global.t('tag.disabled'), value: 'inactive', color: 'danger' },
]

export const getLabelByValue = <T extends string | number | boolean>(
  dict: DictItem<T>[],
  value: T,
): string => dict.find((item) => item.value === value)?.label ?? String(value)

export const PRODUCT_STATUS_OPTIONS: DictItem<string>[] = [
  { label: i18n.global.t('tag.enabled') || 'On Sale', value: 'active', color: 'success' },
  { label: i18n.global.t('tag.disabled') || 'Off Sale', value: 'inactive', color: 'danger' },
]

export const AUDIT_STATUS_OPTIONS: DictItem<string>[] = [
  { label: 'Pending', value: 'pending', color: 'warning' },
  { label: 'Approved', value: 'approved', color: 'success' },
  { label: 'Rejected', value: 'rejected', color: 'danger' },
]

export const ORDER_STATUS_OPTIONS: DictItem<string>[] = [
  { label: 'Pending Payment', value: 'pendingPayment', color: 'warning' },
  { label: 'Paid', value: 'paid', color: 'primary' },
  { label: 'Shipped', value: 'shipped', color: 'success' },
  { label: 'Completed', value: 'completed', color: 'success' },
  { label: 'Cancelled', value: 'cancelled', color: 'danger' },
]

export const PAY_STATUS_OPTIONS: DictItem<string>[] = [
  { label: 'Unpaid', value: 'unpaid', color: 'warning' },
  { label: 'Paid', value: 'paid', color: 'success' },
  { label: 'Failed', value: 'failed', color: 'danger' },
  { label: 'Refunded', value: 'refunded', color: 'info' },
]

export const getColorByValue = <T extends string | number | boolean>(
  dict: DictItem<T>[],
  value: T,
): Exclude<TagType, ''> => dict.find((item) => item.value === value)?.color || 'primary'
