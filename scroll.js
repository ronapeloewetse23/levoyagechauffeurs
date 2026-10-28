<!-- AOS Animation & Scroll Indicator Script -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });

        // Dynamic Scroll Indicator Brightness Controller
        window.addEventListener('scroll', () => {
            const scrollIndicator = document.getElementById('scrollIndicator');
            const scrollPosition = window.scrollY;
            
            // As the user scrolls down the first 300 pixels, brighten the arrow up, then fade it out
            if (scrollPosition < 300) {
                // Scales opacity from a dim 0.3 up to a bright 1.0
                let calculatedOpacity = 0.3 + (scrollPosition / 300) * 0.7;
                scrollIndicator.style.opacity = calculatedOpacity > 1 ? 1 : calculatedOpacity;
            } else {
                // Fade out completely once past the hero section
                scrollIndicator.style.opacity = 0;
            }
        });
    </script>
