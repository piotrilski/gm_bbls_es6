import Rx from 'rxjs';
import {Ball} from 'components/ball.js';


export class App {
    constructor(canvas) {
        this.canvas = canvas;
        this.subscributions = [];
        this.balls = [];
        this.context = this.canvas.getContext('2d');
        this.fps = 25;
        this.intervalId = null;
    }
    
    registerEventHandlers(eventName, handler) {
        this.subscributions[eventName] = Rx.Observable
            .fromEvent(this.canvas, eventName)
            .map(ev => {
                
                return {
                    x: ev.pageX, 
                    y: ev.pageY
                };
            })
            .subscribe(
                handler,
                this.errorHandler);
    }
    
    errorHandler(ex) {
        console.error(ex);
    }
    
    init() {
        console.log("Initialization");    
        
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;  
        
        this.registerEventHandlers('click', click => {
            
            let clickedOnes = this.balls
                .filter(b => {
                    return b.xRange.indexOf(click.x) > -1 && 
                           b.yRange.indexOf(click.y) > -1;
                });
            if(clickedOnes.length > 0) {
                
                clickedOnes.forEach(b => {
                    b.hitCount++;   
                    if(b.hitCount > b.maxHits/2) {                        
                        let v = Math.floor((b.hitCount - b.maxHits/2))
                        
                        b.velocityX = v;
                        b.velocityY = v;
                    }
                    if(b.hitCount == b.maxHits) {
                        let ind = this.balls.indexOf(b);
                        this.balls.splice(ind,1);
                    }                 
                });
                
            } else {
                let ball = new Ball(click.x, click.y, 20, this.context);
               
                ball.initObjectProperties();                
                
                this.balls.push(ball);
            }
        });     
    }    
    
    update() {
        
    }
    
    render(interpolation) {
         
         this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
         this.balls.forEach(b => b.render(interpolation)); 
    }
    
    run() {       
        let loops = 0;
        let skipTics = 1000 / this.fps;            
        let nextGameTick = new Date().getTime();
        // let maxFrameSkip = 10;
        // let lastGameTick;
        
        console.log("Running...");     
        
        var wrapper =  function() {
            let that = this;
            loops = 0;
                 
            while(new Date().getTime() > nextGameTick) {
                that.update();
                
                nextGameTick += skipTics;
                loops++;
            }
            
            if(!loops) {
                that.render((nextGameTick - new Date().getTime()) / skipTics);
            } else {
                that.render(0);
            }
        };
        
        return wrapper.bind(this);
    }
}
