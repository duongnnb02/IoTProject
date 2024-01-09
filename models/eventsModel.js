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
        type: Number
    },
    I: {
        type: Number
    },
    P: {
        type: Number,
        required: true
    },
    W: {
        type: Number
    },
    F: {
        type: Number
    },
    PF: {
        type: Number
    },
    status: {
        type: Number
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