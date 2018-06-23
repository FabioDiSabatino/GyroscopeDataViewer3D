(function(){

    var yaw1 = 0;
    var pitch1 = 0;
    var roll1 = 0;
    var y1 = 0.0, p1 = 0.0, r1 = 0.0, y2 = 0.0, p2 = 0.0, r2 = 0.0;
    var animating = false;
    var startTime = 0;
    var totalTime = 0;
    counter=0;

    function doInterpAnimationStep() {
        var currTime = (new Date()).getTime();
        var dT = (currTime - startTime) / 1000.0;
        if (dT > totalTime) {
            animating = false;
            return;
        }
        dT = dT/totalTime;

        glcanvas.yawAngle = (1-dT)*y1 + dT*y2;
        yawTxt.value = "" + (glcanvas.yawAngle*180.0/Math.PI).toFixed(1);
        yawSlider.value = glcanvas.yawAngle * 1000.0/(2*Math.PI);

        glcanvas.pitchAngle = (1-dT)*p1 + dT*p2;
        pitchTxt.value = "" + (glcanvas.pitchAngle*180.0/Math.PI).toFixed(1);
        pitchSlider.value = glcanvas.pitchAngle * 1000.0/(2*Math.PI);

        glcanvas.rollAngle = (1-dT)*r1 + dT*r2;
        rollTxt.value = "" + (glcanvas.rollAngle*180.0/Math.PI).toFixed(1);
        rollSlider.value = glcanvas.rollAngle * 1000.0/(2*Math.PI);

        requestAnimFrame(doInterpAnimationStep);

        glcanvas.repaint();


    }

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("debug");
        $('body').on('contextmenu', '#MainGLCanvas', function(e){ return false; }); //Need this to disable the menu that pops up on right clicking
        glcanvas = document.getElementById("MainGLCanvas");

        GimbalCanvas(glcanvas);//Add fields to glcanvas that help with rendering
        glcanvas.mesh.loadFile("FinalBaseMesh.obj");
        glcanvas.initGimbals();


         displayGimbalsCheckbox = document.getElementById('displayGimbalsCheckbox');
        displayGimbalsCheckbox.addEventListener('change', function(e) {
            glcanvas.displayGimbals = displayGimbalsCheckbox.checked;
            requestAnimFrame(glcanvas.repaint);
        });
        displayGimbalsCheckbox.checked = true;

        //Yaw stuff
         yawSlider = document.getElementById('yawSlider');
         yawTxt = document.getElementById('yawTxt');
        yawSlider.addEventListener('input', function(e) {
            glcanvas.yawAngle = 2*Math.PI*yawSlider.value/1000.0;
            yawTxt.value = "" + (glcanvas.yawAngle*180.0/Math.PI).toFixed(1);
            requestAnimFrame(glcanvas.repaint);
        });
        function callYawSet() {
            glcanvas.yawAngle = Math.PI*parseFloat(yawTxt.value)/180.0;
            yawSlider.value = glcanvas.yawAngle*1000/(Math.PI);
            requestAnimFrame(glcanvas.repaint);
        }

        //Pitch stuff
         pitchSlider = document.getElementById('pitchSlider');
         pitchTxt = document.getElementById('pitchTxt');
        pitchSlider.addEventListener('input', function(e) {
            glcanvas.pitchAngle = 2*Math.PI*pitchSlider.value/1000.0;
            pitchTxt.value = "" + (glcanvas.pitchAngle*180.0/Math.PI).toFixed(1);
            requestAnimFrame(glcanvas.repaint);
        });
        function callPitchSet() {
            glcanvas.pitchAngle = Math.PI*parseFloat(pitchTxt.value)/180.0;
            pitchSlider.value = glcanvas.pitchAngle*1000/(2*Math.PI);
            requestAnimFrame(glcanvas.repaint);
        }

        //Roll stuff
         rollSlider = document.getElementById('rollSlider');
         rollTxt = document.getElementById('rollTxt');
        rollSlider.addEventListener('input', function(e) {
            glcanvas.rollAngle = 2*Math.PI*rollSlider.value/1000.0;
            rollTxt.value = "" + (glcanvas.rollAngle*180.0/Math.PI).toFixed(1);
            requestAnimFrame(glcanvas.repaint);
        });
        function callRollSet() {
            glcanvas.rollAngle = Math.PI*parseFloat(rollTxt.value)/180.0;
            rollSlider.value = glcanvas.rollAngle*1000/(2*Math.PI);
            requestAnimFrame(glcanvas.repaint);
        }
        requestAnimFrame(glcanvas.repaint);


        //Put some initial values in the textboxes and sliders
        yawTxt.value = "0";
        callYawSet();
        pitchTxt.value = "0";
        callPitchSet();
        rollTxt.value = "0";
        callRollSet();

        //Animation functions

        function callOrientation1SetCurrent() {
            yaw1.value = yawTxt.value;
            pitch1.value = pitchTxt.value;
            roll1.value = rollTxt.value;
        }
        function callOrientation2SetCurrent() {
            yaw2.value = yawTxt.value;
            pitch2.value = pitchTxt.value;
            roll2.value = rollTxt.value;
        }




    });



    var ws = new WebSocket('ws://localhost:3000');
    // event emmited when connected
    ws.onopen = function () {
        console.log('client is connected ...')
        // sending a send event to websocket server
        ws.send('connected')
    };
    // event emmited when receiving message
    ws.onmessage = function (ev) {


        var data=ev.data;
        var rotation=data.split('|');

        rotation=rotation[2].split(';');

        yaw=rotation[0];

        if (Math.abs(yaw - yaw1) > 0) {
            mesh.rotation.y=(yaw) * Math.PI / 180;
            yaw1=yaw;
        }


        for(var i=11;i<12;i++){
            mesh.skeleton.bones[i].rotation.set(0,90,0);
        }


        console.log(yaw);



         /*   if (Math.abs(rotation[0] - yaw1) > 0|| Math.abs(rotation[1] - pitch1) > 0 || Math.abs(rotation[2] - roll1) > 0 ) {
                y1 = parseFloat(yaw1) * Math.PI / 180;
                p1 = parseFloat(pitch1) * Math.PI / 180;
                r1 = parseFloat(roll1) * Math.PI / 180;
                y2 = parseFloat(rotation[0]) * Math.PI / 180;
                p2 = parseFloat(rotation[1]) * Math.PI / 180;
                r2 = parseFloat(rotation[2]) * Math.PI / 180;
                totalTime = (Math.abs(y1 - y2) + Math.abs(p1 - p2) + Math.abs(r1 - r2)) / (Math.PI); //1 Second for each 180 degree change
                animating = true;
                startTime = (new Date()).getTime();
                requestAnimFrame(doInterpAnimationStep);

                yaw1 = rotation[0];
                pitch1 = rotation[1];
                roll1 = rotation[2];

                console.log( rotation[2]);
                counter++;

            }*/



    }


})();