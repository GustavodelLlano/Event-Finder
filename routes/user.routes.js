const router = require("express").Router()
const User = require('../models/User.model')
const { isLoggedIn, checkRole, isSameUser } = require("../middleware/route-guard")
const { isUser, isArtist, isAdmin, isSameUserr } = require("../utils")
const { updateOne, findByIdAndUpdate } = require("../models/User.model")
const APIHandler = require("../api-handlers/APIHandler")
const eventsApi = new APIHandler()

// Each user route
router.get('/user/:userId', isLoggedIn, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .populate('wishEvents.internalEvents attendedEvents.internalEvents artistEvents.internalEvents')
        .then(user => {

            const wishApiEventsPromises = Promise.all(user.wishEvents.apiEvents.map(event => eventsApi.eventById(event)))
            const attendedApiEventsPromises = Promise.all(user.attendedEvents.apiEvents.map(event => eventsApi.eventById(event)))
            const artistEventsPromises = Promise.all(user.artistEvents.apiEvents.map(event => eventsApi.eventById(event)))

            Promise.all([wishApiEventsPromises, attendedApiEventsPromises, artistEventsPromises])
                .then(response => {

                    const [wishApiEventsAxiosArr, attendedApiEventsAxiosArr, artistEventsAxiosArr] = response

                    const wishApiEvents = wishApiEventsAxiosArr.map(event => {
                        return {
                            eventImg: event.data.images[0].url,
                            name: event.data.name,
                            date: event.data.dates.start.localDate
                        }
                    })

                    const attendedApiEvents = attendedApiEventsAxiosArr.map(event => {
                        return {
                            eventImg: event.data.images[0].url,
                            name: event.data.name,
                            date: event.data.dates.start.localDate
                        }
                    })

                    const artistApiEvents = artistEventsAxiosArr.map(event => {
                        return {
                            eventImg: event.data.images[0].url,
                            name: event.data.name,
                            date: event.data.dates.start.localDate
                        }
                    })

                    const userCopy = JSON.parse(JSON.stringify(user))
                    userCopy.wishEvents.apiEvents = wishApiEvents
                    userCopy.attendedEvents.apiEvents = attendedApiEvents
                    userCopy.artistEvents.apiEvents = artistApiEvents

                    res.render('user/user-profile', { user, userCopy, isArtist: isArtist(userCopy) })
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
})


// User edit form render
router.get('/user/:userId/edit', isLoggedIn, isSameUser, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .then(user => {
            res.render('user/user-edit', { user, isAdmin: isAdmin(req.session.currentUser) })
        })
        .catch(err => next(err))
})

// User edit form handler
router.post('/user/:userId/edit', isLoggedIn, isSameUser, (req, res, next) => {

    const { userId } = req.params
    const { username, email, passwordHash, profileImg, description, role } = req.body

    User
        .findByIdAndUpdate(userId, { username, email, passwordHash, profileImg, description, role }, { new: true })
        .then(updateUser => {
            res.render('user/user-edit', { updateUser })
        })
        .catch(err => next(err))
})

// Show user friends
router.get('/user/:userId/friends', isLoggedIn, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .populate('friends')
        .then(user => {
            res.render('user/user-friends', { user })
        })
        .catch(err => next(err))
})

// Add to my friends 
router.post('/user/:friendId/add-friend', isLoggedIn, (req, res, next) => {

    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { friendId } = req.params


    if (!myUser.friends.includes(friendId.toString())) {
        User
            .findByIdAndUpdate(userId, { $push: { friends: friendId } }, { new: true })
            .then(user => {
                req.session.currentUser = user
                res.redirect(`/user/${userId}/friends`)
            })
            .catch(err => next(err))
    } else {
        res.redirect(`/user/${userId}/friends`)
    }

})

// Add to wishEvents 
router.post('/user/:eventId/add-event', isLoggedIn, isSameUser, (req, res, next) => {

    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { eventId } = req.params

    if (req.query.api) {
        if (!myUser.wishEvents.apiEvents.includes({ id: eventId.toString() })) {
            const responsePromise = eventsApi.eventById(eventId)
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

                    User
                        .findByIdAndUpdate(userId, { $push: { 'wishEvents.apiEvents': filteredInternalEvent._id } }, { new: true })
                        .then(user => {
                            req.session.currentUser = user
                            res.redirect(`/user/${userId}`)
                        })
                        .catch(err => next(err))
                })

        } else {
            res.redirect(`/user/${userId}`)
        }
    } else {
        if (!myUser.wishEvents.internalEvents.includes({ id: eventId.toString() })) {
            User
                .findByIdAndUpdate(userId, { $push: { 'wishEvents.internalEvents': eventId } }, { new: true })
                .then(user => {
                    req.session.currentUser = user
                    res.redirect(`/user/${userId}`)
                })
                .catch(err => next(err))
        } else {
            res.redirect(`/user/${userId}`)
        }
    }
})

