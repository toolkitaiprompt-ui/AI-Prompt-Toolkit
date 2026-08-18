const csp = `default-src 'self' data: blob:; style-src 'self' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://quge5.com https://nap5k.com https://n6wxm.com; img-src 'self' https://images.unsplash.com data:; connect-src 'self'; upgrade-insecure-requests; base-uri 'self`;

// Count single quotes
let singleQuoteCount = (csp.match(/'/g) || []).length;
console.log('Single quote count:', singleQuoteCount);
console.log('Is even?', singleQuoteCount % 2 === 0);

// Check base-uri section
const baseUriIndex = csp.indexOf('base-uri');
console.log('base-uri section:', JSON.stringify(csp.substring(baseUriIndex, baseUriIndex + 30)));

// Show last 40 chars
console.log('Last 40 chars:', JSON.stringify(csp.slice(-40)));

// Try to parse - check if the last 'self has a closing quote
const lastSelf = csp.lastIndexOf("'self");
console.log("Last occurrence of 'self' at index:", lastSelf);
console.log("Char after:", csp.charAt(lastSelf + 5));
console.log("Char before:", csp.charAt(lastSelf - 1));