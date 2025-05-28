import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('signup');
  const [currentUser, setCurrentUser] = useState(null);
  const [userProgress, setUserProgress] = useState({
    completedModules: [],
    streak: 0,
    lastActiveDate: null,
    totalXP: 0,
    badges: []
  });
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);

  // Load user data and progress
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      
      // Load user's progress
      const savedProgress = localStorage.getItem(`progress_${user.email}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
      setCurrentView('home');
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`progress_${currentUser.email}`, JSON.stringify(userProgress));
      
      // Also save to a master user list for tracking
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const userIndex = allUsers.findIndex(u => u.email === currentUser.email);
      const userWithProgress = {
        ...currentUser,
        progress: userProgress,
        lastActive: new Date().toISOString()
      };
      
      if (userIndex >= 0) {
        allUsers[userIndex] = userWithProgress;
      } else {
        allUsers.push(userWithProgress);
      }
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
  }, [userProgress, currentUser]);

  // Check and update streak
  useEffect(() => {
    if (!currentUser) return;
    
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
  }, [currentUser]);

  const handleSignup = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('signup');
    setUserProgress({
      completedModules: [],
      streak: 0,
      lastActiveDate: null,
      totalXP: 0,
      badges: []
    });
  };

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
      id: 'ai-in-action',
      title: 'AI in Action: Real Case Studies',
      description: 'See how major companies are using AI to transform their businesses.',
      icon: '🏢',
      unlocked: () => userProgress.completedModules.includes('ai-tools'),
      xpReward: 200,
      lessons: [
        {
          title: 'Netflix: The AI Recommendation Engine',
          type: 'scenario',
          content: `
            <div class="lesson-content">
              <h3>How Netflix Uses AI to Keep You Watching</h3>
              
              <div class="case-study-overview">
                <div class="company-stats">
                  <h4>📊 The Numbers:</h4>
                  <div class="stats-grid">
                    <div class="stat-item">
                      <div class="stat-number">80%</div>
                      <div class="stat-desc">of content watched comes from AI recommendations</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">$1B</div>
                      <div class="stat-desc">saved annually through reduced churn</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">10+</div>
                      <div class="stat-desc">different AI algorithms working together</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="ai-system-breakdown">
                <h4>🤖 Netflix's AI Arsenal:</h4>
                <div class="ai-systems">
                  <div class="ai-system">
                    <h5>👤 Personalization Algorithm</h5>
                    <p><strong>What it does:</strong> Analyzes your viewing history, time of day, device used, and even where you pause or skip</p>
                    <p><strong>Result:</strong> Your homepage looks completely different from everyone else's</p>
                  </div>
                  
                  <div class="ai-system">
                    <h5>🎨 Artwork Personalization</h5>
                    <p><strong>What it does:</strong> Shows different movie posters to different users based on their preferences</p>
                    <p><strong>Example:</strong> Action fans see explosion scenes, romance fans see couples</p>
                  </div>
                  
                  <div class="ai-system">
                    <h5>🎬 Content Creation AI</h5>
                    <p><strong>What it does:</strong> Analyzes successful content patterns to guide new show development</p>
                    <p><strong>Result:</strong> Data-driven decisions on which shows to greenlight</p>
                  </div>
                  
                  <div class="ai-system">
                    <h5>📱 Quality Optimization</h5>
                    <p><strong>What it does:</strong> Adjusts video quality in real-time based on your internet speed</p>
                    <p><strong>Result:</strong> Seamless streaming without buffering</p>
                  </div>
                </div>
              </div>
              
              <div class="business-impact">
                <h4>💰 Business Impact:</h4>
                <div class="impact-areas">
                  <div class="impact-area">
                    <h5>🎯 User Engagement</h5>
                    <p>Average viewing time increased by 75% since implementing AI recommendations</p>
                  </div>
                  <div class="impact-area">
                    <h5>💾 Content Costs</h5>
                    <p>AI helps predict which content will be popular, reducing expensive flops</p>
                  </div>
                  <div class="impact-area">
                    <h5>🌍 Global Expansion</h5>
                    <p>AI enables personalization across different cultures and languages</p>
                  </div>
                </div>
              </div>
              
              <div class="lessons-learned">
                <h4>🎓 Key Takeaways for Your Business:</h4>
                <div class="takeaway">
                  <h5>1. Start with Data Collection</h5>
                  <p>Netflix didn't start with complex AI - they began by tracking what users watched</p>
                </div>
                <div class="takeaway">
                  <h5>2. Focus on User Experience</h5>
                  <p>Every AI feature serves to make the user experience better, not just to be "cool"</p>
                </div>
                <div class="takeaway">
                  <h5>3. Test Everything</h5>
                  <p>Netflix runs thousands of A/B tests to continuously improve their algorithms</p>
                </div>
                <div class="takeaway">
                  <h5>4. Personalization = Retention</h5>
                  <p>The more personalized the experience, the less likely users are to cancel</p>
                </div>
              </div>
            </div>
          `,
          quiz: {
            question: "What's the most important factor in Netflix's AI success?",
            options: [
              "Having the most advanced technology",
              "Focusing on user experience and data collection",
              "Spending the most money on AI",
              "Copying what competitors do"
            ],
            correct: 1,
            explanation: "Netflix succeeds because they focus on user experience and systematically collect data to improve it, not just because they have fancy technology!"
          }
        }
      ]
    },
    {
      id: 'ai-careers',
      title: 'AI Career Opportunities',
      description: 'Discover high-paying AI careers and how to break into them.',
      icon: '💼',
      unlocked: () => userProgress.completedModules.includes('ai-in-action'),
      xpReward: 300,
      lessons: [
        {
          title: 'Hottest AI Jobs in 2025',
          type: 'interactive',
          content: `
            <div class="lesson-content">
              <h3>AI Careers: Where the Money and Opportunity Are</h3>
              
              <div class="salary-overview">
                <h4>💰 AI Salary Ranges (2025):</h4>
                <div class="salary-tiers">
                  <div class="salary-tier entry">
                    <h5>🌱 Entry Level (0-2 years)</h5>
                    <div class="salary-range">$70K - $120K</div>
                    <p>Junior roles, bootcamp graduates, career changers</p>
                  </div>
                  <div class="salary-tier mid">
                    <h5>📈 Mid Level (3-5 years)</h5>
                    <div class="salary-range">$120K - $200K</div>
                    <p>Experienced practitioners, specialized skills</p>
                  </div>
                  <div class="salary-tier senior">
                    <h5>🚀 Senior Level (5+ years)</h5>
                    <div class="salary-range">$200K - $500K+</div>
                    <p>AI architects, research leads, top talent at big tech</p>
                  </div>
                </div>
              </div>
              
              <div class="career-paths">
                <h4>🎯 Top AI Career Paths:</h4>
                
                <div class="career-path technical">
                  <h5>👨‍💻 Technical Roles</h5>
                  <div class="roles-list">
                    <div class="role">
                      <h6>Machine Learning Engineer</h6>
                      <p><strong>What:</strong> Build and deploy ML models in production</p>
                      <p><strong>Skills:</strong> Python, TensorFlow, Cloud platforms, MLOps</p>
                      <p><strong>Salary:</strong> $130K - $300K</p>
                    </div>
                    
                    <div class="role">
                      <h6>AI Research Scientist</h6>
                      <p><strong>What:</strong> Develop new AI algorithms and techniques</p>
                      <p><strong>Skills:</strong> PhD preferred, research experience, mathematics</p>
                      <p><strong>Salary:</strong> $180K - $500K+</p>
                    </div>
                    
                    <div class="role">
                      <h6>Data Scientist</h6>
                      <p><strong>What:</strong> Extract insights from data using AI/ML</p>
                      <p><strong>Skills:</strong> Statistics, Python/R, SQL, domain expertise</p>
                      <p><strong>Salary:</strong> $110K - $250K</p>
                    </div>
                  </div>
                </div>
                
                <div class="career-path business">
                  <h5>💼 Business-Focused Roles</h5>
                  <div class="roles-list">
                    <div class="role">
                      <h6>AI Product Manager</h6>
                      <p><strong>What:</strong> Guide AI product development and strategy</p>
                      <p><strong>Skills:</strong> Product management, AI understanding, business acumen</p>
                      <p><strong>Salary:</strong> $140K - $350K</p>
                    </div>
                    
                    <div class="role">
                      <h6>AI Ethics Specialist</h6>
                      <p><strong>What:</strong> Ensure responsible AI development and deployment</p>
                      <p><strong>Skills:</strong> Ethics, policy, AI knowledge, communication</p>
                      <p><strong>Salary:</strong> $120K - $250K</p>
                    </div>
                    
                    <div class="role">
                      <h6>AI Consultant</h6>
                      <p><strong>What:</strong> Help companies implement AI solutions</p>
                      <p><strong>Skills:</strong> Business analysis, AI knowledge, project management</p>
                      <p><strong>Salary:</strong> $100K - $300K (or $500+ per hour)</p>
                    </div>
                  </div>
                </div>
                
                <div class="career-path creative">
                  <h5>🎨 Creative & Emerging Roles</h5>
                  <div class="roles-list">
                    <div class="role">
                      <h6>Prompt Engineer</h6>
                      <p><strong>What:</strong> Optimize AI prompts for best results</p>
                      <p><strong>Skills:</strong> Language skills, AI tool expertise, creativity</p>
                      <p><strong>Salary:</strong> $80K - $200K</p>
                    </div>
                    
                    <div class="role">
                      <h6>AI Content Creator</h6>
                      <p><strong>What:</strong> Create content using AI tools professionally</p>
                      <p><strong>Skills:</strong> Creative skills, AI tools mastery, marketing</p>
                      <p><strong>Salary:</strong> $60K - $150K (highly variable)</p>
                    </div>
                    
                    <div class="role">
                      <h6>AI Trainer</h6>
                      <p><strong>What:</strong> Train teams and individuals on AI tools</p>
                      <p><strong>Skills:</strong> Teaching, AI expertise, curriculum development</p>
                      <p><strong>Salary:</strong> $70K - $180K</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="getting-started-careers">
                <h4>🚀 How to Break Into AI (Step by Step):</h4>
                <div class="career-roadmap">
                  <div class="roadmap-step">
                    <span class="step-number">1</span>
                    <div class="step-content">
                      <h5>Build Foundation (Months 1-3)</h5>
                      <ul>
                        <li>Learn Python basics (free: Python.org tutorial)</li>
                        <li>Complete Andrew Ng's Machine Learning Course</li>
                        <li>Start using AI tools daily (ChatGPT, etc.)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div class="roadmap-step">
                    <span class="step-number">2</span>
                    <div class="step-content">
                      <h5>Choose Your Path (Month 4)</h5>
                      <ul>
                        <li>Technical: Focus on coding and math</li>
                        <li>Business: Focus on strategy and communication</li>
                        <li>Creative: Focus on AI tools and content</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div class="roadmap-step">
                    <span class="step-number">3</span>
                    <div class="step-content">
                      <h5>Build Portfolio (Months 5-8)</h5>
                      <ul>
                        <li>Complete 3-5 real projects</li>
                        <li>Document everything on GitHub</li>
                        <li>Write blog posts about your learning</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div class="roadmap-step">
                    <span class="step-number">4</span>
                    <div class="step-content">
                      <h5>Get Experience (Months 9-12)</h5>
                      <ul>
                        <li>Apply for internships or entry-level roles</li>
                        <li>Contribute to open-source AI projects</li>
                        <li>Network with AI professionals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="career-resources">
                <h4>📚 Essential Resources:</h4>
                <div class="resource-categories">
                  <div class="resource-category">
                    <h5>🎓 Free Learning</h5>
                    <ul>
                      <li>Coursera ML Course (Andrew Ng)</li>
                      <li>Fast.ai Practical Deep Learning</li>
                      <li>Kaggle Learn (micro-courses)</li>
                      <li>YouTube (3Blue1Brown, Two Minute Papers)</li>
                    </ul>
                  </div>
                  
                  <div class="resource-category">
                    <h5>💻 Practice Platforms</h5>
                    <ul>
                      <li>Kaggle (competitions)</li>
                      <li>Google Colab (free coding)</li>
                      <li>GitHub (version control)</li>
                      <li>HuggingFace (pre-trained models)</li>
                    </ul>
                  </div>
                  
                  <div class="resource-category">
                    <h5>🌐 Networking</h5>
                    <ul>
                      <li>LinkedIn AI groups</li>
                      <li>Reddit r/MachineLearning</li>
                      <li>Local AI meetups</li>
                      <li>Twitter AI community</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          `,
          quiz: {
            question: "What's the most important first step to break into AI careers?",
            options: [
              "Get a PhD in computer science",
              "Spend $50,000 on a bootcamp",
              "Build a foundation with free resources and start using AI tools",
              "Apply to AI jobs immediately"
            ],
            correct: 2,
            explanation: "Building a solid foundation with free resources and getting hands-on experience with AI tools is the most practical and cost-effective way to start your AI career!"
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
      description: 'Master the hottest AI tools that are revolutionizing work and creativity in 2025.',
      icon: '🛠️',
      unlocked: () => userProgress.completedModules.includes('ai-ethics'),
      xpReward: 250,
      lessons: [
        {
          title: 'ChatGPT & Google Gemini: AI Assistants Revolution',
          type: 'interactive',
          content: `
            <div class="lesson-content">
              <h3>The AI Assistant Battle: ChatGPT vs Google Gemini</h3>
              <div class="ai-assistant-comparison">
                <div class="assistant-card chatgpt">
                  <h4>🤖 ChatGPT (OpenAI)</h4>
                  <div class="strengths">
                    <h5>Strengths:</h5>
                    <ul>
                      <li>Excellent creative writing and storytelling</li>
                      <li>Strong coding assistance and debugging</li>
                      <li>Great for brainstorming and ideation</li>
                      <li>Consistent, conversational responses</li>
                    </ul>
                  </div>
                  <div class="best-for">
                    <h5>🎯 Best For:</h5>
                    <p>Content creation, programming help, creative projects, learning complex topics</p>
                  </div>
                </div>
                
                <div class="assistant-card gemini">
                  <h4>💎 Google Gemini</h4>
                  <div class="strengths">
                    <h5>Strengths:</h5>
                    <ul>
                      <li>Real-time internet access for current info</li>
                      <li>Integration with Google services (Gmail, Docs, etc.)</li>
                      <li>Strong analytical and research capabilities</li>
                      <li>Multimodal (text, images, video understanding)</li>
                    </ul>
                  </div>
                  <div class="best-for">
                    <h5>🎯 Best For:</h5>
                    <p>Research, current events, Google workspace integration, data analysis</p>
                  </div>
                </div>
              </div>
              
              <div class="pro-prompting-guide">
                <h4>🚀 Master Prompting Techniques</h4>
                <div class="prompting-framework">
                  <h5>The CLEAR Framework:</h5>
                  <div class="framework-step">
                    <strong>C - Context:</strong> "You are a marketing expert helping a small bakery..."
                  </div>
                  <div class="framework-step">
                    <strong>L - Length:</strong> "Write a 200-word email..."
                  </div>
                  <div class="framework-step">
                    <strong>E - Examples:</strong> "Similar to how Apple markets simplicity..."
                  </div>
                  <div class="framework-step">
                    <strong>A - Audience:</strong> "For busy working parents aged 25-40..."
                  </div>
                  <div class="framework-step">
                    <strong>R - Role:</strong> "Act as a professional copywriter..."
                  </div>
                </div>
                
                <div class="prompt-examples">
                  <div class="example">
                    <h6>❌ Weak Prompt:</h6>
                    <p>"Write about marketing"</p>
                  </div>
                  <div class="example">
                    <h6>✅ Strong Prompt:</h6>
                    <p>"You are a digital marketing consultant. Write a 300-word strategy for a local coffee shop to increase Instagram engagement among college students aged 18-24. Include 3 specific tactics with expected outcomes, similar to how Starbucks uses user-generated content."</p>
                  </div>
                </div>
              </div>
            </div>
          `,
          quiz: {
            question: "What's the main advantage of Google Gemini over ChatGPT?",
            options: [
              "Better creative writing capabilities",
              "Real-time internet access and Google integration",
              "Faster response times",
              "Better at coding tasks"
            ],
            correct: 1,
            explanation: "Gemini's real-time internet access and deep Google services integration make it superior for research and current information tasks!"
          }
        },
        {
          title: 'Leonardo AI & DALL-E: The Creative Revolution',
          type: 'interactive',
          content: `
            <div class="lesson-content">
              <h3>AI Art Generation: From Concept to Masterpiece</h3>
              
              <div class="ai-art-tools">
                <div class="tool-showcase leonardo">
                  <h4>🎨 Leonardo AI</h4>
                  <div class="tool-features">
                    <div class="feature">
                      <h5>🎯 Specialty: Realistic Art & Characters</h5>
                      <ul>
                        <li>Photorealistic portraits and landscapes</li>
                        <li>Game character design and concept art</li>
                        <li>Architectural visualization</li>
                        <li>Fashion and product photography</li>
                      </ul>
                    </div>
                    <div class="pricing">
                      <h6>💰 Pricing:</h6>
                      <p>Free tier: 150 tokens/day | Pro: $10/month</p>
                    </div>
                  </div>
                </div>
                
                <div class="tool-showcase dalle">
                  <h4>🖼️ DALL-E 3</h4>
                  <div class="tool-features">
                    <div class="feature">
                      <h5>🎯 Specialty: Creative & Stylized Art</h5>
                      <ul>
                        <li>Artistic styles and abstract concepts</li>
                        <li>Marketing visuals and logos</li>
                        <li>Illustration and cartoon styles</li>
                        <li>Text integration in images</li>
                      </ul>
                    </div>
                    <div class="pricing">
                      <h6>💰 Pricing:</h6>
                      <p>ChatGPT Plus: $20/month | API: $0.04 per image</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="prompt-mastery">
                <h4>🎨 Master Art Prompting</h4>
                <div class="prompt-structure">
                  <h5>The Perfect Art Prompt Structure:</h5>
                  <div class="prompt-parts">
                    <div class="part">
                      <strong>1. Subject:</strong> "A confident businesswoman"
                    </div>
                    <div class="part">
                      <strong>2. Style:</strong> "in the style of Annie Leibovitz photography"
                    </div>
                    <div class="part">
                      <strong>3. Details:</strong> "wearing a navy blue suit, sitting at a modern glass desk"
                    </div>
                    <div class="part">
                      <strong>4. Lighting:</strong> "with dramatic side lighting"
                    </div>
                    <div class="part">
                      <strong>5. Quality:</strong> "8K, ultra-detailed, professional photography"
                    </div>
                  </div>
                </div>
                
                <div class="style-examples">
                  <h5>🎨 Popular Style Keywords:</h5>
                  <div class="styles-grid">
                    <div class="style-tag">Photorealistic</div>
                    <div class="style-tag">Cinematic</div>
                    <div class="style-tag">Minimalist</div>
                    <div class="style-tag">Cyberpunk</div>
                    <div class="style-tag">Watercolor</div>
                    <div class="style-tag">Concept Art</div>
                    <div class="style-tag">Studio Photography</div>
                    <div class="style-tag">Digital Art</div>
                  </div>
                </div>
              </div>
              
              <div class="real-world-applications">
                <h4>💼 Real Business Applications:</h4>
                <div class="application">
                  <h5>📱 Social Media Content</h5>
                  <p>Create custom visuals for Instagram, LinkedIn posts, and marketing campaigns</p>
                </div>
                <div class="application">
                  <h5>🏢 Business Presentations</h5>
                  <p>Generate professional illustrations, icons, and concept visuals</p>
                </div>
                <div class="application">
                  <h5>🛍️ E-commerce</h5>
                  <p>Product mockups, lifestyle images, and promotional graphics</p>
                </div>
                <div class="application">
                  <h5>📚 Content Creation</h5>
                  <p>Blog headers, infographics, and educational visuals</p>
                </div>
              </div>
            </div>
          `,
          quiz: {
            question: "What's Leonardo AI's main strength compared to DALL-E?",
            options: [
              "Better text integration",
              "Lower pricing",
              "More photorealistic and character-focused art",
              "Faster generation speed"
            ],
            correct: 2,
            explanation: "Leonardo AI excels at photorealistic art, character design, and game concept art, while DALL-E is better for creative and stylized art!"
          }
        },
        {
          title: 'AI Video & Music: Suno, Runway, and More',
          type: 'interactive',
          content: `
            <div class="lesson-content">
              <h3>The Future is Here: AI-Generated Media</h3>
              
              <div class="media-tools-showcase">
                <div class="media-tool suno">
                  <h4>🎵 Suno AI - AI Music Generation</h4>
                  <div class="tool-capabilities">
                    <h5>What it does:</h5>
                    <ul>
                      <li>Generates complete songs with lyrics and vocals</li>
                      <li>Multiple genres: Pop, Rock, Jazz, Electronic, etc.</li>
                      <li>Custom lyrics or AI-generated lyrics</li>
                      <li>Professional-quality audio output</li>
                    </ul>
                    <div class="use-cases">
                      <h6>💡 Use Cases:</h6>
                      <p>Podcast intros, background music, jingles, personal songs, prototyping</p>
                    </div>
                  </div>
                </div>
                
                <div class="media-tool runway">
                  <h4>🎬 Runway ML - AI Video Creation</h4>
                  <div class="tool-capabilities">
                    <h5>Powerful Features:</h5>
                    <ul>
                      <li>Text-to-video generation</li>
                      <li>Image-to-video animation</li>
                      <li>Video editing and effects</li>
                      <li>Green screen removal</li>
                      <li>Motion tracking and object removal</li>
                    </ul>
                    <div class="use-cases">
                      <h6>💡 Use Cases:</h6>
                      <p>Social media content, product demos, marketing videos, creative projects</p>
                    </div>
                  </div>
                </div>
                
                <div class="media-tool other-tools">
                  <h4>🔧 Other Essential AI Tools</h4>
                  <div class="tools-list">
                    <div class="tool-item">
                      <h5>💻 GitHub Copilot</h5>
                      <p>AI pair programmer - writes code as you type</p>
                    </div>
                    <div class="tool-item">
                      <h5>📝 Notion AI</h5>
                      <p>AI writing assistant integrated into Notion workspace</p>
                    </div>
                    <div class="tool-item">
                      <h5>🎙️ Murf AI</h5>
                      <p>AI voice generation for podcasts and voiceovers</p>
                    </div>
                    <div class="tool-item">
                      <h5>📊 Beautiful.AI</h5>
                      <p>AI-powered presentation design</p>
                    </div>
                    <div class="tool-item">
                      <h5>🔍 Perplexity AI</h5>
                      <p>AI search engine with real-time information</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="ai-workflow">
                <h4>🚀 Building an AI-Powered Workflow</h4>
                <div class="workflow-example">
                  <h5>Example: Creating a Marketing Campaign</h5>
                  <div class="workflow-steps">
                    <div class="workflow-step">
                      <span class="step-number">1</span>
                      <div class="step-content">
                        <h6>Research & Planning</h6>
                        <p><strong>Perplexity AI:</strong> Research market trends and competitor analysis</p>
                      </div>
                    </div>
                    <div class="workflow-step">
                      <span class="step-number">2</span>
                      <div class="step-content">
                        <h6>Content Creation</h6>
                        <p><strong>ChatGPT/Gemini:</strong> Write compelling copy and social media posts</p>
                      </div>
                    </div>
                    <div class="workflow-step">
                      <span class="step-number">3</span>
                      <div class="step-content">
                        <h6>Visual Design</h6>
                        <p><strong>Leonardo AI:</strong> Create eye-catching marketing visuals</p>
                      </div>
                    </div>
                    <div class="workflow-step">
                      <span class="step-number">4</span>
                      <div class="step-content">
                        <h6>Video Content</h6>
                        <p><strong>Runway ML:</strong> Produce engaging video advertisements</p>
                      </div>
                    </div>
                    <div class="workflow-step">
                      <span class="step-number">5</span>
                      <div class="step-content">
                        <h6>Audio Branding</h6>
                        <p><strong>Suno AI:</strong> Generate custom jingles and background music</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="productivity-boost">
                  <h5>📈 Productivity Impact:</h5>
                  <div class="impact-stats">
                    <div class="stat">
                      <div class="stat-number">10x</div>
                      <div class="stat-label">Faster Content Creation</div>
                    </div>
                    <div class="stat">
                      <div class="stat-number">80%</div>
                      <div class="stat-label">Cost Reduction</div>
                    </div>
                    <div class="stat">
                      <div class="stat-number">24/7</div>
                      <div class="stat-label">Creative Availability</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="getting-started">
                <h4>🎯 Your AI Tools Action Plan</h4>
                <div class="action-steps">
                  <div class="action-step">
                    <h5>Week 1: Start with Assistants</h5>
                    <p>Master ChatGPT or Gemini for daily tasks and content creation</p>
                  </div>
                  <div class="action-step">
                    <h5>Week 2: Add Visual Creation</h5>
                    <p>Experiment with Leonardo AI or DALL-E for images and graphics</p>
                  </div>
                  <div class="action-step">
                    <h5>Week 3: Explore Specialized Tools</h5>
                    <p>Try tools specific to your industry (coding, design, music, etc.)</p>
                  </div>
                  <div class="action-step">
                    <h5>Week 4: Build Your Workflow</h5>
                    <p>Integrate multiple AI tools into a seamless creative process</p>
                  </div>
                </div>
              </div>
            </div>
          `,
          quiz: {
            question: "What's the most effective way to start using AI tools professionally?",
            options: [
              "Try all tools at once",
              "Start with assistants, then gradually add specialized tools",
              "Focus only on the most expensive tools",
              "Wait for better technology"
            ],
            correct: 1,
            explanation: "Starting with AI assistants gives you immediate value, then you can gradually add specialized tools to build a powerful AI workflow!"
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
              src="/api/placeholder/40/40" 
              alt="AI Asset Persona Logo" 
              className="logo-image"
            />
            <div className="logo-text">
              <span className="logo-ai">AI ASSET PERSONA</span>
              <div className="logo-subtitle">Learn</div>
            </div>
          </div>
          {currentUser && (
            <div className="user-info">
              <span className="welcome-text">Welcome, {currentUser.name}!</span>
              <div className="streak-counter">
                🔥 {userProgress.streak} day streak
              </div>
            </div>
          )}
        </div>
        <div className="header-right">
          {currentUser && (
            <>
              <div className="xp-counter">
                ⭐ {userProgress.totalXP} XP
              </div>
              <button 
                className="analytics-btn" 
                onClick={() => setCurrentView(currentView === 'analytics' ? 'home' : 'analytics')}
              >
                📊 Analytics
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );

  const SignupForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: ''
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
      // Clear errors when user starts typing
      if (errors[e.target.name]) {
        setErrors({
          ...errors,
          [e.target.name]: ''
        });
      }
    };

    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      
      return newErrors;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const formErrors = validateForm();
      
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Add signup timestamp
      const userData = {
        ...formData,
        signupDate: new Date().toISOString(),
        id: Date.now().toString()
      };

      handleSignup(userData);
    };

    return (
      <div className="signup-container">
        <div className="signup-form">
          <div className="signup-header">
            <img 
              src="/api/placeholder/80/80" 
              alt="AI Asset Persona Logo" 
              className="signup-logo"
            />
            <h1>Master AI Concepts</h1>
            <p>Join thousands learning artificial intelligence through interactive lessons</p>
          </div>
          
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <button type="submit" className="signup-btn">
              Start Learning AI
            </button>
          </form>
          
          <div className="signup-features">
            <div className="feature">
              <span className="feature-icon">🎓</span>
              <span>8 Comprehensive Modules</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🏆</span>
              <span>Gamified Learning Experience</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💼</span>
              <span>Career Guidance & Tools</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📱</span>
              <span>Mobile-Friendly Platform</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  const UserAnalytics = () => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    const analytics = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => {
        const lastActive = new Date(u.lastActive);
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        return lastActive > oneDayAgo;
      }).length,
      completedUsers: allUsers.filter(u => u.progress?.completedModules?.length >= 8).length,
      averageProgress: allUsers.length > 0 ? 
        allUsers.reduce((sum, u) => sum + (u.progress?.completedModules?.length || 0), 0) / allUsers.length : 0
    };

    return (
      <div className="analytics-container">
        <h2>User Analytics Dashboard</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-number">{analytics.totalUsers}</div>
            <div className="analytics-label">Total Signups</div>
          </div>
          <div className="analytics-card">
            <div className="analytics-number">{analytics.activeUsers}</div>
            <div className="analytics-label">Active (24h)</div>
          </div>
          <div className="analytics-card">
            <div className="analytics-number">{analytics.completedUsers}</div>
            <div className="analytics-label">Course Completed</div>
          </div>
          <div className="analytics-card">
            <div className="analytics-number">{analytics.averageProgress.toFixed(1)}</div>
            <div className="analytics-label">Avg Modules/User</div>
          </div>
        </div>
        
        <div className="user-list">
          <h3>Recent Users</h3>
          <div className="user-table">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Progress</span>
              <span>Last Active</span>
            </div>
            {allUsers.slice(-10).reverse().map(user => (
              <div key={user.id} className="table-row">
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{user.progress?.completedModules?.length || 0}/8 modules</span>
                <span>{new Date(user.lastActive).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
        
        <button className="back-to-course" onClick={() => setCurrentView('home')}>
          Back to Course
        </button>
      </div>
    );
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {currentView === 'signup' && <SignupForm />}
        {currentView === 'home' && !selectedModule && <Dashboard />}
        {currentView === 'analytics' && <UserAnalytics />}
        {selectedModule && <LessonView />}
      </main>
    </div>
  );
};

export default App;