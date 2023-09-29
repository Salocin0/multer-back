import express from 'express';
import passport from 'passport';
import { DTOsession } from '../DAO/DTO/session.dto.js';
import { selectedLogger } from '../utils/logger.js';
import { userService } from '../services/users.service.js';

export const loginRouter = express.Router();

loginRouter.post('/register', passport.authenticate('register', { failureRedirect: '/error-autentificacion' }), async (req, res) => {
  return res.redirect('/login');
});

loginRouter.post('/login', passport.authenticate('login', { failureRedirect: '/error-autentificacion' }), async (req, res) => {
  const user = req.user;
  if (user.username == 'adminCoder@coder.com' && user.password == 'adminCod3r123') {
    req.session.user = {
      email: 'adminCoder@coder.com',
      firstName: 'admin',
      lastName: 'admin',
      rol: 'admin',
      _id: req.user._id.toString(),
    };
  }

  const userupdated = await userService.updatelastConection(user._id)

  req.session.user = {
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    rol: req.user.rol,
    _id: req.user._id.toString(),
  };

  return res.redirect('/vista/products');
});

loginRouter.get('/logout', async (req, res) => {
  const user = req.user;
  const userupdated = await userService.updatelastConection(user._id)
  req.session.destroy((err) => {
    if (err) {
      selectedLogger.error('Error al cerrar sesión:', err);
    }
    res.redirect('/');
  });
});

loginRouter.use('/current', (req, res) => {
  const userSession = new DTOsession(req.session.user);
  return res.status(200).json({
    status: 'success',
    msg: 'datos de la session',
    payload: userSession || {},
  });
});
