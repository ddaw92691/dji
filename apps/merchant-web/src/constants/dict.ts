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
  { label: '在售', value: 'ON_SALE', color: 'success' },
  { label: '已下架', value: 'OFF_SALE', color: 'danger' },
  { label: '草稿', value: 'DRAFT', color: 'info' },
]

export const AUDIT_STATUS_OPTIONS: DictItem<string>[] = [
  { label: '待审核', value: 'PENDING', color: 'warning' },
  { label: '已通过', value: 'APPROVED', color: 'success' },
  { label: '已拒绝', value: 'REJECTED', color: 'danger' },
  { label: '草稿', value: 'DRAFT', color: 'info' },
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
