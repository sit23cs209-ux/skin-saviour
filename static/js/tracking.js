/**
 * Tracking Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Modal buttons
    document.getElementById('add-consultation-btn').addEventListener('click', () => {
        document.getElementById('consultation-modal').classList.remove('hidden');
    });
    
    document.getElementById('add-medication-btn').addEventListener('click', () => {
        document.getElementById('medication-modal').classList.remove('hidden');
    });
    
    // Close modals
    document.getElementById('close-consultation-modal').addEventListener('click', () => {
        document.getElementById('consultation-modal').classList.add('hidden');
    });
    
    document.getElementById('close-medication-modal').addEventListener('click', () => {
        document.getElementById('medication-modal').classList.add('hidden');
    });
    
    // Form submissions
    document.getElementById('consultation-form').addEventListener('submit', handleConsultationSubmit);
    document.getElementById('medication-form').addEventListener('submit', handleMedicationSubmit);
    
    // Load data
    loadConsultations();
    loadMedications();
    loadReminders();
});

function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tab}-tab`) {
            content.classList.add('active');
        }
    });
}

function handleConsultationSubmit(e) {
    e.preventDefault();
    
    const consultation = {
        id: Date.now(),
        doctor: document.getElementById('consult-doctor').value,
        date: document.getElementById('consult-date').value,
        notes: document.getElementById('consult-notes').value,
        createdAt: new Date().toISOString()
    };
    
    const consultations = JSON.parse(localStorage.getItem('skinSaviourConsultations') || '[]');
    consultations.push(consultation);
    localStorage.setItem('skinSaviourConsultations', JSON.stringify(consultations));
    
    document.getElementById('consultation-form').reset();
    document.getElementById('consultation-modal').classList.add('hidden');
    loadConsultations();
    alert('Consultation added successfully!');
}

function handleMedicationSubmit(e) {
    e.preventDefault();
    
    const medication = {
        id: Date.now(),
        name: document.getElementById('med-name').value,
        dosage: document.getElementById('med-dosage').value,
        frequency: document.getElementById('med-frequency').value,
        startDate: document.getElementById('med-start').value,
        endDate: document.getElementById('med-end').value,
        notes: document.getElementById('med-notes').value,
        createdAt: new Date().toISOString()
    };
    
    const medications = JSON.parse(localStorage.getItem('skinSaviourMedications') || '[]');
    medications.push(medication);
    localStorage.setItem('skinSaviourMedications', JSON.stringify(medications));
    
    document.getElementById('medication-form').reset();
    document.getElementById('medication-modal').classList.add('hidden');
    loadMedications();
    loadReminders();
    alert('Medication added successfully!');
}

function loadConsultations() {
    const consultations = JSON.parse(localStorage.getItem('skinSaviourConsultations') || '[]');
    const list = document.getElementById('consultations-list');
    
    if (consultations.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No consultations tracked yet</p>
                <button class="action-btn" onclick="document.getElementById('add-consultation-btn').click()">Add First Consultation</button>
            </div>
        `;
        return;
    }
    
    list.innerHTML = consultations.map(consult => {
        const date = new Date(consult.date);
        return `
            <div class="tracking-item">
                <div class="item-info">
                    <h4>${consult.doctor}</h4>
                    <p>📅 ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    ${consult.notes ? `<p>📝 ${consult.notes}</p>` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editConsultation(${consult.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteConsultation(${consult.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function loadMedications() {
    const medications = JSON.parse(localStorage.getItem('skinSaviourMedications') || '[]');
    const list = document.getElementById('medications-list');
    
    if (medications.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💊</div>
                <p>No medications tracked yet</p>
                <button class="action-btn" onclick="document.getElementById('add-medication-btn').click()">Add First Medication</button>
            </div>
        `;
        return;
    }
    
    list.innerHTML = medications.map(med => {
        const startDate = new Date(med.startDate);
        const endDate = med.endDate ? new Date(med.endDate) : null;
        const frequencyLabels = {
            'once-daily': 'Once Daily',
            'twice-daily': 'Twice Daily',
            'thrice-daily': 'Three Times Daily',
            'as-needed': 'As Needed'
        };
        
        return `
            <div class="tracking-item medication-item">
                <div class="item-info">
                    <h4>${med.name} - ${med.dosage}</h4>
                    <div class="medication-schedule">
                        <span class="schedule-badge">${frequencyLabels[med.frequency] || med.frequency}</span>
                        <span class="schedule-badge">Start: ${startDate.toLocaleDateString()}</span>
                        ${endDate ? `<span class="schedule-badge">End: ${endDate.toLocaleDateString()}</span>` : ''}
                    </div>
                    ${med.notes ? `<p style="margin-top: 10px;">📝 ${med.notes}</p>` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editMedication(${med.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteMedication(${med.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function loadReminders() {
    const medications = JSON.parse(localStorage.getItem('skinSaviourMedications') || '[]');
    const list = document.getElementById('reminders-list');
    
    const activeMedications = medications.filter(med => {
        const endDate = med.endDate ? new Date(med.endDate) : null;
        const today = new Date();
        return !endDate || endDate >= today;
    });
    
    if (activeMedications.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⏰</div>
                <p>No reminders set</p>
                <p class="empty-subtitle">Set reminders for medications and appointments</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = activeMedications.map(med => {
        const frequencyLabels = {
            'once-daily': 'Once Daily',
            'twice-daily': 'Twice Daily (Morning & Evening)',
            'thrice-daily': 'Three Times Daily (Morning, Noon, Evening)',
            'as-needed': 'As Needed'
        };
        
        return `
            <div class="tracking-item">
                <div class="item-info">
                    <h4>💊 ${med.name}</h4>
                    <p>⏰ Reminder: ${frequencyLabels[med.frequency] || med.frequency}</p>
                    <p>📅 Started: ${new Date(med.startDate).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    }).join('');
}

function deleteConsultation(id) {
    if (confirm('Are you sure you want to delete this consultation?')) {
        const consultations = JSON.parse(localStorage.getItem('skinSaviourConsultations') || '[]');
        const filtered = consultations.filter(c => c.id !== id);
        localStorage.setItem('skinSaviourConsultations', JSON.stringify(filtered));
        loadConsultations();
    }
}

function deleteMedication(id) {
    if (confirm('Are you sure you want to delete this medication?')) {
        const medications = JSON.parse(localStorage.getItem('skinSaviourMedications') || '[]');
        const filtered = medications.filter(m => m.id !== id);
        localStorage.setItem('skinSaviourMedications', JSON.stringify(filtered));
        loadMedications();
        loadReminders();
    }
}

function editConsultation(id) {
    alert('Edit functionality coming soon!');
}

function editMedication(id) {
    alert('Edit functionality coming soon!');
}






