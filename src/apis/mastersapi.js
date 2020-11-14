import axios from 'axios';

const api = "https://www.masters.com/en_US/scores/feeds/scores.json"


export function mastersAPI(callback){

	axios.get(api).then(res => {
        callback(res.data)
    }).catch(error =>{
      	console.log(error)
      	callback(error)
    })
}