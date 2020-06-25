const AuthService = require("../auth/auth-service")

function requireAuth(req, res, next) {
  console.log('requireAuth')
  const authToken = req.get('Authorization') || ''

  let bearerToken
  if (!authToken.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }

  try {
    // console.log('try-block')
    const payload = AuthService.verifyJwt(bearerToken)
    console.log(payload)
    AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub,
    )
      .then(user => {
        if (!user)
          return res.status(401).json({ error: 'Unauthorized request' })
          
        req.user = user
        console.log(user)
        next()
      })
      .catch(err => {
        console.error(err)
        next(err)
      })
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized request' })
  }

}

module.exports = {
  requireAuth,
}