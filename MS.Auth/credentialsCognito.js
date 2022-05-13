"use strict";

require("dotenv/config");

module.exports = async function credentials() {
  let UserPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
  let ClientId = process.env.AWS_COGNITO_CLIENT_ID;
  let Region = process.env.AWS_REGION;

  return { UserPoolId, ClientId, Region };
};
