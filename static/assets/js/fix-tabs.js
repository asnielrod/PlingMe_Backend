// Este script corrige los problemas de navegación con los botones Next/Previous
document.addEventListener("DOMContentLoaded", function() {
    // Asegurar que los botones de navegación funcionen correctamente
    const nextButtons = document.querySelectorAll('button[data-bs-toggle="pill"]');
    
    nextButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Obtener el target al que debe navegar
        const target = button.getAttribute('data-bs-target');
        if (target) {
          console.log(`Navegando a: ${target}`);
          
          // Activar la pestaña usando Bootstrap API
          const tabElement = document.querySelector(target);
          if (tabElement) {
            // Intentar usar Bootstrap API
            if (typeof bootstrap !== 'undefined') {
              const tab = new bootstrap.Tab(tabElement);
              tab.show();
            } else {
              // Fallback manual
              const allTabs = document.querySelectorAll('.tab-pane');
              allTabs.forEach(tab => {
                tab.classList.remove('show', 'active');
              });
              
              tabElement.classList.add('show', 'active');
              
              // Actualizar los selectores de pestañas también
              const allTabLinks = document.querySelectorAll('[data-bs-toggle="pill"]');
              allTabLinks.forEach(link => {
                link.classList.remove('active');
                link.setAttribute('aria-selected', 'false');
              });
              
              const activeTabLink = document.querySelector(`[data-bs-target="${target}"]`) || 
                                   document.querySelector(`[href="${target}"]`);
              if (activeTabLink) {
                activeTabLink.classList.add('active');
                activeTabLink.setAttribute('aria-selected', 'true');
              }
            }
          }
        }
      });
    });
  });