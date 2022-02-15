const isLoggedIn = (req, res, next) => {
    req.session.currentUser ? next() : res.render("auth/login-form", {
        errorMessage: "Identify!"
    })
}

const checkRole = (...admitedRoles) => (req, res, next) => {

    admitedRoles.includes(req.session.currentUser.role) ? next() : res.render("auth/login-form", {
        errorMessage: `Must have role: ${admitedRoles}`
    })
}

const isSameUser = (req, res, next) => {
    if (req.session.currentUser._id === req.params.userId || req.session.currentUser.role === 'ADMIN') {
        next()
    } else {
        res.render("auth/login-form", {
            errorMessage: "Unauthorized"
        })
    }

}



module.exports = { isLoggedIn, checkRole, isSameUser }