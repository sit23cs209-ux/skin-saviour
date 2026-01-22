/**
 * Skin Saviour - Frontend JavaScript
 * Handles image upload, validation, and result display
 */

const API_BASE_URL = '';

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const getStartedBtn = document.getElementById('get-started-btn');
const mainContent = document.getElementById('main-content');
const footer = document.getElementById('footer');
const uploadArea = document.getElementById('upload-area');
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const analyzeBtn = document.getElementById('analyze-btn');
const uploadSection = document.getElementById('upload-section');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const errorSection = document.getElementById('error-section');
const resultContent = document.getElementById('result-content');
const recommendationsDiv = document.getElementById('recommendations');
const errorMessage = document.getElementById('error-message');
const newAnalysisBtn = document.getElementById('new-analysis-btn');
const retryBtn = document.getElementById('retry-btn');

let selectedFile = null;

// Welcome Screen Handler
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        footer.classList.remove('hidden');
    });
}

// Auto-hide welcome screen after 5 seconds (optional)
setTimeout(() => {
    if (welcomeScreen && !welcomeScreen.classList.contains('hidden')) {
        // Optional: Auto-hide after 5 seconds
        // welcomeScreen.classList.add('hidden');
        // mainContent.classList.remove('hidden');
        // footer.classList.remove('hidden');
    }
}, 5000);

// Event Listeners
if (imageInput) imageInput.addEventListener('change', handleFileSelect);
if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeImage);
if (newAnalysisBtn) newAnalysisBtn.addEventListener('click', resetAnalysis);
if (retryBtn) retryBtn.addEventListener('click', resetAnalysis);

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

uploadArea.addEventListener('click', () => {
    imageInput.click();
});

/**
 * Handle file selection from input
 */
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

/**
 * Handle selected file
 */
function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file.');
        return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('File size exceeds 10MB limit. Please select a smaller image.');
        return;
    }
    
    selectedFile = file;
    
    // Display preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        imagePreview.classList.remove('hidden');
        analyzeBtn.classList.remove('hidden');
        analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

/**
 * Analyze the uploaded image
 */
async function analyzeImage() {
    if (!selectedFile) {
        showError('Please select an image first.');
        return;
    }
    
    // Show loading, hide other sections
    showLoading();
    
    try {
        // Create form data
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        // Make API request
        const response = await fetch(`${API_BASE_URL}/api/predict`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Show detailed error message
            let errorMsg = data.error || 'Prediction failed';
            if (data.message) {
                errorMsg += ': ' + data.message;
            }
            if (data.details) {
                errorMsg += '\n\n' + data.details;
            }
            throw new Error(errorMsg);
        }
        
        // Display results
        displayResults(data.prediction);
        
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = error.message || 'An error occurred while analyzing the image. Please try again.';
        
        // Show more detailed error in console for debugging
        if (error.message) {
            console.error('Detailed error:', error.message);
        }
        
        showError(errorMessage);
    }
}

/**
 * Display prediction results - Shows actual cancer percentage from CNN analysis
 */
