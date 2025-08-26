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
const [knowledgeBase, setKnowledgeBase] = useState(`You are BMW Motorrad AI Tour Manager, a friendly, efficient, and knowledgeable digital motorcycle trip planner specializing in helping new touring riders plan their first 200-300 km ride.\n You make trip planning quick, easy, and confidence-inspiring by suggesting scenic GPX routes, providing packing lists, and recommending BMW Motorrad accessories with direct links and discounts.\n You know predefined GPX routes such as: Mountain Views (Clarens -> Golden Gate Highlands NP, 250 km, ClarensMountainViews_250km.gpx), Coastal Cruise (Knysna -> Plettenberg Bay, 200 km, GardenRoute_Coastal_200km.gpx), and Open Plains (Oudtshoorn -> Calitzdorp, 220 km, Karoo_Explorer_220km.gpx).\n You also know associated POIs like coffee stops (The Courtyard Cafe, Diesel & Creme), landmarks (God's Window, Chapman's Peak, Golden Gate Highlands NP lookouts), fuel stops (~100 km intervals, e.g., Clarens Engen), and BMW Motorrad dealerships/service points (e.g., BMW Motorrad George).\n You provide a standard 2-day packing list including rider essentials (license, registration, medical aid card, first-aid kit, tire repair kit, small tool kit), clothing (waterproof riding gear, gloves, helmet, boots, oversuit, base layers, casual wear), personal items (sunscreen, lip balm, sunglasses, toiletries, medication, water, snacks), and electronics (phone, charger, power bank, GPS).\n You recommend BMW Motorrad accessories such as storage (BMW Vario Top Case for F 850 GS, BMW Soft Luggage Tank Bag for R 1250 R, BMW Side Panniers for R 1250 GS Adventure), comfort (BMW Comfort Seat for R 1250 RT, BMW Heated Grips), and navigation (BMW Motorrad Navigator VI), with links: https://www.bmw-motorrad.co.za/en/individualisation/accessories-stage.html#/productFilter-modelCodes=0F21, https://www.bmw-motorrad.co.za/en/individualisation/accessories-finder.html#/section-even-more-accessories, https://www.bmw-motorrad.co.za/en/individualisation/soft-luggage-solutions.html#/section-your-lifestyle-your-collection, https://www.bmw-motorrad.co.za/en/individualisation/navigation-and-communication.html.\n Always capture user preferences (location, rider experience, bike model, preferred scenery, trip duration, group size) before suggesting a route.\n Your tone is friendly, concise, and brand-aligned with BMW's #MakeLifeARide ethos.\n Ask short, clear questions, then provide one tailored route with GPX file, relevant POIs, a packing list, and one BMW Motorrad accessory recommendation with a direct link.\n Safety and rider confidence are top priorities.\n Example: User: "I want to plan my first long ride." AI: "Great! What scenery do you prefer — mountains, coast, or open plains?" User: "Mountains, and I'm a new rider." AI: "Perfect! How about a scenic 250 km loop through the Drakensberg foothills? I'll send you the GPX route, a packing list, and a great coffee stop."\n\nIMPORTANT INSTRUCTIONS:\n- Always remember and use the information the user has already provided in this conversation.\n- Do NOT ask the same question twice if the user has already answered it.\n- If some details are missing, only ask for the missing ones — never repeat questions that have been answered.\n- Summarize the known details back to the user before asking for any missing information.\n- Once you have enough details, immediately provide the route suggestion, GPX file, packing list, and BMW Motorrad accessory recommendation without further repetitive questioning.\n- Keep the conversation flowing naturally and avoid loops.`);

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

  const userMessage = {
    id: messages.length + 1,
    text: inputMessage,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsLoading(true);

  try {
    const systemPrompt = knowledgeBase + "\n\nUser message: " + inputMessage;
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('API key not found. Please set REACT_APP_GEMINI_API_KEY in your environment variables.');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that request. Could you try rephrasing?";

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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#f0f0f0', // WhatsApp light background
    color: '#333',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    background: '#0066B1', // BMW blue
    padding: '1rem 1.5rem',
    color: 'white'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  iconContainer: {
    padding: '0.5rem',
    background: 'white',
    borderRadius: '50%'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: 0
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#e6e6e6',
    margin: 0
  },
  settingsButton: {
    padding: '0.5rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  settingsPanel: {
    background: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '1rem'
  },
  settingsGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    gap: '0.5rem',
    color: '#0066B1' // BMW blue
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    color: '#333',
    fontSize: '0.875rem',
    fontFamily: 'monospace',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  helperText: {
    fontSize: '0.75rem',
    color: '#666',
    marginTop: '0.25rem'
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png")', // WhatsApp chat background
    backgroundRepeat: 'repeat'
  },
  messageContainer: {
    display: 'flex'
  },
  userMessageContainer: {
    justifyContent: 'flex-end'
  },
  botMessageContainer: {
    justifyContent: 'flex-start'
  },
  message: {
    maxWidth: '70%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)'
  },
  userMessage: {
    background: '#dcf8c6', // WhatsApp green message bubble
    color: '#303030'
  },
  botMessage: {
    background: 'white', // WhatsApp white message bubble
    color: '#303030'
  },
  messageText: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    margin: 0,
    whiteSpace: 'pre-wrap'
  },
  timestamp: {
    fontSize: '0.7rem',
    marginTop: '0.5rem',
    textAlign: 'right',
    opacity: 0.7
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  loadingMessage: {
    background: 'white',
    color: '#303030',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)'
  },
  loadingDots: {
    display: 'flex',
    gap: '0.5rem'
  },
  dot: {
    width: '8px',
    height: '8px',
    background: '#0066B1', // BMW blue
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out'
  },
  inputArea: {
    background: '#f0f0f0',
    borderTop: '1px solid #e0e0e0',
    padding: '0.75rem 1rem'
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '0.75rem'
  },
  inputWrapper: {
    flex: 1,
    position: 'relative'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '1.5rem', // WhatsApp rounded input
    color: '#333',
    resize: 'none',
    outline: 'none',
    maxHeight: '8rem',
    minHeight: '2.5rem',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  sendButton: {
    padding: '0.75rem',
    background: '#0066B1', // BMW blue
    border: 'none',
    borderRadius: '50%', // WhatsApp circular send button
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  instructions: {
    fontSize: '0.75rem',
    color: '#666',
    textAlign: 'center',
    marginTop: '0.5rem'
  }
};

// Add CSS animations
useEffect(() => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
    }
    .bounce-1 { animation-delay: -0.32s; }
    .bounce-2 { animation-delay: -0.16s; }
  `;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
}, []);

return (
  <div style={styles.container}>
    {/* Header */}
    <div style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer}>
            <BMWMotorradIcon />
          </div>
          <div>
            <h1 style={styles.title}>BMW Motorrad Tour Guide</h1>
            <p style={styles.subtitle}>Make Life A Ride</p>
          </div>
        </div>
        <button
          style={{
            ...styles.settingsButton,
            backgroundColor: showSettings ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!showSettings) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!showSettings) e.target.style.backgroundColor = 'transparent';
          }}
          onClick={() => setShowSettings(!showSettings)}
        >
          <SettingsIcon />
        </button>
      </div>
    </div>

    {/* Settings Panel */}
    {showSettings && (
      <div style={styles.settingsPanel}>
        <div style={styles.settingsGroup}>
          <label style={styles.label}>
            <DatabaseIcon />
            BMW Motorrad Knowledge Base
          </label>
          <textarea
            value={knowledgeBase}
            onChange={(e) => setKnowledgeBase(e.target.value)}
            rows={8}
            style={styles.textarea}
            placeholder="Define the BMW Motorrad Tour Guide's knowledge base..."
            onFocus={(e) => {
              e.target.style.borderColor = '#0066B1';
              e.target.style.boxShadow = '0 0 0 2px rgba(0, 102, 177, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.boxShadow = 'none';
            }}
          />
          <p style={styles.helperText}>
            Customize the BMW Motorrad Tour Guide's knowledge to fit your specific touring needs
          </p>
        </div>
      </div>
    )}

    {/* Chat Messages */}
    <div style={styles.chatArea}>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            ...styles.messageContainer,
            ...(message.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer)
          }}
        >
          <div
            style={{
              ...styles.message,
              ...(message.sender === 'user' ? styles.userMessage : styles.botMessage)
            }}
          >
            <p style={styles.messageText}>{message.text}</p>
            <div style={{
              ...styles.timestamp,
              color: message.sender === 'user' ? '#667781' : '#667781'
            }}>
              {message.timestamp}
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingMessage}>
            <div style={styles.loadingDots}>
              <div style={styles.dot}></div>
              <div style={{...styles.dot}} className="bounce-1"></div>
              <div style={{...styles.dot}} className="bounce-2"></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>

    {/* Input Area */}
    <div style={styles.inputArea}>
      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message to BMW Motorrad Tour Guide..."
            style={styles.input}
            rows={1}
            disabled={isLoading}
            onFocus={(e) => {
              e.target.style.borderColor = '#0066B1';
              e.target.style.boxShadow = '0 0 0 2px rgba(0, 102, 177, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          style={{
            ...styles.sendButton,
            ...((!inputMessage.trim() || isLoading) ? styles.sendButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (!(!inputMessage.trim() || isLoading)) {
              e.target.style.backgroundColor = '#005091';
            }
          }}
          onMouseLeave={(e) => {
            if (!(!inputMessage.trim() || isLoading)) {
              e.target.style.backgroundColor = '#0066B1';
            }
          }}
        >
          <SendIcon />
        </button>
      </div>
      <p style={styles.instructions}>
        Press Enter to send • Shift+Enter for new line
      </p>
    </div>
  </div>
);
};

export default App;