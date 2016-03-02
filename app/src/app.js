import Rx from 'rxjs';
import {Ball, BallProvider} from 'components/ball.js';
import {CannonBall} from 'components/cannon.js';

export class App {
    constructor(canvas) {
        this.canvas = canvas;
        this.subscributions = [];
        this.context = this.canvas.getContext('2d');
        
        this.panic = false;
        
        
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
            5,
            this.context,
            "#ffc0de"); 
        
        this.cannonBall = new CannonBall(
            Math.floor(this.canvas.width / 2) ,
            this.canvas.height-20,
            20,
            this.context,
            "#5bc0de");
    }
    
    
    
    updateCannonBall(cannonBall, deltaTime) {
        cannonBall.lastFramePosition.x = cannonBall.x;
        cannonBall.lastFramePosition.y = cannonBall.y;
        
        cannonBall.x += cannonBall.velocity.x * deltaTime;
        cannonBall.y += cannonBall.velocity.y * deltaTime;
       
        //console.log(deltaTime, cannonBall.x, cannonBall.y);
        if(cannonBall.velocity.x !== 0 &&
           cannonBall.velocity.y !== 0) {
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
            
            
            if(compareX()) {
                cannonBall.velocity.x = 0;
                cannonBall.x = cannonBall.destination.x;
            }
            
            if(compareY()) {
                cannonBall.velocity.y = 0;
                cannonBall.y = cannonBall.destination.y;
            }
            
        }
    }
    
    update(deltaTime) {
        this.updateCannonBall(this.cannonBall, deltaTime);      
        this.updateCannonBall(this.cannonBallWithoutInterpolation);
        
    }
    
    render(interpolation) {
         
         this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
         this.ballProvider.balls.forEach(b => b.render(interpolation));
         this.cannonBall.render(interpolation); 
         this.cannonBallWithoutInterpolation.renderWithoutInterpolation();
    }
    
    updateNotTimeDependent(timestamp, frameDelta) {
        
    }
        
    panicFunction(fps, panic, frameDelta) {
        
        if(this.panic) {
            console.error("!!!!!PANIC!!!!", fps, frameDelta);
            frameDelta = 0;
        }
    }        
        
    run() {       
        let simulationTimestep = 1000 / 60;
        let frameDelta = 0;
        let lastFrameTimeMs = 0;
        let fps = 60;
        let lastFpsUpdate = 0;
        let framesThisSecond = 0;
        let numUpdateSteps = 0;
        let minFrameDelay = 0;
    
        let that = this;
        let update = that.update.bind(that);
        let render = that.render.bind(that);  
        let updateNotTimeDependent = that.updateNotTimeDependent.bind(that);
        let panicFunction = that.panicFunction.bind(that);
                       
        console.log("Running...");     
        
        function frameLoop(timestamp) {            
            
            requestAnimationFrame(frameLoop);
            
            if(timestamp < lastFrameTimeMs + minFrameDelay) {
                return;
            }
            
            frameDelta += timestamp - lastFrameTimeMs;
            lastFrameTimeMs = timestamp;
            
            updateNotTimeDependent(timestamp, frameDelta);            
            
            //estimated framerate
            if(timestamp > lastFpsUpdate + 1000) {
                fps = 0.25 * framesThisSecond + 0.75 * fps;
                lastFpsUpdate = timestamp;
                framesThisSecond = 0;
            }
            
            framesThisSecond++;
            numUpdateSteps = 0;
            
            while(frameDelta >= simulationTimestep) {
                
                update(simulationTimestep);
                frameDelta -= simulationTimestep;
                
                if(++numUpdateSteps >= 240) {                    
                    that.panic = true;
                    break;
                }
            }
            
            render(frameDelta/simulationTimestep);
            
            panicFunction(fps, that.panic, frameDelta);
            that.panic = false;
        }
        
        requestAnimationFrame(frameLoop.bind(that));
    }
}
