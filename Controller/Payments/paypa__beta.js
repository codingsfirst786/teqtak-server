const request = new paypal.orders.OrdersCreateRequest();
request.prefer("return=representation");

// Array of products to purchase
const products = [
    { name: 'Product 1', unit_amount: '5.00', quantity: 1 },
    { name: 'Product 2', unit_amount: '15.00', quantity: 2 }
];

// Calculate the total value from product prices and quantities
const totalValue = products.reduce((sum, product) =>
    sum + (parseFloat(product.unit_amount) * product.quantity), 0).toFixed(2);

request.requestBody({
    intent: 'CAPTURE',
    application_context: {
        return_url: `${process.env.BACK_URL}/paypal/success`,
        cancel_url: `${process.env.BACK_URL}/paypal/fail`
    },
    purchase_units: [{
        amount: {
            currency_code: 'USD',
            value: totalValue,
            breakdown: {
                item_total: { currency_code: 'USD', value: totalValue }
            }
        },
        items: products.map(product => ({
            name: product.name,
            unit_amount: { currency_code: 'USD', value: product.unit_amount },
            quantity: product.quantity
        }))
    }]
});

const order = await paypalClient.execute(request);
const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;
res.json({ id: order.result.id, approvalUrl });








// {
//     "eventId":"20de7d92-5655-4eb2-bfb5-7fca70f9907d",
//     "buyerId":"c7fc9b44-f841-49a5-b079-7b33ae6896e4",
//   "eventTicketArray": [
//     {
//       "Basic": 9
//     },
//     {
//      "Permium": 3
//     }
//   ]
// }



const getLineItems = (proArray, event) => {
    const lineItems = proArray.map((product) => ({
        name: product.name_,
        unit_amount:{ currency_code: 'USD', value: ticketPrice(product.name_, event.eventTicketArray) },
        quantity: product.quantity,
    }));
    const filteredData = lineItems.filter((e) => e.quantity != 0)
    return filteredData
}
