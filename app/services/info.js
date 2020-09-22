import axios from 'axios'
const baseUrl = 'https://wl-api.mf.gov.pl/api/search/nip/'
const baseUrl1 = 'https://wl-api.mf.gov.pl/api/check/nip/'

const date = new Date()

console.log('date', date)

const year = date.getFullYear()

let month = date.getMonth()+1

if(month.toString().length === 1) {
  month = '0'+month.toString()
}


let day = date.getDate()
if(day.toString().length === 1) {
  day = '0'+day.toString()
}

console.log(year,month, day)

const getByNIP = (nip) => {
  const request = axios.get(`${baseUrl}/${nip}?date=${year}-${month}-${day}`)
  return request.then(response => response.data)
}

const getByNIPACC = (nip, acc) => {
  const request = axios.get(`${baseUrl1}/${nip}/bank-account/${acc}?date=${year}-${month}-${day}`)
  return request.then(response => response.data)
}

export default {
    getByNIP,
    getByNIPACC
  }