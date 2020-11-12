const axios = require("axios");
const moment = require("moment");

class Client {
  constructor(username, apiKey) {
    this.config = {
      headers: {
        "NEON-API-VERSION": "2.1",
      },
      auth: {
        username: username,
        password: apiKey,
      },
    };

    this.username = username;
    this.apiKey = apiKey;
  }

  async findAccount(email) {
    let response = await axios.post(
      "https://api.neoncrm.com/v2/accounts/search/",
      {
        outputFields: ["Account ID"],
        pagination: {
          pageSize: 1,
        },
        searchFields: [
          {
            field: "Email",
            operator: "EQUAL",
            value: email,
          },
        ],
      },
      this.config
    );
    if (
      response.data.searchResults == null ||
      response.data.searchResults.length < 1
    ) {
      return null;
    }
    return response.data.searchResults[0]["Account ID"];
  }

  async createAccount(email, firstname, lastname, phone, source = "") {
    let response = await axios.post(
      "https://api.neoncrm.com/v2/accounts",
      {
        individualAccount: {
          origin: {
            originDetail: source,
          },
          primaryContact: {
            email1: email,
            firstName: firstname,
            lastName: lastname,
            addresses: [
              {
                isPrimaryAddress: true,
                phone1: phone,
              },
            ],
          },
        },
      },
      this.config
    );
    return response.data.id;
  }

  async createPledge(accountId, campaignId, amount) {
    let response = await axios.post(
      "https://api.neoncrm.com/v2/pledges",
      {
        accountId: accountId,
        campaign: {
          id: campaignId,
        },
        amount: amount,
        date: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      },
      this.config
    );
    return response.data.id;
  }
}

exports.Client = Client;
