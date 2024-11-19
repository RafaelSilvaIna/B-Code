
gsap.from(".hero-title", {
        duration: 1.5,
        opacity: 0,
        y: -50,
        ease: "power3.out"
    });

    gsap.from(".hero-description", {
        duration: 1.5,
        opacity: 0,
        y: 50,
        delay: 0.5,
        ease: "power3.out"
    });

    gsap.from(".hero-btn", {
        duration: 1.5,
        opacity: 0,
        scale: 0.8,
        delay: 1,
        ease: "power3.out"
    });


// Aguardar o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    const enterButton = document.getElementById('enter-btn');
    
    // Animação de botão ao clicar
    enterButton.addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do botão (se houver)
        gsap.to(enterButton, {
            scale: 1.2,
            duration: 0.3,
            ease: "ease.out",
            onComplete: function() {
                // Após a animação, podemos redirecionar para outra página ou exibir uma mensagem
                console.log('Bem-vindo ao B-Code! Você está entrando na plataforma.');
                // Aqui pode adicionar um redirecionamento ou outro comportamento
                // window.location.href = "/login"; // Por exemplo, redirecionar para a página de login
            }
        });
    });

    // Efeito de rotação em loop no botão de entrar
    gsap.to(enterButton, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "none"
    });
});

// Efeito de rolagem suave quando o usuário clica em um link de navegação
const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 800, // Ajuste a velocidade da rolagem
    speedAsDuration: true
});
