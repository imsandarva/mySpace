document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  emailjs.sendForm('service_j8n2zpl', 'template_2oqpb09', this)
    .then(function() {
      document.querySelector('.sent-message').textContent = 'Message successfully sent!';
      document.querySelector('.sent-message').style.display = 'block';
      document.getElementById('contactForm').reset();
    }, function(error) {
      document.querySelector('.error-message').textContent = 'Failed to send the message, please try again.';
      document.querySelector('.error-message').style.display = 'block';
      console.log('FAILED...', error);
    });
});
