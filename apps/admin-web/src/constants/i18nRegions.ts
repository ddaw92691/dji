// 国家区域分组（与官网/商城语言选择器分组保持一致）
export interface RegionOption {
  value: string
  label: string
}

export const REGION_OPTIONS: RegionOption[] = [
  { value: 'Asia Pacific', label: '亚太地区' },
  { value: 'Europe', label: '欧洲' },
  { value: 'Middle East', label: '中东' },
  { value: 'North America', label: '北美' },
  { value: 'South America', label: '南美' },
  { value: 'Other', label: '其他国家与地区' },
]

const REGION_MAP: Record<string, string> = REGION_OPTIONS.reduce(
  (acc, r) => ({ ...acc, [r.value]: r.label }),
  {},
)

export function regionLabel(region?: string): string {
  if (!region) return '-'
  return REGION_MAP[region] || region
}
