# Torrent all-in-one bot

Lorem ipsum i am too lazy figure what it does yourself

You might be lazy too so here ya go:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/patheticGeek/torrent-aio-bot)

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
