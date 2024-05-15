// Animated scrolling for Meet Our Team button
document.addEventListener('DOMContentLoaded', () => {
    const ctaBtn = document.querySelector('.cta-btn');
    ctaBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const teamSection = document.getElementById('team');
        teamSection.scrollIntoView({ behavior: 'smooth' });
    });
});
