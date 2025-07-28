// script.js

// --- 1. DEFINE YOUR PROJECTS ---
// Store all project data in an array of objects.
// Replace these with your own project details.
const projects = [
  {
      year: '2025',
      title: 'Bloom Vase',
      description: 'A celadon vase to welcome the growing season. Made in Seattle, WA.',
      imageUrl: 'https://i.imgur.com/uDb2Gpg.jpeg' // Use a high-quality image link
  },
  {
      year: '2024',
      title: 'Tidal Altar',
      description: 'A stoneware vessel embodying life at the soft seams of the earth. Made in Mendocino, CA.',
      imageUrl: 'https://i.imgur.com/5uHh22N.jpeg'
  },
  {
      year: '2023',
      title: 'Another Project',
      description: 'Description for another project goes here.',
      imageUrl: 'https://via.placeholder.com/1200x800/333/fff?text=Project+3'
  }
  // Add as many projects as you want here
];


// --- 2. GET DOM ELEMENTS ---
const projectsListContainer = document.querySelector('.projects-list');
const projectImage = document.getElementById('project-image');


// --- 3. CREATE AND DISPLAY THE PROJECT LIST ---
projects.forEach((project, index) => {
  // Create the HTML for each project
  const projectEl = document.createElement('div');
  projectEl.classList.add('project');
  projectEl.innerHTML = `
      <div class="project-year">${project.year}</div>
      <div class="project-details">
          <h2>${project.title}</h2>
          <p>${project.description}</p>
      </div>
  `;

  // Add a click event listener to each project
  projectEl.addEventListener('click', () => {
      // Update the main image
      projectImage.src = project.imageUrl;

      // Update the 'active' class on the project list
      // First, remove .active from any other project
      document.querySelectorAll('.project').forEach(p => p.classList.remove('active'));
      // Then, add .active to the one that was just clicked
      projectEl.classList.add('active');
  });

  // Add the project element to the list in the DOM
  projectsListContainer.appendChild(projectEl);
});


// --- 4. CLOCK FUNCTIONALITY ---
function updateClock() {
  const clockElement = document.getElementById('clock');
  if (clockElement) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
}
setInterval(updateClock, 1000);
updateClock();

// Optional: Set the first project as active on page load
if (projects.length > 0) {
  projectImage.src = projects[0].imageUrl;
  document.querySelector('.project').classList.add('active');
}