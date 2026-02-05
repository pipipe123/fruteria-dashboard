-- Seed con 15+ productos para la frutería
-- Ejecutar después de schema.sql

INSERT INTO products (name, stock, expiration_date) VALUES
  ('Manzanas', 50, CURRENT_DATE + INTERVAL '14 days'),
  ('Plátanos', 30, CURRENT_DATE + INTERVAL '5 days'),
  ('Naranjas', 45, CURRENT_DATE + INTERVAL '21 days'),
  ('Uvas', 25, CURRENT_DATE + INTERVAL '3 days'),
  ('Fresas', 20, CURRENT_DATE + INTERVAL '2 days'),
  ('Melón', 15, CURRENT_DATE + INTERVAL '7 days'),
  ('Sandía', 12, CURRENT_DATE + INTERVAL '10 days'),
  ('Piña', 18, CURRENT_DATE + INTERVAL '14 days'),
  ('Mango', 22, CURRENT_DATE + INTERVAL '6 days'),
  ('Pera', 35, CURRENT_DATE + INTERVAL '12 days'),
  ('Kiwi', 28, CURRENT_DATE + INTERVAL '9 days'),
  ('Limón', 40, CURRENT_DATE + INTERVAL '15 days'),
  ('Mandarina', 38, CURRENT_DATE + INTERVAL '18 days'),
  ('Papaya', 10, CURRENT_DATE + INTERVAL '4 days'),
  ('Melocotón', 16, CURRENT_DATE + INTERVAL '8 days'),
  ('Cerezas', 14, CURRENT_DATE - INTERVAL '1 day'),
  ('Aguacate', 20, CURRENT_DATE + INTERVAL '1 day')
;
