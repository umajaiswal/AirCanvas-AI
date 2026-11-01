// AirCanvas AI - browser-based hand drawing
const video = document.getElementById("camera-feed");
const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

let color = "#ff1493", brush = 5, eraser = 35, tool = "freehand";
let objects = [], undoStack = [], redoStack = [];
let action = null, prev = null, moving = null, lastMove = null;
let cursor = null, gestureLabel = "Ready";

const art = document.createElement("canvas");
const ac = art.getContext("2d");

function snapshot(){ return JSON.stringify(objects); }
function checkpoint(){
  undoStack.push(snapshot());
  if(undoStack.length > 50) undoStack.shift();
  redoStack = [];
}
function redrawArt(){
  ac.fillStyle="#fff"; ac.fillRect(0,0,art.width,art.height);
  for(const o of objects) drawObject(ac,o);
}
function resize(){
  const r=canvas.getBoundingClientRect(); if(!r.width||!r.height)return;
  const old=document.createElement("canvas"); old.width=art.width; old.height=art.height;
  if(art.width&&art.height) old.getContext("2d").drawImage(art,0,0);
  canvas.width=Math.round(r.width); canvas.height=Math.round(r.height);
  art.width=canvas.width; art.height=canvas.height;
  ac.fillStyle="#fff"; ac.fillRect(0,0,art.width,art.height);
  if(old.width&&old.height) ac.drawImage(old,0,0,old.width,old.height,0,0,art.width,art.height);
  display();
}
function display(){
  ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(art,0,0);
  if(action?.preview) drawObject(ctx,action.preview);
  if(cursor){
    ctx.beginPath();ctx.arc(cursor.x,cursor.y,9,0,Math.PI*2);
    ctx.fillStyle=gestureLabel==="Pinching"?"#ff9800":"#ff1493";ctx.fill();
    ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();
  }
}
function drawObject(c,o){
  c.save(); c.strokeStyle=o.color||"#000"; c.lineWidth=o.size||5;c.lineCap="round";c.lineJoin="round";
  if(o.type==="stroke"||o.type==="eraser"){
    const pts=o.points||[]; c.strokeStyle=o.type==="eraser"?"#fff":o.color;
    if(pts.length===1){c.beginPath();c.arc(pts[0].x,pts[0].y,o.size/2,0,Math.PI*2);c.fillStyle=c.strokeStyle;c.fill();}
    else if(pts.length>1){c.beginPath();c.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)c.lineTo(pts[i].x,pts[i].y);c.stroke();}
  } else if(o.type==="rectangle"){c.strokeRect(o.x1,o.y1,o.x2-o.x1,o.y2-o.y1);}
  else if(o.type==="circle"){c.beginPath();c.arc(o.x1,o.y1,Math.hypot(o.x2-o.x1,o.y2-o.y1),0,Math.PI*2);c.stroke();}
  else if(o.type==="triangle"){c.beginPath();c.moveTo((o.x1+o.x2)/2,o.y1);c.lineTo(o.x2,o.y2);c.lineTo(o.x1,o.y2);c.closePath();c.stroke();}
  else if(o.type==="line"){c.beginPath();c.moveTo(o.x1,o.y1);c.lineTo(o.x2,o.y2);c.stroke();}
  c.restore();
}
function segment(from,to,col,size){
  ac.beginPath();ac.moveTo(from.x,from.y);ac.lineTo(to.x,to.y);
  ac.strokeStyle=col;ac.lineWidth=size;ac.lineCap="round";ac.stroke();
}
function undo(){
  if(!undoStack.length)return;
  redoStack.push(snapshot()); objects=JSON.parse(undoStack.pop());
  action=null;prev=null;moving=null;redrawArt();display();
}
function redo(){
  if(!redoStack.length)return;
  undoStack.push(snapshot());objects=JSON.parse(redoStack.pop());
  action=null;prev=null;moving=null;redrawArt();display();
}
document.getElementById("undo").onclick=undo;
document.getElementById("redo").onclick=redo;
document.getElementById("save").onclick=()=>{
  const a=document.createElement("a");a.download="AirCanvas-AI.png";a.href=art.toDataURL("image/png");a.click();
};
document.getElementById("clear").onclick=()=>{
  if(!objects.length)return;checkpoint();objects=[];action=null;prev=null;moving=null;redrawArt();display();
};
document.querySelectorAll(".color-box").forEach(b=>b.onclick=()=>{
  color=b.dataset.color;document.querySelectorAll(".color-box").forEach(x=>x.style.outline="none");b.style.outline="3px solid #222";
});
document.getElementById("brush-size").oninput=e=>brush=+e.target.value;
document.getElementById("eraser-size").oninput=e=>eraser=+e.target.value;

function setTool(t){
  tool=t;action=null;prev=null;moving=null;
  document.querySelectorAll(".shape-btn").forEach(b=>b.classList.toggle("active",b.dataset.shape===t));
  document.getElementById("pen").classList.toggle("active",t==="freehand");
  document.getElementById("eraser").classList.toggle("active",t==="erase");
  statusEl.textContent="Tool: "+t;
}
document.querySelectorAll(".shape-btn").forEach(b=>b.onclick=()=>setTool(b.dataset.shape));
document.getElementById("pen").onclick=()=>setTool("freehand");
document.getElementById("eraser").onclick=()=>setTool("erase");

