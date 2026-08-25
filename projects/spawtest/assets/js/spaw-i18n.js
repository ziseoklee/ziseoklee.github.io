(function () {
    'use strict';

    const englishQuestions = [
        'I seek many things from my partner, including comfort and a sense of security.',
        'I generally try to satisfy my partner\'s needs and wishes.',
        'I prefer not to show my partner how I feel deep down.',
        'I often go along with my partner\'s suggestions.',
        'I get nervous when my partner gets too close to me.',
        'I am firm in pursuing my side of an issue during a conflict.',
        'Sometimes I pressure my partner to show more feeling and commitment toward me.',
        'I try to integrate our ideas to make decisions jointly with my partner.',
        'I get annoyed when my partner is not there when I need them.',
        'I use give and take so that a compromise can be reached.',
        'I am uncomfortable opening up to my partner.',
        'I generally propose a middle ground for breaking deadlocks.',
        'My desire to be very close sometimes scares people away.',
        'I try to avoid getting too close to my partner.',
        'I try to avoid disagreements with my partner.',
        'I negotiate with my partner so that a compromise can be reached.',
        'I generally insist on my solution to a problem.',
        'I usually make concessions to my partner.',
        'I accept that I may gain some things and lose others.',
        'I tell my partner everything.',
        'I often want to merge completely with my partner, and this sometimes scares them away.',
        'I generally avoid discussing differences with my partner.',
        'I find it difficult to depend on my partner.',
        'I do not often worry about being abandoned.',
        'I give in order to receive.',
        'I get angry when my partner spends time away from me.',
        'I try to set aside our differences in order to reach a compromise with my partner.',
        'I exchange accurate information with my partner so we can solve a problem together.',
        'I often feel that my partner does not want to be as close as I would like.',
        'I try to work with my partner to properly understand a conflict between us.',
        'I feel somewhat anxious and insecure when I am not in a relationship.',
        'When my partner starts getting close to me, I find myself pulling away.',
        'I argue my case with my partner to show the merits of my position.',
        'I bring all concerns into the open so an issue can be resolved in the best possible way.',
        'I do not mind asking my partner for comfort, advice, or help.',
        'I am comfortable sharing my private thoughts and feelings with my partner.',
        'I work with my partner to find solutions that meet our expectations.',
        'I need a lot of reassurance that my partner loves me.',
        'I try to keep disagreements with my partner to myself in order to avoid hard feelings.',
        'I feel uncomfortable when my partner wants to be very close.',
        'I worry that I will be abandoned.',
        'I generally try to satisfy my partner.',
        'I am comfortable depending on my partner.',
        'I use my authority to make a decision in my favor.',
        'I prefer not to be too close to my partner.',
        'It helps to turn to my partner when I need something.',
        'I want to get close to my partner, but I keep pulling back.',
        'I try to find a middle ground with my partner.',
        'I sometimes use my power to win a conflict.',
        'When my partner does not approve of me, I feel bad about myself.',
        'I generally avoid arguments with my partner.',
        'I try to avoid unpleasant exchanges with my partner.',
        'I generally give in to my partner\'s wishes.',
        'I worry about being alone.',
        'I use my influence to get my ideas accepted.',
        'I worry that my partner will not care about me as much as I care about them.',
        'I avoid meeting with my partner.',
        'I worry a great deal about losing my partner.',
        'I usually discuss my problems and concerns with my partner.',
        'I avoid bringing up conflicts with my partner.',
        'I examine problems with my partner to find solutions acceptable to both of us.',
        'I try to meet my partner\'s expectations.',
        'I am very comfortable being close to my partner.',
        'I worry a lot about my relationship.',
        'Sometimes I help my partner make a decision in their favor.',
        'I get upset or angry when my partner does not show interest in me.',
        'I use my expertise to make a decision in my favor.',
        'I often wish that my partner\'s feelings for me were as strong as my feelings for them.',
        'I get annoyed when my partner is not around as much as I would like.',
        'I find it relatively easy to get close to my partner.',
        'I collaborate with my partner to make decisions that we can both accept.'
    ];

    const copy = {
        ko: {
            title: 'SPAW 연인관계 검사',
            heading: 'SPAW 연인관계 검사',
            infoHeading: '기본 정보',
            infoCopy: '기본 정보 입력은 선택 사항입니다. 입력한 정보와 71개 응답은 검사 결과와 연구 데이터 수집에 사용됩니다.<br>',
            testHeading: '연인관계 검사',
            testCopy: '아래 질문들은 연인관계 유형을 알아보기 위한 검사 문항입니다.<br>현재 연인관계를 기준으로 본인과 일치하는 정도(<b><em>7 = 매우 일치함, 1 = 매우 불일치함</em></b>)를 선택하면 됩니다!',
            name: '이름', email: '이메일 주소', age: '나이', sex: '성별', male: '남성', female: '여성',
            consent: '동의하면 입력한 정보와 응답 데이터가 수집되는 것에 동의합니다.',
            submit: '검사 완료',
            introTitle: 'SPAW 연인관계 검사',
            introSummary: 'SPAW 검사는 이지석과 정성균이 MIMARA 및 ROCI-II 검사를 위상 데이터 분석으로 재해석해 개발한 연인관계 유형 검사입니다.',
            introResultTitle: '검사 결과',
            introResultCopy: '연인관계를 안정형, 상대맞춤형, 애정추구형, 철회형의 네 SPAW 유형으로 분류하고 애착 유형, 갈등 해결 유형, Big Five 성격요소에 대한 상세 결과를 제공합니다.',
            introTimeTitle: '진행 방법',
			introTimeCopy: '71개 문항에 1점부터 7점까지 응답합니다. 진행률은 자동으로 표시되며, 한국어와 영어 사이를 전환해도 선택한 답변은 유지됩니다.',
			start: '검사 시작',
			about: '검사 소개',
			researchFooterHeading: '2023년 하계 학생자율연구'
        },
        en: {
            title: 'SPAW Romantic Relationship Test',
            heading: 'SPAW Romantic Relationship Test',
            infoHeading: 'Basic Information',
            infoCopy: 'Basic information is optional. The information you provide and your 71 answers will be collected to produce your results and continue the research dataset.<br>',
            testHeading: 'Romantic Relationship Test',
            testCopy: 'The questions below assess your romantic relationship style.<br>Answer based on your current relationship using the scale <b><em>7 = strongly describes me and 1 = strongly does not describe me</em></b>.',
            name: 'Name', email: 'Email address', age: 'Age', sex: 'Gender', male: 'Male', female: 'Female',
            consent: 'I agree that the information I provide and my response data will be collected.',
            submit: 'Complete Test',
            introTitle: 'SPAW Romantic Relationship Test',
            introSummary: 'Developed by Ziseok Lee and Seong Kyun Jung, the SPAW test reinterprets the MIMARA and ROCI-II assessments through topological data analysis.',
            introResultTitle: 'What You Receive',
            introResultCopy: 'Your relationship is classified into one of four SPAW types—Stable, Pleaser, Affection Seeker, or Withdrawer—with detailed results for attachment, conflict resolution, and Big Five traits.',
            introTimeTitle: 'How It Works',
			introTimeCopy: 'Answer 71 items on a scale from 1 to 7. Your progress is shown automatically, and your selected answers remain in place when you switch between Korean and English.',
			start: 'Start the Test',
			about: 'About the Test',
			researchFooterHeading: '2023 Summer Student-Directed Research'
        }
    };

    const form = document.getElementById('spawtest');
    const questionHeadings = Array.from(form.querySelectorAll('.row.gtr-uniform h3'));
    const formHeadings = form.querySelectorAll('header h2');
    const formCopy = form.querySelectorAll(':scope > p');

    if (questionHeadings.length !== englishQuestions.length) {
        console.error(`SPAW translation mismatch: found ${questionHeadings.length} questions, expected ${englishQuestions.length}.`);
    }

    questionHeadings.forEach((heading) => {
        heading.dataset.ko = heading.textContent.trim();
    });

    function setLanguage(language) {
        const lang = language === 'en' ? 'en' : 'ko';
        const t = copy[lang];
        window.spawLanguage = lang;
        document.documentElement.lang = lang;
        document.title = t.title;
        document.querySelector('#header .logo b').textContent = t.heading;
        formHeadings[0].textContent = t.infoHeading;
        formHeadings[1].textContent = t.testHeading;
        formCopy[0].innerHTML = t.infoCopy;
        formCopy[1].innerHTML = t.testCopy;
        document.getElementById('name').placeholder = t.name;
        document.getElementById('email').placeholder = t.email;
        document.getElementById('age').placeholder = t.age;
        const options = document.getElementById('sex').options;
        options[0].textContent = t.sex;
        options[1].textContent = t.male;
        options[2].textContent = t.female;
        document.getElementById('data-consent-label').textContent = t.consent;
        document.getElementById('submit-test').textContent = t.submit;
        document.getElementById('intro-title').textContent = t.introTitle;
        document.getElementById('intro-summary').textContent = t.introSummary;
        document.getElementById('intro-result-title').textContent = t.introResultTitle;
        document.getElementById('intro-result-copy').textContent = t.introResultCopy;
        document.getElementById('intro-time-title').textContent = t.introTimeTitle;
        document.getElementById('intro-time-copy').textContent = t.introTimeCopy;
        document.getElementById('start-test').textContent = t.start;
        document.getElementById('show-intro').textContent = t.about;
		document.getElementById('research-footer-heading').textContent = t.researchFooterHeading;

        questionHeadings.forEach((heading, index) => {
            heading.textContent = lang === 'en' ? englishQuestions[index] : heading.dataset.ko;
        });

        document.getElementById('language-ko').setAttribute('aria-pressed', String(lang === 'ko'));
        document.getElementById('language-en').setAttribute('aria-pressed', String(lang === 'en'));
        updateProgress();
        try { localStorage.setItem('spaw-language', lang); } catch (_) { /* storage may be unavailable */ }
    }

    function updateProgress() {
        const answered = form.querySelectorAll('input[type="radio"]:checked').length;
        const remaining = 71 - answered;
        const percentage = Math.round((answered / 71) * 100);
        const label = document.getElementById('progress-label');
        label.textContent = window.spawLanguage === 'en'
            ? `${answered} of 71 answered · ${remaining} remaining (${percentage}%)`
            : `${answered} / 71 응답 · ${remaining}개 남음 (${percentage}%)`;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
        document.getElementById('progress-track').setAttribute('aria-valuenow', String(answered));
    }

    function showView(view, updateHash = true) {
        const showTest = view === 'test';
        document.getElementById('intro-view').hidden = showTest;
        document.getElementById('test-view').hidden = !showTest;
        if (updateHash) history.replaceState(null, '', showTest ? '#test' : '#intro');
        if (showTest) updateProgress();
        if (updateHash) document.getElementById('main').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.collectSpawResponses = function () {
        return Array.from({ length: 71 }, (_, index) => {
            const selected = document.querySelector(`input[name="Q${index}R"]:checked`);
            return selected ? Number(selected.value) : 0;
        });
    };

    window.setSpawLanguage = setLanguage;
    document.getElementById('language-ko').addEventListener('click', () => setLanguage('ko'));
    document.getElementById('language-en').addEventListener('click', () => setLanguage('en'));
    document.getElementById('start-test').addEventListener('click', () => showView('test'));
    document.getElementById('show-intro').addEventListener('click', () => showView('intro'));
    form.addEventListener('change', (event) => {
        if (event.target.matches('input[type="radio"]')) updateProgress();
    });

    const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
    let savedLanguage = 'ko';
    try { savedLanguage = localStorage.getItem('spaw-language') || 'ko'; } catch (_) { /* storage may be unavailable */ }
    setLanguage(requestedLanguage || savedLanguage);
    showView(window.location.hash === '#test' ? 'test' : 'intro', false);
}());
