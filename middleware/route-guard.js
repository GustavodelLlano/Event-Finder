const isLoggedIn = (req, res, next) => {
    req.session.currentUser ? next() : res.render("auth/login", {
        errorMessage: "Identify!"
    })
}

const checkRole = (...admitedRoles) => (req, res, next) => {

    admitedRoles.includes(req.session.currentUser.role) ? next() : res.render("auth/login", {
        errorMessage: `Must have role: ${admitedRoles}`
    })
}



module.exports = { isLoggedIn, checkRole }