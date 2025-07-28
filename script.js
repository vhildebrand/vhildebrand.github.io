// script.js

// Real-time Clock
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours} : ${minutes} : ${seconds}`;
    }
}

setInterval(updateClock, 1000);
updateClock(); // initial call

// More/Less toggle
document.querySelectorAll('.toggle-more').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const moreContent = this.previousElementSibling;
        if (moreContent.style.display === 'none' || moreContent.style.display === '') {
            moreContent.style.display = 'block';
            this.textContent = 'Less';
        } else {
            moreContent.style.display = 'none';
            this.textContent = 'More';
        }
    });
});