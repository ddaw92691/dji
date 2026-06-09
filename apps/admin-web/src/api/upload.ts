import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export const uploadApi = {
  postImage: (file: File, bizType: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bizType', bizType)
    return request.post<ICommonResponse<any>>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
