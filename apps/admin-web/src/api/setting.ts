import request from '@/utils/request'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

export interface SettingItem {
  id: number
  settingKey: string
  settingValue: string
  description: string
  groupName: string
  createdAt: string
  updatedAt: string
}

export const settingApi = {
  getSettings: (params?: any) =>
    request.get<ICommonPageResponse<SettingItem[]>>('/admin/settings', { params }),

  updateSetting: (key: string, value: string, description?: string) =>
    request.put<ICommonResponse<any>>(`/admin/settings/${key}`, { value, description }),

  batchUpdateSettings: (settings: { key: string; value: string }[]) =>
    request.put<ICommonResponse<any>>('/admin/settings', { settings }),
}
