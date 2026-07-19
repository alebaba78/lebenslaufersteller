// script.js
const PREDEFINED_COLORS = {
    '#2c3e50': '#ffffff', // Dunkelblau (Default)
    '#34495e': '#ffffff', // Etwas heller
    '#7f8c8d': '#ffffff', // Grau
    '#27ae60': '#ffffff', // Grün
    '#c0392b': '#ffffff', // Rot
    '#8e44ad': '#ffffff', // Lila
};

document.addEventListener('DOMContentLoaded', () => {
    
    // Event Listeners für Live-Vorschau
    document.getElementById('firstname').addEventListener('input', updatePreview);
    document.getElementById('lastname').addEventListener('input', updatePreview);
    document.getElementById('position').addEventListener('input', updatePreview);
    document.getElementById('email').addEventListener('input', updatePreview);
    document.getElementById('phone').addEventListener('input', updatePreview);
    document.getElementById('profile').addEventListener('input', updatePreview);
    document.getElementById('birthdate').addEventListener('input', updatePreview);
    document.getElementById('marital-status').addEventListener('input', updatePreview);
    document.getElementById('nationality').addEventListener('input', updatePreview);
    document.getElementById('driving-license').addEventListener('input', updatePreview);
    document.getElementById('location').addEventListener('input', updatePreview);
    document.getElementById('website').addEventListener('input', updatePreview);
    document.getElementById('photo-upload').addEventListener('change', updatePreview);
    // Event Listeners für die Form-Auswahl des Fotos
    document.getElementById('photo-size').addEventListener('input', updatePreview);
    document.querySelectorAll('input[name="photo-position"]').forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });

    // Event Listeners für die Form-Auswahl des Fotos
    document.querySelectorAll('input[name="photo-shape"]').forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });

    // Event Listeners für "Hinzufügen"-Buttons
    document.getElementById('add-experience-btn').addEventListener('click', addExperience);
    document.getElementById('add-education-btn').addEventListener('click', addEducation);
    document.getElementById('add-skill-btn').addEventListener('click', addSkill);
    document.getElementById('add-language-btn').addEventListener('click', addLanguage);
    document.getElementById('add-weiterbildung-btn').addEventListener('click', addWeiterbildung);
    document.getElementById('save-data-btn').addEventListener('click', saveData);
    document.getElementById('load-data-btn').addEventListener('click', loadData);
    document.getElementById('clear-data-btn').addEventListener('click', clearForm);
    document.getElementById('export-data-btn').addEventListener('click', exportData);
    document.getElementById('import-file-input').addEventListener('change', importData);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    initSortable();

    setupColorPalette();

    // Formular-Absendung
    document.getElementById('cv-form').addEventListener('submit', handleFormSubmit);

    // Versuche, beim Laden der Seite automatisch Daten zu laden.
    // Wenn keine vorhanden sind, fülle mit Testdaten.
    const loaded = loadData();
    if (!loaded) {
        populateFormForTesting();
    }

    window.addEventListener('resize', updatePreviewScaling);

    // Gespeichertes Theme beim Laden anwenden
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }

    // Logic for hiding navbar on scroll down
    let lastScrollY = window.scrollY;
    const nav = document.querySelector('.main-nav');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > nav.offsetHeight) {
            // Scrolling down
            nav.classList.add('nav-hidden');
        } else {
            // Scrolling up
            nav.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    });
});

function openFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    const content = modal.querySelector('.feedback-modal-content');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 10);
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    const content = modal.querySelector('.feedback-modal-content');
    modal.style.opacity = '0';
    content.style.transform = 'scale(0.95)';
    setTimeout(() => {
        modal.style.display = 'none';
        // Reset form for next time
        document.getElementById('feedbackForm').style.display = 'block';
        document.getElementById('feedbackSuccess').style.display = 'none';
    }, 300);
}

document.getElementById('feedbackForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sende...';

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        });
        form.style.display = 'none';
        document.getElementById('feedbackSuccess').style.display = 'block';
    } catch (error) {
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    }
});

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    if (isDark) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.removeItem('theme');
    }
}

