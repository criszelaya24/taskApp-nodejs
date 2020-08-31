const mongoose = require('../db/mongoose'),
    validator = require('validator');

const User = mongoose.model('User', {
    name: { type: String },
    age: { 
        type: Number,
        default: 0,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) throw new Error('Email is invaid..');
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: (value) => {
            if (value.toLowerCase().includes('password')) throw new Error('Password contains password');
        },
    },
});

module.exports = User;