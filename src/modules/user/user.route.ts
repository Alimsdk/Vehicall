import { Router } from "express";
import {  deleteSingleUser, getAllUsers, updateSingleUser } from "./user.controller";
import auth from "../../middleware/auth";

const router=Router();


router.get("/",auth("admin"),getAllUsers);

router.put("/:userId",auth("user","admin"),updateSingleUser);

router.delete("/:userId",auth("admin"),deleteSingleUser);

export {router as userRouter};