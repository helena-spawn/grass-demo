# Waving grass in processing (p5.js)

## Introduction
I saw the call for contributing a page to the Processing community catalog for their 20th birthday in my twitter time line and although my contribution to the community is very limited I was working on a waving grass sketch in processing and at the same time was looking for an opportunity to increase my collaboration skills. So this seems a perfect opportunity to give something back! 

My contribution has the form of a technical article on how I implemented moving bezier curves in Processing with the intention to resemble 'waving grass' in the wind. The idea started from a completely different angle though. I'm currently working with an AxiDraw Plotter and have been porting some old Processing 3 code to a java based Processing solution for a generative art project. What I really wanted to achieve was to algorithmically create trees and feed them directly into the plotter. While scouring the internet for information to help me  controlling the AxiDraw plotter I stumbled upon Daniel Shiffman's excellent and entertaining coding train tutorials on how to use Vectors to mimic real life forces by creating this so called physics engine. This engine was the perfect solution to add to my generative art coding concepts to create trees and use 'natural' forces to alter the shapes of the trees. 

## Not trees but grass
Ok that's the why but of course my algorithmic trees were by no means ready yet and the physics engine was a completely new setup so to start I dialed it back a little and tried to create a sketch that displays 'waving' grass. Or in other words green bezier curves that are moved by force (wind). 

## Warning typescript
The sketch that I will try to unfold is written using the p5.js framework using typescript and some Object Orientated implementations. For the typescript part, I personally think that it fits more with my own coding preferences and but I also hope it can serve as an example if you ever want to code sketches in typescript. I like the type safety a lot and typescript suites my style and object oriented approaches.

I will not talk about how to set this up there are some excellent resources out there to help you with that and I hope my coding is clear enough to follow. 

(ooh that is such a dangerous statement) 

