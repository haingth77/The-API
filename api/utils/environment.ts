import { ENV, SIT_URL } from "./common";
import * as dotenv from 'dotenv'

dotenv.config({
    path: `.env`
})

export function getENV() {
    let env = process.env.ENV
    console.log("env is:::::: ", env)
    if (!env) {env = ENV}
    return env
}

enum Env {
    SIT = "SIT",
    UAT = "UAT"
}

export function getDataByEnv() {
    let env :string = getENV()
    switch(env) {
        case Env.SIT: 
            console.log("env is SIT")
            return {
                url: SIT_URL
        };

        case Env.UAT: 
            return {}

        default: 
            return{
                url: SIT_URL
        }
    }
}