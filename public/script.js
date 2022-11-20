const socket = io(),
  form = document.querySelector("#message-form"),
  input = document.querySelector("#chat"),
  myCursor = document.querySelector("#myCursor"),
  canvasHolder = document.getElementById("canvasHolder"),
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  penBox = document.getElementById('penBox'),
  colourBox = document.getElementById('colourBox'),
  addPenWidth = document.getElementById('addPenWidth'),
  removePenWidth = document.getElementById('removePenWidth'),
  header = document.getElementById('header')
  red = document.getElementById('red'),
  blue = document.getElementById('blue'),
  yellow = document.getElementById('yellow'),
  green = document.getElementById('green'),
  pink = document.getElementById('pink'),
  orange = document.getElementById('orange'),
  purple = document.getElementById('purple'),
  black = document.getElementById('black'),
  lightBlue = document.getElementById('lightBlue');
  screenWidth = window.innerWidth
let localUser = ""
let previousColor = "black"
let penDown = false
let mouseDown = false;
let userArray = []
let styleWidth = 50
let styleHeight = 50


document.addEventListener('mousemove', (e)=>{changeCursor(e)})

document.addEventListener('touchmove', (e)=>{changeCursor(e)})

function changeCursor(e){
  if(document.elementsFromPoint(e.x, e.y).includes(colourBox) && !myCursor.classList.contains("pipet")){
    myCursor.classList.add("pipet"),myCursor.style.width = styleWidth
  }
  if(!document.elementsFromPoint(e.x, e.y).includes(colourBox) && myCursor.classList.contains("pipet")){
    myCursor.classList.remove("pipet"),myCursor.style.width = styleWidth
  }
  if(document.elementsFromPoint(e.x, e.y).includes(header) && !myCursor.classList.contains("paintCan")){
    myCursor.classList.add("paintCan"),myCursor.style.width = styleWidth
  }
  if(!document.elementsFromPoint(e.x, e.y).includes(header) && myCursor.classList.contains("paintCan")){
    myCursor.classList.remove("paintCan"),myCursor.style.width = styleWidth
  }
}
document.addEventListener('touch',(e)=>{touchClick(e)})
document.addEventListener( 'click',(e)=>{touchClick(e)})

