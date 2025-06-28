import { Router } from 'express';
import * as authservice from  "./service/auth-service.js"
import { validationmidellware } from '../../middelware/validation-middelware.js';
import { signupschema } from '../../validator/auth-schema.js';

const authcontroller = Router();

authcontroller.post('/signup', validationmidellware(signupschema),authservice.signupService);
authcontroller.get('/verify/:token', authservice.verifyService);
authcontroller.post('/signin', authservice.signinService);
authcontroller.post('/refreshtoken', authservice.refreshtokenService);
authcontroller.post('/signout', authservice.signoutService);
authcontroller.patch('/forgetpassword', authservice.forgetpasswordService);
authcontroller.put('/resetpassword', authservice.resetpasswordService);

export default authcontroller;
