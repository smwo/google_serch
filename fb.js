
const request = require('request');

class fb {
    constructor(token,) {
    this.token = token;
    this.s = false;
  }
   sendTextMessage(sender, text) {
    var messageData = { text:text };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:this.token},
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
    
    sendPhotoMessage(sender, urls) {
    this.s = true;
    var messageData = { attachment:{
        "type":"image",
        "payload":{
        "url":urls[0], 
        "is_reusable":true
      }
    } };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:this.token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData
        }
    }, 
            
        (error, response, body) => {
        if (error) {
            {console.log('Error sending messages: ', error);
               
            }
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
            
        }
        
        urls.shift();
        if (this.s == false) urls = [];
        if (urls.length >= 1)
        sendPhotoMessage(sender,urls);
        else sendTextMessage(sender,'ok');
        
    });
    
}
    
     stop() {
    this.s = false;
}
    
}

 








//function sendVideo(sender,v) {
//    
//     
//    var messageData = { attachment:{
//        "type":"video",
//        "payload":{
//        "url":v.link, 
//        "is_reusable":true
//      }
//    } };
//
//    request({
//        url: 'https://graph.facebook.com/v2.6/me/messages',
//        qs: {access_token:token},
//        method: 'POST',
//        json: {
//            recipient: {id:sender},
//            message: messageData
//        }
//    }, function(error, response, body) {
//        if (error) {
//            {console.log('Error sending messages: ', error);
//               
//            }
//        }
//        else if (response.body.error) {
//            console.log('Error: ', response.body.error);
//            
//        }
//        
//        sendTextMessage(sender,v.link);
//        
//    });
//
//    
//}
//
//function sendfile() {
//    
//}





exports.app = fb;