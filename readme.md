# VereinsWK Scoreboard

## Installation: Server

Auf einem Computer, auf dem VereinsWK läuft, muss ein Webserver (z.B. `IIS`) installaiert werden.
Der Inhalt vom `server`-Ordner wird in den Ordner des Webservers kopiert (z.B. bei `IIS`: `C:\inetpub\wwwroot`).
Die Einstellungen in der Datei `settings.js` müssen angepasst werden, dass die `fetchScoresUrl` von den Clients aus erreichbar ist.

## Installation: fullpageos

Auf einem Raspberry Pi mit fullpageos installiert:
- In der Datei `/boot/fullpageos.txt` die URL zum Webserver eintragen (z.B. `http://10.11.12.13/ranking.html`).
- Die Datei `/boot/splash.png` kann bearbeitet werden um einen alternativen Boot-Screen zu haben (Format: PNG, 1920x1080).
- Wenn der Rand vom Bild nicht stimmt kann die Option `disable_overscan` in `/boot/config.txt` angepasst werden.

## Rangliste updaten

Um die Rangliste aus VereinsWK zu updaten muss sie in den Ordner vom Webserver exportiert werden.
In VereinsWK unter `Einzelrangliste` die Rangliste im Format `CSV` exportieren.
**Achtung**: Der Name der Datei muss mit der Einstellung `fetchScoresUrl` in `server/settings.js` übereinstimmen.

