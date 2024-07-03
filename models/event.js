const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: [true, 'Name field is required'] },
    category: { type: String, required: [true, 'Category field is required'], enum: ['Social Gatherings', 'Academic Workshops', 'Cultural Activities', 'Sports/Recreation', 'Career Coaching', 'Other'] },
    description: { type: String, required: [true, 'Description field is required'], minLength: [25, 'Description should have atleast 25 characters.']},
    host: { type: Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date, required: [true, 'Start Date field is required'] },
    endDate: { type: Date, required: [true, 'End Date field is required'] },
    location: { type: String, required: [true, 'Location field is required'] },
    eventType: { type: String, required: [true, 'Event Type field is required'], enum: ['Free', 'Paid'] },
    image: { type: String, required: [true, 'Image path is missing'] },
    entryFee: { type: Number },

}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);