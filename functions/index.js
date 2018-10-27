'use strict';

const {
  dialogflow,
  BasicCard,
  Permission,
  Suggestions,
} = require('actions-on-google');


const functions = require('firebase-functions');

const app = dialogflow({debug: true});



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

  console.log(request)
  conv.ask(`You transfered ${request['unit-currency'].amount} ${request['unit-currency'].currency} to ${request['given-name']}`);
  

  conv.ask('What should be the description of the transfer?') 
  });




app.intent('paymentDescription', (conv, request) => {

  console.log(request)
  
  conv.end('Allright. Transfer completed.') 
  });

// Handle the Dialogflow intent named 'favorite fake color'.
// The intent collects a parameter named 'fakeColor'.
// app.intent('favorite fake color', (conv, {fakeColor}) => {
//   // Present user with the corresponding basic card and end the conversation.
//   conv.close(`Here's the color`, new BasicCard(colorMap[fakeColor]));
// });

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
