import express from 'express'
const router = express.Router()
import auth from '../middleware/auth.js'
// import controllers
import { 
    deleteUser, 
    findUserByAccountNumber, 
    findUserByIdentityNumber, 
    getAllUsers, 
    updateUser 
} from "../controllers/user.controller.js"
import { createUser, login } from "../controllers/auth.controller.js"

router.route("/register").post(createUser)
router.route("/login").post(login)

router.use(auth)

router.route("/user/accountNumber/:accountNumber").get(findUserByAccountNumber)
router.route("/user/identityNumber/:identityNumber").get(findUserByIdentityNumber)
router.route("/users").get(getAllUsers)
router.route("/user/update/:id").put(updateUser)
router.route("/user/delete/:id").delete(deleteUser)

export default router;