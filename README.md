# RhythmHub

RhythmHub è una piattaforma web (**web app**) adibita alla gestione di
canzoni e playlist. L’obiettivo è quello di fornire un servizio di
creazione e condivisione di playlist, basandosi su dati forniti dall’
API REST di Spotify. L’utente può cercare canzoni, aggiungerle ad una
playlist e condividerla con altri utenti. L’interfaccia è stata
progettata per essere semplice e responsiva, adattandosi a qualsiasi
dispositivo.

## Architettura

L’architettura di RhythmHub è basata su un **server** e un **client**.
Il server è un’applicazione **Node.js** che fornisce un’interfaccia REST
per la gestione dei dati. Il client è un’applicazione web basata su HTML
(*Bootstrap Framework*) e CSS, con l’ausilio di JavaScript per la
gestione delle richieste al server.

Node fornisce un Web Server basato su Express, che gestisce le richieste
HTTP e le reindirizza al client.

I dati sono memorizzati in un database **MongoDB**, un database NoSQL
che permette di memorizzare dati in formato JSON e renderli facilmente
accessibili tramite richieste HTTP.

## MongoDB

Il database è stato progettato per memorizzare i dati relativi agli
utenti, alle playlist e alle canzoni. Le informazioni sono memorizzate
in formato JSON e sono accessibili tramite richieste HTTP. Il database è
stato progettato per essere scalabile e performante, e permette di
memorizzare grandi quantità di dati in modo efficiente. Di seguito le
immagini del database e delle collezioni.

<div class="center">

</div>

# Gestione degli Utenti

L’utente deve registrarsi per poter utilizzare RhythmHub. La
registrazione avviene tramite un form presso la pagina `\signup`. I dati
inseriti vengono inviati al server, che li memorizza nel database. La
password viene criptata tramite **crypto** prima di essere memorizzata.

L’utente può effettuare il login tramite il form presso la pagina
`\login.html`. I dati inseriti vengono inviati al server, che li
confronta con quelli memorizzati nel database. Se i dati sono corretti,
l’utente viene reindirizzato alla pagina `\home.html`.


## Gestione delle Preferenze

L’utente può selezionare le proprie preferenze musicali nella pagine di
singup tramite dei menu checkbox realizzati tramite **jQuery** e del
**CSS**. Le preferenze vengono memorizzate nel database e possono essere
modificate in seguito.

## Modifica delle Informazioni

Nella pagina `\settings.html` l’utente visualizza le proprie
informazioni e può modificarle cliccando sull’apposito bottone, oppure
decidere di eliminare il proprio account e le playlist create. La pagina
`update.html` permette di modificare le informazioni personali e
presenta un toggle per la modifica della password, gestendo in modo
differente le richieste `PUT`.

## Json Web Token

Particolare attenzione è stata posta per la gestione della sessione
utente. Una volta effettuato il login, il server invia un **Json Web
Token** all’utente, che lo memorizza nel **localStorage** del browser.
Il token viene inviato al server con ogni richiesta che ne necessita,
permettendo di identificare l’utente e fornire i dati corretti. Il token
ha una durata di 1 ora, dopodiché l’utente deve effettuare nuovamente il
login.

L’architettura basata su JWT è comunemente utilizzata per la gestione
delle sessioni in applicazioni web, in quanto permette di evitare
l’utilizzo di cookie e di memorizzare i dati di sessione lato server: il
file `paths.js` contiene i percorsi che richiedono l’autenticazione, e
il middleware `auth.js` si occupa di verificare la validità del token.
Ciò viene effettuato tramite la secret key, che viene confrontata con
quella memorizzata nel server.


# Spotify API

RhythmHub si basa sull’API di Spotify per ottenere i dati relativi alle
canzoni e alle playlist. L’utente può cercare canzoni tramite il form
nella pagina `\search.html`, e aggiungerle ad una playlist. Le canzoni
vengono visualizzate tramite un sistema basato su **grid e card**, con
la possibilità di vedere più informazioni cliccando sull’apposito
bottone.

Le route definite in `paths.js` che iniziano con `/spoty` sono dedicate
alla gestione delle richieste all’API di Spotify. Il server invia le
richieste all’API di Spotify e restituisce i dati all’utente.

Spotify richiede un **token** che ha validità di un’ora per poter
effettuare le richieste. Il token viene ottenuto tramite una richiesta
`POST` al server, che invia le credenziali all’API di Spotify e
restituisce il token all’utente.

        fetch((url), {
            method: "POST",
            headers: {
                Authorization: "Basic " + btoa(`${client_ID}:${client_Secret}`),
                "Content-Type": "application/x-www-form-urlencoded",
                },
            body: new URLSearchParams({ grant_type: "client_credentials" }), })
            .then((response) => response.json()) .then((tokenResponse) =>
            spotytoken=tokenResponse.access_token) 
            setInterval(() => {
            fetch((url), {
                method: "POST",
                headers: {
                    Authorization: "Basic " + btoa(`${client_ID}:${client_SECRET}`),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            body: new URLSearchParams({ grant_type: "client_credentials" }), })
            .then((response) => response.json()) .then((tokenResponse) =>
                    spotytoken=tokenResponse.access_token       
            )
            }, (1000*60)*59);

Si noti come la funzione `setInterval` permetta di aggiornare il token
ogni 59 minuti, in modo da evitare che scada durante l’utilizzo
dell’applicazione.

# Playlist Management

L’utente può creare una playlist tramite il modal che si apre cliccando
sul bottone sulla pagina `playlist.html`. Il modal permette di inserire
il nome della playlist, la descrizione, i tag associati e la visibità
(pubblica o privata). Quest’ultima determina se la playlist è visibile
agli altri utenti sulla home page o meno.

Una volta creata la playlist, l’utente può aggiungere canzoni cercate
nella pagina `search.html`, cliccando sul bottone ; oppure direttamente
dalla home page che mostra la playlist `Top 50 Global`. Una playlist può
essere infine eliminata dal database tramite il bottone .

Si noti che un utente può **importare** una playlist pubblica di un
altro utente, e può modificarla in quando si crea una copia della
playlist originale, di cui si mantiene però come proprietà il nome
utente di chi ha creato la playlist.

# Responsive Layout

L’interfaccia è stata progettata per adattarsi a qualsiasi dispositivo,
grazie all’utilizzo del **Bootstrap Framework**. Le pagine sono state
progettate per essere visualizzate correttamente su dispositivi di
qualsiasi dimensione, e sono state testate su dispositivi mobili, tablet
e desktop.

# Swagger UI

Il server fornisce una documentazione delle API tramite **Swagger UI**,
un tool che permette di visualizzare le API REST e testarle direttamente
dal browser. La documentazione è accessibile tramite il percorso
`/api-docs`.

La documentazione è generata automaticamente e permette di testare le
API direttamente dal browser. È possibile inviare richieste `GET`,
`POST`, `PUT` e `DELETE` e visualizzare la risposta.

#  Credits

Web App sviluppata da Niccolò Volontè, studente di Sicurezza dei Sistemi e delle Reti Informatiche presso Università degli studi di Milano, A.A 2022/2023.
