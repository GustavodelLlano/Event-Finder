const router = require("express").Router()
const Event = require("../models/Event.model")

router.get("/api/maps", (req, res, next) => {
    Event
        .find()
        .then(allEvents => res.json(allEvents))
        .catch(err => console.log(err))
})
module.exports = router