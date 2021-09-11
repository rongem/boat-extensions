# Beitragen zu BOAT-Extensions

Wir freuen und, dass Sie zu BOAT-Extensions beitragen und sie weiter zu verbessern!
Bitte beachten Sie dabei folgende Richtlinien:

As a contributor, here are the guidelines we would like you to follow:

 - [Verhaltenskodex](#coc)
 - [Frage oder Problem?](#question)
 - [Probleme und Fehler](#issue)
 - [Feature Requests](#feature)
 - [Richtlinie für eigene Beiträge](#submit)
 - [Regeln für Code](#rules)
 - [Richtlinien für Commit Messages](#commit)
 

## <a name="coc"></a> Verhaltenskodex

Helfen Sie uns, die BOAT-Extensions offen und inklusiv zu halten.
Bitte lesen und befolgen Sie unseren [Verhaltenskodex][coc].


## <a name="question"></a> Haben Sie eine Frage oder ein Problem?

Bitte öffnen Sie keine Problemmeldung (Issue) für eine Support-Anfrage, damit Github issues ausschließlich für Fehlermeldungen und Feature Requests verwendet wird.

## <a name="issue"></a> Haben Sie einen Fehler gefunden?

Wenn sie im Quellcode einen Fehler gefunden haben, können Sie uns helfen, indem Sie ein [Issue](#submit-issue) in unserem [GitHub Repository][github] öffnen.
Noch mehr freuen wir uns, wenn Sie einen [Pull Request](#submit-pr) mit einer Korrektur beitragen.


## <a name="feature"></a> Vermissen Sie eine Funktion?
BOAT-Extensions ist als Erweiterung zum aktuellen Bund Online Abrechnungs-Tool in der Version 3 konzipiert.
Es ergänzt dieses um Funktionen, die für die Arbeit mit den Daten wichtig sind, aber dort nicht oder nicht in ausreichender Qualität implementiert wurden.
Es ist nicht unser Anliegen, BOAT3 vollständig zu ersetzen.

Sie können im Github Repository eine neue [Funktion anfordern](#submit-issue).
Wenn Sie eine neue Funktion beitragen möchten, verfahren Sie bitte in Abhängigkeit der "Größe" der Funktion:

* Für eine **große Veränderungen** öffnen Sie bitte zuerst ein Issue und beschreiben Ihren Vorschlag, so dass es diskutiert werden kann.
  Dieser Prozess erlaubt und, Ihren Einsatz besser zu koordinieren, und Doppelarbeit zu vermeiden.
  So kann Ihre Arbeit leichter in das Projekt integriert werden.

  **Hinweis**: Einen neuen Artikel zur Dokumentation hinzuzufügen oder siginifikant zu verändern, zählt als **große** Veränderung.

* **Kleine Veränderungen** können direkt als [Pull Request](#submit-pr) beigetragen werden.


## <a name="submit"></a> Richtlinie für eigene Beiträge


### <a name="submit-issue"></a> Ein Issue öffnen

Vor dem Öffnen eines Issues, suchen Sie bitte im Issue tracker, ob dort nicht bereits eines für Ihr Problem existiert, und die Diskussion Hinweise und Hilfestellungen für die bereithält.

Wir wollen alle Issues so schnell wie möglich beseitigen, aber bevor wir das können, müssen wir es reproduzieren und bestätigen.
Um Fehler zu reproduzieren, benötigen wir von Ihnen eine minimale Beschreibung für die Reproduktion.
Mit einem Mindestszenario zur Reproduktion geben Sie uns die Möglichkeit, das Problem zu lösen, ohne Sie mit zusätzlichen Fragen belästigen zu müssen.

Eine minimale Beschreibung erlaubt es uns, einen Fehler schnell zu bestätigen, aber auch sicherzustellen, dass wird das korrekte Problem lösen.
Ohne diese Beschreibung können wir Fehler nicht untersuchen und lösen, daher werden wir Issues schließen, die nicht genug Information zum Finden des Fehlers beinhalten.

Sie können Issues mit unserem [Issue template](https://github.com/rongem/boat-extensions/issues/new/choose) öffnen.


### <a name="submit-pr"></a> Einen Pull Request (PR) beitragen

Bevor Sie ihren Pull Request (PR) beitragen, beachten sie bitte folgende Richtlinien:

1. Durchsuchen Sie [GitHub](https://github.com/rongem/boat-extensions/pulls) nach offenen oder geschlossenen PRs, die mit Ihrem Problem zusammenhängen, um Doppelarbeit zu vermeiden.

2. Stellen Sie sicher, dass ein Issue das Problem, das Sie lösen, oder eine Dokumentation die neue Funktion beschreiben.
   Eine aussagekräftige Beschreibung hilft uns, Ihre Arbeit zu akzeptieren.

3. Erstellen sie einen [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) des rongem/boat-extensions Repository.

4. In ihrem Fork des Repository, erstellen Sie einen neuen Git-Branch:

     ```shell
     git checkout -b my-fix-branch master
     ```

5. Erzeugen Sie Ihre Korrektur, **die geeignete Testfälle enthalten muss**.

6. Befolgen Sie unsere [Coding Regeln](#rules).

7. Verwenden Sie für den Commit Ihrer Änderungen eine aussagekräftige Nachricht, die unseren [Konvertionen für Commit-Nachrichten](#commit) entspricht.

     ```shell
     git commit --all
     ```
    Hinweis: das optionale Kommando commit `-a` fügt automatisch neue Dateien hinzu oder übernimmt Löschungen.

10. Führen Sie einen Push auf Ihren Fork im GitHub aus:

    ```shell
    git push origin my-fix-branch
    ```

11. Versenden Sie in GitHub einen pull request an `boat-extensions:main`.

### Überprüfen eines Pull Request

Wir behalten uns vor, entsprechend unseres [Verhaltenskodex][coc] Beiträge von negativ aufgefallenen Personen auszuschließen.

#### Feedback aus der Überprüfung einarbeiten

Falls wir Sie um Änderungen bitten, die wir nach einer Überprüfung des Codes für notwendig erachten, verfahren Sie bitte wie folgt:

1. Aktualisieren Sie Ihren Code entsprechend der Vorgaben.

2. Führen Sie alle Tests aus und überprüfen Sie, ob der Code immer noch fehlerfrei funktioniert.

3. Erzeugen Sie einen Fixup Commit und führen Sie einen Push in Ihr GitHub repository aus, um ihren Pull-Request zu aktualisieren:

    ```shell
    git commit --all --fixup HEAD
    git push
    ```

Fertig! Danke für Ihren Beitrag!


##### Die Commit-Nachricht aktualisieren

Eine Überprüfung kann Änderungen an der Commit-Nachricht erfordern, z. B. zusätzliche Informationen oder bessere Anpassung an die [Konvertionen für Commit-Nachrichten](#commit).
Um die Commit-Nachricht des letzten Commits zu ändern, verfahren Sie wie folgt:

1. Checken Sie ihren Branch aus:

    ```shell
    git checkout my-fix-branch
    ```

2. Verbessern Sie den letzten Commit und ändern Sie die Nachricht:

    ```shell
    git commit --amend
    ```

3. Pushen Sie in Ihr GitHub Repository:

    ```shell
    git push --force-with-lease
    ```

> Hinweis:<br />
> Wenn Sie die Nachricht eines früheren Commit verändern wollen, führen Sie `git rebase` im interaktiven Modus aus.
> Weitere Informationen finden Sie in der [Git Dokumentation](https://git-scm.com/docs/git-rebase#_interactive_mode).


#### Wenn Ihr Pull Request integriert wurde

Nachdem Ihre Pull Request integriert wurde, können Sie Ihren Branch löschen und den Code aus dem Haupt-Repository beziehen:


## <a name="rules"></a> Regeln für Code
Um Konsistenz im Quellcode zu wahren, beachten Sie bitte diese Regeln beim Programmieren:

* Alle Ergänzungen oder Fehlerkorrekturen **müssen getestet werden**, und zwar durch mindestens einen Unit Test.
* Alle öffentlichen API Methoden **müssen dokumentiert werden**.


## <a name="commit"></a> Format für Commit-Nachrichten

Jede Commit-Nachricht besteht aus einem **header** und einem **body**.

```
<header>
<BLANK LINE>
<body>
```

#### Header
Der Header ist notwendig und gibt den Typ der Änderung an:

* **docs**: Änderungen ausschließlich and der Dokumentation
* **feat**: Eine neue Funktion
* **fix**: Eine Fehlerbehebung
* **perf**: Eine Änderung zur Verbesserung der Geschwindigkeit
* **refactor**: Eine Änderung, die weder eine neue Funktion hinzufügt, noch einen Fehler behebt.
* **test**: Hinzufügen neuer oder Korrigieren vorhandener Tests.




#### <a name="commit-body"></a>Body

Verwenden Sie Imperativ Präsens, also "ändert", nicht "hat geändert" oder "änderte".

Beschreiben Sie die Motivation der Änderung, also warum Sie die Änderung vornehmen.
Sie können das Verhalten vorher und nachher vergleichen, um die Auswirkungen zu erläutern.

Folgende Dokumente können hilfreich für Sie sein:

  * https://help.github.com/articles/setting-your-commit-email-address-in-git/
  * https://stackoverflow.com/questions/37245303/what-does-usera-committed-with-userb-13-days-ago-on-github-mean
  * https://help.github.com/articles/about-commit-email-addresses/
  * https://help.github.com/articles/blocking-command-line-pushes-that-expose-your-personal-email-address/


[coc]: https://github.com/rongem/boat-extensions/blob/main/CODE_OF_CONDUCT.md
[github]: https://github.com/rongem/boat-extensions
