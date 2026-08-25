(function () {
    'use strict';

    const dimensionNames = [
        'Avoidant attachment', 'Anxious attachment', 'Integrating', 'Avoiding',
        'Dominating', 'Obliging', 'Compromising', 'Extraversion',
        'Conscientiousness', 'Openness', 'Agreeableness', 'Neuroticism'
    ];

    emailjs.init('bulQNOqh9_sP89bK1');

    window.sendSpawSubmission = function (client, responses, percentiles, language) {
        const submittedAt = new Date().toISOString();
        const responseLines = responses.map((value, index) => `Q${index}=${value}`).join(', ');
        const percentileLines = dimensionNames.map((name, index) => `${name}=${percentiles[index]}`).join(', ');
        const respondentName = client.name.trim() || 'Anonymous SPAW respondent';
        const respondentEmail = client.email.trim();
        const message = [
            'SPAW TEST DATA SUBMISSION',
            `Submitted (UTC): ${submittedAt}`,
            'Data-sharing consent: Yes',
            `Interface language: ${language}`,
            '',
            'RESPONDENT DATA',
            `Name: ${client.name.trim() || 'Not provided'}`,
            `Gender: ${client.sex || 'unselected'}`,
            `Age: ${client.age || 'Not provided'}`,
            `Email: ${respondentEmail || 'Not provided'}`,
            '',
            'RAW NUMERIC RESPONSES (1–7)',
            responseLines,
            '',
            'CALCULATED RESULTS',
            `SPAW type: ${client.spaw[1]} (${client.spaw[0]})`,
            `Percentiles: ${percentileLines}`
        ].join('\n');

        return emailjs.send('service_pxb8clr', 'template_f96h3dd', {
            from_name: respondentName,
            from_email: respondentEmail || 'noreply@ziseoklee.github.io',
            subject: `SPAW response — ${respondentName} — ${submittedAt}`,
            message: message
        });
    };
}());