function displayResults(prediction) {
    const isCancerous = prediction.is_cancerous;
    const cancerPercentage = prediction.probabilities?.skin_cancer || 0;
    const nonCancerPercentage = (prediction.probabilities?.normal || 0) + (prediction.probabilities?.pimples || 0);
    const riskLevel = prediction.risk_level;
    const lesionDetected = prediction.lesion_detected !== undefined ? prediction.lesion_detected : true;
    const lesionConfidence = prediction.lesion_confidence || 100;
    
    // Check detection results
    const isPimple = prediction.is_pimples || false;
    const pimpleReason = prediction.pimple_reason || '';
    const isClearSkin = prediction.is_normal || false;
    const rawProbability = prediction.raw_probabilities?.skin_cancer !== undefined ? (prediction.raw_probabilities.skin_cancer * 100).toFixed(2) : null;
    
    // Determine icon and styling based on ACTUAL result
    let icon = '✅';
    let resultClass = 'result-no-cancer';
    if (isCancerous) {
        icon = '⚠️';
        resultClass = 'result-cancer';
    } else if (isPimple) {
        icon = '✨';
        resultClass = 'result-clear-skin';
    } else if (isClearSkin) {
        icon = '✨';
        resultClass = 'result-clear-skin';
    }
    
    // Build result HTML with prominent cancer percentage display
    let resultHTML = `
        <div class="result-box ${resultClass}">
            <div class="result-title">
                <span class="icon">${icon}</span>
                <span>${prediction.condition || prediction.message || 'Result'}</span>
            </div>
            
            ${isPimple ? `
            <div class="pimple-notice">
                <strong>🔍 Image Analysis:</strong> ${pimpleReason}
                <br><br>
                <strong>Result:</strong> This appears to be a benign skin condition (pimple/acne), not skin cancer. 
                The cancer probability is <strong>${cancerPercentage}%</strong> (very low).
                <br><br>
                <em>Note: Pimples and acne are common benign skin conditions and are not cancerous.</em>
            </div>
            ` : ''}
            
            ${isClearSkin && !isPimple ? `
            <div class="clear-skin-notice">
                <strong>📸 Image Analysis:</strong> This image shows clear/uniform skin without visible lesions. 
                The cancer probability is <strong>${cancerPercentage}%</strong> (minimal risk).
            </div>
            ` : ''}
            
            ${isCancerous ? `
            <div class="cancer-detected-notice">
                <strong>⚠️ Important:</strong> Based on CNN analysis, this image shows <strong>${cancerPercentage}%</strong> cancer probability.
                <br><br>
                <strong>Please consult a dermatologist immediately for professional evaluation.</strong>
            </div>
            ` : ''}
            
            <div class="percentage-display">
                <div class="percentage-main">
                    <div class="percentage-value cancer-percentage">${cancerPercentage.toFixed(2)}%</div>
                    <div class="percentage-label">Cancer Probability</div>
                </div>
                <div class="percentage-separator">vs</div>
                <div class="percentage-main">
                    <div class="percentage-value non-cancer-percentage">${nonCancerPercentage.toFixed(2)}%</div>
                    <div class="percentage-label">Non-Cancer Probability</div>
                </div>
            </div>
            
            <div class="risk-level risk-${riskLevel.toLowerCase().replace(' ', '-')}">
                Risk Level: ${riskLevel}
            </div>
            
            <div class="prediction-details">
                <p><strong>Analysis Result:</strong> Based on CNN model prediction, this image shows <strong>${cancerPercentage.toFixed(2)}%</strong> probability of being cancerous.</p>
                ${rawProbability !== null ? `
                <p style="font-size: 0.9em; color: #666; margin-top: 8px;">
                    <em>Model confidence: ${prediction.confidence}% | Class: ${prediction.predicted_class}</em>
                </p>
                ` : ''}
            </div>
        </div>
    `;
    
    // Add warnings if any
    if (prediction.warnings && prediction.warnings.length > 0) {
        resultHTML += `
            <div class="disclaimer" style="background: #d1ecf1; border-color: #17a2b8;">
                <strong>⚠️ Image Quality Warnings:</strong>
                <ul style="margin-top: 10px; padding-left: 20px;">
                    ${prediction.warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    resultContent.innerHTML = resultHTML;
    
    // Display recommendations
    displayRecommendations(isCancerous, riskLevel);
    
    // Save scan to history
    saveScanToHistory(prediction);
    
    // Fetch and display condition information
    fetchConditionInfo(prediction.condition);
    
    // Show results section
    resultsSection.classList.remove('hidden');
    loadingSection.classList.add('hidden');
}

// Fetch condition information from medical knowledge base
async function fetchConditionInfo(condition) {
    try {
        const conditionKey = condition.toLowerCase().replace(/ /g, '_');
        const response = await fetch(`/api/condition-info/${conditionKey}`);
        const data = await response.json();
        
        if (data.success) {
            displayConditionInfo(data.information);
        } else {
            console.error('Failed to fetch condition info:', data.error);
        }
    } catch (error) {
        console.error('Error fetching condition info:', error);
    }
}

// Display condition information
function displayConditionInfo(info) {
    const infoContainer = document.getElementById('condition-info-container');
    
    if (!infoContainer) {
        // Create container if it doesn't exist
        const resultsSection = document.getElementById('results');
        const container = document.createElement('div');
        container.id = 'condition-info-container';
        container.className = 'condition-info';
        container.style.marginTop = '20px';
        container.style.padding = '20px';
        container.style.backgroundColor = '#f8f9fa';
        container.style.borderRadius = '8px';
        resultsSection.appendChild(container);
        return displayConditionInfo(info); // Retry with created container
    }
    
    let html = `<h3>📋 Condition Information</h3>`;
    html += `<p><strong>${info.name}</strong> - ${info.severity || 'N/A'}</p>`;
    html += `<p>${info.description}</p>`;
    
    if (info.immediate_actions && info.immediate_actions.length > 0) {
        html += `<h4>⚡ Immediate Actions:</h4><ul>`;
        info.immediate_actions.forEach(action => {
            html += `<li>${action}</li>`;
        });
        html += `</ul>`;
    }
    
    if (info.prevention && info.prevention.length > 0) {
        html += `<h4>🛡️ Prevention Tips:</h4><ul>`;
        info.prevention.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += `</ul>`;
    }
    
    infoContainer.innerHTML = html;
}

// Save scan results to localStorage for dashboard
function saveScanToHistory(prediction) {
    try {
        const scans = JSON.parse(localStorage.getItem('skinSaviourScans') || '[]');
        const stats = JSON.parse(localStorage.getItem('skinSaviourStats') || '{}');
        
        const cancerPercentage = prediction.probabilities?.skin_cancer || 0;
        
        // Add new scan
        scans.push({
            date: new Date().toISOString(),
            cancerPercentage: cancerPercentage,
            riskLevel: prediction.risk_level,
            isCancerous: prediction.is_cancerous
        });
        
        // Update statistics
        stats.totalScans = (stats.totalScans || 0) + 1;
        if (prediction.risk_level === 'High') {
            stats.highRisk = (stats.highRisk || 0) + 1;
        } else if (prediction.risk_level === 'Moderate') {
            stats.moderateRisk = (stats.moderateRisk || 0) + 1;
        } else {
            stats.lowRisk = (stats.lowRisk || 0) + 1;
        }
        
        localStorage.setItem('skinSaviourScans', JSON.stringify(scans));
        localStorage.setItem('skinSaviourStats', JSON.stringify(stats));
    } catch (error) {
        console.error('Error saving scan history:', error);
    }
}

/**
 * Display recommendations based on results
 */
function displayRecommendations(isCancerous, riskLevel) {
    let recommendationsHTML = '<h3>Recommendations</h3><ul>';
    
    if (isCancerous || riskLevel === 'High' || riskLevel === 'Moderate') {
        recommendationsHTML += `
            <li><strong>Immediate Action Required:</strong> Please consult a dermatologist as soon as possible for professional evaluation.</li>
            <li>Schedule an appointment with a certified dermatologist for confirmation.</li>
            <li>Do not delay seeking medical attention.</li>
            <li>Keep the affected area clean and avoid irritation.</li>
        `;
        
        recommendationsHTML += `
            <button class="btn" onclick="findNearbyDoctors()" style="background: #28a745; color: white; margin-top: 15px;">
                Find Nearby Dermatologists
            </button>
        `;
    } else {
        recommendationsHTML += `
            <li>Continue regular monitoring of the skin lesion.</li>
            <li>Take photos periodically to track any changes.</li>
            <li>If you notice any changes in size, color, or shape, consult a dermatologist.</li>
            <li>Practice good sun protection habits (use sunscreen, wear protective clothing).</li>
            <li>Schedule regular skin check-ups with a dermatologist.</li>
        `;
    }
    
    recommendationsHTML += '</ul>';
    recommendationsDiv.innerHTML = recommendationsHTML;
}

/**
 * Find nearby doctors (placeholder function)
 */
function findNearbyDoctors() {
    alert('This feature would integrate with a doctor finder service or map API.\n\nFor demonstration: Please search for "dermatologist near me" in your preferred search engine or healthcare app.');
    // In a real application, this would:
    // - Use geolocation API
    // - Call a healthcare provider API
    // - Display results on a map
}

/**
 * Show loading state
 */
function showLoading() {
    uploadSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.innerHTML = `<p>${message}</p>`;
    uploadSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
    errorSection.classList.remove('hidden');
}

/**
 * Reset analysis for new image
 */
function resetAnalysis() {
    selectedFile = null;
    imageInput.value = '';
    imagePreview.innerHTML = '';
    imagePreview.classList.add('hidden');
    analyzeBtn.classList.add('hidden');
    analyzeBtn.disabled = true;
    
    uploadSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
}

// Save scan results to localStorage for dashboard
function saveScanToHistory(prediction) {
    try {
        const scans = JSON.parse(localStorage.getItem('skinSaviourScans') || '[]');
        const stats = JSON.parse(localStorage.getItem('skinSaviourStats') || '{}');
        
        // Add new scan
        scans.push({
            date: new Date().toISOString(),
            cancerPercentage: prediction.cancer_percentage,
            riskLevel: prediction.risk_level,
            isCancerous: prediction.is_cancerous
        });
        
        // Update statistics
        stats.totalScans = (stats.totalScans || 0) + 1;
        if (prediction.risk_level === 'High') {
            stats.highRisk = (stats.highRisk || 0) + 1;
        } else if (prediction.risk_level === 'Moderate') {
            stats.moderateRisk = (stats.moderateRisk || 0) + 1;
        } else {
            stats.lowRisk = (stats.lowRisk || 0) + 1;
        }
        
        localStorage.setItem('skinSaviourScans', JSON.stringify(scans));
        localStorage.setItem('skinSaviourStats', JSON.stringify(stats));
    } catch (error) {
        console.error('Error saving scan history:', error);
    }
}

