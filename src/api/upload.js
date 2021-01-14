import axios from './index'

export function uploadNewImage(image) {
  const formData = new FormData();
  formData.append('file', image);
  console.log("555");
  return axios.post('/aurora/image',  formData, {headers: {'Content-Type': 'multipart/form-data'}});
}