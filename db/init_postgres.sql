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
   serving_size NUMERIC,
   serving_size_unit TEXT,
   branded_food_category TEXT,
   data_source TEXT,
   modified_date DATE,
   available_date DATE,
   market_country TEXT
   -- trade_channel TEXT
);

-- CREATE TABLE food_attribute_type (
--    id INT PRIMARY KEY,
--    name TEXT,
--    description TEXT
-- );

-- CREATE TABLE food_attribute (
--    id INT PRIMARY KEY,
--    fdc_id INT REFERENCES food,
--    food_attribute_type_id INT REFERENCES food_attribute_type,
--    name TEXT,
--    value TEXT
-- );

CREATE TABLE nutrient (
   id INT PRIMARY KEY,
   name TEXT,
   unit_name TEXT,
   nutrient_nbr NUMERIC,
   rank NUMERIC
);

CREATE TABLE food_nutrient_source (
   id INT PRIMARY KEY,
   code TEXT,
   description TEXT
);

CREATE TABLE food_nutrient_derivation (
   id INT PRIMARY KEY,
   code TEXT,
   description TEXT,
   source_id INT REFERENCES food_nutrient_source
);

CREATE TABLE food_nutrient (
   id INT PRIMARY KEY,
   fdc_id INT REFERENCES food,
   nutrient_id INT REFERENCES nutrient,
   amount NUMERIC,
   derivation_id INT
);

\copy food from '/seed/food.csv' delimiter ',' csv header;
\copy branded_food from '/seed/branded_food.csv' delimiter ',' csv header;
-- \copy food_attribute_type from '/seed/food_attribute_type.csv' delimiter ',' csv header;
-- \copy food_attribute from '/seed/food_attribute.csv' delimiter ',' csv header;
\copy nutrient from '/seed/nutrient.csv' delimiter ',' csv header;
\copy food_nutrient_source from '/seed/food_nutrient_source.csv' delimiter ',' csv header;
\copy food_nutrient_derivation from '/seed/food_nutrient_derivation.csv' delimiter ',' csv header;
\copy food_nutrient from '/seed/food_nutrient.csv' delimiter ',' csv header;
