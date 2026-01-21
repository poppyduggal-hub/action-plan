# Action Plan - AI-Powered Health Guidance Platform

An intelligent web application that provides personalized, safe, and evidence-based health action plans for kids, teens, and adults. Built with modern web technologies and powered by OpenAI's GPT-4.

## Features

- **Age-Appropriate Guidance**: Customized responses for kids (3-12), teens (13-17), and adults (18+)
- **AI-Powered Plans**: Unique, personalized action plans generated each time using GPT-4
- **Safe & Responsible**: No diagnoses, no medication advice, always recommends professional consultation
- **Beautiful Animations**: Smooth, engaging UI with floating shapes and transitions
- **Comprehensive Sections**:
  - ✅ **Do Now**: Immediate low-risk actions
  - 📊 **Monitor & Track**: Symptoms and patterns to watch
  - ⚠️ **Avoid / Be Cautious**: Things to be mindful about
  - 💬 **Questions for Professionals**: What to ask your doctor
  - 🚨 **Red Flags**: When to seek urgent medical care

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT-4 Turbo
- **Styling**: Custom CSS with animations and gradients
- **Architecture**: RESTful API, Single Page Application (SPA)

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

## Running the Application

1. **Start the server**
   ```bash
   npm start
   ```

2. **Open your browser**

   Navigate to: `http://localhost:3000`

3. **Use the app**
   - Select an age group (Kid, Teen, or Adult)
   - Describe the health concern
   - Optionally add context (goals, allergies, etc.)
   - Click "Generate Action Plan"
   - Review your personalized action plan

## Project Structure

```
Action Plan/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # All styles and animations
│   └── app.js              # Frontend JavaScript
├── server.js               # Express server & OpenAI integration
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (create this)
├── .env.example            # Example environment file
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## API Endpoints

### `POST /api/generate-plan`
Generate a personalized action plan.

**Request Body:**
```json
{
  "ageGroup": "adult",
  "healthConcern": "persistent headaches",
  "context": "stressful job, poor sleep"
}
```

**Response:**
```json
{
  "plan": {
    "doNow": ["Action 1", "Action 2", ...],
    "monitor": ["Symptom 1", "Symptom 2", ...],
    "avoid": ["Thing 1", "Thing 2", ...],
    "questions": ["Question 1", "Question 2", ...],
    "redFlags": ["Warning 1", "Warning 2", ...]
  }
}
```

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T...",
  "openaiConfigured": true
}
```

## Safety & Ethics

This application is designed with safety as the top priority:

- **No Medical Diagnosis**: Never attempts to diagnose conditions
- **No Medication Advice**: Never recommends specific drugs or dosages
- **Professional Consultation**: Always encourages seeing healthcare providers
- **Emergency Guidance**: Includes red flags for urgent care
- **Evidence-Based**: Focuses on low-risk, general wellness actions
- **Age-Appropriate**: Tailored language and advice for different age groups

## Customization

### Changing the AI Model

Edit `server.js`, line with `model:`:
```javascript
model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for faster/cheaper
```

### Adjusting Response Variety

Edit `server.js`, line with `temperature:`:
```javascript
temperature: 0.9, // 0.0 = consistent, 1.0 = very creative
```

### Modifying Animations

Edit `public/styles.css`:
- Floating shapes: `.floating-shape` animations
- Loading animation: `.pulse-ring` keyframes
- Transitions: Various `animation` properties

## Development

### Running in Development Mode
```bash
npm run dev
```

### Testing the API
```bash
# Health check
curl http://localhost:3000/api/health

# Generate plan
curl -X POST http://localhost:3000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{"ageGroup":"adult","healthConcern":"headache"}'
```

## VSCode Integration

This project is ready to be opened in VSCode:

1. Open VSCode
2. File → Open Folder
3. Select the "Action Plan" directory
4. Open integrated terminal (`` Ctrl+` `` or `` Cmd+` ``)
5. Run `npm install` and `npm start`

### Recommended VSCode Extensions
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Live Server**: Alternative development server
- **REST Client**: Test API endpoints

## Troubleshooting

### "OpenAI API key not configured"
- Make sure `.env` file exists in the root directory
- Verify `OPENAI_API_KEY` is set correctly
- Restart the server after adding the key

### "Failed to generate action plan"
- Check your OpenAI API key is valid
- Ensure you have API credits in your OpenAI account
- Check the server console for detailed error messages

### Port already in use
- Change the PORT in `.env` file
- Or kill the process using port 3000:
  ```bash
  # macOS/Linux
  lsof -ti:3000 | xargs kill -9

  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

## Security Notes

- Never commit `.env` file to version control
- Keep your OpenAI API key private
- Use environment variables for all sensitive data
- Implement rate limiting for production use
- Add input validation and sanitization for production

## Future Enhancements

- [ ] User accounts and saved plans
- [ ] PDF export functionality
- [ ] Multiple language support
- [ ] Voice input for health concerns
- [ ] Integration with health tracking apps
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Progressive Web App (PWA) features
- [ ] Database for storing anonymized queries

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Disclaimer

**This application is for educational and informational purposes only. It does not provide medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for medical concerns. In case of emergency, call 911 or your local emergency number immediately.**

## Support

For issues, questions, or contributions, please create an issue in the project repository.

---

Built with ❤️ using Node.js, Express, and OpenAI GPT-4
