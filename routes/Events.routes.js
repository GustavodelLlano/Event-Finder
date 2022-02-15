const router = require("express").Router()
const Event = require("../models/Event.model")
const User = require('../models/User.model')

//create event RENDER
<<<<<<< HEAD
router.get("/events/create", (req, res, next) => {

    res.render("events/event-create")
})
=======
router.get("/events/create", (req, res, next) =>  res.render("events/event-create"))

>>>>>>> 718aff73788a392fcd8a3c8bacc86719093780bd
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
router.post("/events/:eventId/delete", (req, res, next) => {
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
<<<<<<< HEAD
router.get("/events/:id/details", (req, res, next) => {
    const eventId = req.params.id

    Event
        .findById(eventId)
        .then(event => res.render("events/event-details", { event }))
        .catch(err => next(err))
=======
router.get("/events/:id/details",(req, res, next) =>{
    const id = req.params.id

    Event
    .findById(id)
    .then(event =>  res.render("events/event-details", {event}))
    .catch(err => next(err))
>>>>>>> 718aff73788a392fcd8a3c8bacc86719093780bd
})


router.post("/events/:id/add", (req, res, next) => {
    const id = req.params.id

    Event
        .findById(id)
        .then((event) => {
            User
                .findByIdAndUpdate(req.session.currentUser._id)
                .populate("wishEvents.apiEvents")
                .then(user => user.wishEvents.internalEvents.push(event))
                .catch(err => next(err))
        })
        .catch(err => next(err))
})

module.exports = router