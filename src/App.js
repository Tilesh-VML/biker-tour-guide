import React, { useState, useRef, useEffect } from 'react';

// BMW-themed icons
const BikeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18.5" cy="17.5" r="3.5"/>
    <circle cx="5.5" cy="17.5" r="3.5"/>
    <circle cx="15" cy="5" r="1"/>
    <path d="m14 17 4-10-1.5-2"/>
    <path d="M6 17h5l1.5-7 2.5-1"/>
    <path d="M12 14h2l-2-4"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="m12 1 1.27 3.18 3.54 .9-1.27 3.18L19 12l-3.46 3.73-3.54 .9L12 20l-1.27-3.18-3.54-.9L8.46 12.73 5 12l3.46-3.73L12 7.37 12 1z"/>
  </svg>
);

const DatabaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
  </svg>
);

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🏍️ Welcome to BMW Motorrad AI Tour Manager! I'm here to help you plan your first 200-300 km touring adventure. Let's make your ride memorable and safe. What type of scenery interests you most — mountains, coast, or open plains?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState(`You are BMW Motorrad AI Tour Manager, a friendly, efficient, and knowledgeable digital motorcycle trip planner specializing in helping new touring riders plan their first 200-300 km ride.

You make trip planning quick, easy, and confidence-inspiring by suggesting scenic GPX routes, providing packing lists, and recommending BMW Motorrad accessories with direct links and discounts.

You know predefined GPX routes such as: 
- Mountain Views (Clarens -> Golden Gate Highlands NP, 250 km, ClarensMountainViews_250km.gpx)
- Coastal Cruise (Knysna -> Plettenberg Bay, 200 km, GardenRoute_Coastal_200km.gpx)  
- Open Plains (Oudtshoorn -> Calitzdorp, 220 km, Karoo_Explorer_220km.gpx)

You also know associated POIs like coffee stops (The Courtyard Cafe, Diesel & Creme), landmarks (God's Window, Chapman's Peak, Golden Gate Highlands NP lookouts), fuel stops (~100 km intervals, e.g., Clarens Engen), and BMW Motorrad dealerships/service points (e.g., BMW Motorrad George).

You provide a standard 2-day packing list including:
- Rider essentials: license, registration, medical aid card, first-aid kit, tire repair kit, small tool kit
- Clothing: waterproof riding gear, gloves, helmet, boots, oversuit, base layers, casual wear
- Personal items: sunscreen, lip balm, sunglasses, toiletries, medication, water, snacks
- Electronics: phone, charger, power bank, GPS

You recommend BMW Motorrad accessories such as:
- Storage: BMW Vario Top Case for F 850 GS, BMW Soft Luggage Tank Bag for R 1250 R, BMW Side Panniers for R 1250 GS Adventure
- Comfort: BMW Comfort Seat for R 1250 RT, BMW Heated Grips
- Navigation: BMW Motorrad Navigator VI

Accessory links: 
- https://www.bmw-motorrad.co.za/en/individualisation/accessories-stage.html#/productFilter-modelCodes=0F21
- https://www.bmw-motorrad.co.za/en/individualisation/accessories-finder.html#/section-even-more-accessories
- https://www.bmw-motorrad.co.za/en/individualisation/soft-luggage-solutions.html#/section-your-lifestyle-your-collection
- https://www.bmw-motorrad.co.za/en/individualisation/navigation-and-communication.html

Always capture user preferences (location, rider experience, bike model, preferred scenery, trip duration, group size) before suggesting a route.

Your tone is friendly, concise, and brand-aligned with BMW's #MakeLifeARide ethos. Ask short, clear questions, then provide one tailored route with GPX file, relevant POIs, a packing list, and one BMW Motorrad accessory recommendation with a direct link.

Safety and rider confidence are top priorities.`);

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
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
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
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from API');
      }

      const botResponse = data.candidates[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that request. Could you try rephrasing?";

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
      background: 'linear-gradient(to bottom right, #1a1a2e, #16213e)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: 'rgba(22, 33, 62, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #3a4a6b',
      padding: '1rem 1.5rem'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    iconContainer: {
      padding: '0.75rem',
      background: 'linear-gradient(135deg, #0066cc, #004499)',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0,
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
    },
    subtitle: {
      fontSize: '0.9rem',
      color: '#b8c5d6',
      margin: 0
    },
    settingsButton: {
      padding: '0.6rem',
      background: 'transparent',
      border: 'none',
      borderRadius: '0.5rem',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    settingsPanel: {
      background: 'rgba(26, 32, 58, 0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #3a4a6b',
      padding: '1.5rem'
    },
    settingsGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '0.7rem',
      gap: '0.5rem',
      color: '#e2e8f0'
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      background: 'rgba(22, 33, 62, 0.6)',
      border: '2px solid #3a4a6b',
      borderRadius: '0.75rem',
      color: 'white',
      fontSize: '0.85rem',
      fontFamily: '"SF Mono", "Monaco", "Consolas", monospace',
      resize: 'vertical',
      outline: 'none',
      transition: 'all 0.3s ease',
      lineHeight: '1.5'
    },
    helperText: {
      fontSize: '0.8rem',
      color: '#94a3b8',
      marginTop: '0.5rem'
    },
    chatArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem'
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
      maxWidth: '75%',
      padding: '1rem 1.25rem',
      borderRadius: '1.25rem',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(8px)'
    },
    userMessage: {
      background: 'linear-gradient(135deg, #0066cc, #004499)',
      color: 'white',
      boxShadow: '0 6px 20px rgba(0, 102, 204, 0.3)'
    },
    botMessage: {
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#f1f5f9',
      border: '1px solid rgba(148, 163, 184, 0.2)'
    },
    messageText: {
      fontSize: '0.9rem',
      lineHeight: '1.6',
      margin: 0,
      whiteSpace: 'pre-wrap'
    },
    timestamp: {
      fontSize: '0.75rem',
      marginTop: '0.6rem',
      opacity: 0.7
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'flex-start'
    },
    loadingMessage: {
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#f1f5f9',
      padding: '1rem 1.25rem',
      borderRadius: '1.25rem',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
    },
    loadingDots: {
      display: 'flex',
      gap: '0.5rem'
    },
    dot: {
      width: '8px',
      height: '8px',
      background: '#0066cc',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out'
    },
    inputArea: {
      background: 'rgba(22, 33, 62, 0.8)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid #3a4a6b',
      padding: '1.5rem'
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '1rem'
    },
    inputWrapper: {
      flex: 1,
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '1rem 1.25rem',
      background: 'rgba(30, 41, 59, 0.6)',
      border: '2px solid #3a4a6b',
      borderRadius: '1rem',
      color: 'white',
      resize: 'none',
      outline: 'none',
      maxHeight: '10rem',
      minHeight: '3rem',
      transition: 'all 0.3s ease',
      fontSize: '0.9rem',
      lineHeight: '1.5'
    },
    sendButton: {
      padding: '1rem',
      background: 'linear-gradient(135deg, #0066cc, #004499)',
      border: 'none',
      borderRadius: '1rem',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 6px 20px rgba(0, 102, 204, 0.3)'
    },
    sendButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    instructions: {
      fontSize: '0.8rem',
      color: '#94a3b8',
      textAlign: 'center',
      marginTop: '0.8rem'
    }
  };

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-12px); }
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
              <BikeIcon />
            </div>
            <div>
              <h1 style={styles.title}>BMW Motorrad AI Tour Manager</h1>
              <p style={styles.subtitle}>#MakeLifeARide</p>
            </div>
          </div>
          <button
            style={{
              ...styles.settingsButton,
              backgroundColor: showSettings ? 'rgba(58, 74, 107, 0.6)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!showSettings) e.target.style.backgroundColor = 'rgba(58, 74, 107, 0.4)';
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
              BMW Motorrad Knowledge Base & Persona
            </label>
            <textarea
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
              rows={12}
              style={styles.textarea}
              placeholder="Define the BMW Motorrad AI's persona and knowledge base..."
              onFocus={(e) => {
                e.target.style.borderColor = '#0066cc';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#3a4a6b';
                e.target.style.boxShadow = 'none';
              }}
            />
            <p style={styles.helperText}>
              Customize the BMW Motorrad AI's personality and knowledge to fit your touring needs
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
                color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : '#94a3b8'
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
              placeholder="Tell me about your dream touring adventure..."
              style={styles.input}
              rows={1}
              disabled={isLoading}
              onFocus={(e) => {
                e.target.style.borderColor = '#0066cc';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#3a4a6b';
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
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 102, 204, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!(!inputMessage.trim() || isLoading)) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 102, 204, 0.3)';
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