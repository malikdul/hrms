import * as express from 'express';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import Cat from './models/cat';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();

  // Cats
  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  //router.route('/forgotpassowrd').post(userCtrl.forgotpassword);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user/sendregmail').get(userCtrl.sendregmail);
  router.route('/user/verifiedmail/:token').get(userCtrl.verify);
  //router.route('/user/sendmail').get(userCtrl.sendmail);

  router.route('/user/resetpasssendmail').get(userCtrl.resetpasssendmail);
  router.route('/user/resetpassword').put(userCtrl.resetpasswordverify);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/forgotpassword').post(userCtrl.forgotpassword);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
