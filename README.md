# ****Task Tracker****

## ****Beschreibung****

Task Tracker ist eine webbasierte Anwendung, die Benutzern ermöglicht, ihre Aufgaben effizient zu verwalten. Die Hauptfunktionen umfassen:

- ****Erstellen, Bearbeiten und Löschen von Aufgaben****: Benutzer können ihre Aufgaben direkt in der Anwendung verwalten.

- ****Markieren von Aufgaben als erledigt****: Erledigte Aufgaben können separat angezeigt werden.

- ****Verwaltung von Aufgabeninformationen****: Aufgaben beinhalten Details wie Titel, Beschreibung, Priorität und Fälligkeitsdatum.

  

Die Anwendung ist ****live erreichbar**** unter folgendem Link:  

[Task Tracker App](https://task-tracker-app-600195987042.europe-west3.run.app/)  

****Hinweis****: Der Zugriff auf die Datenbank ist nur nach Anfrage möglich, da IP-Adressen für den Zugriff freigegeben werden müssen.

  

---

  

## ****Technologie-Stack****

- ****Frontend****: Next.js (React Framework)

- ****Backend****: Node.js mit `http` und `next` für Server-Rendering

- ****Datenbank****: MongoDB Atlas (Cloud-Datenbank)

- ****Styling****: Tailwind CSS

  

---

  

## ****Voraussetzungen für lokales Testen****

1. ****Installierte Software****:

   - Node.js (Version 18 oder höher)

   - MongoDB Atlas Konto (für die Cloud-Datenbank)

  

2. ****Umgebungsvariablen****:

   - Erstellen Sie eine `.env`-Datei im Projektstammverzeichnis mit den folgenden Variablen:

     ```env

     MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/task-tracker?retryWrites=true&w=majority

     NODE_ENV=production

     PORT=8080

     ```

   - **Wichtig**: Ersetzen Sie `<username>`, `<password>` und `<cluster-url>` durch Ihre MongoDB Atlas-Anmeldedaten.

  

---



## ****Installation für lokales Testen****

### ****1. Projekt einrichten****

1. Klonen Sie das Repository:

   ```bash

   git clone https://github.com/thats-dominik/task-tracker-app.git

   cd task-tracker

  

2. Installieren Sie die Abhängigkeiten:

  

npm install

  

**2. Backend starten (lokal)**

  

1. Starten Sie den Server:

  

npm run dev

  

  

2. Der Server sollte auf http://localhost:8080 laufen.

  

**Datenbankzugriff**

  

1. **Freigabe der IP-Adresse**:

Senden Sie Ihre aktuelle IP-Adresse an den Projektinhaber (mir), um Zugriff auf die MongoDB-Datenbank zu erhalten. Diese wird manuell in den **Network Access**-Einstellungen von MongoDB Atlas freigegeben.

2. **Zugriffsanfrage stellen**:

Kontaktieren Sie den Projektinhaber (mich), um eine Freigabe für die Datenbank zu erhalten.

3. **MongoDB Atlas Einrichtung**:

Falls Sie eine eigene Datenbank verwenden möchten:

• Gehen Sie zu Ihrem MongoDB Atlas Dashboard.

• Erstellen Sie ein Cluster und fügen Sie eine neue Collection namens tasks hinzu.

• Konfigurieren Sie Benutzer mit entsprechenden Zugriffsrechten.

  <img width="947" alt="Bildschirmfoto 2024-12-04 um 08 59 16" src="https://github.com/user-attachments/assets/6fb17a1c-100d-4938-89b5-cb96d3206b77">


**Struktur des Projekts**

  

task-tracker/

├── .next/                   # Next.js-Buildordner (automatisch generiert)

├── node_modules/            # Abhängigkeiten (automatisch generiert)

├── src/                     # Quellcode

│   ├── app/                 # Frontend-Komponenten

│   │   ├── add/             # Task hinzufügen

│   │   ├── edit/            # Task bearbeiten

│   │   ├── api/tasks/       # Backend-Routen (CRUD-APIs)

│   └── fonts/               # Schriftarten

├── .env                     # Umgebungsvariablen

├── package.json             # Projektabhängigkeiten

├── README.md                # Projektdokumentation
