interface keyMappings {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  space: boolean;
  shift: boolean;
  f: boolean;
}

export default class CharacterControllerInput {
  private keys: keyMappings = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false,
    shift: false,
    f: false,
  };

  constructor() {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown(e: KeyboardEvent) {
    switch (e.code.toLowerCase()) {
      case "arrowup":
      case "keyw":
        this.keys.forward = true;
        break;
      case "arrowleft":
      case "keya":
        this.keys.left = true;
        break;
      case "arrowdown":
      case "keys":
        this.keys.backward = true;
        break;
      case "arrowright":
      case "keyd":
        this.keys.right = true;
        break;
      case "keyf":
        this.keys.f = true;
      case "space":
        this.keys.space = true;
        break;
      case "shiftright":
      case "shiftleft":
        this.keys.shift = true;
        break;
      default:
        console.log(e.key);
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    switch (e.code.toLowerCase()) {
      case "arrowup":
      case "keyw":
        this.keys.forward = false;
        break;
      case "arrowleft":
      case "keya":
        this.keys.left = false;
        break;
      case "arrowdown":
      case "keys":
        this.keys.backward = false;
        break;
      case "arrowright":
      case "keyd":
        this.keys.right = false;
        break;
      case "keyf":
        this.keys.f = false;
      case "space":
        this.keys.space = false;
        break;
      case "shiftright":
      case "shiftleft":
        this.keys.shift = false;
        break;
      default:
        break;
    }
  }
}
