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

      // 1st Method
      // let delta = e.self.scale * 2;
      // const p1 = e.e.touches[0];
      // const p2 = e.e.touches[1];
      // let zoom = canvas.getZoom();
      // zoom = zoom - delta / zoomOpts.zoomStep;
      // if (zoom > zoomOpts.maxZoom) zoom = zoomOpts.maxZoom;
      // if (zoom < zoomOpts.minZoom) zoom = zoomOpts.minZoom;
      // canvas.zoomToPoint({ x: p1.clientX, y: p1.clientY }, delta);

      // Alternative Method
      const point = new fabric.Point(e.self.x, e.self.y);
      let zoomStartScale = 1;
      if (e.self.state == "start") {
        zoomStartScale = canvas.getZoom();
      }
      let delta = (zoomStartScale * e.self.scale) / zoomOpts.zoomStep;
      canvas.zoomToPoint(point, delta);
      this.isDown = true;
      // limit zoom to 4x in
      if (delta > 4) delta = 4;
      // limit zoom to 1x out
      if (delta < 1) {
        delta = 1;
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      }

      // SET ZOOM METHOD to resize canvas
      // const lPinchScale = e.self.scale;
      // const scaleDiff = (lPinchScale - 1) / 10 + 1; // Slow down zoom speed
      // canvas.setZoom(zoom * scaleDiff);
    }
  }
}

export default CustomPan;
