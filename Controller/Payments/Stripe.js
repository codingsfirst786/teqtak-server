require('dotenv').config
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Event = require('../../Schemas/Events')
const User = require('../../Schemas/User')
const jwt = require('jsonwebtoken');

const jwtGen = (data) => jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '15m' });
  

// const ticketPrice = (ticketName, ticketArray) => {
//   const ticket = ticketArray.filter((e) => e.ticketType == ticketName)
//   return ticket[0].price
// }
const ticketPrice = (ticketName, ticketArray) => {
  const ticket = ticketArray.find((e) => e.ticketType === ticketName);
  console.log({ ticket, ticketName, ticketArray });
  return ticket ? ticket.price : 0; // Return 0 if no ticket matches
};


const getLineItems = (proArray, event) => {
  // prodArray will have ticket name with there quantity.....
  //meanwhile event will have event object
  // it shall return lineitems
  const lineItems = proArray.map((product) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name_,
        description: event._id
      },
      unit_amount: ticketPrice(product.name_, event.eventTicketArray) * 100,
    },
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

const paymentByStripe = async (req, res) => {
  console.log("stripe payment")
  const event = await Event.get(req.body.eventId);
  const products = Object.entries(req.body.eventTicketArray).map(([name_, quantity]) => ({ name_, quantity }));
  const eventID = req.body.eventId;
  const buyerID = req.body.buyerId;
  const metadata = {
    ticketEventId: eventID,
    ticketBuyerId: buyerID,
    ticketMetadata:JSON.stringify({purchase_units: products}),
    totalAmount:Total_Factory(products,event)
  }
  console.log({products,event})
  console.log("body is",req.body)

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: getLineItems(products, event),
      mode: 'payment',
      success_url: `${process.env.BACK_URL}/tickets/gen?meta=${jwtGen(metadata)}`,
      cancel_url: `${process.env.FRONT_URL}/paymentfailed`,
      payment_intent_data: {
        metadata:metadata,

      },
    });
    console.log({ url: session.url})
    res.json({
      sessionId: session,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
}

module.exports = { paymentByStripe}