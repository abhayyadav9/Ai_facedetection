import express from "express";
import { getAllUsers, getUserById } from "../controller/userController.js";

const router = express.Router();

router.get('/get-all', getAllUsers);
router.get('/get-by-id/:id', getUserById);

export default router;