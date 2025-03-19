const logsPanel = document.getElementById('logs-panel');
const logsContent = document.getElementById('logs-content');
const terminalOverlay = document.getElementById('terminal-overlay');
const terminalContent = document.getElementById('terminal-content');
const terminalInput = document.getElementById('terminal-input');
const authOverlay = document.getElementById('auth-overlay');
const authUsername = document.getElementById('auth-username');
const authPassword = document.getElementById('auth-password');
const authBtn = document.getElementById('auth-btn');
const authError = document.getElementById('auth-error');
const beepSound = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
const alertSound = new Audio('https://www.soundjay.com/buttons/beep-02.mp3');
beepSound.volume = 0.1;
alertSound.volume = 0.2;

let isAuthenticated = false;
let accessLevel = 'Guest'; // Guest или Admin
let commandHistory = [];
let historyIndex = -1;

function addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    logsContent.innerHTML += `<br>> [${timestamp}] ${message}`;
    logsContent.scrollTop = logsContent.scrollHeight;
    try {
        beepSound.play().catch(err => console.log('Audio play failed:', err));
    } catch (err) {
        console.log('Audio unavailable:', err);
    }
}

function addTerminalOutput(message) {
    terminalContent.innerHTML += `<br>> ${message}`;
    terminalContent.scrollTop = terminalContent.scrollHeight;
    try {
        beepSound.play().catch(err => console.log('Audio play failed:', err));
    } catch (err) {
        console.log('Audio unavailable:', err);
    }
}

// Сохранение состояния
function saveState() {
    localStorage.setItem('darknetState', JSON.stringify({
        isAuthenticated,
        accessLevel,
        hackCount,
        packetCount,
        connCount,
        botnetSize,
        uptime
    }));
}

function loadState() {
    const state = JSON.parse(localStorage.getItem('darknetState'));
    if (state) {
        isAuthenticated = state.isAuthenticated;
        accessLevel = state.accessLevel;
        hackCount = state.hackCount || 0;
        packetCount = state.packetCount || 0;
        connCount = state.connCount || 0;
        botnetSize = state.botnetSize || 0;
        uptime = state.uptime || 0;
        document.getElementById('access-level').textContent = accessLevel;
        document.getElementById('access-status').textContent = isAuthenticated ? 'Active' : 'Inactive';
        if (isAuthenticated) authOverlay.style.display = 'none';
    }
}

// Авторизация
authBtn.addEventListener('click', () => {
    const username = authUsername.value.trim();
    const password = authPassword.value.trim();
    if (username === 'admin' && password === 'darknet123') {
        isAuthenticated = true;
        accessLevel = 'Admin';
        authOverlay.style.display = 'none';
        document.getElementById('access-level').textContent = 'Admin';
        document.getElementById('access-status').textContent = 'Active';
        addLog('User authenticated: admin');
        saveState();
    } else if (username === 'guest' && password === 'darknet') {
        isAuthenticated = true;
        accessLevel = 'Guest';
        authOverlay.style.display = 'none';
        document.getElementById('access-level').textContent = 'Guest';
        document.getElementById('access-status').textContent = 'Active';
        addLog('User authenticated: guest');
        saveState();
    } else {
        authError.textContent = '> Access denied. Invalid credentials.';
        addLog('Failed login attempt');
    }
});

authPassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') authBtn.click();
});

// Проверка авторизации и уровня доступа
function requireAuth(callback, adminOnly = false) {
    if (!isAuthenticated) {
        addLog('Access denied: Not authenticated');
        document.getElementById('output').textContent = '> Access denied. Login required.';
    } else if (adminOnly && accessLevel !== 'Admin') {
        addLog('Access denied: Admin privileges required');
        document.getElementById('output').textContent = '> Access denied. Admin only.';
    } else {
        callback();
    }
}

let hackCount = 0, packetCount = 0, connCount = 0, botnetSize = 0, uptime = 0;
setInterval(() => {
    if (isAuthenticated) {
        hackCount += Math.floor(Math.random() * 3) + 1;
        packetCount += Math.floor(Math.random() * 100) + 50;
        connCount += Math.floor(Math.random() * 2);
        botnetSize += Math.floor(Math.random() * 5);
        document.getElementById('hack-counter').textContent = hackCount;
        document.getElementById('packet-counter').textContent = packetCount;
        document.getElementById('conn-count').textContent = connCount;
        document.getElementById('botnet-size').textContent = botnetSize;
        if (Math.random() < 0.2) addLog(`Intrusion #${hackCount} | Packets: ${packetCount}`);
        saveState();
    }
}, 2000);

