const fs = require('fs');
const csp = fs.readFileSync('public/_headers', 'utf8');
const quotes = csp.match(/'/g);
console.log('Total quotes:', quotes ? quotes.length : 0);
const lastSelfIdx = csp.lastIndexOf("'self'");
console.log('Last index of \'self\':', lastSelfIdx);
console.log('Chars after last \'self\": "', csp.substring(lastSelfIdx, lastSelfIdx + 6), '"');
console.log('Full last 30 chars:', csp.slice(-30));