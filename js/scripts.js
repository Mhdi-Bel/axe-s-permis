// icônes Lucide
lucide.createIcons();

// Initialisation EmailJS
(function() {
    // REMPLACEZ 'VOTRE_PUBLIC_KEY' PAR VOTRE VRAIE CLÉ (ex: "user_Mz7...")
    emailjs.init("");
})();

// menu hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

function handleMotifChange() {
            const motif = document.querySelector('input[name="motif"]:checked').value;
            const dynamicContent = document.getElementById('dynamicContent');
            const secPre = document.getElementById('section-preinscription');
            const secDevis = document.getElementById('section-devis');
            const secRens = document.getElementById('section-renseignement');

            dynamicContent.classList.remove('hidden');
            secPre.classList.add('hidden');
            secDevis.classList.add('hidden');
            secRens.classList.add('hidden');

            if (motif === 'preinscription') {
                secPre.classList.remove('hidden');
            } else if (motif === 'devis') {
                secDevis.classList.remove('hidden');
            } else if (motif === 'renseignement') {
                secRens.classList.remove('hidden');
            }
        }

        function handlePermisChange() {
            const type = document.getElementById('permisType').value;
            
            // Hide all specifics
            document.getElementById('spec-permis-b').classList.add('hidden');
            document.getElementById('spec-permis-a').classList.add('hidden');
            document.getElementById('spec-passerelle-a2-a').classList.add('hidden');
            document.getElementById('spec-permis-125').classList.add('hidden');

            // Show selected
            if (type === 'permis-b') document.getElementById('spec-permis-b').classList.remove('hidden');
            if (type === 'permis-a') document.getElementById('spec-permis-a').classList.remove('hidden');
            if (type === 'passerelle-a2-a') document.getElementById('spec-passerelle-a2-a').classList.remove('hidden');
            if (type === 'permis-125') document.getElementById('spec-permis-125').classList.remove('hidden');
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

        // Gestion de l'envoi des formulaires via EmailJS
        function setupForm(formId, serviceId, templateId) {
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

                // Envoi via EmailJS
                // sendForm prend : serviceID, templateID, l'élément form HTML
                emailjs.sendForm(serviceId, templateId, form)
                    .then(() => {
                        alert('Votre message a bien été envoyé ! Nous vous répondrons rapidement.');
                        form.reset();
                        
                        // Réinitialiser l'affichage conditionnel si nécessaire
                        if (typeof handleMotifChange === 'function' && formId === 'inscriptionForm') {
                            // Remettre sur préinscription par défaut ou juste rafraichir l'affichage
                            const motifInputs = document.querySelectorAll('input[name="motif"]');
                            if(motifInputs.length > 0) motifInputs[0].checked = true;
                            handleMotifChange();
                        }
                    })
                    .catch((error) => {
                        console.error('Erreur EmailJS:', error);
                        alert("Une erreur est survenue lors de l'envoi. Vérifiez votre connexion ou réessayez plus tard.");
                    })
                    .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                });
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            // REMPLACEZ LES ID CI-DESSOUS PAR CEUX DE VOTRE COMPTE EMAILJS
            const SERVICE_ID = "service_kxm41a2"; // ex: "service_gmail"
            const TEMPLATE_CONTACT = "template_13zak2q"; // ex: "template_contact"
            const TEMPLATE_INSCRIPTION = "template_i70oryr"; // ex: "template_inscription"

            setupForm('contactForm', SERVICE_ID, TEMPLATE_CONTACT);
            setupForm('inscriptionForm', SERVICE_ID, TEMPLATE_INSCRIPTION);
        });