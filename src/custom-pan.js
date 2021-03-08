/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "./fabrictool";

const fabric = require("fabric").fabric;

class CustomPan extends FabricCanvasTool {
  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => (o.selectable = o.evented = false));
    //Change the cursor to the move grabber
    canvas.defaultCursor = "move";
  }

  doMouseDown(o) {
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(o.e);
    this.startX = pointer.x;
    this.startY = pointer.y;

    if (o.e instanceof TouchEvent) {
      const { clientX, clientY } = o.e.touches[0];
      this.startX = clientX;
      this.startY = clientY;
    }
  }

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    if (this.isDown) {
      let delta;
      if (o.e instanceof TouchEvent) {
        // we're on mobile
        const { clientX, clientY } = o.e.touches[0];
        delta = new fabric.Point(clientX - this.startX, clientY - this.startY);
        this.startX = clientX;
        this.startY = clientY;
      } else {
        // we're on desktop
        let x = o.e.offsetX;
        let y = o.e.offsetY;
        // let delta = new fabric.Point(o.e.movementX, o.e.movementY); old code
        delta = new fabric.Point(o.e.movementX, o.e.movementY);
      }
      canvas.relativePan(delta);
    }
  }

  doMouseUp(o) {
    this.isDown = false;
  }

  touchGesture(e) {
    let canvas = this._canvas;
    if (e.e.touches && e.e.touches.length == 2) {
      console.log("TOUCH GESTURE running");
      this.isDown = false;

      const point = new fabric.Point(e.self.x, e.self.y);
      // let delta = e.self.scale;
      let zoom = canvas.getZoom();
      // console.log("TOUCH GESTURE ZOOM and DELTA", zoom, delta);

      // zoom = zoom - delta / 0.5;
      // console.log("TOUCH GESTURE BEFORE", zoom);
      // if (zoom > 4) zoom = 4;
      // if (zoom < 1) zoom = 1;
      // console.log("TOUCH GESTURE ZOOOM", zoom);
      // canvas.zoomToPoint(point, zoom);

      // SET ZOOM METHOD to resize canvas
      // const lPinchScale = e.self.scale;
      // const scaleDiff = (lPinchScale - 1) / 10 + 1; // Slow down zoom speed
      // canvas.setZoom(zoom * scaleDiff);
      debugger;
      canvas.zoomToPoint(point, 1);
    }
  }
}

export default CustomPan;
