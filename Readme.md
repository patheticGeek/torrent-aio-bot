# Torrent all-in-one bot

Lorem ipsum i am too lazy figure what it does yourself

You might be lazy too so here ya go:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/patheticGeek/torrent-aio-bot)

## TODO after deploy

### Minimum required to get torrent download working:

Set a variable with key "SITE" and value is the link of your site. eg. "https://\<project name>.herokuapp.com". This is important to keep bot alive or server will stop after 30 min of inactivity.

### To start a torrent bot:

Set a enviorment variable with key "TELEGRAM_TOKEN" and token of your bot as value. [How to get token](https://core.telegram.org/bots/#creating-a-new-bot)
To set a enviorment variable go to heroku dashboard open the app then go to Settings > Config vars > Reveal Config vars.

### To get search working:

Go to the build packs section in settings and click add buildpack and enter "https://github.com/jontewks/puppeteer-heroku-buildpack.git" as buildpack url then click save changes.

> Heroku dosent detect third party buildpack required for using puppeteer so it is recommended to git clone and then deploy to heroku after adding buildpack manually.
>
> If you do not deploy with git clone and then search wont work downloading will still work.

### To get gdrive upload:

1. Go to https://developers.google.com/drive/api/v3/quickstart/nodejs and click on Enable the Drive API
   copy client id and set an enviorment variable in heroku with name CLIENT_ID then copy client secret and set another env named CLIENT_SECRET.
2. Let the process restart 2 time. Then when it starts a link will be logged (Go to more > view logs) visit the link and signin with the desired acc. In end you will get a auth code copy it and set a env var AUTH_CODE with value of it.
3. Let the process restart one more time. This time it will log a token, copy its value including { } and set a env var named TOKEN with that value.
4. If you dont want to upload in root folder make a folder copy its id and set a env var GDRIVE_PARENT_FOLDER and value id of desired folder.
5. Youre good to go.

> Use this torrent for testing or when downloading to setup drive it is well seeded and downloads in ~10s
>
> magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny

## Changing the sites used for searching

To change the pirate bay site, visit the site you would like to use search something there, copy the url eg. https://thepiratebay.org/search/whatisearched and replace the search with {term} so the url looks like https://thepiratebay.org/search/{term} ans set this to env var PIRATEBAY_SITE

Same, if you want to change the limetorrents site visit the site you want to use and search for something, then replace the thing you searched for with {term} so final url looks like https://limetorrents.at/search?search={term} and set this value to env var LIMETORRENT_SITE

For 1337x env var name will be O337X_SITE

## API Endpoints

prefix: https://\<project name>.herokuapp.com/api/v1

### For downloading:

| Endpoint          |    Params    |                                                                Return |
| :---------------- | :----------: | --------------------------------------------------------------------: |
| /torrent/download | link: string | { error: bool, link: string, infohash: string errorMessage?: string } |
| /torrent/list     |     none     |                    {error: bool, torrents: [ torrent, torrent, ... ]} |
| /torrent/remove   | link: string |                  { error: bool, errorMessage?: string, link: string } |
| /torrent/status   | link: string |                 {error: bool, status: torrent, errorMessage?: string} |

link is magnet uri of the torrent

```
torrent:  {
  magnetURI: string,
  speed: string,
  downloaded: string,
  total: string,
  progress: number,
  timeRemaining: number,
  redableTimeRemaining: string,
  downloadLink: string,
  status: string,
  done: bool
}
```

### For searching:

| Endpoint        |            Params            |                                                          Return |
| :-------------- | :--------------------------: | --------------------------------------------------------------: |
| /search/{site}  | query: string, site?: string | {error: bool, results: [ result, ... ], totalResults: number, } |
| /details/{site} |        query: string         |                                         {error: bool, torrent } |

query is what you want to search for or the link of the torrent page
site is the link to homepage of proxy to use must have a trailing '/'

```
result: {
  name: string,
  link: string,
  seeds: number,
  details: string
}

torrent: {
  title: string,
  info: string,
  downloadLink: string,
  details: [ { infoTitle: string, infoText: string } ]
}
```

sites available piratebay, 1337x, limetorrent