setInterval(() => {
    if (isAuthenticated) {
        uptime++;
        document.getElementById('uptime').textContent = `${uptime}s`;
        document.getElementById('cpu-load').textContent = `${Math.floor(Math.random() * 80) + 20}%`;
        document.getElementById('mem-usage').textContent = `${Math.floor(Math.random() * 90) + 10}%`;
        document.getElementById('net-traffic').textContent = `${Math.floor(Math.random() * 500) + 50} KB/s`;
        saveState();
    }
}, 1000);

const telegramLink = document.getElementById('telegram-link');
const footerTelegramLink = document.getElementById('footer-telegram-link');
const modal = document.getElementById('confirm-modal');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

function showModal(linkElement) {
    requireAuth(() => {
        modal.style.display = 'flex';
        confirmYes.onclick = () => {
            window.open('https://t.me/rollpit', '_blank');
            addLog('Uplink to Telegram established');
            modal.style.display = 'none';
        };
        confirmNo.onclick = () => {
            addLog('Uplink to Telegram aborted');
            modal.style.display = 'none';
        };
    });
}
telegramLink.addEventListener('click', (e) => { e.preventDefault(); showModal(telegramLink); });
footerTelegramLink.addEventListener('click', (e) => { e.preventDefault(); showModal(footerTelegramLink); });

// Генерация случайной цели
function generateTarget() {
    const ip = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const services = ['Web Server', 'Database', 'FTP', 'IoT Device', 'Router'];
    return { ip, service: services[Math.floor(Math.random() * services.length)] };
}

const hackBtn = document.getElementById('hack-btn');
const progressFill = document.getElementById('progress-fill');
const output = document.getElementById('output');
const payloadStatus = document.getElementById('payload-status');
const targetIp = document.getElementById('target-ip');
hackBtn.addEventListener('click', () => {
    requireAuth(() => {
        const target = generateTarget();
        progressFill.style.width = '0';
        output.textContent = `> Deploying exploit to ${target.ip} (${target.service})...`;
        payloadStatus.textContent = 'Running';
        addLog(`Exploit deployment started on ${target.ip}`);
        setTimeout(() => {
            progressFill.style.width = '100%';
            output.textContent = '> Target owned!';
            payloadStatus.textContent = 'Success';
            targetIp.textContent = target.ip;
            addLog(`Exploit deployed successfully on ${target.ip} (${target.service})`);
            setTimeout(() => payloadStatus.textContent = 'Idle', 2000);
        }, 150);
    });
});

const logsBtn = document.getElementById('logs-btn');
logsBtn.addEventListener('click', () => {
    requireAuth(() => {
        logsPanel.style.display = logsPanel.style.display === 'block' ? 'none' : 'block';
        addLog('Log panel toggled');
    });
});

let firewallActive = false;
const firewallBtn = document.getElementById('firewall-btn');
firewallBtn.addEventListener('click', () => {
    requireAuth(() => {
        firewallActive = !firewallActive;
        output.textContent = `> Firewall ${firewallActive ? 'ON' : 'OFF'}`;
        addLog(`Firewall ${firewallActive ? 'enabled' : 'disabled'}`);
        progressFill.style.width = firewallActive ? '60%' : '0';
    });
});

const pingBtn = document.getElementById('ping-btn');
pingBtn.addEventListener('click', () => {
    requireAuth(() => {
        const target = generateTarget();
        output.textContent = `> Pinging ${target.ip}...`;
        addLog(`Ping initiated to ${target.ip}`);
        progressFill.style.width = '0';
        setTimeout(() => {
            const latency = Math.floor(Math.random() * 150) + 30;
            progressFill.style.width = '90%';
            output.textContent = `> Latency: ${latency}ms`;
            addLog(`Ping completed to ${target.ip}: ${latency}ms`);
        }, 800);
    });
});

