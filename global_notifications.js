

exports.sendGCM = function (registration_id, message){

console.log('input_regist ',registration_id);
console.log('global_notifications_message:',message);
var http = require('http');
var data = {
  "collapseKey":"applice",
  "delayWhileIdle":false,
  "timeToLive":0,
  "data":{
    "message":message,"title":"Sensors Detected"
    },
  "registration_ids":registration_id
};

var dataString =  JSON.stringify(data);
var headers = {
  'Authorization' : 'key=AIzaSyBqA1it_d0fo0NRt2UkTV6pKMBYYsZLYOc',
  'Content-Type' : 'application/json',
  'Content-Length' : dataString.length
};

var options = {
  host: 'android.googleapis.com',
  port: 80,
  path: '/gcm/send',
  method: 'POST',
  headers: headers
};

//Setup the request 
var req = http.request(options, function(res) {
  res.setEncoding('utf-8');

  var responseString = '';

  res.on('data', function(data) {
    responseString += data;
  });

  res.on('end', function() {
    var resultObject = JSON.parse(responseString);
    //console.log(responseString);
    //console.log(resultObject);
  });
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));

});

req.on('error', function(e) {
  // TODO: handle error.
  console.log('error : ' + e.message + e.code);
});

req.write(dataString);
req.end();



}