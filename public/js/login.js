const loginFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  console.log('Attempting login with:', { username, password });

  if (username && password) {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const responseData = await response.json();
      console.log('Server response:', response.status, responseData);

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to log in: ' + (responseData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);