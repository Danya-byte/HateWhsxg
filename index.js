const logsPanel = document.getElementById('logs-panel');
const logsContent = document.getElementById('logs-content');
const terminalOverlay = document.getElementById('terminal-overlay');
const terminalContent = document.getElementById('terminal-content');
const terminalInput = document.getElementById('terminal-input');
const beepSound = document.getElementById('beep-sound');

function addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    logsContent.innerHTML += `<br>> [${timestamp}] ${message}`;
    logsContent.scrollTop = logsContent.scrollHeight;
    beepSound.play();
}

function addTerminalOutput(message) {
    terminalContent.innerHTML += `<br>> ${message}`;
    terminalContent.scrollTop = terminalContent.scrollHeight;
    beepSound.play();
}

let hackCount = 0, packetCount = 0, connCount = 0;
setInterval(() => {
    hackCount += Math.floor(Math.random() * 3) + 1;
    packetCount += Math.floor(Math.random() * 100) + 50;
    connCount += Math.floor(Math.random() * 2);
    document.getElementById('hack-counter').textContent = hackCount;
    document.getElementById('packet-counter').textContent = packetCount;
    document.getElementById('conn-count').textContent = connCount;
    if (Math.random() < 0.2) addLog(`Intrusion #${hackCount} | Packets: ${packetCount}`);
}, 2000);

let uptime = 0;
setInterval(() => {
    uptime++;
    document.getElementById('uptime').textContent = `${uptime}s`;
    document.getElementById('cpu-load').textContent = `${Math.floor(Math.random() * 80) + 20}%`;
    document.getElementById('mem-usage').textContent = `${Math.floor(Math.random() * 90) + 10}%`;
    document.getElementById('net-traffic').textContent = `${Math.floor(Math.random() * 500) + 50} KB/s`;
}, 1000);

const telegramLink = document.getElementById('telegram-link');
const footerTelegramLink = document.getElementById('footer-telegram-link');
const modal = document.getElementById('confirm-modal');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

function showModal(linkElement) {
    modal.style.display = 'flex';
    confirmYes.onclick = () => {
        window.open('https://t.me/hatewhsxg', '_blank');
        addLog('Uplink to Telegram established');
        modal.style.display = 'none';
    };
    confirmNo.onclick = () => {
        addLog('Uplink to Telegram aborted');
        modal.style.display = 'none';
    };
}
telegramLink.addEventListener('click', (e) => { e.preventDefault(); showModal(telegramLink); });
footerTelegramLink.addEventListener('click', (e) => { e.preventDefault(); showModal(footerTelegramLink); });

const hackBtn = document.getElementById('hack-btn');
const progressFill = document.getElementById('progress-fill');
const output = document.getElementById('output');
const payloadStatus = document.getElementById('payload-status');
const targetIp = document.getElementById('target-ip');
hackBtn.addEventListener('click', () => {
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

const logsBtn = document.getElementById('logs-btn');
logsBtn.addEventListener('click', () => {
    logsPanel.style.display = logsPanel.style.display === 'block' ? 'none' : 'block';
    addLog('Log panel toggled');
});

let firewallActive = false;
const firewallBtn = document.getElementById('firewall-btn');
firewallBtn.addEventListener('click', () => {
    firewallActive = !firewallActive;
    output.textContent = `> Firewall ${firewallActive ? 'ON' : 'OFF'}`;
    addLog(`Firewall ${firewallActive ? 'enabled' : 'disabled'}`);
    progressFill.style.width = firewallActive ? '60%' : '0';
});

const pingBtn = document.getElementById('ping-btn');
pingBtn.addEventListener('click', () => {
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

const scanBtn = document.getElementById('scan-btn');
scanBtn.addEventListener('click', () => {
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

const encryptBtn = document.getElementById('encrypt-btn');
encryptBtn.addEventListener('click', () => {
    output.textContent = '> Encrypting data...';
    addLog('Encryption process initiated');
    progressFill.style.width = '0';
    setTimeout(() => {
        progressFill.style.width = '100%';
        output.textContent = '> Data encrypted: AES-256';
        addLog('Encryption completed');
    }, 1200);
});

const terminalBtn = document.getElementById('terminal-btn');
terminalBtn.addEventListener('click', () => {
    terminalOverlay.style.display = terminalOverlay.style.display === 'flex' ? 'none' : 'flex';
    addLog('Terminal toggled');
    terminalInput.focus();
});

const toolButtons = document.querySelectorAll('.tool-btn');
toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
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

const commands = {
    'help': 'Available commands: help, clear, ping, scan, exploit, status, exit',
    'clear': () => terminalContent.innerHTML = '> Terminal cleared',
    'ping': 'Pinging network... Check output panel',
    'scan': 'Scanning network... Check output panel',
    'exploit': 'Deploying exploit... Check output panel',
    'status': `System status: Uptime ${uptime}s, Hacks ${hackCount}, Packets ${packetCount}`,
    'exit': () => terminalOverlay.style.display = 'none'
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
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
    }
});

const alerts = [
    'Suspicious packet intercepted',
    'DDoS attempt blocked',
    'Backdoor access detected',
    'Firewall breach attempt',
    'Rootkit installation failed',
    'SQL injection detected',
    'Port scan detected'
];
setInterval(() => {
    if (Math.random() < 0.15) {
        addLog(alerts[Math.floor(Math.random() * alerts.length)]);
    }
}, 4000);

setInterval(() => {
    if (Math.random() < 0.05) {
        document.body.style.filter = 'blur(1px)';
        setTimeout(() => document.body.style.filter = 'none', 200);
        addLog('System glitch detected');
    }
}, 10000);

setInterval(() => {
    const threatLevel = document.getElementById('threat-level');
    const levels = ['Low', 'Medium', 'High', 'Critical'];
    threatLevel.textContent = levels[Math.floor(Math.random() * levels.length)];
}, 5000);