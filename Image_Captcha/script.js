// Image data for different object categories (cars, trees, houses, etc.)
const imagesData = {
    car: [
        { src: "cars1.jpg", alt: "Car", correct: true },
        { src: "cars.jpg", alt: "Car", correct: true },
        { src: "sea.jpg", alt: "Car", correct: false },
        { src: "boat.jpg", alt: "Boat", correct: false },
        { src: "house1.jpg", alt: "House", correct: false },
        { src: "house2.jpg", alt: "House", correct: false },
        { src: "sea.jpg", alt: "Sea", correct: false }
    ],
    tree: [
        { src: "tree1.jpg", alt: "Tree", correct: true },
        { src: "tree_5.jpg", alt: "Tree", correct: true },
        { src: "cars.jpg", alt: "Car", correct: false },
        { src: "house1.jpg", alt: "House", correct: false },
        { src: "house2.jpg", alt: "House", correct: false },
        { src: "boat.jpg", alt: "Boat", correct: false },
        { src: "sea.jpg", alt: "sea", correct: false }
    ],
    house: [
        { src: "house1.jpg", alt: "House", correct: true },
        { src: "house2.jpg", alt: "House", correct: true },
        { src: "tree1.jpg", alt: "Tree", correct: false },
        { src: "boat.jpg", alt: "Boat", correct: false },
        { src: "cars.jpg", alt: "Car", correct: false },
        { src: "cars1.jpg", alt: "Car", correct: false }
    ]
};

let currentCategory = 'car'; // Initial category (could be dynamic later)

// Function to shuffle and display images
function shuffleImages() {
    const currentImages = imagesData[currentCategory];
    const shuffledImages = [...currentImages].sort(() => Math.random() - 0.5);

    const imageGrid = document.getElementById('image-grid');
    imageGrid.innerHTML = ''; // Clear the grid before adding new images

    shuffledImages.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        imgElement.classList.add('captcha-image');
        imgElement.dataset.correct = image.correct;
        imageGrid.appendChild(imgElement);
    });
}

// Function to change the question and the object category
function changeQuestion() {
    const question = document.getElementById('captcha-question');
    const categoryKeys = Object.keys(imagesData);
    const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    currentCategory = randomCategory;

    if (randomCategory === 'car') {
        question.textContent = "Select all images with a car";
    } else if (randomCategory === 'tree') {
        question.textContent = "Select all images with a tree";
    } else if (randomCategory === 'house') {
        question.textContent = "Select all images with a house";
    }
}

// Handle image selection
document.getElementById('image-grid').addEventListener('click', (event) => {
    if (event.target.classList.contains('captcha-image')) {
        event.target.classList.toggle('selected');
    }
});

// Handle CAPTCHA validation
document.getElementById('submit').addEventListener('click', () => {
    const selectedImages = document.querySelectorAll('.captcha-image.selected');
    let correctCount = 0;

    selectedImages.forEach(image => {
        if (image.dataset.correct === "true") {
            image.classList.add('correct');  // Add green border for correct selection
            correctCount++;
        } else {
            image.classList.add('incorrect'); // Add red border for incorrect selection
        }
    });

    const totalCorrect = document.querySelectorAll('.captcha-image[data-correct="true"]').length;

    if (correctCount === totalCorrect) {
        document.getElementById('result').innerText = "CAPTCHA passed!";
        document.getElementById('result').style.color = "green";
    } else {
        document.getElementById('result').innerText = "CAPTCHA failed. Please try again.";
        document.getElementById('result').style.color = "red";
        shuffleImages(); // Shuffle images on failure
        changeQuestion(); // Change the question after failure
    }
});

// Initialize CAPTCHA with shuffled images and question
shuffleImages();
