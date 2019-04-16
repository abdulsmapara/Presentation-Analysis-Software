var fs = require('fs');
var Cookie = require('cookie-parser');
var login_module = require('./login');
//var filename = "";
var validator = require('express-validator');
var presentation_module = require('./presentation');

var upload_module = require('./upload');
//var filename = "";
var validator = require('express-validator');
        // pull in the required packages.
var sdk = require("microsoft-cognitiveservices-speech-sdk");
// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you want to run
// through the speech recognizer.
var subscriptionKey = "9e48f5d03e9c46aa89e3f5d11cc15cdb";
var serviceRegion = "westus"; // e.g., "westus"

// create the push stream we need for the speech sdk.
var pushStream = sdk.AudioInputStream.createPushStream();


exports.analysePresentation = function (req,res) {

    if (!fs.existsSync('uploads/'))
    {
        fs.mkdirSync('uploads/');
    }

    var upload = upload_module.uploadFile('video[]', './uploads/');
    upload(req, res, function (err) {
        if (err) {
            console.log('error ' + err);
        }else{
    console.log('FILE UPLOADED');
    var fname = upload_module.name();
    console.log('HERE IS MY FILE '+ fname);
    var filename = "./uploads/"+fname // 16000 Hz, Mono
    console.log("Now recognizing from: " + filename);

    // open the file and push it to the push stream.
    fs.createReadStream(filename).on('data', function(arrayBuffer) {
      pushStream.write(arrayBuffer.buffer);
    }).on('end', function() {
      pushStream.close();
    });

    // we are done with the setup
    
    // now create the audio-config pointing to our stream and
    // the speech config specifying the language.
    var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

    // setting the recognition language to English.
    speechConfig.speechRecognitionLanguage = "en-US";

    // create the speech recognizer.
    var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // start the recognizer and wait for a result.
    recognizer.recognizeOnceAsync(
      function (result) {
        fs.writeFile('./uploads/Speech.txt',result.privText,function(err) {
            if(err) {
                recognizer.close();
                recognizer = undefined;
            } else {
                recognizer.close();
                recognizer = undefined;
                console.log('FINISHED ANALYSING ' + result.privText);                
            }
        });
        
      },
      function (err) {
        console.trace("err - " + err);
        console.log('-----------------------HERE IS AN ERROR-----------------------');
        recognizer.close();
        recognizer = undefined;
        fs.unlink('uploads/' + file, function (err) {
            if (err) throw err;
            res.send("Error Occurred");

            });
        
        });

        }
    });
}