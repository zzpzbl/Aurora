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