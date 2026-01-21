/**
 * Dashboard JavaScript for Skin Saviour
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

