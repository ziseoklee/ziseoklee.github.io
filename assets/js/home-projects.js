(function () {
	'use strict';

	const homeGrid = document.getElementById('project-card-grid');
	const container = homeGrid || document.getElementById('card-container');
	if (!container) return;

	function createCard(project) {
		const card = document.createElement('a');
		card.className = 'p-card';
		card.href = project.url;
		card.rel = 'noopener noreferrer';

		const imageWrapper = document.createElement('div');
		imageWrapper.className = 'p-card-image-wrapper';
		if (project.image) {
			const image = document.createElement('img');
			image.className = 'p-card-image';
			image.src = project.image;
			image.alt = project.title;
			image.addEventListener('error', () => image.remove());
			imageWrapper.appendChild(image);
		}

		const body = document.createElement('div');
		body.className = 'p-card-content';
		const heading = document.createElement(homeGrid ? 'h3' : 'h2');
		heading.className = 'p-card-title';
		heading.textContent = project.title;
		const summary = document.createElement('p');
		summary.className = 'p-card-desc';
		summary.textContent = project.description;
		body.append(heading, summary);
		card.append(imageWrapper, body);
		return card;
	}

	async function loadProjects() {
		try {
			const response = await fetch('/myprojects.json');
			if (!response.ok) throw new Error('Could not load project data');
			const projects = await response.json();
			container.replaceChildren(...projects.map(createCard));
		} catch (error) {
			console.error('Error loading projects:', error);
			container.textContent = 'Projects could not be loaded right now.';
		}
	}

	loadProjects();
})();
