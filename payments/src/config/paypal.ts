const paypal = require("paypal-rest-sdk");

if (!process.env.CLIENT_ID) {
  throw new Error("CLIENT_ID must be defined");
}
if (!process.env.CLIENT_SECRET) {
  throw new Error("CLIENT_ID must be defined");
}

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

//@ts-ignore
const create_payment_json = (title, price) => {
  return JSON.stringify({
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://eztik.com/api/payments/success",
      cancel_url: "http://eztik.com/api/payemnts/failed",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: title,
              sku: "item",
              price: price,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: price,
        },
        description: "This is the payment description.",
      },
    ],
  });
};

export { create_payment_json };
