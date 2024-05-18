const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
    binId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Bin', binSchema);
