import axios from './index'

export function uploadNewImage(image) {
  return axios.post('/meta/save',  image);
}