# Demo project waving grass 
Demo project of a combination of Daniel Shiffman's physics engine 'link to' and some bezier curves to mimic waving grass.

Grass object on mouse pressed.

Apply force on mouse pressed at the same time.

# Keywords
p5.js processing intermediate typescript 

# A simple processing sketch for moving grass
I wanted to program some waving grass in processing and this is the result 'see below'. 

I'm working on some line generation for my Axidraw plotter by using a 'moving' sketch like trees moving in the wind so I though I'd start with something simple like waving grass (beziers).


## Generative art with creative code 
Personally I'd like to think that this sketch falls into the generative art category because it is creating a visual object based on code (in this case javascript using the processing (p5.js) framework).

Not 
I'm not going to write about setting up the environment. Personally I use visual studio cade and node with the standard npm. 
For the typescript part personally I think that it fits more with my Objected oriented. I like the typesafety a lot from typescript and suites oo approaches. I hope it reads ok : )

# The sketch
This sketch is a 'simple' canvas that responds to mouse clicks. When the mouse is clicked within the canvas it will will execute two new instructions and a movement update (drag):

1.    draw a bezier curve from point the bottom to the top (the white dots) with a control point at the bottom of the screen and a control point at the top of the screen (the red dots) which results in a bezier that is just a straight line.

![](./doc/bezier.png)

2.    apply a horizontal wind force that will move the top control point and the top of the bezier curve.

![](./doc/bezier-with-force.png)

3.   The force will be continuously applied with a drag and when a boundary is reached the force direction will be changed to the opposite direction which will result in a horizontal 'bouncing' of the bezier control and top end point with a decreasing amplitude and the line will eventually stop moving after the force has died out because of the drag.

![](./doc/grass-debug2.gif)

![](./doc/grass-debug.gif)

# The application setup
I like typescript and object orientated programming so the basic setup of the main.ts is a typical typescript setup for a p5 sketch.

    const sketch = (p5: P5) => 
    {
        ...
        const _canvasWidth = 1024;
        const _canvasHeight = 768;

        p5.setup = () => 
        {
            p5.createCanvas(_canvasWidth, _canvasHeight);
        };

        p5.draw = () => 
        {
            p5.background("hsb(220, 50%, 70%)");
            
            ... 
        };
    };
    const mySketch = new P5(sketch);

Then conceptually I introduce two objects: the grass object that will be able to draw and animate itself and the grassfactory object that is capable of creating grass objects based on the mouse click coordinates.

In the main.ts file I used a backing field of type Array<Grass> to store the created grass objects and the grassFactory is instantiated with the some information about the drawing area and the total screen height.

    import Grass from './grass';
    import GrassFactory from './grassFactory';

    ... 
    
    const _bottomMargin = 150;
    
    const _shapes = new Array<Grass>();
    const _drawHeight = _canvasHeight - _bottomMargin;
    const _factory = new GrassFactory(p5, _drawHeight, _canvasHeight);
    
The grass object consists of a constructor, a draw and an animate function. The draw function is used in the p5 draw loop and the animate function is used in the p5 mousepressed function implementation.
    
    p5.draw = () => 
    {
        p5.background("hsb(220, 50%, 70%)");
        _shapes.forEach(element => 
        {
            element.draw(_debug);
        });
    };

The finally the p5 sketch implements the mousepressed function to add a new grass object based on where the mouse click is located and also calls the animate function on the grass object to apply force and drag.

    p5.mousePressed = () =>
    {
        const shape = _factory.createShape(p5.mouseX);
        _shapes.push(shape);
        _shapes.forEach(element => 
        {
            element.animate(p5.mouseX);
        });
    };

## Grass object implementation
The grass object is constructed with a couple of parameters.
We need a refference to the p5 module to get access to vectors and shapes.
We need a bottom x and y in the form of a vector. The same goes for the top x and y.
A stroke width (which is determined in the grass factory, same goes for the color).
And a notion of the bottom part of the canvas (screen height) to position to bottom control point. 
    
Note we do not need a notion of the top of the canvas because we assume this is where y is 0. And of course you can solve/implement this in any other way.

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

The grass's draw function is split into two functions: display and update.
Display is responsible for drawing the bezier curve based on the start, end and the two control points.

    display = (debug: boolean): void => 
    {
        this._p5.stroke(this._color);
        this._p5.strokeWeight(this._strokeWidth);
        this._p5.noFill();
        
        this._p5.curve(
            this._curveStart.x, // control point 1
            this._curveStart.y, 
            this._bottom.x,     // the start of the curve
            this._bottom.y, 
            this._top.x,        // the end of the curve
            this._top.y, 
            this._curveEnd.x,   // control point 2
            this._curveEnd.y);
    };

The update function is the function that applies the force and drag on both the top point of the curve and the corresponding (curveEnd) control point.

    update = (): void =>
    {
        const wind = this._p5.createVector(0, 0);
        wind.add(this._acceleration);

        this.applyWind(wind);
        this.applyBounds();
        this.applyDrag();
    };

The applyWind function applies the so called wind force on the top part of the grass curve.

    applyWind = (wind:p5.Vector): void =>
    {
        this._top.add(wind);
        this._curveEnd.add(wind.mult(this._curveEndMultiplier));
    };

Here I multiply the force on the curve end control point to create a circular movement.

The applyBounds function bounces the points back and forth between a maximum distance.

    applyBounds = (): void =>
    {
        const distance = Math.abs(this._top.x - this._topBase.x);
        const force: p5.Vector = this._p5.createVector(1, 0).mult(distance / this._animationSpeed);
        if (this._top.x > this._topBase.x)
        {
            force.mult(-1);
        }
        
        this.applyForce(force);  
    };

The applyDrag function slows the cuve movements and moves the bezier curve back into it's original state.

    applyDrag = ():void =>
    {
        const drag: p5.Vector = this._acceleration.copy();
        const speedSquared: number = drag.magSq();
        const constant = -0.01;
        drag.normalize();
        drag.mult(constant * speedSquared);
        this.applyForce(drag);
    };

And finally the apply force function applies the vector movements.

    applyForce = (force:p5.Vector): void =>
    {
        this._acceleration.add(force);
    };

1.   is the display function
2.   is the update function 
Animate function















I used the cubic bezier curve. Not sure if that is the tool to use for this. But here it goes.

![](./doc/bezier.png)

# The force
The force is directly stolen from Daniel Shiffman and his teams simple physics engine 
wind
    and 
drag

![](./doc/grass.gif)

# The code
The source code can be found on [GitHub](https://github.com/helena-spawn/grass-demo)




