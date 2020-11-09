neon = require("./index.js");

const dotenv = require("dotenv");
dotenv.config();
const assert = require("assert").strict;

describe("Unit test", function () {
  var testAccount;
  var neonClient;

  it("should be able to create a neon client", function () {
    neonClient = new neon.Client(
      process.env.NEON_ORG_ID,
      process.env.NEON_API_KEY
    );
  });

  it("should be able to create an account", async function () {
    try {
      testAccount = await neonClient.createAccount(
        "test@example.com",
        "Test",
        "Account",
        "555-555-5555",
        "API testing"
      );
    } catch (err) {
      console.log(err.response.status, err.response.data);
      assert.fail();
    }
  });

  it("should be able to retreive an account by email", async function () {
    let account = await neonClient.findAccount("test@example.com");
    assert.strictEqual(account, testAccount);
  });

  it("should return null for unknown email", async function () {
    let account = await neonClient.findAccount("unknown@example.com");
    assert.strictEqual(account, null);
  });

  it("should be able to create a new pledge", async function () {
    try {
      let res = await neonClient.createPledge(
        testAccount,
        process.env.NEON_CAMPAIGN_ID,
        50
      );
    } catch (err) {
      console.log(err.response.status, err.response.data);
      assert.fail();
    }
  });
});
