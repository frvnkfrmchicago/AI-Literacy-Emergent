import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('aiLearningProgress');
    return saved ? JSON.parse(saved) : {
      completedModules: [],
      streak: 0,
      lastActiveDate: null,
      totalXP: 0,
      badges: []
    };
  });
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aiLearningProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Check and update streak
  useEffect(() => {
    const today = new Date().toDateString();
    const lastActive = userProgress.lastActiveDate;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive === yesterday.toDateString()) {
        // Continue streak
        setUserProgress(prev => ({
          ...prev,
          streak: prev.streak + 1,
          lastActiveDate: today
        }));
      } else if (lastActive && lastActive !== today) {
        // Reset streak
        setUserProgress(prev => ({
          ...prev,
          streak: 1,
          lastActiveDate: today
        }));
      } else if (!lastActive) {
        // First time
        setUserProgress(prev => ({
          ...prev,
          streak: 1,
          lastActiveDate: today
        }));
      }
    }
  }, []);

  const modules = [
    {
      id: 'ai-basics',
      title: 'AI Fundamentals',
      description: 'What is AI really? Understanding the basics that power our digital world.',
      icon: '🧠',
      unlocked: true,
      xpReward: 100,
      lessons: [
        {
          title: 'What is Artificial Intelligence?',
          type: 'interactive',
          content: `
            <div class="lesson-content">
              <h3>Let's start with a simple question: What is AI?</h3>
              <p>Imagine you have a really smart assistant who can:</p>
              <ul>
                <li>🔍 Recognize your face in photos</li>
                <li>🗣️ Understand what you're saying</li>
                <li>🚗 Help navigate your car</li>
                <li>📧 Sort your emails</li>
              </ul>
              <div class="ai-definition">
                <h4>AI is technology that can perform tasks that typically require human intelligence.</h4>
              </div>
              <p>But here's the key: <strong>AI doesn't think like humans</strong>. It finds patterns in data and makes predictions based on those patterns.</p>
            </div>
          `,
          quiz: {
            question: "Which of these is the best definition of AI?",
            options: [
              "A robot that looks like a human",
              "Technology that can perform tasks requiring human-like intelligence",
              "A computer that can think exactly like humans",
              "Only chatbots like ChatGPT"
            ],
            correct: 1,
            explanation: "AI is about capability, not appearance or exact human-like thinking!"
          }
        },
        {
          title: 'AI in Your Daily Life',
          type: 'scenario',
          content: `
            <div class="lesson-content">
              <h3>AI is Already Everywhere Around You</h3>
              <div class="daily-ai-examples">
                <div class="ai-example">
                  <span class="icon">📱</span>
                  <div>
                    <h4>Your Phone</h4>
                    <p>Camera automatically focuses, Siri/Google Assistant, keyboard predictions</p>
                  </div>
                </div>
                <div class="ai-example">
                  <span class="icon">🛒</span>
                  <div>
                    <h4>Shopping</h4>
                    <p>Amazon recommendations, price comparisons, fraud detection on your credit card</p>
                  </div>
                </div>
                <div class="ai-example">
                  <span class="icon">🚗</span>
                  <div>
                    <h4>Transportation</h4>
                    <p>GPS routing, Uber/Lyft matching, traffic predictions</p>
                  </div>
                </div>
                <div class="ai-example">
                  <span class="icon">🎵</span>
                  <div>
                    <h4>Entertainment</h4>
                    <p>Spotify playlists, Netflix recommendations, Instagram feed curation</p>
                  </div>
                </div>
              </div>
              <p class="insight">💡 <strong>Most AI works behind the scenes</strong> - you don't even notice it's there!</p>
            </div>
          `,
          quiz: {
            question: "How many AI systems did you likely interact with today?",
            options: [
              "0-2",
              "3-5", 
              "6-10",
              "More than 10"
            ],
            correct: 3,
            explanation: "If you used your phone, social media, GPS, or online shopping, you've used 10+ AI systems!"
          }
        }
      ]
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning Basics',
      description: 'How machines learn from data - the engine behind modern AI.',
      icon: '⚙️',
      unlocked: () => userProgress.completedModules.includes('ai-basics'),
      xpReward: 150,
      lessons: [
        {
          title: 'What is Machine Learning?',
          type: 'interactive',
          content: `
            <div class="lesson-content">
              <h3>Machine Learning: Teaching Computers to Learn</h3>
              <div class="ml-analogy">
                <h4>Think of it like learning to recognize spam emails:</h4>
                <div class="learning-steps">
                  <div class="step">
                    <span class="step-number">1</span>
                    <div>
                      <h5>Show Examples</h5>
                      <p>Feed the computer thousands of emails labeled "spam" or "not spam"</p>
                    </div>
                  </div>
                  <div class="step">
                    <span class="step-number">2</span>
                    <div>
                      <h5>Find Patterns</h5>
                      <p>The computer notices spam often has words like "FREE!", "URGENT!", "CLICK NOW!"</p>
                    </div>
                  </div>
                  <div class="step">
                    <span class="step-number">3</span>
                    <div>
                      <h5>Make Predictions</h5>
                      <p>When new emails arrive, it can predict if they're spam based on these patterns</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="key-insight">
                <h4>🔑 Key Insight: ML learns from examples, not rules</h4>
                <p>Instead of programming every possible rule, we show it examples and let it figure out the patterns.</p>
              </div>
            </div>
          `,
          quiz: {
            question: "What's the main difference between traditional programming and machine learning?",
            options: [
              "ML is faster than regular programming",
              "Traditional programming uses rules, ML learns from examples",
              "ML only works with text data",
              "There's no real difference"
            ],
            correct: 1,
            explanation: "Traditional programming: We write the rules. Machine Learning: We provide examples and let it find the rules!"
          }
        }
      ]
    },
    {
      id: 'neural-networks',
      title: 'Neural Networks Simplified',
      description: 'Understanding the brain-inspired technology behind AI breakthroughs.',
      icon: '🕸️',
      unlocked: () => userProgress.completedModules.includes('machine-learning'),
      xpReward: 200,
      lessons: [
        {
          title: 'Neural Networks: AI\'s Brain',
          type: 'interactive',
          content: `
            <div class="lesson-content">
              <h3>Neural Networks: Inspired by the Human Brain</h3>
              <div class="brain-comparison">
                <div class="human-brain">
                  <h4>🧠 Human Brain</h4>
                  <ul>
                    <li>Billions of neurons</li>
                    <li>Connected in networks</li>
                    <li>Learn through connections</li>
                    <li>Process information in parallel</li>
                  </ul>
                </div>
                <div class="artificial-brain">
                  <h4>🤖 Artificial Neural Network</h4>
                  <ul>
                    <li>Artificial neurons (nodes)</li>
                    <li>Connected with weights</li>
                    <li>Learn by adjusting connections</li>
                    <li>Process data in layers</li>
                  </ul>
                </div>
              </div>
              <div class="simple-network">
                <h4>A Simple Example: Recognizing Handwritten Numbers</h4>
                <div class="network-flow">
                  <div class="layer">
                    <h5>Input Layer</h5>
                    <p>Pixels of the image</p>
                  </div>
                  <div class="arrow">→</div>
                  <div class="layer">
                    <h5>Hidden Layers</h5>
                    <p>Find patterns and features</p>
                  </div>
                  <div class="arrow">→</div>
                  <div class="layer">
                    <h5>Output Layer</h5>
                    <p>Prediction: "This is a 7"</p>
                  </div>
                </div>
              </div>
            </div>
          `,
          quiz: {
            question: "What's the key inspiration behind neural networks?",
            options: [
              "Computer circuits",
              "The human brain",
              "Spider webs",
              "Mathematical equations"
            ],
            correct: 1,
            explanation: "Neural networks are inspired by how neurons in the human brain connect and process information!"
          }
        }
      ]
    },
    {
      id: 'ai-ethics',
      title: 'AI Ethics & Bias',
      description: 'Understanding the responsible use of AI and potential pitfalls.',
      icon: '⚖️',
      unlocked: () => userProgress.completedModules.includes('neural-networks'),
      xpReward: 175,
      lessons: [
        {
          title: 'AI Bias: When Algorithms Aren\'t Fair',
          type: 'scenario',
          content: `
            <div class="lesson-content">
              <h3>AI Bias: The Problem with Unfair Algorithms</h3>
              <div class="bias-example">
                <h4>🚨 Real Example: Hiring Algorithm Gone Wrong</h4>
                <p>A major tech company built an AI system to screen job resumes. The problem?</p>
                <div class="problem-solution">
                  <div class="problem">
                    <h5>The Problem:</h5>
                    <ul>
                      <li>Training data: 10 years of resumes from mostly male hires</li>
                      <li>AI learned: "Good candidates look like past hires"</li>
                      <li>Result: System downgraded resumes with words like "women's" (e.g., "women's chess club captain")</li>
                    </ul>
                  </div>
                  <div class="lesson-learned">
                    <h5>💡 What We Learn:</h5>
                    <ul>
                      <li>AI reflects the biases in its training data</li>
                      <li>Past discrimination gets baked into future decisions</li>
                      <li>We need diverse teams and careful testing</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="bias-types">
                <h4>Common Types of AI Bias:</h4>
                <div class="bias-type">
                  <h5>📊 Data Bias</h5>
                  <p>Training data doesn't represent everyone fairly</p>
                </div>
                <div class="bias-type">
                  <h5>🔍 Confirmation Bias</h5>
                  <p>AI confirms existing stereotypes</p>
                </div>
                <div class="bias-type">
                  <h5>🎯 Selection Bias</h5>
                  <p>Some groups are left out of the data entirely</p>
                </div>
              </div>
            </div>
          `,
          quiz: {
            question: "Why does AI bias occur?",
            options: [
              "Computers are naturally biased",
              "AI reflects biases in the data it's trained on",
              "Programmers intentionally add bias",
              "AI bias is just a myth"
            ],
            correct: 1,
            explanation: "AI systems learn from data created by humans, so they inherit human biases present in that data."
          }
        }
      ]
    },
    {
      id: 'ai-tools',
      title: 'AI Tools You Can Use Today',
      description: 'Practical AI tools that can enhance your productivity right now.',
      icon: '🛠️',
      unlocked: () => userProgress.completedModules.includes('ai-ethics'),
      xpReward: 125,
      lessons: [
        {
          title: 'ChatGPT and Language Models',
          type: 'interactive',
          content: `
            <div class="lesson-content">
              <h3>ChatGPT & Language Models: Your AI Writing Assistant</h3>
              <div class="tool-overview">
                <div class="what-it-does">
                  <h4>What it does:</h4>
                  <ul>
                    <li>✍️ Writes and edits text</li>
                    <li>🔍 Answers questions</li>
                    <li>💡 Brainstorms ideas</li>
                    <li>🔧 Helps with coding</li>
                    <li>📚 Explains complex topics</li>
                  </ul>
                </div>
                <div class="how-to-use">
                  <h4>Pro Tips for Better Results:</h4>
                  <div class="tip">
                    <h5>Be Specific</h5>
                    <p>❌ "Write about marketing"<br>✅ "Write a 300-word email marketing strategy for a small bakery"</p>
                  </div>
                  <div class="tip">
                    <h5>Give Context</h5>
                    <p>❌ "Make this better"<br>✅ "Make this email more professional for a client presentation"</p>
                  </div>
                  <div class="tip">
                    <h5>Ask for Structure</h5>
                    <p>❌ "Explain AI"<br>✅ "Explain AI in 3 bullet points for a business presentation"</p>
                  </div>
                </div>
              </div>
              <div class="other-tools">
                <h4>Other Powerful AI Tools:</h4>
                <div class="tool">
                  <h5>🎨 DALL-E / Midjourney</h5>
                  <p>Create images from text descriptions</p>
                </div>
                <div class="tool">
                  <h5>🎵 Suno AI</h5>
                  <p>Generate music and songs</p>
                </div>
                <div class="tool">
                  <h5>📹 Runway ML</h5>
                  <p>AI video editing and creation</p>
                </div>
                <div class="tool">
                  <h5>💻 GitHub Copilot</h5>
                  <p>AI coding assistant</p>
                </div>
              </div>
            </div>
          `,
          quiz: {
            question: "What's the key to getting better results from AI tools like ChatGPT?",
            options: [
              "Use as few words as possible",
              "Be specific and provide context",
              "Only ask yes/no questions",
              "Avoid giving examples"
            ],
            correct: 1,
            explanation: "The more specific and contextual your prompts, the better AI can understand and help you!"
          }
        }
      ]
    },
    {
      id: 'future-of-ai',
      title: 'Future of Work with AI',
      description: 'How AI will change jobs and what skills will matter most.',
      icon: '🚀',
      unlocked: () => userProgress.completedModules.includes('ai-tools'),
      xpReward: 200,
      lessons: [
        {
          title: 'AI and Your Career',
          type: 'scenario',
          content: `
            <div class="lesson-content">
              <h3>The Future of Work: Humans + AI</h3>
              <div class="future-vision">
                <h4>The Big Picture:</h4>
                <p>AI won't replace humans—it will augment human capabilities. The key is learning to work <em>with</em> AI, not against it.</p>
              </div>
              <div class="job-categories">
                <div class="category safe">
                  <h4>🟢 Jobs That Will Thrive</h4>
                  <ul>
                    <li>Creative roles (design, storytelling, innovation)</li>
                    <li>Human-centered jobs (therapy, teaching, leadership)</li>
                    <li>Complex problem-solving (research, strategy)</li>
                    <li>AI specialists (prompt engineering, AI ethics)</li>
                  </ul>
                </div>
                <div class="category evolving">
                  <h4>🟡 Jobs That Will Evolve</h4>
                  <ul>
                    <li>Marketing (AI-assisted campaigns)</li>
                    <li>Writing (AI-enhanced content creation)</li>
                    <li>Programming (AI pair programming)</li>
                    <li>Customer service (AI-human hybrid support)</li>
                  </ul>
                </div>
                <div class="category at-risk">
                  <h4>🔴 Jobs Most At Risk</h4>
                  <ul>
                    <li>Repetitive data entry</li>
                    <li>Basic content moderation</li>
                    <li>Simple assembly line work</li>
                    <li>Basic bookkeeping</li>
                  </ul>
                </div>
              </div>
              <div class="skills-for-future">
                <h4>🎯 Skills to Develop Now:</h4>
                <div class="skill">
                  <h5>AI Literacy</h5>
                  <p>Understanding how to work with AI tools effectively</p>
                </div>
                <div class="skill">
                  <h5>Critical Thinking</h5>
                  <p>Evaluating AI outputs and making human judgments</p>
                </div>
                <div class="skill">
                  <h5>Emotional Intelligence</h5>
                  <p>Human skills that AI can't replicate</p>
                </div>
                <div class="skill">
                  <h5>Adaptability</h5>
                  <p>Learning new tools and adjusting to change</p>
                </div>
              </div>
            </div>
          `,
          quiz: {
            question: "What's the best strategy for thriving in an AI-powered future?",
            options: [
              "Avoid using AI tools completely",
              "Learn to work effectively with AI as a collaborator",
              "Only focus on technical AI skills",
              "Wait and see what happens"
            ],
            correct: 1,
            explanation: "The future belongs to humans who can effectively collaborate with AI, combining human creativity and judgment with AI capabilities!"
          }
        }
      ]
    }
  ];

  const completeModule = (moduleId) => {
    if (!userProgress.completedModules.includes(moduleId)) {
      const module = modules.find(m => m.id === moduleId);
      setUserProgress(prev => ({
        ...prev,
        completedModules: [...prev.completedModules, moduleId],
        totalXP: prev.totalXP + module.xpReward,
        badges: [...prev.badges, `${module.title} Master`]
      }));
    }
  };

  const getUnlockedModules = () => {
    return modules.filter(module => {
      if (module.unlocked === true) return true;
      if (typeof module.unlocked === 'function') return module.unlocked();
      return false;
    });
  };

  const Header = () => (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <img 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" 
              alt="AI Asset Persona Logo" 
              className="logo-image"
            />
            <div className="logo-text">
              <span className="logo-ai">AI ASSET PERSONA</span>
              <div className="logo-subtitle">Learn</div>
            </div>
          </div>
          <div className="streak-counter">
            🔥 {userProgress.streak} day streak
          </div>
        </div>
        <div className="xp-counter">
          ⭐ {userProgress.totalXP} XP
        </div>
      </div>
    </header>
  );

  const ModuleCard = ({ module }) => {
    const isUnlocked = module.unlocked === true || (typeof module.unlocked === 'function' && module.unlocked());
    const isCompleted = userProgress.completedModules.includes(module.id);
    
    return (
      <div 
        className={`module-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
        onClick={() => isUnlocked && setSelectedModule(module)}
      >
        <div className="module-icon">{module.icon}</div>
        <h3>{module.title}</h3>
        <p>{module.description}</p>
        <div className="module-footer">
          <div className="xp-reward">+{module.xpReward} XP</div>
          {isCompleted && <div className="completion-badge">✅ Completed</div>}
          {!isUnlocked && <div className="lock-icon">🔒</div>}
        </div>
      </div>
    );
  };

  const LessonView = () => {
    const lesson = selectedModule.lessons[currentLesson];
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const nextLesson = () => {
      if (currentLesson < selectedModule.lessons.length - 1) {
        setCurrentLesson(prev => prev + 1);
        setShowQuiz(false);
        setShowResult(false);
        setSelectedAnswer(null);
      } else {
        completeModule(selectedModule.id);
        setCurrentView('home');
        setSelectedModule(null);
        setCurrentLesson(0);
      }
    };

    return (
      <div className="lesson-view">
        <div className="lesson-header">
          <button 
            className="back-btn"
            onClick={() => setCurrentView('home')}
          >
            ← Back to Dashboard
          </button>
          <div className="lesson-progress">
            Lesson {currentLesson + 1} of {selectedModule.lessons.length}
          </div>
        </div>

        <div className="lesson-container">
          <h2>{lesson.title}</h2>
          
          {!showQuiz ? (
            <div className="lesson-content-wrapper">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              <button 
                className="continue-btn"
                onClick={() => setShowQuiz(true)}
              >
                Continue to Quiz →
              </button>
            </div>
          ) : (
            <div className="quiz-section">
              <h3>Quick Check:</h3>
              <p className="quiz-question">{lesson.quiz.question}</p>
              <div className="quiz-options">
                {lesson.quiz.options.map((option, index) => (
                  <button
                    key={index}
                    className={`quiz-option ${selectedAnswer === index ? 'selected' : ''} ${
                      showResult ? (index === lesson.quiz.correct ? 'correct' : selectedAnswer === index ? 'incorrect' : '') : ''
                    }`}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    disabled={showResult}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {selectedAnswer !== null && !showResult && (
                <button 
                  className="submit-quiz-btn"
                  onClick={() => setShowResult(true)}
                >
                  Submit Answer
                </button>
              )}
              
              {showResult && (
                <div className="quiz-result">
                  <div className={`result-message ${selectedAnswer === lesson.quiz.correct ? 'correct' : 'incorrect'}`}>
                    {selectedAnswer === lesson.quiz.correct ? '🎉 Correct!' : '❌ Not quite right'}
                  </div>
                  <p className="explanation">{lesson.quiz.explanation}</p>
                  <button className="next-lesson-btn" onClick={nextLesson}>
                    {currentLesson < selectedModule.lessons.length - 1 ? 'Next Lesson →' : 'Complete Module! 🎉'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const unlockedModules = getUnlockedModules();
    const lockedModules = modules.filter(m => !unlockedModules.includes(m));

    return (
      <div className="dashboard">
        <div className="hero-section">
          <h1>Master AI Concepts</h1>
          <p>Learn artificial intelligence through interactive lessons and real-world examples</p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">{userProgress.completedModules.length}</div>
              <div className="stat-label">Modules Completed</div>
            </div>
            <div className="stat">
              <div className="stat-number">{userProgress.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="stat">
              <div className="stat-number">{userProgress.totalXP}</div>
              <div className="stat-label">Total XP</div>
            </div>
          </div>
        </div>

        <div className="modules-section">
          <h2>Available Modules</h2>
          <div className="modules-grid">
            {unlockedModules.map(module => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
          
          {lockedModules.length > 0 && (
            <>
              <h2>Coming Soon</h2>
              <div className="modules-grid">
                {lockedModules.map(module => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            </>
          )}
        </div>

        {userProgress.badges.length > 0 && (
          <div className="badges-section">
            <h2>Your Achievements</h2>
            <div className="badges-grid">
              {userProgress.badges.map((badge, index) => (
                <div key={index} className="badge">
                  🏆 {badge}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {currentView === 'home' && !selectedModule && <Dashboard />}
        {selectedModule && <LessonView />}
      </main>
    </div>
  );
};

export default App;