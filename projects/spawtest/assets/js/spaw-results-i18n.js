(function () {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    let savedLanguage = 'ko';
    try { savedLanguage = localStorage.getItem('spaw-language') || 'ko'; } catch (_) { /* storage may be unavailable */ }
    const language = params.get('lang') === 'en' || (!params.has('lang') && savedLanguage === 'en') ? 'en' : 'ko';

    const englishDimensions = [
        'Avoidant attachment', 'Anxious attachment', 'Integrating', 'Avoiding',
        'Dominating', 'Obliging', 'Compromising', 'Extraversion',
        'Conscientiousness', 'Openness', 'Agreeableness', 'Neuroticism'
    ];

    const spawDescriptions = {
        Stable: '<b>Stable types</b> are distinguished by their ability to build dependable, secure romantic relationships. They are comfortable being close, sharing private thoughts, and relying on their partner when needed. Time apart does not usually upset them, and they do not avoid disagreements simply to prevent hard feelings. During conflict, they try to integrate both partners’ perspectives and reach mutually beneficial decisions. Their openness tends to support constructive conflict resolution and stable long-term relationships.<br>Compared with other types, Stable respondents score significantly higher in integrating conflict, extraversion, conscientiousness, and openness. They represent about 11% of respondents—the smallest non-outlier group—with a nearly even gender ratio.',
        Pleaser: '<b>Pleaser types</b> are distinguished by their tendency to make concessions and meet their partner’s needs and expectations. They are generally comfortable with closeness and do not become very upset by time apart. In conflict, they are the most likely to follow their partner’s suggestions and the least likely to press their own position. They nevertheless seek compromises and collaborate on decisions acceptable to both people. This other-oriented stance does not appear to come primarily from fear of loss or jealousy.<br>Pleasers are comparatively compromising, obliging, and agreeable. They account for about 36% of respondents and, together with Affection Seekers, make up roughly 70% of the sample. Their gender ratio is nearly even.',
        'Affection Seeker': '<b>Affection Seeker types</b> are especially likely to become upset or angry when a partner does not show interest. They seek comfort and security from their partner, are less likely to give in, and are the least likely of the four types to focus on meeting their partner’s expectations. Many strongly assert their own position and place themselves at the center of the relationship. They may be relatively demanding and are more likely to show anxious attachment tendencies.<br>Affection Seekers are comparatively dominant, extraverted, neurotic, and less agreeable. They account for about 34% of respondents and, together with Pleasers, make up roughly 70% of the sample. Women are slightly more represented in this group.',
        Withdrawer: '<b>Withdrawer types</b> are less comfortable with closeness and with sharing private thoughts and feelings. They tend not to disclose everything, yet may still become upset when a partner shows little interest. In conflict, they keep personal thoughts and feelings inside, which makes integrating both partners’ deeper needs more difficult. They often postpone resolution by avoiding conflict and disagreement. Because openness and trust are important to romantic relationships, this pattern can make long-term stability harder to maintain.<br>Withdrawers are comparatively avoidant and high in anxiety and neuroticism, while scoring significantly lower in extraversion, conscientiousness, and openness. They account for about 20% of respondents. Women are slightly more represented in this group.',
        'Inconsistent Respondent': 'The questionnaire contains items used to assess response consistency. Respondents with irregular answers to those items were excluded from the topological analysis, but they remain included in the attachment, conflict-resolution, and Big Five analyses.',
        Outlier: 'People who could not be assigned to one of the SPAW groups were classified as <b>outliers</b>. No shared group pattern was found, but the remaining results can still help describe their individual tendencies.'
    };

    function level(value) {
        const p = Number(value);
        if (p <= 3) return 'Very low';
        if (p <= 20) return 'Low';
        if (p <= 45) return 'Somewhat low';
        if (p <= 55) return 'Average';
        if (p <= 80) return 'Somewhat high';
        if (p <= 97) return 'High';
        return 'Very high';
    }

    function ordinal(value) {
        const n = Number(value);
        const remainder100 = n % 100;
        if (remainder100 >= 11 && remainder100 <= 13) return `${n}th`;
        return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' })[n % 10] || 'th'}`;
    }

    function setGraph(graphId, indices) {
        const graph = document.getElementById(graphId);
        graph.replaceChildren();
        indices.forEach((index) => {
            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = `${englishDimensions[index]}: ${ordinal(values[index])}`;
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.width = `${values[index]}%`;
            graph.append(label, bar);
        });
    }

    function renderEnglish() {
        const name = client.name && client.name !== 'null' ? client.name : 'there';
        document.documentElement.lang = 'en';
        document.title = 'SPAW Romantic Relationship Test Results';
        document.querySelector('#header .logo b').textContent = 'SPAW Romantic Relationship Test Results';

        const navLinks = document.querySelectorAll('#nav .links a');
        ['SPAW Type', 'Attachment Style', 'Conflict Resolution', 'Big Five Traits'].forEach((text, index) => {
            navLinks[index].textContent = text;
        });

        document.getElementById('hello').innerHTML = `<h2>Hello, ${name}!</h2>`;
        document.getElementById('results-introduction').innerHTML = 'Thank you for completing the romantic relationship style test!<br>Using the Mapper algorithm, we examined the topological structure of 95 people’s responses to 71 MIMARA and ROCI-II items. We identified four groups with shared characteristics and call them the <b>SPAW types</b>.';
        document.getElementById('results-sample').textContent = 'The original sample consisted mainly of Korean university students in their late teens through mid-twenties. The male-to-female ratio was 1:1.26, with slightly more women.';
        document.getElementById('savePdf').textContent = 'Save as PDF';

        document.getElementById('spaw-description').innerHTML = `
            <header><h2 id="spaw">SPAW Type: ${client.spaw_Eng}</h2></header>
            <p>${spawDescriptions[client.spaw_Eng] || spawDescriptions.Outlier}</p>
            <main class="image fit"><img src="images/SPAW_Types.png" alt="Diagram of the four SPAW relationship types"></main>
            <p>The figure visualizes the simplicial complex produced by the Mapper topological-data-analysis algorithm. The colors indicate the four identified groups.</p>
            <hr>`;

        document.getElementById('attachment-heading').innerHTML = '<h2 id="mimara">Attachment Style</h2><p>MIMARA response analysis</p>';
        document.getElementById('attachment-introduction').textContent = 'Attachment is a behavioral system through which people seek an attachment figure who provides physical safety and psychological security, then regulate their distance from that person. Romantic partners can become attachment figures for each other. The system is generally quiet in ordinary situations but activates under stress, such as arguments and conflict, helping explain recurring patterns in how partners respond.';
        document.getElementById('mimara-description').innerHTML = `
            <p>When attachment patterns activate, people may change how they disclose themselves or ask a partner for help. They may worry about separation or about not receiving equal affection, seek reassurance, or feel more or less comfortable depending on their partner.</p>
            <h3>Anxious attachment: ${level(values[1])}</h3>
            <p>${name}'s anxious-attachment score is at the ${ordinal(values[1])} percentile. It is higher than the scores of about ${values[1]} out of 100 people, while about ${100 - Number(values[1])} would score higher.</p>
            <p><b>Anxious attachment</b> reflects concern that a partner may leave or may not provide approval. People with high scores often try to reduce emotional distance to relieve anxiety, may view themselves more negatively and their partner more positively, and can experience escalating anxiety during conflict. At very high levels, this pattern may involve preoccupation, intense attraction, and jealousy.</p>
            <h3>Avoidant attachment: ${level(values[0])}</h3>
            <p>${name}'s avoidant-attachment score is at the ${ordinal(values[0])} percentile. It is higher than the scores of about ${values[0]} out of 100 people, while about ${100 - Number(values[0])} would score higher.</p>
            <p><b>Avoidant attachment</b> reflects discomfort with closeness and dependence. People with high scores may view their partner more negatively and themselves more positively, believe emotional intimacy is unavailable or undesirable, and create distance to avoid difficult thoughts and feelings. Despite that strategy, they may still experience substantial negative emotion. People with low scores tend to be comfortable with mutual dependence and intimacy.</p>
            <p>Lower anxious and avoidant scores are generally associated with greater relationship satisfaction. When both are low, the pattern is called <b>secure attachment</b>: greater trust, comfort relying on a partner, a sense that the partner is predictable, and more ease accepting imperfections.</p><hr>`;

        document.getElementById('conflict-heading').innerHTML = '<h2 id="roci-ii">Conflict-Resolution Style</h2><p>ROCI-II response analysis</p>';
        document.getElementById('conflict-introduction').textContent = 'Conflict resolution is unavoidable in romantic relationships and is strongly associated with long-term satisfaction. Cooperative communication during conflict can help partners understand each other; poor conflict resolution is also one of the most common concerns in couples counseling. Constructive resolution is therefore an important part of a successful relationship.';
        document.getElementById('roci-ii-1').innerHTML = `<p>${name}'s conflict-resolution results are shown below.</p>`;
        document.getElementById('roci-ii-2').innerHTML = `
            <p>This analysis assumes two motives in conflict: pursuing one’s own goals (self-interest) and preserving the relationship (concern for the other person). Their relative strengths produce five styles.</p>
            <h3>Compromising: ${level(values[6])}</h3>
            <p><b>Compromising</b> seeks a middle ground in which both people give up something. Both self-interest and concern for the other person are moderate, and negotiation relies on give and take.</p>
            <h3>Obliging: ${level(values[5])}</h3>
            <p><b>Obliging</b> resolves conflict by accommodating a partner’s requests and making concessions. Self-interest is low and concern for the other person is high, so this style emphasizes understanding and meeting the partner’s wishes.</p>
            <h3>Dominating: ${level(values[4])}</h3>
            <p><b>Dominating</b> presses one’s own solution and may use power or authority to obtain a favorable decision. Self-interest is high and concern for the other person is low; this style argues firmly for its position.</p>
            <h3>Avoiding: ${level(values[3])}</h3>
            <p><b>Avoiding</b> holds back thoughts to prevent discomfort or hard feelings. Both motives are low, so disagreements and conversations about differences may be postponed or contact may occasionally be avoided.</p>
            <h3>Integrating: ${level(values[2])}</h3>
            <p><b>Integrating</b> treats both positions as important. It uses honest communication, listening, empathy, and collaboration to find shared ground and create a win–win solution that supports growth and mutual understanding.</p><hr>`;

        document.getElementById('bigfive-heading').innerHTML = '<h2 id="bigfive">Big Five Traits</h2><p>Big Five traits in romantic-relationship situations</p>';
        document.getElementById('bigfive-introduction').textContent = 'We regrouped questionnaire items to create composite scores describing Big Five characteristics in romantic relationships. The regrouping was evaluated with Cronbach’s alpha. These scores are derived differently from a formal, standalone Big Five personality inventory.';
        document.getElementById('big5-1').innerHTML = `<p>${name}'s Big Five results are shown below.</p>`;
        document.getElementById('big5-2').innerHTML = `
            <h3>Neuroticism: ${level(values[11])}</h3>
            <p><b>Neuroticism</b> describes sensitivity to distress, sadness, anger, fear, and anxiety, including withdrawal and frustration during relationship conflict. High scorers may worry excessively, avoid risks, and pull back from unfamiliar or complicated situations. Low scorers tend to worry less, be less sensitive to rejection, and recover more quickly from fear or anxiety.</p>
            <h3>Agreeableness: ${level(values[10])}</h3>
            <p><b>Agreeableness</b> reflects consideration of a partner’s needs and feelings and a tendency to act empathetically. High scorers are generally kind, cooperative, trusting, and accommodating, though they may hide their own thoughts to avoid conflict. Low scorers may be more dominant, competitive, strict, and direct, making their position especially clear.</p>
            <h3>Openness: ${level(values[9])}</h3>
            <p><b>Openness</b> reflects candid communication and creative exploration of new ways to solve conflict. High scorers are curious, exploratory, interested in learning, and willing to try new things with a partner. Low scorers tend to prefer predictable routines, continuity, and stable relationships with less change.</p>
            <h3>Conscientiousness: ${level(values[8])}</h3>
            <p><b>Conscientiousness</b> reflects investing time and effort in the relationship and trying to be dependable. High scorers are responsible, focused, hardworking, and attentive to plans and procedures, though they may judge failures harshly. Low scorers may postpone communication or conflict resolution, break commitments, or become distracted more easily.</p>
            <h3>Extraversion: ${level(values[7])}</h3>
            <p><b>Extraversion</b> reflects a tendency to communicate and assert one’s thoughts, along with experiencing positive emotions around other people. High scorers are often optimistic, enthusiastic, talkative, persuasive, and comfortable sharing ideas. Low scorers may be more future-focused, work well alone, and be less easily distracted by social opportunities.</p>`;

        document.getElementById('methods-heading').textContent = 'Summary of the Analysis';
        document.getElementById('methods-copy').textContent = 'The test used topological data analysis and statistical methods. Mapper used PCA with two components as its filter and DBSCAN for clustering. Statistical procedures included the Shapiro normality test, a skewness test, Cronbach’s alpha for questionnaire reliability, tests of equal variance, and comparisons of group means using Bartlett’s test and Student/Welch t-tests.';
        document.getElementById('references-heading').textContent = 'References';
        document.getElementById('research-footer-heading').textContent = '2023 Summer Student-Directed Research';

        setGraph('mimara-graph', [1, 0]);
        setGraph('roci-ii-graph', [6, 5, 4, 3, 2]);
        setGraph('big5-graph', [11, 10, 9, 8, 7]);
    }

    try { localStorage.setItem('spaw-language', language); } catch (_) { /* storage may be unavailable */ }

    if (language === 'en') renderEnglish();
}());
