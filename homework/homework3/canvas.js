var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

//Get the x, y value of the mouse
var mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', 
    function(event){ 
        mouse.x = event.x;
        mouse.y = event.y;
})


//resize as the browser size changes
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

var maxR = 45;
var colors = [
    'rgb(17, 47, 65)',
    'rgb(6, 133, 135)',
    'rgb(79, 185, 159)',
    'rgb(242, 177, 52)', 
    'rgb(237, 85, 59)' 

];

//Create a circle constructor
function Circle(x, dx, y, dy, r) {
    this.x = x;
    this.dx = dx;
    this.y = y;
    this.dy = dy;
    this.r = r;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.minR = r;
    
    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.r, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    this.update = function() {
        this.draw();
        if (this.x + this.r <= innerWidth && this.x - this.r >= 0) {
            this.dx = this.dx;
        } else {
            this.dx = -this.dx;
        }
        this.x += this.dx;
    
        if (this.y + this.r > innerHeight || this.y - this.r < 0) {
            this.dy = -this.dy;
        }
        this.y += this.dy;
        
        //interactivity
        if (mouse.x - this.x < 30 && mouse.x - this.x > -30
            && mouse.y - this.y < 30 && mouse.y - this.y > -30) {
                if (this.r < maxR) {
                    this.r += 1;
                }

        } else if (this.r > this.minR){
            this.r -= 1;
        }
    }

}

var circles = [];
function init() {
    circles = []; //clear the previous circles generated each time we resize the browser
    for (var i = 0; i < 1000; i++) {
        var r = Math.random() * 3 + 1;
        //var x = Math.random() * innerWidth;
        //var x = Math.random() * (innerWidth - r * 2); 
        var x = Math.random() * (innerWidth - r * 2) + r;
        var dx = Math.random() - 0.5; //get different direction
        var y = Math.random() * (innerHeight - r * 2) + r;
        var dy = Math.random() - 0.5;
        circles.push(new Circle(x, dx, y, dy, r));
    }
}

function animate() {
    //create a cycling
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < circles.length; i++) {
        circles[i].update();
    }
}
animate();