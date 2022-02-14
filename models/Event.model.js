const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
    {
        eventName: {
            type: String,
            required: [true, 'You need to introduce event name']
        },
        type: {
            type: String,
            required: [true, 'You need to introduce the type of the event']
        },
        url: {
            type: String,
            unique: true,
            required: [true, 'You need to introduce the url of the event']
        },
        eventImg: {
            type: String
        },
        date: {
            type: Date
        },
        genre: {
            type: String
        },
        minPrice: {
            type: Number
        },
        maxPrice: {
            type: Number
        },
        location: {
            type: {
                type: String
            },
            coordinates: [Number]
        }
    },
    {
        timestamps: true,
    }
);

const Event = model("Event", eventSchema);

module.exports = Event;