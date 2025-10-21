#!/usr/bin/env node
/**
 * HubSpot Helper Script for masumihayashi.com
 *
 * Quick utility to interact with HubSpot API
 *
 * Usage:
 *   node hubspot-helper.js test              # Test API connection
 *   node hubspot-helper.js create-contact    # Create sample contact
 *   node hubspot-helper.js list-contacts     # List contacts
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env') });

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const PORTAL_ID = process.env.PUBLIC_HUBSPOT_PORTAL_ID;
const BASE_URL = 'https://api.hubapi.com';

if (!HUBSPOT_ACCESS_TOKEN || !PORTAL_ID) {
  console.error('❌ Missing HubSpot credentials in .env file');
  console.error('Required: HUBSPOT_ACCESS_TOKEN, PUBLIC_HUBSPOT_PORTAL_ID');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

async function testConnection() {
  console.log('🔍 Testing HubSpot API connection...\n');

  try {
    const response = await fetch(`${BASE_URL}/crm/v3/objects/contacts?limit=1`, {
      headers
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ HubSpot API connection successful!');
      console.log(`📊 Portal ID: ${PORTAL_ID}`);
      console.log(`📝 Total contacts available: ${data.total || 0}`);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ API connection failed:', response.status);
      console.error('Error:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

async function createContact(email, firstName, lastName, properties = {}) {
  console.log(`📝 Creating contact: ${email}...\n`);

  const contactData = {
    properties: {
      email,
      firstname: firstName,
      lastname: lastName,
      ...properties
    }
  };

  try {
    const response = await fetch(`${BASE_URL}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(contactData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Contact created successfully!');
      console.log(`Contact ID: ${data.id}`);
      return data;
    } else {
      const error = await response.json();
      console.error('❌ Failed to create contact:', response.status);
      console.error('Error:', error.message || error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating contact:', error.message);
    return null;
  }
}

async function listContacts(limit = 10) {
  console.log(`📋 Listing contacts (limit: ${limit})...\n`);

  try {
    const response = await fetch(
      `${BASE_URL}/crm/v3/objects/contacts?limit=${limit}&properties=firstname,lastname,email`,
      { headers }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.results.length} contacts:\n`);

      data.results.forEach((contact, index) => {
        const props = contact.properties;
        console.log(`${index + 1}. ${props.firstname || ''} ${props.lastname || ''}`);
        console.log(`   Email: ${props.email || 'N/A'}`);
        console.log(`   ID: ${contact.id}\n`);
      });

      return data.results;
    } else {
      const error = await response.text();
      console.error('❌ Failed to list contacts:', response.status);
      console.error('Error:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error listing contacts:', error.message);
    return null;
  }
}

async function createForm(formName, fields) {
  console.log(`📋 Creating form: ${formName}...\n`);

  const formData = {
    name: formName,
    formFieldGroups: [{
      fields: fields.map(field => ({
        name: field.name,
        label: field.label,
        fieldType: field.type || 'text',
        required: field.required || false
      }))
    }]
  };

  try {
    const response = await fetch(`${BASE_URL}/marketing/v3/forms`, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Form created successfully!');
      console.log(`Form ID: ${data.id}`);
      console.log(`Embed URL: https://app.hubspot.com/forms/${PORTAL_ID}/${data.id}`);
      return data;
    } else {
      const error = await response.json();
      console.error('❌ Failed to create form:', response.status);
      console.error('Error:', error.message || error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating form:', error.message);
    return null;
  }
}

// CLI Handler
const command = process.argv[2];

switch (command) {
  case 'test':
    await testConnection();
    break;

  case 'create-contact':
    await createContact(
      'sample@masumihayashi.com',
      'Sample',
      'Contact',
      {
        company: 'Masumi Hayashi Foundation',
        phone: '555-0123',
        lifecyclestage: 'subscriber'
      }
    );
    break;

  case 'list-contacts':
    const limit = process.argv[3] ? parseInt(process.argv[3]) : 10;
    await listContacts(limit);
    break;

  case 'create-inquiry-form':
    await createForm('Masumi Hayashi Website Inquiry', [
      { name: 'firstname', label: 'First Name', required: true },
      { name: 'lastname', label: 'Last Name', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true }
    ]);
    break;

  default:
    console.log(`
HubSpot Helper for masumihayashi.com
====================================

Usage:
  node hubspot-helper.js <command>

Commands:
  test                    Test HubSpot API connection
  create-contact          Create a sample contact
  list-contacts [limit]   List contacts (default: 10)
  create-inquiry-form     Create website inquiry form

Examples:
  node hubspot-helper.js test
  node hubspot-helper.js list-contacts 20
  node hubspot-helper.js create-inquiry-form
    `);
}
