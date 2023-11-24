document.addEventListener('DOMContentLoaded', function () {
    // Retrieve values from the URL parameters
    const params = new URLSearchParams(window.location.search);
    const values = [
        parseFloat(params.get('value1') || 0),
        parseFloat(params.get('value2') || 0),
        parseFloat(params.get('value3') || 0),
        parseFloat(params.get('value4') || 0)
    ];

    // Generate the horizontal bar graph
    const graphContainer = document.getElementById('graph-container');
    for (let i = 0; i < values.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = values[i] + '%';

        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = `Value ${i + 1}: ${values[i]}`;

        graphContainer.appendChild(label);
        graphContainer.appendChild(bar);
    }
});
