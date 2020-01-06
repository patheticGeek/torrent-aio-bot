# Torrent all-in-one bot

Lorem ipsum i am too lazy figure what it does yourself

You might be lazy too so here ya go:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/patheticGeek/torrent-aio-bot)

TODO after deploy:

Set the enviorment variables. Go to heroku dashboard open the app then go to Settings > Config vars > Reveal Config vars.
1. Set a variable with key "SITE" and value is the link of your site. eg. "https://\<project name>.herokuapp.com".
2. Set a variable with key "TELEGRAM_TOKEN" and token of your bot as value. [How to get token](https://core.telegram.org/bots/#creating-a-new-bot)

## Bot commands -
| Command                |                                                                                Usage |
| :--------------------- | -----------------------------------------------------------------------------------: |
| /start                 |                                                       Gives some info to get started |
| /status                |                          Gives status about the server such as disk space and uptime |
| /uptime                |                                                           Gives uptime of the server |
| /diskinfo {path}       |                                                Gives the space available on the path |
| /search {site} {query} | Searches the site for given query. Site can be "piratebay", "1337x" or "limetorrent" |
| /details {site} {link} |                                           Gets the details of torrent on given link. |

## API Endpoints -

prefix: /api/v1

### For downloading:

| Endpoint        |    Params    |                                                              Return |
| :-------------- | :----------: | ------------------------------------------------------------------: |
| /torrent/start  | link: string |                { error: bool, link: string, errorMessage?: string } |
| /torrent/list   |     none     |                                           [ torrent, torrent, ... ] |
| /torrent/remove | link: string |                              { error: bool, errorMessage?: string } |
| /torrent/status | link: string | {link: string, error: bool, status: torrent, errorMessage?: string} |

link is magnet uri of the torrent

```
torrent: {
  magnetURI: string,
  name: string,
  downloaded: string,
  total: string,
  progress: number,
  timeRemaining: string,
  done: bool,
  files: [ file, file, ... ]
}

file: {
  name: string,
  downloaded: string,
  total: string,
  progress: number,
  done: bool,
  path: string
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
