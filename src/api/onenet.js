import axios from 'axios'


export const onenet = {
    ossInfo () {
        return axios({
          url: `https://picture.thingcom.cn/web/token`,
          method: 'get',
          
        })
          .then(response => {
            return response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
    datapoint(info){
      return axios({
        url: `http://onenet.zn.thingcom.com/devices/${info.id}/datapoints?datastream_id=${info.datastream_id}`,
        method: 'get',
        headers: {
          'api-key': info.apikey
        },
      })
        .then(response => {
          return response.data
        })
        .catch(error => {
          console.log(error)
        })
    }
}