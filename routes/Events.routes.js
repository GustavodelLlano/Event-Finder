const router = require("express").Router()
const Event = require("../models/Event.model")

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
router.get("/events/:id/edit", (req, res, next) => {
    const eventId = req.params.id

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
router.post("/events/:id/delete", (req, res, next) => {
    const eventId = req.params.id
    Event
        .findByIdAndDelete(eventId)
        .then(() => res.redirect("/events"))
        .catch(err => next(err))
})

//event search form render
router.get("/events", (req, res, next) => {
    res.render("events/event-search")
})

//event search handle
router.post("/events", (req, res, next) => {
    const { name } = req.body

    Event
        .find()
        .then(allEvents => {
            const filteredEvents = allEvents.filter(event => {
                return event.name.toLowerCase().includes(name)
            })
            res.render("events/event-list", { filteredEvents })
        })
        .catch(err => next(err))
})

//event details render
router.get("/events/:id/details", (req, res, next) => {
    const eventId = req.params.id

    Event
        .findById(eventId)
        .then(event => res.render("events/event-details", { event }))
        .catch(err => next(err))
})





module.exports = router