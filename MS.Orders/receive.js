"use strict";

const AWS = require("aws-sdk");
require("dotenv").config();
module.exports.submit = async (event, context, callback) => {
  AWS.config.update({ region: "us-east-1" });
  const sqs = new AWS.SQS();
  const params = {
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ["All"],
    QueueUrl:
      "https://sqs.us-east-1.amazonaws.com/491803753772/send-status-delivery",
    WaitTimeSeconds: 0,
  };

  const { Messages } = await sqs.receiveMessage(params).promise();

  console.log("messages on queue", Messages);

  if (Messages) {
    let messageObject;
    for (const message of Messages) {
      messageObject = await JSON.parse(message.Body);
      console.log("message", messageObject);

      const data = {
        id: messageObject.order_id,
        customer_id: "1561651",
        customer_name: "Elaine Pietra Gonçalves",
        customer_doc: "177.373.562-40",
        address: {
          type_address: "commercial",
          street: "Rua",
          number: "001",
          complement: "L4, Q7",
          neighborhood: "Bairro",
          city: "Nova",
          postal_code: "561",
          uf: "MT",
        },
        status: messageObject.status,
      };
      console.log("data", data);

      const deleteParams = {
        QueueUrl:
          "https://sqs.us-east-1.amazonaws.com/491803753772/send-status-delivery",
        ReceiptHandle: message.ReceiptHandle,
      };

      console.log(await sqs.deleteMessage(deleteParams).promise());
    }
  }
};
