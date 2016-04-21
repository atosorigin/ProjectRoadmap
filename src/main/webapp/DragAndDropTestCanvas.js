window.onload = function(){
	setup();
}

function setup(){	
	var backgroundCanvas = document.getElementById('backgroundCanvas');
	var canvas = document.getElementById('draggableCanvas');

	var backCtx = backgroundCanvas.getContext("2d");
	var ctx = canvas.getContext('2d');

	var currentObject = null;

	setupCanvas();
	drawBackground();

	//Draw sample objects
	var stakeholderList = [
	    {x:50, y:50, w:70, h:70, colour:'#FF0000'},
	    {x:150, y:150, w:70, h:70, colour:'#0000FF'}
	]
	
	canvas.addEventListener('mousedown', mouseDown, false)
	
	window.addEventListener('mouseup', mouseUp, false);
	
	document.getElementById('exportButton').addEventListener('click', savePNG, false);
	
	draw();
		
	function mouseUp()
	{
		window.removeEventListener('mousemove', divMove, true);
	}

	function mouseDown(e){
        for(var i = 0; i < stakeholderList.length; i++){

            var staker = stakeholderList[i];

            if(detectHit(staker.x, staker.y, e.clientX, e.clientY, staker.w, staker.h)){
                currentObject = staker;
                window.addEventListener('mousemove', divMove, true);
                break;
            }
        }
    }

	function divMove(e){
        currentObject.x = e.clientX;
        currentObject.y = e.clientY;
        draw();
	}
	
	function detectHit(objx, objy, mousex, mousey, objw, objh){
	    if((mousex > objx && mousex < (objx+objw)) && (mousey > objy && mousey < (objy+objh))){
	        return true;
	    }else{
	        return false;
	    }
	}

	function draw(){

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(var i = 0; i < stakeholderList.length; i++){
            var staker = stakeholderList[i];

            ctx.fillStyle = staker.colour;
            ctx.fillRect(staker.x, staker.y, staker.w, staker.h)
        }
	}
	
	function savePNG(){
		ctx.drawImage(backgroundCanvas, 0, 0);

		var dataURL = canvas.toDataURL("image/png");
		dataURL.replace("image/png", "image/octet-stream");
		document.getElementById('exportButton').href = dataURL;

	}
	
	function drawBackground(){

		var backgroundImage = new Image();
		backgroundImage.onload = function(){
			backCtx.drawImage(backgroundImage,50,50);
		}
		backgroundImage.src = "images/AFISH.png";
	}

	function setupCanvas(){
	    canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;

	    backgroundCanvas.width = window.innerWidth * 0.8;
        backgroundCanvas.height = window.innerHeight * 0.8;
	}

	function addStakholder(){
	    var newStaker = {x:50, y:50, w:70, h:70, colour:'#00FF00'};
	    stakeholderList.push(newStaker);
	}
}


