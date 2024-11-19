// Select the header and expand button
const header = document.getElementById('header');
const expandButton = document.getElementById('expand-button');

// Toggle the 'expanded' class when the button is clicked
expandButton.addEventListener('click', () => {
    header.classList.toggle('expanded');
});