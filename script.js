const apiKey = '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';
const model = 'qwen/qwen2-72b-instruct';

document.getElementById('searchBtn').addEventListener('click', searchRoadmap);

async function searchRoadmap() {
    const query = document.getElementById('searchInput').value.trim();
    const roadmapContainer = document.getElementById('roadmapContainer');
    const errorMessage = document.getElementById('errorMessage');
    roadmapContainer.innerHTML = '';
    errorMessage.innerText = '';

    if (!query) {
        errorMessage.innerText = 'Please enter a career path to search.';
        return;
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://sambhav2path.netlify.app', // ✅ Update with your real domain
                'X-Title': 'SambhavPath'
            },
            body: JSON.stringify({
                model: model,
                messages: [{
                    role: 'user',
                    content: `Give me a deeply detailed career roadmap to become a ${query}. Include at least 20 bullet points with degrees, exams, skills, timelines, tools, certifications, and alternate paths. Format them step-by-step clearly.`
                }]
            })
        });

        const data = await response.json();
        if (!data.choices || !data.choices[0]) {
            throw new Error("Invalid response from OpenRouter.");
        }

        const steps = data.choices[0].message.content.split('\n').filter(line => line.trim());
        if (steps.length === 0) {
            roadmapContainer.innerHTML = '<p>No roadmap data available.</p>';
            return;
        }

        steps.forEach((step, index) => {
            const div = document.createElement('div');
            div.className = 'milestone';
            div.innerHTML = `
                <h3>Step ${index + 1}</h3>
                <p>${step.replace(/^[-•\d.]*\s*/, '')}</p>
            `;
            roadmapContainer.appendChild(div);
        });

        updateProgressBar();
    } catch (err) {
        console.error('Error:', err);
        errorMessage.innerText = 'Failed to fetch roadmap. Please try again.';
    }
}

function updateProgressBar() {
    const milestones = document.querySelectorAll('.milestone');
    const visibleMilestones = Array.from(milestones).filter(m => {
        const rect = m.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom >= 0;
    }).length;

    const progressFill = document.getElementById('progressFill');
    if (milestones.length > 0) {
        progressFill.style.width = `${(visibleMilestones / milestones.length) * 100}%`;
    } else {
        progressFill.style.width = '0%';
    }
}

window.addEventListener('scroll', updateProgressBar);
