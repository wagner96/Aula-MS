"use strict";

const AWS = require("aws-sdk");
require("dotenv").config();
module.exports.submit = async (event, context, callback) => {
  const body = JSON.parse(String(event.body));

  const data = {
    id: "ea31b706-bd0c-11ec-9d64-0242ac120002",
    order_id: "08294ca8-bd0b-11ec-9d64-0242ac120002",
    status: body.status,
    customer_id: "1561651",
    customer_name: "Elaine Pietra Gonçalves",
    customer_doc: "177.373.562-40",
    address: {
      type_address: "commercial",
      street: "Rua",
      number: "001",
      complement: "L4, Q7",
      neighborhood: "Bairro",
      city: "Teste",
      postal_code: "561",
      uf: "MT",
    },
  };
  await sendMessage(data.status, data.order_id);

  return {
    statusCode: 200,
    body: JSON.stringify({
      data,
    }),
  };
};
async function sendMessage(status, order_id) {
  try {
    AWS.config.update({ region: "us-east-1" });
    const sqs = new AWS.SQS();
    const params = {
      DelaySeconds: 0,
      MessageAttributes: {
        Title: {
          DataType: "String",
          StringValue: "Json com status da entrega",
        },
      },
      MessageBody: JSON.stringify({ status: status, order_id: order_id }),
      QueueUrl:
        "https://sqs.us-east-1.amazonaws.com/491803753772/send-status-delivery",
    };
    const response = await sqs.sendMessage(params).promise();
    return response;
  } catch (error) {
    console.log(error);
  }
}
