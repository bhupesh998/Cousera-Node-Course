var rect = require('./rectangle');



function solveRect(length ,breadth){
    console.log(`solving for area and permimeter of rectangle with length ${length} and breadth ${breadth}`);

    if(length <=0 || breadth <=0 ){
        console.log("invalid dimensions");
    }else{
        console.log("area of rectangle is "+ rect.area(length,breadth));
        console.log("perimeter of rectangle is "+rect.perimeter(length,breadth));
    }

}

solveRect(9,9);
solveRect(2,0);
solveRect(13,12.1);
solveRect(1.1 , 1.9);
solveRect(-1,99);