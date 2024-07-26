

const SPEED = 0.05
const groundElem = document.querySelectorAll('[data-ground]')


function setupGround() {
    setCustomProperty(groundElem[0], "--left" , 0 )
    setCustomProperty(groundElem[1], "--left" , 300 )
}


function updateGround(deltaTime , speedScale) {
groundElem.forEach(ground => {
 incrementCustomProperty( ground, "--left" , deltaTime * speedScale * SPEED * -1 );
 if (getCustomProperty(ground, "--left" ) <= -300) {
  incrementCustomProperty( ground, "--left", 600 );  
 }
})
}