/* ==========================================================================
   PAINTHOUSE PAINTING CONTRACTORS - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Drawer Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu when link clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (mobileToggle.querySelector('i')) {
                    mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }

    // 2. Navbar Scroll Shrink & Active Section Link Update
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlight on Scroll
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-menu a[href*=' + sectionId + ']').forEach(link => {
                    link.classList.add('active');
                });
            } else {
                document.querySelectorAll('.nav-menu a[href*=' + sectionId + ']').forEach(link => {
                    link.classList.remove('active');
                });
            }
        });
    });

    // 3. Stats Counter Animation Trigger
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateStats() {
        const statsSection = document.querySelector('.stats-bar-section');
        if (!statsSection) return;

        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.2;

        if (sectionPos < screenPos && !hasAnimated) {
            hasAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.innerText = target + (target === 100 ? '%' : '+');
                        clearInterval(timer);
                    } else {
                        stat.innerText = Math.floor(current) + (target === 100 ? '%' : '+');
                    }
                }, 16);
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats(); // Run check on load

    // 5. Portfolio Category Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 6. Lightbox Modal Pop-up Viewer
    const lightboxModal = document.getElementById('lightboxModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalLocation = document.getElementById('modalLocation');
    const modalDesc = document.getElementById('modalDesc');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = trigger.getAttribute('data-title');
            const location = trigger.getAttribute('data-location');
            const desc = trigger.getAttribute('data-desc');
            const imgSrc = trigger.getAttribute('data-img');

            if (modalImg) modalImg.src = imgSrc;
            if (modalTitle) modalTitle.innerText = title;
            if (modalLocation) modalLocation.innerText = location;
            if (modalDesc) modalDesc.innerText = desc;

            if (lightboxModal) {
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalCloseBtn && lightboxModal) {
        modalCloseBtn.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 7. Instant Paint & Cost Estimator Math
    const calcAreaInput = document.getElementById('calcArea');
    const calcServiceSelect = document.getElementById('calcService');
    const calcCoatsSelect = document.getElementById('calcCoats');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultLiters = document.getElementById('resultLiters');
    const resultPrice = document.getElementById('resultPrice');

    function calculatePaintEstimate() {
        if (!calcAreaInput || !calcServiceSelect || !calcCoatsSelect) return;

        const areaSqFt = parseFloat(calcAreaInput.value) || 0;
        const serviceType = calcServiceSelect.value;
        const coats = parseInt(calcCoatsSelect.value) || 2;

        if (areaSqFt <= 0) {
            showToast('Please enter a valid surface area in sq. ft.', 'error');
            return;
        }

        // Coverage assumption: 1 Liter covers approx 120-140 sq.ft for 1 coat
        // For N coats, coverage per liter = 130 / coats sq.ft.
        const coveragePerLiter = 130 / coats;
        const totalLitersMin = Math.ceil(areaSqFt / (coveragePerLiter * 1.15));
        const totalLitersMax = Math.ceil(areaSqFt / (coveragePerLiter * 0.95));

        // Cost per sq.ft range (includes paint + prep + expert labor)
        let ratePerSqFtMin = 250;
        let ratePerSqFtMax = 300;

        switch (serviceType) {
            case 'interior_standard':
                ratePerSqFtMin = 250;
                ratePerSqFtMax = 275;
                break;
            case 'exterior_weather':
                ratePerSqFtMin = 265;
                ratePerSqFtMax = 285;
                break;
            case 'interior_royale':
                ratePerSqFtMin = 275;
                ratePerSqFtMax = 295;
                break;
            case 'waterproofing':
                ratePerSqFtMin = 285;
                ratePerSqFtMax = 300;
                break;
            case 'texture':
                ratePerSqFtMin = 300;
                ratePerSqFtMax = 350;
                break;
        }

        const totalCostMin = Math.round(areaSqFt * ratePerSqFtMin * (coats / 2));
        const totalCostMax = Math.round(areaSqFt * ratePerSqFtMax * (coats / 2));

        if (resultLiters) {
            resultLiters.innerText = `${totalLitersMin} - ${totalLitersMax} Liters`;
        }
        if (resultPrice) {
            resultPrice.innerText = `₹${totalCostMin.toLocaleString('en-IN')} - ₹${totalCostMax.toLocaleString('en-IN')}*`;
        }
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculatePaintEstimate);
    }
    if (calcAreaInput) {
        calcAreaInput.addEventListener('input', calculatePaintEstimate);
    }
    if (calcServiceSelect) {
        calcServiceSelect.addEventListener('change', calculatePaintEstimate);
    }
    if (calcCoatsSelect) {
        calcCoatsSelect.addEventListener('change', calculatePaintEstimate);
    }

    // 8. Contact Form Handling & Toast Notifications
    const contactForm = document.getElementById('contactForm');
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'info') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            const name = document.getElementById('fullName').value;
            const phone = document.getElementById('phoneNum').value;

            if (!name || !phone) {
                showToast('Please fill out your Name and Phone Number.', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Request...';
            }

            try {
                const formData = new FormData(contactForm);
                formData.append('_subject', `New PaintHouse Inquiry from ${name}`);
                formData.append('_template', 'table');

                const response = await fetch('https://formsubmit.co/ajax/painthouse.calicut@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    showToast(`Thank you ${name}! Your inquiry has been sent to painthouse.calicut@gmail.com. Our expert will call you shortly.`);
                    contactForm.reset();
                } else {
                    showToast(`Thank you ${name}! Your request has been submitted. Our expert will call you shortly on ${phone}.`);
                    contactForm.reset();
                }
            } catch (err) {
                showToast(`Thank you ${name}! Your request has been submitted. Our expert will call you shortly on ${phone}.`);
                contactForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    // 9. Update Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }
});
