/// <reference path="../pb_data/types.d.ts" />
/**
 * HubSpot Service - Synchronizes PocketBase users with HubSpot CRM v3
 * Uses batch upsert endpoint to avoid duplicate contacts
 */

/**
 * Split full name into first and last name
 * @param {string} fullName - The full name to split
 * @returns {object} Object with firstName and lastName properties
 */
function splitName(fullName) {
  if (!fullName) {
    return { firstName: '', lastName: '' };
  }

  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  } else if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  } else {
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return { firstName, lastName };
  }
}

/**
 * Build contact properties for HubSpot from PocketBase record
 * @param {object} record - PocketBase user record
 * @returns {object} Contact properties object for HubSpot
 */
function buildContactProperties(record) {
  const email = record.get('email') || '';
  const name = record.get('name') || '';
  const { firstName, lastName } = splitName(name);

  return {
    email: email,
    firstname: firstName,
    lastname: lastName
  };
}

/**
 * Synchronize PocketBase user with HubSpot CRM
 * Uses batch upsert endpoint with email as idProperty to prevent duplicates
 * @param {object} record - PocketBase user record
 */
function syncUserContact(record) {
  const email = record.get('email');
  
  // Check if HubSpot access token is configured
  const accessToken = $os.getenv('HUBSPOT_ACCESS_TOKEN');
  if (!accessToken) {
    console.log('HUBSPOT_ACCESS_TOKEN not configured, skipping sync');
    return;
  }

  // Build contact properties
  const properties = buildContactProperties(record);

  // Prepare batch upsert payload
  const payload = {
    inputs: [
      {
        objectsToUpsert: [
          {
            idProperty: 'email',
            objectTypeId: 'contacts',
            properties: properties
          }
        ]
      }
    ]
  };

  try {
    // Send request to HubSpot batch upsert endpoint
    const response = $http.send({
      url: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      timeout: 30
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('Successfully synced user to HubSpot:', email);
    } else {
      console.log('HubSpot sync failed with status', response.statusCode, ':', response.raw);
    }
  } catch (error) {
    console.log('Error syncing user to HubSpot:', error.message || error);
  }
}

// Export functions
module.exports = {
  syncUserContact,
  splitName,
  buildContactProperties
};