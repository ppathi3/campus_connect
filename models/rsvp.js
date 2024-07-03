const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    status: { type: String, required: [true, 'Status field is required'], enum: ['YES', 'NO', 'MAYBE'] },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' }
}, { timestamps: true });

module.exports = mongoose.model('Rsvp', rsvpSchema);