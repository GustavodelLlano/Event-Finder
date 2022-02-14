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
router.get('/user/:userId', isLoggedIn, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .then(() => {
            res.render('user/user-profile')
        })
        .catch(err => next(err))
})

// User edit form render
router.get('/user/:userId/edit', isLoggedIn, isSameUser, (req, res, next) => {

    const { userId } = req.params

    User
        .findById(userId)
        .then(user => {
            res.render('user/user-edit', { user })
        })
        .catch(err => next(err))
})

// User edit form handler
router.post('/user/:userId/edit', isLoggedIn, isSameUser, (req, res, next) => {

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

router.get('/user/:userId/friends', isLoggedIn, (req, res, next) => {

    const { userId } = req.params
    console.log(req.params)

    User
        .findById(userId)
        .populate('friends')
        .then(friends => {
            res.render('user/user-friends', { friends })
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