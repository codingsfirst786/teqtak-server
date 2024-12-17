require('dotenv').config
const paypalClient = require('../../Config/PayPalConfig');
const paypal = require('@paypal/checkout-server-sdk');
const Event = require('../../Schemas/Events')
const User = require('../../Schemas/User')
const jwt = require('jsonwebtoken');

const jwtGen = (data) => jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '15m' });
// const ticketPrice = (ticketName, ticketArray) => {
//     const ticket = ticketArray.filter((e) => e.ticketType == ticketName)
//     console.log({ticket,ticketName,ticketArray})
//     return ticket[0].price
// }
const ticketPrice = (ticketName, ticketArray) => {
    const ticket = ticketArray.find((e) => e.ticketType === ticketName);
    console.log({ ticket, ticketName, ticketArray });
    return ticket ? ticket.price : 0; // Return 0 if no ticket matches
};



const getLineItems = (proArray, event) => {
    const lineItems = proArray.map((product) => ({
        name: product.name_,
        unit_amount: { currency_code: 'USD', value: ticketPrice(product.name_, event.eventTicketArray) },
        quantity: product.quantity,
    }));

    const filteredData = lineItems.filter((e) => e.quantity != 0)
    return filteredData

}

const Total_Factory = (proArray, event) => {
    const lineItems = proArray.map((product) => (parseInt(product.quantity) * ticketPrice(product.name_, event.eventTicketArray)
    ));
    const filteredData = lineItems.filter((e) => e.quantity != 0)
    return filteredData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

const paymentByPayPal = async (req, res) => {
    console.log("pay pal payment")
    console.log({body:req.body})
    const event = await Event.get(req.body.eventId);
    const products = Object.entries(req.body.eventTicketArray).map(([name_, quantity]) => ({ name_, quantity }));
    console.log({products })

    const metadata = {
        ticketEventId: req.body.eventId,
        ticketBuyerId: req.body.buyerId,
        ticketMetadata:JSON.stringify({purchase_units: products}),
        totalAmount:  Number(Total_Factory(products, event))
    }

    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            application_context: {
                cancel_url: `${process.env.BACK_URL}/paypal/fail`,
                return_url: `${process.env.BACK_URL}/tickets/gen?meta=${jwtGen(metadata)}`
            },
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: Total_Factory(products, event)
                }
            }]
        });
        const order = await paypalClient.execute(request);
        const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;
        res.json({ id: order.result.id, approvalUrl });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });

    }
}


const paypalSuccess = (req, res) => {
    console.log("paypal success")
    res.json({ data: req.query })
    // res.json({data:"req.query"})
}

module.exports = { paymentByPayPal, paypalSuccess }