document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    let form = event.target;
    let valid = form.checkValidity(); 

    form.classList.add('was-validated'); 

    if (valid) {
        const shippingAddress = {
            street: document.getElementById('streetInput').value,
            city: document.getElementById('cityInput').value,
            postalCode: document.getElementById('postalCodeInput').value
        };
        console.log('shippingAddress:', shippingAddress);

        fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
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
            window.location.href = "login.html"; 
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error);
        });
    }
});