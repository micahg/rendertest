/**
 * What did we learn?
 * 
 * - transferToImageBitmap seems to nuke the original image.
 * - transferFromImageBitmap consumes it (its gone).
 * 
 * This is probably whats causing the grief trying to reuse stuff.
 */
let OSCtx;
let OLCtx;
let startX, startY, endX, endY;
let recording = false;

function onLoad() {
  const canvas = document.getElementById("overlay");
  // canvas.addEventListener("resize", e => setupOffscreenCanvas(e));
  setupOffscreenCanvas()
  canvas.addEventListener('mousedown', e => startRecording(e));
  canvas.addEventListener('mousemove', e => moveRecording(e));
  canvas.addEventListener('mouseup', e => stopRecording(e));
}
function onLoad() {
  const canvas = document.getElementById("overlay");
  const offscreen = canvas.transferControlToOffscreen();
  const worker = new Worker("offscreen.js");
  worker.postMessage({ canvas: offscreen }, [canvas]);
}

function setupOffscreenCanvas() {
  console.log(event);
  const canvas = document.getElementById("overlay");
  OLCtx = canvas.getContext("bitmaprenderer")
  const [w, h] = [canvas.offsetWidth, canvas.offsetHeight];
  console.log(`${w}x${h}`);
  const offscreen = new OffscreenCanvas(w, h);
  const buffer = new OffscreenCanvas(w, h);
  OSCtx = offscreen.getContext('2d', { alpha: true });
  OSCtx.save();
  OSCtx.fillStyle = `rgba(0, 0, 0, 1)`;
  OSCtx.fillRect(0,0,w,h);
  OSCtx.restore();
  // OLCtx.transferFromImageBitmap(OSCtx.canvas.transferToImageBitmap());

  OSCtx.save();
  OSCtx.fillStyle = `rgba(255, 0, 0, 1)`;
  OSCtx.fillRect(10,10,200,200);
  OSCtx.restore();
  OLCtx.transferFromImageBitmap(OSCtx.canvas.transferToImageBitmap());
  console.log('hi');
}

function startRecording(event) {
  startX = event.clientX;
  startY = event.clientY;
  recording = true;
}

function moveRecording(event) {
  if (!recording) return;
  endX = event.clientX;
  endY = event.clientY;
  OSCtx.save();
  OSCtx.fillStyle ="rgba(255, 255, 255, 0.25)";
  OSCtx.fillRect(startX, startY, endX, endY);
  OSCtx.restore();
  OLCtx.transferFromImageBitmap(OSCtx.canvas.transferToImageBitmap());
}

function stopRecording(event) {
  // record final event
  moveRecording(event);
  recording = false;
  renderBox(startX, startY, endX, endY);
}

function renderBox(x1, y1, x2, y2) {
  OSCtx.save();
  OSCtx.fillStyle = `rgba(255, 0, 0, 1)`;
  OSCtx.fillRect(x1, y1, x2, y2);
  OSCtx.restore();
  OLCtx.transferFromImageBitmap(OSCtx.canvas.transferToImageBitmap());
}
