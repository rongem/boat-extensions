// Diese Datei stellt die Konfigurierbarkeit der Angular-Komponente sicher, ohne dass neu kompiliert werden muss.
// Erstellen Sie eine eigene Kopie der Datei, und ersetzen Sie diese Vorlage auf dem Produktionssystem damit.

(function (window) {
    window.__env = window.__env || {};
  
    // Basis-URL für API-Calls zur BOAT API. Sollte über den Reverse Proxy gelöst werden, um CORS-Probleme zu vermeiden
    window.__env.apiBaseUrl = '/api';
    // URL für den Login-Befehl von BOAT. Sollte über den Reverse Proxy gelöst werden, um CORS-Probleme zu vermeiden
    window.__env.authUrl = '/auth/login';
    // Basis-URL des Backends. Kann über den Reverse Proxy geführt werden, muss aber nicht. Ohne gültige Adresse werden
    // die entsprechenden Funktionen nicht aktiv, und die Komponente arbeitet alleinstehend nur mit dem BOAT-Backend.
    window.__env.backendBaseUrl = 'http://localhost:8000/rest/';
    // Name der Organisation, die das Tool einsetzt. Erscheint links oben in der Kopfzeile
    window.__env.headerText = 'Org';
  
  }(this));