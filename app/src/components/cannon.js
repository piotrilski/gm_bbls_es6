export class CannonBall {
    constructor(x,y,r, context) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.context = context;
        this.velocity = {
            x:0, 
            y:0
        };
        
        this.speed = 5; // px/frame
        
        //no destination at start
        this.destination = {
            x:this.x,
            y:this.y
        };
    }
    
    render(interpolation) {
       let circle = new Path2D();
       
       this.x = this.x + this.velocity.x * interpolation;          
       this.y = this.y + this.velocity.y * interpolation; 
       
       circle.arc(
            this.x,
            this.y,
            this.radius,
            0,
            2 * Math.PI,
            false);
   

        this.context.fillStyle = "#5bc0de";
        this.context.fill(circle);
    }
    
    moveTo(x, y) {
        let dX = Math.abs(this.x - x);
        let dY = Math.abs(this.y - y);
        
        let dist = Math.sqrt(dX*dX + dY*dY);
        let steps = dist/this.speed;
        
        let vX = this.x < x ? dX/steps : -dX/steps;
        let vY = this.y < y ? dY/steps : -dY/steps;
        
        this.velocity.x = vX;
        this.velocity.y = vY;
        
        this.destination.x = x;
        this.destination.y = y;
        
        console.log(this.velocity);
    }
    
    
}