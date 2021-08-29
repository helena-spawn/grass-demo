import p5 from "p5";

export default class Grass
{
    _p5: p5;
    _bottom: p5.Vector;
    _curveStart: p5.Vector;
    _topBase: p5.Vector;
    _top: p5.Vector;
    _curveEnd: p5.Vector
    _curveEndMultiplier: number;
    _acceleration: p5.Vector;
    _curve: p5.CURVE;
    _color: string;
    _strokeWidth: number;
    _animationDelay: number;
    _defaultWindForce: number;

    constructor(p5: p5, bottom: p5.Vector, top: p5.Vector, strokeWidth: number, color: string, canvasHeight: number)
    {
        this._color = color;
        this._strokeWidth = strokeWidth;
        this._p5 = p5;
        this._acceleration = this._p5.createVector(0, 0);
        this._bottom = bottom;
        this._topBase = top;
        this._top = this._topBase.copy();
        this._curveStart = this._p5.createVector(bottom.x, canvasHeight);
        this._curveEnd = this._p5.createVector(top.x, 0);
        this._curveEndMultiplier = 5;
        this._animationDelay = 50;
        this._defaultWindForce = 10;
    }

    draw = (debug: boolean): void =>
    {
        this.update();
        this.display(debug);
    };

    display = (debug: boolean): void => 
    {
        this._p5.stroke(this._color);
        
        this._p5.strokeWeight(this._strokeWidth);
        this._p5.noFill();
        
        this._p5.curve(
            this._curveStart.x, 
            this._curveStart.y, 
            this._bottom.x, 
            this._bottom.y, 
            this._top.x, 
            this._top.y, 
            this._curveEnd.x, 
            this._curveEnd.y);
        if (debug)
        {
            this.displayDebugInfo();
        }
    };

    update = (): void =>
    {
        const wind = this._p5.createVector(0, 0);
        wind.add(this._acceleration);

        this.applyWind(wind);
        this.applyBounds();
        this.applyDrag();
    };

    applyWind = (wind:p5.Vector): void =>
    {
        this._top.add(wind);
        this._curveEnd.add(wind.mult(this._curveEndMultiplier));
    };

    applyBounds = (): void =>
    {
        const distance = Math.abs(this._top.x - this._topBase.x);
        const force: p5.Vector = this._p5.createVector(1, 0).mult(distance / this._animationDelay);
        if (this._top.x > this._topBase.x)
        {
            force.mult(-1);
        }
        
        this.applyForce(force);  
    };

    animate = (x: number): void =>
    {
        const force: p5.Vector = this._p5.createVector(this._defaultWindForce, 0);
        if (x > this._top.x)
        {
          force.mult(-1);
        }
        this.applyForce(force);
    };

    applyForce = (force:p5.Vector): void =>
    {
        this._acceleration.add(force);
    };

    applyDrag = ():void =>
    {
        const drag: p5.Vector = this._acceleration.copy();
        const speedSquared: number = drag.magSq();
        const constant = -0.01;
        drag.normalize();
        drag.mult(constant * speedSquared);
        this.applyForce(drag);
    };

    displayDebugInfo = (): void =>
    {
        // start and end point
        this._p5.stroke("white");
        this._p5.strokeWeight(10);
        this._p5.point(this._bottom.x, this._bottom.y);
        this._p5.point(this._top.x, this._top.y);
        
        // control point 1 and 2
        this._p5.stroke("red");
        this._p5.strokeWeight(10);
        this._p5.point(this._curveStart.x, this._curveStart.y);
        this._p5.point(this._curveEnd.x, this._curveEnd.y);

        // the curve as lerped dots
        this._p5.stroke("white");
        this._p5.strokeWeight(2);
        for (let i = 0; i < 1; i+=0.1)
        {
            const x = this._p5.lerp(this._curveStart.x, this._bottom.x, i);
            const y = this._p5.lerp(this._curveStart.y, this._bottom.y, i);
            this._p5.point(x, y);
        }

        for (let i = 0; i < 1; i+=0.05)
        {
            const x = this._p5.lerp(this._top.x, this._curveEnd.x, i);
            const y = this._p5.lerp(this._top.y, this._curveEnd.y, i);
            this._p5.point(x, y);
        }
    };
}