# Screenshot server

Periodically takes screenshots of the X's root window and serves them through http.

Can be used to visually inspect running selenium tests in a headless box with Xvfb.

## Requirements:
- npm
- imagemagick

## Installation:
```
npm install
```

## Running:
```
PORT=8989 node server.js
```

Point browser to `http://<host name>:8989` 
