export function parseCSV(text) {
  if (!text || typeof text !== 'string') return [];
  
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        if (char === '\r') i++; // skip \n
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }
  
  // Push the final field/row if not empty
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  
  // Remove completely empty rows
  const validRows = rows.filter(row => row.some(field => field !== ''));
  
  if (validRows.length < 2) return []; // Needs at least headers and one data row
  
  const headers = validRows[0].map(header => header.trim());
  const result = [];
  
  for (let i = 1; i < validRows.length; i++) {
    const row = validRows[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j] !== undefined ? row[j] : '';
    }
    result.push(obj);
  }
  
  return result;
}