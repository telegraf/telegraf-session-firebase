[![Build Status](https://img.shields.io/travis/telegraf/telegraf-session-firebase.svg?branch=master&style=flat-square)](https://travis-ci.org/telegraf/telegraf-session-firebase)
[![NPM Version](https://img.shields.io/npm/v/telegraf-session-firebase.svg?style=flat-square)](https://www.npmjs.com/package/telegraf-session-firebase)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# Firebase session for Telegraf

[Firebase](https://firebase.google.com/docs/admin/setup) powered session middleware for [Telegraf](https://github.com/telegraf/telegraf).

## Installation

```js
$ npm install telegraf-session-firebase
```

## Example

```js
const Telegraf = require('telegraf')
const firebaseSession = require('telegraf-session-firebase')
const admin = require('firebase-admin')

const serviceAccount = require('path/to/serviceAccountKey.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
})
const database = admin.database()

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(firebaseSession(database.ref('sessions')))
bot.on('text', (ctx, next) => {
  ctx.session.counter = ctx.session.counter || 0
  ctx.session.counter++
  return next()
})
bot.hears('/stats', ({ reply, session, from }) => reply(`${session.counter} messages from ${from.username}`))
bot.startPolling()

```

## API

### Options

* `property`: context property name (default: `session`)
* `getSessionKey`: session key resolver function (default: `(ctx) => any`)

Default implementation of `getSessionKey`:

```js
function getSessionKey(ctx) {
  if (!ctx.from || !ctx.chat) {
    return
  }
  return `${ctx.from.id}/${ctx.chat.id}`
}
```

### Destroying a session

To destroy a session simply set it to `null`.

```js
bot.on('text', (ctx) => {
  ctx.session = null
})

```
