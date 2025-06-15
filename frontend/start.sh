#!/bin/bash

# Set default port if not provided
PORT=${PORT:-3000}

# Start the application
exec npx vite preview --host 0.0.0.0 --port $PORT
