import express from 'express';
import { test, updateUser } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router=express.Router();

//test api
router.get('/test',test);
router.put('/update/:userId',verifyToken,updateUser);

export default router;