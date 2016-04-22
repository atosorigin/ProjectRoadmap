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
	var stakeholderList = [];
	
	canvas.addEventListener('mousedown', mouseDown, false)
	
	window.addEventListener('mouseup', mouseUp, false);

	document.getElementById('addNewStakeholderForm').addEventListener('submit', addStakholder, false);
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
            ctx.font = '15px Arial';
            ctx.fillStyle = "#000000";
            ctx.fillText(staker.stakeholderName, staker.x, staker.y + staker.h + 12)
        }
	}
	
	function savePNG(){
	    var output = document.createElement('canvas');
		output.width = window.innerWidth * 0.6;
        output.height = window.innerHeight;
		var outCtx = output.getContext('2d');

		outCtx.drawImage(backgroundCanvas, 0, 0);
		for(var i = 0; i < stakeholderList.length; i++){
            var staker = stakeholderList[i];

            outCtx.fillStyle = staker.colour;
            outCtx.fillRect(staker.x, staker.y, staker.w, staker.h)
        }

		var dataURL = output.toDataURL("image/png");
        document.getElementById('exportButton').href = dataURL;
	}
	
	function drawBackground(){

		var backgroundImage = new Image();
		backgroundImage.onload = function(){

			backCtx.drawImage(backgroundImage, 10, 10, 700, 700);
		}
		backgroundImage.src = "images/stakeholderManagementAxis-500.svg";
	}

	function setupCanvas(){
	    canvas.width = window.innerWidth * 0.6;
        canvas.height = window.innerHeight;

	    backgroundCanvas.width = window.innerWidth * 0.6;
        backgroundCanvas.height = window.innerHeight;
	}

	function addStakholder(e){
	    e.preventDefault

	    if(document.getElementById("stakeholderName").value){
            var newStaker = {
                x:20, y:20, w:70, h:70,
                colour:randomColour(),
                stakeholderName: document.getElementById("stakeholderName").value
            };

            document.getElementById("stakeholderName").value = "";
            stakeholderList.push(newStaker);

            draw();
	    }else{
	        alert('Please enter a name');
	    }
	}

	function randomColour(){
	    return '#'+Math.floor(Math.random()*16777215).toString(16);
	}

}