function touchClick(e){
  const {pageX,pageY} = e
  if(document.elementsFromPoint(e.x, e.y).includes(red)){ctx.strokeStyle = '#FF355E',myCursor.classList = ('cursor red pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(blue)){ctx.strokeStyle = '#0047AB',myCursor.classList = ('cursor blue pipet ')}
  if(document.elementsFromPoint(e.x, e.y).includes(yellow)){ctx.strokeStyle = '#FFFF00',myCursor.classList = ('cursor yellow pipet ')}
  if(document.elementsFromPoint(e.x, e.y).includes(green)){ctx.strokeStyle = '#50C878',myCursor.classList = ('cursor green pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(pink)){ctx.strokeStyle = '#FFC0CB',myCursor.classList = ('cursor pink pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(orange)){ctx.strokeStyle = '#FFA500',myCursor.classList = ('cursor orange pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(purple)){ctx.strokeStyle = '#9F2B68',myCursor.classList = ('cursor purple pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(black)){ctx.strokeStyle = '#000000',myCursor.classList = ('cursor black pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(lightBlue)){ctx.strokeStyle = '#72BCD4',myCursor.classList = ('cursor lightBlue pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(header)){header.classList = myCursor.classList[1]}
  if(document.elementsFromPoint(e.x, e.y).includes(addPenWidth)){
    if(parseInt(myCursor.style.width)<= 200){
      styleHeight += 10
      styleWidth += 10
      ctx.lineWidth+=1;
      myCursor.style.width = styleWidth + 10 + "px"
      myCursor.style.height = styleWidth + 10 + "px"
    }
  }
  if(document.elementsFromPoint(e.x, e.y).includes(removePenWidth)){
    if(parseInt(myCursor.style.width) > 50){
      styleHeight -= 10
      styleWidth -= 10
      ctx.lineWidth-=1;
      myCursor.style.width = styleWidth - 10 + "px"
      myCursor.style.height = styleHeight - 10 + "px"
    }
  }
    socket.emit("penClick", {userId: localUser, otherWidth : window.innerWidth, otherHeight:window.innerHeight,
    pageX:pageX, pageY:pageY, ctxColour: ctx.strokeStyle, penClassList: myCursor.classList, lineWidth: ctx.lineWidth, styleWidth: styleWidth, styleHeight:styleHeight, headerClassList : header.classList} )
}

document.addEventListener('mousemove', event=>{mouseMoving(event)}) 

document.addEventListener('touchmove', event=>{mouseMoving(event)}) 

document.addEventListener('mouseup', ()=>{penDown = false})

document.addEventListener('touchend', ()=>{penDown = false})

document.addEventListener('mousedown', event=>{drawStart(event)})

document.addEventListener('touchstart', event=>{drawStart(event)})

function drawStart(event){
  const {x, y} = getCoords(event)
  penDown = true
  mouseDown = true
  ctx.moveTo(x, y)
  ctx.beginPath()
}

function addUser(user){
  const userCanvas = document.createElement('canvas')
  const  userPointer = document.createElement('div');
  userCanvas.setAttribute('id',`userCanvas-${user}`)
  userCanvas.width = "1180";
  userCanvas.height = "620"
  userPointer.setAttribute('id',`userPen-${user}`)
  userPointer.classList.add('cursor')
  canvasHolder.appendChild(userCanvas)
  penBox.appendChild(userPointer)
  penBox.childElementCount;
}

function getCoords(event){
  const {pageX,pageY} = event
  const {offsetLeft,offsetTop} = canvas 
  return {x: pageX - offsetLeft, y: pageY-offsetTop}
}

function mouseMoving(event){
  const {pageX,pageY} = event
  const {x, y} = getCoords(event)
  if(myCursor.classList.contains("pipet") || myCursor .classList.contains("paintCan")){
    myCursor.setAttribute("style", `width: ${styleWidth}px; height: ${styleHeight}px;top: ${pageY - styleHeight}px; left: ${pageX}px`)
  }else{
    myCursor.setAttribute("style", `width: ${myCursor.style.width}; height: ${myCursor.style.height}; top: ${pageY}px; left: ${pageX}px`)
  }
  if(penDown){
    ctx.lineTo(x,y)
    ctx.stroke()
  }
  socket.emit("pendrawing", {x: x, y: y, userId: localUser, penDown: penDown, otherWidth : window.innerWidth, otherHeight:window.innerHeight,
  pageX:pageX, pageY:pageY, mouseDown: mouseDown, penClassList: myCursor.classList, styleWidth: styleWidth, styleHeight:styleHeight} )
  if(mouseDown){
    mouseDown = false;
  }
}

function otherUserDrawing(userInfo){
  const {x, y , userId, penDown, otherWidth, otherHeight,pageX,pageY,mouseDown, penClassList, styleWidth, styleHeight} = userInfo
  if(userId !== localUser){
    const width = ((window.innerWidth-1180)/2) - ((otherWidth-1180)/2);
    const height = ((window.innerHeight-620)/2) - ((otherHeight-620)/2); 
    const userPen = document.getElementById(`userPen-${userId}`);
    const userCanvas = document.getElementById(`userCanvas-${userId}`);
    const ctxNew = userCanvas.getContext('2d')
    userPen.classList = `${penClassList[0]} ${penClassList[1]} ${penClassList[2]}`
    if(userPen.classList.contains("pipet")|| userPen.classList.contains("paintCan")){
      userPen.setAttribute("style", `width: ${styleWidth}px; height: ${styleHeight}px;top: ${pageY+height-styleHeight}px; left: ${pageX+width}px`)
    }else{
      userPen.setAttribute("style", `width: ${styleWidth}px; height: ${styleHeight}px; top: ${pageY+height}px; left: ${pageX+width}px`)
    }
    if(mouseDown){
      ctxNew.moveTo(x, y)
      ctxNew.beginPath()
    }
    if(penDown){
      ctxNew.lineTo(x,y)
      ctxNew.stroke()
    }else if(!penDown){
      ctxNew.moveTo(x, y)
    }
  }
}

function penClicked(penInfo){
  const {userId, otherWidth, otherHeight,pageX,pageY,ctxColour, penClassList ,lineWidth, styleWidth, styleHeight, headerClassList} = penInfo
  if(userId !== localUser){
    const width = ((window.innerWidth-1180)/2) - ((otherWidth-1180)/2);
    const height = ((window.innerHeight-620)/2) - ((otherHeight-620)/2); 
    const userPen = document.getElementById(`userPen-${userId}`);
    const userCanvas = document.getElementById(`userCanvas-${userId}`);
    const ctxNew = userCanvas.getContext('2d')
    if(headerClassList[0] !=="default"){header.classList = headerClassList[0]}
    userPen.classList = `${penClassList[0]} ${penClassList[1]} ${penClassList[2]}`
    ctxNew.lineWidth = lineWidth
    ctxNew.strokeStyle = ctxColour
    if(userPen.classList.contains("pipet")|| userPen.classList.contains("paintCan")){
      userPen.setAttribute("style", `width: ${styleWidth}px; height: ${styleHeight}px;top: ${pageY+height-styleHeight}px; left: ${pageX+width}px`)
    }else{
      userPen.setAttribute("style", `width: ${styleWidth}px; height: ${styleHeight}px; top: ${pageY+height}px; left: ${pageX+width}px`)
    }
  }
}

socket.on("user", function (user){
  if(localUser === ""){localUser = user}
})

socket.on("disconnected", function(user){
  try{
    const userPen = document.getElementById(`userPen-${user}`);
    penBox.removeChild(userPen)
    userArray = userArray.filter((i) => i !== user)
  }catch(error){}
})

socket.on("pendrawing", function (userInfo){
  if(!document.getElementById(`userPen-${userInfo.userId}`) && userInfo.userId !== localUser){
      addUser(userInfo.userId)
      userArray.push(userInfo.userId)
  }
  otherUserDrawing(userInfo)
})

socket.on("penClick", function (penInfo){penClicked(penInfo)})

function zoomOutMobile() {
  var viewport = document.querySelector('meta[name="viewport"]');
  if(window.innerWidth<= 640 && window.innerHeight>=640 && viewport){
    viewport.content = "initial-scale=0.1";    
  }
  else if(window.innerWidth<= 800 && viewport){
      viewport.content = "initial-scale=0.375";
  }
  else if(window.innerWidth<= 1200 && viewport){
    viewport.content = "initial-scale=0.6";
}
}

zoomOutMobile();