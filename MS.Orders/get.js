"use strict";

module.exports.submit = async (event, context, callback) => {
  const data = {
    id: "08294ca8-bd0b-11ec-9d64-0242ac120002",
    customer_id: "1561651",
    customer_name: "Elaine Pietra",
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
    status: "paid",
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      data,
    }),
  };
};
