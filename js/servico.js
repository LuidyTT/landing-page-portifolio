// ===== JAVASCRIPT ESPECÍFICO PARA PÁGINA DE SERVIÇOS =====

document.addEventListener('DOMContentLoaded', function() {
    // ========== DARK MODE ==========
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        
        // Verificar preferência salva ou do sistema
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-moon';
        }
        
        // Alternar tema
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ========== MENU MOBILE ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Alterar ícone do botão
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // ========== ANIMAÇÕES DE SCROLL ==========
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animação específica para cards de preço populares
                    if (entry.target.classList.contains('popular')) {
                        setTimeout(() => {
                            entry.target.classList.add('pulse-once');
                        }, 300);
                    }
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        document.querySelectorAll('.service-card, .pricing-card, .advantage-card, .services-category').forEach(element => {
            element.classList.add('pre-animate');
            observer.observe(element);
        });
    }

    // ========== ANIMAÇÃO DA TIMELINE ==========
    function initProcessAnimation() {
        const processSteps = document.querySelectorAll('.process-step');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        processSteps.forEach(step => {
            observer.observe(step);
        });
    }

    // ========== INTERAÇÕES COM SERVIÇOS ==========
    function setupServiceInteractions() {
        // Hover effects para cards de serviço
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', handleServiceCardHover);
            card.addEventListener('mouseleave', handleServiceCardLeave);
        });

        // Clique para expandir detalhes do serviço
        document.querySelectorAll('.service-card:not(.featured)').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('a')) {
                    toggleServiceDetails(card);
                }
            });
        });
    }

    function handleServiceCardHover(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.service-icon');
        
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    }

    function handleServiceCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.service-icon');
        
        if (icon) {
            icon.style.transform = '';
        }
    }

    function toggleServiceDetails(card) {
        const details = card.querySelector('.service-details');
        if (details) {
            details.classList.toggle('expanded');
            
            if (details.classList.contains('expanded')) {
                details.style.maxHeight = details.scrollHeight + 'px';
                details.style.opacity = '1';
            } else {
                details.style.maxHeight = '0';
                details.style.opacity = '0';
            }
        }
    }

    // ========== INTERAÇÕES COM PREÇOS ==========
    function setupPricingInteractions() {
        document.querySelectorAll('.pricing-cta .btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handlePlanSelection(e.currentTarget);
            });
        });

        // Efeito de destaque para cards de preço
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('mouseenter', handlePricingCardHover);
            card.addEventListener('mouseleave', handlePricingCardLeave);
        });
    }

    function handlePricingCardHover(e) {
        const card = e.currentTarget;
        if (!card.classList.contains('popular')) {
            card.style.borderColor = 'var(--primary)';
            card.style.transform = 'translateY(-5px)';
        }
    }

    function handlePricingCardLeave(e) {
        const card = e.currentTarget;
        if (!card.classList.contains('popular')) {
            card.style.borderColor = '';
            card.style.transform = '';
        }
    }

    function handlePlanSelection(button) {
        const card = button.closest('.pricing-card');
        const planName = card.querySelector('h3').textContent;
        const price = card.querySelector('.amount').textContent;
        
        showPlanModal(planName, price);
    }

    function showPlanModal(planName, price) {
        // Criar modal de contratação
        const modal = createPlanModal(planName, price);
        document.body.appendChild(modal);
        
        // Animar entrada do modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 50);

        // Configurar fechamento do modal
        setupModalClose(modal);
    }

    function createPlanModal(planName, price) {
        const modal = document.createElement('div');
        modal.className = 'service-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Fechar modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <h3>Contratar Plano ${planName}</h3>
                    <p class="modal-price">${price}/mês</p>
                </div>
                <div class="modal-body">
                    <p>Escolha a melhor forma de entrar em contato conosco:</p>
                    <div class="contact-options">
                        <a href="tel:+551199999999" class="contact-option phone">
                            <i class="fas fa-phone"></i>
                            <span>Ligar Agora</span>
                            <small>(11) 9999-9999</small>
                        </a>
                        <a href="https://wa.me/5511999999999?text=Olá! Gostaria de contratar o plano ${planName}" 
                           class="contact-option whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                            <small>Mensagem direta</small>
                        </a>
                        <a href="mailto:contato@cadesnet.com.br?subject=Contratação - Plano ${planName}" 
                           class="contact-option email">
                            <i class="fas fa-envelope"></i>
                            <span>E-mail</span>
                            <small>contato@cadesnet.com.br</small>
                        </a>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline close-modal">Fechar</button>
                </div>
            </div>
        `;
        
        return modal;
    }

    function setupModalClose(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        const closeModalBtn = modal.querySelector('.close-modal');
        
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        
        // Fechar com ESC
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // ========== NAVEGAÇÃO SUAVE ==========
    function setupNavigation() {
        // Scroll suave para âncoras
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                scrollToSection(targetId);
            });
        });

        // Ativar link ativo baseado na scroll position
        window.addEventListener('scroll', throttle(updateActiveNav, 100));
    }

    function scrollToSection(sectionId) {
        const targetElement = document.querySelector(sectionId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ========== MODAIS DE CONTATO ==========
    function setupContactModals() {
        // Modal para serviços específicos
        document.querySelectorAll('.service-cta .btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const serviceCard = button.closest('.service-card');
                const serviceName = serviceCard.querySelector('h3').textContent;
                showServiceContactModal(serviceName);
            });
        });
    }

    function showServiceContactModal(serviceName) {
        const modal = createServiceContactModal(serviceName);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 50);
        
        setupModalClose(modal);
    }

    function createServiceContactModal(serviceName) {
        const modal = document.createElement('div');
        modal.className = 'service-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Fechar modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <h3>${serviceName}</h3>
                    <p>Solicitar Orçamento</p>
                </div>
                <div class="modal-body">
                    <p>Entre em contato para saber mais sobre este serviço:</p>
                    <div class="contact-options">
                        <a href="tel:+551199999999" class="contact-option phone">
                            <i class="fas fa-phone"></i>
                            <span>Ligar Agora</span>
                            <small>(11) 9999-9999</small>
                        </a>
                        <a href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o serviço: ${serviceName}" 
                           class="contact-option whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                            <small>Orçamento rápido</small>
                        </a>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline close-modal">Fechar</button>
                </div>
            </div>
        `;
        
        return modal;
    }

    // ========== ATUALIZAR ANO NO FOOTER ==========
    function updateCurrentYear() {
        const currentYear = new Date().getFullYear();
        const yearElement = document.querySelector('.footer-bottom p');
        if (yearElement) {
            yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
        }
    }

    // ========== UTILITY FUNCTIONS ==========
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ========== INICIALIZAR TUDO ==========
    setupScrollAnimations();
    initProcessAnimation();
    setupServiceInteractions();
    setupPricingInteractions();
    setupNavigation();
    setupContactModals();
    updateCurrentYear();

    // ========== SMOOTH SCROLL (compatibilidade) ==========
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Adicionar estilos dinâmicos para modais
const modalStyles = `
    <style>
        .service-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .service-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: var(--card-bg);
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            border: 1px solid var(--border);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .service-modal.show .modal-content {
            transform: scale(1);
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.2rem;
            color: var(--gray);
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: var(--light);
            color: var(--primary);
        }
        
        .modal-header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border);
        }
        
        .modal-header h3 {
            color: var(--primary);
            margin-bottom: 10px;
        }
        
        .modal-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--success);
        }
        
        .contact-options {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 25px 0;
        }
        
        .contact-option {
            display: flex;
            align-items: center;
            padding: 20px;
            border: 1px solid var(--border);
            border-radius: 10px;
            text-decoration: none;
            color: var(--text);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .contact-option:hover {
            transform: translateY(-2px);
            border-color: var(--primary);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .contact-option.phone:hover {
            background: rgba(44, 90, 160, 0.05);
        }
        
        .contact-option.whatsapp:hover {
            background: rgba(37, 211, 102, 0.05);
        }
        
        .contact-option.email:hover {
            background: rgba(231, 76, 60, 0.05);
        }
        
        .contact-option i {
            font-size: 1.5rem;
            margin-right: 15px;
            width: 30px;
            text-align: center;
        }
        
        .contact-option.phone i {
            color: var(--primary);
        }
        
        .contact-option.whatsapp i {
            color: #25D366;
        }
        
        .contact-option.email i {
            color: #E74C3C;
        }
        
        .contact-option span {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .contact-option small {
            display: block;
            color: var(--gray);
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        .modal-footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }
        
        .pre-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .pulse-once {
            animation: pulseFeatured 1s ease-in-out;
        }
        
        .service-details {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: all 0.4s ease;
        }
        
        .service-details.expanded {
            max-height: 500px;
            opacity: 1;
        }
        
        @keyframes pulseFeatured {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
            .modal-content {
                padding: 20px;
                width: 95%;
            }
            
            .contact-option {
                padding: 15px;
            }
            
            .contact-option i {
                font-size: 1.3rem;
                margin-right: 12px;
            }
        }
    </style>
`;

// Adicionar estilos ao documento
document.head.insertAdjacentHTML('beforeend', modalStyles);