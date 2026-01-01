import { Router } from "express";
import { createUser, loginUser } from "./auth.controller";

const router=Router();

router.post("/signup",createUser);

router.post("/signin",loginUser);

export {router as authRouter};