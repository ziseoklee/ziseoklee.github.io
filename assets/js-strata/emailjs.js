// Initialize EmailJS
(function() {
    emailjs.init("bulQNOqh9_sP89bK1");
})();

function sendEmail(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Basic validation: Check if name, email, and message are provided
    if (!name || !email || !message) {
    alert('Please fill out all required fields (Name, Email, and Message).');
    return;
    }

    // Send email using EmailJS
    emailjs.send('service_pxb8clr', 'template_f96h3dd', {
    from_name: name,
    from_email: email,
    // from_tel: tel, // Optional
    message: message
    }).then(function(response) {
    console.log('SUCCESS!', response.status, response.text);
    alert('Email sent successfully!');
    window.location.reload();
    }, function(error) {
    console.log('FAILED...', error);
    alert('Failed to send email.');
    });
}