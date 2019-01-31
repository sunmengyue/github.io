
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y: undefined
}

var maxRadius = 40;
var minimumRadius = 2;

var colorArray = [
    'rgb(17, 47, 65)',
    'rgb(6, 133, 135)',
    'rgb(79, 185, 159)',
    'rgb(242, 177, 52)',
    'rgb(237, 85, 59)',
];

//Add mouse move as event listner
window.addEventListener('mousemove', 
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
        console.log(mouse);

});

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
})


//Create an constructor for circles
function Circle(x, y, dx, dy, radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minimumRadius = minimumRadius;
    this.color = colorArray[Math.round(Math.random() * colorArray.length)];

    this.draw = function() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.fillStyle = this.color;
        context.fill();
    }

    this.update = function() {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0){
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        //mouse move activity
        if (mouse.x - this.x < 50 && mouse.x - this.x > -50
            && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            if (this.radius < maxRadius) {
                this.radius += 1;
            }
            
        } else if (this.radius > this.minimumRadius) {
            this.radius -= 1;
        }

        this.draw();
    }
}

var circleArray = [];
function init() {
    circleArray = [];
    for (var i = 0; i < 800; i++) {
    var radius = Math.random() * 3 + 1;
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    var dx = (Math.random() - 0.5);
    var dy = (Math.random() - 0.5);
    var radius = 30;
    circleArray.push(new Circle(x, y, dx, dy, radius));
}
}


//Add animation to circles
function animate(){
    requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
    
}
animate(); 