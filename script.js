$(function () {
    var sizes = function () {
        var imagePanel = $("#image-panel");
        imagePanel.width(innerWidth*0.7-50);
        imageWidth = Math.min(innerHeight-100,imagePanel.width());
        kernelHeight = innerHeight-150;
        kernelWidth = kernelHeight/5;
        var kernelPanel = $("#kernel-panel");
        kernelPanel.height(innerHeight-100);
        var toolbar = $("#toolbar");
        toolbar.height(innerHeight-100);
        var kernelCanvas = $("#kernel-canvas");
        kernelCanvas.width(kernelWidth);
        kernelCanvas.height(kernelHeight);
        var imageCanvas = $("#image-canvas");
        imageCanvas.width(imageWidth);
        imageCanvas.height(imageWidth);
        imageCanvas.css("margin-bottom",innerHeight-100-imageWidth);
    };
    sizes();
    $(window).resize(function () {sizes()});
    $("#info-button").click(function () {
        $("#info-panel").toggle(300);
    });
    $("#clear-button").click(function () {
        kernel.clear();
        pseudoKernel.clear();
    });
    $("#download-button").click(function () {
        new p5(function (p) {
            p.setup = function() {p.save(imageCanvas,"image.png");};
        });
    });
    var linesButton = $("#lines-button");
    linesButton.hover(function () {
        $("#lines-label").show(100);
    },function () {
        if(toolOpen!=1) {
            $("#lines-label").hide(100);
        }
    });
    linesButton.click(function () {
        if(toolOpen==1){
            toolOpen =0;
            $("#lines-panel").hide(100);
        } else{
            toolOpen =1;
            $("#lines-panel").show(100);
        }

    });
    $("#lines-amount-range").on("input",function () {
        $("#lines-amount-count").html($(this).val());
    });
    $("#lines-execute").click(function () {
        for(var i=0;i< $("#lines-amount-range").val();i++){
            var y1 = Math.random()*kernelHeight;
            var y2 = Math.random()*kernelHeight;
            pseudoKernel.line(0,y1,kernelWidth,y2);
            var scale = (imageWidth/4)/kernelHeight;
            kernel.line(0,y1*scale,kernelWidth*scale,y2*scale);
        }
    })

    var circlesButton = $("#circles-button");
    circlesButton.hover(function () {
        $("#circles-label").show(100);
    },function () {
        if(toolOpen!=2) {
            $("#circles-label").hide(100);
        }
    });
    circlesButton.click(function () {
        if(toolOpen==2){
            toolOpen =0;
            $("#circles-panel").hide(100);
        } else{
            toolOpen =2;
            $("#circles-panel").show(100);
        }

    });
    $("#circles-amount-range").on("input",function () {
        $("#circles-amount-count").html($(this).val());
    });
    $("#circles-execute").click(function () {
        for(var i=0;i< $("#circles-amount-range").val();i++){
            var x = Math.random()*kernelWidth;
            var y = Math.random()*kernelHeight;
            var r = Math.random()*kernelWidth/3;
            pseudoKernel.noFill();
            pseudoKernel.ellipse(x,y,r,r);
            var scale = (imageWidth/4)/kernelHeight;
            kernel.noFill();
            kernel.ellipse(x*scale,y*scale,r*scale,r*scale);
        }
    })
});


var toolOpen = 0;

var imageWidth;
var kernelCanvas;
var imageCanvas;
var kernelHeight;
var kernelWidth;
var kernel;
var pseudoKernel;
var kernelOps = new p5(function (p) {
    p.setup = function() {
        kernelCanvas = p.createCanvas(kernelWidth,kernelHeight);
        kernel = p.createGraphics(screen.height/5,screen.height);
        pseudoKernel = p.createGraphics(screen.height/5,screen.height);
        kernelCanvas.parent("kernel-canvas");
        p.textFont("Roboto Mono");
        //imageCanvas = createCanvas(imageCanvas,imageCanvas);
    };

    p.draw = function() {
        kernelCanvas.size(kernelWidth,kernelHeight);
        var scale = (imageWidth/4)/kernelHeight;
        kernel.fill(0);
        pseudoKernel.fill(0);
        if(p.mouseIsPressed){
            if(p.mouseX>0 && p.mouseX<kernelCanvas.width){
                if(p.mouseY>0 && p.mouseY<kernelCanvas.height){
                    kernel.strokeWeight(5*scale);
                    //pseudoKernel.strokeWeight(1);
                    pseudoKernel.line(p.pmouseX,p.pmouseY,p.mouseX,p.mouseY);
                    kernel.line(p.pmouseX*scale,p.pmouseY*scale,p.mouseX*scale,p.mouseY*scale);
                }
            }
        }
        kernel.loadPixels();
        for (var y = 0; y < imageWidth/4; y++) {
            var width = p.min(p.map(y, 0, imageWidth/4, imageWidth/20, 0), imageWidth/20);
            for (var x = 0; x < width; x++) {
                kernel.set(x,y, p.color(0,0));
            }
        }
        kernel.updatePixels();
        p.image(pseudoKernel,0,0);
        p.noStroke();
        p.fill(250,20,20,50);
        p.triangle(p.width,0,0,p.height,0,0);
        p.fill(0,150);
        p.textAlign(p.CENTER,p.TOP);
        p.text("center",p.width/2,5);
        p.textAlign(p.CENTER,p.BOTTOM);
        p.text("edge",p.width/2,p.height-5);
    }
});

var leaf;
var flower;

var imageOps = new p5(function (p) {

    p.setup = function () {
        imageCanvas = p.createCanvas(imageWidth,imageWidth);
        imageCanvas.parent("image-canvas");
        leaf = p.createGraphics(kernelWidth*2,kernelHeight);
        flower = p.createGraphics(imageWidth/2,imageWidth/2);
    };

    p.draw = function () {
        var scale = (imageWidth/4)/kernelHeight;
        imageCanvas.size(imageWidth,imageWidth);
        leaf.size(kernelWidth*scale*2,imageWidth/4);
        flower.size(imageWidth/2,imageWidth/2);
        p.background(255);
        leaf.push();
        leaf.image(kernel,0,0);
        leaf.push();
        leaf.scale(-1, 1);
        leaf.image(kernel, -leaf.width, 0);
        leaf.pop();
        leaf.pop();

        flower.push();
        flower.translate(flower.width / 2, flower.height / 2);
        for (var i = 0; i < 16; i++) {
            flower.push();
            flower.rotate(i * (3.141 / 8));
            flower.image(leaf, -leaf.width / 2, 0);
            flower.pop();
        }
        flower.pop();
        p.image(flower,0,0);
        p.image(flower,p.width/2,0);
        p.image(flower,0,p.width/2);
        p.image(flower,p.width/2,p.width/2);
    }
});

