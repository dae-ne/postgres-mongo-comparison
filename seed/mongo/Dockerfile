FROM mongo:latest

COPY init.json /init.json

CMD mongoimport -u root -p rootpassword -h mongodb -d ztb -c fdc --authenticationDatabase admin --jsonArray --drop --file /init.json
