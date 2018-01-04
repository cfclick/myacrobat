import {Config} from "./Config";
import { Main } from "./Main";
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    const elt2 = $( divName);
    let cfg = new Config();
    let main = new Main();
    console.log(cfg.urls.main.index);
    console.log(main.ping());
    elt2.html( sayHello(name) );
}

showHello("#greeting", "Shirak");
