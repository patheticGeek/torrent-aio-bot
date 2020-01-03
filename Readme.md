# API Endpoints-

| Endpoint          |    Params    |                                                              Return |
| :---------------- | :----------: | ------------------------------------------------------------------: |
| /torrent/download | link: string |                { error: bool, link: string, errorMessage?: string } |
| /torrent/list     |     none     |                                           [ torrent, torrent, ... ] |
| /torrent/remove   | link: string |                              { error: bool, errorMessage?: string } |
| /torrent/status   | link: string | {link: string, error: bool, status: torrent, errorMessage?: string} |

link is magnet uri of the torrent

```
torrent: {
  magnetURI: string,
  name: string,
  downloaded: string,
  total: string,
  progress: number,
  timeRemaining: string,
  done: bool
}
```
