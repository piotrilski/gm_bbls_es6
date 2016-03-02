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
        
        this.speed = 0.8; 
        this.color = color;
        //no destination at start
        this.destination = {
            x:this.x,
            y:this.y
        };
        
        this.lastFramePosition = {
            x:this.x,
            y:this.t
        };
    }
    
    renderWithoutInterpolation() {
        let circle = new Path2D();
       
        this.x = this.destination.x;          
        this.y = this.destination.y;
    
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
    
    smoothstep(x) {
        return x*x*(3 - 2*x);
    }
    
    render(interpolation) {
       let circle = new Path2D();
       
       
    //    
    //    let dx = Math.abs(this.destination.x - this.x);
    //    let dy = Math.abs(this.destination.y - this.y);
    //    let int = (dx+dy) > 0 ?  this.smoothstep(interpolation/(dx+dy)*10) : interpolation; 
       
       //console.log(interpolation,int);
       this.x = this.lastFramePosition.x + (this.x - this.lastFramePosition.x) * interpolation;
       this.y = this.lastFramePosition.y + (this.y - this.lastFramePosition.y) * interpolation;        
       
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
    }
    
    
}