// Add to attendedEvents
router.post('/user/:eventId/add-past-event', isLoggedIn, isSameUser, (req, res, next) => {

    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { eventId } = req.params

    if (req.query.api) {
        if (!myUser.attendedEvents.apiEvents.includes({ id: eventId.toString() })) {
            const responsePromise = eventsApi.eventById(eventId)
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
                    User
                        .findByIdAndUpdate(userId, { $push: { 'attendedEvents.apiEvents': filteredInternalEvent._id } }, { new: true })
                        .then(user => {
                            req.session.currentUser = user
                            res.redirect(`/user/${userId}`)
                        })
                        .catch(err => next(err))
                })

        } else {
            res.redirect(`/user/${userId}`)
        }
    } else {
        if (!myUser.attendedEvents.internalEvents.includes({ id: eventId.toString() })) {
            User
                .findByIdAndUpdate(userId, { $push: { 'attendedEvents.internalEvents': eventId } }, { new: true })
                .then(user => {
                    req.session.currentUser = user
                    res.redirect(`/user/${userId}`)
                })
                .catch(err => next(err))
        } else {
            res.redirect(`/user/${userId}`)
        }
    }



})

// Add to artistEvents
router.post('/user/:eventId/artist-event', isLoggedIn, isSameUser, checkRole('ARTIST'), (req, res, next) => {

    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { eventId } = req.params

    if (req.query.api) {
        if (!myUser.artistEvents.apiEvents.includes({ id: eventId.toString() })) {
            const responsePromise = eventsApi.eventById(eventId)
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
                    User
                        .findByIdAndUpdate(userId, { $push: { 'artistEvents.apiEvents': filteredInternalEvent._id } }, { new: true })
                        .then(user => {
                            req.session.currentUser = user
                            res.redirect(`/user/${userId}`)
                        })
                        .catch(err => next(err))
                })

        } else {
            res.redirect(`/user/${userId}`)
        }
    } else {
        if (!myUser.artistEvents.internalEvents.includes({ id: eventId.toString() })) {
            User
                .findByIdAndUpdate(userId, { $push: { 'artistEvents.internalEvents': eventId } }, { new: true })
                .then(user => {
                    req.session.currentUser = user
                    res.redirect(`/user/${userId}`)
                })
                .catch(err => next(err))
        } else {
            res.redirect(`/user/${userId}`)
        }
    }
})



// User search

// User search form render
router.get("/users", (req, res, next) => {
    res.render("user/user-search")
})

// User search handle
router.post("/users", (req, res, next) => {
    const { username } = req.body

    User
        .find()
        .then(allUsers => {
            const filteredUsers = allUsers.filter(user => user.username.toLowerCase().includes(username.toLowerCase()))
            res.render("user/user-list", { filteredUsers })
        })
        .catch(err => next(err))
})


// Delete user
router.post('/user/:userId/delete', isLoggedIn, isAdmin, (req, res, next) => {
    const { userId } = req.params

    User
        .findByIdAndRemove(userId)
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})


module.exports = router