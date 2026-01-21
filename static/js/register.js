/**
 * Registration Page JavaScript for Skin Saviour
 */

const registerForm = document.getElementById('register-form');
const registerBtn = document.getElementById('register-btn');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// Toggle password visibility
const toggleRegPassword = document.getElementById('toggle-reg-password');
const toggleRegConfirmPassword = document.getElementById('toggle-reg-confirm-password');
const regPasswordInput = document.getElementById('reg-password');
const regConfirmPasswordInput = document.getElementById('reg-confirm-password');

if (toggleRegPassword) {
    toggleRegPassword.addEventListener('click', () => {
        const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        regPasswordInput.setAttribute('type', type);
        toggleRegPassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
}

if (toggleRegConfirmPassword) {
    toggleRegConfirmPassword.addEventListener('click', () => {
        const type = regConfirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        regConfirmPasswordInput.setAttribute('type', type);
        toggleRegConfirmPassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
}

// Handle form submission
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        // Hide previous messages
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
        
        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }
        
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Send registration request
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Registration successful
                showSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                // Registration failed
                showError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showError('Network error. Please try again.');
        } finally {
            setLoadingState(false);
        }
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function setLoadingState(loading) {
    const btnText = registerBtn.querySelector('.btn-text');
    const btnLoader = registerBtn.querySelector('.btn-loader');
    
    if (loading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        registerBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        registerBtn.disabled = false;
    }
}

