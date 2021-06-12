# BOAT-Extensions
*German only*

Einfaches Werkzeug, um aus BOAT (Bund Online Abrechnungs-Tool) in der Version 3 heraus Daten in verschiedenen Reports anzusehen und zu exportieren.

Momentan existiert mit dem Tag *latest* eine alleinstehende Version, die direkten Internetzugang benötigt.

Das Tag *frontend-enterprise-proxy-v2* enthält eine auf Apache aufgebautet Variante des Frontends, die einen Unternehmensproxy verwenden kann. Angesteuert wird dieser mit der Variable *HTTP_PROXY*, die das Schema, einen Hostnamen und einen optionalen Port (z. B. http://mein-proxy:8000) enthalten muss.

Beide Frontend-Varianten funktionieren als Reverse Proxy für BOAT, damit es keine Probleme CORS gibt.

Der Import von Datensätzen in eine MS SQL Datenbank wird durch das Backend auf Basis von NodeJS/Express ermöglicht. Dies geschieht über das jeweilige Frontend, das einerseits aus BOAT die Daten holt und diese dann an das Backend übergibt, das sie in der Datenbank ablegt. Die Synchronisierung erkennt auch gelöschte Datensätze in den Leistungsmeldungen.

Docker-Adresse: https://hub.docker.com/r/rongem/boat3-extensions

