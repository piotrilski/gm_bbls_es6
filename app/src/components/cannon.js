export class CannonBall {
    constructor(x,y,r, context, color) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.context = context;
        this.velocity = {
            x:0, 
            y:0
        };
        
        this.speed = 25; // px/frame
        this.color = color;
        //no destination at start
        this.destination = {
            x:this.x,
            y:this.y
        };
    }
    
    renderWithoutInterpolation() {
        let circle = new Path2D();
       
        this.x = this.x + this.velocity.x;          
        this.y = this.y + this.velocity.y;
    
        // this.x = (1-interpolation) * this.x + this.destination.x * interpolation;          
        // this.y = (1-interpolation) * this.y + this.destination.y * interpolation;  
       
       circle.arc(
            this.x,
            this.y,
            this.radius,
            0,
            2 * Math.PI,
            false);
   

        this.context.fillStyle = this.color;
        this.context.fill(circle);
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
   

        this.context.fillStyle = this.color;
        this.context.fill(circle);
    }
    
    moveTo(x, y) {
        let dX = Math.abs(this.x - x);
        let dY = Math.abs(this.y - y);        
         
        let dist = Math.sqrt(dX*dX + dY*dY);
        let steps = dist/this.speed;
        
        let vX = this.x < x ? dX/steps : -dX/steps;
        let vY = this.y < y ? dY/steps : -dY/steps;
        
        // let dX = this.x - x;
        // let dY = this.y - y;
        // let angle = Math.atan2(dX,dY);
        // let vX = Math.cos(angle)* this.speed;
        // let vY = Math.cos(angle)* this.speed;
        
        this.velocity.x = vX;
        this.velocity.y = vY;
        
        this.destination.x = x;
        this.destination.y = y;
        
        console.log(this.velocity);
    }
    
    
}