const mongoose = require('mongoose');

mongoose.connect(API_SETTINGS.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

module.exports = mongoose;