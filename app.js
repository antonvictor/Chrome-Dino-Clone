
const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = .00001

const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

const CACTUS_INTERVAL_MIN = 500
const CACTUS_INTERVAL_MAX = 2000



const worldELem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const startScreenElem = document.querySelector('[data-start-screen]');
const loseScreenElem = document.querySelector('[data-lose-screen]');
const dinoElem = document.querySelector('[data-dino]');



setPixelToWorldScale()
window.addEventListener('resize', setPixelToWorldScale)
document.addEventListener('keydown', handleStart, { once: true })



let lastTime
let score
let isJumping
let dinoFrame
let currentFrameTime
let yVelocity
let nextCactusTime


function update(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const deltaTime = time - lastTime
    updateGround(deltaTime, speedScale)
    updateDino(deltaTime, speedScale)
    updatecactus(deltaTime, speedScale)
    updateSpeedScale(deltaTime)
    updateScore(deltaTime)
    if (checkLoss()) {
        return handleLose()
    } 

    lastTime = time

    window.requestAnimationFrame(update)
}

function checkLoss() {
const dinoRect = getDinoRect()
return getCactusRects().some(rect => isCollision(rect , dinoRect)) 
}

function isCollision(rect1 , rect2) {
return rect1.left < rect2.right && 
rect1.top < rect2.bottom && 
rect1.right > rect2.left && 
rect1.bottom > rect2.top
}

function updateSpeedScale(deltaTime) {
    speedScale += deltaTime * SPEED_SCALE_INCREASE
}


function updateScore(deltaTime) {
    score += deltaTime * .01
    scoreElem.textContent = Math.floor(score)
}


function handleStart() {
    lastTime = null;
    speedScale = 1
    score = 0
    setupGround()
    setupDino()
    setupCactus()
    startScreenElem.classList.add("hide")
    loseScreenElem.classList.add("hide") 
    window.requestAnimationFrame(update)

}


function handleLose() {
    setDinoLose()
    setTimeout(() => {
document.addEventListener('keydown',  handleStart, {once: true})
loseScreenElem.classList.remove("hide")
 },100 )
}


function setPixelToWorldScale() {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH

    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }
    worldELem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldELem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}

//Dino Setup
function setupDino() {
    isJumping = false;
    dinoFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(dinoElem, '--bottom', 0)
    document.removeEventListener('keydown', onJump)
    document.addEventListener('keydown', onJump)
}

function updateDino(deltaTime, speedScale) {
    handleRun(deltaTime, speedScale)
    handleJump(deltaTime)
}

function getDinoRect() {
    return dinoElem.getBoundingClientRect()
    
}

function setDinoLose() { 
    dinoElem.src = 'imgs/dino-lose.png'
}


function handleJump(deltaTime) {
    if (!isJumping) return

    incrementCustomProperty(dinoElem, "--bottom", yVelocity * deltaTime)

    if (getCustomProperty(dinoElem, "--bottom") <= 0) {
        setCustomProperty(dinoElem, "--bottom", 0)
        isJumping = false
    }
    yVelocity -= GRAVITY * deltaTime

}

function handleRun(deltaTime, speedScale) {
    if (isJumping) {
        dinoElem.src = 'imgs/dino-stationary.png'
        return
    }
    if (currentFrameTime >= FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
        dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
        currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += deltaTime * speedScale
}

function onJump(e) {
    if (e.code !== "Space" || isJumping) return

    yVelocity = JUMP_SPEED
    isJumping = true
}


//Cactus Setup
function setupCactus(){
nextCactusTime = CACTUS_INTERVAL_MIN
document.querySelectorAll("[data-cactus]").forEach(cactus=>{
    cactus.remove()
})
}






function updatecactus(deltaTime, speedScale) {
    document.querySelectorAll("[data-cactus]").forEach(cactus => {
    incrementCustomProperty(cactus, "--left" , deltaTime * speedScale * SPEED * -1)
if (getCustomProperty(cactus , "--left") <= -100) {
    cactus.remove()
}

})
 

if (nextCactusTime <= 0) {
createCactus()
nextCactusTime = randomNumberBetween(CACTUS_INTERVAL_MIN , CACTUS_INTERVAL_MAX) / speedScale
}
nextCactusTime -= deltaTime
}


function getCactusRects() {
    return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
        return cactus.getBoundingClientRect()
    })
}



function createCactus() {
    const cactus = document.createElement("img")
    cactus.dataset.cactus = true
    cactus.src = "imgs/cactus.png"
    cactus.classList.add("cactus")
    setCustomProperty(cactus, "--left" , 100)
    worldELem.append(cactus)
}

function randomNumberBetween(min , max) {
   return Math.floor(Math.random() * (max - min + 1)+ min)
}