function initSortable() {
    const onSortUpdate = () => updatePreview();

    // Event-Delegation für das Verschieben von Einträgen innerhalb einer Sektion
    document.getElementById('cv-form').addEventListener('click', (event) => {
        const button = event.target.closest('.move-entry-btn');
        if (!button) {
            return;
        }

        const direction = button.dataset.direction;
        const entry = button.closest('.dynamic-entry');

        if (direction === 'up' && entry.previousElementSibling) {
            entry.parentNode.insertBefore(entry, entry.previousElementSibling);
        } else if (direction === 'down' && entry.nextElementSibling) {
            entry.parentNode.insertBefore(entry.nextElementSibling, entry);
        }
        updatePreview();
    });

    // SortableJS wird nicht mehr für Einträge verwendet, nur noch die Pfeile.
    // Drag-and-Drop für Einträge ist hiermit entfernt.
    new Sortable(document.getElementById('weiterbildung-fields'), { animation: 150, onEnd: onSortUpdate, ghostClass: 'sortable-ghost' });
    
    // Event-Listener für die neuen "Verschieben"-Buttons
    document.getElementById('cv-form').addEventListener('click', (event) => {
        if (!event.target.closest('.move-section-btn')) {
            return;
        }

        const button = event.target;
        const direction = button.dataset.direction;
        const section = button.closest('section');

        if (direction === 'up' && section.previousElementSibling) {
            section.parentNode.insertBefore(section, section.previousElementSibling);
        } else if (direction === 'down' && section.nextElementSibling) {
            section.parentNode.insertBefore(section.nextElementSibling, section);
        }
        updatePreview();
    });
}

function setupColorPalette() {
    const palette = document.getElementById('color-palette');
    Object.keys(PREDEFINED_COLORS).forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.dataset.color = color;
        swatch.addEventListener('click', () => {
            // Alten Selektor entfernen
            const oldSelected = palette.querySelector('.selected');
            if (oldSelected) {
                oldSelected.classList.remove('selected');
            }
            // Neuen setzen
            swatch.classList.add('selected');
            updatePreview();
        });
        palette.appendChild(swatch);
    });

    // Default-Farbe auswählen
    const defaultSwatch = palette.querySelector(`[data-color="${Object.keys(PREDEFINED_COLORS)[0]}"]`);
    if (defaultSwatch) {
        defaultSwatch.classList.add('selected');
    }
}

function updatePreviewScaling() {
    const previewPanel = document.querySelector('.preview-panel');
    const resumePreview = document.getElementById('resume-preview');
    if (!previewPanel || !resumePreview) return;

    // 80px for padding inside preview-panel
    const availableWidth = previewPanel.clientWidth - 80;
    const a4Width = 794; // 210mm in px at 96dpi is a good approximation

    const scale = availableWidth / a4Width;
    resumePreview.style.setProperty('--preview-scale', scale);
}

