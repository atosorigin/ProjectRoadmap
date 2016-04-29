window.onload = function(){
	setup();
}

/* Variables */
var backgroundCanvas;
var canvas;
var backCtx;
var ctx;

var stakeholders = [];

var colourList = [
    '#7bd148',
    '#5484ed',
    '#a4bdfc',
    '#46d6db',
    '#7ae7bf',
    '#51b749',
    '#fbd75b',
    '#ffb878',
    '#ff887c',
    '#dc2127'
];
var nextColourIndex = 1;

var canvasSide;
var canvasArea;

function setup(){
    document.getElementById("projectID").focus();

    //Get canvas objects
	backgroundCanvas = document.getElementById('backgroundCanvas');
	canvas = document.getElementById('draggableCanvas');
	backCtx = backgroundCanvas.getContext("2d");
	ctx = canvas.getContext('2d');

    stakeholders = [];

    //Get the appropriate size for the canvas
    canvasSide;
    canvasArea;
    screenChanged();

	canvas.addEventListener('mousedown', mouseDown, false);

	window.addEventListener('mouseup', mouseUp, false);
	window.addEventListener("resize", screenChanged);

	document.getElementById('addNewStakeholderForm').addEventListener('submit', addStakholder, false);
	document.getElementById('exportButton').addEventListener('click', savePNG, false);
	document.getElementById('resetButton').addEventListener('click', reset, false);
    $('select[name="colorpicker"]').simplecolorpicker({picker: true});
    $('#nextColour').on('change', function(e) {
        getNextColour()
    });
	//document.getElementById('helpButton').addEventListener('click', drawHelp, false);
	
	draw();
}

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
    for(var i = 0; i < stakeholders.length; i++){

        var staker = stakeholders[i];

        if(detectHit(staker.x, staker.y, e.clientX, e.clientY, staker.w, staker.h)){
            currentObject = staker;
            window.addEventListener('mousemove', divMove, true);
            break;
        }
    }
}

function divMove(e){
    currentObject.x = e.clientX - canvasArea.left -25;
    currentObject.y = e.clientY - canvasArea.top -25;
    draw();
}

function detectHit(objx, objy, mousex, mousey, objw, objh){

    mousex -= canvasArea.left;
    mousey -= canvasArea.top;


    if((mousex > objx && mousex < (objx+objw)) && (mousey > objy && mousey < (objy+objh))){
        return true;
    }else{
        return false;
    }
}

function draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < stakeholders.length; i++){
        var staker = stakeholders[i];

        ctx.fillStyle = staker.colour;
        ctx.fillRect(staker.x, staker.y, staker.w, staker.h)
        ctx.font = '15px Arial';
        ctx.fillStyle = "#000000";
        ctx.fillText(staker.stakeholderName, staker.x, staker.y + staker.h + 12)
    }
}

function savePNG(){
    var output = document.createElement('canvas');

    output.height = canvasSide - 5;
    output.width = output.height;
    var outCtx = output.getContext('2d');

    outCtx.drawImage(backgroundCanvas, 0, 0);
    for(var i = 0; i < stakeholders.length; i++){
        var staker = stakeholders[i];

        outCtx.fillStyle = staker.colour;
        outCtx.fillRect(staker.x, staker.y, staker.w, staker.h)
        outCtx.font = '15px Arial';
        outCtx.fillStyle = "#000000";
        outCtx.fillText(staker.stakeholderName, staker.x, staker.y + staker.h + 12);
    }

    var dataURL = output.toDataURL("image/png");
    document.getElementById('exportButton').href = dataURL;

    drawHelp();
}

function drawBackground(){
    var backgroundImage = new Image();
    backgroundImage.onload = function(){

        backCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
    }
    backgroundImage.src = "images/axis.svg";
}

function setupCanvas(){

    backgroundCanvas.height = canvasSide - 5;
    backgroundCanvas.width = backgroundCanvas.height;

    var backgroundAres = backgroundCanvas.getBoundingClientRect();

    canvas.style.top = backgroundAres.top + "px";
    canvas.style.left = backgroundAres.left  + "px";

    canvas.height = canvasSide - 5;
    canvas.width = canvas.height;
}

