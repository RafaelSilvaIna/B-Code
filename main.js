
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


