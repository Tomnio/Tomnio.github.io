document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM LOADED");
    let lastAngle = 0;
    let totalRotation = 0;
    loadImage();
    loadImage();
    loadImage();
    loadImage();
    loadImage();
    document.addEventListener('mousemove', function (event) {
        const image = document.getElementById('jeshua');
        const rect = image.getBoundingClientRect();
        const imageX = rect.left + rect.width / 2;
        const imageY = rect.top + rect.height / 2;

        const angle = Math.atan2(event.clientY - imageY, event.clientX - imageX) * (180 / Math.PI);
        const deltaAngle = angle - lastAngle;

        if (deltaAngle > 180) {
            totalRotation -= 360;
        } else if (deltaAngle < -180) {
            totalRotation += 360;
        }


        totalRotation += deltaAngle;
        image.style.transform = `rotate(${totalRotation - 90}deg)`;

        lastAngle = angle;
    });

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            shoot(totalRotation + 180);
        }
    });

    document.addEventListener("touchstart", shoot(totalRotation + 180));
});


function loadImage() {
    const img = document.createElement('img');
    img.src = 'Ele.png';
    img.alt = '';
    img.className = 'dietörken'

    const container = document.getElementById('image-container');
    container.appendChild(img);
}


function shoot(angle) {
    const gun = document.querySelector('.gun');
    const bullet = document.createElement('h1');
    bullet.className = 'bullet';
    bullet.innerText = "Verpiss Dich"
    document.querySelector('.game').appendChild(bullet);

    const gunRect = gun.getBoundingClientRect();
    const gunCenterX = gunRect.left + gunRect.width / 2;
    const gunCenterY = gunRect.top + gunRect.height / 2;
    
    const transform = window.getComputedStyle(gun).getPropertyValue('transform');
    let angleInRadians = angle;

    if (transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];
        angleInRadians = Math.atan2(b, a);
    }

    const bulletSpeed = 10;
    let bulletX = gunCenterX;
    let bulletY = gunCenterY;
    bullet.style.left = bulletX + 'px';
    bullet.style.top = bulletY + 'px';

    const cosAngle = Math.cos(angleInRadians);
    const sinAngle = Math.sin(angleInRadians);

    function moveBullet() {
        bulletX += bulletSpeed * cosAngle;
        bulletY += bulletSpeed * sinAngle;

        bullet.style.left = bulletX + 'px';
        bullet.style.top = bulletY + 'px';

        if (bulletX < 0 || bulletX > window.innerWidth || bulletY < 0 || bulletY > window.innerHeight) {
            bullet.remove();
            clearInterval(interval);
        }
    }

    const interval = setInterval(moveBullet, 50);
}

