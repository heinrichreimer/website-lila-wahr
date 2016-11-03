/**
 * Constants
 */
//Overlay opacity (1: opaque, 0: transparent)
var overlayAlpha = 1;
//Size of the flashlight in multiples of min(windowWidth, windowHeight)
var flashlightSizeRatio = 0.2;
//Size of the flashlight in multiples of min(windowWidth, windowHeight)
var audioFile = "audio/entertainer-piano.mp3";

/**
 * Initialization
 */
//Find Elements
var container = $("#container")[0];
var home = $(container).find("#home")[0];
var flashlightCanvas = $(home).find(".flashlight")[0];
var project = $(container).find("#project")[0];
//Load audio
initAudio();

/**
 * Top-Level navigation
 */
function navigateToHome() {
    $(container).attr("data-active-screen", "home");
    pauseAudio();
}
function navigateToProject() {
    $(container).attr("data-active-screen", "project");
    playAudio();
}
$(home).click(function () {
    navigateToProject();
});
$(project).click(function () {
    navigateToHome();
});

/**
 * Vars
 */
//Window dimensions
var windowWidth, windowHeight;
//Mouse position
var mouseX = -1, mouseY = -1;
//Flashlight
var flashlight, flashlightRadius, flashlightSize;

/**
 * Events
 */
//Recalculate offsets on scroll and on resize
$(window).scroll(function(){
    drawCover();
});
$(window).resize(function(){
    handleWindowResize();
});
//Initial layout
handleWindowResize();

$(flashlightCanvas).mousemove(function(e){
    handleMouseMove(e);
});


/**
 * Audio playback on project screen
 */
var shouldPlayAudio = false;
var audio = new WaudSound(audioFile, {
    "autoplay": false,
    "loop": true
});

function initAudio() {
    Waud.init();
    Waud.enableTouchUnlock(function () {
        if (!audio.isPlaying() && shouldPlayAudio) {
            audio.play();
        }
    });
}

function playAudio() {
    shouldPlayAudio = true;
    if (!audio.isPlaying()) {
        audio.play();
        if (WaudUtils.isChrome()) {
            //Visualization available
            //Waud.audioContext
        }
        else {
            //Visualization not available
        }
    }
}

function pauseAudio() {
    if (audio.isPlaying()) {
        audio.pause();
    }
}

/**
 * Event handlers
 */
function handleMouseMove(e){
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();

    mouseX = parseInt(e.pageX);
    mouseY = parseInt(e.pageY);

    drawCover();
}

function handleWindowResize(){
    //Window dimensions
    windowWidth = flashlightCanvas.width = container.width = $(window).width();
    windowHeight = flashlightCanvas.height = container.height = $(window).height();

    drawFlashlight();
    drawCover();
}

/**
 * Draw operations
 */
function drawFlashlight() {
    //Flashlight radius
    flashlightRadius = Math.min(windowWidth, windowHeight) * flashlightSizeRatio * 2 * 2;
    //Flashlight
    flashlight = document.createElement("canvas");
    //Flashlight context
    var flashlightContext = flashlight.getContext("2d");
    flashlightSize = (flashlightRadius * 2) + 10;
    flashlight.width = flashlightSize;
    flashlight.height = flashlightSize;
    //Fill canvas
    flashlightContext.fillStyle = "rgba(0, 0, 0, " + (overlayAlpha) + ")";
    flashlightContext.fillRect(0, 0, flashlightSize, flashlightSize);
    //Gradient
    var radialGradient = flashlightContext.createRadialGradient(
        flashlightSize / 2,
        flashlightSize / 2,
        1,
        flashlightSize / 2,
        flashlightSize / 2,
        flashlightRadius);
    for (var i = 0; i <= 1; i += 0.1) {
        radialGradient.addColorStop(i, "rgba(0, 0, 0, " + Math.abs(Math.pow((i - 1), 3)) + ")");
    }
    //radialGradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    //radialGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    flashlightContext.beginPath();
    flashlightContext.arc(
        flashlightSize / 2,
        flashlightSize / 2,
        flashlightSize / 2,
        0,
        Math.PI * 2);
    flashlightContext.fillStyle = radialGradient;
    flashlightContext.globalCompositeOperation = "destination-out";
    flashlightContext.fill();
}

function drawCover(){
    //Canvas 2D Context
    var canvasContext =  flashlightCanvas.getContext("2d");
    var flashlightSizeHalf = flashlightSize / 2;
    canvasContext.clearRect(0, 0, windowWidth, windowHeight);
    if (mouseX >= 0 && mouseY >= 0) {
        canvasContext.drawImage(flashlight, mouseX - flashlightSize / 2, mouseY - flashlightSize / 2);
        canvasContext.fillStyle = "rgba(0, 0, 0, " + overlayAlpha + ")";
        canvasContext.fillRect(0, 0, mouseX - flashlightSizeHalf +  1, windowHeight); //left
        canvasContext.fillRect(mouseX - flashlightSizeHalf, 0, 2 * flashlightSizeHalf, mouseY - flashlightSizeHalf + 1); //top
        canvasContext.fillRect(mouseX + flashlightSizeHalf - 1, 0, windowWidth - mouseX + 1, windowHeight); //right
        canvasContext.fillRect(mouseX - flashlightSizeHalf, mouseY + flashlightSizeHalf - 1, 2 * flashlightSizeHalf, windowHeight - mouseY + 1);
    }
    else {
        canvasContext.fillStyle = "rgba(0, 0, 0, " + overlayAlpha + ")";
        canvasContext.fillRect(0, 0, windowWidth, windowHeight);
    }
}
