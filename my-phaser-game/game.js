const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

const enemyAssets = ['enemy1', 'enemy2', 'enemy3']; // Replace with your actual enemy asset keys

function preload() {
    // Load your assets here
    this.load.image('background', 'assets/Moosach.png');
    this.load.image('tower', 'assets/JoshuaGesicht.png');
    this.load.image('enemy1', 'assets/Ele1.png');
    this.load.image('enemy2', 'assets/Ele2.png');
    this.load.image('enemy3', 'assets/Ele3.png');
    this.load.image('bullet', 'assets/Stein.png');
}

let lastFired = 0;
const fireRate = 500; // Cooldown period in milliseconds (e.g., 500 ms)

const paths = [
    // From top-left to bottom-left
    [
        { x: 0, y: 50 },
        { x: window.innerHeight/2 + 300, y: 50 },
        { x: window.innerHeight/2 + 300, y: 500 },
    ],
    [
        { x: window.innerWidth, y: 50 },
        { x: window.innerHeight/2 + 300, y: 50 },
        { x: window.innerHeight/2 + 300, y: 500 },
    ],
];




function create() {
    // Add background
    this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background').setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Create a group for towers
    this.towers = this.physics.add.group();

    // Create a group for enemies
    this.enemies = this.physics.add.group();

    // Create a group for bullets
    this.bullets = this.physics.add.group();

    // Example of placing a tower
    const tower = this.towers.create(900, 500, 'tower');

    // Spawn enemies at random intervals
    this.time.addEvent({
        delay: 2000, // Spawn an enemy every 2000 ms (2 seconds)
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    // Collision detection between bullets and enemies
    this.physics.add.overlap(this.bullets, this.enemies, hitEnemy, null, this);
}

function spawnEnemy() {
    // Select a random path
    const randomPath = Phaser.Math.RND.pick(paths);

    // Select a random enemy asset
    const randomEnemyAsset = Phaser.Math.RND.pick(enemyAssets);

    // Create the enemy at the start of the selected path
    const enemy = this.enemies.create(randomPath[0].x, randomPath[0].y, randomEnemyAsset);
    enemy.setScale(0.8); // Scale the enemy to 120% of its original size

    // Function to create subsequent tweens
    const createTween = (enemy, path, index) => {
        if (index < path.length) {
            this.tweens.add({
                targets: enemy,
                x: path[index].x,
                y: path[index].y,
                ease: 'Linear',
                duration: 1000, // Adjust the duration for each segment as needed
                onComplete: () => {
                    createTween(enemy, path, index + 1);
                },
                onCompleteScope: this
            });
        } else {
            enemy.destroy(); // Destroy the enemy when it reaches the goal
        }
    };

    // Start the chain of tweens
    createTween(enemy, randomPath, 1);
}


function update(time, delta) {
    // Get the position of the mouse
    const pointer = this.input.activePointer;
    const mouseX = pointer.x;
    const mouseY = pointer.y;

    // Check if the spacebar is pressed or left mouse button is clicked, and if cooldown has elapsed
    if ((Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE')) || pointer.isDown) && time > lastFired) {
        // Update the last fired time
        lastFired = time + fireRate;

        // Example of shooting a bullet from the position of the tower
        const bullet = this.bullets.create(900, 500, 'bullet');
        bullet.setScale(0.7); // Scale the bullet to 70% of its original size

        // Adjust the hitbox size of the bullet
        bullet.body.setSize(bullet.width * 0.5, bullet.height * 0.5, true);

        // Calculate the direction vector from the bullet to the cursor
        const direction = new Phaser.Math.Vector2(mouseX - bullet.x, mouseY - bullet.y).normalize();

        // Set the bullet velocity in the direction of the cursor
        const speed = 300; // Set the speed of the bullet
        bullet.setVelocity(direction.x * speed, direction.y * speed);
    }
    
}

function hitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
}

// Resize handler
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
    game.scene.scenes.forEach(scene => {
        scene.cameras.main.setBounds(0, 0, window.innerWidth, window.innerHeight);
        scene.children.list.forEach(child => {
            if (child.texture && child.texture.key === 'background') {
                child.setDisplaySize(window.innerWidth, window.innerHeight);
                child.setPosition(window.innerWidth / 2, window.innerHeight / 2);
            }
        });
    });
});
