const mongoose = require("mongoose")

const isUser = user => user.role === "USER"

const isArtist = user => user.role === "ARTIST"

const isAdmin = user => user.role === "ADMIN"

const isNotLogged = user => user.role !== "USER" || "ARTIST" || "ADMIN"

const isSameUser = (userId, currentUserId) => userId === currentUserId


module.exports = { isUser, isArtist, isAdmin, isSameUser, isNotLogged }