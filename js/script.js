document.addEventListener('DOMContentLoaded', function () {
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
        themeToggle.addEventListener('click', function () {
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
        mobileMenuBtn.addEventListener('click', function () {
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
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // ========== SMOOTH SCROLL ==========
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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

    // ========== ANIMAÇÃO DE SCROLL ==========
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.service-card, .highlight-item, .process-step, .commitment-item, .testimonial-card');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Configurar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .highlight-item, .process-step, .commitment-item, .testimonial-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Executar animação no carregamento e no scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // ========== COOKIE CONSENT ==========
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookies = document.getElementById('acceptCookies');
    const cookieSettingsBtn = document.getElementById('cookieSettingsBtn');

    if (cookieConsent && acceptCookies) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieConsent.style.display = 'block';
            }, 1000);
        }

        acceptCookies.addEventListener('click', function () {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.style.display = 'none';
        });

        if (cookieSettingsBtn) {
            cookieSettingsBtn.addEventListener('click', function () {
                alert('Configurações de cookies: Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.');
            });
        }
    }

    // Configurações de cookies no footer
    const cookieSettingsLink = document.getElementById('cookieSettings');
    if (cookieSettingsLink) {
        cookieSettingsLink.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Configurações de cookies: Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.');
        });
    }
});
// Scroll animation para processo de trabalho
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

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    initProcessAnimation();
});