# BOAT-Extensions
*German only*

Einfaches Werkzeug, um aus BOAT (Bund Online Abrechnungs-Tool) in der Version 3 heraus Daten in verschiedenen Reports anzusehen und zu exportieren.

Es existiert ein Frontend, das mit dem Tag *latest* als alleinstehende Version ohne Enterprise Proxy funktioniert.

Das Tag *frontend-enterprise-proxy-v2* enthält eine auf Apache aufgebautet Variante des Frontends, die einen Unternehmensproxy verwenden kann. Angesteuert wird dieser mit der Variable *HTTP_PROXY*, die das Schema, einen Hostnamen und einen optionalen Port (z. B. http://mein-proxy:8000) enthalten muss.

Beide Frontend-Varianten funktionieren als Reverse Proxy für BOAT, damit es keine Probleme CORS gibt.

Der Import von Datensätzen in eine MS SQL Datenbank wird durch das Backend auf Basis von NodeJS/Express ermöglicht, das mit dem Tag *backend* versehen ist. Dies geschieht über das jeweilige Frontend, das einerseits aus BOAT die Daten holt und diese dann an das Backend übergibt, das sie in der Datenbank ablegt. Die Synchronisierung erkennt auch gelöschte Datensätze in den Leistungsmeldungen und löscht diese in der Datenbank.

DockerHub-Adresse: https://hub.docker.com/r/rongem/boat3-extensions

## Konfiguration

Sowohl das Frontend als auch das Backend können (und müssen) konfiguriert werden, um ihre Aufgabe angepasst an die jeweilige Umgebung zu erfüllen.

### Frontend
Das Frontend wird über die Datei ''env.js'' konfiguriert, die im selben Verzeichnis wie die index.html liegen muss. Diese Datei stellt die Konfigurierbarkeit der Angular-Komponente sicher, ohne dass neu kompiliert werden muss. Erstellen Sie eine eigene Kopie der Datei, und ersetzen Sie diese Vorlage auf dem Produktionssystem damit.

Folgende Einstellungen sind möglich:

    
 - window.__env.headerText = 'Org': Name der Organisation, die das Tool einsetzt. Erscheint links oben in der Kopfzeile
 - window.__env.apiBaseUrl = '/api': Basis-URL für API-Calls zur BOAT API. Sollte wie in der Voreinstellung über den Reverse Proxy gelöst werden, um CORS-Probleme zu vermeiden
 - window.__env.authUrl = '/auth/login': URL für den Login-Befehl von BOAT. Sollte wie in der Voreinstellung über den Reverse Proxy gelöst werden, um CORS-Probleme zu vermeiden
 - window.__env.backendBaseUrl = 'http://localhost:8000/rest/': Basis-URL des Backends. Kann über den Reverse Proxy geführt werden, muss aber nicht. Ohne gültige Adresse werden die entsprechenden Funktionen nicht aktiv, und die Komponente arbeitet alleinstehend nur mit dem BOAT-Backend.


#### Frontend mit Enterprise Proxy

Für das Image mit dem Enterprise Proxy existiert zusätzlich eine Umgebungsvariable, die gesetzt werden sollte:
 - HTTP_PROXY

### Backend

Das Backend verfügt über eine ganze Reihe von Umgebungsvariablen:

 - DB_USER: Benutzername für die MS-SQL-Datenbank
 - DB_PWD: Kennwort für die MS-SQL-Datenbank
 - DB_NAME: Name der MS-SQL-Datenbank
 - DB_SERVER: MS-SQL-Datenbank-Server
 - DB_PORT: Port für den MS-SQL-Datenbank-Server (normalerweise 1433)
 - DB_INSTANCE: (Optional) Instanzname für den MS-SQL-Datenbank-Server
 - CORS_ORIGIN: (Optional) URL des Frontend-Servers für die CORS-Konfiguration des Backends.
 - AUTH_MODE: Authentifizierungmodus. Erlaubte Werte: ntlm (empfohlen) oder none (nur für Tests)
 - LDAP_DOMAIN: (Optional) Name der Windows-Domäne, aus der Benutzer auf den Server zugreifen dürfen
 - LDAP_SERVER: (Optional, gemeinsame mit LDAP_DOMAIN) Domain Controller, gegen den Benutzer geprüft werden.

Werden LDAP_SERVER und LDAP_DOMAIN nicht gesetzt, wird jeder Authentifizierte Benutzer akzeptiert.

### Datenbank
Für die Datenbank liegen die Erstellungsskripte für die Tabellen im Verzeichnis mssql-database. Sie müssen in dieser Reihenfolge der Nummern am Anfang des Namens ausgeführt werden.

Der im Backend konfigurierte Datenbankbenutzer muss Zugriff aus das Schema besitzen, in dem die Tabellen und die Stored Procedure liegen. Das Benutzerkonto benötigt Lese-, Schreib- und Löschrechte auf alle Datenbanktabellen sowie Ausführungsrechte auf die Stored Procedure BoatExt_Import.

Erfolgreich am Backend authentifizierte Windows-Nutzerkonten haben nicht automatisch das Recht, die Datenbank mit BOAT zu synchronisieren. Sie müssen in der Tabelle *BoatExt_Authorizations* das Feld *Allowed* auf *true* gesetzt bekommen, um diese Möglichkeit zu erhalten.

Die Stored Procedure *BoatExt_Import* erfüllt in der vorliegenden Form keine Aufgabe. Sie wird nach Abschluss der Synchronisation ausgeführt, um in einem Staging-Modell die importierten Daten weiterzuverarbeiten. Dafür kann die Prozedur entsprechend angepasst werden.
