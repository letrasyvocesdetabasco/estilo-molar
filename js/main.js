/**
 * ESTILO MOLAR | Odontología Especializada & Gorros Quirúrgicos
 * Villahermosa, Tabasco - JavaScript Interactivo
 */

document.addEventListener('DOMContentLoaded', () => {
  // Teléfono oficial de WhatsApp de la clínica en Villahermosa
  const CLINIC_WHATSAPP = '529932405890';

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
     2. Filtro de Gorros Quirúrgicos
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab-pill');
  const gorroCards = document.querySelectorAll('.product-gorro-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

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

  /* ==========================================================================
     3. Pedidos Directos de Gorros por WhatsApp
     ========================================================================== */
  const gorroOrderButtons = document.querySelectorAll('.btn-order-gorro');

  gorroOrderButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-gorro-card');
      const title = card ? card.querySelector('.product-title-row h3')?.innerText : 'Gorro Quirúrgico';
      const price = card ? card.querySelector('.product-price-value')?.innerText : '$150 MXN';

      const message = `👋 ¡Hola Dra. Dariana! Me interesa adquirir el gorro quirúrgico modelo *${title}* (${price}) del catálogo oficial de Estilo Molar en Villahermosa. ¿Tienes disponible para entrega o envío?`;
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  });

  /* ==========================================================================
     4. Agendar Cita Dental (Formulario -> WhatsApp & Modal)
     ========================================================================== */
  const appointmentForm = document.getElementById('dentalBookingForm');
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const modalCloseBtn = document.getElementById('closeModalBtn');
  const modalWhatsappLink = document.getElementById('modalWhatsappConfirmLink');
  const bookDateInput = document.getElementById('bookDate');

  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.min = today;
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const email = document.getElementById('bookEmail').value.trim();
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;
      const service = document.getElementById('bookService').value;
      const notes = document.getElementById('bookNotes').value.trim();

      if (!name || !phone || !date || !time) {
        alert('Por favor completa todos los campos requeridos para tu cita.');
        return;
      }

      // Generar mensaje estructurado para WhatsApp
      const appointmentMessage = 
`🦷 *SOLICITUD DE CITA DENTAL - VILLAHERMOSA* 🦷
----------------------------------
👤 *Paciente:* ${name}
📞 *Teléfono:* ${phone}
📧 *Email:* ${email || 'No especificado'}
🗓 *Fecha Deseada:* ${date}
⏰ *Horario Preferido:* ${time}
🩺 *Tratamiento / Motivo:* ${service}
📝 *Comentarios / Síntomas:* ${notes || 'Primera valoración'}
----------------------------------
_Enviado desde el sitio web oficial de Estilo Molar_`;

      const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(appointmentMessage)}`;

      // Actualizar enlace del modal
      if (modalWhatsappLink) {
        modalWhatsappLink.href = whatsappUrl;
      }

      // Actualizar resumen en el modal de forma segura (sin riesgo de inyección HTML)
      const modalSummary = document.getElementById('modalAppointmentSummary');
      if (modalSummary) {
        modalSummary.textContent = '';
        const p1 = document.createElement('div');
        p1.innerHTML = '<strong>Paciente:</strong> ';
        p1.appendChild(document.createTextNode(name));

        const p2 = document.createElement('div');
        p2.innerHTML = '<strong>Tratamiento:</strong> ';
        p2.appendChild(document.createTextNode(service));

        const p3 = document.createElement('div');
        p3.innerHTML = '<strong>Fecha y Hora:</strong> ';
        p3.appendChild(document.createTextNode(`${date} a las ${time}`));

        modalSummary.appendChild(p1);
        modalSummary.appendChild(p2);
        modalSummary.appendChild(p3);
      }

      // Mostrar modal accesible
      if (bookingSuccessModal && typeof bookingSuccessModal.showModal === 'function') {
        bookingSuccessModal.showModal();
      } else {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
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
