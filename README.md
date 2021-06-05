# BOAT-Extensions
*German only*

Einfaches Werkzeug, um aus BOAT (Bund Online Abrechnungs-Tool) in der Version 3 heraus Daten in verschiedenen Reports anzusehen und zu exportieren.

Momentan existiert mit dem Tag *latest* eine alleinstehende Version, die direkten Internetzugang benötigt.

Das Tag *enterprise-proxy* enthält eine auf Apache aufgebautet Version, die einen Unternehmensproxy verwenden kann. Angesteuert wird dieser mit der Variable *HTTP_PROXY*, die das Schema, einen Hostnamen und einen optionalen Port (z. B. http://mein-proxy:8000) enthalten muss.

Beide funktionieren als Reverse Proxy, damit es keine Probleme CORS gibt.

Später soll er Import von Datensätzen in MS SQL Datenbanken möglich werden. Dann wird neben dem Frontend auch ein Backend auf Basis von NodeJS existieren.

Docker-Adresse: https://hub.docker.com/r/rongem/boat3-extensions

