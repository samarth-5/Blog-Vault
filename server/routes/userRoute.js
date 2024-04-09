import express from 'express';
import { test, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router=express.Router();

//test api
router.get('/test',test);
router.put('/update/:userId',verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser);

export default router;