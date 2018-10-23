
const request = require('request');

class fb {
    constructor(token,Id) {
    this.Id = Id;
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
    
    sendPhotoMessage(sender, urls, callback) {
    if (! this.sender)
    this[sender] = {urls:urls};
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
        
        this[sender].urls.shift();
        if (this[sender].urls.length >= 1)
        this.sendPhotoMessage(sender,this[sender].urls,callback);
        else {callback()}
        
    });
    
}
    
     stop(Id) {
    this[Id].urls = [];
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