let state = 'initial';

function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const message = inputElement.value.trim();
    inputElement.value = '';

    if (message === '') return;

    addMessage('User', message);

   if (state === 'initial' && message.toLowerCase() === 'hello i want to login') {
        addMessage('ChatBot', 'Enter your email:');
        state = 'awaiting_email';
    } else if (state === 'awaiting_email') {
        sessionStorage.setItem('email', message);
        addMessage('ChatBot', 'Enter your password:');
        state = 'awaiting_password';
    } else if (state === 'awaiting_password') {
        sessionStorage.setItem('password', message);
        saveCredentials(sessionStorage.getItem('email'), sessionStorage.getItem('password'));
        addMessage('ChatBot', 'Hurray! Your login was successful');
        state = 'initial';
    }
}

function addMessage(sender, message) {
    const display = document.getElementById('chat-display');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    display.appendChild(messageElement);
    display.scrollTop = display.scrollHeight;
}

async function saveCredentials(email, password) {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    console.log(result);
}

// Attach sendMessage function to button click event
document.querySelector('button').addEventListener('click', sendMessage);

// Allow pressing Enter to send a message
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
