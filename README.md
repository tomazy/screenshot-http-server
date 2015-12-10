# Screenshot server

Periodically takes screenshots of the X's root window and serves them through http.

I use it to visually inspect running selenium tests in a headless box with Xvfb.

## Requirements:
- npm
- ImageMagick

## Installation:
```
npm install -g screenshot-http-server
```

## Running:
```
PORT=8989 screenshot-http-server
```

Point browser to `http://<host name>:8989` 
