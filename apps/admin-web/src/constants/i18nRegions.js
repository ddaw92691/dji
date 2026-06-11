export const REGION_OPTIONS = [
    { value: 'Asia Pacific', label: '亚太地区' },
    { value: 'Europe', label: '欧洲' },
    { value: 'Middle East', label: '中东' },
    { value: 'North America', label: '北美' },
    { value: 'South America', label: '南美' },
    { value: 'Other', label: '其他国家与地区' },
];
const REGION_MAP = REGION_OPTIONS.reduce((acc, r) => ({ ...acc, [r.value]: r.label }), {});
export function regionLabel(region) {
    if (!region)
        return '-';
    return REGION_MAP[region] || region;
}
