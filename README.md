# AI-Interviewer

AI Interviewer is a smart, full-stack web app built to help software engineers prepare for technical interviews through personalized question sets, LeetCode problem suggestions, and session tracking. It uses natural language processing to evaluate responses and provides structured guidance to improve coding and communication skills

## Technology Stack
This project was created using: React, Bootstrap, Django REST Framework, sentence-transformers, Groq API and Python

- User Authentication

   → Secure login system with token-based authentication and session persistence.

- Dynamic Interview Sessions
  
  → 12 AI-generated technical questions and 3 LeetCode problems graded per session.

- Performance-Based LeetCode Suggestions
  
  → Personalized LeetCode recommendations based on your previous answers and current strengths.

- Session-Based To-Do List
  
  → Lightweight task manager to help users stay organized while practicing.

- History Tracking
  
  → Avoids repetition by tracking and rotating previous questions, no repeats until you've seen 50.

## Installation

Clone
```bash
git clone https://github.com/AriqGChowdhury/AI-Interviewer.git

```
Install Requirements
```bash
cd AI-Interviewer
pip install -r requirements.txt
```
Run Program (Django server) & (React Frontend) respectively
```bash 
python manage.py runserver
```
```bash 
npm install
npm start
```

## Support

Contact me at ariq922@hotmail.com

## Demo

Available at https://ariqgchowdhury.github.io/portfolio

or Direct link: https://drive.google.com/file/d/1xW2dy08GnNH0DsD-YVTKnc5f7x_5G8HG/preview

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
