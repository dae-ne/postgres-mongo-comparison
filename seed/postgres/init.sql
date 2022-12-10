DROP DATABASE IF EXISTS fdc;

CREATE DATABASE fdc;

\connect fdc

CREATE TABLE food (
   fdc_id INT PRIMARY KEY,
   data_type TEXT,
   description TEXT,
   publication_date DATE
);

CREATE TABLE branded_food (
   fdc_id INT PRIMARY KEY REFERENCES food,
   brand_owner TEXT,
   gtin_upc TEXT,
   ingredients TEXT,
   serving_size INT,
   serving_size_unit TEXT,
   branded_food_category TEXT,
   data_source TEXT,
   modified_date DATE,
   available_date DATE,
   market_country TEXT,
   trade_channel TEXT
);

\copy food from '/seed/food.csv' delimiter ',' csv header;
-- \copy branded_food from '/seed/branded_food.csv' delimiter ',' csv header;
