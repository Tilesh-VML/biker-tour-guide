import React, { useState, useRef, useEffect } from 'react';

// BMW Motorrad themed icons as inline SVGs
const BMWMotorradIcon = () => (
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <circle cx="12" cy="12" r="10" fill="#0066B1" stroke="none"/>
  <text x="12" y="16" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">M</text>
</svg>
);

const SendIcon = () => (
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path d="M22 2 11 13" stroke="#0066B1"/>
  <path d="m22 2-7 20-4-9-9-4Z" stroke="#0066B1"/>
</svg>
);

const SettingsIcon = () => (
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066B1" strokeWidth="2">
  <circle cx="12" cy="12" r="3"/>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
</svg>
);

const DatabaseIcon = () => (
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066B1" strokeWidth="2">
  <ellipse cx="12" cy="5" rx="9" ry="3"/>
  <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
  <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
</svg>
);

const App = () => {
const [messages, setMessages] = useState([
  {
    id: 1,
    text: "🏍️ Welcome to BMW Motorrad Tour Guide! I'm here to help you plan your perfect motorcycle adventure. Whether you need scenic routes, BMW-approved stops, or touring advice, I've got you covered. What kind of journey are you planning today?",
    sender: 'bot',
    timestamp: new Date().toLocaleTimeString()
  }
]);
const [inputMessage, setInputMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [showSettings, setShowSettings] = useState(false);
const [knowledgeBase, setKnowledgeBase] = useState(`You are BMW Motorrad AI Tour Manager... (truncated for brevity)`);

const messagesEndRef = useRef(null);
const textareaRef = useRef(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

useEffect(() => {
  scrollToBottom();
}, [messages]);

const adjustTextareaHeight = () => {
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }
};

useEffect(() => {
  adjustTextareaHeight();
}, [inputMessage]);

const sendMessage = async () => {
  if (!inputMessage.trim() || isLoading) return;

  const newUserMessage = {
    id: messages.length + 1,
    text: inputMessage,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString()
  };

  // Add user message first so it appears immediately
  setMessages(prev => [...prev, newUserMessage]);
  setInputMessage('');
  setIsLoading(true);

  try {
    // Build full conversation for Gemini
    const conversation = [
      {
        role: "system",
        parts: [{ text: knowledgeBase }]
      },
      ...[...messages, newUserMessage].map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }))
    ];

    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found. Please set REACT_APP_GEMINI_API_KEY in your environment variables.');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: conversation,
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        })
      }
    );

    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    const data = await response.json();
    const botResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm having trouble processing that request. Could you try rephrasing?";

    const botMessage = {
      id: messages.length + 2,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = {
      id: messages.length + 2,
      text: `Sorry, I'm experiencing technical difficulties: ${error.message}`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// styles (unchanged, your full style object goes here)
// ...

// animations (unchanged)
// ...

return (
  <div style={styles.container}>
    {/* Header */}
    {/* Settings Panel */}
    {/* Chat Messages */}
    {/* Input Area */}
  </div>
);
};

export default App;
