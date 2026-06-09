import axios from 'axios'
const uploadApi = {
  uploadImage: (file: File, bizType: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bizType', bizType)
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
    return axios.post(baseURL + '/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + (localStorage.getItem('token') || '') },
    })
  },
}
export default uploadApi
