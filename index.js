// heroku logs -t -a sewingdollclothes

// deploy --> github desktop 1. commit  2. push --> heroku 3. deploy

'use strict';

// Imports dependencies and set up http server
const

  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server
  
  const request = require('request');
  const requestify = require('requestify');
  const PAGE_ACCESS_TOKEN = 'EAAkIPYzXXeQBANwIkMjSLeqPFIFWelgtlPQM9iSKyE9IE1ZCaTBw3h6EMA8Q3NKkjuep3hiLPxsZB2mi4RUXSERy23bXQM3eGZBuKZAriRyu1sFiZCdEQ0JlxjVvaF3BVyMaHD9m9PLnQqZCV0j7NgkhGGAthBfFwacfTkrDDJInE1EwpX9MMW';

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        var sender_psid = webhook_event.sender.id;
        if (webhook_event) {
            if (webhook_event.message){
              var text = webhook_event.message.text
            }
            if (webhook_event.postback){
              var text = webhook_event.postback.payload
            }
            //handleMessage(sender_psid, webhook_event.message);        
            console.log("text:", text);

            if(text=='Get_Started'|| text=="hi" || text=="Hi" || text=="Hello" || text=="hello"){

                  var response = {
                    "text": `Hello, Welcome from Dam Dam Sewing Doll Clothes!`
                  }
                  var request_body = {
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
               else if(text=='button'){
                var response = {
                  "text": "Pick a color:",
                  "quick_replies":[
                    {
                      "content_type":"text",
                      "title":"Red",
                      "payload":"<POSTBACK_PAYLOAD>",
                      "image_url":"http://example.com/img/red.png"
                    },{
                      "content_type":"text",
                      "title":"Green",
                      "payload":"<POSTBACK_PAYLOAD>",
                      "image_url":"http://example.com/img/green.png"
                    }
                  ]
                }
                var request_body = {
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
