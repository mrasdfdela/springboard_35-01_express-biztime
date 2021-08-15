\c biztime_test

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS company_industries;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

CREATE TABLE company_industries (
    cd_company text NOT NULL REFERENCES companies ON DELETE CASCADE,
    cd_industry text NOT NULL REFERENCES industries ON DELETE CASCADE,
    PRIMARY KEY (cd_company, cd_industry)
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, industry)
  VALUES  ('ai', 'artificial intelligence'),
          ('cld_comp', 'cloud computing'),
          ('comp_hard', 'computer hardware'),
          ('comp_soft', 'computer software'),
          ('csmr_elct', 'consumer electronics'),
          ('dig_media', 'digital media'),
          ('fi_tech', 'financial technology'),
          ('semi_con', 'semiconductors');

INSERT INTO company_industries
  VALUES  ('apple','ai'),
          ('apple','comp_hard'),
          ('apple','comp_soft'),
          ('apple','csmr_elct'),
          ('apple','dig_media'),
          ('apple','semi_con'),
          ('ibm','ai'),
          ('ibm','cld_comp'),
          ('ibm','comp_hard'),
          ('ibm','comp_soft'),
          ('ibm','csmr_elct'),
          ('ibm','fi_tech'),
          ('ibm','semi_con')