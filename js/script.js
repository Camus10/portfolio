// PRELOADER
const preloaderLines = ['pl1', 'pl2', 'pl3', 'pl4', 'pl5'];
let lineIndex = 0;
const progressBar = document.getElementById('progressBar');

function showNextLine() {
  if (lineIndex < preloaderLines.length) {
    document.getElementById(preloaderLines[lineIndex]).classList.add('show');
    progressBar.style.width = ((lineIndex + 1) / preloaderLines.length * 100) + '%';
    lineIndex++;
    setTimeout(showNextLine, 400);
  } else {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
      initTypewriter();
    }, 600);
  }
}

window.addEventListener('load', () => {
  setTimeout(showNextLine, 300);
});

function initTypewriter() {
  const text = '"I make plans. God approves."';
  const element = document.getElementById('typewriter-text');
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, 60 + Math.random() * 40);
    }
  }
  type();
}

// CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.querySelectorAll('[data-cursor="hover"]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

// PARTICLES
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = window.innerWidth < 768 ? 30 : 60;
const connectionDistance = 150;
const mouseRadius = 200;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < mouseRadius) {
      const force = (mouseRadius - dist) / mouseRadius;
      this.vx -= (dx / dist) * force * 0.02;
      this.vy -= (dy / dist) * force * 0.02;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(107, 171, 229, 0.5)';
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < connectionDistance) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = 'rgba(107, 171, 229, ' + (0.15 * (1 - dist/connectionDistance)) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// SCROLL REVEAL
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// NAVBAR SCROLL EFFECT
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});
backToTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ACTIVE NAV LINK
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// STAT COUNTER
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      let current = 0;
      const increment = target / 40;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          entry.target.textContent = target + '+';
          clearInterval(timer);
        } else {
          entry.target.textContent = Math.floor(current);
        }
      }, 40);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(el => counterObserver.observe(el));

// IMAGE MODAL
window.openModal = function(imgSrc, caption) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  modalImg.src = imgSrc;
  modalCaption.textContent = caption;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// SCREENSHOT BOX - CHECK IMAGES
document.querySelectorAll('.screenshot-box').forEach(box => {
  const img = box.querySelector('img');
  if (img && img.src) {
    const testImg = new Image();
    testImg.onload = () => {
      box.classList.add('has-image');
      img.style.display = 'block';
    };
    testImg.onerror = () => {
      console.log('Image not found:', img.src);
    };
    testImg.src = img.src;
  }
});

