document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed.");
  const widgetDiv = document.getElementById("plingme-form-widget");
  if (!widgetDiv) {
    console.error("No se encontró el contenedor #plingme-form-widget.");
    return;
  }
  
  const formId = widgetDiv.getAttribute("data-form-id");
  console.log("Form ID obtenido:", formId);
  if (!formId) {
    console.error("No se encontró el ID del formulario en data-form-id.");
    return;
  }
  
  // URL para obtener la configuración del formulario - usando el endpoint correcto
  const configUrl = `http://127.0.0.1:8000/api/forms/${formId}/`;
  console.log("URL de configuración:", configUrl);
  
  // Obtener la configuración
  fetch(configUrl)
    .then(response => {
      console.log("Respuesta recibida para la configuración:", response);
      if (!response.ok) {
        throw new Error("Error al obtener configuración, status: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("Datos de configuración recibidos:", data);
      renderForm(data);
    })
    .catch(error => console.error("Error al obtener la configuración:", error));
  
  function renderForm(data) {
    console.log("Iniciando renderForm con data:", data);
    const config = data.configuration;
    let formHTML = `<form id="plingme-embed-form" class="plingme-form">`;

    // 1. Agregamos el campo NAME - siempre necesario
    formHTML += `
      <div class="form-field">
        <label for="embed-name">Your Name</label>
        <input 
          type="text" 
          id="embed-name" 
          name="name"
          required
        />
      </div>
    `;
    console.log("Campo de name agregado.");

    // 2. Campo EMAIL - solo si está en la configuración
    if (config.contact_info && config.contact_info.email) {
      formHTML += `
        <div class="form-field">
          <label for="embed-email">${config.contact_info.email.placeholder || "Your Email"}</label>
          <input 
            type="email" 
            id="embed-email" 
            name="email" 
            ${config.contact_info.email.required ? "required" : ""}
          />
        </div>`;
      console.log("Campo de email agregado.");
    } else {
      console.warn("No se encontró configuración para email.");
    }
    
    // 3. Campo PHONE - solo si está en la configuración
    if (config.contact_info && config.contact_info.phone) {
      formHTML += `
        <div class="form-field">
          <label for="embed-phone">${config.contact_info.phone.placeholder || "Your Phone Number"}</label>
          <input 
            type="tel" 
            id="embed-phone" 
            name="phone" 
            ${config.contact_info.phone.required ? "required" : ""}
          />
        </div>`;
      console.log("Campo de teléfono agregado.");
    } else {
      console.warn("No se encontró configuración para teléfono.");
    }
    
    // 4. Métodos de contacto seleccionados - como opciones
    if (config.contact_methods && config.contact_methods.length > 0) {
      formHTML += `
        <div class="form-field contact-methods">
          <label>Preferred Contact Method</label>
          <div class="option-group">`;
      
      config.contact_methods.forEach(method => {
        const methodLabels = {
          'email': 'Email',
          'sms': 'SMS',
          'telegram': 'Telegram',
          'whatsapp': 'WhatsApp'
        };
        
        formHTML += `
          <div class="option-item">
            <input type="radio" id="method-${method}" name="contact_method" value="${method}">
            <label for="method-${method}">${methodLabels[method] || method}</label>
          </div>`;
      });
      
      formHTML += `
          </div>
        </div>`;
      console.log("Métodos de contacto agregados.");
    }

    // 5. Preferencias de contacto - como checkboxes
    if (config.contact_preference && config.contact_preference.length > 0) {
      formHTML += `
        <div class="form-field contact-preferences">
          <label>Contact me when:</label>
          <div class="option-group">`;
      
      const preferenceLabels = {
        'promos': 'Promotions and discounts available',
        'new_products': 'New products launched'
      };
      
      config.contact_preference.forEach(pref => {
        formHTML += `
          <div class="option-item">
            <input type="checkbox" id="pref-${pref}" name="contact_preference" value="${pref}">
            <label for="pref-${pref}">${preferenceLabels[pref] || pref}</label>
          </div>`;
      });
      
      formHTML += `
          </div>
        </div>`;
      console.log("Preferencias de contacto agregadas.");
    }
    
    // 6. Frecuencia de contacto - como radio buttons
    if (config.frequency && config.frequency.length > 0) {
      formHTML += `
        <div class="form-field contact-frequency">
          <label>Contact frequency:</label>
          <div class="option-group">`;
      
      const frequencyLabels = {
        'once': 'Only once',
        'weekly': 'Weekly',
        'monthly': 'Monthly'
      };
      
      config.frequency.forEach(freq => {
        formHTML += `
          <div class="option-item">
            <input type="radio" id="freq-${freq}" name="frequency" value="${freq}" ${freq === 'once' ? 'checked' : ''}>
            <label for="freq-${freq}">${frequencyLabels[freq] || freq}</label>
          </div>`;
      });
      
      formHTML += `
          </div>
        </div>`;
      console.log("Opciones de frecuencia agregadas.");
    }
    
    // 7. Botón de Enviar
    formHTML += `
      <div class="form-field">
        <button type="submit" class="submit-btn">Subscribe</button>
      </div>
    </form>`;
    
    widgetDiv.innerHTML = formHTML;
    console.log("Formulario renderizado en el contenedor.");
    
    const formElement = document.getElementById("plingme-embed-form");
    if (!formElement) {
      console.error("No se encontró el formulario renderizado.");
      return;
    }
    formElement.addEventListener("submit", handleSubmit);
    console.log("Evento submit asignado al formulario.");
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    console.log("Evento submit capturado.");
    
    const formElement = e.target;
    const formData = new FormData(formElement);
    
    // Procesar multiple checkboxes, que comparten el mismo name
    const contactPreferences = [];
    formElement.querySelectorAll('input[name="contact_preference"]:checked').forEach(checkbox => {
      contactPreferences.push(checkbox.value);
    });
    
    // Crear objeto con todos los datos
    const payload = {
      ...Object.fromEntries(formData.entries()),
      contact_preference: contactPreferences
    };
    
    console.log("Payload generado a partir del formulario:", payload);
    
    // URL para crear un Plinger (endpoint de la API)
    const apiUrl = "http://127.0.0.1:8000/api/plingers/";
    console.log("URL para crear Plinger:", apiUrl);
    
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      console.log("Respuesta recibida al enviar datos:", response);
      if (!response.ok) {
        throw new Error("Error en el envío del formulario, status: " + response.status);
      }
      return response.json();
    })
    .then(result => {
      console.log("Plinger creado exitosamente:", result);
      widgetDiv.innerHTML = `
        <div class="success-message">
          <h3>Thank you for subscribing!</h3>
          <p>We'll be in touch soon.</p>
        </div>`;
    })
    .catch(error => {
      console.error("Error al enviar el formulario:", error);
      widgetDiv.innerHTML = `
        <div class="error-message">
          <h3>Error</h3>
          <p>There was an error submitting the form. Please try again later.</p>
          <button onclick="location.reload()">Try Again</button>
        </div>`;
    });
  }
});