// icônes Lucide
lucide.createIcons();


// menu hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// --- ANIMATIONS & DYNAMISME ---
// Injection des styles CSS pour les animations
const animationStyles = document.createElement("style");
animationStyles.textContent = `
    /* Empêcher le scroll horizontal causé par les animations initiales */
    body { overflow-x: hidden; }
    
    /* Classe de base : état initial invisible */
    .anim-element {
        opacity: 0;
        transition: opacity 0.8s cubic-bezier(0.5, 0, 0, 1), 
                    transform 0.8s cubic-bezier(0.5, 0, 0, 1);
        will-change: opacity, transform;
    }

    /* Variantes d'animation */
    .anim-fade-up { transform: translateY(30px); }
    .anim-slide-left { transform: translateX(-40px); }
    .anim-slide-right { transform: translateX(40px); }
    .anim-scale { transform: scale(0.95); }

    /* État final : visible */
    .anim-element.visible {
        opacity: 1;
        transform: translate(0) scale(1);
    }
`;
document.head.appendChild(animationStyles);

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Jouer l'animation une seule fois
            }
        });
    }, observerOptions);

    // 1. Titres Principaux (H1, H2) - Glissement depuis la gauche
    document.querySelectorAll('h1, h2').forEach(el => {
        el.classList.add('anim-element', 'anim-slide-left');
        observer.observe(el);
    });

    // 2. Grilles (Cartes, Tarifs) - Apparition en cascade (Staggered)
    document.querySelectorAll('.grid').forEach(grid => {
        Array.from(grid.children).forEach((child, index) => {
            // On évite les conflits si déjà animé
            if (!child.classList.contains('anim-element')) {
                child.classList.add('anim-element', 'anim-fade-up');
                // Délai progressif : 0s, 0.15s, 0.30s...
                child.style.transitionDelay = `${(index % 3) * 0.15}s`; 
                observer.observe(child);
            }
        });
    });

    // 3. Sections Flex (Image + Texte) - Diagonale ou latéral
    document.querySelectorAll('.flex-col.lg\\:flex-row > div, .flex-col.md\\:flex-row > div').forEach((el, index) => {
        el.classList.add('anim-element', index === 0 ? 'anim-slide-left' : 'anim-slide-right');
        observer.observe(el);
    });

    // 4. Accordéons & Listes (FAQ, Critères)
    document.querySelectorAll('details, ul:not(.flex) > li').forEach((el, index) => {
        // Exclure navigation et footer
        if (!el.closest('nav') && !el.closest('footer')) {
            el.classList.add('anim-element', 'anim-fade-up');
            observer.observe(el);
        }
    });

    // 5. Boutons d'action (CTA) & Images isolées
    document.querySelectorAll('a[class*="bg-brand-primary"], img:not(.h-16):not(.h-12)').forEach(el => {
         if (!el.closest('nav') && !el.closest('.grid') && !el.classList.contains('anim-element')) {
             el.classList.add('anim-element', 'anim-scale');
             observer.observe(el);
         }
    });
}

function handleMotifChange() {
            const motif = document.querySelector('input[name="motif"]:checked').value;
            
            
            const secPre = document.getElementById('section-preinscription');
            const formDevis = document.getElementById('form-devis');
            const formRens = document.getElementById('form-renseignement');

            secPre.classList.add('hidden');
            formDevis.classList.add('hidden');
            formRens.classList.add('hidden');

            if (motif === 'preinscription') {
                secPre.classList.remove('hidden');
            } else if (motif === 'devis') {
                formDevis.classList.remove('hidden');
            } else if (motif === 'renseignement') {
                formRens.classList.remove('hidden');
            }
        }

function handlePermisChange() {
            const type = document.getElementById('permisType').value;
            
            // IDs of all specific pre-inscription forms
            const preinscriptionForms = [
                'form-preinscription-b',
                'form-preinscription-a',
                'form-preinscription-passerelle-a2-a',
                'form-preinscription-passerelle-bva-b',
                'form-preinscription-permis-am',
                'form-preinscription-125'
            ];

            // Hide all of them first
            preinscriptionForms.forEach(id => {
                const form = document.getElementById(id);
                if (form) {
                    form.classList.add('hidden');
                }
            });

            // Now, show the correct one based on selection
            let formToShowId = '';
            switch (type) {
                case 'permis-b': formToShowId = 'form-preinscription-b'; break;
                case 'permis-a': formToShowId = 'form-preinscription-a'; break;
                case 'passerelle-a2-a': formToShowId = 'form-preinscription-passerelle-a2-a'; break;
                case 'passerelle-bva-b': formToShowId = 'form-preinscription-passerelle-bva-b'; break;
                case 'permis-am': formToShowId = 'form-preinscription-permis-am'; break;
                case 'permis-125': formToShowId = 'form-preinscription-125'; break;
            }

            if (formToShowId) {
                const formToShow = document.getElementById(formToShowId);
                if (formToShow) {
                    formToShow.classList.remove('hidden');
                }
            }
        }

function toggleExamCount() {
            const checkbox = document.getElementById('check-exam-elsewhere');
            const div = document.getElementById('exam-count-div');
            if (checkbox.checked) {
                div.classList.remove('hidden');
            } else {
                div.classList.add('hidden');
            }
        }

function setupForm(formId) {
            const form = document.getElementById(formId);
            if (!form) return;

            form.addEventListener('submit', async (e) => {
                e.preventDefault(); // Empêche le rechargement de la page
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerText;
                
                // Feedback visuel (bouton désactivé)
                submitBtn.disabled = true;
                submitBtn.innerText = 'Envoi en cours...';
                submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

                // Récupération des données
                const formData = new FormData(form);

                // Conversion des checkboxes en Oui/Non
                form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    formData.set(checkbox.name, checkbox.checked ? "Oui" : "Non");
                });

                try {
                    // Envoi vers l'action du formulaire (Formspree)
                    const response = await fetch(form.action, {
                        method: "POST",
                        headers: { "Accept": "application/json" },
                        body: formData
                    });
                    
                    const result = await response.json();

                    if (response.ok) {
                        alert('Votre message a bien été envoyé ! Nous vous répondrons rapidement.');
                        form.reset();
                    } else {
                        console.log(response);
                        throw new Error(result.message || "Une erreur est survenue");
                    }
                    
                    // Si c'est un formulaire de pré-inscription, on réinitialise la vue
                    if (formId.startsWith('form-preinscription-') && typeof handlePermisChange === 'function') {
                        // Réinitialise le menu déroulant
                        document.getElementById('permisType').value = '';
                        // Cache tous les formulaires de pré-inscription
                        handlePermisChange(); 
                    }

                } catch (error) {
                    console.error('Erreur:', error);
                    alert("Une erreur est survenue lors de l'envoi : " + error.message);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                }
            });
        }

document.addEventListener('DOMContentLoaded', () => {
            // Initialisation des 4 formulaires
            setupForm('contactForm');
            setupForm('form-devis');
            setupForm('form-renseignement');

            // Initialisation des formulaires de pré-inscription
            setupForm('form-preinscription-b');
            setupForm('form-preinscription-a');
            setupForm('form-preinscription-passerelle-a2-a');
            setupForm('form-preinscription-passerelle-bva-b');
            setupForm('form-preinscription-permis-am');
            setupForm('form-preinscription-125');
            
            // Lancement des animations
            initScrollAnimations();
        });