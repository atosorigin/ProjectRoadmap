window.onload = function(){
	setup();
}

function setup(){	
	var backgroundCanvas = document.getElementById('backgroundCanvas');
	var canvas = document.getElementById('draggableCanvas');
	
	drawBackground();
	
	obj = {x:50, y:50, w:70, h:70};
	
	obj2 = {x:150, y:150, w:70, h:70};
	
	
	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight * 0.8;
	
	
	canvas.addEventListener('mousedown', mouseDown, false)
	
	window.addEventListener('mouseup', mouseUp, false);
	
	document.getElementById('exportButton').addEventListener('click', savePNG, false);
	
	draw();
		
	function mouseUp()
	{
		window.removeEventListener('mousemove', divMove, true);
	}

	function mouseDown(e){
		window.addEventListener('mousemove', divMove, true);
	}

	function divMove(e){
		//var draggable = document.getElementById("draggable");
		//draggable.style.top = e.clientY + 'px';
		//draggable.style.left = e.clientX + 'px';
		
		if(detectHit(obj.x, obj.y, e.clientX, e.clientY, obj.w, obj.h)){
			obj.x = e.clientX;
			obj.y = e.clientY;
			
			draw();
		}else if(detectHit(obj2.x, obj2.y, e.clientX, e.clientY, obj2.w, obj2.h)){
			obj2.x = e.clientX;
			obj2.y = e.clientY;
			
			draw();
		}
		event.preventDefault();
	}
	
	function detectHit(x1, y1, x2, y2, w, h){
		if(x2-x1>w)return false;
		if(y2-y1>h)return false;
		return true;
	}

	function draw(){
		var canvas = document.getElementById('draggableCanvas');
		var ctx = canvas.getContext('2d');
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.fillStyle = 'blue';
		
		ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
		
		ctx.fillStyle = 'red';
		
		ctx.fillRect(obj2.x, obj2.y, obj2.w, obj2.h);
		
	}
	
	function savePNG(){
		ctx = canvas.getContext('2d');
		ctx.drawImage(backgroundCanvas, 0, 0);
		
		var dataURL = canvas.toDataURL("image/png");
		//document.write('<img src="'+dataURL+'"/>');
		//window.open(dataURL);
		document.getElementById('exportButton').href = dataURL;
	}
	
	function drawBackground(){
		
		backgroundCanvas.width = window.innerWidth * 0.8;
		backgroundCanvas.height = window.innerHeight * 0.8;
		
		var backCtx = backgroundCanvas.getContext("2d");
		
		var backgroundImage = new Image();
		backgroundImage.onload = function(){
			backCtx.drawImage(backgroundImage,50,50);  
		}
		backgroundImage.src = "images/AFISH.png";
	}
}


