/**
 * Nearby Doctors Page JavaScript
 */

// Sample doctors data
const doctorsData = [
    {
        id: 1,
        name: 'Dr. Sarah Smith',
        specialty: 'Dermatologist',
        rating: 4.8,
        distance: '2.5 km',
        address: '123 Medical Center, Main St',
        phone: '+1 (555) 123-4567',
        availability: 'Available Today'
    },
    {
        id: 2,
        name: 'Dr. Michael Johnson',
        specialty: 'Skin Cancer Specialist',
        rating: 4.9,
        distance: '5.1 km',
        address: '456 Health Plaza, Oak Ave',
        phone: '+1 (555) 234-5678',
        availability: 'Available Tomorrow'
    },
    {
        id: 3,
        name: 'Dr. Emily Williams',
        specialty: 'Dermatology Expert',
        rating: 4.7,
        distance: '8.3 km',
        address: '789 Wellness Center, Park Blvd',
        phone: '+1 (555) 345-6789',
        availability: 'Available This Week'
    },
    {
        id: 4,
        name: 'Dr. David Brown',
        specialty: 'Skin Cancer Specialist',
        rating: 4.9,
        distance: '12.5 km',
        address: '321 Clinic Drive, Medical Park',
        phone: '+1 (555) 456-7890',
        availability: 'Available Next Week'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    loadDoctors(doctorsData);
    
    // Get location button
    const getLocationBtn = document.getElementById('get-location-btn');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getCurrentLocation);
    }
    
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // Filter functionality
    const specialtyFilter = document.getElementById('specialty-filter');
    const distanceFilter = document.getElementById('distance-filter');
    
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', handleSearch);
    }
    
    if (distanceFilter) {
        distanceFilter.addEventListener('change', handleSearch);
    }
});

function loadDoctors(doctors) {
    const list = document.getElementById('doctors-list');
    
    if (doctors.length === 0) {
        list.innerHTML = '<p>No doctors found. Try adjusting your search criteria.</p>';
        return;
    }
    
    list.innerHTML = doctors.map(doctor => `
        <div class="doctor-card">
            <div class="doctor-header">
                <div class="doctor-info">
                    <h4>${doctor.name}</h4>
                    <div class="doctor-specialty">${doctor.specialty}</div>
                    <div class="doctor-rating">
                        ⭐ ${doctor.rating} (${Math.floor(Math.random() * 50 + 20)} reviews)
                    </div>
                </div>
            </div>
            <div class="doctor-details">
                <div class="detail-item">
                    <span>📍</span>
                    <span>${doctor.distance} away</span>
                </div>
                <div class="detail-item">
                    <span>🏥</span>
                    <span>${doctor.address}</span>
                </div>
                <div class="detail-item">
                    <span>📞</span>
                    <span>${doctor.phone}</span>
                </div>
                <div class="detail-item">
                    <span>✅</span>
                    <span>${doctor.availability}</span>
                </div>
            </div>
            <div class="doctor-actions">
                <button class="btn-book" onclick="bookDoctor(${doctor.id})">Book Appointment</button>
                <button class="btn-call" onclick="callDoctor('${doctor.phone}')">Call</button>
            </div>
        </div>
    `).join('');
}

function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const specialty = document.getElementById('specialty-filter').value;
    const maxDistance = parseInt(document.getElementById('distance-filter').value);
    
    let filtered = doctorsData.filter(doctor => {
        const matchesSearch = !searchTerm || 
            doctor.name.toLowerCase().includes(searchTerm) ||
            doctor.specialty.toLowerCase().includes(searchTerm) ||
            doctor.address.toLowerCase().includes(searchTerm);
        
        const matchesSpecialty = !specialty || 
            doctor.specialty.toLowerCase().includes(specialty);
        
        const distance = parseFloat(doctor.distance);
        const matchesDistance = distance <= maxDistance;
        
        return matchesSearch && matchesSpecialty && matchesDistance;
    });
    
    loadDoctors(filtered);
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                alert(`Location found!\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}\n\nThis would be used to find nearby doctors.`);
                // In a real app, this would filter doctors by distance
            },
            (error) => {
                alert('Unable to get your location. Please enter your location manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function bookDoctor(doctorId) {
    const doctor = doctorsData.find(d => d.id === doctorId);
    if (doctor) {
        window.location.href = `/consultation?doctor=${encodeURIComponent(doctor.name)}`;
    }
}

function callDoctor(phone) {
    window.location.href = `tel:${phone}`;
}

function openGoogleMaps() {
    // Open Google Maps with dermatologist search
    const url = 'https://www.google.com/maps/search/dermatologist+near+me';
    window.open(url, '_blank');
}






