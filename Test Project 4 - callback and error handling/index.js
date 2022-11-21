var rect = require('./rectangle');



function solveRect(length ,breadth){
    console.log(`solving for area and permimeter of rectangle with length ${length} and breadth ${breadth}`);

    rect(length,breadth,(err,rectangle)=>{
            if(err){
                console.log(err);
            }else{
                console.log("area of rectangle is " + rectangle.area());
                console.log("perimeter of rectangle is " + rectangle.perimeter());
            }

    });

}

solveRect(9,9);
solveRect(2,0);
solveRect(13,12.1);
solveRect(1.1 , 1.9);
solveRect(-1,99);