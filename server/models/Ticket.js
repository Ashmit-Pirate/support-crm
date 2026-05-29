const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      unique: true
    },
    customer_name: {
      type: String,
      required: true,
      trim: true
    },
    customer_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for populating notes associated with the ticket
TicketSchema.virtual('notes', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'ticket_id'
});

module.exports = mongoose.model('Ticket', TicketSchema);
