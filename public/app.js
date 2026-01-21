// Application State
const state = {
    ageGroup: null,
    healthConcern: '',
    context: ''
};

// DOM Elements
const ageSelectionSection = document.getElementById('age-selection');
const concernInputSection = document.getElementById('concern-input');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');

const ageButtons = document.querySelectorAll('.age-btn');
const addContextBtn = document.getElementById('add-context-btn');
const contextSection = document.getElementById('context-section');
const backToAgeBtn = document.getElementById('back-to-age');
const generatePlanBtn = document.getElementById('generate-plan');
const startOverBtn = document.getElementById('start-over');
const printPlanBtn = document.getElementById('print-plan');

const healthConcernInput = document.getElementById('health-concern');
const contextInput = document.getElementById('context');
const actionPlanContent = document.getElementById('action-plan-content');

// Event Listeners
ageButtons.forEach(btn => {
    btn.addEventListener('click', () => selectAgeGroup(btn));
});

addContextBtn.addEventListener('click', toggleContextSection);
backToAgeBtn.addEventListener('click', goBackToAgeSelection);
generatePlanBtn.addEventListener('click', generateActionPlan);
startOverBtn.addEventListener('click', startOver);
printPlanBtn.addEventListener('click', printPlan);

// Functions
function selectAgeGroup(selectedBtn) {
    // Remove selected class from all buttons
    ageButtons.forEach(btn => btn.classList.remove('selected'));

    // Add selected class to clicked button
    selectedBtn.classList.add('selected');

    // Store age group
    state.ageGroup = selectedBtn.dataset.age;

    // Move to next step after short delay
    setTimeout(() => {
        showSection(concernInputSection);
    }, 300);
}

function toggleContextSection() {
    contextSection.classList.toggle('hidden');
    if (!contextSection.classList.contains('hidden')) {
        addContextBtn.textContent = '- Remove Context';
        contextInput.focus();
    } else {
        addContextBtn.textContent = '+ Add Optional Context';
    }
}

function goBackToAgeSelection() {
    showSection(ageSelectionSection);
}

function showSection(section) {
    const allSections = document.querySelectorAll('.step-section');
    allSections.forEach(s => s.classList.remove('active'));
    section.classList.add('active');
}

async function generateActionPlan() {
    // Validate input
    state.healthConcern = healthConcernInput.value.trim();
    if (!state.healthConcern) {
        alert('Please describe the health concern.');
        healthConcernInput.focus();
        return;
    }

    state.context = contextInput.value.trim();

    // Show loading
    showSection(loadingSection);

    try {
        // Call API to generate plan
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ageGroup: state.ageGroup,
                healthConcern: state.healthConcern,
                context: state.context
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate action plan');
        }

        const data = await response.json();
        displayActionPlan(data.plan);

    } catch (error) {
        console.error('Error generating action plan:', error);
        alert('Sorry, there was an error generating your action plan. Please try again.');
        showSection(concernInputSection);
    }
}

function displayActionPlan(plan) {
    // Clear previous content
    actionPlanContent.innerHTML = '';

    // Create sections
    const sections = [
        {
            key: 'doNow',
            title: 'Do Now',
            icon: '✅',
            className: 'do-now',
            description: 'Low-risk actions you can take immediately'
        },
        {
            key: 'monitor',
            title: 'Monitor & Track',
            icon: '📊',
            className: 'monitor',
            description: 'Things to keep an eye on'
        },
        {
            key: 'avoid',
            title: 'Avoid / Be Cautious',
            icon: '⚠️',
            className: 'avoid',
            description: 'Things to be mindful about'
        },
        {
            key: 'questions',
            title: 'Questions to Ask a Professional',
            icon: '💬',
            className: 'questions',
            description: 'Important questions for your healthcare provider'
        },
        {
            key: 'redFlags',
            title: 'Red Flags',
            icon: '🚨',
            className: 'red-flags',
            description: 'When to seek urgent medical care'
        }
    ];

    sections.forEach(section => {
        const items = plan[section.key] || [];
        if (items.length > 0) {
            const sectionElement = createPlanSection(
                section.title,
                section.icon,
                section.className,
                items
            );
            actionPlanContent.appendChild(sectionElement);
        }
    });

    // Show results
    showSection(resultsSection);
}

function createPlanSection(title, icon, className, items) {
    const section = document.createElement('div');
    section.className = `plan-section ${className}`;

    const header = document.createElement('div');
    header.className = 'plan-section-header';
    header.innerHTML = `
        <span class="section-icon">${icon}</span>
        <h3>${title}</h3>
    `;

    const list = document.createElement('ul');
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });

    section.appendChild(header);
    section.appendChild(list);

    return section;
}

function startOver() {
    // Reset state
    state.ageGroup = null;
    state.healthConcern = '';
    state.context = '';

    // Clear inputs
    healthConcernInput.value = '';
    contextInput.value = '';
    contextSection.classList.add('hidden');
    addContextBtn.textContent = '+ Add Optional Context';

    // Remove age group selection
    ageButtons.forEach(btn => btn.classList.remove('selected'));

    // Show first section
    showSection(ageSelectionSection);
}

function printPlan() {
    window.print();
}

// Initialize
console.log('Action Plan app initialized');
