# Torrent all-in-one bot

Lorem ipsum i am too lazy figure what it does yourself

You might be lazy too so here ya go:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/patheticGeek/torrent-aio-bot)

TODO after deploy:
1. Go to the build packs section in settings and click add buildpack and enter "https://github.com/jontewks/puppeteer-heroku-buildpack.git" as buildpack url then click save changes.
2. Set the enviorment variables. Go to heroku dashboard open the app then go to Settings > Config vars > Reveal Config vars.
3. Set a variable with key "SITE" and value is the link of your site. eg. "https://\<project name>.herokuapp.com". This is important to keep bot alive or server will stop after 30 min of inactivity.
4. Set a variable with key "TELEGRAM_TOKEN" and token of your bot as value. [How to get token](https://core.telegram.org/bots/#creating-a-new-bot)

Heroku dosent detect third party buildpack required for using puppeteer so it is recommended to git clone and then deploy to heroku after adding buildpack manually

If you do not deploy with git clone search wont work downloading will still work

## API Endpoints -

prefix: /api/v1

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
  timeRemaining: number(in s),
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
site: piratebay | 1337x | limetorrent

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
