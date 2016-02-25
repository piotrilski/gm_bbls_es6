export class Ball {
    constructor(x,y,r, context) {
        this.startX = x;
        this.startY = y;
        this.radius = r;
        this.context = context;
        this.xRange = [];
        this.yRange = [];
        this.hitCount = 0;
        this.maxHitCount = 5;
        this.velocityX = 0;
        this.velocityY = 0;
        this.maxHits = 15;
    }
    
    initObjectProperties() {
        let minX = this.startX - this.radius;
        let minY = this.startY - this.radius;
                                
        this.xRange = Array.apply(null, Array(this.radius * 2 + 1)).map( (_, i) => {
            return minX + i;
        });
        
        this.yRange = Array.apply(null, Array(this.radius * 2 + 1)).map( (_, i) => {
            return minY + i;
        });
    }
    
    render(interpolation) {
        let circle = new Path2D();
        
        circle.arc(
            this.startX + this.velocityX * interpolation,
            this.startY + this.velocityY * interpolation, 
            this.radius,
            0,
            2 * Math.PI,
            false);
                    
                            
        let dec = parseInt("5b", 16) + this.hitCount * 10;
        let calculateHex = dec.toString(16);       
                     
        this.context.fillStyle = "#" + calculateHex +"c0de";
        this.context.fill(circle);
        
        this.context.font = "12px Arial";
        this.context.fillStyle = "#ffffff";
        this.context.fillText(this.hitCount, this.startX, this.startY);                 
    }
}