import { i18n } from '@/i18n/index';
export const TYPE_OPTIONS = [
    { label: i18n.global.t('tag.builtIn'), value: true, color: 'warning' },
    { label: i18n.global.t('tag.custom'), value: false, color: 'success' },
];
export const STATUS_OPTIONS = [
    { label: i18n.global.t('tag.enabled'), value: 'ENABLE', color: 'success' },
    { label: i18n.global.t('tag.disabled'), value: 'DISABLE', color: 'danger' },
];
export const getLabelByValue = (dict, value) => dict.find((item) => item.value === value)?.label ?? String(value);
export const ORDER_STATUS_OPTIONS = [
    { label: 'Pending Payment', value: 'pendingPayment', color: 'warning' },
    { label: 'Paid', value: 'paid', color: 'primary' },
    { label: 'Shipped', value: 'shipped', color: 'success' },
    { label: 'Completed', value: 'completed', color: 'success' },
    { label: 'Cancelled', value: 'cancelled', color: 'danger' },
];
export const PAY_STATUS_OPTIONS = [
    { label: 'Unpaid', value: 'unpaid', color: 'warning' },
    { label: 'Paid', value: 'paid', color: 'success' },
    { label: 'Failed', value: 'failed', color: 'danger' },
    { label: 'Refunded', value: 'refunded', color: 'info' },
];
export const WITHDRAWAL_STATUS_OPTIONS = [
    { label: 'Pending', value: 'PENDING', color: 'warning' },
    { label: 'Approved', value: 'APPROVED', color: 'success' },
    { label: 'Rejected', value: 'REJECTED', color: 'danger' },
];
export const COMMISSION_STATUS_OPTIONS = [
    { label: 'Frozen', value: 'FROZEN', color: 'info' },
    { label: 'Settled', value: 'SETTLED', color: 'success' },
    { label: 'Cancelled', value: 'CANCELLED', color: 'danger' },
];
export const PAYMENT_STATUS_OPTIONS = [
    { label: 'Pending', value: 'PENDING', color: 'warning' },
    { label: 'Success', value: 'SUCCESS', color: 'success' },
    { label: 'Failed', value: 'FAILED', color: 'danger' },
    { label: 'Refunded', value: 'REFUNDED', color: 'info' },
];
export const PAYMENT_METHOD_OPTIONS = [
    { label: 'Mock Payment', value: 'MOCK', color: '' },
    { label: 'Credit Card', value: 'CREDIT_CARD', color: '' },
    { label: 'Bank Transfer', value: 'BANK_TRANSFER', color: '' },
];
export const REFUND_STATUS_OPTIONS = [
    { label: 'Requested', value: 'REQUESTED', color: 'warning' },
    { label: 'Approved', value: 'APPROVED', color: 'success' },
    { label: 'Rejected', value: 'REJECTED', color: 'danger' },
];
export const COUPON_STATUS_OPTIONS = [
    { label: 'Active', value: 'ENABLE', color: 'success' },
    { label: 'Disabled', value: 'DISABLE', color: 'danger' },
    { label: 'Expired', value: 'EXPIRED', color: 'info' },
];
export const COUPON_TYPE_OPTIONS = [
    { label: 'Fixed Amount', value: 'FIXED_AMOUNT', color: '' },
    { label: 'Percentage', value: 'PERCENTAGE', color: '' },
];
export const AUDIT_ACTION_OPTIONS = [
    { label: 'Create', value: 'CREATE', color: '' },
    { label: 'Update', value: 'UPDATE', color: '' },
    { label: 'Delete', value: 'DELETE', color: '' },
    { label: 'Login', value: 'LOGIN', color: '' },
    { label: 'Logout', value: 'LOGOUT', color: '' },
    { label: 'Approve', value: 'APPROVE', color: '' },
    { label: 'Reject', value: 'REJECT', color: '' },
];
export const AUDIT_TARGET_TYPE_OPTIONS = [
    { label: 'User', value: 'USER', color: '' },
    { label: 'Product', value: 'PRODUCT', color: '' },
    { label: 'Order', value: 'ORDER', color: '' },
    { label: 'Refund', value: 'REFUND', color: '' },
    { label: 'Coupon', value: 'COUPON', color: '' },
    { label: 'Withdrawal', value: 'WITHDRAWAL', color: '' },
    { label: 'System', value: 'SYSTEM', color: '' },
];
export const getColorByValue = (dict, value) => dict.find((item) => item.value === value)?.color || 'primary';
