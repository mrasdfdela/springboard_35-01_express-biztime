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
});

describe("GET /companies/:code", function () {
  test("get specific company", async function () {
    const res = await request(app).get(`/companies/${testCompany.code}`);
    testCompany.industries = [];
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      company: testCompany ,
    });
  });
});

describe("POST /companies", function () {
  test("post a new company", async function () {
    const newCompany = {
      name: "Chiquita Banana",
      description: "Banana Republic",
    };
    const res = await request(app).post(`/companies`).send(newCompany);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      company: {
        code: expect.any(String), 
        name: newCompany.name,
        description: newCompany.description
      }
    });
  });
});

describe("Update (put) /companies/:code", function () {
  test("Update a company", async function () {
    const updatedCompany = {
      name: "Kirkland",
      description: "BC--Before Costco",
    };
    const res = await request(app)
      .put(`/companies/${testCompany.code}`)
      .send(updatedCompany);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      company: {
        code: testCompany.code, 
        name: updatedCompany.name,
        description: updatedCompany.description
      }
    });
  });
});

describe("Delete /companies/:code", function () {
  test("Delete a company", async function () {
    const res = await request(app)
      .delete(`/companies/${testCompany.code}`);
    expect(res.statusCode).toEqual(200);
  });
});
  
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