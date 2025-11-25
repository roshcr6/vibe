// ===== UTILITY FUNCTIONS =====
// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Throttle function for performance
function throttle(func, delay) {
    let timeoutId;
    let lastRan;
    return function(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if ((Date.now() - lastRan) >= delay) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, delay - (Date.now() - lastRan));
        }
    };
}

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Check if device supports custom cursor (desktop with pointer)
const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ===== BLOB CURSOR =====
const cursorBlob = document.querySelector('.cursor-blob');
const cursorInner = document.querySelector('.cursor-blob-inner');
const cursorOuter = document.querySelector('.cursor-blob-outer');

// Only enable custom cursor on devices that support it
if (!supportsCustomCursor || prefersReducedMotion || !cursorBlob) {
    if (cursorBlob) cursorBlob.style.display = 'none';
} else {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isMouseOnPage = false;

    // Mouse tracking
    document.addEventListener('mouseenter', () => {
        isMouseOnPage = true;
        cursorBlob.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        isMouseOnPage = false;
        cursorBlob.style.opacity = '0';
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation with easing
    function animateCursor() {
        const ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursorBlob.style.left = cursorX + 'px';
        cursorBlob.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .syntax-card, .nav-link, .nav-btn-primary, .nav-btn-secondary, .run-btn');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorBlob.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorBlob.classList.remove('hover');
        });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursorBlob.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
        cursorBlob.classList.remove('click');
    });
}

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles');
if (!canvas) {
    console.warn('Particle canvas not found');
} else {
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

const particles = [];
const particleCount = window.innerWidth < 768 ? 30 : 50; // Reduced from 100

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#7C3AED' : '#06B6D4';
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let particle of particles) {
        particle.update();
        particle.draw();
    }
    
    // Connect nearby particles (optimized)
    if (!prefersReducedMotion) {
        const maxConnections = 3; // Limit connections per particle
        for (let i = 0; i < particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(124, 58, 237, ${1 - distance / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    connections++;
                }
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

if (!prefersReducedMotion) {
    animateParticles();
}

window.addEventListener('resize', throttle(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, 250));
}

// ===== CODE MORPHING ANIMATION =====
const morphingCode = document.getElementById('morphing-code');

if (morphingCode && typeof anime !== 'undefined') {
    const codeStates = [
        {
            lang: 'Python',
            code: `# Traditional Python
x = "Hello World"
print(x)

if x == "Hello World":
    print("Match found")
else:
    print("No match")`
        },
        {
            lang: 'VIBE',
            code: `# VIBE Way 💙
braincell x = "Hello World"
skibidi spill x

sus check x == "Hello World"
    spill "Match found"
plot twist
    spill "No match"
end sus`
        }
    ];

    let currentState = 0;

    function morphCode() {
        const nextState = (currentState + 1) % codeStates.length;
        const currentText = codeStates[currentState].code;
        const nextText = codeStates[nextState].code;
        
        // Fade out
        anime({
            targets: morphingCode,
            opacity: [1, 0],
            duration: 800,
            easing: 'easeInOutQuad',
            complete: () => {
                morphingCode.textContent = nextText;
                // Fade in with typing effect
                anime({
                    targets: morphingCode,
                    opacity: [0, 1],
                    duration: 800,
                    easing: 'easeInOutQuad'
                });
            }
        });
        
        currentState = nextState;
    }

    // Initialize with first code
    morphingCode.textContent = codeStates[0].code;

    // Morph every 4 seconds if not reduced motion
    if (!prefersReducedMotion) {
        setInterval(morphCode, 4000);
    }
}

// Scroll animations removed for better performance

// Syntax card animations removed

// ===== PLAYGROUND FUNCTIONALITY =====
const codeInput = document.getElementById('code-input');
const outputDisplay = document.getElementById('output-display');
const runBtn = document.getElementById('run-btn');
const clearBtn = document.getElementById('clear-btn');
const exampleBtn = document.getElementById('example-btn');

// Check if playground elements exist
if (!codeInput || !outputDisplay || !runBtn) {
    console.warn('Playground elements not found');
} else {

// VibeScript to Python transpiler (simplified)
function transpileVibeScript(code) {
    let lines = code.split('\n');
    let pythonCode = [];
    let indentLevel = 0;
    
    for (let line of lines) {
        let trimmed = line.trim();
        
        if (!trimmed || trimmed.startsWith('#')) {
            pythonCode.push(line);
            continue;
        }
        
        // Handle end statements
        if (trimmed.startsWith('end sus') || trimmed.startsWith('end vibe')) {
            indentLevel = Math.max(0, indentLevel - 1);
            continue;
        }
        
        let indent = '    '.repeat(indentLevel);
        
        // Variable declaration
        if (trimmed.startsWith('braincell ')) {
            pythonCode.push(indent + trimmed.replace('braincell ', ''));
        }
        // Regular print
        else if (trimmed.startsWith('spill ')) {
            let expr = trimmed.replace('spill ', '');
            pythonCode.push(indent + `print(${expr})`);
        }
        // Glowing print
        else if (trimmed.startsWith('skibidi spill ')) {
            let expr = trimmed.replace('skibidi spill ', '');
            pythonCode.push(indent + `print("✨", ${expr}, "✨")`);
        }
        // Bold print
        else if (trimmed.startsWith('rizzmode spill ')) {
            let expr = trimmed.replace('rizzmode spill ', '');
            pythonCode.push(indent + `print("**", ${expr}, "**")`);
        }
        // Conditional
        else if (trimmed.startsWith('sus check ')) {
            let condition = trimmed.replace('sus check ', '');
            pythonCode.push(indent + `if ${condition}:`);
            indentLevel++;
        }
        // Else
        else if (trimmed === 'plot twist') {
            indentLevel = Math.max(0, indentLevel - 1);
            indent = '    '.repeat(indentLevel);
            pythonCode.push(indent + 'else:');
            indentLevel++;
        }
        // Loop
        else if (trimmed.startsWith('vibe until ')) {
            let condition = trimmed.replace('vibe until ', '');
            pythonCode.push(indent + `while ${condition}:`);
            indentLevel++;
        }
        // Operators
        else if (trimmed.startsWith('sum ')) {
            let parts = trimmed.replace('sum ', '').split(' ');
            pythonCode.push(indent + `${parts[0]} += ${parts[1]}`);
        }
        else if (trimmed.startsWith('sub ')) {
            let parts = trimmed.replace('sub ', '').split(' ');
            pythonCode.push(indent + `${parts[0]} -= ${parts[1]}`);
        }
        else if (trimmed.startsWith('mul ')) {
            let parts = trimmed.replace('mul ', '').split(' ');
            pythonCode.push(indent + `${parts[0]} *= ${parts[1]}`);
        }
        else if (trimmed.startsWith('div ')) {
            let parts = trimmed.replace('div ', '').split(' ');
            pythonCode.push(indent + `${parts[0]} /= ${parts[1]}`);
        }
        // Booleans
        else {
            let converted = trimmed.replace(/\byeah\b/g, 'True').replace(/\bnah\b/g, 'False');
            pythonCode.push(indent + converted);
        }
    }
    
    return pythonCode.join('\n');
}

// Execute code (simulated)
function executeCode() {
    const vibeCode = codeInput.value;
    
    if (!vibeCode.trim()) {
        outputDisplay.innerHTML = '<div class="output-placeholder">No code to run! Write some VibeScript first 💙</div>';
        return;
    }
    
    // Clear output with animation
    anime({
        targets: outputDisplay,
        opacity: [1, 0],
        duration: 200,
        easing: 'easeOutQuad',
        complete: () => {
            outputDisplay.innerHTML = '<div class="output-line">Running your vibes... ⚡</div>';
            anime({
                targets: outputDisplay,
                opacity: [0, 1],
                duration: 200
            });
        }
    });
    
    // Button click animation with glitch effect
    anime({
        targets: '#run-btn',
        scale: [1, 0.95, 1.05, 1],
        rotate: [0, -2, 2, 0],
        duration: 400,
        easing: 'easeOutElastic(1, .5)'
    });
    
    // Add loading spinner
    runBtn.innerHTML = '<span>Running...</span><span class="loading-spinner"></span>';
    
    setTimeout(() => {
        try {
            // Transpile to Python (for display)
            const pythonCode = transpileVibeScript(vibeCode);
            
            // Simulate output
            let output = [];
            const lines = vibeCode.split('\n');
            
            for (let line of lines) {
                let trimmed = line.trim();
                
                if (trimmed.startsWith('spill ')) {
                    let content = trimmed.match(/["'](.*?)["']/);
                    if (content) {
                        output.push(`<div class="output-line">${sanitizeHTML(content[1])}</div>`);
                    }
                }
                else if (trimmed.startsWith('skibidi spill ')) {
                    let content = trimmed.match(/["'](.*?)["']/);
                    if (content) {
                        output.push(`<div class="output-line output-glow">✨ ${sanitizeHTML(content[1])} ✨</div>`);
                    }
                }
                else if (trimmed.startsWith('rizzmode spill ')) {
                    let content = trimmed.match(/["'](.*?)["']/);
                    if (content) {
                        output.push(`<div class="output-line"><strong>${sanitizeHTML(content[1])}</strong></div>`);
                    }
                }
            }
            
            if (output.length === 0) {
                output.push('<div class="output-line">Code executed successfully! No output statements found. 💯</div>');
            }
            
            // Sanitize and set output safely
            outputDisplay.innerHTML = output.join('');
            
            // Animate output lines with stagger
            anime({
                targets: '.output-line',
                opacity: [0, 1],
                translateX: [-30, 0],
                scale: [0.8, 1],
                delay: anime.stagger(150),
                easing: 'easeOutExpo'
            });
            
            // Glow effect for skibidi output
            anime({
                targets: '.output-glow',
                textShadow: [
                    '0 0 5px #06B6D4',
                    '0 0 20px #7C3AED',
                    '0 0 30px #06B6D4',
                    '0 0 15px #7C3AED'
                ],
                duration: 2000,
                easing: 'easeInOutSine',
                loop: true
            });
            
            // Reset button
            runBtn.innerHTML = '<i class="ph ph-play"></i><span>Run Code</span>';
            
        } catch (error) {
            outputDisplay.innerHTML = `<div class="output-line" style="color: var(--red);"><i class="ph ph-warning-circle"></i> Error: ${error.message}</div>`;
            runBtn.innerHTML = '<i class="ph ph-play"></i><span>Run Code</span>';
        }
    }, 800);
}

runBtn.addEventListener('click', executeCode);

// Example button
const examples = [
    `braincell name = "VIBE"
skibidi spill "Welcome to " + name + "! 💙"

braincell vibes = 100
sus check vibes > 50
    spill "The vibes are immaculate! ✨"
plot twist
    spill "Need more vibes..."
end sus`,
    `braincell count = 0
vibe until count >= 3
    spill "Vibing... " + str(count)
    sum count 1
end vibe
spill "Loop complete! 🎵"`,
    `braincell is_cool = yeah
braincell is_boring = nah

sus check is_cool
    skibidi spill "This language is fire! 🔥"
end sus`
];

let currentExample = 0;

if (exampleBtn) {
    exampleBtn.addEventListener('click', () => {
        codeInput.value = examples[currentExample];
        currentExample = (currentExample + 1) % examples.length;
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: codeInput,
                opacity: [0.5, 1],
                duration: 300
            });
        }
    });
}

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        codeInput.value = '';
        outputDisplay.innerHTML = '<div class="output-placeholder">Output cleared. Ready for new vibes! ✨</div>';
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: outputDisplay,
                opacity: [0, 1],
                duration: 300
            });
        }
    });
}

} // End of playground check

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect removed

// Parallax effect removed

// ===== BUTTON RIPPLE EFFECT =====
document.querySelectorAll('.btn-primary, .btn-secondary, .run-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        this.appendChild(ripple);
        
        anime({
            targets: ripple,
            width: '300px',
            height: '300px',
            opacity: [1, 0],
            duration: 600,
            easing: 'easeOutQuad',
            complete: () => ripple.remove()
        });
    });
});

console.log('%c♦ VIBE - Where Logic Ends and Vibes Begin', 'color: #7C3AED; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with anime.js, Phosphor Icons, and modern aesthetics', 'color: #06B6D4; font-size: 14px;');
