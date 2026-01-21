const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Anthropic
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// System prompts for different age groups
const getSystemPrompt = (ageGroup) => {
    const basePrompt = `You are a health guidance assistant that provides safe, evidence-based, general wellness information.

CRITICAL SAFETY RULES - YOU MUST FOLLOW THESE:
1. NEVER provide medical diagnoses
2. NEVER recommend specific medications, dosages, or treatment plans
3. NEVER replace professional medical advice
4. ALWAYS encourage consulting healthcare professionals
5. ALWAYS include emergency guidance for serious symptoms
6. Focus on LOW-RISK, general wellness actions only
7. Be age-appropriate and clear

Your role is to provide general health education and help people understand when they should seek professional care.`;

    const ageSpecificGuidance = {
        kid: `The user is asking on behalf of a child (ages 3-12). Be extra cautious. Use simple, clear language. Parents/guardians should supervise all actions. Recommend medical consultation for anything beyond very minor issues.`,
        teen: `The user is a teenager (ages 13-17) or asking on their behalf. Use clear, respectful language. Encourage involving parents/guardians. Be mindful of mental health concerns common in this age group.`,
        adult: `The user is an adult (ages 18+). Provide balanced, evidence-based guidance. Acknowledge the complexity of health concerns while maintaining safety boundaries.`
    };

    return `${basePrompt}\n\n${ageSpecificGuidance[ageGroup] || ageSpecificGuidance.adult}`;
};

// Generate action plan prompt
const generatePrompt = (ageGroup, healthConcern, context) => {
    let prompt = `Create a personalized action plan for the following health concern:\n\n`;
    prompt += `Age Group: ${ageGroup}\n`;
    prompt += `Health Concern: ${healthConcern}\n`;

    if (context) {
        prompt += `Additional Context: ${context}\n`;
    }

    prompt += `\n---\n\n`;
    prompt += `Generate a comprehensive action plan with the following sections. Return ONLY valid JSON with no additional text:\n\n`;
    prompt += `{
  "doNow": [
    "List 3-5 low-risk, safe actions the person can take immediately (e.g., hydration, rest, breathing exercises, gentle stretching, journaling)"
  ],
  "monitor": [
    "List 3-4 symptoms or factors to track over time (e.g., frequency, duration, triggers, patterns)"
  ],
  "avoid": [
    "List 3-4 things to be cautious about or avoid (e.g., certain foods, activities, self-medication)"
  ],
  "questions": [
    "List 4-5 specific questions to ask a healthcare provider about this concern"
  ],
  "redFlags": [
    "List 3-5 serious warning signs that require immediate medical attention or emergency care"
  ]
}\n\n`;

    prompt += `IMPORTANT GUIDELINES:\n`;
    prompt += `- Use clear, actionable language\n`;
    prompt += `- Keep each item concise (1-2 sentences max)\n`;
    prompt += `- Be specific but avoid medical jargon\n`;
    prompt += `- Focus on general wellness, not medical treatment\n`;
    prompt += `- NEVER suggest specific medications or dosages\n`;
    prompt += `- For kids, keep language simple and involve parents/guardians\n`;
    prompt += `- Include mental health support resources when relevant\n`;
    prompt += `- Be empathetic but maintain professional boundaries\n`;
    prompt += `- Return ONLY the JSON object, no markdown formatting, no additional text\n`;

    return prompt;
};

// API Routes
app.post('/api/generate-plan', async (req, res) => {
    try {
        const { ageGroup, healthConcern, context } = req.body;

        // Validate input
        if (!ageGroup || !healthConcern) {
            return res.status(400).json({
                error: 'Age group and health concern are required'
            });
        }

        // Validate age group
        const validAgeGroups = ['kid', 'teen', 'adult'];
        if (!validAgeGroups.includes(ageGroup)) {
            return res.status(400).json({
                error: 'Invalid age group'
            });
        }

        // Check for Anthropic API key
        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(500).json({
                error: 'Anthropic API key not configured'
            });
        }

        // Generate action plan using Claude
        const systemPrompt = getSystemPrompt(ageGroup);
        const userPrompt = generatePrompt(ageGroup, healthConcern, context);

        console.log('Generating action plan for:', { ageGroup, healthConcern });

        const message = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 4000,
            temperature: 0.9, // Higher temperature for more varied responses
            system: systemPrompt,
            messages: [
                { role: 'user', content: userPrompt }
            ]
        });

        const responseText = message.content[0].text.trim();

        // Parse the JSON response
        let plan;
        try {
            // Claude may wrap JSON in markdown code blocks, so we need to extract it
            let jsonText = responseText;
            if (jsonText.includes('```json')) {
                jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
            } else if (jsonText.includes('```')) {
                jsonText = jsonText.replace(/```\s*/g, '');
            }
            plan = JSON.parse(jsonText.trim());
        } catch (parseError) {
            console.error('Failed to parse Claude response:', responseText);
            throw new Error('Invalid response format from AI');
        }

        // Validate the response structure
        const requiredKeys = ['doNow', 'monitor', 'avoid', 'questions', 'redFlags'];
        const missingKeys = requiredKeys.filter(key => !plan[key]);

        if (missingKeys.length > 0) {
            console.error('Missing keys in response:', missingKeys);
            throw new Error('Incomplete action plan generated');
        }

        // Log success
        console.log('Action plan generated successfully');

        // Return the plan
        res.json({ plan });

    } catch (error) {
        console.error('Error generating action plan:', error);

        if (error.status === 401 || error.response?.status === 401) {
            return res.status(500).json({
                error: 'Invalid Anthropic API key. Please check your configuration.'
            });
        }

        res.status(500).json({
            error: 'Failed to generate action plan. Please try again.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        anthropicConfigured: !!process.env.ANTHROPIC_API_KEY
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Action Plan server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔑 Anthropic API configured: ${process.env.ANTHROPIC_API_KEY ? '✅ Yes' : '❌ No - Please add to .env file'}\n`);
});

module.exports = app;
