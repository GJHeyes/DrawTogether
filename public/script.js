// io() is a method from the socket library added in our html file
const socket = io(),
  form = document.querySelector("#message-form"),
  input = document.querySelector("#chat"),
  myCursor = document.querySelector("#myCursor"),
  canvas = document.getElementById('canvas'),
  penBox = document.getElementById('penBox')
  colourBox = document.getElementById('colourBox')
  canvasHolder = document.getElementById("canvasHolder"),
  ctx = canvas.getContext('2d');
let penDown = false
let localUser = ""
const colorArray = ["red","blue","yellow","green","pink","orange","purple"]
let userArray = []
let mouseDown = false;
/********************buttons*******************/
const red = document.getElementById('red')
const blue = document.getElementById('blue')
const yellow = document.getElementById('yellow')
const green = document.getElementById('green')
const pink = document.getElementById('pink')
const orange = document.getElementById('orange')
const purple = document.getElementById('purple')
const black = document.getElementById('black')

red.addEventListener('click', ()=>{ctx.strokeStyle = '#FF0000',myCursor.classList = ('cursor red')} )
blue.addEventListener('click', ()=>{ctx.strokeStyle = '#0000FF',myCursor.classList = ('cursor blue')})
yellow.addEventListener('click', ()=>{ctx.strokeStyle = '#FFFF00',myCursor.classList = ('cursor yellow')})
green.addEventListener('click', ()=>{ctx.strokeStyle = '#00FF00',myCursor.classList = ('cursor green')})
pink.addEventListener('click', ()=>{ctx.strokeStyle = '#FFC0CB',myCursor.classList = ('cursor pink')})
orange.addEventListener('click', ()=>{ctx.strokeStyle = '#FFA500',myCursor.classList = ('cursor orange')})
purple.addEventListener('click', ()=>{ctx.strokeStyle = '#A020F0',myCursor.classList = ('cursor purple')})
black.addEventListener('click', ()=>{ctx.strokeStyle = '#000000',myCursor.classList = ('cursor')})
colourBox.addEventListener('mouseover', ()=>{myCursor.classList.add("cursorChange")}) 
colourBox.addEventListener('mouseout', ()=>{myCursor.classList.remove("cursorChange")}) 
/********************buttons*******************/
const randomColour = colorArray[Math.floor(Math.random()*7)]

/*******************pendrawing***********************/

ctx.strokeStyle = '#000000'

function getCoords(event){
  const {pageX,pageY} = event
  const {offsetLeft,offsetTop} = canvas 
  return {x: pageX - offsetLeft, y: pageY-offsetTop}
}

document.addEventListener('mousemove', event=>{
  const {pageX,pageY} = event
  const {x, y} = getCoords(event)
  myCursor.setAttribute("style", `top: ${pageY}px; left: ${pageX}px`)
  if(penDown){
    ctx.lineTo(x,y)
    ctx.stroke()
  }
  socket.emit("pendrawing", {x: x, y: y, userId: localUser, penDown: penDown, otherWidth : window.innerWidth, otherHeight:window.innerHeight,
  pageX:pageX, pageY:pageY, ctxColour: ctx.strokeStyle, mouseDown: mouseDown, penColor: myCursor.classList[1]} )
  if(mouseDown){
    mouseDown = false;
  }
}) 

document.addEventListener('mousedown', event=>{
  const {x, y} = getCoords(event)
  penDown = true
  mouseDown = true
  ctx.moveTo(x, y)
  ctx.beginPath()
  
})

document.addEventListener('mouseup', event=>{
  penDown = false
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

function otherUserDrawing(userInfo){
  
  const {x, y , userId, penDown, otherWidth, otherHeight,pageX,pageY,ctxColour,mouseDown, penColor} = userInfo
  console.log(penColor)
  if(userId !== localUser){
    const width = ((window.innerWidth-1180)/2) - ((otherWidth-1180)/2);
    const height = ((window.innerHeight-620)/2) - ((otherHeight-620)/2); 
    const userPen = document.getElementById(`userPen-${userId}`);
    const userCanvas = document.getElementById(`userCanvas-${userId}`);
    const ctxNew = userCanvas.getContext('2d')
    userPen.classList = `cursor ${penColor}`
    userPen.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
    if(mouseDown){
      console.log('Hello')
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
//const userNum = userArray.indexOf(userId)
// const newCanvas = document.getElementById(`canvas${userNum}`);
// const newCtx = newCanvas.getContext('2d')
// newCtx.strokeStyle = '#A020F0'
// newCtx.lineTo(x,y)
// newCtx.stroke()
//newCtx.moveTo(x, y)

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
    console.log("pen not yet created")
  }
})


function addUser(user){
  const userCanvas = document.createElement('canvas')
  const  userPointer = document.createElement('div');
   // randomColour = colorArray[Math.floor(Math.random()*7)];
  userCanvas.setAttribute('id',`userCanvas-${user}`)
  userCanvas.width = "1180";
  userCanvas.height = "620"
  userPointer.setAttribute('id',`userPen-${user}`)
  userPointer.classList.add('cursor')
  //userPointer.classList.add(randomColour)
  canvasHolder.appendChild(userCanvas)
  penBox.appendChild(userPointer)
  penBox.childElementCount;
}

/*******************pendrawing***********************/
