pwd
ls -la
cd /home/ubuntu/webapp
pwd
ls -la
sudo npm install
sudo pm2 start server.js
sudo pm2 startup systemd
sudo pm2 save
sudo ln -s /home/ubuntu/webapp/node-service.service /etc/systemd/system/node-service.service
sudo systemctl daemon-reload
echo "daemon-reload done"
sudo systemctl enable node-service.service
sudo systemctl start node-service.service
echo "complete"