import Rx from 'rxjs';
import {Ball, BallProvider} from 'components/ball.js';
import {CannonBall} from 'components/cannon.js';

export class App {
    constructor(canvas) {
        this.canvas = canvas;
        this.subscributions = [];
        this.context = this.canvas.getContext('2d');
        this.fps = 25;
        this.intervalId = null;
        this.cannonBall = null;
        this.cannonBallWithoutInterpolation = null;
        this.ballProvider = new BallProvider(this.context);
    }
    
    registerMouseEventHandlers(eventName, handler) {
        if(!this.subscributions[eventName])
            this.subscributions[eventName] = [];
        this.subscributions[eventName].push(Rx.Observable
            .fromEvent(this.canvas, eventName)
            .map(ev => {
                
                return {
                    x: ev.pageX, 
                    y: ev.pageY
                };
            })
            .subscribe(
                handler,
                this.errorHandler));
    }
    
    errorHandler(ex) {
        console.error(ex);
    }
    
    init() {
        console.log("Initialization");    
        
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;  
        
        this.initCannonBall();
        
        this.registerMouseEventHandlers('click', click => {
            this.cannonBall.moveTo(click.x, click.y);
            this.cannonBallWithoutInterpolation.moveTo(click.x, click.y);
        });
    }    
    
    initCannonBall() {
        this.cannonBallWithoutInterpolation = new CannonBall(
            Math.floor(this.canvas.width / 2) ,
            this.canvas.height-20,
            20,
            this.context,
            "#ffc0de"); 
        
        this.cannonBall = new CannonBall(
            Math.floor(this.canvas.width / 2) ,
            this.canvas.height-20,
            20,
            this.context,
            "#5bc0de");
    }
    
    updateCannonBall(cannonBall) {
        
        let compareX = cannonBall.velocity.x > 0 ? 
            function() {
                return cannonBall.x >= cannonBall.destination.x;
            } : 
            function() {
                return cannonBall.x <= cannonBall.destination.x;
            };
            
        let compareY = cannonBall.velocity.y > 0 ? 
            function() {
                return cannonBall.y >= cannonBall.destination.y;
            } : 
            function() {
                return cannonBall.y <= cannonBall.destination.y;
            };
        
        
        
        if(compareX() && compareY()) {
            cannonBall.velocity = {
                x:0,
                y:0
            };
        }
         
    }
    
    update() {        
        this.updateCannonBall(this.cannonBall);      
        this.updateCannonBall(this.cannonBallWithoutInterpolation); 
    }
    
    render(interpolation) {
         
         this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
         this.ballProvider.balls.forEach(b => b.render(interpolation));
         this.cannonBall.render(interpolation); 
         this.cannonBallWithoutInterpolation.renderWithoutInterpolation(1);
    }
    
    run() {       
        let loops = 0;
        let skipTics = 1000 / 30;            
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
