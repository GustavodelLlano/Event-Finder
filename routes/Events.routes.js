const router = require("express").Router()
const Event = require("../models/Event.model")
const User = require('../models/User.model')

//create event RENDER
router.get("/events/create", (req, res, next) =>  res.render("events/event-create"))

//create event HANDLE
router.post("/events/create", (req, res, next) => {
    const { eventName, type, url, eventImg, date, genre, minPrice, maxPrice, lat, lng } = req.body

    const location = {
        type: "Point",
        coordinates: [lat, lng]
    }

    Event
        .create({ eventName, type, url, eventImg, date, genre, minPrice, maxPrice, location })
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
router.post("/events/:eventId/edit", (req, res, next) => {
    const { eventName, type, url, eventImg, date, genre, minPrice, maxPrice, lat, lng } = req.body

    const location = {
        type: "Point",
        coordinates: [lat, lng]
    }

    const eventId = req.params.id
    Event
        .findByIdAndUpdate(eventId, { eventName, type, url, eventImg, date, genre, minPrice, maxPrice, location }, { new: true })
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
        .find({name})
        .then(events =>  res.render("events/event-list", {events}))
        .catch(err => next(err))
})

//event details render
router.get("/events/:id/details",(req, res, next) =>{
    const id = req.params.id

    Event
    .findById(id)
    .then(event =>  res.render("events/event-details", {event}))
    .catch(err => next(err))
})


router.post("/events/:id/add", (req, res, next) =>{
    const id = req.params.id

    Event
    .findById(id)
    .then((event)=> {
        User 
        .findByIdAndUpdate(req.session.currentUser._id )
        .populate("wishEvents.apiEvents")
        .then(user => user.wishEvents.internalEvents.push(event))
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

module.exports = router