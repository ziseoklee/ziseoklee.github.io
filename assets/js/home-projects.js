(function () {
	'use strict';

	const container = document.getElementById('project-card-grid');

	if (!container) return;

	const jsonPath = 'myprojects.json';

	async function fetchLinkData(url) {
		const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`;

		try {
			const response = await fetch(apiUrl);
			if (!response.ok) throw new Error('Microlink request failed');

			const result = await response.json();
			return result.status === 'success' ? result.data : null;
		} catch (error) {
			console.error(`Error fetching metadata for ${url}:`, error);
			return null;
		}
	}

	function createCard(data, project) {
		const entry = typeof project === 'string' ? { url: project } : project;
		const metadata = data || { title: 'Project', description: '' };
		const title = entry.title || metadata.title || 'Untitled Project';
		const description = entry.description || metadata.description || 'No description available.';
		const image = entry.image || (metadata.image && metadata.image.url) || '';
		const card = document.createElement('a');

		card.className = 'p-card';
		card.href = entry.url;
		card.target = '_blank';
		card.rel = 'noopener noreferrer';

		const imageWrapper = document.createElement('div');
		imageWrapper.className = 'p-card-image-wrapper';

		if (image) {
			const imageElement = document.createElement('img');
			imageElement.className = 'p-card-image';
			imageElement.src = image;
			imageElement.alt = title;
			imageElement.addEventListener('error', () => imageElement.remove());
			imageWrapper.appendChild(imageElement);
		}

		card.appendChild(imageWrapper);

		const body = document.createElement('div');
		body.className = 'p-card-content';

		const heading = document.createElement('h3');
		heading.className = 'p-card-title';
		heading.textContent = title;

		const summary = document.createElement('p');
		summary.className = 'p-card-desc';
		summary.textContent = description;

		body.appendChild(heading);
		body.appendChild(summary);
		card.appendChild(body);

		return card;
	}

	async function loadProjects() {
		try {
			const response = await fetch(jsonPath);
			if (!response.ok) throw new Error('Could not load project data');

			const projects = await response.json();
			container.replaceChildren();

			projects.forEach(() => {
				const skeleton = document.createElement('div');
				skeleton.className = 'p-card p-skeleton';
				container.appendChild(skeleton);
			});

			const cards = await Promise.all(
				projects.map(async (project) => {
					const url = typeof project === 'string' ? project : project.url;
					const metadata = await fetchLinkData(url);
					return createCard(metadata, project);
				})
			);

			container.replaceChildren(...cards);
		} catch (error) {
			console.error('Error loading projects:', error);
			container.textContent = 'Projects could not be loaded right now.';
		}
	}

	loadProjects();
})();
