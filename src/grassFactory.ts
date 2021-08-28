import p5 from "p5";
import Grass from "./grass";

export default class GrassFactory
{
    _p5: p5;
    _screenWidth: number;
    _screenHeight: number;

    constructor(P5: p5, screenWidth: number, screenHeight: number)
    {
        this._p5 = P5;
        this._screenWidth = screenWidth;
        this._screenHeight = screenHeight;
    }

    createShape = (x: number, y: number): Grass  =>
    {
        let bottom: p5.Vector = this._p5.createVector(x, this._screenHeight);
        let height = this.calculateHeight();
        let top: p5.Vector = this._p5.createVector(x, height);
        let strokeWidth = this.calculateStrokeWidth(height);
        let color = this.calculateColor(strokeWidth);
        let grass = new Grass(this._p5, bottom, top, strokeWidth, color); 
        return grass;
    }

    calculateHeight = (): number =>
    {
        let min = 25; 
        let max = 75;
        let percentage = Math.floor(Math.random() * (max - min + 1) + min) / 100;
        console.log("Percentage " + percentage);
        let height = percentage * this._screenHeight;
        return height;
    }

    calculateStrokeWidth = (height: number): number =>
    {
        return .01 * (this._screenHeight - height);
    }

    calculateColor = (strokeWidth: number): string =>
    {
        let luminiscence = this.calculateLuminiscense(strokeWidth);
        return "hsb(120, 40%, " + luminiscence + ")";
    }

    calculateLuminiscense = (strokeWith: number): string =>
    {
        let min = 30; 
        let max = 50;
        let percentage = Math.floor(Math.random() * (max - min + 1) + min);

        return percentage + "%";
        // return "35%";
    }
}