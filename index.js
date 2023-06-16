const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

// Takes the data from tiled and creates arrays which maps out the collision blocks
const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}


const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
  })
})

// Collision for Platforms
const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            // console.log('new block')
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                    x: x * 16,
                    y: y * 16,
                    },
                    height: 4,
                })
            )
        }
    })

})



const gravity = 0.08


// Creates new player object
const player = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: './img/warrior/Idle.png',
  frameRate: 8,
  animations: {
    Idle: {
        imageSrc: './img/warrior/Idle.png',
        frameRate: 8,
        frameBuffer: 12,
    },
    IdleLeft: {
        imageSrc: './img/warrior/IdleLeft.png',
        frameRate: 8,
        frameBuffer: 12,
    },
    Run: {
        imageSrc: './img/warrior/Run.png',
        frameRate: 8,
        frameBuffer: 7,
    },
    RunLeft: {
        imageSrc: './img/warrior/RunLeft.png',
        frameRate: 8,
        frameBuffer: 7,
    },
    Jump: {
        imageSrc: './img/warrior/Jump.png',
        frameRate: 2,
        frameBuffer: 3,
    },
    JumpLeft: {
        imageSrc: './img/warrior/JumpLeft.png',
        frameRate: 2,
        frameBuffer: 3,
    },
    Fall: {
        imageSrc: './img/warrior/Fall.png',
        frameRate: 2,
        frameBuffer: 3,
    },
    FallLeft: {
        imageSrc: './img/warrior/FallLeft.png',
        frameRate: 2,
        frameBuffer: 3,
    },
    
  },
})



// let y = 100

// object constant all the keys to be used
const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
}


const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'
})


const backgroundImageHeight = 432

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}

// ANIMATION loop
function animate() {
    window.requestAnimationFrame(animate)

    // Refresh canvas
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height )
    
    // Scales the image to the correct size
    c.save()
    c.scale(4, 4)
    c.translate(camera.position.x, camera.position.y)
    // Draws Background Image
    background.update()
    // Render out collision blocks
    // collisionBlocks.forEach(CollisionBlock => {
    //     CollisionBlock.update()
    // })
    // // Render out Platform collision blocks
    // platformCollisionBlocks.forEach(block => {
    //     block.update()
    // })



    player.checkForHorizontalCanvasCollision()
    

    // Updates player
    player.update()
    // Resets player to movement to 0 when not pressing a key
    player.velocity.x = 0
    if (keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 1.5
        player.lastDirection = 'right'
        player.shouldPanCameraToTheLeft({ canvas, camera })
    } 
    else if (keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -1.5
        player.lastDirection = 'left'
        player.shouldPanCameraToTheRight({ canvas, camera })
    }
    else if (player.velocity.y === 0) {
        if (player.lastDirection === 'right') player.switchSprite('Idle')
        else player.switchSprite('IdleLeft')
    }
    if (player.velocity.y < 0) {
        player.shouldPanCameraDown({ canvas, camera })
        if (player.lastDirection === 'right') player.switchSprite('Jump')
        else player.switchSprite('JumpLeft')
    }
    else if (player.velocity.y > 0) {
        player.shouldPanCameraUp({ canvas, camera })
        if (player.lastDirection === 'right') player.switchSprite('Fall')
        else player.switchSprite('FallLeft')
    }



    c.restore()

}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true  
            break
        case 'a':
            keys.a.pressed = true   
            break
        case 'w':
            player.velocity.y = -3.5
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false  
            break
        case 'a':
            keys.a.pressed = false   
            break
    }
})

