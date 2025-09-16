document.addEventListener('DOMContentLoaded', () => {

    // --- Animação Geral (Animate on Scroll) ---
    const generalElementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const images = entry.target.querySelectorAll('img');
                images.forEach((image, index) => {
                    image.style.transitionDelay = `${index * 0.2}s`;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    generalElementsToAnimate.forEach(element => {
        generalObserver.observe(element);
    });

    // --- Script para o Menu Inteligente ---
    const nav = document.querySelector('.transparent-nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 50) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        if (scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- Script do Carrossel da Equipe ---
    const carouselWrapper = document.querySelector('.team-carousel-wrapper');
    const prevButton = document.querySelector('.carousel-nav-button.prev');
    const nextButton = document.querySelector('.carousel-nav-button.next');
    const teamProfiles = document.querySelectorAll('.team-profile');
    const container = document.querySelector('.team-carousel-container');

    let scrollAmount = 0;

    const updateScrollStep = () => {
        const containerWidth = carouselWrapper.offsetWidth;
        const gap = parseFloat(getComputedStyle(carouselWrapper).gap) || 0;
        const cardWidth = teamProfiles.length > 0 ? teamProfiles[0].offsetWidth : 0;

        if (cardWidth > 0) {
            const cardsThatFit = Math.floor((containerWidth + gap) / (cardWidth + gap));
            if (cardsThatFit >= 1) {
                scrollAmount = cardWidth * cardsThatFit + gap * (cardsThatFit - 1);
            } else {
                scrollAmount = cardWidth + gap;
            }
        } else {
            scrollAmount = 0;
        }
    };

    if (teamProfiles.length > 0) {
        updateScrollStep();
        window.addEventListener('resize', updateScrollStep);

        nextButton.addEventListener('click', () => {
            const maxScroll = carouselWrapper.scrollWidth - carouselWrapper.clientWidth;
            if (carouselWrapper.scrollLeft < maxScroll) {
                carouselWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            } else {
                carouselWrapper.scrollTo({ left: 0, behavior: 'smooth' });
            }
        });

        prevButton.addEventListener('click', () => {
            if (carouselWrapper.scrollLeft > 0) {
                carouselWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                carouselWrapper.scrollTo({ left: carouselWrapper.scrollWidth - carouselWrapper.clientWidth, behavior: 'smooth' });
            }
        });

        let lastContainerWidth = carouselWrapper.offsetWidth;
        window.addEventListener('resize', () => {
            const currentContainerWidth = carouselWrapper.offsetWidth;
            if (currentContainerWidth !== lastContainerWidth) {
                updateScrollStep();
                lastContainerWidth = currentContainerWidth;
            }
        });
    } else {
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
    }

    // Animação dos cards da equipe ao aparecerem
    const teamElementsToAnimate = document.querySelectorAll('.team-profile');
    if (teamElementsToAnimate.length > 0) {
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    const images = entry.target.querySelectorAll('img');
                    images.forEach((img, index) => {
                        img.style.transitionDelay = `${index * 0.15}s`;
                    });
                    // observer.unobserve(entry.target); // Descomente para animar apenas uma vez
                }
            });
        }, { threshold: 0.5 });

        teamElementsToAnimate.forEach(element => {
            teamObserver.observe(element);
        });
    }

    // --- Animação de números em contagem para o dashboard ---
    function animateCounter(element, start, end, duration) {
        let startTime = null;
        const counter = element;
        const range = end - start;

        function step(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            counter.textContent = Math.floor(progress * range + start);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = end + '%'; // Garante o símbolo de porcentagem no final
            }
        }
        requestAnimationFrame(step);
    }

    const counters = document.querySelectorAll('.dashboard-card .data-value');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const startValue = 0;
                const endValue = parseInt(target.textContent, 10);
                const duration = 1500;

                animateCounter(target, startValue, endValue, duration);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- Formulário de Contato ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            console.log('Dados do formulário:', data); // Para depuração

            // --- Substitua esta simulação pelo envio real para o seu backend ou serviço ---
            // Exemplo de envio real usando Fetch API (você precisará configurar um backend ou serviço para receber estes dados)
            /*
            try {
                const response = await fetch('URL_DO_SEU_BACKEND/send-email', { // Altere para a sua URL real
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert('Obrigado! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.');
                    contactForm.reset();
                } else {
                    alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
                }
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
            }
            */

            // Simulação de envio bem-sucedido (para que o alerta e reset funcionem sem backend)
            alert('Obrigado! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.');
            contactForm.reset();
            // --- Fim da simulação ---
        });
    }
});
// Lógica do Carrossel de Imagens
const carouselWrapper = document.querySelector('.carousel-wrapper');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-control.prev');
const nextBtn = document.querySelector('.carousel-control.next');

