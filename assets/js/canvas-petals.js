// Petals and sparkles canvas particle animation
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'petals-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const petalCount = 35;
    const petals = [];

    const petalColors = [
        'rgba(255, 182, 193, 0.7)',
        'rgba(255, 192, 203, 0.65)',
        'rgba(255, 105, 180, 0.55)',
        'rgba(255, 218, 224, 0.8)',
        'rgba(255, 240, 245, 0.75)'
    ];

    class Petal {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -20;
            this.size = Math.random() * 10 + 8;
            this.speedY = Math.random() * 1.2 + 0.8;
            this.speedX = Math.random() * 1 - 0.5;
            this.angle = Math.random() * 360;
            this.spin = (Math.random() - 0.5) * 2;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.swing = Math.random() * 2 + 1;
            this.swingStep = Math.random() * 0.05 + 0.01;
            this.swingProgress = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.speedY;
            this.swingProgress += this.swingStep;
            this.x += Math.sin(this.swingProgress) * this.swing + this.speedX;
            this.angle += this.spin;

            if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.fillStyle = this.color;

            // Draw petal shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();

            ctx.restore();
        }
    }

    for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
})();
