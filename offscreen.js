let canvas = null;
let ctx = null;
let startX, startY, endX, endY;
let recording = false;
let baseData


function renderBox(x1, y1, x2, y2, style) {
  console.log()
  ctx.save();
  ctx.fillStyle = style;
  ctx.fillRect(x1, y1, x2-x1, y2-y1);
  ctx.restore();
}

self.onmessage = (evt) => {
  if (evt.data.cmd === 'init') {
    canvas = evt.data.canvas;
    canvas.width = evt.data.width;
    canvas.height = evt.data.height;
    ctx = canvas.getContext('2d', { alpha: true });
    renderBox(0,0,canvas.width,canvas.height, `rgba(0, 0, 0, 1)`)
  } else if (evt.data.cmd === 'mousedown') {
    startX = evt.data.values.x;
    startY = evt.data.values.y;
    recording = true;
    baseData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  } else if (evt.data.cmd === 'mousemove') {
    if (!recording) return;
    endX = evt.data.values.x;
    endY = evt.data.values.y;
    ctx.putImageData(baseData, 0, 0);
    renderBox(startX, startY, endX, endY, 'rgba(255, 255, 255, 0.25)')
  } else if (evt.data.cmd === 'mouseup') {
    endX = evt.data.values.x;
    endY = evt.data.values.y;
    recording = false;
    renderBox(startX, startY, endX, endY, `rgba(255, 0, 0, 1)`);
    baseData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}