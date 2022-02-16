const router = require("express").Router()
const { updateOne } = require("../models/Event.model")
const Event = require("../models/Event.model")
const User = require('../models/User.model')
const { isUser, isArtist, isAdmin , isSameUserr} = require("../utils")
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
    const {eventId} = req.params
    
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
    const {eventId} = req.params
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

    const internalEventsPromise = Event.find()
    const responsePromise = eventsApi.eventByKeyword(name)

   
    Promise.all([internalEventsPromise, responsePromise])
        .then(data => {
            
            const [ internalEvents, response ] = data
            const apiEvents = response.data._embedded.events

            console.log('INTERNAL EVENTS ===>', response.data._embedded.events)

            // const formattedApiEvents = apiEvents.map(event => {
            //     return {
            //         name: event.name,
            //         type: event.type,
            //         url: event.url,
            //         eventImg: event.images[0].AQUI FALT ALGO,
            //         date: 
            //         genre:
            //         minPrice: 
            //         maxPrice:
            //         location: {
            //             type: 'Point',
            //             coordinates: [lat: , lng:]
            //         }
            //     }
            // })

            // SI LE DAIS EL MISMO FORMATO A LOS EVENTOS DE LA API QUE A LOS VUESTROS
            // LUEGO PODEIS CONCATENAR AMBOS ARRAYS EN UNO SOLO QUE SE LLAME EVENTS (POR EJEMPLO)
            // Y PASARLE ESO A LA VISTA PRECIOSO
            res.render("events/event-list", { internalEvents, apiEvents })
        })

    // Event
    //     .find()
    //     .then(allEvents => {
    //         const filteredEvents = allEvents.filter(event => {
    //             return event.name.toLowerCase().includes(name)
    //         })
    //         res.render("events/event-list", { filteredEvents })
    //     })
    //     .catch(err => next(err))

    // eventsApi
    //     .eventByKeyword(name)
})

//event details render
router.get("/events/:id/details",(req, res, next) =>{
    const id = req.params.id

    Event
    .findById(id)
    .then(event =>  res.render("events/event-details", {event}))
    .catch(err => next(err))

    
})

//add event to whislist

router.post("/events/:id/add", (req, res, next) => {
    const id = req.params.id
    
    Event   
    .findById(id)
    .then(event =>{
       
         User
         .findByIdAndUpdate(
             {_id: req.session.currentUser._id},
             {$push: {internalEvents: event._id}},
             {new: true}
         )
         .then(user => console.log( _id))
    })
})

module.exports = router