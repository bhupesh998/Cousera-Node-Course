
module.exports = (l,b,callback) => {
    
    if(l <=0 || b <=0 ){
        setTimeout(()=>{
                callback(new Error(`INVALID VALUES : solving for area
                 and permimeter of rectangle with length ${l} and breadth ${b}`) ,null);
        },3000);
    }else{
        setTimeout(()=>{
                callback(null, {
                    // not passing l and b as arguments as they will be available through parent call 
                    area: () => (2*(l+b)) ,
                    perimeter : () => (l*b) 
                });
        },1000);
    }
 
}





