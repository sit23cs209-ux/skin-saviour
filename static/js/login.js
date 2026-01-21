/**
 * Login Page JavaScript for Skin Saviour
 */

const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const errorMessage = document.getElementById('error-message');
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

// Toggle password visibility
if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
}

// Handle form submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Hide previous errors
        errorMessage.classList.add('hidden');
        
        // Validate inputs
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Send login request
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    remember_me: rememberMe
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Login successful - redirect to dashboard
                window.location.href = data.redirect || '/dashboard';
            } else {
                // Login failed
                showError(data.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Network error. Please try again.');
        } finally {
            setLoadingState(false);
        }
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function setLoadingState(loading) {
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    
    if (loading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        loginBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        loginBtn.disabled = false;
    }
}

