import express from 'express';
import login from './login';
import * as Blocks from "systemblocks/class";

const router = express.Router();

router.use("/login", Blocks.Controller.contollerToRouter((new login()).handleRequest()));

export default router;
