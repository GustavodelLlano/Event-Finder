const router = require("express").Router()
const bcrypt = require('bcryptjs')
const User = require("../models/User.model")
const saltRounds = 10


// Sign-up form
// GET
router.get("/signup", (req, res, next) => {
    res.render("./auth/signup-form")
})

// POST
router.post("/signup", (req, res, next) => {
    const { userPsw } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPsw, salt))
        .then(hashedPassword => User.create({ ...req.body, passwordHash: hashedPassword }))
        .then(() => res.redirect('/'))
        .catch(error => next(error))

})


// Log-in form
// GET
router.get('/login', (req, res, next) => {
    res.render('auth/login-form')
})

// POST
router.post('/login', (req, res, next) => {

    const { email, userPsw } = req.body

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login-form', { errMsg: 'This username is not registered' })
                return
            } else if (!bcrypt.compareSync(userPsw, user.passwordHash)) {
                res.render('auth/login-form', { errMsg: 'Incorrect password' })
                return
            } else {
                req.session.currentUser = user
                req.app.locals.myUser = user
                res.redirect(`user/${user._id}`)
            }
        })
})


// Log-out
router.post('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/login'))
})


module.exports = router