But here it goes. [Full Source code here](https://github.com/helena-spawn/grass-demo)

## Waving grass
The sketch starts with an overall blue canvas with a green margin at the bottom representing the sky and the earth. A mouse click event in the canvas creates a new grass object and displays it while a the same time a 'wind' force is applied wich makes the grass behave like it is waving in the wind. How cool is that!

![](./doc/grass.gif)

### Slide show (stills)
|   |   |   |
|---|---|---|
|<img src="./doc/Images/22.png" width="200">|<img src="./doc/Images/43.png" width="200">|<img src="./doc/Images/63.png" width="200">|
|<img src="./doc/Images/83.png" width="200">|<img src="./doc/Images/96.png" width="200">|<img src="./doc/Images/103.png" width="200">|
|<img src="./doc/Images/111.png" width="200">|<img src="./doc/Images/132.png" width="200">|<img src="./doc/Images/142.png" width="200">|
|<img src="./doc/Images/150.png" width="200">|<img src="./doc/Images/159.png" width="200">|<img src="./doc/Images/166.png" width="200">|
|<img src="./doc/Images/185.png" width="200">|<img src="./doc/Images/188.png" width="200">|<img src="./doc/Images/206.png" width="200">|

# The sketch 
This sketch is a 'simple' canvas that responds to mouse clicks. When the mouse is clicked within the canvas it will will execute two new instructions and a movement update (drag):

1.    draw a bezier curve at the clicked x coordinate from the start (bottom) to the end (top), the white dots in the image below. A control point at the bottom of the screen and a control point at the top of the screen, the red dots. Which then results in a bezier that is just a straight line.

![](./doc/bezier.png)

2.    apply a horizontal wind force that will move the top control point and the top of the bezier curve. Note that the top control point receive way more force than the top point of the curve itself.

![](./doc/bezier-with-force.png)

3.   The force will continuously be applied with a drag and when a boundary is reached the direction of the 'wind' force will be changed to the opposite direction which will result in a horizontal 'bouncing' of the bezier control and top end point with a decreasing amplitude and the line will eventually stop moving after the force has died out because of the drag.

![](./doc/grass-debug2.gif)

Note that the mouse click event will create a new grass object and also generates the 'wind' force that will 'blow' to the adjacent grass objects.

![](./doc/grass-debug.gif)

# The application setup
For this sketch I follow a typical javascript with Node.js structure with npm as the package manager. (did I mention I use Visual Studio Code as my editor). If you clone this repository from the github link and execute: 

    npm install 

you should be ready to go.

The folder structure looks like this.

    main-folder/
    ├─ node-modules
    ├─ out
    ├─ src
    │  ├─ main.ts
    │  ├─ grass.ts
    │  ├─ grassFactory.ts
    ├─ tests
    ├─ index.html
    ├─ package.json
    ├─ readme.md

To compile or transpile the code from typescript to javascript I use the command (from the package.json)

    npm run -S esbuild-base -- --sourcemap

Not 100% sure how that works but in the package.json there is a script statement that uses esbuild and (I think) rollup to generate a minified main.js in the out directory that is referenced in the index.html. You can just open the index.html (Visual Studio Code has this nice feature of Live Server that you can use) to see the running sketch in your browser.

# The code
Let's dive into the code.

## Main
The <code>main.ts</code> is a typical typescript setup for a p5 sketch.

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

Setting up some screen dimension variables and the implementation of Processing's setup and draw functions.

Then conceptually I introduce two objects: 
- <b>the <code>grass</code> object</b> that will be able to draw itself and be animated 
- and <b>the <code>grassFactory</code> object</b> that is capable of creating grass objects based on the mouse click coordinates.

In the <code>main.ts</code> file I use a backing field of type <code>Array</code> to store the created grass objects and the <code>grassFactory</code> is instantiated with the some information about the drawing area and the total screen height.

    import Grass from './grass';
    import GrassFactory from './grassFactory';

    ... 
    
    const _bottomMargin = 150;
    
    const _shapes = new Array<Grass>();
    const _drawHeight = _canvasHeight - _bottomMargin;
    const _factory = new GrassFactory(p5, _drawHeight, _canvasHeight);

The grass object consists of a constructor, a <code>draw</code> and an <code>animate</code> function. The draw function is used in the p5 draw loop and the animate function is used in the p5 <code>mousePressed</code> function implementation to animate the grass object or apply wind force if you will.
    
    p5.draw = () => 
    {
        p5.background("hsb(220, 50%, 70%)");
        _shapes.forEach(element => 
        {
            element.draw(_debug);
        });
    };

The <code>mousePressed</code> function is used to add a new <code>grass</code> object based on where the mouse click is located and also calls the animate function on all the existing grass objects to apply the 'wind' force.

    p5.mousePressed = () =>
    {
        const shape = _factory.createShape(p5.mouseX);
        _shapes.push(shape);
        _shapes.forEach(element => 
        {
            element.animate(p5.mouseX);
        });
    };

## The grassFactory object
The <code>grassFactory</code> is a simple factory class that is constructed with some canvas dimension information that is used to determine the size of the grass object.

    constructor(P5: p5, drawHeight: number, canvasHeight: number)
    {
        this._p5 = P5;
        this._drawHeight = drawHeight;
        this._canvasHeight = canvasHeight;
    }

And implements the function <code>createShape</code> that takes the mouse x coordinate as an input parameter. This x coordinate is used to determine where the grass object should be place (horzontally that is) on the canvas. A random height, stroke width and color is chosen. The grass object is created and returned to the caller.

    createShape = (x: number): Grass  =>
    {
        const bottom: p5.Vector = this._p5.createVector(x, this._drawHeight);
        const height = this.calculateHeight();
        const top: p5.Vector = this._p5.createVector(x, height);
        const strokeWidth = this.calculateStrokeWidth(height);
        const color = this.calculateColor();
        const grass = new Grass(this._p5, bottom, top, strokeWidth, color, this._canvasHeight); 
        return grass;
    };

## The grass object
The <code>grass</code> object is constructed with a couple of parameters.
- a reference to the p5 module to get access to vectors and shapes and all the Processing components.
- a bottom x and y in the form of a vector. 
- the top x and y also in the form of a vector.
- a stroke width (which is determined in the grass factory)
- a color for the curve (also provided by the grass factory).
- and finally the screen height to position to bottom control point. 
- note you do not need a notion of the top of the canvas because we assume this is where y is 0. And of course you can solve/implement this in any other way.

Once a <code>grass</code> object is created by the <code>grassFactory</code> the object is stored in the <code>_shapes</code> backing field and updated in the processing draw loop.

    constructor(p5: p5, bottom: p5.Vector, top: p5.Vector, strokeWidth: number, color: string, canvasHeight: number)
    {
        this._color = color;
        this._strokeWidth = strokeWidth;
        this._p5 = p5;
        this._acceleration = this._p5.createVector(0, 0);
        this._bottom = bottom;
        this._initialtop = top;
        this._top = this._initialtop.copy();
        this._curveStart = this._p5.createVector(bottom.x, canvasHeight);
        this._curveEnd = this._p5.createVector(top.x, 0);
        this._forceMultiplier = 5;
        this._animationDelay = 50;
        this._defaultWindForce = 10;
    }

The constructor also sets some base values
- a default acceleration vector of 0
- a reference of the top coordinates in the variable _initialTop. I use this value to remember the initial state of the grass before wind force is applied
- a new vector top (a copy of the incoming variable) to draw and apply force to
- a curve start control point
- a curve end control point
- a force multiplier. When you look again at the curve, you need to apply more force to the top control point than to the top point to keep the grass wave natural
- an animation delay value to control the speed of the 'wave' of the grass
- a default windforce that is applied at the initial mouse click

The grass's draw function is split into two functions: <code>display</code> and <code>update</code>.
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

The update function is the function that applies the force and drag on both the top point of the curve and the corresponding <code>curveEnd</code> control point. This is a loose implementation of Daniel Shiffman's physics engine. 
- Apply the current acceleration to the top point and the top control point. 
- If points exceed their boundaries invers the force to move the point in the other direction.
- Apply the drag to the acceleration.

The implementation looks something like this.

    update = (): void =>
    {
        const wind = this._p5.createVector(0, 0);
        wind.add(this._acceleration);

        this.applyWind(wind);
        this.applyBounds();
        this.applyDrag();
    };

The <code>applyWind</code> function applies the so called wind force on the top part of the grass curve.

    applyWind = (wind:p5.Vector): void =>
    {
        this._top.add(wind);
        this._curveEnd.add(wind.mult(this._curveEndMultiplier));
    };

Here I multiply the force on the <code>curveEnd</code> control point to create a circular movement.

The <code>applyBounds</code> function reverses the force and bounces the points back and forth.

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

This is actually a bit of a messy implementation (and should be refactored/redesigned) but it seems to work for now.

The <code>applyDrag</code> function slows the curve movements and because of this the bezier curve moves (sort of) back into it's original state. This function's main purpose is to slow down the acceleration.

    applyDrag = ():void =>
    {
        const drag: p5.Vector = this._acceleration.copy();
        const speedSquared: number = drag.magSq();
        const constant = -0.01;
        drag.normalize();
        drag.mult(constant * speedSquared);
        this.applyForce(drag);
    };

And finally the <code>applyForce</code> function updates the acceleration itself.

    applyForce = (force:p5.Vector): void =>
    {
        this._acceleration.add(force);
    };

The <code>grass</code> object implements an <code>animate</code> function that applies the initial default wind force and is called in the <code>mousePressed</code> function in the <code>main.ts</code> class we saw earlier.

    animate = (x: number): void =>
    {
        const force: p5.Vector = this._p5.createVector(this._defaultWindForce, 0);
        if (x > this._top.x)
        {
          force.mult(-1);
        }
        this.applyForce(force);
    };

# The final result
![](./doc/grass.gif)

# Final notes
I have been 'creative coding' for some time now. For my projects I usually work with the general purpose languages like java, C#, python or specific problem solving frameworks like Accord.net or Tensorflow. Never looked at the processing framework until last year. 

This is my first p5.js Sketch in typescript so I think that are a lot of improvements to be made but as a start I think the sketch is very interesting and offers a starting point to evolve on.

# The code
The source code freely available on [GitHub](https://github.com/helena-spawn/grass-demo). Please use it and improve on it for whatever need you have.

# Thanks
Special thanks to Daniel Shiffman for his excellent and inspiring coding train tutorials. Super thanks to the entire Processing team, I sincerely wish I found your scene earlier in my life. But hey never too late to learn. Processing is going to help an entire generation of artists and creative coders for years to come.

# Keywords
p5.js processing intermediate typescript node npm object-oriented

# Tools I used
Visual studio code, npm, node eslint rollup

# Further reading
I got my p5.js typescript initial setup from [p5.js and typescript](https://codesandbox.io/s/p5js-with-typescript-8rgs6) 

Note: that my setup is a little bit different because of the node setup.

[Daniel Shiffman's physics engine on youtube](https://www.youtube.com/watch?v=wB1pcXtEwIs)

[Visual studio code p5.js extensions](https://marketplace.visualstudio.com/items?itemName=samplavigne.p5-vscode)

