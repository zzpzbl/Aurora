import axios from './index'

export function getThumb(params) {
  console.log("start: " + params.startTime);
  console.log("end: " + params.endTime);
  return axios.get('/aurora/thumb', {params});
}

export function getImageByName(name) {
  return axios.get('/aurora/image/name/' + name);
}

export function getKeogram(params) {
  console.log("555");
  return axios.get('/aurora/keogram', {params});
}

export function getSimilarByImage(image) {
  // console.log('image', image);
  const formData = new FormData();
  formData.append('file', image);
  console.log(formData);
  return axios.post('/feature/get', formData, {headers: {'Content-Type': 'multipart/form-data'}});
}