let currentIndex = 0;
let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationFrameId = null;

// Atualiza a posição do carrossel
function updateCarouselPosition() {
    carouselWrapper.style.transform = `translateX(${currentTranslate}px)`;
}

// Move para o slide anterior
function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
        currentTranslate = -currentIndex * carouselWrapper.clientWidth;
        updateCarouselPosition();
    } else {
        // Se for o primeiro slide, volta para o último
        currentIndex = carouselSlides.length - 1;
        currentTranslate = -currentIndex * carouselWrapper.clientWidth;
        updateCarouselPosition();
    }
}

// Move para o próximo slide
function nextSlide() {
    if (currentIndex < carouselSlides.length - 1) {
        currentIndex++;
        currentTranslate = -currentIndex * carouselWrapper.clientWidth;
        updateCarouselPosition();
    } else {
        // Se for o último slide, volta para o primeiro
        currentIndex = 0;
        currentTranslate = -currentIndex * carouselWrapper.clientWidth;
        updateCarouselPosition();
    }
}

// Eventos de clique nos botões
prevBtn.addEventListener('click', () => {
    prevSlide();
    resetDragState(); // Reseta o estado de arrasto após clique
});
nextBtn.addEventListener('click', () => {
    nextSlide();
    resetDragState(); // Reseta o estado de arrasto após clique
});

// Lógica de arraste (drag and drop)
carouselWrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startPosition = e.clientX;
    prevTranslate = currentTranslate;
    carouselWrapper.style.cursor = 'grabbing';
    carouselWrapper.style.transition = 'none'; // Remove a transição durante o arraste

    animationFrameId = requestAnimationFrame(animationLoop); // Inicia o loop de animação
});

carouselWrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    startPosition = e.touches[0].clientX;
    prevTranslate = currentTranslate;
    carouselWrapper.style.cursor = 'grabbing';
    carouselWrapper.style.transition = 'none';

    animationFrameId = requestAnimationFrame(animationLoop);
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.clientX;
    const diff = currentPosition - startPosition;
    currentTranslate = prevTranslate + diff;
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    const diff = currentPosition - startPosition;
    currentTranslate = prevTranslate + diff;
});

document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    carouselWrapper.style.cursor = 'grab';
    carouselWrapper.style.transition = 'transform 0.5s ease-in-out'; // Restaura a transição

    cancelAnimationFrame(animationFrameId); // Para o loop de animação

    const slideWidth = carouselWrapper.clientWidth;
    const threshold = slideWidth / 3; // Define o limite para trocar de slide

    if (currentTranslate < prevTranslate - threshold && currentIndex < carouselSlides.length - 1) {
        currentIndex++;
    } else if (currentTranslate > prevTranslate + threshold && currentIndex > 0) {
        currentIndex--;
    }

    currentTranslate = -currentIndex * slideWidth;
    updateCarouselPosition();
});

document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    carouselWrapper.style.cursor = 'grab';
    carouselWrapper.style.transition = 'transform 0.5s ease-in-out';

    cancelAnimationFrame(animationFrameId);

    const slideWidth = carouselWrapper.clientWidth;
    const threshold = slideWidth / 3;

    if (currentTranslate < prevTranslate - threshold && currentIndex < carouselSlides.length - 1) {
        currentIndex++;
    } else if (currentTranslate > prevTranslate + threshold && currentIndex > 0) {
        currentIndex--;
    }

    currentTranslate = -currentIndex * slideWidth;
    updateCarouselPosition();
});

// Função para resetar o estado de arraste
function resetDragState() {
    isDragging = false;
    startPosition = 0;
    prevTranslate = 0;
    carouselWrapper.style.cursor = 'grab';
    carouselWrapper.style.transition = 'transform 0.5s ease-in-out';
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

// Loop de animação para o arraste suave
function animationLoop() {
    if (isDragging) {
        updateCarouselPosition();
        animationFrameId = requestAnimationFrame(animationLoop);
    }
}

// Inicializa o carrossel na posição correta
updateCarouselPosition();

// Adiciona a funcionalidade de clique na imagem para avançar
carouselSlides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
        // Não faz nada se estiver arrastando, para evitar cliques acidentais
        if (!isDragging) {
            nextSlide();
        }
    });
});

// Garante que o carrossel se ajuste ao redimensionamento da janela
window.addEventListener('resize', () => {
    // Atualiza a posição do carrossel com base no novo tamanho da janela
    currentTranslate = -currentIndex * carouselWrapper.clientWidth;
    updateCarouselPosition();
});