CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  expiration_date DATE NOT NULL
);

CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exits (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  date TIMESTAMP DEFAULT NOW()
);
