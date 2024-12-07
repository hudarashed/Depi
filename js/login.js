// handle show message
function showMessage(message, isSuccess) {
    const messageContainer = document.createElement('div');
    messageContainer.textContent = message;
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '20px';
    messageContainer.style.right = '20px';
    messageContainer.style.padding = '10px 20px';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.zIndex = '1000';
    messageContainer.style.color = '#fff';
    messageContainer.style.backgroundColor = isSuccess ? 'var(--main-color)' : 'red';
    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}

// check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const logoLink = document.getElementById('logoLink');
    logoLink.addEventListener('click', function(event) {
        const token = localStorage.getItem('token');
        if (token) {
            console.log(token);
            window.location.href = "home.html";
        } else {
            event.preventDefault();
            showMessage("You need to log in before accessing the home page." , false);
        }
    });
});

// sign in
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    let form = event.target;
    let valid = form.checkValidity(); 
    form.classList.add('was-validated'); 
    if (valid) {
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };
        console.log('Form Data:', formData);

        fetch('https://ecommerce.routemisr.com/api/v1/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            console.log('Token:', data.token);
            localStorage.setItem('token', data.token);
            console.log('Token:', localStorage.getItem('token'));
            window.location.href = "home.html";
        })
        .catch((error) => {
            console.error('Error:', error);
            showMessage("Invalid email or password" , false);
        });
    }
   
    

});


