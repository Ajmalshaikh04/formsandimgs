const express = require("express");
require('dotenv').config()
const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary").v2
const app = express();


cloudinary.config({
    // cloud_name: process.env.CLOUD_NAME,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})

app.set("view engine", "ejs")

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
}))

app.get("/myget", (req, res) => {
    // console.log(req.body);
    console.log(req.query);

    res.send(req.query)
})
app.post("/mypost", async (req, res) => {
    console.log(req.body);
    // console.log(req.query);
    console.log(req.files);

    let result;
    let imgArray = []
    //case for multiple img
    if (req.files) {
        for (let index = 0; index < req.files.myfile.length; index++) {
            result = await cloudinary.uploader.upload(req.files.myfile[index].tempFilePath, {
                folder: "lcoUsers"
            })
            imgArray.push({
                public_id: result.public_id,
                secure_url: result.secure_url,
            })
        }
    }

    //Usercase for single img upload
    // let file = req.files.myfile
    // result = await cloudinary.uploader.upload(file.tempFilePath, {
    //     folder: "lcoUsers"
    // })

    console.log(result);

    details = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        result,
        imgArray,
    }
    console.log(details);

    res.send(details)
    // res.send(req.body)
})


app.get("/getform", (req, res) => {
    res.render("getform")
})
app.get("/postform", (req, res) => {
    res.render("postform")
})



app.listen(4000, () => console.log(`Server is up and runnning at ${4000}`));