function updatePreview() {
    // Persönliche Daten aktualisieren
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    document.getElementById('preview-name').innerText = `${firstname} ${lastname}`.trim() || '[Vorname Nachname]';

    const position = document.getElementById('position').value;
    document.getElementById('preview-position').innerText = position || '[Position]';
    const email = document.getElementById('email').value;
    const emailElement = document.getElementById('preview-email');
    emailElement.querySelector('span').innerText = email || '[E-Mail]';
    emailElement.style.display = email ? 'flex' : 'none';
    const phone = document.getElementById('phone').value;
    const phoneElement = document.getElementById('preview-phone');
    phoneElement.querySelector('span').innerText = phone || '[Telefon]';
    phoneElement.style.display = phone ? 'flex' : 'none';

    const location = document.getElementById('location').value;
    const locationElement = document.getElementById('preview-location');
    locationElement.querySelector('span').innerText = location || '[Wohnort]';
    locationElement.style.display = location ? 'flex' : 'none';

    const website = document.getElementById('website').value;
    const websiteElement = document.getElementById('preview-website');
    websiteElement.querySelector('span').innerText = website || '[Website]';
    websiteElement.style.display = website ? 'flex' : 'none';

    // Neue persönliche Daten
    const birthdate = document.getElementById('birthdate').value;
    const birthdateElement = document.getElementById('preview-birthdate');
    birthdateElement.querySelector('span').innerText = birthdate || '[Geburtsdatum]';

    const maritalStatus = document.getElementById('marital-status').value;
    const maritalStatusElement = document.getElementById('preview-marital-status');
    maritalStatusElement.querySelector('span').innerText = maritalStatus || '[Personenstand]';

    const nationality = document.getElementById('nationality').value;
    const nationalityElement = document.getElementById('preview-nationality');
    nationalityElement.querySelector('span').innerText = nationality || '[Staatsbürgerschaft]';

    const drivingLicense = document.getElementById('driving-license').value;
    const drivingLicenseElement = document.getElementById('preview-driving-license');
    drivingLicenseElement.querySelector('span').innerText = drivingLicense || '[Führerschein]';

    // Sektion "Persönliches" nur anzeigen, wenn Inhalt vorhanden ist
    const personalDetailsSection = document.getElementById('preview-personal-details-section');
    personalDetailsSection.style.display = (birthdate || maritalStatus || nationality || drivingLicense) ? 'block' : 'none';

    // Reihenfolge der Vorschau-Sektionen aktualisieren
    const rightOrder = [...document.getElementById('sortable-sections-right').children].map(section => section.dataset.sectionId);
    const leftOrder = [...document.getElementById('sortable-sections-left').children].map(section => section.dataset.sectionId);

    const previewRightContainer = document.getElementById('sortable-preview-right');
    const previewLeftContainer = document.getElementById('sortable-preview-left');

    rightOrder.forEach(sectionId => {
        const previewSectionRight = previewRightContainer.querySelector(`[data-section-id="${sectionId}"]`);
        if (previewSectionRight) previewRightContainer.appendChild(previewSectionRight);
    });

    leftOrder.forEach(sectionId => {
        const previewSectionLeft = previewLeftContainer.querySelector(`[data-section-id="${sectionId}"]`);
        if (previewSectionLeft) previewLeftContainer.appendChild(previewSectionLeft);
    });

    // Farbe aktualisieren
    const selectedColorSwatch = document.querySelector('#color-palette .selected');
    const primaryColor = selectedColorSwatch ? selectedColorSwatch.dataset.color : Object.keys(PREDEFINED_COLORS)[0];
    const textColor = selectedColorSwatch ? PREDEFINED_COLORS[selectedColorSwatch.dataset.color] : '#ffffff';
    const previewElement = document.getElementById('resume-preview');
    previewElement.style.setProperty('--primary-color', primaryColor);
    previewElement.style.setProperty('--primary-color-text', textColor);
    
    // Hilfsfunktion für Auto-Save
    const triggerAutoSave = () => {
        if (document.getElementById('autosave-toggle').checked) {
            saveData(false); // Speichern ohne Benachrichtigung
        }
    };
    
    // Foto aktualisieren
    const photoInput = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('preview-photo');
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoPreview.src = e.target.result;
            photoPreview.style.display = 'block';
            triggerAutoSave(); // Auto-Save NACHDEM das Bild geladen wurde.
        }
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        triggerAutoSave(); // Auto-Save für alle anderen Änderungen auslösen.
    }

    // Wenn ein Foto da ist, die Form, Größe und Position aktualisieren
    if (photoPreview.style.display === 'block') {
        const selectedShape = document.querySelector('input[name="photo-shape"]:checked').value;
        photoPreview.className = `photo-${selectedShape}`;

        const photoSize = document.getElementById('photo-size').value;
        document.getElementById('photo-size-value').innerText = photoSize; // Zeigt den Wert an
        photoPreview.style.width = `${photoSize}px`;
        photoPreview.style.height = `${photoSize}px`;

        // Die Positionierungslogik ist für das neue Layout nicht mehr relevant/nötig.
    }

    // Profil aktualisieren
    const profile = document.getElementById('profile').value;
    const profileSection = document.getElementById('preview-profile-section');
    if (profile) {
        document.getElementById('preview-profile').innerText = profile;
        profileSection.style.display = 'block';
    } else {
        profileSection.style.display = 'none';
    }

    // Berufserfahrung aktualisieren
    updateDynamicSection('.experience-entry', '#preview-experience-list', '#preview-experience-section', (entry) => {
        const position = entry.querySelector('.experience-position').value;
        const company = entry.querySelector('.experience-company').value;
        const period = entry.querySelector('.experience-period').value;
        const description = entry.querySelector('.experience-description').value;
        const descriptionItems = description.split('\n').filter(line => line.trim() !== '').map(line => `<li>${line}</li>`).join('');

        return position || company || period ? `
            <div class="preview-entry-header"><h3>${position || 'Position'}</h3><span class="period">${period || 'Zeitraum'}</span></div>
            <p class="company">${company || 'Arbeitgeber'}</p>
            <ul>${descriptionItems}</ul>
        ` : null;
    });

    // Ausbildung aktualisieren
    updateDynamicSection('.education-entry', '#preview-education-list', '#preview-education-section', (entry) => {
        const degree = entry.querySelector('.education-degree').value;
        const school = entry.querySelector('.education-school').value;
        const period = entry.querySelector('.education-period').value;
        return degree || school || period ? `
            <div class="preview-entry-header"><h3>${degree || 'Abschluss'}</h3><span class="period">${period || 'Zeitraum'}</span></div>
            <p class="company">${school || 'Bildungseinrichtung'}</p>
        ` : null;
    });

    // Weiterbildung aktualisieren
    updateDynamicSection('.weiterbildung-entry', '#preview-weiterbildung-list', '#preview-weiterbildung-section', (entry) => {
        const title = entry.querySelector('.weiterbildung-title').value;
        const institution = entry.querySelector('.weiterbildung-institution').value;
        const period = entry.querySelector('.weiterbildung-period').value;
        return title || institution || period ? `
            <div class="preview-entry-header"><h3>${title || 'Titel'}</h3><span class="period">${period || 'Zeitraum'}</span></div>
            <p class="company">${institution || 'Institution'}</p>
        ` : null;
    });

    // Fähigkeiten aktualisieren
    updateDynamicSection('.skill-entry', '#preview-skill-list', '#preview-skill-section', (entry) => {
        const skill = entry.querySelector('.skill-name').value;
        return skill ? `<li>${skill}</li>` : null;
    }, 'ul');

    // Sprachkenntnisse aktualisieren
    updateDynamicSection('.language-entry', '#preview-language-list', '#preview-language-section', (entry) => {
        const language = entry.querySelector('.language-name').value;
        return language ? `<li>${language}</li>` : null;
    }, 'ul');

    // Skalierung der Vorschau initial setzen/aktualisieren
    updatePreviewScaling();
}

