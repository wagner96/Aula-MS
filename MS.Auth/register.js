"use strict";

const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const credentials = require("./credentialsCognito");

module.exports.submit = async (event, context, callback) => {
  const { UserPoolId, ClientId, Region } = await credentials();
  const user_request = registerUser({
    UserPoolId,
    ClientId,
    event,
    Region,
  });
  return user_request;
};

async function registerUser({ UserPoolId, ClientId, event, Region }) {
  try {
    const poolData = {
      UserPoolId: UserPoolId,
      ClientId: ClientId,
    };
    let cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: Region });
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    let body = JSON.parse(String(event.body));

    const { dataLocale, dataEmail } = getFormattedAttributes({ body });

    let attributeLocale = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataLocale
    );
    let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );
    let attributeList = [];

    attributeList.push(attributeLocale);
    attributeList.push(attributeEmail);

    const createdUser = await createCognitoUser({
      body,
      attributeList,
      userPool,
    });
    const confirmSignUpData = {
      Username: createdUser.user.username,
      UserPoolId: UserPoolId,
    };

    return await confirmCognitoUser({
      confirmSignUpData,
      cognitoISP,
      UserPoolId,
      ClientId,
    });
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
}
async function createCognitoUser({ body, attributeList, userPool }) {
  return await new Promise((resolve, reject) => {
    userPool.signUp(
      body.email,
      body.password,
      attributeList,
      null,
      function (err, result) {
        if (err) {
          reject(err);
        }

        resolve(result);
      }
    );
  });
}

async function confirmCognitoUser({
  confirmSignUpData,
  cognitoISP,
  UserPoolId,
  ClientId,
}) {
  return await new Promise((resolve, reject) => {
    cognitoISP.adminConfirmSignUp(confirmSignUpData, function (err, result) {
      if (err) {
        reject({
          statusCode: 500,
          body: JSON.stringify({
            message: err.message,
          }),
        });
      }
      resolve({
        statusCode: 200,
        body: JSON.stringify({
          userpool_id: UserPoolId,
          client_id: ClientId,
        }),
      });
    });
  });
}

function getFormattedAttributes({ body }) {
  let dataLocale = {
    Name: "locale",
    Value: body.locale,
  };
  let dataEmail = {
    Name: "email",
    Value: body.email,
  };

  return {
    dataLocale,
    dataEmail,
  };
}
