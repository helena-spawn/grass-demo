import P5 from 'p5';
import Grass from './grass';
import GrassFactory from './grassFactory';

const sketch = (p5: P5) => 
{
    const _canvasWidth = 1024;
    const _canvasHeight = 768;
    const _bottomMargin = 150;
    const _debug = true;

    const _shapes = new Array<Grass>();
    const _drawHeight = _canvasHeight - _bottomMargin;
    const _factory = new GrassFactory(p5, _drawHeight, _canvasHeight);

    p5.setup = () => 
    {
        p5.createCanvas(_canvasWidth, _canvasHeight);
    };

    p5.draw = () => 
    {
        p5.background("hsb(220, 50%, 70%)");
        
        drawBottomMargin();
        _shapes.forEach(element => 
        {
            element.draw(_debug);
        });
    };

    const drawBottomMargin = (): void => 
    {
        p5.stroke("hsb(120, 40%, 40%)");
        p5.fill("hsb(120, 40%, 40%)");
        p5.rect(0, _canvasHeight - _bottomMargin, _canvasWidth, _bottomMargin);
    };
    
    p5.mousePressed = () =>
    {
        const shape = _factory.createShape(p5.mouseX);
        _shapes.push(shape);
        _shapes.forEach(element => 
            {
                element.animate(p5.mouseX);
            });
        
    };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mySketch = new P5(sketch);