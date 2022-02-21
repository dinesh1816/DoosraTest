export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Use node 16.x for running this app
nvm use 16

export PM2_HOME=/home/captain/.pm2

echo "NPM Version"
npm -v

echo "PM2 Version"
pm2 -v

# Go to app folder
cd /home/captain/deployments/user

# Installing dependencies with npm
npm install