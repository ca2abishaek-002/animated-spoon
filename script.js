// KSEB Electric Fence Monitoring System with AI Chatbot
class KSEBMonitoringSystem {
    constructor() {
        // Fence data
        this.fenceData = [
            {
                id: "KSEB001",
                name: "Thiruvananthapuram Central",
                location: "TVM District Office",
                current: 11.2,
                voltage: 8.5,
                status: "normal",
                dailyPeak: 12.1,
                owner: "District Collector Office",
                contact: "91-471-2345678"
            },
            {
                id: "KSEB002",
                name: "Kochi Industrial Zone",
                location: "Kakkanad IT Park",
                current: 14.7,
                voltage: 8.3,
                status: "critical",
                dailyPeak: 15.2,
                owner: "IT Park Authority",
                contact: "91-484-2345678"
            },
            {
                id: "KSEB003",
                name: "Kozhikode Beach Road",
                location: "Beach Road Substation",
                current: 9.8,
                voltage: 8.7,
                status: "normal",
                dailyPeak: 11.3,
                owner: "Tourism Department",
                contact: "91-495-2345678"
            },
            {
                id: "KSEB004",
                name: "Thrissur Cultural Center",
                location: "Swaraj Round",
                current: 12.9,
                voltage: 8.4,
                status: "warning",
                dailyPeak: 13.4,
                owner: "Cultural Affairs Dept",
                contact: "91-487-2345678"
            },
            {
                id: "KSEB005",
                name: "Kollam Port Authority",
                location: "Kollam Port Complex",
                current: 10.5,
                voltage: 8.6,
                status: "normal",
                dailyPeak: 11.8,
                owner: "Port Trust",
                contact: "91-474-2345678"
            },
            {
                id: "KSEB006",
                name: "Palakkad Railway Junction",
                location: "Railway Station Perimeter",
                current: 13.2,
                voltage: 8.2,
                status: "warning",
                dailyPeak: 13.8,
                owner: "Indian Railways",
                contact: "91-491-2345678"
            },
            {
                id: "KSEB007",
                name: "Malappuram Govt Complex",
                location: "District Collectorate",
                current: 8.7,
                voltage: 8.8,
                status: "normal",
                dailyPeak: 10.2,
                owner: "District Administration",
                contact: "91-483-2345678"
            },
            {
                id: "KSEB008",
                name: "Kannur Airport Perimeter",
                location: "International Airport",
                current: 11.8,
                voltage: 8.4,
                status: "normal",
                dailyPeak: 12.5,
                owner: "Airport Authority",
                contact: "91-497-2345678"
            },
            {
                id: "KSEB009",
                name: "Wayanad Tourist Center",
                location: "Vythiri Resort Area",
                current: 7.9,
                voltage: 8.9,
                status: "normal",
                dailyPeak: 9.1,
                owner: "Forest Department",
                contact: "91-493-2345678"
            },
            {
                id: "KSEB010",
                name: "Idukki Dam Security",
                location: "Dam Perimeter Fence",
                current: 12.4,
                voltage: 8.3,
                status: "normal",
                dailyPeak: 13.1,
                owner: "Dam Authority",
                contact: "91-486-2345678"
            }
        ];

        this.alertThreshold = 13.0;
        this.warningThreshold = 11.0;
        this.currentPage = window.location.pathname.includes('fence-details') ? 'details' : 'dashboard';
        
        this.init();
    }

    init() {
        if (this.currentPage === 'dashboard') {
            this.initDashboard();
        } else {
            this.initDetailsPage();
        }
        
        // Initialize chatbot
        this.initChatbot();
        
        // Start real-time updates
        this.startRealTimeUpdates();
    }

    initDashboard() {
        this.renderFenceGrid();
        this.updateStatistics();
        this.showAlertBanner();
    }

    initDetailsPage() {
        this.loadSelectedFenceDetails();
        this.drawChart();
    }

