const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const downloadBtn = document.getElementById('downloadBtn');

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB. Please choose a smaller file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            canvas.width = 720;
            canvas.height = 1080;
            ctx.drawImage(img, 0, 0, 720, 1080);

            showPreview(0.75); // Default preview quality
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
});

function showPreview(quality) {
    const dataURL = canvas.toDataURL('image/jpeg', quality);
    previewImage.src = dataURL;
    previewSection.style.display = 'block';

    // Download button functionality
    downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'optimized-image.jpg';
        a.click();
    };
}

document.querySelectorAll('.quality-options button').forEach((button) => {
    button.addEventListener('click', () => {
        const quality = parseFloat(button.getAttribute('data-quality'));
        showPreview(quality);
    });
});
