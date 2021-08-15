process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
const db = require("./db");

beforeAll(async function () {
  await db.query(`DELETE FROM companies`);
  await db.query(`DELETE FROM invoices`);
});

let testCompany;
let testInvoice;

beforeEach(async function(){
  let resultComp = await db.query(`
    INSERT INTO companies (code, name, description)
    VALUES ('costco', 'Costco','My favorite store')
    RETURNING code, name, description
  `);
  let resultInv = await db.query(`
    INSERT INTO invoices (comp_code, amt, paid, add_date)
    VALUES ('costco', 49.99, false, '2021-08-14')
    RETURNING id, comp_code, amt, paid, add_date, paid_date
  `);
  testCompany = resultComp.rows[resultComp.rows.length - 1];
  testInvoice = resultInv.rows[resultInv.rows.length -1];
});

describe("GET /companies", function(){
  test("full list of companies", async function(){
    const res = await request(app).get('/companies');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ 
      companies: [testCompany] 
    });
  });
})
  
afterEach(async function(){
  await db.query(`
    DELETE FROM invoices
    WHERE id=$1`, [testInvoice.id]
  );
  await db.query(`
    DELETE FROM companies
    WHERE code=$1`,
    [testCompany.code]
  );
});

afterAll(async function(){
  await db.end();
});