window.onload = function(){
	setup();
}

/* Variables */
//var backgroundCanvas;
var canvas;
//var backCtx;
var ctx;

var stakeholders = [];

var colourList = [
    '#F2C500',
    '#E87E04',
    '#E94B35',
    '#8B572A',
    '#91CCF3',
    '#227FBB',
    '#2C9ADE',
    '#0CE3BD',
    '#30B86D',
    '#078740',
    '#9C56B8',
    '#33495F'
];
var nextColourIndex = 1;
var helpVisible = false;

var canvasSide;
var canvasArea;
var canvases;


function setup(){
    document.getElementById("projectID").focus();

    //Get canvas objects
	backgroundCanvas = document.getElementById('backgroundCanvas');
	canvas = document.getElementById('draggableCanvas');
	//backCtx = backgroundCanvas.getContext("2d");
	ctx = canvas.getContext('2d');
	canvases = document.getElementById("canvases");

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
	//document.getElementById('resetButton').addEventListener('click', reset, false);
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

        if(detectHit(staker.x - canvases.scrollLeft, staker.y, e.clientX, e.clientY, staker.w, staker.h)){
            currentObject = staker;
            window.addEventListener('mousemove', divMove, true);
            break;
        }
    }
}

function divMove(e){
    currentObject.x = e.clientX - canvasArea.left -25 + canvases.scrollLeft;
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
    drawBackground();
    for(var i = 0; i < stakeholders.length; i++){
        var staker = stakeholders[i];

        ctx.fillStyle = staker.colour;
        //ctx.fillRect(staker.x, staker.y, staker.w, staker.h);
        roundRect(ctx, staker.x, staker.y, staker.w, staker.h, 4, true, false);
        ctx.font = '15px Arial';
        ctx.fillStyle = "#000000";
        ctx.fillText(staker.stakeholderName, staker.x, staker.y + staker.h + 12)
    }
    helpVisible = false;
}

function savePNG(){
    var output = document.createElement('canvas');

    output.height = canvasSide - 5;
    output.width = output.height;
    var outCtx = output.getContext('2d');

    //outCtx.drawImage(backgroundCanvas, 0, 0);
    for(var i = 0; i < stakeholders.length; i++){
        var staker = stakeholders[i];

        outCtx.fillStyle = staker.colour;
        outCtx.fillRect(staker.x, staker.y, staker.w, staker.h)
        outCtx.font = '15px Arial';
        outCtx.fillStyle = "#000000";
        outCtx.fillText(staker.stakeholderName, staker.x, staker.y + staker.h + 12);
    }

    var dataURL = output.toDataURL("image/png");
    document.getElementById('exportButton').download = getFilename();
    document.getElementById('exportButton').href = dataURL;

    //drawHelp();
}

function getFilename(){
    var id = document.getElementById('projectID');
    var name = document.getElementById('projectName');

    var filename = id.value + "-" + name.value + ".png";

    filename.replace(" ", "_");

    return filename;
}

function drawBackground(){
//    var backgroundImage = new Image();
//    backgroundImage.onload = function(){
//
//        backCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
//    }
//    backgroundImage.src = "images/axis.svg";

    var startpoint = canvas.height/2;
    var backgroundLength = canvas.width;

    ctx.beginPath();

    ctx.moveTo(24,startpoint + 24);
    ctx.lineTo(24,startpoint - 24);

    ctx.moveTo(24,startpoint);
    ctx.lineTo(backgroundLength,startpoint);
    ctx.stroke();
}

function setupCanvas(){

    canvas.height = canvasSide - 30;
    canvas.width = 10000; //backgroundCanvas.height;

//    var backgroundAres = backgroundCanvas.getBoundingClientRect();

//    canvas.style.top = backgroundAres.top + "px";
//    canvas.style.left = backgroundAres.left  + "px";

//    canvas.height = canvasSide - 40;
//    canvas.width = 1000;
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

//    controls.style.height = window.innerHeight + "px";
    controls.style.minWidth = window.innerWidth/3  + "px";

//    var canvases = document.getElementById("canvases");
//    canvases.style.width = (window.innerWidth/3*2)-22  + "px";
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

    canvasArea = canvas.getBoundingClientRect();
    draw();
}

function drawHelp(){
    if(!helpVisible){
        var overlay = new Image();
        overlay.onload = function(){
            ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
            helpVisible = true;
        }
        overlay.src = "images/helpOverlay.svg";
    }else{
        draw();
    }
}

function drawStakeholderList(){
    var listItem = '';
    document.getElementById("stakeholderList").innerHTML = listItem;

    $('select[name="colorpicker"]').simplecolorpicker('destroy');

    for(var i = 0; i<stakeholders.length; i++){
        var stake = stakeholders[i];
        listItem = '<div class="greyBoarder inline shiftOverToTheRightABit vSpacingSmall">'+
                        defineColourpickerHTML(i) +
                        '<input type="text" class="steakHeight shiftOverToTheRightABit" readonly value="'+ stake.stakeholderName +'"/>'+
                        '<input id="deleteSteak'+ i +'" type="button" class="delete steakHeight" value="x" onclick="deleteSteak('+ i +')"/>' +
                   '</div>';
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
                                '<option value="#F2C500">Yellow</option>'+
                                '<option value="#E87E04">Orange</option>'+
                                '<option value="#E94B35">Red</option>'+
                                '<option value="#8B572A">Brown</option>'+
                                '<option value="#91CCF3">Sky blue</option>'+
                                '<option value="#227FBB">Blue</option>'+
                                '<option value="#2C9ADE">Light blue</option>'+
                                '<option value="#0CE3BD">Turquoise</option>'+
                                '<option value="#30B86D">Green</option>'+
                                '<option value="#078740">Dark green</option>'+
                                '<option value="#9C56B8">Purple</option>'+
                                '<option value="#33495F">Stormy</option>'+
                            '</select>'
    return colourPickerHTML;
}

/* Function discovered on StackOverflow */
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}