function updateDynamicSection(entryClass, previewListId, previewSectionId, templateFn, listType = 'div') {
    const fieldEntries = document.querySelectorAll(entryClass);
    const previewList = document.querySelector(previewListId);
    const previewSection = document.querySelector(previewSectionId);
    previewList.innerHTML = '';

    let hasContent = false;
    fieldEntries.forEach(entry => {
        const content = templateFn(entry);
        if (content) {
            hasContent = true;
            if (listType === 'ul') {
                previewList.innerHTML += content;
            } else {
                const previewEntry = document.createElement('div');
                previewEntry.className = 'preview-entry';
                previewEntry.innerHTML = content;
                previewList.appendChild(previewEntry);
            }
        }
    });

    previewSection.style.display = hasContent ? 'block' : 'none';
}

function addExperience() {
    const container = document.getElementById('experience-fields');
    const newEntry = document.createElement('div');
    newEntry.className = 'dynamic-entry experience-entry';
    newEntry.innerHTML = `
        <button type="button" class="delete-entry-btn" title="Eintrag löschen"><i class="fa-solid fa-trash"></i></button>
        <div class="entry-controls">
            <button type="button" class="move-entry-btn" data-direction="up" title="Nach oben">▲</button>
            <button type="button" class="move-entry-btn" data-direction="down" title="Nach unten">▼</button>
        </div>
        <input type="text" class="experience-position" placeholder="Position" required>
        <input type="text" class="experience-company" placeholder="Arbeitgeber" required>
        <input type="text" class="experience-period" placeholder="Zeitraum (z.B. 2020 - 2022)" required>
        <textarea class="experience-description" placeholder="Beschreibung Ihrer Aufgaben und Erfolge" rows="3"></textarea>
    `;
    addDynamicEntryListeners(newEntry);
    container.appendChild(newEntry);
    updatePreview();
}

function addEducation() {
    const container = document.getElementById('education-fields');
    const newEntry = document.createElement('div');
    newEntry.className = 'dynamic-entry education-entry';
    newEntry.innerHTML = `
        <button type="button" class="delete-entry-btn" title="Eintrag löschen"><i class="fa-solid fa-trash"></i></button>
        <div class="entry-controls">
            <button type="button" class="move-entry-btn" data-direction="up" title="Nach oben">▲</button>
            <button type="button" class="move-entry-btn" data-direction="down" title="Nach unten">▼</button>
        </div>
        <input type="text" class="education-degree" placeholder="Abschluss (z.B. Bachelor of Science)" required>
        <input type="text" class="education-school" placeholder="Universität/Schule" required>
        <input type="text" class="education-period" placeholder="Zeitraum (z.B. 2016 - 2020)" required>
    `;
    addDynamicEntryListeners(newEntry);
    container.appendChild(newEntry);
    updatePreview();
}

