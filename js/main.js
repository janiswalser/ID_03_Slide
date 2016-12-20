/**
 * Created by janis on 18/12/16.
 */


var light = false;
var pressed = false;
var soundIn = true;
var soundOut = false;
var HandIn = false;


var output = document.getElementById('output');
var progress = document.getElementById('progress');
var background = document.getElementById("bg");

var posthumb;
var thumbStart, indexStart, indexEnd;
var vectorBetweenIndexStart;
var mainValue = 100;
var trackMovement = false;
var posEnter;
var saveMainValue;
var firstDistance;
var distance;



var controllerTest = Leap.loop(function(frame){

//        console.log(HandIn);
    output.innerHTML = 'distance:' + Math.round(distance) + '||' + 'distance:' + Math.round(saveMainValue) ;



    if (HandIn && soundIn) {
        $.playSound("data/txting_press_b");
        soundIn = false;
    }
    else if (!HandIn && !soundIn){
        $.playSound("data/txting_press_a");
        soundIn = true;
    }

    HandIn = false;


});


// Sobald die Hand über der Leap ist, wird die Funktion ausgeführtund wiederholt
Leap.loop({background: true}, {

    hand: function (hand) {
//            console.log("handincheck" + HandIn);
        HandIn = true;

        //progress.style.width = hand.pinchStrength * 100 + '%';
        posthumb = hand.fingers[0].dipPosition[0];

        thumbStart = new Vector(hand.fingers[0].dipPosition[0],hand.fingers[0].dipPosition[1],hand.fingers[0].dipPosition[2]);
        indexStart = new Vector(hand.fingers[1].dipPosition[0],hand.fingers[1].dipPosition[1],hand.fingers[1].dipPosition[2]);
        indexEnd = new Vector(hand.fingers[1].mcpPosition[0],hand.fingers[1].mcpPosition[1],hand.fingers[1].mcpPosition[2]);

        vectorBetweenIndexStart = vectorBetweenPoints(indexStart,indexEnd);
        lineindex = new Line(indexStart,vectorBetweenIndexStart);

        distance = lineindex.distanceFromPoint(thumbStart);

        var threshold = 22;
        var multiplier = 5;

        //enter tracking
        if(distance < threshold && trackMovement == false){
            trackMovement = true;
            posEnter = thumbStart;

            var diffVector = vectorBetweenPoints(posEnter, indexStart);
            firstDistance = diffVector.length();
            console.log(posEnter);
        }

        //tracking
        if(distance < threshold && trackMovement == true){
            diffVector = vectorBetweenPoints(posEnter, thumbStart);
            var diffLength = diffVector.length();

            diffVector = vectorBetweenPoints(thumbStart, indexStart);
            var newDistance = diffVector.length();

            if (newDistance > firstDistance) {
                saveMainValue = mainValue + diffLength * multiplier;
            }
            else {
                saveMainValue = mainValue - diffLength * multiplier;
            }
            $("#bigBar").width(saveMainValue);
            console.log("tracking " + saveMainValue);
        }

        //exit tracking
        if(distance >= threshold && trackMovement == true){
            trackMovement = false;
            mainValue = saveMainValue;
            console.log("exit");
        }













        //TAP
        if (hand.pinchStrength <= 0.95 && pressed) {
            pressed = false;
            //background.style.opacity = 0;
        }


        if (hand.pinchStrength > 0.95 && !pressed) {
//                toggle();
            pressed = true;
            // background.style.opacity = 100;

        }

//            function toggle() {
//
//                if (light) {
//                    background.style.opacity = 0;
//                    light = false;
//                }
//                else {
//                    background.style.opacity = 100;
//
//                    light = true;
//                    //window.alert("fuck");
//                }
//            }

    }




});




// Allow usage of pints
function Point(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

function Vector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

// Add two vectors
Vector.prototype.add = function(vector) {
    var vx = this.x + vector.x;
    var vy = this.y + vector.y;
    var vz = this.z + vector.z;
    return new Vector(vx,vy,vz);
}

Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}

Vector.prototype.subtract = function(vector) {
    var vx = this.x - vector.x;
    var vy = this.y - vector.y;
    var vz = this.z - vector.z;
    return new Vector(vx,vy,vz);
}

Vector.prototype.multiply = function(vector) {
    var vx = this.x * vector.x;
    var vy = this.y * vector.y;
    var vz = this.z * vector.z;
    return new Vector(vx,vy,vz);
}

Vector.prototype.divide = function(vector) {
    var vx = this.x / vector.x;
    var vy = this.y / vector.y;
    var vz = this.z / vector.z;
    return new Vector(vx,vy,vz);
}

Vector.prototype.crossProduct = function (vector) {
    var vx = (this.y * vector.z) - (this.z * vector.y);
    var vy = (this.z * vector.x) - (this.x * vector.z);
    var vz = (this.x * vector.y) - (this.y * vector.x);

    return new Vector(vx, vy, vz);
}

function Line(a, b) {
    this.stuetzvektor = a || 0;
    this.richtungsvektor = b || 0;
}

Line.prototype.distanceFromPoint = function(p) {
    var pointMinusStuetzvektor = p.subtract(this.stuetzvektor);
    var naechsterSchritt = pointMinusStuetzvektor.crossProduct(this.richtungsvektor);
    var lengthieren = naechsterSchritt.length();
    var untereHaelfte = this.richtungsvektor.length();

    return lengthieren/untereHaelfte;
};

////////////////////////////////////////

function vectorBetweenPoints(a,b) {
   var vx = a.x - b.x;
   var vy = a.y - b.y;
   var vz = a.z - b.z;
    return new Vector(vx,vy,vz);
}



