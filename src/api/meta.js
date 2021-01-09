import axios from './index'

export function getTypeByName(name) {
  return axios.get('/meta/find', {params:{name}});
}

export function updateType(params) {
  return axios.put('/meta/updateManualtype', params);
}