function addWeiterbildung() {
    const container = document.getElementById('weiterbildung-fields');
    const newEntry = document.createElement('div');
    newEntry.className = 'dynamic-entry weiterbildung-entry';
    newEntry.innerHTML = `
        <button type="button" class="delete-entry-btn" title="Eintrag löschen"><i class="fa-solid fa-trash"></i></button>
        <div class="entry-controls">
            <button type="button" class="move-entry-btn" data-direction="up" title="Nach oben">▲</button>
            <button type="button" class="move-entry-btn" data-direction="down" title="Nach unten">▼</button>
        </div>
        <input type="text" class="weiterbildung-title" placeholder="Titel der Weiterbildung / Zertifikat" required>
        <input type="text" class="weiterbildung-institution" placeholder="Institution" required>
        <input type="text" class="weiterbildung-period" placeholder="Jahr oder Zeitraum" required>
    `;
    addDynamicEntryListeners(newEntry);
    container.appendChild(newEntry);
    updatePreview();
}

function addSkill() {
    const container = document.getElementById('skill-fields');
    const newEntry = document.createElement('div');
    newEntry.className = 'dynamic-entry skill-entry';
    newEntry.innerHTML = `
        <button type="button" class="delete-entry-btn" title="Eintrag löschen"><i class="fa-solid fa-trash"></i></button>
        <div class="entry-controls">
            <button type="button" class="move-entry-btn" data-direction="up" title="Nach oben">▲</button>
            <button type="button" class="move-entry-btn" data-direction="down" title="Nach unten">▼</button>
        </div>
        <input type="text" class="skill-name" placeholder="Fähigkeit (z.B. JavaScript)" required>
    `;
    addDynamicEntryListeners(newEntry);
    container.appendChild(newEntry);
    updatePreview();
}

function addLanguage() {
    const container = document.getElementById('language-fields');
    const newEntry = document.createElement('div');
    newEntry.className = 'dynamic-entry language-entry';
    newEntry.innerHTML = `
        <button type="button" class="delete-entry-btn" title="Eintrag löschen"><i class="fa-solid fa-trash"></i></button>
        <div class="entry-controls">
            <button type="button" class="move-entry-btn" data-direction="up" title="Nach oben">▲</button>
            <button type="button" class="move-entry-btn" data-direction="down" title="Nach unten">▼</button>
        </div>
        <input type="text" class="language-name" placeholder="Sprache (z.B. Deutsch - Muttersprache)" required>
    `;
    addDynamicEntryListeners(newEntry);
    container.appendChild(newEntry);
    updatePreview();
}

function addDynamicEntryListeners(element) {
    element.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    element.querySelector('.delete-entry-btn').addEventListener('click', () => {
        element.remove();
        updatePreview();
    });
}

/**
 * Sammelt alle Daten aus dem Formular in einem Objekt.
 */
