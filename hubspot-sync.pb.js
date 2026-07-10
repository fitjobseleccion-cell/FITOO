/// <reference path="../pb_data/types.d.ts" />

// Helper function to split full name into first and last name
function splitName(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: '', lastName: '' };
  }
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
}

// Helper function to build HubSpot contact properties from user record
function buildContactProperties(record) {
  const email = record.get('email') || '';
  const name = record.get('name') || '';
  const role = record.get('role') || '';
  const tipoCuenta = record.get('tipo_cuenta') || '';
  const verificado = record.getBool('verificado');
  
  const { firstName, lastName } = splitName(name);
  
  return {
    email: email,
    firstname: firstName,
    lastname: lastName,
    role: role,
    tipo_cuenta: tipoCuenta,
    verificado: verificado ? 'true' : 'false'
  };
}

// Main sync function that sends user data to HubSpot
function syncUserContact(record) {
  try {
    const accessToken = $os.getenv('HUBSPOT_ACCESS_TOKEN');
    
    if (!accessToken) {
      console.log('[HubSpot Sync] HUBSPOT_ACCESS_TOKEN not configured, skipping sync');
      return;
    }
    
    const email = record.get('email');
    if (!email) {
      console.log('[HubSpot Sync] User has no email, skipping sync');
      return;
    }
    
    const properties = buildContactProperties(record);
    
    console.log('[HubSpot Sync] Syncing user:', email);
    
    // HubSpot batch upsert API endpoint
    const url = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';
    
    const payload = {
      inputs: [
        {
          properties: properties,
          idProperty: 'email'
        }
      ]
    };
    
    const response = $http.send({
      url: url,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      timeout: 30
    });
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('[HubSpot Sync] Successfully synced user:', email);
    } else {
      console.log('[HubSpot Sync] Failed to sync user:', email, 'Status:', response.statusCode, 'Response:', response.raw);
    }
    
  } catch (error) {
    console.log('[HubSpot Sync] Error syncing user:', error.message || error);
  }
}

// Hook: Sync user to HubSpot after creation
onRecordAfterCreateSuccess((e) => {
  syncUserContact(e.record);
  e.next();
}, 'users');

// Hook: Sync user to HubSpot after update
onRecordAfterUpdateSuccess((e) => {
  syncUserContact(e.record);
  e.next();
}, 'users');