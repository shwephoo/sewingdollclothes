'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server
  
  const request = require('request');
  const requestify = require('requestify');
  const PAGE_ACCESS_TOKEN = 'EAAkIPYzXXeQBAH3rD9L1MeLByZCq3bYpbbqduUditZAGWXjZC5Wd1MBvQ3nGqTH0b34wQKhTt5QCdiugJR3ZAeiVRx7ZB3n0ZCRoVYstuGgjoE1IGCSkVrlTalU96n5uo0elmQH1AAWiFFM1XQoq4oqaQjLlWKhnLeZA8f5u5O9FOhFbkgL9qpj'

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object == 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        var sender_psid = webhook.webhook_event.sender.id;
        if (webhook_event.message) {
            var text = webhook_event.message.text;
            //handleMessage(sender_psid, webhook_event.message);        
            console.log("text:", text);
               if(text=='Hi'|| text=="hi"){
                response = {
                    "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
                  }
                  let request_body = {
                    "recipient": {                
                      "id": sender_psid                
                    },                
                    "message": response                
                  }
                                
                  request({                
                    "uri": "https://graph.facebook.com/v5.0/me/messages",                
                    "qs": { "access_token": PAGE_ACCESS_TOKEN },                
                    "method": "POST",                
                    "json": request_body                
                  }, (err, res, body) => {                
                    if (!err) {                
                      console.log('message sent!')                
                    } else {                
                      console.error("Unable to send message:" + err);                
                    }                
                  }); 
               } 
          } 
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });

  // Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "abcd"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });

  // Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
