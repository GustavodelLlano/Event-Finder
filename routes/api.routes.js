const router = require("express").Router()
const Event = require("../models/Event.model")
const APIHandler = require("../api-handlers/APIHandler")
const eventsApi = new APIHandler()

router.get("/api/maps/:eventId", (req, res, next) => {

    const { eventId } = req.params

    if (eventId.length === 24) {

        Event.findById(eventId)
            .then(event =>  res.json(event))
            .catch(err => console.log(err))

    } else {

        eventsApi
            .eventById(eventId)
            .then(apiEvent => {

                console.log(apiEvent.data._embedded.venues)

                const filteredApiEventInfo = {
                    _id: apiEvent.data.id,
                    location: {
                        type: 'Point',
                        coordinates: [Number(apiEvent.data._embedded.venues[0].location.latitude), Number(apiEvent.data._embedded.venues[0].location.longitude)]
                    },
                    name: apiEvent.data.name
                }

                res.json(filteredApiEventInfo)
            })
            .catch(err => console.log(err))
    }
})

module.exports = router