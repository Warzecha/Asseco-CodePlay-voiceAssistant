'use strict';

const {
  dialogflow,
  BasicCard,
  Permission,
  Suggestions,
  List,
  Image
} = require('actions-on-google');

const functions = require('firebase-functions');
const app = dialogflow({ debug: true });
const axios = require('axios')

app.intent('payment', (conv, request) => {
  const currencyAmount = request['unit-currency'].amount
  const currency = request['unit-currency'].currency
  const name = request['given-name']

  conv.ask(`You want to transfer ${currencyAmount} ${currency} to ${name}. `);
  const contextParameters = {
    amount: currencyAmount,
    currency: currency,
    name: name
  };

  conv.contexts.set('context1', 5, contextParameters);
  conv.ask('What should be the description of the transfer?')
});

app.intent('paymentDescription', (conv, request) => {

  const context1 = conv.contexts.get('context1')
  const apiRoot = 'https://peaceful-island-75950.herokuapp.com/payments'
  const payment = {
    amount: context1.parameters.amount,
    currency: context1.parameters.currency,
    name: context1.parameters.name,
    description: request.paymentDescription

  }

  console.log(payment)
  return axios.post(apiRoot, payment, {
    headers: { "Content-Type": 'application/json' }
  })
    .then((res) => {
      conv.ask(`Alright. Transfer of ${context1.parameters.amount} ${context1.parameters.currency} to ${context1.parameters.name} completed.`)
    })
    .catch((err) => {
      console.log(err)
      conv.close('Transfer failed')
    })

})

app.intent('balance', (conv, request) => {

  const apiRoot = 'https://peaceful-island-75950.herokuapp.com/balance'
  return axios.get(apiRoot)
    .then((response) => {
      conv.ask(`Your account balance is ${response.data.balance} PLN`)

    })
    .catch((err) => {
      console.log(err)
      conv.close('Transfer failed')
    })
})

app.intent('lastPayment', (conv, request) => {
  const apiRoot = 'https://peaceful-island-75950.herokuapp.com/last'
  return axios.get(apiRoot)
    .then((response) => {
      conv.close(`Your last payment was ${response.data.cost} ${response.data.currency} to ${response.data.toWhom} with description \"${response.data.name}\"`)
    })
    .catch((err) => {
      console.log(err)
      conv.close('Transfer failed')
    })
})


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