const scanBtn = document.getElementById('scan-btn');
scanBtn.addEventListener('click', () => {
    requireAuth(() => {
        output.textContent = '> Scanning network...';
        addLog('Network scan started');
        progressFill.style.width = '0';
        setTimeout(() => {
            progressFill.style.width = '75%';
            const ports = Math.floor(Math.random() * 50) + 10;
            output.textContent = `> Found ${ports} open ports`;
            addLog(`Scan complete: ${ports} vulnerabilities`);
        }, 1000);
    });
});

const encryptBtn = document.getElementById('encrypt-btn');
encryptBtn.addEventListener('click', () => {
    requireAuth(() => {
        output.textContent = '> Encrypting data...';
        addLog('Encryption process initiated');
        progressFill.style.width = '0';
        setTimeout(() => {
            progressFill.style.width = '100%';
            output.textContent = '> Data encrypted: AES-256';
            addLog('Encryption completed');
        }, 1200);
    });
});

const ddosBtn = document.getElementById('ddos-btn');
ddosBtn.addEventListener('click', () => {
    requireAuth(() => {
        const target = generateTarget();
        output.textContent = `> Launching DDoS attack on ${target.ip}...`;
        addLog(`DDoS attack initiated on ${target.ip}`);
        progressFill.style.width = '0';
        setTimeout(() => {
            progressFill.style.width = '100%';
            output.textContent = `> DDoS attack successful: 500 Mbps`;
            addLog(`DDoS attack completed on ${target.ip}`);
            botnetSize += Math.floor(Math.random() * 10) + 5;
            document.getElementById('botnet-size').textContent = botnetSize;
        }, 1500);
    });
});

const injectBtn = document.getElementById('inject-btn');
injectBtn.addEventListener('click', () => {
    requireAuth(() => {
        const target = generateTarget();
        output.textContent = `> Injecting payload to ${target.ip}...`;
        addLog(`Payload injection started on ${target.ip}`);
        progressFill.style.width = '0';
        setTimeout(() => {
            progressFill.style.width = '85%';
            output.textContent = '> Payload injected: Backdoor active';
            addLog(`Payload injection successful on ${target.ip}`);
        }, 1100);
    });
});

const phishBtn = document.getElementById('phish-btn');
phishBtn.addEventListener('click', () => {
    requireAuth(() => {
        output.textContent = '> Deploying phishing campaign...';
        addLog('Phishing campaign started');
        progressFill.style.width = '0';
        setTimeout(() => {
            progressFill.style.width = '90%';
            const creds = Math.floor(Math.random() * 20) + 5;
            output.textContent = `> Phishing successful: ${creds} credentials stolen`;
            addLog(`Phishing completed: ${creds} credentials acquired`);
        }, 1300);
    });
});

const terminalBtn = document.getElementById('terminal-btn');
terminalBtn.addEventListener('click', () => {
    requireAuth(() => {
        terminalOverlay.style.display = terminalOverlay.style.display === 'flex' ? 'none' : 'flex';
        addLog('Terminal toggled');
        terminalInput.focus();
    });
});

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
    isAuthenticated = false;
    accessLevel = 'Guest';
    authOverlay.style.display = 'flex';
    document.getElementById('access-level').textContent = 'Guest';
    document.getElementById('access-status').textContent = 'Inactive';
    addLog('User logged out');
    authUsername.value = '';
    authPassword.value = '';
    authError.textContent = '';
    saveState();
});

const toolButtons = document.querySelectorAll('.tool-btn');
toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        requireAuth(() => {
            const tool = btn.dataset.tool;
            output.textContent = `> Running ${tool} tool...`;
            addLog(`${tool} tool executed`);
            progressFill.style.width = '0';
            setTimeout(() => {
                progressFill.style.width = '80%';
                output.textContent = `> ${tool} completed`;
                addLog(`${tool} operation successful`);
            }, 900);
        });
    });
});

