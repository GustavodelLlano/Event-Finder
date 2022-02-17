const router = require("express").Router()
const Event = require("../models/Event.model")
const APIHandler = require("../api-handlers/APIHandler")
const eventsApi = new APIHandler()

router.get("/api/maps/:eventId", (req, res, next) => {

    const {eventId} = req.params
    console.log(eventId.length)

    if (eventId.length === 24){
    
    Event.findById(eventId)
         .then(event => res.json(event))
         .catch(err => console.log(err))
        }
else{

    const responsePromise = eventsApi.eventById(eventId)

    Promise.all([responsePromise])
    .then(data => {
        const response = data
        
        const apiEvent = response[0].data
        const filteredApiEvent = {
            _id: apiEvent.id,
            location: {
                type: 'Point',
                coordinates: [apiEvent._embedded.venues[0].location.longitude, apiEvent._embedded.venues[0].location.latitude]
            },
            name: apiEvent.name
        }
        res.json(filteredApiEvent)
    })
    
}
})
module.exports = router