function hit(o,p){
  const pad=20+(o.size||0);
  if(o.points)return o.points.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<pad);
  if(o.type==="circle"){
    const r=Math.hypot(o.x2-o.x1,o.y2-o.y1),d=Math.hypot(p.x-o.x1,p.y-o.y1);
    return d<=r+pad;
  }
  return p.x>=Math.min(o.x1,o.x2)-pad&&p.x<=Math.max(o.x1,o.x2)+pad&&p.y>=Math.min(o.y1,o.y2)-pad&&p.y<=Math.max(o.y1,o.y2)+pad;
}
function findAt(p){for(let i=objects.length-1;i>=0;i--)if(hit(objects[i],p))return objects[i];return null;}
function start(p){
  if(tool==="select"){
    moving=findAt(p); if(!moving)return;
    checkpoint();lastMove={...p};return;
  }
  checkpoint();
  if(tool==="freehand"||tool==="erase"){
    const er=tool==="erase";
    action={type:er?"eraser":"stroke",color:color,size:er?eraser:brush,points:[p]};
    objects.push(action);
    ac.beginPath();ac.arc(p.x,p.y,action.size/2,0,Math.PI*2);ac.fillStyle=er?"#fff":color;ac.fill();
  }else{
    action={preview:{type:tool,x1:p.x,y1:p.y,x2:p.x,y2:p.y,color,size:brush}};
  }
}
function move(p){
  if(tool==="select"){
    if(!moving||!lastMove)return;
    const dx=p.x-lastMove.x,dy=p.y-lastMove.y;
    if(moving.points)moving.points.forEach(q=>{q.x+=dx;q.y+=dy;});
    else{moving.x1+=dx;moving.x2+=dx;moving.y1+=dy;moving.y2+=dy;}
    lastMove={...p};redrawArt();return;
  }
  if(!action)return;
  if(action.points){
    const old=action.points[action.points.length-1];action.points.push(p);
    segment(old,p,action.type==="eraser"?"#fff":action.color,action.size);
  }else if(action.preview){action.preview.x2=p.x;action.preview.y2=p.y;}
}
function finish(){
  if(action?.preview){objects.push(action.preview);redrawArt();}
  action=null;moving=null;lastMove=null;prev=null;
}

// Finger extended checks: tip must be above PIP with a small margin.
// This rejects a fully open palm for index-only drawing.
function fingerUp(lm,tip,pip){return lm[tip].y < lm[pip].y - 0.015;}
const hands=new Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});
hands.setOptions({maxNumHands:1,modelComplexity:0,minDetectionConfidence:0.65,minTrackingConfidence:0.65});

hands.onResults(results=>{
  const lm=results.multiHandLandmarks?.[0];
  if(!lm){
    if(prev)finish();cursor=null;gestureLabel="Ready";display();return;
  }
  // Use finger tips vs PIP joints; ignore thumb for drawing pose.
  const i=fingerUp(lm,8,6),m=fingerUp(lm,12,10),r=fingerUp(lm,16,14),p=fingerUp(lm,20,18);
  const onlyIndex=i&&!m&&!r&&!p;
  const indexMiddle=i&&m&&!r&&!p;
  const pinch=Math.hypot(lm[4].x-lm[8].x,lm[4].y-lm[8].y)<0.045;
  const point={x:(1-lm[8].x)*canvas.width,y:lm[8].y*canvas.height};
  cursor=point;

  // In select mode, pinch is the only active gesture.
  // In freehand mode, only index draws; index+middle erases.
  const erasing=tool==="erase"?onlyIndex:(tool==="freehand"&&indexMiddle);
  const active=tool==="select"?pinch:(tool==="freehand"||["rectangle","circle","triangle","line"].includes(tool))&&onlyIndex;

  if(erasing){
    if(!prev||action?.type!=="eraser"){if(prev)finish();setToolIfNeeded();startErase(point);}
    else move(point);
    gestureLabel="Erasing";
  }else if(active){
    if(!prev)start(point);else move(point);
    gestureLabel=tool==="select"?"Pinching":"Drawing";
  }else{
    if(prev)finish();
    gestureLabel="Paused";
  }
  prev=(erasing||active)?point:null;
  display();
});
function setToolIfNeeded(){/* keep selected tool unchanged during gesture */}
function startErase(p){
  checkpoint();action={type:"eraser",color:"#fff",size:eraser,points:[p]};objects.push(action);
  ac.beginPath();ac.arc(p.x,p.y,eraser/2,0,Math.PI*2);ac.fillStyle="#fff";ac.fill();
}
async function startCamera(){
  try{
    if(!navigator.mediaDevices?.getUserMedia)throw new Error("Use localhost or HTTPS and allow camera access.");
    const camera=new Camera(video,{onFrame:async()=>{await hands.send({image:video});},width:320,height:240});
    await camera.start();statusEl.textContent="Hand tracking active";
  }catch(err){console.error(err);statusEl.textContent="Camera error - check permission / Console";}
}
resize();new ResizeObserver(resize).observe(document.querySelector(".canvas-wrapper"));startCamera();
