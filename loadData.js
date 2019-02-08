console.log("Welcome to data land");

d3.text("data/textData.txt", function(error, data){
    console.log("error", error);
    console.log("text", data);
})

d3.csv("data/csvData.csv", function(error, data){
    console.log("csv", data); //notice the numbers are string
    data.forEach(function(d) {
        d.export = parseFloat(d.export);
        d.country = parseFloat(d.country);
    });
    console.log("csv", data);
})

d3.json("data/jsData.json", function(error, data){
    console.log('json', data);
})

console.log("END OF THE LINE");