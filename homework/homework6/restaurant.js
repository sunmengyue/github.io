d3.csv('restaurant.csv', function(error, data){
    console.log("1. Explore the first observation:");
    console.log(data[0]);
    console.log("---------------------------------------");
    console.log("2. After converting some numeric data in the string format into the numeric form:");
    data.forEach(function(d){
        d.business_id = +d.business_id;
        d.business_latitude = +d.business_latitude;
        d.business_longitude = +d.business_longitude;
        d.business_postal_code = +d.business_postal_code;
        d.inspection_score = +d.inspection_score;
    })
    console.log(data[0]);
    console.log('-----------------------------------');
    console.log('3. Look at the whole dataset:');
    console.log(data);
})