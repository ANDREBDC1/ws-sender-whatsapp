import  express, { Request, Response}  from "express"
import { parse } from "path"
import Sender from "./sender"


const  sender = new Sender()
const app  = express()

app.use(express.json({ limit : '50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: false}))

app.get('/status', async (req : Request, res : Response) => {

    try {
        return res.send({
            qrCode: sender.qrCode,
            connected: sender.isConnect

        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status : "error", message : error})
    }

})

app.post('/send', async (req : Request, res : Response) => {

    try {
        const {numbers, number, messager, imgBase64} = req.body


        if(numbers != undefined && Array.isArray(numbers)){
            var numbersSends : Array<string> = []
        
            numbersSends = Object.values(numbers)
            numbersSends.forEach( async (numTo) => {
                if(imgBase64 != undefined){
                    await sender.sendImgBase64(numTo, imgBase64, 'img1')
                }
                
                await sender.sendText(numTo, messager)
            })
            return res.status(200).json()

        }else if(numbers != undefined){

            return res.status(500).json({ status : 'error', messager: 'numbres not is Array!'})
        }


        if(imgBase64 != undefined){
            await sender.sendImgBase64(number, imgBase64)
        }
        await sender.sendText(number, messager)
        return res.status(200).json()
        
       
    } catch (error) {
        console.error(error)
        res.status(500).json({ status : "error", message : error})
    }
})

app.listen(3000)