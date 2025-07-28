// main.js
const buttons = document.querySelectorAll('.filter button');
const projects = document.querySelectorAll('.project');

buttons.forEach(btn => btn.addEventListener('click', () => {
  buttons.forEach(b => b.classList.toggle('active', b===btn));
  const tag = btn.dataset.tag;
  projects.forEach(p => {
    const keep = tag === '*' || p.dataset.tags.includes(tag);
    p.classList.toggle('hidden', !keep);
  });
}));
