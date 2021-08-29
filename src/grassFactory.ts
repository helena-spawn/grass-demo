import p5 from "p5";
import Grass from "./grass";

export default class GrassFactory
{
    _p5: p5;
    _drawHeight: number;
    _canvasHeight: number;

    constructor(P5: p5, drawHeight: number, canvasHeight: number)
    {
        this._p5 = P5;
        this._drawHeight = drawHeight;
        this._canvasHeight = canvasHeight;
    }

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

    calculateHeight = (): number =>
    {
        const min = 25; 
        const max = 75;
        const percentage = Math.floor(Math.random() * (max - min + 1) + min) / 100;
        console.log("Percentage " + percentage);
        const height = percentage * this._drawHeight;
        return height;
    };

    calculateStrokeWidth = (height: number): number =>
    {
        return .01 * (this._drawHeight - height);
    };

    calculateColor = (): string =>
    {
        const luminiscence = this.calculateLuminiscense();
        return "hsb(120, 40%, " + luminiscence + ")";
    };

    calculateLuminiscense = (): string =>
    {
        const min = 30; 
        const max = 50;
        const percentage = Math.floor(Math.random() * (max - min + 1) + min);

        return percentage + "%";
    };
}