document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded - inicializando vista previa del formulario");
  
  // Initialize preview container
  const previewContainer = document.getElementById('form-preview-container');
  if (!previewContainer) {
    console.error("❌ Error: No se encontró el contenedor #form-preview-container");
    return;
  } else {
    console.log("✅ Contenedor de vista previa encontrado");
  }
  
  // Form elements we need to watch for changes
  const formName = document.getElementById('formName');
  const contactMethods = document.querySelectorAll('input[name="contact_methods"]');
  const emailFieldRequired = document.getElementById('emailFieldRequired');
  const emailPlaceholder = document.getElementById('emailPlaceholder');
  const phoneFieldRequired = document.getElementById('phoneFieldRequired');
  const phonePlaceholder = document.getElementById('phonePlaceholder');
  const contactPreferences = document.querySelectorAll('input[name="contact_preference"]');
  const frequencies = document.querySelectorAll('input[name="frequency"]');
  
  // Log encontrados/no encontrados para diagnóstico
  console.log(`✅ formName encontrado: ${!!formName}`);
  console.log(`✅ contactMethods encontrados: ${contactMethods.length}`);
  console.log(`✅ emailFieldRequired encontrado: ${!!emailFieldRequired}`);
  console.log(`✅ emailPlaceholder encontrado: ${!!emailPlaceholder}`);
  console.log(`✅ phoneFieldRequired encontrado: ${!!phoneFieldRequired}`);
  console.log(`✅ phonePlaceholder encontrado: ${!!phonePlaceholder}`);
  console.log(`✅ contactPreferences encontrados: ${contactPreferences.length}`);
  console.log(`✅ frequencies encontrados: ${frequencies.length}`);
  
  // Add event listeners to form elements
  if (formName) {
    formName.addEventListener('input', updateFormPreview);
    console.log("Evento input asignado a formName");
  }
  
  contactMethods.forEach((method, index) => {
    method.addEventListener('change', updateFormPreview);
    console.log(`Evento change asignado a contactMethod ${index+1}`);
  });
  
  if (emailFieldRequired) {
    emailFieldRequired.addEventListener('change', updateFormPreview);
    console.log("Evento change asignado a emailFieldRequired");
  }
  
  if (emailPlaceholder) {
    emailPlaceholder.addEventListener('input', updateFormPreview);
    console.log("Evento input asignado a emailPlaceholder");
  }
  
  if (phoneFieldRequired) {
    phoneFieldRequired.addEventListener('change', updateFormPreview);
    console.log("Evento change asignado a phoneFieldRequired");
  }
  
  if (phonePlaceholder) {
    phonePlaceholder.addEventListener('input', updateFormPreview);
    console.log("Evento input asignado a phonePlaceholder");
  }
  
  contactPreferences.forEach((pref, index) => {
    pref.addEventListener('change', updateFormPreview);
    console.log(`Evento change asignado a contactPreference ${index+1}`);
  });
  
  frequencies.forEach((freq, index) => {
    freq.addEventListener('change', updateFormPreview);
    console.log(`Evento change asignado a frequency ${index+1}`);
  });
  
  // Corregimos la selección de botones Next/Previous para incluir los que usan href y los que usan data-bs-target
  const nextPrevButtons = document.querySelectorAll('button[data-bs-toggle="pill"], a[data-bs-toggle="pill"]');
  console.log(`✅ Botones next/prev encontrados: ${nextPrevButtons.length}`);
  
  nextPrevButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      // Esperar a que Bootstrap haga la transición antes de actualizar
      setTimeout(updateFormPreview, 100);
    });
    console.log(`Evento click asignado a botón ${index+1}`);
  });
  
  // También observamos las pestañas de Bootstrap para detectar cuándo se muestran
  // Esto ayuda con los navegadores que podrían tener problemas con el evento 'shown.bs.tab'
  const tabs = document.querySelectorAll('.tab-pane');
  if (tabs.length > 0) {
    console.log(`✅ Pestañas encontradas: ${tabs.length}`);
    
    // Crear un nuevo MutationObserver
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class' && 
            mutation.target.classList.contains('active')) {
          console.log('Tab activado, actualizando vista previa...');
          updateFormPreview();
        }
      });
    });
    
    // Configuración del observer
    const config = { attributes: true, childList: false, subtree: false };
    
    // Comenzar a observar cada pestaña
    tabs.forEach(tab => {
      observer.observe(tab, config);
    });
  }
  
  // Initial render of the preview
  console.log("Renderizando vista previa inicial...");
  updateFormPreview();
  
  // Agregamos un event listener para el formulario principal
  const mainForm = document.querySelector('form[action*="create_formulario"]');
  if (mainForm) {
    console.log("✅ Formulario principal encontrado");
    mainForm.addEventListener('submit', function(e) {
      // Desactivar temporalmente los campos de la vista previa antes de enviar
      const previewFields = document.querySelectorAll('#form-preview-container input, #form-preview-container select, #form-preview-container textarea');
      previewFields.forEach(field => {
        field.disabled = true;
      });
      
      // El formulario se enviará normalmente
      console.log("Formulario principal enviado, campos de vista previa desactivados temporalmente");
    });
  }
  
  function updateFormPreview() {
    console.log("Actualizando vista previa del formulario");
    
    // Start building the form HTML - mantenemos la estructura original
    let previewHTML = `<div class="preview-form-container">`;
    
    // Add form title
    const formNameValue = formName ? formName.value : 'Your Form';
    previewHTML += `<h4 class="preview-form-title">${formNameValue || 'Your Form'}</h4>`;
    
    // Always add name field
    previewHTML += `
      <div class="preview-form-field">
        <label for="preview-name">Your Name</label>
        <input type="text" id="preview-name" class="preview-input" name="preview_name" data-preview-field="true">
      </div>
    `;
    
    // Add email field if either no checkbox is present or it's checked
    if (!emailFieldRequired || emailFieldRequired.checked) {
      const emailPlaceholderValue = emailPlaceholder ? emailPlaceholder.value : 'Your email address';
      previewHTML += `
        <div class="preview-form-field">
          <label for="preview-email">${emailPlaceholderValue}</label>
          <input type="email" id="preview-email" class="preview-input" name="preview_email" data-preview-field="true">
        </div>
      `;
    }
    
    // Add phone field if either no checkbox is present or it's checked
    if (!phoneFieldRequired || phoneFieldRequired.checked) {
      const phonePlaceholderValue = phonePlaceholder ? phonePlaceholder.value : 'Your phone number';
      previewHTML += `
        <div class="preview-form-field">
          <label for="preview-phone">${phonePlaceholderValue}</label>
          <input type="tel" id="preview-phone" class="preview-input" name="preview_phone" data-preview-field="true">
        </div>
      `;
    }
    
    // Add contact methods if any are selected
    const selectedContactMethods = Array.from(contactMethods)
      .filter(method => method.checked)
      .map(method => method.value);
    
    if (selectedContactMethods.length > 0) {
      previewHTML += `
        <div class="preview-form-field">
          <label>Preferred Contact Method</label>
          <div class="preview-options">
      `;
      
      const methodLabels = {
        'email': 'Email',
        'sms': 'SMS',
        'telegram': 'Telegram',
        'whatsapp': 'WhatsApp'
      };
      
      selectedContactMethods.forEach(method => {
        previewHTML += `
          <div class="preview-option">
            <input type="radio" id="preview-method-${method}" name="preview_contact_method" value="${method}" data-preview-field="true">
            <label for="preview-method-${method}">${methodLabels[method] || method}</label>
          </div>
        `;
      });
      
      previewHTML += `</div></div>`;
    }
    
    // Add contact preferences if any are selected
    const selectedPreferences = Array.from(contactPreferences)
      .filter(pref => pref.checked)
      .map(pref => ({value: pref.value, label: pref.nextElementSibling ? pref.nextElementSibling.textContent : pref.value}));
    
    if (selectedPreferences.length > 0) {
      previewHTML += `
        <div class="preview-form-field">
          <label>Contact me when:</label>
          <div class="preview-options">
      `;
      
      selectedPreferences.forEach(pref => {
        previewHTML += `
          <div class="preview-option">
            <input type="checkbox" id="preview-pref-${pref.value}" name="preview_preference" value="${pref.value}" data-preview-field="true">
            <label for="preview-pref-${pref.value}">${pref.label}</label>
          </div>
        `;
      });
      
      previewHTML += `</div></div>`;
    }
    
    // Add frequencies if any are selected
    const selectedFrequencies = Array.from(frequencies)
      .filter(freq => freq.checked)
      .map(freq => ({value: freq.value, label: freq.nextElementSibling ? freq.nextElementSibling.textContent : freq.value}));
    
    if (selectedFrequencies.length > 0) {
      previewHTML += `
        <div class="preview-form-field">
          <label>Contact frequency:</label>
          <div class="preview-options">
      `;
      
      selectedFrequencies.forEach(freq => {
        previewHTML += `
          <div class="preview-option">
            <input type="radio" id="preview-freq-${freq.value}" name="preview_frequency" value="${freq.value}" ${freq.value === 'once' ? 'checked' : ''} data-preview-field="true">
            <label for="preview-freq-${freq.value}">${freq.label}</label>
          </div>
        `;
      });
      
      previewHTML += `</div></div>`;
    }
    
    // Add submit button
    previewHTML += `
      <div class="preview-form-field">
        <button type="button" class="preview-submit-btn" data-preview-field="true">Subscribe</button>
      </div>
    `;
    
    // Cerrar el div contenedor
    previewHTML += `</div>`;
    
    // Update the preview container
    previewContainer.innerHTML = previewHTML;
    console.log("Vista previa actualizada exitosamente");
  }
  
  // También modificar el comportamiento del botón "Finish"
  const finishButton = document.querySelector('button[type="submit"].btn-success');
  if (finishButton) {
    console.log("✅ Botón Finish encontrado");
    finishButton.addEventListener('click', function(e) {
      // Desactivar temporalmente todos los campos de la vista previa al hacer clic en Finish
      const previewFields = document.querySelectorAll('[data-preview-field="true"]');
      previewFields.forEach(field => {
        field.disabled = true;
      });
      console.log("Campos de vista previa desactivados temporalmente para el envío");
    });
  }
});