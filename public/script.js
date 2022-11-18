// io() is a method from the socket library added in our html file
const socket = io(),
  form = document.querySelector("#message-form"),
  input = document.querySelector("#chat"),
  myCursor = document.querySelector("#myCursor"),
  canvas = document.getElementById('canvas'),
  penBox = document.getElementById('penBox')
  canvasHolder = document.getElementById("canvasHolder"),
  ctx = canvas.getContext('2d');
let penDown = false
let draw = false;
let localUser = ""
const colorArray = ["red","blue","yellow","green","pink","orange","purple"]
let userArray = []

const randomColour = colorArray[Math.floor(Math.random()*7)]
myCursor.classList.add(randomColour)
/*******************pendrawing***********************/

ctx.strokeStyle = '#4EABE5'

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
    draw = true;
  }
  socket.emit("pendrawing", {x: x, y: y, userId: localUser, penDown: penDown, otherWidth : window.innerWidth, otherHeight:window.innerHeight,
  pageX:pageX, pageY:pageY} )
}) 

document.addEventListener('mousedown', event=>{
  const {x, y} = getCoords(event)
  penDown = true
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
  const {x, y , userId, penDown, otherWidth, otherHeight,pageX,pageY} = userInfo
  if(userId !== localUser){
    const width = ((window.innerWidth-1400)/2) - ((otherWidth-1400)/2);
    const height = ((window.innerHeight-800)/2) - ((otherHeight-800)/2); 
    const userPen = document.getElementById(`userPen-${userId}`);
    //const userNum = userArray.indexOf(userId)
    // const newCanvas = document.getElementById(`canvas${userNum}`);
    // const newCtx = newCanvas.getContext('2d')
    const userCanvas = document.getElementById(`userCanvas-${userId}`);
    const ctxNew = userCanvas.getContext('2d')
    userPen.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
    if(penDown){
      ctxNew.strokeStyle = '#A020F0'
      ctxNew.lineTo(x,y)
      ctxNew.stroke()
      // newCtx.strokeStyle = '#A020F0'
      // newCtx.lineTo(x,y)
      // newCtx.stroke()
    }else if(!penDown){
      ctxNew.moveTo(x, y)
      //newCtx.moveTo(x, y)
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
    console.log("pen not yet created")
  }
})


function addUser(user){
  const userCanvas = document.createElement('canvas')
  const  userPointer = document.createElement('div'),
    randomColour = colorArray[Math.floor(Math.random()*7)];
  userCanvas.setAttribute('id',`userCanvas-${user}`)
  userCanvas.width = "1400";
  userCanvas.height = "800"
  userPointer.setAttribute('id',`userPen-${user}`)
  userPointer.classList.add('cursor')
  userPointer.classList.add(randomColour)
  canvasHolder.appendChild(userCanvas)
  penBox.appendChild(userPointer)
  penBox.childElementCount;
}

/*******************pendrawing***********************/
