import {Config} from "./Config";
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    const elt2 = $( divName);
    let cfg = new Config();
    console.log(cfg.urls.main.index);
    elt2.html( sayHello(name) );
}

showHello("#greeting", "Shirak");