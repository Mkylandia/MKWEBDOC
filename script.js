document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Theme Toggle (Dark/Light Mode) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Funktion zum Setzen des Themes
    const setTheme = (theme) => {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark-mode' ? '☀️' : '🌙'; // Icon anpassen
        themeToggle.setAttribute('aria-label', theme === 'dark-mode' ? 'Light Mode umschalten' : 'Dark Mode umschalten');
    };

    // Theme aus LocalStorage laden oder Standard setzen
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        setTheme(currentTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Systempräferenz für Dark Mode berücksichtigen
        setTheme('dark-mode');
    } else {
        setTheme('light-mode'); // Standardmäßig Light Mode
    }

    // Event Listener für den Toggle-Button
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            setTheme('light-mode');
        } else {
            setTheme('dark-mode');
        }
    });

    // --- 2. Mobile Menü Toggle ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
        mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Menü schließen, wenn ein Link geklickt wird (auf Mobilgeräten)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', false);
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // --- 3. Content Routing / Sektionen anzeigen ---
    const contentSections = document.querySelectorAll('#content section');

    const showSection = (id) => {
        contentSections.forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });
        const targetSection = document.getElementById(id + '-section');
        if (targetSection) {
            targetSection.classList.add('active-section');
            targetSection.classList.remove('hidden-section');
            // Optional: Scrollen zum Anfang der Sektion
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Event Listener für Navigationslinks
    document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').substring(1); // # entfernen
            showSection(targetId);
        });
    });

    // Initialen Inhalt laden basierend auf URL-Hash oder Standard
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        showSection(initialHash);
    } else {
        showSection('home');
    }

    // --- 4. Tab Management System ---
    const setupTabs = (containerSelector) => {
        const tabContainers = document.querySelectorAll(containerSelector);

        tabContainers.forEach(container => {
            const tabButtons = container.querySelectorAll('.tab-button');
            const tabPanes = container.querySelectorAll('.tab-pane');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Buttons deaktivieren
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    // Panes verstecken
                    tabPanes.forEach(pane => pane.classList.remove('active'));

                    // Aktuellen Button aktivieren
                    button.classList.add('active');
                    // Zugehörigen Pane anzeigen
                    const targetTabId = button.dataset.tab;
                    document.getElementById(targetTabId).classList.add('active');
                });
            });

            // Initial den ersten Tab aktivieren, falls vorhanden
            if (tabButtons.length > 0) {
                tabButtons[0].click();
            }
        });
    };

    setupTabs('.tabs'); // Für alle Elemente mit der Klasse 'tabs'

    // --- 5. Cookie Consent Bar ---
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const rejectCookiesBtn = document.getElementById('reject-cookies');

    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
        cookieConsent.classList.remove('hidden');
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.classList.add('hidden');
        // Hier könnten Sie Google Analytics oder andere Tracking-Skripte initialisieren
        console.log('Cookies akzeptiert!');
    });

    rejectCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        cookieConsent.classList.add('hidden');
        console.log('Cookies abgelehnt. Tracking-Skripte werden nicht geladen.');
    });

    // --- 6. KI Chat Widget ---
    const aiToggle = document.getElementById('ai-toggle');
    const aiChatBox = document.getElementById('ai-chat-box');
    const aiMessages = document.getElementById('ai-messages');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');

    aiToggle.addEventListener('click', () => {
        aiChatBox.classList.toggle('hidden');
        aiToggle.setAttribute('aria-expanded', !aiChatBox.classList.contains('hidden'));
    });

    aiSend.addEventListener('click', sendMessage);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = aiInput.value.trim();
        if (userMessage === '') return;

        appendMessage('user', userMessage);
        aiInput.value = '';

        // Simulierte KI-Antwort (hier würde die Integration einer echten KI-API erfolgen)
        setTimeout(() => {
            const aiResponse = getAiResponse(userMessage);
            appendMessage('ai', aiResponse);
            aiMessages.scrollTop = aiMessages.scrollHeight; // Zum neuesten Nachricht scrollen
        }, 800);
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        aiMessages.appendChild(messageDiv);
    }

    // Einfache regelbasierte KI-Antworten
    function getAiResponse(query) {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('hallo') || lowerQuery.includes('hi')) {
            return 'Hallo! Wie kann ich Ihnen heute bei der Projektdokumentation helfen?';
        } else if (lowerQuery.includes('features')) {
            return 'Unsere Kernfeatures umfassen KI-Integration, responsives Design und ein umfassendes Gaming Center. Möchten Sie mehr über eines davon erfahren?';
        } else if (lowerQuery.includes('ki') || lowerQuery.includes('künstliche intelligenz')) {
            return 'Unsere KI bietet einen intelligenten Assistenten, verbesserte Suchfunktionen und automatisierte Inhaltsvorschläge.';
        } else if (lowerQuery.includes('gaming center')) {
            return 'Das Gaming Center enthält Dokumentationen zu Spielmechaniken, interaktive Tutorials und Performance-Metriken. Schauen Sie sich die entsprechenden Tabs an!';
        } else if (lowerQuery.includes('entwicklung') || lowerQuery.includes('roadmap')) {
            return 'Unser Entwicklungsplan ist in vier Phasen über 7 Tage aufgeteilt, beginnend mit der Grundstruktur bis zur Finalisierung.';
        } else if (lowerQuery.includes('wetter')) {
            return 'Wir haben eine Wetter-API integriert, um standortbasierte Wetterinformationen anzuzeigen. Versuchen Sie es auf der Startseite!';
        } else if (lowerQuery.includes('danke') || lowerQuery.includes('vielen dank')) {
            return 'Gern geschehen! Haben Sie weitere Fragen?';
        } else if (lowerQuery.includes('hilfe') || lowerQuery.includes('problem')) {
            return 'Ich bin hier, um zu helfen. Bitte beschreiben Sie Ihr Problem genauer.';
        } else if (lowerQuery.includes('kontakt')) {
            return 'Sie können uns unter info@projektxyz.com erreichen.';
        }
        return 'Ich verstehe Ihre Frage nicht ganz. Können Sie sie anders formulieren oder ein Stichwort verwenden?';
    }

    // --- 7. Wetter-API Integration ---
    const weatherInfoDiv = document.getElementById('weather-info');
    // Ersetzen Sie 'YOUR_OPENWEATHERMAP_API_KEY' durch Ihren tatsächlichen API-Schlüssel
    const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

    if (weatherInfoDiv && OPENWEATHER_API_KEY !== 'YOUR_OPENWEATHERMAP_API_KEY') {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(lat, lon);
            }, error => {
                console.warn("Geolocation Error:", error.message);
                weatherInfoDiv.innerHTML = '<p>Ortungsdienst blockiert oder nicht verfügbar. Wetterdaten konnten nicht geladen werden.</p>';
            }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
        } else {
            weatherInfoDiv.innerHTML = '<p>Geolocation wird von Ihrem Browser nicht unterstützt.</p>';
        }
    } else if (weatherInfoDiv) {
        weatherInfoDiv.innerHTML = '<p>Wetter-API-Schlüssel nicht konfiguriert. Bitte setzen Sie Ihren OpenWeatherMap API-Schlüssel in script.js.</p>';
    }

    async function fetchWeatherData(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=de`);
            if (!response.ok) {
                // Wenn der API-Key ungültig ist, wird hier ein 401 Fehler auftreten
                if (response.status === 401) {
                    throw new Error("Ungültiger OpenWeatherMap API-Schlüssel. Bitte überprüfen Sie ihn.");
                }
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }
            const data = await response.json();
            displayWeatherData(data);
        } catch (error) {
            console.error("Fehler beim Laden der Wetterdaten:", error);
            weatherInfoDiv.innerHTML = `<p>Wetterdaten konnten nicht geladen werden. ${error.message}</p>`;
        }
    }

    function displayWeatherData(data) {
        if (data && data.main && data.weather && data.name) {
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherInfoDiv.innerHTML = `
                <h3>Aktuelles Wetter in ${data.name}</h3>
                <div style="display: flex; align-items: center; justify-content: center;">
                    <img src="${iconUrl}" alt="${data.weather[0].description}" width="50" height="50">
                    <p style="margin: 0 0 0 10px;">${data.main.temp}°C, ${data.weather[0].description}</p>
                </div>
                <p>Gefühlte Temperatur: ${data.main.feels_like}°C</p>
                <a href="https://openweathermap.org/city/${data.id}" target="_blank" style="font-size: 0.9em;">Details auf OpenWeatherMap</a>
            `;
        } else {
            weatherInfoDiv.innerHTML = '<p>Fehler beim Abrufen der Wetterdaten.</p>';
        }
    }

});
