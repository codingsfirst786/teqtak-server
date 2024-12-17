echo "pulling"
git pull origin main
echo "restarting server"
pm2 restart all