function collectAllData() {
    const data = {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        position: document.getElementById('position').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        website: document.getElementById('website').value,
        birthdate: document.getElementById('birthdate').value,
        maritalStatus: document.getElementById('marital-status').value,
        nationality: document.getElementById('nationality').value,
        drivingLicense: document.getElementById('driving-license').value,
        profile: document.getElementById('profile').value,
        photoShape: document.querySelector('input[name="photo-shape"]:checked').value,
        sectionOrderRight: [...document.getElementById('sortable-sections-right').children].map(s => s.dataset.sectionId),
        sectionOrderLeft: [...document.getElementById('sortable-sections-left').children].map(s => s.dataset.sectionId),
        photoDataUrl: document.getElementById('preview-photo').src,
        autoSave: document.getElementById('autosave-toggle').checked,
        primaryColor: document.querySelector('#color-palette .selected')?.dataset.color,
        photoSize: document.getElementById('photo-size').value,
        experience: Array.from(document.querySelectorAll('.experience-entry')).map(e => ({
            position: e.querySelector('.experience-position').value,
            company: e.querySelector('.experience-company').value,
            period: e.querySelector('.experience-period').value,
            description: e.querySelector('.experience-description').value
        })),
        education: Array.from(document.querySelectorAll('.education-entry')).map(e => ({
            degree: e.querySelector('.education-degree').value,
            school: e.querySelector('.education-school').value,
            period: e.querySelector('.education-period').value
        })),
        weiterbildung: Array.from(document.querySelectorAll('.weiterbildung-entry')).map(e => ({
            title: e.querySelector('.weiterbildung-title').value,
            institution: e.querySelector('.weiterbildung-institution').value,
            period: e.querySelector('.weiterbildung-period').value
        })),
        weiterbildung: Array.from(document.querySelectorAll('.weiterbildung-entry')).map(e => ({
            title: e.querySelector('.weiterbildung-title').value,
            institution: e.querySelector('.weiterbildung-institution').value,
            period: e.querySelector('.weiterbildung-period').value
        })),
        skills: Array.from(document.querySelectorAll('.skill-entry')).map(e => e.querySelector('.skill-name').value),
        languages: Array.from(document.querySelectorAll('.language-entry')).map(e => e.querySelector('.language-name').value)
    };
    return data;
}

/**
 * Speichert die Formulardaten im Local Storage.
 */
function saveData(showNotification = true) {
    const data = collectAllData();
    localStorage.setItem('cvData', JSON.stringify(data));
    if (showNotification) {
        alert('Daten wurden erfolgreich im Browser gespeichert!');
    }
}

/**
 * Füllt das Formular basierend auf einem Datenobjekt.
 * @param {object} data - Das Datenobjekt zum Füllen des Formulars.
 */
function populateForm(data) {
    clearForm(false); // Formular leeren, ohne Bestätigung

    // Statische Felder füllen
    document.getElementById('firstname').value = data.firstname || '';
    document.getElementById('lastname').value = data.lastname || '';
    document.getElementById('position').value = data.position || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('location').value = data.location || '';
    document.getElementById('website').value = data.website || '';
    document.getElementById('birthdate').value = data.birthdate || '';
    document.getElementById('marital-status').value = data.maritalStatus || '';
    document.getElementById('nationality').value = data.nationality || '';
    document.getElementById('driving-license').value = data.drivingLicense || '';
    document.getElementById('profile').value = data.profile || '';
    document.getElementById('autosave-toggle').checked = data.autoSave || false;

    // Reihenfolge der Sektionen wiederherstellen
    if (data.sectionOrderRight) {
        const container = document.getElementById('sortable-sections-right');
        const sections = [...container.children];
        data.sectionOrderRight.forEach(sectionId => {
            const section = sections.find(s => s.dataset.sectionId === sectionId);
            if (section) container.appendChild(section);
        });
    }

    if (data.sectionOrderLeft) {
        const container = document.getElementById('sortable-sections-left');
        const sections = [...container.children];
        data.sectionOrderLeft.forEach(sectionId => {
            const section = sections.find(s => s.dataset.sectionId === sectionId);
            if (section) container.appendChild(section);
        });
    }

    // Foto wiederherstellen
    if (data.photoDataUrl && data.photoDataUrl.startsWith('data:image')) {
        const photoPreview = document.getElementById('preview-photo');
        photoPreview.src = data.photoDataUrl;
        photoPreview.style.display = 'block';
    }
    document.querySelector(`input[name="photo-shape"][value="${data.photoShape || 'circle'}"]`).checked = true;

    // Farbe wiederherstellen
    const color = data.primaryColor || Object.keys(PREDEFINED_COLORS)[0];
    const currentSelected = document.querySelector('#color-palette .selected');
    if (currentSelected) currentSelected.classList.remove('selected');
    const newSelected = document.querySelector(`#color-palette [data-color="${color}"]`);
    if (newSelected) newSelected.classList.add('selected');

    document.getElementById('photo-size').value = data.photoSize || '120';

    // Dynamische Felder füllen
    (data.experience || []).forEach(exp => {
        addExperience();
        const lastEntry = document.querySelector('.experience-entry:last-child');
        lastEntry.querySelector('.experience-position').value = exp.position;
        lastEntry.querySelector('.experience-company').value = exp.company;
        lastEntry.querySelector('.experience-period').value = exp.period;
        lastEntry.querySelector('.experience-description').value = exp.description;
    });

    (data.education || []).forEach(edu => {
        addEducation();
        const lastEntry = document.querySelector('.education-entry:last-child');
        lastEntry.querySelector('.education-degree').value = edu.degree;
        lastEntry.querySelector('.education-school').value = edu.school;
        lastEntry.querySelector('.education-period').value = edu.period;
    });

    (data.weiterbildung || []).forEach(wb => {
        addWeiterbildung();
        const lastEntry = document.querySelector('.weiterbildung-entry:last-child');
        lastEntry.querySelector('.weiterbildung-title').value = wb.title;
        lastEntry.querySelector('.weiterbildung-institution').value = wb.institution;
        lastEntry.querySelector('.weiterbildung-period').value = wb.period;
    });

    (data.skills || []).forEach(skill => {
        addSkill();
        document.querySelector('.skill-entry:last-child .skill-name').value = skill;
    });

    (data.languages || []).forEach(language => {
        addLanguage();
        document.querySelector('.language-entry:last-child .language-name').value = language;
    });

    updatePreview();
}

