import P5 from 'p5';
import Grass from './grass';
import GrassFactory from './grassFactory';

const sketch = (p5: P5) => 
{
    const _width: number = 1024;
    const _height: number = 768;

    let _shapes = new Array<Grass>();
    let _factory = new GrassFactory(p5, _width, _height);

    p5.setup = () => 
    {
        p5.createCanvas(_width, _height);
        p5.background("hsb(220, 50%, 70%)");
    };

    p5.draw = () => 
    {
        p5.background("hsb(220, 50%, 70%)");
        _shapes.forEach(element => 
        {
            element.draw();
        });
    };

    p5.mousePressed = () =>
    {
        let shape = _factory.createShape(p5.mouseX, p5.mouseY);
        _shapes.push(shape);
        _shapes.forEach(element => 
            {
                element.animate(p5.mouseX, p5.mouseY);
            });
        
    };
};
const myp5 = new P5(sketch);