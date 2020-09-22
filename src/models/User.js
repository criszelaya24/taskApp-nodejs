const mongoose = require('../db/mongoose'),
    validator = require('validator'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String },
    age: {
        type: Number,
        default: 0,
    },
    email: {
        type: String,
        unique: true,
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
    tokens: [ {
        token: {
            type: String,
            required: true,
        },
    } ],
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'taskApp');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

// arrow function does not work reading THIS attribute.
userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;