/**
 * Lädt die Formulardaten aus dem Local Storage.
 * @returns {boolean} - Gibt true zurück, wenn Daten geladen wurden, sonst false.
 */
function loadData() {
    const dataString = localStorage.getItem('cvData');
    if (!dataString) {
        return false;
    }
    const data = JSON.parse(dataString);
    populateForm(data);
    return true;
}

/**
 * Exportiert die aktuellen Formulardaten als JSON-Datei.
 */
function exportData() {
    const data = collectAllData();
    const dataString = JSON.stringify(data, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lebenslauf-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Importiert Formulardaten aus einer ausgewählten JSON-Datei.
 * @param {Event} event - Das 'change' Event vom Datei-Input.
 */
function importData(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            populateForm(data);
            alert('Daten erfolgreich importiert!');
        } catch (error) {
            alert('Fehler beim Lesen der Datei. Bitte stellen Sie sicher, dass es eine gültige Export-Datei ist.');
            console.error("Import-Fehler:", error);
        }
    };
    reader.readAsText(file);

    // Das Input-Feld zurücksetzen, damit dieselbe Datei erneut ausgewählt werden kann
    event.target.value = '';
}

/**
 * Leert das gesamte Formular.
 */
function clearForm(confirmClear = true) {
    if (confirmClear && !confirm('Möchten Sie wirklich alle Eingaben löschen?')) {
        return;
    }
    document.getElementById('cv-form').reset();
    document.querySelectorAll('.dynamic-entry').forEach(entry => entry.remove());
    // Bild-Vorschau zurücksetzen
    const photoPreview = document.getElementById('preview-photo');
    photoPreview.src = '';
    photoPreview.style.display = 'none';
    updatePreview();
}

async function handleFormSubmit(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    // Hilfsfunktion, um das Bild als Data-URL zu lesen (asynchron)
    const getPhotoDataUrl = () => {
        return new Promise((resolve) => {
            const photoInput = document.getElementById('photo-upload');
            if (photoInput.files && photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => resolve(null); // Bei Fehler null zurückgeben
                reader.readAsDataURL(photoInput.files[0]);
            } else {
                resolve(null); // Kein Bild ausgewählt
            }
        });
    };

    const photoDataUrl = await getPhotoDataUrl();

    const cvData = collectAllData();    
    // Wenn ein neues Bild hochgeladen wurde, überschreibt es das gespeicherte.
    // Ansonsten wird das aus dem LocalStorage (bereits im Preview-Image) verwendet.
    if (photoDataUrl) {
        cvData.photoDataUrl = photoDataUrl;
    } else if (!cvData.photoDataUrl || !cvData.photoDataUrl.startsWith('data:image')) {
        cvData.photoDataUrl = null;
    }

    // Daten an das Backend senden
    const response = await fetch('/generate-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvData),
    });

    if (response.ok) {
        // Die Antwort ist ein PDF, das wir als Blob (Binary Large Object) erhalten
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "lebenslauf.pdf"; // Dateiname für den Download
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        alert("Fehler bei der PDF-Erstellung.");
    }
}

/**
 * Füllt das Formular mit Testdaten für eine schnellere Entwicklung.
 */
