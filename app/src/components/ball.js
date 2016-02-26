export class BallProvider {
    constructor(context) {
        this.balls = [];
        this.context = context;
        
    }
    
    handleClick(click) {
        
        let clickedOnes = this.balls
            .filter(b => {
                return b.xRange.indexOf(click.x) > -1 &&
                       b.yRange.indexOf(click.y) > -1;
            });
        if (clickedOnes.length > 0) {

            clickedOnes.forEach(b => {
                b.hitCount++;
                if (b.hitCount > b.maxHits / 2) {
                    let v = Math.floor((b.hitCount - b.maxHits / 2));

                    b.velocityX = v;
                    b.velocityY = v;
                }
                if (b.hitCount == b.maxHits) {
                    let ind = this.balls.indexOf(b);
                    this.balls.splice(ind, 1);
                }
            });

        } else {
            let ball = new Ball(click.x, click.y, 20, this.context);
            this.balls.push(ball);
        }
    }
}

export class Ball {
    constructor(x, y, r, context) {
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
        
        this.initObjectProperties();
    }

    initObjectProperties() {
        let minX = this.startX - this.radius;
        let minY = this.startY - this.radius;

        this.xRange = Array.apply(null, Array(this.radius * 2 + 1)).map((_, i) => {
            return minX + i;
        });

        this.yRange = Array.apply(null, Array(this.radius * 2 + 1)).map((_, i) => {
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

        this.context.fillStyle = "#" + calculateHex + "c0de";
        this.context.fill(circle);

        this.context.font = "12px Arial";
        this.context.fillStyle = "#ffffff";
        this.context.fillText(this.hitCount, this.startX, this.startY);
    }
}