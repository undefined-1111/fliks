// // // // // // /// // // // // // ////
// ███████╗██╗░░░░░██╗██╗░░██╗░██████╗ //
// ██╔════╝██║░░░░░██║██║░██╔╝██╔════╝ //
// █████╗░░██║░░░░░██║█████═╝░╚█████╗░ //
// ██╔══╝░░██║░░░░░██║██╔═██╗░░╚═══██╗ //
// ██║░░░░░███████╗██║██║░╚██╗██████╔╝ //
// ╚═╝░░░░░╚══════╝╚═╝╚═╝░░╚═╝╚═════╝░ //
// // // // // // // // // // // // // //

// by undefined-1111 // fuller // www.fuller.ml

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const site = require("./db/models/site.js")
mongoose.connect("mongodb://localhost:2000/fliks", {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => console.log("[ERR] Не удалось подключиться с базой данных"))
app.use(express.static("./views/public/"))
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs")

// Рендер главной страницы
app.get("/", (req,res) => {
    res.render("public/index")
})

// Когда юзер подтвердил модальное окно
app.post("/create", async(req,res) => {
    console.log(req.body.create)
    if(!req.body.create) {
        res.render("public/writeuri")
        return
    } // Если пользователь не указал ссылку то просто рендерим страницу об этом
    const sitemodel = require("./db/models/site.js") // получаем схему
    const thissite = await sitemodel.findOne({ // ищем схему
        URI: req.body.create
    })
    if(!thissite) { // если нету в бд данного сайта то создаем
        let siteid = Math.floor((Math.random() * 123456789) + 1)
        await sitemodel.create({
            _id: siteid,
            date: new Date().getDate(),
            size: 0,
            URI: req.body.create
        })
        res.render("public/createdstat", {
            id: siteid
        })
        return
    } else { // если есть то говорим юзеру это
        res.render("public/tujh")
        return
    }
})

app.get("/send-stat", async(req,res) => {
    if(!req.query.id) return
    const sitemodel = require("./db/models/site.js") // получаем схему
    const stat = await sitemodel.findOne({ // ищем схему
        _id: req.query.id
    })
    if(!stat) {
        await sitemodel.create({
            id: req.query.id,
            date: new Date().getDate(),
            size: 0,
        })
    }
    await stat.size++
    await stat.save()
    await res.send("Ты отправил запрос статистики")
})

app.get("/get-in-chart", async(reqd, resd) => {
    if(!reqd.query.id) return
    global.date = []
    global.size = []
    const stat = require("./db/models/site.js")
    await stat.find({ _id: reqd.query.id }).sort({date: 1}).exec(async (err,res) => {
        if(res.length === 0) date = "Статистика пустая!"
        else if (res.length > 0) { for(i = 0; i < res.length; i++) {
            let currentdb = res[i]

            await date.push(currentdb.date)
            await size.push(currentdb.size)
        }}
        // await date.sort(function(a, b){return a - b});
        // await size.sort(function(a, b){return a - b});
        resd.render("public/exchart", {
            _date: String(date),
            _size: size.join(",")
        })
    })
})

app.listen(3000, () => {
    console.log("[LOG] Сервер запущен")
})