function populateFormForTesting() {
    const devData = {
        firstname: 'Maria',
        lastname: 'Musterfrau',
        position: 'Senior Frontend-Entwicklerin',
        email: 'maria.musterfrau@email.com',
        phone: '0123 4567890',
        location: 'Berlin, Deutschland',
        website: 'linkedin.com/in/mariamusterfrau',
        birthdate: '01.05.1990',
        maritalStatus: 'Ledig',
        nationality: 'Deutsch',
        drivingLicense: 'Klasse B',
        profile: 'Engagierte Frontend-Entwicklerin mit über 8 Jahren Erfahrung in der Erstellung moderner und benutzerfreundlicher Webanwendungen. Spezialisiert auf React, Vue.js und die Optimierung der Performance.',
        sectionOrderRight: ['profile', 'experience', 'education', 'weiterbildung'],
        sectionOrderLeft: ['personal', 'contact', 'skills', 'languages'],
        primaryColor: '#2c3e50',
        experience: [
            {
                position: 'Senior Frontend-Entwicklerin',
                company: 'Tech Solutions GmbH',
                period: '2020 - Heute',
                description: 'Leitung der Entwicklung des neuen Kundenportals. Implementierung eines Design-Systems zur Vereinheitlichung der UI-Komponenten.'
            },
            {
                position: 'Frontend-Entwicklerin',
                company: 'Web Innovators AG',
                period: '2017 - 2020',
                description: 'Entwicklung und Wartung von E-Commerce-Plattformen für verschiedene Kunden. Optimierung der Ladezeiten und Verbesserung der SEO-Rankings.'
            }
        ],
        education: [
            {
                degree: 'Master of Science in Informatik',
                school: 'Technische Universität München',
                period: '2015 - 2017'
            }
        ],
        weiterbildung: [
            {
                title: 'Certified JavaScript Developer',
                institution: 'Online-Akademie',
                period: '2021'
            }
        ],
        skills: ['JavaScript (ES6+)', 'React & Redux', 'Vue.js & Vuex', 'TypeScript', 'Node.js'],
        languages: ['Deutsch (Muttersprache)', 'Englisch (Fließend)', 'Spanisch (Grundkenntnisse)']
    };

    // Statische Felder füllen
    document.getElementById('firstname').value = devData.firstname;
    document.getElementById('lastname').value = devData.lastname;
    document.getElementById('position').value = devData.position;
    document.getElementById('email').value = devData.email;
    document.getElementById('phone').value = devData.phone;
    document.getElementById('location').value = devData.location;
    document.getElementById('website').value = devData.website;
    document.getElementById('birthdate').value = devData.birthdate;
    document.getElementById('marital-status').value = devData.maritalStatus;
    document.getElementById('nationality').value = devData.nationality;
    document.getElementById('driving-license').value = devData.drivingLicense;
    document.getElementById('profile').value = devData.profile;
    
    const swatch = document.querySelector(`#color-palette [data-color="${devData.primaryColor}"]`);
    if (swatch) {
        swatch.click();
    }

    // Dynamische Felder füllen
    devData.experience.forEach(exp => {
        addExperience();
        const lastEntry = document.querySelector('.experience-entry:last-child');
        lastEntry.querySelector('.experience-position').value = exp.position;
        lastEntry.querySelector('.experience-company').value = exp.company;
        lastEntry.querySelector('.experience-period').value = exp.period;
        lastEntry.querySelector('.experience-description').value = exp.description;
    });

    devData.education.forEach(edu => {
        addEducation();
        const lastEntry = document.querySelector('.education-entry:last-child');
        lastEntry.querySelector('.education-degree').value = edu.degree;
        lastEntry.querySelector('.education-school').value = edu.school;
        lastEntry.querySelector('.education-period').value = edu.period;
    });

    devData.weiterbildung.forEach(wb => {
        addWeiterbildung();
        const lastEntry = document.querySelector('.weiterbildung-entry:last-child');
        lastEntry.querySelector('.weiterbildung-title').value = wb.title;
        lastEntry.querySelector('.weiterbildung-institution').value = wb.institution;
        lastEntry.querySelector('.weiterbildung-period').value = wb.period;
    });

    devData.skills.forEach(skill => {
        addSkill();
        document.querySelector('.skill-entry:last-child .skill-name').value = skill;
    });
    
    devData.languages.forEach(language => {
        addLanguage();
        document.querySelector('.language-entry:last-child .language-name').value = language;
    });


    // Vorschau mit den neuen Daten aktualisieren
    updatePreview();
}
