const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'You need to introduce event name']
        },
        type: {
            type: String,
            require: [true, 'You need to introduce the type of the event']
        },
        url: {
            type: String,
            unique: true,
            require: [true, 'You need to introduce the url of the event']
        },
        img: {
            type: String
        },
        date: {
            type: String
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