function addStakholder(e){
    e.preventDefault

    if(document.getElementById("stakeholderName").value){
        var newStaker = {
            x:60, y:40, w:70, h:70,
            colour:document.getElementById("nextColour").value,
            stakeholderName: document.getElementById("stakeholderName").value
        };

        document.getElementById("stakeholderName").value = "";
        stakeholders.push(newStaker);

        drawStakeholderList();
        draw();
        $('#nextColour').simplecolorpicker('selectColor', colourList[nextColourIndex]);

        if(nextColourIndex < colourList.length-1){
            nextColourIndex++
        }else{
            nextColourIndex = 0;
        }
    }else{
        alert('Please enter a name');
    }
}

function randomColour(){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function getDimensions(){
    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth * 2/3; //Take controls panel into account.

    if(winHeight < winWidth){
        return winHeight;
    }else{
        return winWidth;
    }
}

function setupMenu(){
    var controls = document.getElementById("controls");

    controls.style.height = window.innerHeight + "px";
    controls.style.width = window.innerWidth/3  + "px";
}

function reset(){
    stakeholders = [];
    drawStakeholderList();
    draw();
}

function screenChanged(){
    canvasSide = getDimensions()-6; //take 3px margin around canvas into account.
    setupMenu();
    setupCanvas();
    drawBackground();
    canvasArea = canvas.getBoundingClientRect();
    draw();
}

function drawHelp(){
    var overlay = new Image();
    overlay.onload = function(){

        ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    }
    overlay.src = "images/helpOverlay.svg";
}

function drawStakeholderList(){
    var listItem = '';
    document.getElementById("stakeholderList").innerHTML = listItem;

    $('select[name="colorpicker"]').simplecolorpicker('destroy');

    for(var i = 0; i<stakeholders.length; i++){
        var stake = stakeholders[i];
        listItem = '<div class="greyBoarder inline vSpacingSmall">'+
                        defineColourpickerHTML(i) +
                        '<input type="text" class="steakHeight shiftOverToTheRightABit" readonly value="'+ stake.stakeholderName +'"/>'+
                   '</div>'+
                   '<input id="deleteSteak'+ i +'" type="button" class="delete steakHeight" value="x" onclick="deleteSteak('+ i +')"/>'
        document.getElementById("stakeholderList").innerHTML += listItem;
    }

    $('select[name="colorpicker"]').simplecolorpicker({picker: true});
    $('#nextColour').on('change', function(e) {
        getNextColour();
    });

    for(var i = 0; i<stakeholders.length; i++){
        $('#steakColour' + i).on('change', function(e) {
             paintSteak($('#' + this.id).attr('data-index'), $('#' + this.id).val());
           });
        var stake = stakeholders[i];
        $('#steakColour' + i).simplecolorpicker('selectColor', stake.colour);
    }
}

function getNextColour(){
    var index = colourList.indexOf($('#nextColour').val());
    if(index == colourList.length-1){
        nextColourIndex = 0;
    }else{
        nextColourIndex = index+1;
    }
}

function deleteSteak(stakeID){
    stakeholders.splice(stakeID, 1);
    drawStakeholderList();
    draw();
}

function paintSteak(id, colour){
    stakeholders[id].colour = colour;
    draw();
}

function defineColourpickerHTML(i){
    var colourPickerHTML = '<select id="steakColour'+i+'" data-index="'+i+'" name="colorpicker">' +
                                '<option value="#7bd148">Green</option>' +
                                '<option value="#5484ed">Bold blue</option>' +
                                '<option value="#a4bdfc">Blue</option>' +
                                '<option value="#46d6db">Turquoise</option>' +
                                '<option value="#7ae7bf">Light green</option>' +
                                '<option value="#51b749">Bold green</option>' +
                                '<option value="#fbd75b">Yellow</option>' +
                                '<option value="#ffb878">Orange</option>' +
                                '<option value="#ff887c">Red</option>' +
                                '<option value="#dc2127">Bold red</option>' +
                            '</select>'
    return colourPickerHTML;
}