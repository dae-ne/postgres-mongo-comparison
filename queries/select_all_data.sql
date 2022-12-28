select
    f.*,
    bf.*,
    json_agg(fnt) food_nutrient
from (
    select
        fn.*,
        row_to_json(n) nutrient,
        row_to_json(fndt) food_nutrient_derivation
    from (
        select
            fnd.*,
            row_to_json(fns) food_nutrient_source
        from food_nutrient_derivation fnd
        left join food_nutrient_source fns on fnd.source_id = fns.id
    ) fndt
    right join food_nutrient fn on fndt.id = fn.derivation_id
    left join nutrient n on fn.nutrient_id = n.id
) fnt
right join food f using (fdc_id)
left join branded_food bf using (fdc_id)
group by f.fdc_id, bf.fdc_id
limit 2;
