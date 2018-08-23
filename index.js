module.exports = (sessionRef, opts) => {
  const options = Object.assign({
    property: 'session',
    getSessionKey: (ctx) => ctx.from && ctx.chat && `${ctx.from.id}/${ctx.chat.id}`
  }, opts)

  function getSession (key) {
    return sessionRef.child(key).once('value')
      .then((snapshot) => snapshot.val())
  }

  function saveSession (key, session) {
    if (!session || Object.keys(session).length === 0) {
      return sessionRef.child(key).remove()
    }
    return sessionRef.child(key).set(session)
  }

  return (ctx, next) => {
    const key = options.getSessionKey(ctx)
    if (!key) {
      return next()
    }
    return getSession(key).then((value) => {
      let session = value || {}
      Object.defineProperty(ctx, options.property, {
        get: function () { return session },
        set: function (newValue) { session = Object.assign({}, newValue) }
      })
      return next().then(() => saveSession(key, session))
    })
  }
}
