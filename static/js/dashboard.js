/**
 * Dashboard JavaScript for Skin Saviour
 * Enhanced with real-time data analytics
 */

// DOM Elements
const scanCard = document.getElementById('scan-card');
const historyCard = document.getElementById('history-card');
const infoCard = document.getElementById('info-card');
const viewAllBtn = document.getElementById('view-all-btn');
const scansList = document.getElementById('scans-list');

// Load dashboard data
document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    loadRecentScans();
    loadDashboardStats();
    loadRecentActivity();
});

// Scan Image - Navigate to scan page
if (scanCard) {
    scanCard.addEventListener('click', () => {
        window.location.href = '/scan';
    });
    
    // Also handle the button click
    const scanBtn = scanCard.querySelector('.action-btn');
    if (scanBtn) {
        scanBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = '/scan';
        });
    }
}

// View History
if (historyCard) {
    historyCard.addEventListener('click', () => {
        window.location.href = '/history';
    });
    
    const historyBtn = historyCard.querySelector('.action-btn');
    if (historyBtn) {
        historyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = '/history';
        });
    }
}

// Information
if (infoCard) {
    infoCard.addEventListener('click', () => {
        window.location.href = '/info';
    });
    
    const infoBtn = infoCard.querySelector('.action-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = '/info';
        });
    }
}

// View All Scans
if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
        window.location.href = '/history';
    });
}

// Doctor Consultation
const doctorCard = document.getElementById('doctor-card');
if (doctorCard) {
    doctorCard.addEventListener('click', () => {
        window.location.href = '/consultation';
    });
    
    const doctorBtn = doctorCard.querySelector('.action-btn');
    if (doctorBtn) {
        doctorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = '/consultation';
        });
    }
}

// Nearby Doctors
const nearbyDoctorsCard = document.getElementById('nearby-doctors-card');
if (nearbyDoctorsCard) {
    nearbyDoctorsCard.addEventListener('click', () => {
        window.location.href = '/nearby-doctors';
    });
    
    const nearbyBtn = nearbyDoctorsCard.querySelector('.action-btn');
    if (nearbyBtn) {
        nearbyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = '/nearby-doctors';
        });
    }
}

// Tracking
const trackingCard = document.getElementById('tracking-card');
if (trackingCard) {
    trackingCard.addEventListener('click', () => {
        window.location.href = '/tracking';
    });
    
    const trackingBtn = trackingCard.querySelector('.action-btn');
    if (trackingBtn) {
        trackingBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = '/tracking';
        });
    }
}

