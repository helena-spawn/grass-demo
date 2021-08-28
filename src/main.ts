import P5 from 'p5';

const sketch = (p5: P5) => 
{
  const width: number = 600;
  const height: number = 600;

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => 
  {
      p5.background("black");
  };
};
const myp5 = new P5(sketch);