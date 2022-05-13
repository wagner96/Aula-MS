"use strict";

const axios = require("axios");

module.exports.submit = async (event, context, callback) => {
  const body = JSON.parse(String(event.body));
  const order = await getOrder(body.order_id);
  const customer = order.data;
  const address = order.data.address;
  const data = {
    id: "ea31b706-bd0c-11ec-9d64-0242ac120002",
    order_id: body.order_id,
    status: "open",
    customer_id: customer.customer_id,
    customer_name: customer.customer_name,
    customer_doc: customer.customer_doc,
    address: {
      type_address: address.type_address,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      postal_code: address.postal_code,
      uf: address.uf,
    },
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      data,
    }),
  };
};

async function getOrder(order_id) {
  try {
    const response = await axios.get(
      `http://localhost:3000/dev/orders/${order_id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
