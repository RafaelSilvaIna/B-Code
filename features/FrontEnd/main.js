// Animação de mensagem ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.querySelector('.message-container');
    gsap.from(messageContainer, {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: "power2.out",
    });
});