    renderFenceGrid() {
        const fenceGrid = document.getElementById('fenceGrid');
        if (!fenceGrid) return;

        fenceGrid.innerHTML = this.fenceData.map(fence => `
            <div class="fence-card ${fence.status}" onclick="openFenceDetails('${fence.id}')">
                <div class="fence-header">
                    <div>
                        <h3 class="fence-name">${fence.name}</h3>
                        <p class="fence-location">${fence.location}</p>
                    </div>
                    <span class="status-indicator ${fence.status}">
                        ${fence.status.toUpperCase()}
                    </span>
                </div>
                <div class="fence-metrics">
                    <div class="metric">
                        <div class="metric-label">Current</div>
                        <div class="metric-value ${fence.status}">${fence.current}A</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Voltage</div>
                        <div class="metric-value">${fence.voltage}V</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Owner</div>
                        <div class="metric-value" style="font-size: 12px;">${fence.owner}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Daily Peak</div>
                        <div class="metric-value">${fence.dailyPeak}A</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateStatistics() {
        const normal = this.fenceData.filter(f => f.status === 'normal').length;
        const warning = this.fenceData.filter(f => f.status === 'warning').length;
        const critical = this.fenceData.filter(f => f.status === 'critical').length;

        this.updateElement('totalFences', this.fenceData.length);
        this.updateElement('normalCount', normal);
        this.updateElement('warningCount', warning);
        this.updateElement('criticalCount', critical);
    }

    showAlertBanner() {
        const criticalFences = this.fenceData.filter(f => f.status === 'critical');
        const alertBanner = document.getElementById('alertBanner');
        
        if (criticalFences.length > 0 && alertBanner) {
            alertBanner.style.display = 'block';
        }
    }

    loadSelectedFenceDetails() {
        const selectedFenceId = localStorage.getItem('selectedFenceId') || 'KSEB002';
        const fence = this.fenceData.find(f => f.id === selectedFenceId);
        
        if (!fence) return;

        // Update all details page elements
        this.updateElement('fenceName', fence.name);
        this.updateElement('fenceId', fence.id);
        this.updateElement('fenceLocation', fence.location);
        this.updateElement('fenceOwner', fence.owner);
        this.updateElement('fenceContact', fence.contact);
        this.updateElement('currentReading', `${fence.current}A`);
        this.updateElement('voltageReading', `${fence.voltage}V`);
        this.updateElement('dailyPeak', `${fence.dailyPeak}A`);
        this.updateElement('lastUpdated', 'Now');

        // Update status card
        const statusCard = document.getElementById('statusCard');
        const statusBadge = document.getElementById('statusBadge');
        const alertMessage = document.getElementById('alertMessage');

        if (statusCard && statusBadge && alertMessage) {
            statusCard.className = `status-card ${fence.status}`;
            statusBadge.textContent = fence.status.toUpperCase();
            
            if (fence.status === 'critical') {
                alertMessage.textContent = `Current exceeds ${this.alertThreshold}A safety threshold!`;
            } else if (fence.status === 'warning') {
                alertMessage.textContent = `Current approaching safety threshold (${fence.current}A/${this.alertThreshold}A)`;
            } else {
                alertMessage.textContent = 'Electric fence operating within safe parameters';
            }
        }

        // Update trends
        this.updateElement('currentTrend', this.calculateTrend(fence.current, fence.dailyPeak));
        this.updateElement('voltageTrend', '→ Stable');
        this.updateElement('peakTime', 'at 14:23 IST');
    }

    calculateTrend(current, peak) {
        const diff = (current - (peak * 0.8)).toFixed(1);
        if (diff > 0) {
            return `↑ +${diff}A from average`;
        } else if (diff < 0) {
            return `↓ ${diff}A from average`;
        } else {
            return '→ At average level';
        }
    }

    drawChart() {
        const canvas = document.getElementById('currentChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Generate sample data points
        const dataPoints = [];
        const selectedFenceId = localStorage.getItem('selectedFenceId') || 'KSEB002';
        const baseCurrent = this.fenceData.find(f => f.id === selectedFenceId)?.current || 14.7;
        
        for (let i = 0; i < 50; i++) {
            const variation = (Math.random() - 0.5) * 2;
            dataPoints.push(baseCurrent + variation);
        }

        // Draw grid
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = (width / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Draw threshold line
        const thresholdY = height - (this.alertThreshold / 20) * height;
        ctx.strokeStyle = '#dc3545';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, thresholdY);
        ctx.lineTo(width, thresholdY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw data line
        ctx.strokeStyle = '#003f7f';
        ctx.lineWidth = 3;
        ctx.beginPath();

        dataPoints.forEach((point, index) => {
            const x = (width / (dataPoints.length - 1)) * index;
            const y = height - (point / 20) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw current point
        const currentX = width - (width / (dataPoints.length - 1));
        const currentY = height - (baseCurrent / 20) * height;
        ctx.fillStyle = baseCurrent > this.alertThreshold ? '#dc3545' : '#003f7f';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI);
        ctx.fill();
    }

    startRealTimeUpdates() {
        setInterval(() => {
            // Simulate real-time data changes
            this.fenceData.forEach(fence => {
                const variation = (Math.random() - 0.5) * 0.2;
                fence.current = Math.max(0, fence.current + variation);
                fence.voltage = Math.max(0, Math.min(10, fence.voltage + (Math.random() - 0.5) * 0.1));
                
                // Update status based on current
                if (fence.current > this.alertThreshold) {
                    fence.status = 'critical';
                } else if (fence.current > this.warningThreshold) {
                    fence.status = 'warning';
                } else {
                    fence.status = 'normal';
                }
            });

            if (this.currentPage === 'dashboard') {
                this.renderFenceGrid();
                this.updateStatistics();
            } else {
                this.loadSelectedFenceDetails();
                this.drawChart();
            }
        }, 5000);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Chatbot functionality
    initChatbot() {
        this.chatbot = new KSEBChatbot();
    }
}

// Navigation functions
function openFenceDetails(fenceId) {
    localStorage.setItem('selectedFenceId', fenceId);
    window.location.href = 'fence-details.html';
}

function goBack() {
    window.location.href = 'index.html';
}

function refreshData() {
    window.location.reload();
}

function closeAlert() {
    const alertBanner = document.getElementById('alertBanner');
    if (alertBanner) {
        alertBanner.style.display = 'none';
    }
}

function downloadReport() {
    alert('Report download feature will be implemented soon!');
}

function reportEmergency() {
    alert('Emergency reported to KSEB Control Room!\\nEmergency Hotline: 1912');
}

// AI Chatbot Class
class KSEBChatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.responses = {
            greeting: "Hello! I'm the KSEB AI Assistant. I can help you understand fence readings, explain alerts, and guide you through our monitoring system. How can I assist you today?",
            currentReading: "Current readings show the electrical flow through each fence in Amperes (A). Normal range is 0-11A, Warning is 11-13A, and Critical is above 13A which triggers emergency protocols.",
            criticalAlert: "Critical alerts occur when current exceeds 13A, indicating potential safety hazards. Emergency notifications are automatically sent to KSEB officials and fence owners for immediate action.",
            safetyThreshold: "Our safety threshold is set at 13 Amperes. This limit ensures safe operation while maintaining effective perimeter security. Readings above this trigger immediate alerts.",
            fenceLocations: "We monitor 10 strategic locations across Kerala including government offices, industrial zones, transportation hubs, and tourist centers for comprehensive security coverage.",
            dashboard: "The dashboard shows real-time status with color coding: Green (Normal), Orange (Warning), Red (Critical). Data updates every 5 seconds with detailed fence information.",
            emergency: "In emergencies, the system automatically notifies KSEB officials, fence owners, and emergency services. Critical alerts flash red and include contact information for immediate response.",
            dataUpdate: "Our system provides live updates every 5 seconds, monitoring current flow, voltage levels, and system status to ensure continuous security and safety.",
            contact: "Each fence has designated owners and emergency contacts. You can find contact information in the fence details. For system issues, contact KSEB technical support.",
            navigation: "To view detailed information about any fence, simply click on its card in the main dashboard. You can return to the dashboard using the back button.",
            default: "I understand you're asking about our fence monitoring system. Could you be more specific? I can help with current readings, alerts, safety thresholds, dashboard navigation, or emergency procedures."
        };
        
        this.contextResponses = {
            'KSEB002': "KSEB002 (Kochi Industrial Zone) is currently showing CRITICAL status with 14.7A current - above our 13A safety threshold. Emergency notifications have been sent to IT Park Authority and KSEB officials.",
            'critical': "Critical fences require immediate attention. Current is above 13A threshold, triggering automatic notifications to owners and KSEB control room. Safety protocols are activated.",
            'normal': "Normal status indicates fence is operating safely within 0-11A range. No immediate action required, but continuous monitoring continues every 5 seconds."
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const chatBubble = document.getElementById('chatBubble');
        const closeBtn = document.getElementById('closeBtn');
        const minimizeBtn = document.getElementById('minimizeBtn');
        const sendBtn = document.getElementById('sendBtn');
        const chatInput = document.getElementById('chatInput');

        if (chatBubble) chatBubble.addEventListener('click', () => this.toggleChat());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeChat());
        if (minimizeBtn) minimizeBtn.addEventListener('click', () => this.minimizeChat());
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatWindow');
        const chatBubble = document.getElementById('chatBubble');
        
        if (!this.isOpen) {
            if (chatWindow) chatWindow.classList.add('active');
            if (chatBubble) chatBubble.style.display = 'none';
            this.isOpen = true;
        } else {
            this.closeChat();
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chatWindow');
        const chatBubble = document.getElementById('chatBubble');
        
        if (chatWindow) chatWindow.classList.remove('active');
        if (chatBubble) chatBubble.style.display = 'flex';
        this.isOpen = false;
        this.isMinimized = false;
    }

    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        const chatWindow = document.getElementById('chatWindow');
        
        if (chatWindow) {
            if (this.isMinimized) {
                chatWindow.style.height = '80px';
            } else {
                chatWindow.style.height = '500px';
            }
        }
    }

    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        chatInput.value = '';
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1500);
    }

    addMessage(content, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.classList.add('active');
        }
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.classList.remove('active');
        }
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for specific fence IDs
        const fenceIdMatch = message.match(/KSEB\\d+/);
        if (fenceIdMatch && this.contextResponses[fenceIdMatch[0]]) {
            return this.contextResponses[fenceIdMatch[0]];
        }
        
        // Context-aware responses
        if (lowerMessage.includes('current') || lowerMessage.includes('reading') || lowerMessage.includes('ampere')) {
            return this.responses.currentReading;
        } else if (lowerMessage.includes('critical') || lowerMessage.includes('alert') || lowerMessage.includes('emergency')) {
            return this.responses.criticalAlert;
        } else if (lowerMessage.includes('threshold') || lowerMessage.includes('limit') || lowerMessage.includes('safety')) {
            return this.responses.safetyThreshold;
        } else if (lowerMessage.includes('dashboard') || lowerMessage.includes('interface') || lowerMessage.includes('navigate')) {
            return this.responses.dashboard;
        } else if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('fence')) {
            return this.responses.fenceLocations;
        } else if (lowerMessage.includes('update') || lowerMessage.includes('refresh') || lowerMessage.includes('real-time')) {
            return this.responses.dataUpdate;
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
            return this.responses.contact;
        } else if (lowerMessage.includes('click') || lowerMessage.includes('details') || lowerMessage.includes('view')) {
            return this.responses.navigation;
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return this.responses.greeting;
        } else {
            return this.responses.default;
        }
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new KSEBMonitoringSystem();
});