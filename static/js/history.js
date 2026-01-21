/**
 * History Page JavaScript for Skin Saviour
 */

let allScans = [];
let filteredScans = [];

// DOM Elements
const scansContainer = document.getElementById('scans-container');
const filterBtn = document.getElementById('filter-btn');
const filterSection = document.getElementById('filter-section');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const applyFilterBtn = document.getElementById('apply-filter-btn');
const resetFilterBtn = document.getElementById('reset-filter-btn');
const totalHistoryScans = document.getElementById('total-history-scans');
const filteredCount = document.getElementById('filtered-count');

// Load scans on page load
document.addEventListener('DOMContentLoaded', () => {
    loadScans();
    
    // Filter toggle
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            filterSection.classList.toggle('hidden');
        });
    }
    
    // Clear history
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
                clearHistory();
            }
        });
    }
    
    // Apply filter
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilter);
    }
    
    // Reset filter
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetFilter);
    }
});

// Load scans from localStorage
function loadScans() {
    try {
        const scans = JSON.parse(localStorage.getItem('skinSaviourScans') || '[]');
        allScans = scans.reverse(); // Most recent first
        filteredScans = [...allScans];
        
        totalHistoryScans.textContent = allScans.length;
        displayScans();
    } catch (error) {
        console.error('Error loading scans:', error);
        showEmptyState();
    }
}

// Display scans
function displayScans() {
    if (filteredScans.length === 0) {
        showEmptyState();
        return;
    }
    
    scansContainer.innerHTML = '';
    filteredCount.textContent = filteredScans.length;
    
    filteredScans.forEach(scan => {
        const scanItem = createScanItem(scan);
        scansContainer.appendChild(scanItem);
    });
}

// Create scan item element
function createScanItem(scan) {
    const item = document.createElement('div');
    item.className = 'scan-item-detailed';
    
    const date = new Date(scan.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const riskColor = getRiskColor(scan.riskLevel);
    const riskClass = getRiskClass(scan.riskLevel);
    
    item.innerHTML = `
        <div class="scan-info">
            <div class="scan-date">${formattedDate}</div>
            <div class="scan-risk">${scan.riskLevel} Risk</div>
            <span class="risk-badge ${riskClass}">${scan.isCancerous ? 'Cancer Detected' : 'No Cancer Detected'}</span>
        </div>
        <div class="scan-results">
            <div class="scan-percentage" style="color: ${riskColor};">${scan.cancerPercentage}%</div>
            <div class="scan-label">Cancer Probability</div>
        </div>
    `;
    
    return item;
}

// Get risk color
function getRiskColor(riskLevel) {
    const colors = {
        'High': '#dc3545',
        'Moderate': '#ffc107',
        'Low': '#28a745',
        'Very Low': '#17a2b8'
    };
    return colors[riskLevel] || '#666';
}

// Get risk class
function getRiskClass(riskLevel) {
    return 'risk-' + riskLevel.toLowerCase().replace(' ', '-');
}

// Show empty state
function showEmptyState() {
    scansContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📋</div>
            <p>No scan history available</p>
            <p class="empty-subtitle">Start scanning images to build your history</p>
            <a href="/scan" class="action-btn">Start Your First Scan</a>
        </div>
    `;
    filteredCount.textContent = '0';
}

// Apply filter
function applyFilter() {
    const filters = [];
    
    if (document.getElementById('filter-high').checked) filters.push('High');
    if (document.getElementById('filter-moderate').checked) filters.push('Moderate');
    if (document.getElementById('filter-low').checked) filters.push('Low');
    if (document.getElementById('filter-very-low').checked) filters.push('Very Low');
    
    if (filters.length === 0) {
        filteredScans = [...allScans];
    } else {
        filteredScans = allScans.filter(scan => filters.includes(scan.riskLevel));
    }
    
    displayScans();
    filterSection.classList.add('hidden');
}

// Reset filter
function resetFilter() {
    document.getElementById('filter-high').checked = false;
    document.getElementById('filter-moderate').checked = false;
    document.getElementById('filter-low').checked = false;
    document.getElementById('filter-very-low').checked = false;
    
    filteredScans = [...allScans];
    displayScans();
    filterSection.classList.add('hidden');
}

// Clear history
function clearHistory() {
    localStorage.removeItem('skinSaviourScans');
    localStorage.setItem('skinSaviourStats', JSON.stringify({
        totalScans: 0,
        lowRisk: 0,
        moderateRisk: 0,
        highRisk: 0
    }));
    
    allScans = [];
    filteredScans = [];
    displayScans();
    
    // Reload page to update dashboard stats
    setTimeout(() => {
        window.location.href = '/dashboard';
    }, 1000);
}

