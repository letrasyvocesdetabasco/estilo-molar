/**
 * ESTILO MOLAR | Odontología Especializada & Gorros Quirúrgicos
 * Villahermosa, Tabasco - JavaScript Interactivo
 */

document.addEventListener('DOMContentLoaded', () => {
  // Teléfono oficial de WhatsApp de Dariana Pamela en Villahermosa
  const CLINIC_WHATSAPP = '529934153041';

  /* ==========================================================================
     1. Menú Móvil (Drawer & Overlay)
     ========================================================================== */
  const menuToggleBtn = document.querySelector('.menu-toggle-btn');
  const mobileDrawer = document.getElementById('mobileNavOverlay');
  const closeDrawerBtn = document.querySelector('.close-drawer-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  function openMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openMobileMenu);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileMenu);
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeMobileMenu();
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ==========================================================================
     2.1 Toggle Catálogo Completo (61 Gorros)
     ========================================================================== */
  const toggleCatalogBtn = document.getElementById('toggleCatalogBtn');
  const productsGorrosGrid = document.querySelector('.products-gorros-grid');

  if (toggleCatalogBtn && productsGorrosGrid) {
    toggleCatalogBtn.addEventListener('click', () => {
      const isExpanded = productsGorrosGrid.classList.toggle('expanded');
      const btnText = toggleCatalogBtn.querySelector('.btn-text');
      const btnIcon = toggleCatalogBtn.querySelector('.btn-icon');
      
      toggleCatalogBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

      if (isExpanded) {
        if (btnText) btnText.textContent = '▲ Mostrar Menos Modelos';
        if (btnIcon) btnIcon.textContent = '▲';
      } else {
        if (btnText) btnText.textContent = '✨ Ver Catálogo Completo (61 Diseños Exclusivos)';
        if (btnIcon) btnIcon.textContent = '▾';
        productsGorrosGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ==========================================================================
     2. Filtro de Gorros Quirúrgicos
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab-pill');
  const gorroCards = document.querySelectorAll('.product-gorro-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Expandir automáticamente el catálogo al filtrar para mostrar todos los resultados
      if (productsGorrosGrid && !productsGorrosGrid.classList.contains('expanded')) {
        productsGorrosGrid.classList.add('expanded');
        if (toggleCatalogBtn) {
          toggleCatalogBtn.setAttribute('aria-expanded', 'true');
          const btnText = toggleCatalogBtn.querySelector('.btn-text');
          const btnIcon = toggleCatalogBtn.querySelector('.btn-icon');
          if (btnText) btnText.textContent = '▲ Mostrar Menos Modelos';
          if (btnIcon) btnIcon.textContent = '▲';
        }
      }

      const filterCategory = tab.getAttribute('data-filter');

      gorroCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        const categories = cardCategory.split(/\s+/);
        if (filterCategory === 'all' || categories.includes(filterCategory)) {
          card.classList.remove('card-hidden');
        } else {
          card.classList.add('card-hidden');
        }
      });
    });
  });

  // Sanitizador seguro para URLs de WhatsApp: elimina emojis y caracteres que causan '???' o simbolos invalidos
  function cleanForWhatsApp(text) {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remueve tildes para maxima compatibilidad en WhatsApp intents
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '') // Remueve emojis
      .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '-') // Convierte viñetas raras a guion simple
      .replace(/[^\w\s.,;:()\-/@$%+!]/gi, ' ') // Remueve simbolos no estandar
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ==========================================================================
     3. Pedidos Directos de Gorros por WhatsApp
     ========================================================================== */
  const gorroOrderButtons = document.querySelectorAll('.btn-order-gorro');

  gorroOrderButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-gorro-card');
      const rawTitle = card ? card.querySelector('.product-title-row h3')?.innerText : 'Gorro Quirurgico';
      const rawPrice = card ? card.querySelector('.product-price-value')?.innerText : '$150 MXN';

      const title = cleanForWhatsApp(rawTitle) || 'Gorro Quirurgico';
      const price = cleanForWhatsApp(rawPrice) || '$150 MXN';

      const message = `Hola Dra. Dariana, me interesa el gorro quirurgico modelo *${title}* (${price}) del catalogo oficial de Estilo Molar. Deseo consultar disponibilidad para entrega o envio en Villahermosa.`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${CLINIC_WHATSAPP}&text=${encodeURIComponent(message)}`;

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });

  /* ==========================================================================
     4. Agendar Cita Dental (Formulario -> WhatsApp Directo y Limpio)
     ========================================================================== */
  const appointmentForm = document.getElementById('dentalBookingForm');
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const modalCloseBtn = document.getElementById('closeModalBtn');
  const modalWhatsappLink = document.getElementById('modalWhatsappConfirmLink');
  const bookingFeedback = document.getElementById('bookingDirectFeedback');
  const bookDateInput = document.getElementById('bookDate');

  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.min = today;
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const rawName = document.getElementById('bookName').value.trim();
      const rawPhone = document.getElementById('bookPhone').value.trim();
      const rawEmail = document.getElementById('bookEmail').value.trim();
      const rawDate = document.getElementById('bookDate').value;
      const rawTime = document.getElementById('bookTime').value;
      const rawService = document.getElementById('bookService').value;
      const rawNotes = document.getElementById('bookNotes').value.trim();

      if (!rawName || !rawPhone || !rawDate || !rawTime) {
        alert('Por favor completa todos los campos requeridos para tu cita.');
        return;
      }

      const name = cleanForWhatsApp(rawName);
      const phone = cleanForWhatsApp(rawPhone);
      const email = rawEmail ? cleanForWhatsApp(rawEmail) : '';
      const service = cleanForWhatsApp(rawService);
      const notes = rawNotes ? cleanForWhatsApp(rawNotes) : '';

      // Construccion de mensaje 100% limpio en WhatsApp Markdown (cero emojis ni caracteres invalidos)
      const messageLines = [
        '*SOLICITUD DE CITA DENTAL - DRA. DARIANA PAMELA*',
        'Hola Dra. Dariana, deseo agendar una consulta en su consultorio en Villahermosa:',
        '',
        `- *Paciente:* ${name}`,
        `- *Telefono / WhatsApp:* ${phone}`,
        email ? `- *Correo:* ${email}` : null,
        `- *Fecha deseada:* ${rawDate}`,
        `- *Horario:* ${rawTime}`,
        `- *Tratamiento:* ${service}`,
        notes ? `- *Notas:* ${notes}` : null,
        '',
        '*Ubicacion:* Av. Paseo Tabasco, Villahermosa, Tabasco.',
        'Quedo a la espera de su confirmacion. Muchas gracias.'
      ].filter(Boolean);

      const appointmentMessage = messageLines.join('\n');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${CLINIC_WHATSAPP}&text=${encodeURIComponent(appointmentMessage)}`;

      // Actualizar enlace en modal si el usuario decide consultarlo
      if (modalWhatsappLink) {
        modalWhatsappLink.href = whatsappUrl;
      }

      // Actualizar resumen en el modal de forma segura
      const modalSummary = document.getElementById('modalAppointmentSummary');
      if (modalSummary) {
        modalSummary.textContent = '';
        const p1 = document.createElement('div');
        p1.innerHTML = '<strong>Paciente:</strong> ';
        p1.appendChild(document.createTextNode(name));

        const p2 = document.createElement('div');
        p2.innerHTML = '<strong>Tratamiento:</strong> ';
        p2.appendChild(document.createTextNode(rawService));

        const p3 = document.createElement('div');
        p3.innerHTML = '<strong>Fecha y Hora:</strong> ';
        p3.appendChild(document.createTextNode(`${rawDate} a las ${rawTime}`));

        modalSummary.appendChild(p1);
        modalSummary.appendChild(p2);
        modalSummary.appendChild(p3);
      }

      // Feedback visual directo en el boton del formulario
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.92';
        submitBtn.innerHTML = '<span>Abriendo WhatsApp...</span><span class="arrow-icon-circle">✓</span>';
      }

      if (bookingFeedback) {
        bookingFeedback.style.display = 'block';
        bookingFeedback.innerHTML = `<p style="margin: 0; color: #0E6D81; font-weight: 600; font-size: 0.9rem;">✓ Solicitud generada con exito. Si WhatsApp no se abre automaticamente, <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="color: #128C7E; font-weight: 800; text-decoration: underline;">haz clic aqui para enviar tu mensaje</a>.</p>`;
      }

      // Envio directo a WhatsApp sin pantallas intermedias obligatorias
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      // Restaurar estado del boton despues de 4 segundos
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.innerHTML = originalBtnHtml;
        }
      }, 4000);
    });
  }

  if (modalCloseBtn && bookingSuccessModal) {
    modalCloseBtn.addEventListener('click', () => {
      bookingSuccessModal.close();
      if (appointmentForm) appointmentForm.reset();
    });
  }

  /* ==========================================================================
     5. Modal de Demostración Clínica / Procedimiento
     ========================================================================== */
  const videoTriggers = document.querySelectorAll('.trigger-procedure-modal');
  const procedureModal = document.getElementById('procedureModal');
  const closeProcedureModalBtn = document.getElementById('closeProcedureModalBtn');

  videoTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (procedureModal && typeof procedureModal.showModal === 'function') {
        procedureModal.showModal();
      }
    });
  });

  if (closeProcedureModalBtn && procedureModal) {
    closeProcedureModalBtn.addEventListener('click', () => {
      procedureModal.close();
    });
  }

  // Cierre ergonómico de modales al tocar el fondo (backdrop tap en móviles)
  [bookingSuccessModal, procedureModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          modal.close();
          if (modal === bookingSuccessModal && appointmentForm) {
            appointmentForm.reset();
          }
        }
      });
    }
  });

  /* ==========================================================================
     6. Botón Volver Arriba (Back To Top)
     ========================================================================== */
  const backToTopBtn = document.querySelector('.btn-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     7. Formulario Newsletter Footer
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      if (emailInput && emailInput.value) {
        alert('¡Gracias por suscribirte! Te avisaremos de los nuevos estampados de gorros quirúrgicos y promociones odontológicas.');
        emailInput.value = '';
      }
    });
  }

  /* ==========================================================================
     8. Testimonios Slider Interactivo
     ========================================================================== */
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const carouselContainer = document.querySelector('.stories-cards-carousel');

  if (prevBtn && nextBtn && carouselContainer) {
    const getScrollStep = () => {
      const firstCard = carouselContainer.querySelector('.story-review-card');
      return firstCard ? firstCard.offsetWidth + 20 : 320;
    };
    nextBtn.addEventListener('click', () => {
      carouselContainer.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', () => {
      carouselContainer.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
  }
});
