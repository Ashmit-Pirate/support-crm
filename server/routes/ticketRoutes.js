const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Note = require('../models/Note');
const Counter = require('../models/Counter');

// POST /api/tickets — Create a new ticket
router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description } = req.body;

    // Validate request body
    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Atomic increment of the counter for ticket_id
    const counter = await Counter.findOneAndUpdate(
      { id: 'ticket_id' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    const ticket_id = `TKT-${String(counter.seq).padStart(3, '0')}`;

    // Create and save the ticket
    const ticket = new Ticket({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description
    });

    await ticket.save();

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.created_at
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/tickets — Get tickets with status filter and search query (regex)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      // Case-insensitive regex search across name, email, ticket ID, and description
      filter.$or = [
        { customer_name: { $regex: search, $options: 'i' } },
        { customer_email: { $regex: search, $options: 'i' } },
        { ticket_id: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(filter);

    // Return only specified fields
    const formattedTickets = tickets.map(ticket => ({
      ticket_id: ticket.ticket_id,
      customer_name: ticket.customer_name,
      subject: ticket.subject,
      status: ticket.status,
      created_at: ticket.created_at
    }));

    res.json(formattedTickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/tickets/:ticket_id — Get a single ticket with notes populated
// Uses findOne({ ticket_id }) explicitly, avoiding findById
router.get('/:ticket_id', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id }).populate('notes');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({
      ticket_id: ticket.ticket_id,
      customer_name: ticket.customer_name,
      customer_email: ticket.customer_email,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      created_at: ticket.created_at,
      notes: (ticket.notes || []).map(note => ({
        note_text: note.note_text,
        created_at: note.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/tickets/:ticket_id — Update status and/or add a note
// Uses findOne({ ticket_id }) explicitly, avoiding findById
router.put('/:ticket_id', async (req, res) => {
  try {
    const { status, note_text } = req.body;

    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Update status if provided
    if (status) {
      ticket.status = status;
    }

    // Save ticket (which updates updated_at)
    await ticket.save();

    // Create and save note if note_text is provided
    if (note_text) {
      const note = new Note({
        ticket_id: ticket._id,
        note_text
      });
      await note.save();
    }

    res.json({
      success: true,
      updated_at: ticket.updated_at
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
