SELECT
    f.*,
    bf.*,
    json_agg(fnt) food_nutrient
FROM (
    SELECT
        fn.*,
        row_to_json(n) nutrient,
        row_to_json(fndt) food_nutrient_derivation
    FROM (
        SELECT
            fnd.*,
            row_to_json(fns) food_nutrient_source
        FROM food_nutrient_derivation fnd
        LEFT JOIN food_nutrient_source fns ON fnd.source_id = fns.id
    ) fndt
    RIGHT JOIN food_nutrient fn ON fndt.id = fn.derivation_id
    LEFT JOIN nutrient n ON fn.nutrient_id = n.id
) fnt
RIGHT JOIN food f USING (fdc_id)
LEFT JOIN branded_food bf USING (fdc_id)
GROUP BY f.fdc_id, bf.fdc_id
LIMIT 3;
