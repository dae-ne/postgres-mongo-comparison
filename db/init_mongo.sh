#!/bin/bash

USERNAME=$MONGO_INITDB_ROOT_USERNAME
PASSWORD=$MONGO_INITDB_ROOT_PASSWORD

for path in /seed/*.csv; do
    file=${path##*/}
    container=${file%%.*}
    mongoimport -u $USERNAME -p $PASSWORD -d fdc -c $container --authenticationDatabase admin --type csv --headerline --file $path
done
