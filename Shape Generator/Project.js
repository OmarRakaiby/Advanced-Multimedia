const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const threeContainer = document.getElementById("threejs-container");
let is3D = false;
let renderer, scene, camera;

function toggleDimension() {
    const dimension = document.getElementById("dimension").value;
    is3D = dimension === "3d";

    if (is3D) {
        canvas.style.display = "none";
        threeContainer.style.display = "block";
        init3D(); 
    } else {
        canvas.style.display = "block";
        threeContainer.style.display = "none";
        if (renderer) {
            renderer.dispose();
            renderer = null; 
        }
    }
}

function toggleCoordinatesInput() {
    const shape = document.getElementById("shape").value;
    const coordinatesInput = document.getElementById("coordinates-input");
    coordinatesInput.style.display = shape === "custom" ? "block" : "none";
}

function drawShape() {
    const shape = document.getElementById("shape").value;
    const color = document.getElementById("color").value;

    if (is3D) {
        draw3DShape(shape, color);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.fillStyle = color;
        if (shape === "custom") {
            drawCustomShape();
        } else {
            switch (shape) {
                case "circle": drawCircle(); break;
                case "rectangle": drawRectangle(); break;
                case "square": drawSquare(); break;
                case "triangle": drawTriangle(); break;
                case "ellipse": drawEllipse(); break;
                case "star": drawStar(); break;
                default: console.log("Shape not recognized."); break;
            }
        }
    }
}

function drawCircle() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawRectangle() {
    const x = (canvas.width - 100) / 2;
    const y = (canvas.height - 50) / 2;
    ctx.fillRect(x, y, 100, 50);
}

function drawSquare() {
    const size = 100;
    const x = (canvas.width - size) / 2;
    const y = (canvas.height - size) / 2;
    ctx.fillRect(x, y, size, size);
}

function drawTriangle() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 80;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size / 2);
    ctx.lineTo(centerX - size / 2, centerY + size / 2);
    ctx.lineTo(centerX + size / 2, centerY + size / 2);
    ctx.closePath();
    ctx.fill();
}

function drawEllipse() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radiusX = 75;
    const radiusY = 50;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawStar() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const spikes = 5;
    const outerRadius = 70;
    const innerRadius = 30;
    ctx.beginPath();
    for (let i = 0; i < spikes; i++) {
        const angle = (i * (Math.PI / spikes)) + (Math.PI / 2);
        ctx.lineTo(centerX + Math.cos(angle) * outerRadius, centerY - Math.sin(angle) * outerRadius);
        ctx.lineTo(centerX + Math.cos(angle + Math.PI / spikes) * innerRadius, centerY - Math.sin(angle + Math.PI / spikes) * innerRadius);
    }
    ctx.closePath();
    ctx.fill();
}

function drawCustomShape() {
    const coordinatesInput = document.getElementById("coordinates").value;
    const points = parseCoordinates(coordinatesInput);

    if (points.length < 2) {
        alert("Please enter at least two points.");
        return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    points.slice(1).forEach(point => {
        ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();
    ctx.fill();
}

function parseCoordinates(input) {
    const points = [];
    const regex = /\((\d+),\s*(\d+)\)/g;
    let match;

    while ((match = regex.exec(input)) !== null) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        points.push({ x, y });
    }

    return points;
}

const pickr = Pickr.create({
    el: '#color-picker',
    theme: 'classic',
    default: '#ff0000',
    swatches: [
        '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
        '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
    ],
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            input: true,
            clear: true,
            save: true,
        },
    },
});
pickr.on('change', (color) => {
    document.getElementById('color').value = color.toHEXA().toString();
});
function init3D() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
    threeContainer.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, threeContainer.clientWidth / threeContainer.clientHeight, 0.1, 1000);
    camera.position.z = 200;

    const light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 0, 200);
    scene.add(light);

    renderer.render(scene, camera);
}

// Draw 3D Shapes
function draw3DShape(shape, color) {
    scene.clear();
    const material = new THREE.MeshBasicMaterial({ color });

    let geometry;
    switch (shape) {
        case "circle": geometry = new THREE.CircleGeometry(50, 32); break;
        case "rectangle": geometry = new THREE.BoxGeometry(100, 50, 10); break;
        case "square": geometry = new THREE.BoxGeometry(50, 50, 10); break;
        case "triangle":
            geometry = new THREE.ConeGeometry(50, 100, 3);
            break;
        case "ellipse":
            geometry = new THREE.SphereGeometry(50, 32, 32);
            break;
        case "star": 
            console.log("3D star is complex and might need a custom approach."); 
            return;
        default: return;
    }

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer.render(scene, camera);
}
