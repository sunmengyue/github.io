
//Add a sqaure
 function addSquares() {
    var svg = d3.selectAll('svg');
    var square = svg.selectAll('rect').data([40, 50, 60, 70]);
    var squareEnter = square.enter().append('rect');
    var squareEnter2 = squareEnter.attr('x', 180).attr('y', 210).style('fill', 'orange');
    var squareEnter3 = squareEnter2.attr('width', function(d){
        return d;
    })
    squareEnter3.attr('height', function(d){
        return d;
    })
}

//remove square
function removeSquares() {
    var svg = d3.selectAll('svg');
    var square = svg.selectAll('rect').data([30, 50]);
    square.exit().remove();
}

//dance
function dance(){
    var svg = d3.selectAll('svg');
    var square = svg.selectAll('rect');
    square.attr('x', function() {
        return Math.random() * innerWidth;
    });
}

document.querySelector('#firstBtn').addEventListener('click', addSquares);
document.querySelector('#thirdBtn').addEventListener('click', removeSquares);
document.querySelector('#secondBtn').addEventListener('click', dance);