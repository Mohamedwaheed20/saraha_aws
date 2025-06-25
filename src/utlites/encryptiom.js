import cryptojs from "crypto-js"


export const encription=async ({value,secretkey}={})=>{
   return cryptojs.AES.encrypt(JSON.stringify(value),secretkey).toString()
}
export const decruption=async ({cipher,secretkey}={})=>{
    return cryptojs.AES.decrypt(cipher,secretkey).toString(cryptojs.enc.Utf8)
}