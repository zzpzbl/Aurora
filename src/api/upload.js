import axios from './index'

export function uploadNewImage(image) {
  const formData = new FormData();
  formData.append('file', image);
  return axios.post('/meta/save',  formData, formData, {headers: {'Content-Type': 'multipart/form-data'}});
}