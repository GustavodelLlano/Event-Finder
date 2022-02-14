const router = require("express").Router()
const User = require('../models/User.model')
const { isLoggedIn, checkRole } = require("../middleware/route-guard")
const { isUser, isArtist, isAdmin, isSameUser } = require("../utils")

// Create user
router.get('/singup', (req, res) => {
    User
        .find()
        .then(users => res.render('user/user-create', { users }))
        .catch(err => next(err))
})

router.post('/singup', (req, res) => {

    const { username, email, passwordHash, profileImg, description } = req.body

    User
        .create({ username, email, passwordHash, profileImg, description })
        .then(() => res.redirect('user/user-create'))
        .catch(err => next(err))
})


// Each user route
router.get('/user/:id', isLoggedIn, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .then(() => {
            res.render('user/user-profile')
        })
        .catch(err => next(err))
})

// User edit form render
router.get('/user/:id/edit', isLoggedIn, isSameUser, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .then(user => {
            res.render('user/user-edit', { user })
        })
        .catch(err => next(err))
})

// User edit form handler
router.post('/user/:id/edit', isLoggedIn, isSameUser, (req, res, next) => {

    const { userId } = req.params
    const { username, email, passwordHash, profileImg, description } = req.body

    User
        .findByIdAndUpdate(userId, { username, email, passwordHash, profileImg, description }, { new: true })
        .then(updateUser => {
            res.render('user/user-edit', { updateUser })
        })
        .catch(err => next(err))
})

// Show user friends

router.get('/user/:id/friends', isLoggedIn, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .populate('user')
        .then(friends => {
            res.render('vista de amigos', { friends })
        })
        .catch(err => next(err))
})

// Delete user

router.post('/user/:id/delete', isLoggedIn, isAdmin, (req, res, next) => {
    const { userId } = req.params

    User
        .findByIdAndRemove(userId)
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})


module.exports = router