// Load Statistics
async function loadStatistics() {
    try {
        // Try to load from localStorage (demo data)
        const stats = JSON.parse(localStorage.getItem('skinSaviourStats') || '{}');
        
        document.getElementById('total-scans').textContent = stats.totalScans || 0;
        document.getElementById('low-risk-count').textContent = stats.lowRisk || 0;
        document.getElementById('moderate-risk-count').textContent = stats.moderateRisk || 0;
        document.getElementById('high-risk-count').textContent = stats.highRisk || 0;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load Recent Scans
async function loadRecentScans() {
    try {
        const scans = JSON.parse(localStorage.getItem('skinSaviourScans') || '[]');
        
        if (scans.length === 0) {
            // Show empty state (already in HTML)
            return;
        }
        
        // Display recent scans (last 5)
        const recentScans = scans.slice(-5).reverse();
        scansList.innerHTML = '';
        
        recentScans.forEach(scan => {
            const scanItem = createScanItem(scan);
            scansList.appendChild(scanItem);
        });
    } catch (error) {
        console.error('Error loading recent scans:', error);
    }
}

// Create Scan Item Element
function createScanItem(scan) {
    const item = document.createElement('div');
    item.className = 'scan-item';
    item.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: background 0.3s ease;
    `;
    
    item.addEventListener('mouseenter', () => {
        item.style.background = '#f8f9fa';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
    });
    
    const riskColor = getRiskColor(scan.riskLevel);
    const date = new Date(scan.date).toLocaleDateString();
    
    item.innerHTML = `
        <div style="flex: 1;">
            <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${scan.riskLevel} Risk</div>
            <div style="font-size: 0.9em; color: #666;">${date}</div>
        </div>
        <div style="text-align: right;">
            <div style="font-size: 1.5em; font-weight: bold; color: ${riskColor};">
                ${scan.cancerPercentage}%
            </div>
            <div style="font-size: 0.85em; color: #999;">Cancer Probability</div>
        </div>
    `;
    
    return item;
}

// Get Risk Color
function getRiskColor(riskLevel) {
    const colors = {
        'High': '#dc3545',
        'Moderate': '#ffc107',
        'Low': '#28a745',
        'Very Low': '#17a2b8'
    };
    return colors[riskLevel] || '#666';
}

// Show Info Modal
function showInfoModal() {
    const info = `
SKIN CANCER DETECTION INFORMATION

🔬 About Skin Saviour:
Skin Saviour uses advanced CNN (Convolutional Neural Network) technology to analyze skin lesion images and provide cancer probability assessments.

⚠️ Important Notes:
• This is an AI-assisted tool, not a medical diagnosis
• Always consult a dermatologist for professional evaluation
• Regular professional skin exams are recommended
• Early detection is key to successful treatment

📊 How It Works:
1. Upload a clear image of a skin lesion
2. Our CNN model analyzes the image
3. Get instant cancer probability percentage
4. Review risk level and recommendations

Remember: This tool is for educational and screening purposes only. For any concerns, consult a healthcare professional immediately.
    `;
    
    alert(info);
}

/**
 * Load comprehensive dashboard statistics (NEW)
 */
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/dashboard-stats');
        const data = await response.json();
        
        if (data.success) {
            updateDashboardUI(data.stats);
        } else {
            console.error('Failed to load dashboard stats:', data.error);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

/**
 * Update dashboard UI with real statistics (NEW)
 */
function updateDashboardUI(stats) {
    // Update stat cards if they exist
    const totalScansEl = document.getElementById('total-scans');
    const highRiskEl = document.getElementById('high-risk-count');
    const mediumRiskEl = document.getElementById('medium-risk-count');
    const lowRiskEl = document.getElementById('low-risk-count');
    
    if (totalScansEl) totalScansEl.textContent = stats.total_scans || 0;
    if (highRiskEl) highRiskEl.textContent = stats.high_risk_count || 0;
    if (mediumRiskEl) mediumRiskEl.textContent = stats.medium_risk_count || 0;
    if (lowRiskEl) lowRiskEl.textContent = stats.low_risk_count || 0;
    
    // Render condition distribution chart
    renderConditionChart(stats.condition_distribution || {});
    
    // Display recent scans
    displayRecentScansCards(stats.recent_scans || []);
}

/**
 * Render condition distribution as visual chart (NEW)
 */
function renderConditionChart(distribution) {
    const chartContainer = document.getElementById('condition-chart');
    
    if (!chartContainer) return;
    
    chartContainer.innerHTML = '';
    
    if (Object.keys(distribution).length === 0) {
        chartContainer.innerHTML = '<p class="no-data">No scan data available yet</p>';
        return;
    }
    
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    const colors = {
        'Skin Cancer': '#dc3545',
        'Pimples': '#ffc107',
        'Normal': '#28a745'
    };
    
    Object.entries(distribution).forEach(([condition, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        
        const barWrapper = document.createElement('div');
        barWrapper.className = 'chart-bar-wrapper';
        barWrapper.style.marginBottom = '15px';
        
        const label = document.createElement('div');
        label.className = 'chart-label';
        label.textContent = condition;
        label.style.fontWeight = 'bold';
        label.style.marginBottom = '5px';
        
        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar-container';
        barContainer.style.width = '100%';
        barContainer.style.height = '25px';
        barContainer.style.backgroundColor = '#e9ecef';
        barContainer.style.borderRadius = '5px';
        barContainer.style.position = 'relative';
        barContainer.style.overflow = 'hidden';
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.width = percentage + '%';
        bar.style.height = '100%';
        bar.style.backgroundColor = colors[condition] || '#6c757d';
        bar.style.transition = 'width 0.5s ease';
        
        const valueLabel = document.createElement('span');
        valueLabel.className = 'chart-value';
        valueLabel.textContent = `${count} (${percentage}%)`;
        valueLabel.style.marginLeft = '10px';
        valueLabel.style.fontSize = '14px';
        
        barContainer.appendChild(bar);
        barWrapper.appendChild(label);
        barWrapper.appendChild(barContainer);
        barWrapper.appendChild(valueLabel);
        
        chartContainer.appendChild(barWrapper);
    });
}

/**
 * Display recent scans in cards (NEW)
 */
function displayRecentScansCards(recentScans) {
    const container = document.getElementById('recent-scans-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (recentScans.length === 0) {
        container.innerHTML = '<p class="no-data">No recent scans available</p>';
        return;
    }
    
    recentScans.forEach(scan => {
        const scanCard = createScanCard(scan);
        container.appendChild(scanCard);
    });
}

/**
 * Create a scan card element (NEW)
 */
function createScanCard(scan) {
    const card = document.createElement('div');
    card.className = `scan-card scan-card-${scan.risk_level?.toLowerCase() || 'low'}`;
    card.style.border = '1px solid #ddd';
    card.style.borderRadius = '8px';
    card.style.padding = '15px';
    card.style.marginBottom = '10px';
    card.style.cursor = 'pointer';
    card.onclick = () => viewScanDetails(scan.prediction_id);
    
    const date = new Date(scan.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const riskIcon = getRiskIcon(scan.risk_level);
    const confidencePercent = (scan.confidence * 100).toFixed(1);
    
    card.innerHTML = `
        <div class="scan-card-header" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span class="scan-risk-badge" style="padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold;">
                ${riskIcon} ${scan.risk_level || 'Unknown'}
            </span>
            <span class="scan-date" style="font-size: 12px; color: #666;">${formattedDate}</span>
        </div>
        <div class="scan-card-body">
            <h4 style="margin: 0 0 5px 0;">${scan.condition || 'Unknown'}</h4>
            <p class="scan-confidence" style="margin: 0; color: #666;">Confidence: ${confidencePercent}%</p>
        </div>
    `;
    
    return card;
}

/**
 * Get risk level icon (NEW)
 */
function getRiskIcon(riskLevel) {
    const icons = {
        'High': '⚠️',
        'Medium': '⚡',
        'Low': '✓'
    };
    return icons[riskLevel] || '•';
}

/**
 * View details of a specific scan (NEW)
 */
async function viewScanDetails(predictionId) {
    try {
        const response = await fetch(`/api/prediction/${predictionId}`);
        const data = await response.json();
        
        if (data.success) {
            alert(`Prediction Details:\n\nCondition: ${data.prediction.condition}\nConfidence: ${(data.prediction.confidence * 100).toFixed(2)}%\nRisk Level: ${data.prediction.risk_level}\nDate: ${new Date(data.prediction.timestamp).toLocaleString()}`);
        } else {
            alert('Failed to load scan details: ' + data.error);
        }
    } catch (error) {
        console.error('Error loading scan details:', error);
        alert('Error loading scan details');
    }
}

/**
 * Load recent activity (NEW)
 */
async function loadRecentActivity() {
    try {
        const response = await fetch('/api/prediction-history');
        const data = await response.json();
        
        if (data.success) {
            displayRecentActivity(data.predictions.slice(0, 5));
        }
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

/**
 * Display recent activity list (NEW)
 */
function displayRecentActivity(activities) {
    const container = document.getElementById('recent-activity-list');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (activities.length === 0) {
        container.innerHTML = '<li class="no-activity">No recent activity</li>';
        return;
    }
    
    activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.style.padding = '10px';
        li.style.borderBottom = '1px solid #eee';
        
        const date = new Date(activity.timestamp);
        const timeAgo = getTimeAgo(date);
        
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${activity.condition}</strong>
                    <span style="display: block; font-size: 12px; color: #666;">${timeAgo}</span>
                </div>
                <span style="font-weight: bold; color: #007bff;">${(activity.confidence * 100).toFixed(0)}%</span>
            </div>
        `;
        
        container.appendChild(li);
    });
}

/**
 * Get time ago string (NEW)
 */
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }
    
    return 'Just now';

}

