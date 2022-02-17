const router = require("express").Router()
const { updateOne } = require("../models/Event.model")
const Event = require("../models/Event.model")
const User = require('../models/User.model')
const { isUser, isArtist, isAdmin } = require("../utils")
const APIHandler = require("../api-handlers/APIHandler")
const eventsApi = new APIHandler()


//create event RENDER
router.get("/events/create", (req, res, next) => {

    res.render("events/event-create")
})
//create event HANDLE
router.post("/events/create", (req, res, next) => {
    const { name, type, url, eventImg, date, genre, minPrice, maxPrice, lat, lng } = req.body

    const location = {
        type: "Point",
        coordinates: [lat, lng]
    }

    Event
        .create({ name, type, url, eventImg, date, genre, minPrice, maxPrice, location })
        .then(() => res.redirect("/events"))
        .catch(err => next(err))
})

//update event RENDER
router.get("/events/:eventId/edit", (req, res, next) => {
    const { eventId } = req.params

    Event
        .findById(eventId)
        .then(event => res.render("events/event-edit", event))
        .catch(err => next(err))
})

//HANDLE
router.post("/events/:id/edit", (req, res, next) => {
    const { name, type, url, eventImg, date, genre, minPrice, maxPrice, lat, lng } = req.body

    const location = {
        type: "Point",
        coordinates: [lat, lng]
    }

    const eventId = req.params.id
    Event
        .findByIdAndUpdate(eventId, { name, type, url, eventImg, date, genre, minPrice, maxPrice, location }, { new: true })
        .then(() => res.redirect("/events"))
        .catch(err => next(err))
})

//Delete
router.post("/events/:eventId/delete", (req, res, next) => {
    const { eventId } = req.params
    Event
        .findByIdAndDelete(eventId)
        .then(() => res.redirect("/events"))
        .catch(err => next(err))
})



//event search form render
router.get("/events", (req, res, next) => {
    res.render("events/event-search", { user: req.session.currentUser, isArtist: isArtist(req.session.currentUser) }) // NO FUNCHIONA 
})

//event search handle
router.post("/events", (req, res, next) => {

    const { name } = req.body

    const internalEventsPromise = Event.find()
    const responsePromise = eventsApi.eventByKeyword(name)


    Promise.all([internalEventsPromise, responsePromise])
        .then(data => {

            const [internalEvents, response] = data
            const apiEvents = response.data._embedded.events
            const filteredInternalEvents = internalEvents.filter(event => {
                return event.name.toLowerCase().includes(name.toLowerCase())
            })

            const formattedApiEvents = apiEvents.map(event => {
                return {
                    _id: event.id,
                    name: event.name,
                    type: event.type,
                    url: event.url,
                    eventImg: event.images[0].url,
                    date: event.dates.start.localDate,
                    genre: event.classifications[0].genre.name,
                    minPrice: event.priceRanges[0].min,
                    maxPrice: event.priceRanges[0].max,
                    location: {
                        type: 'Point',
                        coordinates: [event._embedded.venues[0].location.longitude, event._embedded.venues[0].location.latitude]
                    },
                    isFromApi: true
                }
            })
            const allEvents = filteredInternalEvents.concat(formattedApiEvents)

            res.render("events/event-list", { allEvents })

        })
        .catch(err => next(err))
})

//event details render
router.get("/events/:id/details", (req, res, next) => {
    const id = req.params.id

    if (req.query.api) {
        const responsePromise = eventsApi.eventById(id)
        Promise.all([responsePromise])
            .then(data => {
                const response = data
                const apiEvent = response[0].data
                const filteredInternalEvent = {
                    _id: apiEvent.id,
                    name: apiEvent.name,
                    type: apiEvent.type,
                    url: apiEvent.url,
                    eventImg: apiEvent.images[0].url,
                    date: apiEvent.dates.start.localDate,
                    genre: apiEvent.classifications[0].genre.name,
                    minPrice: apiEvent.priceRanges[0].min,
                    maxPrice: apiEvent.priceRanges[0].max,
                    location: {
                        type: 'Point',
                        coordinates: [apiEvent._embedded.venues[0].location.longitude, apiEvent._embedded.venues[0].location.latitude]
                    },
                    isFromApi: true
                }

                res.render("events/event-details", { filteredInternalEvent })

            })
            .catch(err => next(err))


    } else {
        Event
            .findById(id)
            .then(event => res.render("events/event-details", { event }))
            .catch(err => next(err))
    }


})


module.exports = router