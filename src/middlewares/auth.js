import TokenManager from '../security/token-manager.js';
import response from '../utils/response.js';

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (token && token.indexOf('Bearer ') !== -1) {
    try {
      const user = TokenManager.verify(
        token.split('Bearer ')[1],
        process.env.ACCESS_TOKEN_KEY, // NOTE: why is this here? this could be in TokenManager
      );
      req.user = user;
      return next();
    } catch (err) {
      return response(res, 401, err.message, null);
    }
  }

  return response(res, 401, 'Unauthorized', null);
}

export default authenticateToken;
