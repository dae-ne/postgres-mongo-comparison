#!/bin/sh

for file in *.csv; do
    mongoimport -u root -p rootpassword -h mongodb -d fdc -c "${file%.*}" --authenticationDatabase admin --type csv --drop --headerline --file $file
done
