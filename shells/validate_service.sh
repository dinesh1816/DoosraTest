is_app_running=false
counter=0
while [ $counter -ne 60 ]
do
    HTTP_RESPONSE_CODE=$(curl --max-time 1 --write-out '%{http_code}' --silent --output /dev/null http://localhost:4000/v1/health/health-check)
    if [ "$HTTP_RESPONSE_CODE" -ne 200 ]
    then
        echo "Error: HTTP_RESPONSE_CODE: $HTTP_RESPONSE_CODE"
    else
        echo "Success: HTTP_RESPONSE_CODE: $HTTP_RESPONSE_CODE"
        is_app_running=true
        break
    fi

    counter=$(($counter+1))
    sleep 1;
done

if [ $is_app_running = true ]; then
    echo "App is running!"
else
    echo "App not yet started!"
    # Exit with error code 1
    exit 1
fi