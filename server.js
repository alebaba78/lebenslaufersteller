const express = require('express');
const path = require('path');

const PREDEFINED_COLORS = {
    '#2c3e50': '#ffffff', // Dunkelblau (Default)
    '#34495e': '#ffffff', // Etwas heller
    '#7f8c8d': '#ffffff', // Grau
    '#27ae60': '#ffffff', // Grün
    '#c0392b': '#ffffff', // Rot
    '#8e44ad': '#ffffff', // Lila
};

const app = express();
const port = 3000;

// Middleware, um JSON-Daten zu verarbeiten und statische Dateien (HTML, CSS) bereitzustellen
// Erhöhe das Limit für JSON-Payloads, um große Bilder (als Data-URL) zu ermöglichen
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'))); // Annahme: Dein HTML/CSS/JS liegt im Ordner "public"

// Hilfsfunktion zum Escapen von HTML, um Cross-Site-Scripting (XSS) zu verhindern
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        return '';
    }
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function generateSectionHtml(sectionId, data) {
    switch (sectionId) {
        case 'personal':
            return (data.birthdate || data.maritalStatus || data.nationality || data.drivingLicense) ? `<div class="section"><h2 class="section-title">Persönliches</h2>${data.birthdate ? `<p><i class="fa-solid fa-calendar-day icon"></i> <span>${escapeHtml(data.birthdate)}</span></p>` : ''}${data.maritalStatus ? `<p><i class="fa-solid fa-ring icon"></i> <span>${escapeHtml(data.maritalStatus)}</span></p>` : ''}${data.nationality ? `<p><i class="fa-solid fa-flag icon"></i> <span>${escapeHtml(data.nationality)}</span></p>` : ''}${data.drivingLicense ? `<p><i class="fa-solid fa-id-card icon"></i> <span>${escapeHtml(data.drivingLicense)}</span></p>` : ''}</div>` : '';
        case 'contact':
             return `<div class="section"><h2 class="section-title">Kontakt</h2>${data.phone ? `<p><i class="fa-solid fa-phone icon"></i> <span>${escapeHtml(data.phone)}</span></p>` : ''}${data.email ? `<p><i class="fa-solid fa-envelope icon"></i> <span>${escapeHtml(data.email)}</span></p>` : ''}${data.location ? `<p><i class="fa-solid fa-location-dot icon"></i> <span>${escapeHtml(data.location)}</span></p>` : ''}${data.website ? `<p><i class="fa-brands fa-linkedin icon"></i> <span>${escapeHtml(data.website)}</span></p>` : ''}</div>`;
        case 'skills':
            return data.skills && data.skills.filter(s => s).length > 0 ? `<div class="section"><h2 class="section-title">Fähigkeiten</h2><ul>${data.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join('')}</ul></div>` : '';
        case 'languages':
            return data.languages && data.languages.filter(l => l).length > 0 ? `<div class="section"><h2 class="section-title">Sprachkenntnisse</h2><ul>${data.languages.map(language => `<li>${escapeHtml(language)}</li>`).join('')}</ul></div>` : '';
        case 'profile':
            return data.profile ? `<div class="section"><h2 class="section-title">Profil</h2><p>${escapeHtml(data.profile)}</p></div>` : '';
        case 'experience':
            return data.experience && data.experience.filter(e => e.position).length > 0 ? `<div class="section"><h2 class="section-title">Berufserfahrung</h2>${data.experience.map(exp => `<div class="entry"><div class="entry-header"><h3>${escapeHtml(exp.position)}</h3><span class="period">${escapeHtml(exp.period)}</span></div><p class="company">${escapeHtml(exp.company)}</p><ul>${exp.description.split('\n').filter(l => l.trim()).map(l => `<li>${escapeHtml(l)}</li>`).join('')}</ul></div>`).join('')}</div>` : '';
        case 'education':
            return data.education && data.education.filter(e => e.degree).length > 0 ? `<div class="section"><h2 class="section-title">Ausbildung</h2>${data.education.map(edu => `<div class="entry"><div class="entry-header"><h3>${escapeHtml(edu.degree)}</h3><span class="period">${escapeHtml(edu.period)}</span></div><p class="company">${escapeHtml(edu.school)}</p></div>`).join('')}</div>` : '';
        case 'weiterbildung':
            return data.weiterbildung && data.weiterbildung.filter(e => e.title).length > 0 ? `<div class="section"><h2 class="section-title">Weiterbildung</h2>${data.weiterbildung.map(wb => `<div class="entry"><div class="entry-header"><h3>${escapeHtml(wb.title)}</h3><span class="period">${escapeHtml(wb.period)}</span></div><p class="company">${escapeHtml(wb.institution)}</p></div>`).join('')}</div>` : '';
        default:
            return '';
    }
}

