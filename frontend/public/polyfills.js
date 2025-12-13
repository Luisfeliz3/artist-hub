// Add before React loads in index.html
if (typeof window !== 'undefined') {
  // Polyfill for Node.js globals used by some libraries
  window.global = window;
  window.process = { env: {} };
  
  // Fix for Buffer if needed
  if (typeof Buffer === 'undefined') {
    window.Buffer = require('buffer').Buffer;
  }
}