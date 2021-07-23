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

  async getAccount(accountId) {
    let response = await axios.get(
      `https://api.neoncrm.com/v2/accounts/${accountId}`,
      this.config
    );

    return response.data;
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

  async getEventTicketOptions(eventId) {
    let response = await axios.get(
      `https://api.neoncrm.com/v2/events/${eventId}/tickets`,
      this.config
    );
    return response.data;
  }

  async getEventRegistrations(eventId) {
    var response;
    var registrations = [];
    var page = 0;
    do {
      response = await axios.get(
        `https://api.neoncrm.com/v2/events/${eventId}/eventRegistrations?page=${page}`,
        this.config
      );
      registrations.push(...response.data.eventRegistrations);
      page++;
    } while (
      response.data.pagination.currentPage <
      response.data.pagination.totalPages - 1
    );

    return registrations;
  }

  async getEventRegistration(registrationId) {
    let response = await axios.get(
      `https://api.neoncrm.com/v2/eventRegistrations/${registrationId}`,
      this.config
    );
    return response.data;
  }

  async updateEventRegistration(registration) {
    let response = await axios.put(
      `https://api.neoncrm.com/v2/eventRegistrations/${registration.id}`,
      registration,
      this.config
    );
    return response.data;
  }
}

exports.Client = Client;
