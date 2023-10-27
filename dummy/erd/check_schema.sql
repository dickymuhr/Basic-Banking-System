SELECT
    table_name,
    column_name,
    data_type,
    column_default,
    is_nullable,
    character_maximum_length,
    numeric_precision
FROM
    information_schema.columns
WHERE
    table_schema = 'public' AND
    table_name IN ('customers', 'accounts', 'transactions')
ORDER BY
    table_name,
    ordinal_position;
