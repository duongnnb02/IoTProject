const mongoose = require('mongoose');
//const moment = require('moment');
const moment = require('moment-timezone');

const Schema = mongoose.Schema;

const EventsSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    device_id: {
        type: String,
        required: true
    },
    U: {
        type: Number,
        default: null
    },
    I: {
        type: Number,
        default: null
    },
    P: {
        type: Number,
        required: true
    },
    W: {
        type: Number,
        required: true
    },
    F: {
        type: Number,
        required: true
    },
    PF: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        require: true
    }
}, {
    _id: false,
    id: false,
    versionKey: false,
    strict: false
}
);


module.exports = mongoose.model('Events', EventsSchema);