const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

var gamepos = [];

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

// Starting of the WebSocket Server

function StartSocket()
{
    ws = new WebSocket("ws://localhost:3000");

        //On sucessful connection with socket server 
        ws.onopen = function() {
            console.log("Connected with socket");
        };
        //Message received from socket server
        ws.onmessage = function(payload) {
            console.log(payload.data);
        };
        //Trying to reconnect if the connection in down for some reason or has been severed 
        ws.onclose = function() {
            console.log("Disconnected");
            console.log("Trying again");
        //Trying to reconnect in 5 seconds after the connection is lost
        setTimeout(function(){StartSocket()}, 5000);//recursively calling the function durring connection loss

        }; 
}
StartSocket();

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



function runDetection() {
    model.detect(video).then(predictions => {
       // console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
        if (predictions[0]) {
            let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
            let midvaly = predictions[0].bbox[1] + (predictions[0].bbox[3] /2)
            gamepos[0] = document.body.clientWidth * (midval / video.width)
            gamepos[1] = document.body.clientHeight * (midvaly / video.height)
           // updatePaddleControl(gamex)
            console.log('X: ', gamepos[0]);
            console.log('Y: ', gamepos[1]);

            var gameJson = JSON.stringify(gamepos);
            SendtoSocketServer(gameJson);

            console.log(gameJson);

        }
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

var SendtoSocketServer = (gameJson)=>{

    ws.send(gameJson);
    console.log("Data has been sent");
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});

function updatePaddleControl(x) {
    // gamex = x;
    let mouseX = convertToRange(x, windowXRange, worldXRange);
    //let lineaVeloctiy = Vec2((mouseX - paddle.getPosition().x) * accelFactor, 0)
    // paddle.setLinearVelocity(lineaVeloctiy)
    // paddle.setLinearVelocity(lineaVeloctiy)
    lineaVeloctiy.x = isNaN(lineaVeloctiy.x) ? 0 : lineaVeloctiy.x
    //paddle.setLinearVelocity(lineaVeloctiy)
    //console.log("linear velocity", lineaVeloctiy.x, lineaVeloctiy.y)
}
