// ============================================
// FEEDBACK FORM HANDLER
// ============================================

const feedbackForm = document.getElementById('feedbackForm');
const feedbackFormContainer = document.getElementById('feedbackFormContainer');
const thankYouMessage = document.getElementById('thankYouMessage');
const confirmEmail = document.getElementById('confirmEmail');

feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validar que el formulario sea válido
  if (!feedbackForm.checkValidity()) {
    alert('Por favor, completa todos los campos correctamente.');
    return;
  }

  // Obtener datos del formulario
  const providerName = document.getElementById('providerName').value.trim();
  const email = document.getElementById('email').value.trim();
  const proposal = document.getElementById('proposal').value.trim();

  // Deshabilitar botón durante envío
  const submitBtn = document.getElementById('submitBtn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    // Enviar datos al backend
    await sendFeedbackEmail({
      providerName,
      email,
      proposal,
      receiverEmail: 'contacto@tribo.com' // CAMBIAR POR TU EMAIL
    });

    // Mostrar mensaje de éxito
    confirmEmail.textContent = email;
    feedbackFormContainer.style.display = 'none';
    thankYouMessage.style.display = 'flex';

    // Scroll suave hacia el mensaje de agradecimiento
    setTimeout(() => {
      document.getElementById('feedback-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);

  } catch (error) {
    console.error('Error al enviar feedback:', error);
    alert('Hubo un error al enviar tu feedback. Por favor, intenta de nuevo.');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// ============================================
// FUNCIÓN PARA ENVIAR EMAIL
// ============================================

/**
 * OPCIÓN RECOMENDADA: Formspree (más fácil)
 * 
 * Pasos:
 * 1. Ve a https://formspree.io/
 * 2. Crea un nuevo formulario
 * 3. Copia tu FORM_ID (verás algo como: https://formspree.io/f/XXXXXXXXX)
 * 4. Reemplaza "YOUR_FORM_ID" abajo por tu ID
 * 5. Los emails te llegarán directamente al correo registrado en Formspree
 */

async function sendFeedbackEmail(data) {
  const formData = new FormData();
  formData.append('providerName', data.providerName);
  formData.append('email', data.email);
  formData.append('proposal', data.proposal);

  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Error al enviar el feedback');
  }

  return response.json();
}

// ============================================
// ALTERNATIVAS:
// ============================================

/*

--- OPCIÓN 2: EmailJS (sin backend) ---

Pasos:
1. Regístrate en https://www.emailjs.com/
2. Configura Gmail/Outlook como servicio
3. Crea una plantilla de email
4. Reemplaza YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID

Código:

async function sendFeedbackEmail(data) {
  const emailJsPromise = new Promise((resolve, reject) => {
    emailjs.init('YOUR_PUBLIC_KEY');
    
    const templateParams = {
      to_email: data.receiverEmail,
      from_email: data.email,
      provider_name: data.providerName,
      proposal: data.proposal,
      reply_to: data.email
    };

    emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams
    )
      .then(() => resolve())
      .catch((error) => reject(error));
  });

  return emailJsPromise;
}

Además añade esto en el <head> de feedback.html:
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>

--- OPCIÓN 3: Tu propio backend ---

Descomenta esto y crea un endpoint POST en tu backend:

async function sendFeedbackEmail(data) {
  const response = await fetch('/api/send-feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      providerName: data.providerName,
      email: data.email,
      proposal: data.proposal,
      receiverEmail: data.receiverEmail
    })
  });

  if (!response.ok) {
    throw new Error('Error en la respuesta del servidor');
  }

  return response.json();
}

*/