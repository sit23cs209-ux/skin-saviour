/**
 * Consultation Page JavaScript
 */

// Set minimum date to today
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    loadAppointments();
    
    // Option card clicks
    document.getElementById('book-consultation').addEventListener('click', () => {
        document.getElementById('booking-section').classList.remove('hidden');
    });
    
    document.getElementById('video-consultation').addEventListener('click', () => {
        alert('Video consultation feature coming soon!\n\nThis would integrate with video calling services like Zoom or Google Meet.');
    });
    
    document.getElementById('chat-consultation').addEventListener('click', () => {
        alert('Chat consultation feature coming soon!\n\nThis would provide real-time chat with dermatologists.');
    });
    
    // Booking form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBooking);
    }
});

function handleBooking(e) {
    e.preventDefault();
    
    const formData = {
        doctor: document.getElementById('doctor-name').value,
        type: document.getElementById('consultation-type').value,
        date: document.getElementById('appointment-date').value,
        time: document.getElementById('appointment-time').value,
        reason: document.getElementById('reason').value,
        phone: document.getElementById('phone').value
    };
    
    // Save to localStorage
    const appointments = JSON.parse(localStorage.getItem('skinSaviourAppointments') || '[]');
    appointments.push({
        id: Date.now(),
        ...formData,
        status: 'upcoming',
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('skinSaviourAppointments', JSON.stringify(appointments));
    
    alert('Appointment booked successfully!');
    bookingForm.reset();
    document.getElementById('booking-section').classList.add('hidden');
    loadAppointments();
}

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('skinSaviourAppointments') || '[]');
    const list = document.getElementById('appointments-list');
    
    if (appointments.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <p>No upcoming appointments</p>
                <p class="empty-subtitle">Book your first consultation above</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = appointments.map(apt => {
        const date = new Date(apt.date);
        return `
            <div class="appointment-item">
                <div class="appointment-info">
                    <h4>${getDoctorName(apt.doctor)}</h4>
                    <p>📅 ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p>🕐 ${apt.time}</p>
                    <p>📞 ${apt.phone}</p>
                    <p>${apt.type === 'in-person' ? '🏥' : apt.type === 'video' ? '📹' : '💬'} ${apt.type}</p>
                </div>
                <span class="appointment-status status-${apt.status}">${apt.status}</span>
            </div>
        `;
    }).join('');
}

function getDoctorName(value) {
    const doctors = {
        'dr-smith': 'Dr. Sarah Smith - Dermatologist',
        'dr-johnson': 'Dr. Michael Johnson - Skin Specialist',
        'dr-williams': 'Dr. Emily Williams - Dermatology Expert',
        'dr-brown': 'Dr. David Brown - Skin Cancer Specialist'
    };
    return doctors[value] || value;
}






