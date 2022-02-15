const router = require("express").Router()
const User = require('../models/User.model')
const { isLoggedIn, checkRole, isSameUser } = require("../middleware/route-guard")
const { isUser, isArtist, isAdmin } = require("../utils")


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

    User
        .findById(userId)
        .populate('friends')
        .then(user => {
            res.render('user/user-friends', { user })
        })
        .catch(err => next(err))
})

// Add to my friends                   NO FUNCHIONA  $push

router.post('/user/:userId/add', isLoggedIn, (req, res, next) => {

    const { userId } = req.session.currentUser._id
    const { friendId } = req.params

    console.log('FRIENDS', req.params)
    console.log('YO', req.session.currentUser._i)

    User
        .findByIdAndUpdate(userId, friendId, { new: true })
        .then(user => {
            req.session.currentUser.friends.push(user)
            res.render('user/user-friends', { user }, friends)
        })
        .catch(err => next(err))
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