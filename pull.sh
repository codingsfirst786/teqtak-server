#!/bin/bash

echo "Pulling the latest changes from the main branch..."
sleep 1

if git pull origin main; then
    echo "✅ Successfully pulled the latest changes."
else
    echo "❌ Failed to pull changes. Exiting..."
    exit 1
fi

sleep 1
echo "Restarting the server with PM2..."
if pm2 restart all; then
    echo "✅ Server restarted successfully."
else
    echo "❌ Failed to restart the server. Check PM2 logs."
    exit 1
fi


sleep 1
echo "Logs are"
pm2 logs;

