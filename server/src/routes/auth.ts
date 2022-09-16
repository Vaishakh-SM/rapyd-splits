import {Express, Router} from "express"

const router = Router()

router.get("/trial", (req,res)=>{
    console.log("Trial worked");

    res.send("Done");
})

export default router;