// Route, um das PDF zu generieren
app.post('/generate-pdf', async (req, res) => {
    const data = req.body; // Die Lebenslaufdaten vom Frontend
    // HTML-Template für das PDF erstellen.
    // Hier füllst du die Daten in eine HTML-Struktur ein.

    const htmlContent = `
        <html>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                </style>
                <style>
                    :root {
                        --primary-color: ${escapeHtml(data.primaryColor) || '#1DB954'};
                        --primary-color-text: ${data.primaryColor && PREDEFINED_COLORS[data.primaryColor] ? PREDEFINED_COLORS[data.primaryColor] : '#ffffff'};
                        --primary-color-light: #a7c7e7; /* This could also be derived from the primary color if needed */
                    }

                    body { font-family: 'Inter', sans-serif; color: #333; font-size: 10pt; margin: 0; padding: 0; }
                    .container { display: flex; width: 100%; height: 100%; }
                    .left-column { background-color: var(--primary-color); color: var(--primary-color-text); width: 33%; padding: 40px 30px; box-sizing: border-box; }
                    .right-column { width: 67%; padding: 40px 40px; box-sizing: border-box; }
                    
                    #photo {
                        width: ${escapeHtml(data.photoSize) || '120'}px;
                        height: ${escapeHtml(data.photoSize)}px;
                        object-fit: cover;
                        border-radius: ${data.photoShape === 'circle' ? '50%' : (data.photoShape === 'rounded' ? '15px' : '0')};
                        border: 3px solid rgba(255,255,255,0.2);
                        display: block;
                        margin: 0 auto 30px auto;
                    }

                    .resume-title { font-size: 1.4em; color: #888; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px; font-weight: 400; }
                    .right-column h1 { font-size: 2.5em; margin: 0; color: var(--primary-color); }
                    .right-column .position-title { font-size: 1.3em; color: #555; margin-top: 5px; margin-bottom: 30px; }

                    .section { margin-top: 25px; }
                    .section-title { font-size: 1.2em; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid; padding-bottom: 5px; margin-bottom: 25px; }
                    .left-column .section-title { color: var(--primary-color-text); border-color: var(--primary-color-light); text-align: center; }
                    .right-column .section-title { color: var(--primary-color); border-color: #e0e0e0; }
                    
                    .entry { margin-bottom: 15px; }
                    .entry-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
                    .entry-header h3 { margin: 0; font-weight: 600; font-size: 1.1em; }
                    .entry-header .period { font-size: 0.9em; color: #666; font-style: italic; }
                    .entry .company { color: #555; font-weight: 500; margin-top: 0; margin-bottom: 10px; }
                    .entry ul { padding-left: 20px; margin: 0; color: #555; font-size: 0.95em; }

                    .left-column p { color: var(--primary-color-text); margin: 8px 0; display: flex; align-items: center; }
                    .left-column ul { list-style: none; padding: 0; text-align: center; }
                    .left-column li { margin-bottom: 8px; color: var(--primary-color-text); }
                    .icon { margin-right: 8px; width: 14px; text-align: center; color: var(--primary-color-light); }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="left-column">
                        ${data.photoDataUrl ? `<img id="photo" src="${data.photoDataUrl}" alt="Profilbild">` : ''}
                        ${(data.sectionOrderLeft || ['personal', 'contact', 'skills', 'languages'])
                            .map(id => generateSectionHtml(id, data))
                            .join('')
                        }
                    </div>
                    <div class="right-column">
                        <h2 class="resume-title">Lebenslauf</h2>
                        <h1>${escapeHtml(data.firstname)} ${escapeHtml(data.lastname)}</h1>
                        <p class="position-title">${escapeHtml(data.position)}</p>

                        ${(data.sectionOrderRight || ['profile', 'experience', 'education', 'weiterbildung'])
                            .map(id => generateSectionHtml(id, data))
                            .join('')
                        }
                    </div>
                </div>
            </body>
        </html>
    `;

    try {
        const puppeteer = await import('puppeteer');
        const browser = await puppeteer.launch({
            // Für den Betrieb auf vielen Linux-Systemen erforderlich
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Den HTML-Inhalt in der Seite setzen
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // PDF generieren
        const pdfBuffer = await page.pdf({
            width: '210mm', height: '297mm', // A4-Maße
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        await browser.close();

        // Das generierte PDF an den Client senden
        res.set({
                'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Fehler bei der PDF-Generierung:', error);
        res.status(500).send('Fehler beim Erstellen des PDFs.');
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
