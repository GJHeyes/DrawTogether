// io() is a method from the socket library added in our html file
const socket = io(),
  form = document.querySelector("#message-form"),
  input = document.querySelector("#chat"),
  myCursor = document.querySelector("#myCursor"),
  canvas = document.getElementById('canvas'),
  penBox = document.getElementById('penBox'),
  colourBox = document.getElementById('colourBox'),
  canvasHolder = document.getElementById("canvasHolder"),
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
  lightBlue = document.getElementById('lightBlue'),
  ctx = canvas.getContext('2d');
  
let penDown = false
let localUser = ""
const colorArray = ["red","blue","yellow","green","pink","orange","purple"]
let userArray = []
let mouseDown = false;
let styleWidth = 50
let styleHeight = 50
let previousColor = "black"

document.addEventListener('mousemove', (e)=>{
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
})

document.addEventListener( 'click',(e)=>{
  //elem = document.elementsFromPoint(e.x, e.y);
  if(document.elementsFromPoint(e.x, e.y).includes(red)){ctx.strokeStyle = '#FF355E',myCursor.classList = ('cursor red pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(blue)){ctx.strokeStyle = '#0047AB',myCursor.classList = ('cursor blue pipet ')}
  if(document.elementsFromPoint(e.x, e.y).includes(yellow)){ctx.strokeStyle = '#FFFF00',myCursor.classList = ('cursor yellow pipet ')}
  if(document.elementsFromPoint(e.x, e.y).includes(green)){ctx.strokeStyle = '#50C878',myCursor.classList = ('cursor green pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(pink)){ctx.strokeStyle = '#FFC0CB',myCursor.classList = ('cursor pink pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(orange)){ctx.strokeStyle = '#FFA500',myCursor.classList = ('cursor orange pipet')}
  if(document.elementsFromPoint(e.x, e.y).includes(purple)){ctx.strokeStyle = '#A020F0',myCursor.classList = ('cursor purple pipet')}
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
})

document.addEventListener('mousemove', event=>{
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
  pageX:pageX, pageY:pageY, ctxColour: ctx.strokeStyle, mouseDown: mouseDown, penClassList: myCursor.classList, lineWidth: ctx.lineWidth, styleWidth: styleWidth, styleHeight:styleHeight, headerClassList : header.classList} )
  if(mouseDown){
    mouseDown = false;
  }
}) 

document.addEventListener('mouseup', event=>{
  penDown = false
})

document.addEventListener('mousedown', event=>{
  const {x, y} = getCoords(event)
  penDown = true
  mouseDown = true
  ctx.moveTo(x, y)
  ctx.beginPath()
  
})

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

function otherUserDrawing(userInfo){
  const {x, y , userId, penDown, otherWidth, otherHeight,pageX,pageY,ctxColour,mouseDown, penClassList ,lineWidth, styleWidth, styleHeight, headerClassList} = userInfo
  if(userId !== localUser){
    const width = ((window.innerWidth-1180)/2) - ((otherWidth-1180)/2);
    const height = ((window.innerHeight-620)/2) - ((otherHeight-620)/2); 
    const userPen = document.getElementById(`userPen-${userId}`);
    const userCanvas = document.getElementById(`userCanvas-${userId}`);
    const ctxNew = userCanvas.getContext('2d')
    if(headerClassList[0] !=="default"){
      header.classList = headerClassList[0]
    }
    userPen.classList = `${penClassList[0]} ${penClassList[1]} ${penClassList[2]}`
    ctxNew.lineWidth = lineWidth
    if(userPen .classList.contains("pipet")){
      userPen.setAttribute("style", `width: ${styleWidth}px; height: ${styleHeight}px;top: ${pageY+height-styleHeight}px; left: ${pageX+width}px`)
    }else{
      userPen.setAttribute("style", `width: ${styleWidth}px; height: ${styleHeight}px; top: ${pageY+height}px; left: ${pageX+width}px`)
    }
    if(mouseDown){
      ctxNew.moveTo(x, y)
      ctxNew.beginPath()
    }
    if(penDown){
      ctxNew.strokeStyle = ctxColour
      ctxNew.lineTo(x,y)
      ctxNew.stroke()
    }else if(!penDown){
      ctxNew.moveTo(x, y)
    }
  }
}

socket.on("user", function (user){
  if(localUser === ""){
    localUser = user
  }
})

socket.on("disconnected", function(user){
  try{
    const userPen = document.getElementById(`userPen-${user}`);
    penBox.removeChild(userPen)
    userArray = userArray.filter((i) => i !== user)
  }catch(error){
  }
})

socket.on("pendrawing", function (userInfo){
  if(!document.getElementById(`userPen-${userInfo.userId}`)){
    if(userInfo.userId !== localUser){
      addUser(userInfo.userId)
      userArray.push(userInfo.userId)
    }
  }
  otherUserDrawing(userInfo)
})




/*******************pendrawing***********************/
