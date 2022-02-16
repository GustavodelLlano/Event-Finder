const mongoose = require("mongoose")

const isUser = user => user.role === "USER"

const isArtist = user => user.role === "ARTIST"

const isAdmin = user => user.role === "ADMIN"

const isNotLogged = user => user.role !== "USER" || "ARTIST" || "ADMIN"

const isSameUser = (userId, currentUserId) => userId === currentUserId

const apiModel = (param) => {
    param.map(event =>{
    return {
        _id: event.id,
        name: event.name,
        type: event.type,
        url: event.url,
        eventImg: event.images[0].url,
        date: event.dates.start.localDate,
        genre: event.classifications[0].genre.name,
        minPrice: event.priceRanges[0].min,
        maxPrice: event.priceRanges[0].max,
        location: {
            type: 'Point',
            coordinates: [event._embedded.venues[0].location.longitude, event._embedded.venues[0].location.latitude]
        },
        isFromApi: true
    }
})
}


module.exports = { isUser, isArtist, isAdmin, isSameUser, isNotLogged, apiModel }