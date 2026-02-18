// Script específico para a página Contato
document.addEventListener('DOMContentLoaded', function () {
    console.log('Script de contato carregado!');

    // ========== CONFIGURAÇÕES WHATSAPP ==========
    const CONFIG = {
        whatsappNumber: '5511999999999', // ATUALIZE COM SEU NÚMERO
        companyName: 'CadesNet',
        defaultMessage: 'Olá! Gostaria de mais informações sobre os serviços.'
    };

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

    // ========== SISTEMA DE CONTATO VIA WHATSAPP ==========
    function initFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) {
            console.log('Formulário não encontrado');
            return;
        }

        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        const btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;

        // Máscara de telefone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 11) {
                    value = value.substring(0, 11);
                }
                
                if (value.length > 10) {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length > 6) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                } else if (value.length > 0) {
                    value = value.replace(/^(\d{0,2})/, '($1');
                }
                
                e.target.value = value;
            });
        }

        // Validação em tempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                clearError(this);
            });
        });

        function validateField(field) {
            const value = field.value.trim();

            // Limpar erro anterior
            clearError(field);

            // Validações específicas
            if (field.required && !value) {
                showError(field, 'Este campo é obrigatório');
                return false;
            }

            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError(field, 'Por favor, insira um e-mail válido');
                    return false;
                }
            }

            if (field.id === 'phone' && value) {
                const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
                if (!phoneRegex.test(value)) {
                    showError(field, 'Por favor, insira um telefone válido');
                    return false;
                }
            }

            if (field.id === 'name' && value.length < 2) {
                showError(field, 'O nome deve ter pelo menos 2 caracteres');
                return false;
            }

            return true;
        }

        function showError(field, message) {
            field.classList.add('error');
            const errorElement = document.getElementById(field.id + 'Error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        }

        function clearError(field) {
            field.classList.remove('error');
            const errorElement = document.getElementById(field.id + 'Error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        }

        function validateForm() {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        // ENVIO VIA WHATSAPP - MÉTODO CORRIGIDO
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            // Mostrar estado de loading
            if (submitBtn && btnText && btnLoading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-block';
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
            }

            try {
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    service: document.getElementById('service').value,
                    message: document.getElementById('message') ? document.getElementById('message').value.trim() : ''
                };

                await sendWhatsAppMessage(formData);
                
                showNotification('Mensagem enviada com sucesso! Redirecionando para WhatsApp...', 'success');
                
                // Limpar formulário
                form.reset();
                
                // Mostrar modal de sucesso
                setTimeout(() => {
                    showSuccessModal();
                }, 1000);
                
            } catch (error) {
                console.error('Erro:', error);
                showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
            } finally {
                // Restaurar estado do botão
                if (submitBtn && btnText && btnLoading) {
                    btnText.style.display = 'inline-block';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                }
            }
        });

        console.log('Validação do formulário inicializada');
    }

    // ========== SISTEMA WHATSAPP - MÉTODO MELHORADO ==========
    async function sendWhatsAppMessage(formData) {
        return new Promise((resolve) => {
            try {
                const message = formatWhatsAppMessage(formData);
                openWhatsApp(message);
                resolve(true);
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                resolve(false);
            }
        });
    }

    function formatWhatsAppMessage(formData) {
        const serviceText = getServiceText(formData.service);
        const dateTime = new Date().toLocaleString('pt-BR');
        
        let message = `*${CONFIG.companyName} - NOVA SOLICITAÇÃO* 📞\n\n`;
        
        message += `*📅 Data/Hora:* ${dateTime}\n\n`;
        
        message += `*👤 DADOS DO CLIENTE*\n`;
        message += `• *Nome:* ${formData.name}\n`;
        message += `• *Email:* ${formData.email}\n`;
        
        if (formData.phone) {
            message += `• *Telefone:* ${formData.phone}\n`;
        }
        
        message += `• *Serviço de Interesse:* ${serviceText}\n\n`;
        
        if (formData.message) {
            message += `*💬 MENSAGEM DO CLIENTE*\n`;
            message += `${formData.message}\n\n`;
        }
        
        // REMOVIDA A SEÇÃO DE SOLICITAÇÃO REDUNDANTE
        message += `_📧 Enviado através do site ${CONFIG.companyName}_\n`;
        message += `_⏰ Recebido em ${dateTime}_`;

        return message;
    }

    function getServiceText(service) {
        const services = {
            'internet': '🌐 Internet Fibra Óptica',
            'assistencia': '🔧 Assistência Técnica',
            'cftv': '📹 CFTV e Monitoramento',
            'redes': '💻 Redes e Infraestrutura',
            'outro': '❓ Outro Serviço'
        };
        return services[service] || '🚀 Serviço não especificado';
    }

    function openWhatsApp(message) {
        // Codificar a mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
        
        console.log('🔗 URL do WhatsApp:', whatsappUrl);
        console.log('📝 Mensagem formatada:', message);
        
        // Redirecionar após breve delay para feedback visual
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1500);
    }

    // ========== SISTEMA DE NOTIFICAÇÕES ==========
    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    function getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ========== MODAL DE SUCESSO ==========
    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                modal.classList.add('show');
            }, 50);
        }
    }

    function closeSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    // Event listeners do modal
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeSuccessModal);
    }

    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSuccessModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSuccessModal();
        }
    });

    // ========== COMPONENTES EXISTENTES ==========

    // FAQ Accordion
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        console.log(`Encontrados ${faqItems.length} itens FAQ`);

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            if (question) {
                question.addEventListener('click', function () {
                    const isActive = item.classList.contains('active');
                    
                    // Fechar todos os itens
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    });

                    // Se não estava ativo, ativar
                    if (!isActive) {
                        item.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                    }
                });
            }
        });
    }

    // Menu mobile
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            
            mobileMenuBtn.addEventListener('click', function () {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                navMenu.classList.toggle('active');
                this.setAttribute('aria-expanded', (!isExpanded).toString());
                
                // Alterar ícone do menu
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
                }
            });

            // Fechar menu ao clicar em um link
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                });
            });
        }
    }

    // Animação de entrada para elementos
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.contact-form-container, .contact-method-card, .form-intro, .faq-item, .map-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // ========== INICIALIZAR TODOS OS COMPONENTES ==========
    try {
        initFormValidation();
        initFAQ();
        initMobileMenu();
        initAnimations();

        // Adicionar classe de carregamento ao body
        document.body.classList.add('loaded');
        
        console.log('Todos os componentes inicializados com sucesso');
    } catch (error) {
        console.error('Erro durante a inicialização:', error);
    }
});

// ========== ESTILOS DINÂMICOS ==========
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Notificações */
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        border: 1px solid;
        backdrop-filter: blur(10px);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: rgba(34, 197, 94, 0.1);
        border-color: #22c55e;
        color: #22c55e;
    }
    
    .notification-error {
        background: rgba(239, 68, 68, 0.1);
        border-color: #ef4444;
        color: #ef4444;
    }
    
    .notification-warning {
        background: rgba(245, 158, 11, 0.1);
        border-color: #f59e0b;
        color: #f59e0b;
    }
    
    .notification-info {
        background: rgba(59, 130, 246, 0.1);
        border-color: #3b82f6;
        color: #3b82f6;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
    }
    
    /* Estados de formulário */
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .btn-loading {
        display: none;
    }
    
    .submit-btn.loading {
        opacity: 0.8;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
    }
    
    .error-message {
        display: none;
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 5px;
        font-weight: 500;
    }
    
    /* Responsividade */
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

document.head.appendChild(dynamicStyles);

