FROM mongo:latest

COPY FoodData_Central_branded_food_json_2022-10-28.json /init.json

CMD mongoimport -u root -p rootpassword -h mongodb -d ztb -c fdc --authenticationDatabase admin --jsonArray --drop --file /init.json
