"use strict";

const AWS = require("aws-sdk/global");

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const credentials = require("./credentialsCognito");

module.exports.submit = async (event, context, callback) => {
  const { UserPoolId, ClientId } = await credentials();

  let login_result = await login({
    UserPoolId,
    ClientId,
    event,
  })
    .then((parametros) => {
      return parametros;
    })
    .catch();

  if (login_result.statusCode === 200) {
    let bodyobject = JSON.parse(login_result.body);
    login_result.body = JSON.stringify(bodyobject);
  }

  return login_result;
};

function login({ UserPoolId, ClientId, event }) {
  let body = JSON.parse(event.body);

  let poolData = {
    UserPoolId: UserPoolId,
    ClientId: ClientId,
  };
  let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  let authenticationData = {
    Username: body.em,
    Password: body.password,
  };
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );

  let userData = {
    Username: authenticationData.Username,
    Pool: userPool,
  };

  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return authenticateCognitoUser({
    cognitoUser,
    authenticationDetails,
  });
}

async function authenticateCognitoUser({
  cognitoUser,
  authenticationDetails,
}) {
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        const accesstoken = result.getIdToken().getJwtToken();
        const refreshtoken = result.getRefreshToken().getToken();
        const client_id = result.getAccessToken().payload.client_id;
        const expiry = result.getAccessToken().payload.exp;

        resolve({
          statusCode: 200,
          body: JSON.stringify({
            accessToken: accesstoken,
            refreshToken: refreshtoken,
            client_id: client_id,
            expiry_date: expiry,
          }),
        });
      },
      onFailure: function (err) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({
            message: err.message,
          }),
        });
      },
    });
  });
}
