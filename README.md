# Neon CRM REST API Client for Node.js

This module provides a simple async/await interface to
[Neon CRM](https://www.neoncrm.com).

## Installation

```bash
npm install @obycode/neoncrm
```

## Setup

```js
const neoncrm = require("@obycode/neoncrm");
let neon = new neoncrm.Client(
  process.env.NEON_ORG_ID,
  process.env.NEON_API_KEY
);
```

## Usage

- `findAccount(email)` Returns ID of user with matching email or `null`
- `createAccount(email, firstname, lastname, phone, source = '')` Creates a new
  user with the given information and returns the ID
- `createPledge(accountId, campaignId, amount)` Creates a new pledge with the
  given information

## Testing

Create a file, `.env` with the following variables:

```
NEON_ORG_ID=<neon org id>
NEON_API_KEY=<neon api key>
NEON_CAMPAIGN_ID=<campaign id for testing>
```

Then run the tests using:

```
npm test
```
