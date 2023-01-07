#!/bin/bash

HOST=$API_HOST
PORT=$API_PORT

rm /seed/*.csv
curl -s http://$HOST:$PORT/_connect
