const router = require("express").Router()
const User = require('../models/User.model')
const { isLoggedIn, checkRole, isSameUser } = require("../middleware/route-guard")
const { isUser, isArtist, isAdmin, isSameUserr } = require("../utils")
const { updateOne } = require("../models/User.model")


// Each user route
router.get('/user/:userId', isLoggedIn, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .then(user => res.render('user/user-profile', user))
        .catch(err => next(err))
})

// User edit form render
router.get('/user/:userId/edit', isLoggedIn, isSameUser, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .then(user => {
            res.render('user/user-edit', user)
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
    // const { friends } = req.session.currentUser.friends

    // console.log('LO QUE NO DESESTRUCTURAMOS:', req.session.currentUser._id)
    // console.log('LO QUE SÍ DESESTRUCTURAMOS:', req.params

    if (!myUser.friends.includes(friendId.toString())) {
        User
            .findByIdAndUpdate(userId, { $push: { friends: friendId } }, { new: true })
            .then(user => {
                req.session.currentUser = user
                res.redirect(`/user/${userId}/friends`)
            })
            .catch(err => next(err))
    } else {
        res.redirect(`/user/${userId}/friends`)      // la vista solo funciona cuando ya son amigos
    }

})

// Add to wishEvents
router.post('/user/:eventId/add-event', isLoggedIn, (req, res, next) => {

    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { eventId } = req.params

    console.log('MY USER:', myUser)
    console.log('USER ID:', userId)
    console.log('EVENT ID', eventId)

    if (!myUser.wishEvents[1].includes(eventId.toString())) {
        User
            .findByIdAndUpdate(eventId, { $push: { wishEvents: eventId } }, { new: true })
            .then(user => {
                user = req.session.currentUser
                res.render('events/event-list', { user })
            })
            .catch(err => next(err))
    } else {
        res.redirect(`/user/${userId}`)
    }

})

// Add to artistEvents
// Add to attendedEvents


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
            const filteredUsers = allUsers.filter(user => {
                return user.username.toLowerCase().includes(username)
            })
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