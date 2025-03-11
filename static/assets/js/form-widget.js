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
  
  // URL para obtener la configuración del formulario
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
    let formHTML = `<form id="plingme-embed-form">`;

    // 1. Agregamos el campo NAME
    // Si quieres basarte en config.contact_info.name, puedes verificarlo:
    // if (config.contact_info && config.contact_info.name) { ... } 
    // En este ejemplo, lo forzamos para que siempre aparezca:
    formHTML += `
      <div>
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

    // 2. Campo EMAIL
    if (config.contact_info && config.contact_info.email) {
      formHTML += `
        <div>
          <label for="embed-email">${config.contact_info.email.placeholder}</label>
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
    
    // 3. Campo PHONE
    if (config.contact_info && config.contact_info.phone) {
      formHTML += `
        <div>
          <label for="embed-phone">${config.contact_info.phone.placeholder}</label>
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
    
    // 4. Botón de Enviar
    formHTML += `
      <button type="submit">Subscribe</button>
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
    const payload = Object.fromEntries(formData.entries());
    console.log("Payload generado a partir del formulario:", payload);
    
    // URL para crear un Plinger (endpoint de la API)
    const apiUrl = "http://127.0.0.1:8000/api/plingers/";
    console.log("URL para crear Plinger:", apiUrl);
    
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Si se usa autenticación, agregar la cabecera Authorization aquí.
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
      widgetDiv.innerHTML = "<p>Thank you for subscribing!</p>";
    })
    .catch(error => {
      console.error("Error al enviar el formulario:", error);
      widgetDiv.innerHTML = "<p>There was an error submitting the form.</p>";
    });
  }
});
