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
beepSound.volume = 0.1;

let isAuthenticated = false;

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

// Авторизация
authBtn.addEventListener('click', () => {
    const username = authUsername.value.trim();
    const password = authPassword.value.trim();
    if (username === 'darknet' && password === 'darknet') {
        isAuthenticated = true;
        authOverlay.style.display = 'none';
        document.getElementById('access-status').textContent = 'Active';
        addLog('User authenticated: darknet');
    } else {
        authError.textContent = '> Access denied. Invalid credentials.';
        addLog('Failed login attempt');
    }
});

authPassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') authBtn.click();
});

// Проверка авторизации перед действиями
function requireAuth(callback) {
    if (isAuthenticated) {
        callback();
    } else {
        addLog('Access denied: Not authenticated');
        document.getElementById('output').textContent = '> Access denied. Login required.';
    }
}

let hackCount = 0, packetCount = 0, connCount = 0, botnetSize = 0;
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
    }
}, 2000);

let uptime = 0;
setInterval(() => {
    if (isAuthenticated) {
        uptime++;
        document.getElementById('uptime').textContent = `${uptime}s`;
        document.getElementById('cpu-load').textContent = `${Math.floor(Math.random() * 80) + 20}%`;
        document.getElementById('mem-usage').textContent = `${Math.floor(Math.random() * 90) + 10}%`;
        document.getElementById('net-traffic').textContent = `${Math.floor(Math.random() * 500) + 50} KB/s`;
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

const hackBtn = document.getElementById('hack-btn');
const progressFill = document.getElementById('progress-fill');
const output = document.getElementById('output');
const payloadStatus = document.getElementById('payload-status');
const targetIp = document.getElementById('target-ip');
hackBtn.addEventListener('click', () => {
    requireAuth(() => {
        progressFill.style.width = '0';
        output.textContent = '> Deploying exploit...';
        payloadStatus.textContent = 'Running';
        addLog('Exploit deployment started');
        setTimeout(() => {
            progressFill.style.width = '100%';
            output.textContent = '> Target owned!';
            payloadStatus.textContent = 'Success';
            targetIp.textContent = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            addLog('Exploit deployed successfully');
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
        output.textContent = '> Pinging target...';
        addLog('Ping initiated');
        progressFill.style.width = '0';
        setTimeout(() => {
            const latency = Math.floor(Math.random() * 150) + 30;
            progressFill.style.width = '90%';
            output.textContent = `> Latency: ${latency}ms`;
            addLog(`Ping completed: ${latency}ms`);
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
        output.textContent = '> Launching DDoS attack...';
        addLog('DDoS attack initiated');
        progressFill.style.width = '0';
        setTimeout(() => {
            progressFill.style.width = '100%';
            output.textContent = '> DDoS attack successful: 500 Mbps';
            addLog('DDoS attack completed');
            botnetSize += Math.floor(Math.random() * 10) + 5;
            document.getElementById('botnet-size').textContent = botnetSize;
        }, 1500);
    });
});

const injectBtn = document.getElementById('inject-btn');
injectBtn.addEventListener('click', () => {
    requireAuth(() => {
        output.textContent = '> Injecting payload...';
        addLog('Payload injection started');
        progressFill.style.width = '0';
        setTimeout(() => {
            progressFill.style.width = '85%';
            output.textContent = '> Payload injected: Backdoor active';
            addLog('Payload injection successful');
        }, 1100);
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
    authOverlay.style.display = 'flex';
    document.getElementById('access-status').textContent = 'Inactive';
    addLog('User logged out');
    authUsername.value = '';
    authPassword.value = '';
    authError.textContent = '';
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
    'help': 'Available commands: help, clear, ping, scan, exploit, ddos, encrypt, inject, status, logout, exit',
    'clear': () => terminalContent.innerHTML = '> Terminal cleared',
    'ping': 'Pinging network... Check output panel',
    'scan': 'Scanning network... Check output panel',
    'exploit': 'Deploying exploit... Check output panel',
    'ddos': 'Launching DDoS... Check output panel',
    'encrypt': 'Encrypting data... Check output panel',
    'inject': 'Injecting payload... Check output panel',
    'status': () => `System status: Uptime ${uptime}s, Hacks ${hackCount}, Packets ${packetCount}, Botnet ${botnetSize}`,
    'logout': () => { logoutBtn.click(); return '> Logging out...'; },
    'exit': () => terminalOverlay.style.display = 'none'
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        requireAuth(() => {
            const input = terminalInput.value.trim().toLowerCase();
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
        });
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
        addLog(alerts[Math.floor(Math.random() * alerts.length)]);
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
for (let i = 0; i < 30; i++) {
    nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        infected: Math.random() < 0.2
    });
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

    requestAnimationFrame(drawNetworkMap);
}
drawNetworkMap();