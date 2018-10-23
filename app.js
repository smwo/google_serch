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
var fb = require('./fb').app;

var token = 'EAAELRvdKfxEBAKHSYSKvktygscUULLLw9ldpbfdrqvyb2xtsX96ZAke39Gch74cp8znbZA4QMRM3Hp4bHqPF5ThXPeUP1U2dfjLZAW0kzAugFegezhBviLalIiIZB9GOIA1c7M4Y8UqeoEvaX3ZCg8ZCbhfi1WSRA3ZCIA6uj7dDAZDZD';
fb = new fb(token);
var list = {}



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
            text = text.trim().toLowerCase();
            if (sender in list) {
    
                 if (text == '-stop')
                {
                    fb.stop(sender);
                }
                
                else fb.sendTextMessage('انا لم انتهي من طلبك السابق\nاكتب -stop للتوقف');
            }
            else {
                
                
                 if (text == 'help' || text == 'مساعدة')
                {
                    re =`اكتب كلمة او موضوع لبدء البحث وارسال الصور لك`;
                    fb.sendTextMessage(sender,re);
//                    re = 'Use: \n p:[photos]\nv:[video]\nu:[url]';
//                    fb.sendTextMessage(sender,re);
                }
                
                
              else {
                  list[sender] = true;
                 photos(text,sender);
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
    
    if (!text) return fb.sendTextMessage(sender,'اكتب كلمة للبحث');
    
    var re = 'انتظر, ستظهر النتائج';

              fb.sendTextMessage(sender,re);
            
            search(text,function(resu) {
                re = 'وجد '+resu.length;
                fb.sendTextMessage(sender,re);
                fb.sendPhotoMessage(sender,resu,() => {
                fb.sendTextMessage(sender,'ok');
                delete list[sender];
                });
            });

}


//function video(text,sender) {
//    if (!text) return fb.sendTextMessage(sender,'use:\nv:[video]');
//    fb.sendTextMessage(sender,'working for '+text);
//    srh_video(sender,text);
//}
//
//function sendfile(text,sender) {
//    if (!text) return fb.sendTextMessage(sender,'use:\nu:[url]');
//    fb.sendTextMessage(sender,'working for '+text);
//}




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


//function srh_video(sender,text) {
//     var search_v = require('youtube-search');
//
//var opts = {
//  maxResults: 2,
//  key: 'AIzaSyAPyZWOyC70TvVqJWAQVzsa6t1-b8T8gkY'
//};

//search_v('اختراق حسابات فيس ', opts, function(err, results) {
//  if(err) return console.log(err);
//    fb.sendVideo(sender,results[0]);
//});
//}



// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});
