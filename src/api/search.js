import axios from './index'

export function getThumb(params) {
  return axios.get('/Thumb/find', {params});
}

export function getImageByName(name) {
  return axios.get('/image/find', {params:{name}});
}

export function getKeogram(params) {
  return axios.get('/keogram/find', {params});
}

export function getSimilarByImage(image) {
  // console.log('image', image);
  const formData = new FormData();
  formData.append('file', image);
  console.log(formData);
  return axios.post('/feature/get', formData, {headers: {'Content-Type': 'multipart/form-data'}});
}