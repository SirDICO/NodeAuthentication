import { Router } from 'express'
import {register, login, updateUser} from '../controllers/authController.js'

const router = Router();
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/update').patch(updateUser)

export default router;