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

  touchGesture(e, zoomOpts) {
    let canvas = this._canvas;
    if (e.e.touches && e.e.touches.length == 2) {
      this.isDown = false;

      let delta = e.self.scale * 3;
      const p1 = e.e.touches[0];
      const p2 = e.e.touches[1];

      let zoom = canvas.getZoom();
      console.log("ZOOM ", zoom, zoomOpts, delta);
      if (delta > zoom) delta += zoom;
      zoom = zoom - delta / zoomOpts.zoomStep;
      if (zoom > zoomOpts.maxZoom) zoom = zoomOpts.maxZoom;
      if (zoom < zoomOpts.minZoom) zoom = zoomOpts.minZoom;
      canvas.zoomToPoint({ x: p1.clientX, y: p1.clientY }, delta);

      // let zoomStartScale = canvas.getZoom();
      // let zoom = e.self.scale;
      // zoom = zoomStartScale * zoom;
      // if (zoom > 8) {
      //   zoom = 8; // max pinch zoom
      // }
      // if (zoom < 0.3) {
      //   zoom = 0.3; // min pinch zoom
      // }
      // canvas.setToPoint(distance, zoom);

      // SET ZOOM METHOD to resize canvas
      // const lPinchScale = e.self.scale;
      // const scaleDiff = (lPinchScale - 1) / 10 + 1; // Slow down zoom speed
      // canvas.setZoom(zoom * scaleDiff);
    }
  }
}

export default CustomPan;
