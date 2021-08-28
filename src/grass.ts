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
    _maxXDelta: number;
    _acceleration: p5.Vector;
    _velocity: p5.Vector;
    _curve: p5.CURVE;
    _color: string;
    _strokeWidth: number;
    _animationSpeed: number;
    _defaultWindForce: number;

    constructor(p5: p5, bottom: p5.Vector, top: p5.Vector, strokeWidth: number, color: string)
    {
        this._color = color;
        this._strokeWidth = strokeWidth;
        this._p5 = p5;
        this._maxXDelta = 200;
        this._velocity = this._p5.createVector(0, 0);
        this._acceleration = this._p5.createVector(0, 0);
        this._bottom = bottom;
        this._topBase = top;
        this._top = this._topBase.copy();
        this._curveStart = this._p5.createVector(bottom.x, bottom.y + 100);
        this._curveEnd = this._p5.createVector(top.x, 0);
        this._curveEndMultiplier = 5;
        this._animationSpeed = 50;
        this._defaultWindForce = 10;
    }

    draw = (): void =>
    {
        this.update();
        this.display();
    }

    display = (): void => 
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
    }

    update = (): void =>
    {
        let wind = this._p5.createVector(0, 0);
        wind.add(this._acceleration);

        this.applyWind(wind);
        this.applyBounds();
        this.applyDrag();
    }

    applyWind = (wind:p5.Vector): void =>
    {
        this._top.add(wind);
        this._curveEnd.add(wind.mult(this._curveEndMultiplier));
    }

    applyBounds = (): void =>
    {
        let distance = Math.abs(this._top.x - this._topBase.x);
        let force: p5.Vector = this._p5.createVector(1, 0).mult(distance / this._animationSpeed);
        if (this._top.x > this._topBase.x)
        {
            force.mult(-1);
        }
        
        this.applyForce(force);  
    }

    animate = (x: number, y: number): void =>
    {
        let force: p5.Vector = this._p5.createVector(this._defaultWindForce, 0);
        if (this._p5.mouseX > this._top.x)
        {
          force.mult(-1);
        }
        this.applyForce(force);
    }

    applyForce = (force:p5.Vector): void =>
    {
        this._acceleration.add(force);
    }

    applyDrag = ():void =>
    {
        let drag: p5.Vector = this._acceleration.copy();
        let speedSquared: number = drag.magSq();
        let constant: number = -0.01;
        drag.normalize();
        drag.mult(constant * speedSquared);
        this.applyForce(drag);
    }
}