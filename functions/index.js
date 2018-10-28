'use strict';

const {
  dialogflow,
  BasicCard,
  Permission,
  Suggestions,
  List,
  Image
} = require('actions-on-google');

const axios = require('axios')


const functions = require('firebase-functions');

const app = dialogflow({ debug: true });



// Handle the Dialogflow intent named 'Default Welcome Intent'.
// app.intent('Default Welcome Intent', (conv) => {
//   // Asks the user's permission to know their name, for personalization.
//   conv.ask(new Permission({
//     context: 'Hi there, to get to know you better',
//     permissions: 'NAME',
//   }));
// });

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
// app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
//   if (!permissionGranted) {
//     // If the user denied our request, go ahead with the conversation.
//     conv.ask(`OK, no worries. What's your favorite color?`);
//     conv.ask(new Suggestions('Blue', 'Red', 'Green'));
//   } else {
//     // If the user accepted our request, store their name in
//     // the 'conv.data' object for the duration of the conversation.
//     conv.data.userName = conv.user.name.display;
//     conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);
//     conv.ask(new Suggestions('Blue', 'Red', 'Green'));
//   }
// });

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
// app.intent('favorite color', (conv, {color}) => {
//   const luckyNumber = color.length;
//   const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
//   if (conv.data.userName) {
//     // If we collected user name previously, address them by name and use SSML
//     // to embed an audio snippet in the response.
//     conv.ask(`<speak>${conv.data.userName}, your lucky number is ` +
//       `${luckyNumber}.<audio src="${audioSound}"></audio> ` +
//       `Would you like to hear some fake colors?</speak>`);
//     conv.ask(new Suggestions('Yes', 'No'));
//   } else {
//     conv.ask(`<speak>Your lucky number is ${luckyNumber}.` +
//       `<audio src="${audioSound}"></audio> ` +
//       `Would you like to hear some fake colors?</speak>`);
//     conv.ask(new Suggestions('Yes', 'No'));
//   }
// });


app.intent('payment', (conv, request) => {

  // console.log(request)
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
  console.log(context1.parameters)

  const apiRoot = 'https://peaceful-island-75950.herokuapp.com/payments'

  const payment = {
    amount: context1.parameters.amount,
    currency: context1.parameters.currency,
    name: context1.parameters.name,
    description: request.desc

  }
  console.log(apiRoot)
  console.log(payment)
  console.log('requesting resource')
  return axios.post(apiRoot, payment, {
    headers: { "Content-Type": 'application/json' }
})
    .then((res) => {
      console.log(res)
      conv.close(`Alright. Transfer of ${context1.parameters.amount} ${context1.parameters.currency} to ${context1.parameters.name} completed.`)

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
      console.log('Checking balance')
      console.log(response.data)
      conv.close(`Your account balance is ${response.data.balance}`)

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
      console.log('Getting last payment')
      console.log(response.data)
      
      conv.close(`Your last payment was ${response.data.cost} ${response.data.currency} to ${response.data.toWhom} with description \"${response.data.name}\"`)
      
      
      
    })
    .catch((err) => {
      console.log(err)
      conv.close('Transfer failed')
    })
    
})



// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
