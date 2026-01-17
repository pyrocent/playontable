# <a href = "https://playontable.com/"><img src = "https://playontable.com/static/assets/other/icons/icon192x192.png" width = "30" height = "30" alt = "icon"></a> Play Any Game! [PlayOnTable.com](https://playontable.com/)

### Let's play any game on a virtual realtime multiplayer table with PlayOnTable.com

## Codebase

PlayOnTable was developed using the following programming/markup languages:

\*For the **backend\***

- **Python**

\*For the **frontend\***

- **SASS**
- **HTML**
- **JavaScript**

## Dependencies

Python backend `requirements.txt` file contains 2 dependencies:

- [FastAPI](https://fastapi.tiangolo.com/) (for WebSocket connections)
- [Uvicorn](https://uvicorn.dev/) (as ASGI web server)

Frontend depends on 1 JavaScript library delivered from [jsDelivr](https://www.jsdelivr.com/) CDN:

- [GSAP](https://gsap.com/) (for dragging items on table)

## Production

PlayOnTable.com backend is deployed on [Render](https://render.com/) as well as the frontend, as PWA ([Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)).

It's also available on Android on [Google Play Store](https://play.google.com/store/apps/details?id=com.playontable.app) as TWA ([Trusted Web Activity](https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities)), build with [PWABuilder](https://www.pwabuilder.com/).

The "_.com_" TLD web domain is registered on [Ionos](https://www.ionos.it/) (it's possible to check [there](https://who.is/whois/playontable.com) PlayOnTable.com WHOIS).
