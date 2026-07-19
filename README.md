# Web-basierter Lebenslauf-Ersteller

Ein moderner, web-basierter Editor zur schnellen und einfachen Erstellung professioneller Lebensläufe mit Live-Vorschau und PDF-Export.

## ✨ Features

*   **Live-Vorschau:** Sehen Sie alle Änderungen in Echtzeit, während Sie Ihre Daten eingeben.
*   **PDF-Export:** Generieren Sie mit einem Klick ein hochwertiges, druckfertiges PDF Ihres Lebenslaufs.
*   **Anpassbares Design:**
    *   Wählen Sie aus verschiedenen Farbschemata, um Ihrem Lebenslauf eine persönliche Note zu geben.
    *   Passen Sie Form (rund, abgerundet, quadratisch) und Größe Ihres Profilbildes an.
    *   Ordnen Sie die Sektionen per Drag & Drop genau so an, wie Sie es möchten.
*   **Lokale Datenspeicherung:** Alle Ihre Daten werden sicher und privat nur in Ihrem Browser (`localStorage`) gespeichert.
*   **Import & Export:** Sichern Sie Ihre Lebenslaufdaten als JSON-Datei oder laden Sie eine bestehende Datei, um die Bearbeitung fortzusetzen.
*   **Heller & Dunkler Modus:** Ein angenehmes dunkles Design für den Editor, das die Augen schont und sich per Knopfdruck umschalten lässt.
*   **Datenschutz im Fokus:** Der Server speichert keine persönlichen Daten. Er empfängt die Daten nur kurzzeitig, um das PDF zu generieren, und verwirft sie danach sofort wieder.

## 🚀 Technologie-Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Backend:** Node.js, Express.js
*   **PDF-Generierung:** Puppeteer (Headless Chrome)
*   **Zusätzliche Bibliotheken:** SortableJS (für Drag & Drop der Sektionen)

## 🛠️ Installation und Ausführung

### Lokale Entwicklung

1.  **Repository klonen:**
    ```bash
    git clone <https://github.com/ihr-benutzername/lebenslaufersteller.git>
    ```
2.  **In das Verzeichnis wechseln:**
    ```bash
    cd lebenslaufersteller
    ```
3.  **Abhängigkeiten installieren:**
    ```bash
    npm install
    ```
4.  **Server starten:**
    ```bash
    node server.js
    ```
5.  Öffnen Sie `http://localhost:3000` in Ihrem Browser.

### Server-Deployment (VPS)

1.  **Server vorbereiten:** Installieren Sie `nodejs`, `npm` und `git` auf Ihrem Server.
2.  **Anwendung klonen:** Laden Sie den Code aus Ihrem Git-Repository.
3.  **Abhängigkeiten installieren:** Führen Sie `npm install` im Projektverzeichnis aus. Dies installiert auch Puppeteer und den benötigten Chromium-Browser.
4.  **Prozess-Manager verwenden:** Starten Sie die Anwendung mit einem Prozess-Manager wie `pm2`, um sicherzustellen, dass sie dauerhaft läuft.
    ```bash
    # PM2 global installieren
    sudo npm install -g pm2
    
    # Anwendung starten
    pm2 start server.js --name lebenslauf-ersteller
    ```
5.  **Reverse Proxy einrichten:** Verwenden Sie einen Webserver wie **Nginx** als Reverse Proxy, um Anfragen von Ihrer Domain an die auf Port 3000 laufende Node.js-Anwendung weiterzuleiten. Es wird dringend empfohlen, ein SSL-Zertifikat (z.B. via Let's Encrypt) einzurichten.

### Formspree einrichten
Um Formspree für Feedbacks zu verwenden muss in "index.html" in der Zeile 212 die URL, die von Formspree bereitgestellt wird, hinzugefügt werden.

## 🤖 Ein Projekt mit Gemini

Dieses Projekt wurde maßgeblich mit Unterstützung von **Google's Gemini** entwickelt. Von der Code-Erstellung und -Optimierung über die Fehlerbehebung bis hin zur Konzeption von Features und der Erstellung dieser Dokumentation war Gemini ein integraler Bestandteil des Entwicklungsprozesses.

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

