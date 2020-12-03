/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'

const fabric = require('fabric').fabric;

class CustomPan extends FabricCanvasTool {

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => o.selectable = o.evented = false);
    //Change the cursor to the move grabber
    canvas.defaultCursor = 'move';
  }

  doMouseDown(o) {
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(o.e);
    this.startX = pointer.x;
    this.startY = pointer.y;
  }

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    let x = o.e.offsetX;
    let y = o.e.offsetY;
    let delta = new fabric.Point(o.e.movementX, o.e.movementY);
    canvas.relativePan(delta);
  }

  doMouseUp(o) {
    this.isDown = false;
  }

}

export default CustomPan;