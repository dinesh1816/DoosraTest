export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

export PM2_HOME=/home/captain/.pm2

echo "NPM Version"
npm -v

echo "PM2 Version"
pm2 -v

# echo "ENV Data:"
# echo $DEPLOYMENT_GROUP_NAME
# echo $LIFECYCLE_EVENT
# echo $DEPLOYMENT_ID
# echo $APPLICATION_NAME
# echo $DEPLOYMENT_GROUP_ID
# echo "---End---"

# Go to app folder
cd /home/captain/deployments/sample-micro-service

# start again
if [ "$DEPLOYMENT_GROUP_NAME" = "Production" ]
then
    # Fetch & save all prod config (.env) from AWS System Manager (Paramater Store)
    aws ssm get-parameters --region ap-south-1 --output text --names Doosra-Apps-Creds --query "Parameters[0].Value" > .env

    echo "Run Prod Server"
    npm run app-prod
else
    # Fetch & save all dev config (.env) from AWS System Manager (Paramater Store)
    aws ssm get-parameters --region ap-south-1 --output text --names Dev-Web-App --query "Parameters[0].Value" > .env

    echo "Run Dev Server"
    npm run app-dev
fi