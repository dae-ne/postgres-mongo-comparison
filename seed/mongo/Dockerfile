FROM mongo:latest

# ARG DATABASE_URI=uri
# ARG USERNAME=username
# ARG PASSWORD=password

# ENV DATABASE_URI ${DATABASE_URI}
# ENV USERNAME ${USERNAME}
# ENV PASSWORD ${PASSWORD}

COPY init.json /init.json

CMD mongoimport -u root -p rootpassword -h mongodb -d ztb -c fdc --authenticationDatabase admin --jsonArray --drop --file /init.json
