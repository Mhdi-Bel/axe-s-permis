// icônes Lucide
lucide.createIcons();


// menu hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

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
                    if (checkbox.name === 'botcheck') return; // Ignorer le champ anti-spam
                    formData.set(checkbox.name, checkbox.checked ? "Oui" : "Non");
                });

                const data = Object.fromEntries(formData.entries());
                const json = JSON.stringify(data);

                try {
                    // Envoi vers Web3Forms
                    const response = await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: json
                    });
                    
                    const result = await response.json();

                    if (response.status === 200) {
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
        });