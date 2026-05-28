import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load RAG data
const getChatbotData = () => {
    const dataPath = path.join(__dirname, '../chatbotData.json');
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

/**
 * Controller handling the chat generation logic for freeform questions.
 */
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.OPENAI_API_KEY });

export const askQuestion = async (req, res, next) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required.' });
        }

        const data = getChatbotData();

        // 🟢 1. التعامل مع التحيات (قبل أي شيء)
        const lowerOriginal = question.toLowerCase();
        const greetings = ["hello", "hi", "hey", "thanks", "thank you", "good morning", "good evening"];

        if (greetings.some(greet => lowerOriginal.includes(greet))) {
            return res.status(200).json({
                question,
                answer: "Hello 😊 How can I assist you today?"
            });
        }

        // 🧠 2. تحديد هل اللغة إنجليزية
        const isEnglish = /^[a-zA-Z0-9\s.,?!]+$/.test(question);

        let lowerQuestion;

        if (isEnglish) {
            lowerQuestion = question.toLowerCase();
        } else {
            // 🔥 ترجمة السؤال إلى الإنجليزية
            const translation = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Translate this text to English only. Do not explain."
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                max_tokens: 100
            });

            lowerQuestion = translation.choices[0].message.content.trim().toLowerCase();
        }

        // 🔍 3. تجهيز التوكنز
        const stopWords = ["the", "and", "for", "with", "you", "your", "how", "can", "what", "are", "using"];

        const searchTokens = lowerQuestion
            .split(/\W+/)
            .filter(word => word.length > 2 && !stopWords.includes(word));

        let bestMatch = null;
        let maxScore = 0;

        for (const section of Object.values(data.sections)) {
            const sectionText = (section.title + " " + section.content).toLowerCase();
            let currentScore = 0;

            for (const token of searchTokens) {
                if (sectionText.includes(token)) currentScore++;
            }

            if (currentScore > maxScore) {
                maxScore = currentScore;
                bestMatch = section;
            }
        }

        // 🔴 4. فلترة صارمة
        const MIN_SCORE = 2;

        if (!bestMatch || maxScore < MIN_SCORE) {
            return res.status(200).json({
                question,
                answer: data.general.default_response
            });
        }

        // 🤖 5. استخدام AI فقط عند وجود context
        const context = bestMatch.content;

        const aiResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "Answer only using the provided context. Be clear and concise."
                },
                {
                    role: "user",
                    content: `Context: ${context}\nQuestion: ${question}`
                }
            ],
            max_tokens: 300
        });

        const answer = aiResponse.choices[0].message.content.trim();

        res.status(200).json({
            question,
            answer
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Endpoint to fetch pre-defined UI section data (e.g. Legal, HR).
 */
export const getSectionData = async (req, res, next) => {
    try {
        const { sectionName } = req.params;
        const data = getChatbotData();

        // Find the matched section, otherwise fallback to general text
        const matchedSection = data.sections[sectionName];

        if (!matchedSection) {
            return res.status(404).json({ error: 'Section not found.' });
        }

        res.status(200).json({
            answer: matchedSection.content,
            sectionTitle: matchedSection.title,
            sources: [sectionName]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Health check or status route
 */
export const getStatus = (req, res) => {
    res.json({ status: 'ok', message: 'Chat API is up and running' });
};
