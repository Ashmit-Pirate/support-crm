const mongoose = require('mongoose');
const { startServer } = require('./server');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING VERIFICATION TESTS ---');
  let server;

  let hasFailed = false;

  try {
    // Start the server
    server = await startServer();
    console.log('Server started successfully.');

    // 1000ms delay after server start before making requests (as required)
    console.log('Waiting 1000ms for server and database connection...');
    await delay(1000);
    console.log('Beginning API requests...');

    const baseUrl = 'http://127.0.0.1:5000/api';

    // Step 1: Create first ticket (POST /api/tickets)
    console.log('\n[TEST 1] Creating first ticket (POST /api/tickets)...');
    const postResponse1 = await fetch(`${baseUrl}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Ashmit Singh',
        customer_email: 'ashmit@example.com',
        subject: 'System login error',
        description: 'I cannot log in using my regular credentials.'
      })
    });

    if (postResponse1.status !== 201) {
      throw new Error(`POST /api/tickets returned status ${postResponse1.status}`);
    }

    const ticket1 = await postResponse1.json();
    console.log('Created Ticket 1:', ticket1);
    if (!ticket1.ticket_id || !ticket1.created_at) {
      throw new Error('POST /api/tickets response missing ticket_id or created_at');
    }
    if (ticket1.ticket_id !== 'TKT-001') {
      throw new Error(`Expected first ticket ID to be TKT-001, got ${ticket1.ticket_id}`);
    }

    // Step 2: Create second ticket to verify counter sequence (POST /api/tickets)
    console.log('\n[TEST 2] Creating second ticket (POST /api/tickets)...');
    const postResponse2 = await fetch(`${baseUrl}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Jane Doe',
        customer_email: 'jane@example.com',
        subject: 'Billing question',
        description: 'Where can I find my invoice?'
      })
    });

    if (postResponse2.status !== 201) {
      throw new Error(`POST /api/tickets returned status ${postResponse2.status}`);
    }

    const ticket2 = await postResponse2.json();
    console.log('Created Ticket 2:', ticket2);
    if (ticket2.ticket_id !== 'TKT-002') {
      throw new Error(`Expected second ticket ID to be TKT-002, got ${ticket2.ticket_id}`);
    }

    // Step 3: Get tickets with status filter and search regex (GET /api/tickets)
    console.log('\n[TEST 3] Fetching tickets with search and status (GET /api/tickets?status=Open&search=Ashmit)...');
    const getListResponse = await fetch(`${baseUrl}/tickets?status=Open&search=Ashmit`);
    if (!getListResponse.ok) {
      throw new Error(`GET /api/tickets returned status ${getListResponse.status}`);
    }

    const ticketsList = await getListResponse.json();
    console.log('Fetched Tickets list:', ticketsList);

    if (!Array.isArray(ticketsList) || ticketsList.length === 0) {
      throw new Error('Expected tickets array to have at least one ticket matching search');
    }

    const match = ticketsList.find(t => t.ticket_id === 'TKT-001');
    if (!match) {
      throw new Error('TKT-001 should be in the filtered list');
    }

    // Verify key subset matching exactly: [{ ticket_id, customer_name, subject, status, created_at }]
    const keys = Object.keys(match);
    const expectedKeys = ['ticket_id', 'customer_name', 'subject', 'status', 'created_at'];
    for (const key of keys) {
      if (!expectedKeys.includes(key)) {
        throw new Error(`Unexpected field "${key}" returned in ticket list query response`);
      }
    }

    // Step 4: Get ticket details with populated empty notes (GET /api/tickets/TKT-001)
    console.log('\n[TEST 4] Retrieving ticket by ticket_id (GET /api/tickets/TKT-001)...');
    const getDetailResponse = await fetch(`${baseUrl}/tickets/TKT-001`);
    if (!getDetailResponse.ok) {
      throw new Error(`GET /api/tickets/TKT-001 returned status ${getDetailResponse.status}`);
    }

    const ticketDetail = await getDetailResponse.json();
    console.log('Ticket Detail (no notes yet):', ticketDetail);
    if (ticketDetail.ticket_id !== 'TKT-001') {
      throw new Error('Ticket detail ticket_id mismatch');
    }
    if (!Array.isArray(ticketDetail.notes)) {
      throw new Error('Expected ticket.notes to be an array');
    }
    if (ticketDetail.notes.length !== 0) {
      throw new Error('Expected ticket.notes to be initially empty');
    }

    // Step 5: Update status and add a note (PUT /api/tickets/TKT-001)
    console.log('\n[TEST 5] Updating status and adding note (PUT /api/tickets/TKT-001)...');
    const putResponse = await fetch(`${baseUrl}/tickets/TKT-001`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'In Progress',
        note_text: 'Support agent Ashmit has started reviewing this issue.'
      })
    });

    if (!putResponse.ok) {
      throw new Error(`PUT /api/tickets/TKT-001 returned status ${putResponse.status}`);
    }

    const putResult = await putResponse.json();
    console.log('PUT Response:', putResult);
    if (!putResult.success || !putResult.updated_at) {
      throw new Error('PUT /api/tickets response missing success or updated_at');
    }

    // Step 6: Verify notes populated and status updated (GET /api/tickets/TKT-001)
    console.log('\n[TEST 6] Re-fetching ticket details to verify changes...');
    const verifyResponse = await fetch(`${baseUrl}/tickets/TKT-001`);
    if (!verifyResponse.ok) {
      throw new Error(`GET /api/tickets/TKT-001 returned status ${verifyResponse.status}`);
    }

    const updatedDetail = await verifyResponse.json();
    console.log('Updated Ticket Detail:', updatedDetail);
    if (updatedDetail.status !== 'In Progress') {
      throw new Error(`Expected ticket status to be "In Progress", got "${updatedDetail.status}"`);
    }
    if (updatedDetail.notes.length !== 1) {
      throw new Error(`Expected ticket.notes to have 1 note, got ${updatedDetail.notes.length}`);
    }
    if (updatedDetail.notes[0].note_text !== 'Support agent Ashmit has started reviewing this issue.') {
      throw new Error(`Note text mismatch: got "${updatedDetail.notes[0].note_text}"`);
    }
    if (!updatedDetail.notes[0].created_at) {
      throw new Error('Note missing created_at timestamp');
    }

    console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');

  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    hasFailed = true;
  } finally {
    // Close Database and Server connections cleanly
    console.log('\nCleaning up connections...');
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed.');
      } catch (err) {
        console.error('Error closing mongoose connection:', err.message);
      }
    }

    if (server) {
      try {
        await new Promise((resolve, reject) => {
          server.close((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        console.log('Express server closed.');
      } catch (err) {
        console.error('Error closing Express server:', err.message);
      }
    }

    console.log('Cleanup completed.');
    if (hasFailed) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

runTests();
