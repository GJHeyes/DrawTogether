// io() is a method from the socket library added in our html file
const socket = io(),
  form = document.querySelector("#message-form"),
  input = document.querySelector("#chat"),
  //otherCursor = document.querySelector(".otherCursor"),
  myCursor = document.querySelector("#myCursor"),
  canvas = document.getElementById('canvas'),
  //canvas2 = document.getElementById('canvas2'),
  penBox = document.getElementById('penBox')
  canvasHolder = document.getElementById("canvasHolder"),
  ctx = canvas.getContext('2d');
  //ctxOtherUser = canvas2.getContext('2d');
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
  //const {x, y} = getCoords(event)
  penDown = false
  /*if(draw = true){
    ctx.moveTo(x, y)
    ctx.beginPath()
    ctx.lineTo(x,y)
    ctx.stroke()
    draw=false
  }*/
})

socket.on("pendrawing", function (userInfo){
  if(!document.getElementById(`userPen-${userInfo.userId}`)){
    addUser(userInfo.userId)
    const userPen = document.getElementById(`userPen-${localUser}`);
    userPen.classList.add('hidden')
    const userCanvas = document.getElementById(`userCanvas-${localUser}`);
    userCanvas.classList.add('hidden')
    if(userInfo.userId !== localUser){
      userArray.push(userInfo.userId)
    }
  }
  otherUserDrawing(userInfo)
})

function otherUserDrawing(userInfo){
  console.log(userArray)
  
  const {x, y , userId, penDown, otherWidth, otherHeight,pageX,pageY} = userInfo
  if(userId !== localUser){
    const width = ((window.innerWidth-1400)/2) - ((otherWidth-1400)/2);
    const height = ((window.innerHeight-800)/2) - ((otherHeight-800)/2); 
    const userPen = document.getElementById(`userPen-${userId}`);
    const userNum = userArray.indexOf(userId)
    const newCanvas = document.getElementById(`canvas${userNum}`);
    const newCtx = newCanvas.getContext('2d')
    //const userCanvas = document.getElementById(`userCanvas-${userId}`);
    //const ctxNew = userCanvas.getContext('2d')
    
    // const canvas2 = document.getElementById('canvas2')
    // const ctxOtherUser = canvas2.getContext('2d')
    userPen.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)

    if(penDown){
      // ctxOtherUser.strokeStyle = '#A020F0'
      // ctxOtherUser.lineTo(x,y)
      // ctxOtherUser.stroke()
      // ctxNew.strokeStyle = '#A020F0'
      // ctxNew.lineTo(x,y)
      // ctxNew.stroke()
      newCtx.strokeStyle = '#A020F0'
      newCtx.lineTo(x,y)
      newCtx.stroke()
    }else if(!penDown){
      //ctxOtherUser.moveTo(x, y)
      //ctxNew.moveTo(x, y)
      newCtx.moveTo(x, y)
    }
  }
}

socket.on("user", function (user){
  if(localUser === ""){
    localUser = user
    //addUser(user)
  }
})

socket.on("disconnected", function(user){
  const userPen = document.getElementById(`userPen-${user}`);
  penBox.removeChild(userPen)
  userArray = userArray.filter((i) => i !== user)
})


function addUser(user){
  //const userCanvas = document.createElement('canvas'),
  const  userPointer = document.createElement('div'),
    randomColour = colorArray[Math.floor(Math.random()*7)];
  /*userCanvas.setAttribute('id',`userCanvas-${user}`)
  userCanvas.style.width = "1400px";
  userCanvas.style.height = "800px"*/
  userPointer.setAttribute('id',`userPen-${user}`)
  userPointer.classList.add('cursor')
  userPointer.classList.add(randomColour)
  //canvasHolder.appendChild(userCanvas)
  penBox.appendChild(userPointer)
  penBox.childElementCount;
}


/*******************pendrawing***********************/
