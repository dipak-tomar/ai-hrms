#!/usr/bin/env node

const { spawn } = require('child_process');

// Get port from environment or use default
const port = process.env.PORT || 3000;

console.log(`Starting Vite preview server on port ${port}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Start vite preview with proper arguments
const vite = spawn('npx', [
  'vite', 
  'preview', 
  '--host', 
  '0.0.0.0', 
  '--port', 
  port.toString(),
  '--strictPort',
  'false'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

vite.on('close', (code) => {
  console.log(`Vite preview process exited with code ${code}`);
  process.exit(code);
});

vite.on('error', (err) => {
  console.error('Failed to start vite preview:', err);
  process.exit(1);
});
