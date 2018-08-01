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
const fb = require('./fb');



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

            var re;

            var text = event.message.text;
            console.log(text);
            text = text.trim();
            
            if (text == 'help')
                {
                    re = 'use: \n p:[photos]\nv:[video]\n:u[url]';
                    fb.sendTextMessage(sender,re);
                }
            else {
                var im = text.split(':');
                if(im != text)
                    {
                        var cmd = im[0];
                        var data = im[1];
                        if (cmd) {
                            if (cmd == 'p') photos(data,sender);
                            else if (cmd == 'v') video(data,sender);
                            else if (cmd == 'u') sendfile(data,sender);
                            else {
                                re = cmd +' not found';
                    fb.sendTextMessage(sender,re);
                            }
                        }
                        else {
                            re = 'use: \n p:[photos]\nv:[video]\n:u[url]';
                    fb.sendTextMessage(sender,re);
                        }
                        
                        
                        
                    }
                
                else {
                    re = 'error command use help to help';
                    fb.sendTextMessage(sender,re);
                }
            }








        }
        if (event.postback) {
            var text = JSON.stringify(event.postback);
            fb.sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
            continue;
        }
    }
    
});

// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN

function photos(text,sender) {
    
    if (!text) return fb.sendTextMessage(sender,'use:\np:[photo]')
    
    var re = 'working';



              fb.sendTextMessage(sender,re);
            
            search(text,function(resu) {
                re = 'fuond '+resu.length;
                fb.sendTextMessage(sender,re);
                fb.sendPhotoMessage(sender,resu);
            });

}


function video(text,sender) {
    if (!text) return fb.sendTextMessage(sender,'use:\nv:[video]');
    fb.sendTextMessage(sender,'working for '+text);
}

function sendfile(text,sender) {
    if (!text) return fb.sendTextMessage(sender,'use:\nu:[url]');
    fb.sendTextMessage(sender,'working for '+text);
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
