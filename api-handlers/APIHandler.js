const axios = require("axios")

class APIHandler {
    constructor () {
    
        this.axiosApp = axios.create({
          baseURL: "https://app.ticketmaster.com/discovery/v2/"
        })
      }
    
      eventFullList() {
        return this.axiosApp.get(`events.json?size=10&apikey=${process.env.TICKETKEY}`)
      }

      eventByKeyword(searchWord) {
        return this.axiosApp.get(`events.json?keyword=${searchWord}&size=10&apikey=${process.env.TICKETKEY}`)
      }

      eventById(eventId) {
        return this.axiosApp.get(`events/${eventId}.json?apikey=${process.env.TICKETKEY}`)
      }

    }

    module.exports = APIHandler
    