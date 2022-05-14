
import { create, Whatsapp, Message, SocketState, CreateOptions } from 'venom-bot';
import  parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js';

export interface QrCode  {
    qrCode: string, 
    asciiQR: string, 
    attempt: number, 
    urlCode?: string
}

class Sender {
    private client : Whatsapp
    private isConnected : boolean
    private qr : QrCode

    
    get isConnect() : boolean {
        return this.isConnected;
    }

    
    get qrCode() : QrCode {
        return this.qr
    }

    constructor(){

        this.initializer()

    }

    async sendText(to : string, body: string){

        //this.client.sendText('5562982385797@c.us', 'Olá mundo')

        if(!isValidPhoneNumber(to, 'BR')){
            throw new Error('this number is not valid')
        }
        let phoneNumber = this.getPhoneNumber(to)

        return await this.client.sendText(phoneNumber, body)
    }

    private getPhoneNumber(number : string) {
        if(!isValidPhoneNumber(number, 'BR')){
            throw new Error('this number is not valid')
        }
        let phoneNumber = parsePhoneNumber(number, 'BR').format('E.164').replace('+', '') as string
        phoneNumber = phoneNumber.includes('@c.us') 
            ? phoneNumber 
            : `${phoneNumber}@c.us`

        return phoneNumber
    }

    async sendImg(to : string, filePath: string, fileName?: string, caption?: string){
        if(!isValidPhoneNumber(to, 'BR')){
            throw new Error('this number is not valid')
        }

        let phoneNumber = this.getPhoneNumber(to)
        return await this.client.sendImage(phoneNumber, filePath, fileName, caption);
    }

    async sendImgBase64(to : string, filePath: string, fileName?: string, caption?: string){

        if(!isValidPhoneNumber(to, 'BR')){
            throw new Error('this number is not valid')
        }

        let phoneNumber = this.getPhoneNumber(to)
        return await this.client.sendImageFromBase64(phoneNumber, filePath, fileName, caption);
    }


    private initializer(){

        const qr = (qrCode: string, asciiQR: string, attempt: number, urlCode?: string) => {

            this.qr = {qrCode, asciiQR, attempt, urlCode}

        }

        const status = (statusGet: string, session: string) => { 
            /*return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable 
            || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp
            || successPageWhatsapp || waitForLogin || waitChat || successChat */

            console.log('Status atual: ' + statusGet)

        }

        const start = (cliente : Whatsapp) => {


            this.client = cliente
            cliente.onStateChange((state) => {
                this.isConnected = state === SocketState.CONNECTED
            })

            cliente.isConnected()
                .then(() => this.isConnected = true)
                .catch(() => this.isConnected = false)

        }

        // let param : CreateOptions = {

        //     session: "senser",
        //     catchQR : qr,
        //     statusFind : status

        // }

        // create(param)
        //     .then((client) =>  start(client))
        //     .catch((error) => console.error(error))

        create('sender',  qr)
            .then((client) =>  start(client))
            .catch((error) => console.error(error))
        
            
    }

    
}

export default Sender