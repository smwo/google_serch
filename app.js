//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com
i have added console.log on line 48
 */








const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var fs = require('fs');
var cookieParser = require('cookie-parser');
const app = express();
app.use(express.static('public'));
var gis = require('g-i-s');



app.set('port', (process.env.PORT || 5000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

// index
app.get('/', function (req, res) {
   res.end('');
});



// for facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'samer') {
        res.send(req.query['hub.challenge']);
        console.log(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong token');
    }
})

// to post data
app.post('/webhook/', function (req, res) {

   // console.log(cmds);
    var messaging_events = req.body.entry[0].messaging;
    console.log(messaging_events);
    res.sendStatus(200);
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;



        if (event.message && event.message.text) {



            var text = event.message.text;
            console.log(text);




var re = 'working';



              sendTextMessage(sender,re);
            
            search(text,function(resu) {
                re = 'fuond '+resu.length;
                sendTextMessage(sender,re);
                sendPhotoMessage(sender,resu);
            });





        }
        if (event.postback) {
            var text = JSON.stringify(event.postback);
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
            continue;
        }
    }
    
});

// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN


function sendTextMessage(sender, text) {
    var token = "EAAELRvdKfxEBAP3cXdhHbh01sUalCZCGqZBKRL6ZCdPZAE3UjZC95A9LVVmCFhQTaFHALIL87RGOBgKF7SFB6Ti4gjd8fZA2t2QeUlmIIQOS9D2XFmC5aZBM3hxDNRX0WguyW7vfdylnczsWNTxpmZCxpwBos7DnZBpACuokckNT10HyNpkUvq7DM";
    var messageData = { text:text };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData
        }
    }, function(error, response, body) {
        if (error) {
            {console.log('Error sending messages: ', error);
                token_chk = true;
            }
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}


function sendPhotoMessage(sender, urls) {
    var token = "EAAELRvdKfxEBAP3cXdhHbh01sUalCZCGqZBKRL6ZCdPZAE3UjZC95A9LVVmCFhQTaFHALIL87RGOBgKF7SFB6Ti4gjd8fZA2t2QeUlmIIQOS9D2XFmC5aZBM3hxDNRX0WguyW7vfdylnczsWNTxpmZCxpwBos7DnZBpACuokckNT10HyNpkUvq7DM";
    var messageData = { attachment:{
        "type":"image",
        "payload":{
        "url":urls[0], 
        "is_reusable":true
      }
    } };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData
        }
    }, function(error, response, body) {
        if (error) {
            {console.log('Error sending messages: ', error);
               
            }
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
            
        }
        
        urls.shift();
        if (urls.length >= 1)
        sendPhotoMessage(sender,urls);
        else sendTextMessage(sender,'ok');
        
    });
}



function search(text,fn) {
    
    
    var list = [];
    gis(text, logResults);

function logResults(error, results) {
  if (error) {
    console.log(error);
  }
  else {
    for (var i in results)
        {
            list.push(results[i].url);
        }
      
      fn(list);
  }
}
    
    
    
}



// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});
