import request from '@/utils/request';
export const uploadApi = {
    postImage: (file, bizType) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bizType', bizType);
        return request.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};