// 3D TILT EFFECT ON CARDS
document.querySelectorAll('.project-card, .glass-card, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px) scale(1.01)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// PROFILE FRAME PARALLAX
const profileFrame = document.getElementById('profileFrame');
if (profileFrame) {
  document.addEventListener('mousemove', (e) => {
    const rect = profileFrame.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    const distance = Math.sqrt(x*x + y*y);
    if (distance < 300) {
      const strength = (300 - distance) / 300;
      profileFrame.style.transform = 'translate(' + (x * strength * 0.05) + 'px, ' + (y * strength * 0.05) + 'px) scale(1.02)';
    } else {
      profileFrame.style.transform = '';
    }
  });
}

// CURSOR BLINK IN PROFILE SVG
const cursorBlink = document.getElementById('cursor-blink');
if (cursorBlink) {
  setInterval(() => {
    cursorBlink.style.opacity = cursorBlink.style.opacity === '0' ? '1' : '0';
  }, 530);
}

// AI CHATBOT
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
let chatbotOpen = false;

chatbotToggle.addEventListener('click', () => {
  chatbotOpen = !chatbotOpen;
  if (chatbotOpen) {
    chatbotWindow.classList.add('open');
    chatbotToggle.classList.remove('pulse');
    chatbotInput.focus();
  } else {
    chatbotWindow.classList.remove('open');
  }
});

// Comprehensive chatbot responses
const chatbotResponses = {
  // Skills and Tech
  'skills': 'Haris is proficient in full-stack development with expertise in PHP, JavaScript, Vue.js, Node.js, and SQL. He specializes in REST API development, SAP integration, database optimization, and mobile app development with Ionic.',
  'tech stack': 'Haris\'s tech stack includes: Frontend (HTML, CSS, JavaScript, Vue.js, jQuery, Ajax, Ionic), Backend (PHP, Node.js, Express), Database (MySQL, SQL Server, Oracle), and Integration (SAP, REST APIs).',
  'technologies': 'Haris works with HTML, PHP, JavaScript, SQL, Ajax, jQuery, Vue.js, Ionic, Node.js, Express, MySQL, SQL Server, Oracle, and SAP.',
  'programming': 'Haris is skilled in PHP, JavaScript, and SQL. He writes clean, maintainable code and follows best practices for both frontend and backend development.',
  'framework': 'Haris uses Vue.js for frontend, Node.js with Express for backend, and Ionic for mobile app development. He also has experience with Slim Framework.',

  // Experience
  'experience': 'Haris has 4+ years of professional experience across 3 companies: AUTO Logistik (Full Stack Engineer), Sokka Kreatif Teknologi (Full Stack Developer), and Pou Chen Corporation (IT Specialist).',
  'work history': 'Haris started as an IT Specialist at Pou Chen Corporation, then became a Full Stack Developer at Sokka Kreatif Teknologi, and is currently a Full Stack Engineer at AUTO Logistik.',
  'career': 'Haris has built a solid career in software engineering, progressing from IT Specialist to Full Stack Developer to Full Stack Engineer over 4+ years.',
  'company': 'Haris has worked at AUTO Logistik, Sokka Kreatif Teknologi, and Pou Chen Corporation. Each role expanded his expertise in different domains.',
  'auto logistik': 'At AUTO Logistik, Haris built robust REST APIs for SAP integration, automated data transmission processes, optimized databases with MySQL triggers, and developed Fleet Management and Accounting Systems.',
  'sokka': 'At Sokka Kreatif Teknologi, Haris developed clinic and hospital system modules, built corporate insight and reporting infrastructure, and engineered backend for mobile apps using Slim Framework.',
  'pou chen': 'At Pou Chen Corporation, Haris collaborated with 3 Indonesian plants and Taiwan HQ, managed Production System databases with Oracle and SAP, and handled project management with Requirement Traceability Matrix.',

  // Projects
  'projects': 'Haris has built several impactful projects: Clinic System, Hospital System, Accounting System, and a Learning Platform. Each demonstrates his full-stack capabilities across different domains.',
  'clinic': 'The Clinic System is a patient management and medical records dashboard built with PHP and SQL Server. It streamlines healthcare operations and patient data management.',
  'hospital': 'The Hospital System is a comprehensive patient registration and management platform built with PHP and SQL Server, handling complex healthcare workflows.',
  'accounting': 'The Accounting System is a financial dashboard and reporting tool built with PHP and MySQL, providing real-time financial insights and automated reporting.',
  'learning': 'The Learning Platform is a mobile learning app built with Ionic and Vue.js, delivering educational content through an intuitive mobile interface.',
  'fleet': 'The Fleet Management System (Web and Android) was developed at AUTO Logistik to manage vehicle operations, tracking, and maintenance.',
  'portfolio': 'This portfolio itself showcases Haris\'s frontend skills with modern CSS, animations, and interactive elements. It\'s built with pure HTML, CSS, and vanilla JavaScript.',

  // Education and Research
  'education': 'Haris holds a degree in Computer Science from Universitas Pendidikan Indonesia. His academic foundation supports his practical engineering skills.',
  'university': 'Haris graduated from Universitas Pendidikan Indonesia with a Computer Science degree.',
  'degree': 'Haris has a Computer Science degree from Universitas Pendidikan Indonesia.',
  'research': 'Haris\'s research interests include Service Engineering and Collaborative Systems, and Complex Systems and Strategy Games (analyzing Civilization, Sim City, and TheoTown for systemic thinking).',
  'interest': 'Haris is fascinated by collaborative learning systems and uses strategy games as laboratories for understanding resource management and scalable architecture.',

  // Contact and Availability
  'contact': 'You can reach Haris via email at harishidayat@qq.com, WhatsApp at +62 858 6000 2666, or connect on LinkedIn (/in/haris-hidayat) and GitHub (/Camus10).',
  'email': 'Haris\'s email is harishidayat@qq.com. He typically responds within 24 hours.',
  'whatsapp': 'You can reach Haris on WhatsApp at +62 858 6000 2666 for quick communication.',
  'phone': 'Haris\'s WhatsApp number is +62 858 6000 2666. He prefers WhatsApp for professional inquiries.',
  'linkedin': 'Connect with Haris on LinkedIn: linkedin.com/in/haris-hidayat',
  'github': 'Check out Haris\'s code on GitHub: github.com/Camus10',
  'instagram': 'Follow Haris on Instagram: @camus_hh',
  'hire': 'Yes, Haris is available for full-time, part-time, and remote opportunities! Reach out via email or WhatsApp to discuss how he can contribute to your team.',
  'available': 'Haris is currently available for new opportunities — full-time, part-time, or remote. He\'s excited to bring his expertise to new challenges.',
  'job': 'Haris is open to Full Stack Engineer roles, especially those involving API development, database optimization, or SAP integration. He\'s also interested in AI-related projects.',
  'remote': 'Yes, Haris is available for remote work. He has experience collaborating with teams across different time zones, including Taiwan HQ.',
  'freelance': 'Haris is open to freelance and part-time projects. His expertise in rapid prototyping and full-stack development makes him ideal for project-based work.',

  // Personal and Soft Skills
  'about': 'Haris is a dedicated Full Stack Engineer with 4+ years of experience. He combines technical expertise with strong analytical thinking and a passion for building efficient systems.',
  'personality': 'Haris is described as optimistic, analytical, and a strategic thinker. His colleagues often call him a genius for his problem-solving abilities.',
  'strength': 'Haris\'s key strengths include rapid problem-solving, database optimization, API development, and the ability to quickly understand complex business requirements.',
  'weakness': 'Haris might spend too much time analyzing Civilization and Sim City for "research purposes" — but that\'s just his way of understanding complex systems!',
  'hobby': 'Beyond coding, Haris enjoys strategy games like Civilization, Sim City, and TheoTown. He views them as laboratories for understanding resource management and scalable architecture.',
  'game': 'Haris analyzes strategy games like Civilization, Sim City, and TheoTown to understand resource management, systemic thinking, and scalable architecture. Yes, he writes about this unironically.',
  'quote': 'Haris\'s personal quote is: "I make plans. God approves." It reflects his approach to careful planning while staying adaptable.',

  // Process and Methodology
  'process': 'Haris follows a structured approach: understand requirements, design the architecture, implement with clean code, test thoroughly, and optimize for performance.',
  'methodology': 'Haris is experienced in project management, User Acceptance Testing (UAT), and creating Requirement Traceability Matrices. He ensures quality at every stage.',
  'testing': 'Haris conducts thorough User Acceptance Tests and maintains detailed documentation. He believes in building robust systems that work reliably.',
  'optimization': 'Haris specializes in database optimization using triggers, stored procedures, and indexing. He\'s also skilled at automating data transmission processes.',
  'integration': 'Haris has extensive experience integrating external systems, particularly SAP. He builds robust REST APIs that ensure seamless data flow between systems.',
  'api': 'Haris builds robust REST APIs with proper authentication, error handling, and documentation. He has experience integrating with SAP and other enterprise systems.',
  'database': 'Haris is proficient in MySQL, SQL Server, and Oracle. He optimizes databases using triggers, stored procedures, indexing, and query optimization.',
  'sap': 'Haris has hands-on experience with SAP integration, managing Production System databases, and automating data transmission between SAP and other systems.',

  // Greetings and Small Talk
  'hello': 'Hello! Welcome to Haris\'s portfolio. I\'m his AI assistant. Ask me about his skills, experience, projects, or how to get in touch!',
  'hi': 'Hi there! How can I help you learn more about Haris today?',
  'hey': 'Hey! Feel free to ask about Haris\'s skills, projects, experience, or availability.',
  'how are you': 'I\'m doing great, thanks for asking! Haris is also doing well and excited about new opportunities. How can I help you?',
  'what can you do': 'I can tell you all about Haris — his skills, work experience, projects, education, research interests, and how to contact him. What would you like to know?',
  'help': 'I can help you learn about Haris\'s: skills and tech stack, work experience, projects, education, availability for hire, or contact info. What interests you?',
  'thanks': 'You\'re welcome! Feel free to reach out to Haris directly if you have more questions.',
  'thank you': 'Glad I could help! Haris would love to hear from you if you\'re interested in working together.',
  'bye': 'Goodbye! Feel free to come back anytime, and don\'t hesitate to contact Haris directly.',
  'goodbye': 'See you later! Reach out to Haris if you need a talented Full Stack Engineer.',

  // Default fallback
  'default': 'I\'m not sure I understand. Try asking about Haris\'s skills, experience, projects, education, availability, or contact info. You can also use the quick reply buttons below!'
};

function addMessage(text, isUser) {
  const msg = document.createElement('div');
  msg.className = 'chatbot-message ' + (isUser ? 'user' : 'bot');
  msg.innerHTML = text;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getResponse(input) {
  const lower = input.toLowerCase().trim();

  // Check for exact matches first
  if (chatbotResponses[lower]) {
    return chatbotResponses[lower];
  }

  // Check for keyword matches
  for (const key in chatbotResponses) {
    if (lower.includes(key)) {
      return chatbotResponses[key];
    }
  }

  // Check for partial word matches
  const words = lower.split(/\s+/);
  for (const word of words) {
    if (word.length > 3) {
      for (const key in chatbotResponses) {
        if (key.includes(word) || word.includes(key)) {
          return chatbotResponses[key];
        }
      }
    }
  }

  return chatbotResponses['default'];
}

window.sendMessage = function() {
  const text = chatbotInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  chatbotInput.value = '';

  setTimeout(() => {
    addMessage(getResponse(text), false);
  }, 400 + Math.random() * 400);
};

window.sendQuickReply = function(text) {
  addMessage(text, true);
  setTimeout(() => {
    addMessage(getResponse(text), false);
  }, 400);
};

chatbotInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});