const commands = {
    'help': 'Available commands: help, clear, ping, scan, exploit, ddos, encrypt, inject, phish, status, logout, exit, whoami, targets',
    'clear': () => terminalContent.innerHTML = '> Terminal cleared',
    'ping': 'Pinging network... Check output panel',
    'scan': 'Scanning network... Check output panel',
    'exploit': 'Deploying exploit... Check output panel',
    'ddos': 'Launching DDoS... Check output panel',
    'encrypt': 'Encrypting data... Check output panel',
    'inject': 'Injecting payload... Check output panel',
    'phish': 'Deploying phishing... Check output panel',
    'status': () => `System status: Uptime ${uptime}s, Hacks ${hackCount}, Packets ${packetCount}, Botnet ${botnetSize}`,
    'logout': () => { logoutBtn.click(); return '> Logging out...'; },
    'exit': () => terminalOverlay.style.display = 'none',
    'whoami': () => `Current user: ${accessLevel}`,
    'targets': () => {
        const target = generateTarget();
        return `Current target: ${target.ip} (${target.service})`;
    }
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        requireAuth(() => {
            const input = terminalInput.value.trim().toLowerCase();
            commandHistory.push(input);
            historyIndex = commandHistory.length;
            addTerminalOutput(input);
            if (commands[input]) {
                const response = typeof commands[input] === 'function' ? commands[input]() : commands[input];
                addTerminalOutput(response);
            } else {
                addTerminalOutput('> Unknown command. Type "help" for list.');
            }
            terminalInput.value = '';
            if (input === 'ping') pingBtn.click();
            if (input === 'scan') scanBtn.click();
            if (input === 'exploit') hackBtn.click();
            if (input === 'ddos') ddosBtn.click();
            if (input === 'encrypt') encryptBtn.click();
            if (input === 'inject') injectBtn.click();
            if (input === 'phish') phishBtn.click();
        });
    } else if (e.key === 'ArrowUp' && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
    } else if (e.key === 'ArrowDown' && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
    }
});

const alerts = [
    'Suspicious packet intercepted',
    'DDoS attempt blocked',
    'Backdoor access detected',
    'Firewall breach attempt',
    'Rootkit installation failed',
    'SQL injection detected',
    'Port scan detected',
    'Botnet node added'
];
setInterval(() => {
    if (isAuthenticated && Math.random() < 0.15) {
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        addLog(alert);
        try {
            alertSound.play().catch(err => console.log('Alert sound failed:', err));
        } catch (err) {
            console.log('Alert sound unavailable:', err);
        }
    }
}, 4000);

setInterval(() => {
    if (isAuthenticated && Math.random() < 0.05) {
        document.body.style.filter = 'blur(1px)';
        setTimeout(() => document.body.style.filter = 'none', 200);
        addLog('System glitch detected');
    }
}, 10000);

setInterval(() => {
    if (isAuthenticated) {
        const threatLevel = document.getElementById('threat-level');
        const levels = ['Low', 'Medium', 'High', 'Critical'];
        threatLevel.textContent = levels[Math.floor(Math.random() * levels.length)];
    }
}, 5000);

// Network Map
const canvas = document.getElementById('network-map');
const ctx = canvas.getContext('2d');
const nodes = [];
for (let i = 0; i < 40; i++) {
    nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        infected: Math.random() < 0.15,
        target: generateTarget()
    });
}

function updateInfectedCount() {
    const infectedCount = nodes.filter(node => node.infected).length;
    document.getElementById('infected-count').textContent = infectedCount;
}

function drawNetworkMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';

    nodes.forEach(node => {
        node.x += node.dx;
        node.y += node.dy;
        if (node.x < 0 || node.x > canvas.width) node.dx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.dy *= -1;

        ctx.fillStyle = node.infected ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fill();

        nodes.forEach(other => {
            const dist = Math.hypot(node.x - other.x, node.y - other.y);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
                if (node.infected && Math.random() < 0.01) other.infected = true;
            }
        });
    });

    updateInfectedCount();
    requestAnimationFrame(drawNetworkMap);
}

canvas.addEventListener('click', (e) => {
    requireAuth(() => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        nodes.forEach(node => {
            const dist = Math.hypot(node.x - clickX, node.y - clickY);
            if (dist < 10) {
                node.infected = !node.infected;
                addLog(`Node at ${node.target.ip} (${node.target.service}) ${node.infected ? 'infected' : 'cleaned'}`);
            }
        });
    }, true); // Admin only
});

drawNetworkMap();
loadState();