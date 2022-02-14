const router = require("express").Router()
const Event = require("../models/Event.model")

//create event RENDER
router.get("/events/create", (req, res, next) => {
    res.render("/Events/event-create")
})
//create event HANDLE
router.post("/events/create", (req, res, next) => {
    const { eventname, type, url, eventImg, date, genre, minPrice, maxPrice, lat, lng } = req.body

    const location = {
        type: "Point",
        coordinates: [lat, lng]
    }

    Event
        .create({ eventname, type, url, eventImg, date, genre, minPrice, maxPrice, location })
        .then(() => res.redirect("/events"))
        .catch(err => next(err))
})

//update event RENDER
router.get("/events/:id/update", (req, res, next) => {
    const eventId = req.params.id

    Event
        .findById(eventId)
        .then(event => res.render("Events/event-edit", event))
        .catch(err => next(err))
})

//HANDLE
router.post("/events/:id/update", (req, res, next) => {
    const { eventname, type, url, eventImg, date, genre, minPrice, maxPrice, lat, lng } = req.body

    const location = {
        type: "Point",
        coordinates: [lat, lng]
    }

    const eventId = req.params.id
    Place
        .findByIdAndUpdate(eventId, { eventname, type, url, eventImg, date, genre, minPrice, maxPrice, location }, { new: true })
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




// //event search form render
// router.get("/events", (req, res, next) => {
//     res.render("search form")
// })

// //event search handle
// router.post("/events", (req, res, next) => {
//     const { name, type, url, img, date, genre, minPrice, maxPrice, location } = req.body

//     Event
//         .find()
//         .then(events => res.render("/events/list", events))
// })





module.exports = router