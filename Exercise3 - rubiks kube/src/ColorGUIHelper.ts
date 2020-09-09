export class ColorGUIHelper {
  colour: THREE.Color;

  constructor(colour: THREE.Color) {
    this.colour = colour;
  }
  get hexValue() {
    return `#${this.colour.getHexString()}`;
  }
  set hexValue(hexString) {
    this.colour.set(hexString);
  }
}
