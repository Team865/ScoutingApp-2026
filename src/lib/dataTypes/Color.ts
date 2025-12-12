export default class Color {
    public hexNumber: number;

    /** Creates a new color object with a hex-code represented as a number */
    constructor(color: number) {
        this.hexNumber = color;
    }

    public static fromHexCodeString(hexString: string) {
        return new Color(Number.parseInt(hexString.replace(/^#/, ""), 16));
    }

    public static fromCSSRgb(rgbString: string) {
        const values = rgbString.replace(/[(rgb)\(\),]/g, "").split(" ");
        const red = Number.parseInt(values[0]);
        const green = Number.parseInt(values[1]);
        const blue = Number.parseInt(values[2]);

        return Color.fromRGB(red, green, blue);
    }

    public static fromRGB(red: number, green: number, blue: number) {
        return new Color((red << 16) | (green << 8) | blue)
    }

    private clampColorChannelHex(hex: number) {
        return Math.max(Math.min(Math.round(hex), 0xff), 0);
    }

    public setRed(newRed: number) {
        this.hexNumber = (this.hexNumber & 0x00ffff) | (newRed << 16);
    }

    public setGreen(newGreen: number) {
        this.hexNumber = (this.hexNumber & 0xff00ff) | (newGreen << 8);
    }

    public setBlue(newBlue: number) {
        this.hexNumber = (this.hexNumber & 0xffff00) | (newBlue);
    }

    public multiply(scale: number) {
        return Color.fromRGB(
            this.clampColorChannelHex(this.red * scale),
            this.clampColorChannelHex(this.green * scale),
            this.clampColorChannelHex(this.blue * scale)
        );
    }

    get red() {
        return (this.hexNumber >> 16) & 0xFF;
    }

    get green() {
        return (this.hexNumber >> 8) & 0xFF;
    }

    get blue() {
        return (this.hexNumber >> 0) & 0xFF;
    }

    get hexString() {
        return `#${this.hexNumber.toString(16).padStart(6, "0")}`;
    }
}