import { Config } from "./Config";
import { Main }   from "./Main";
import { WorkBench } from "./WorkBench";


let confirmation_text: any;
let global_scope:any;

function start(path:string):any{
   
    const elt2 = $("#greeting");
    let cfg = new Config();
    let main = new Main();
    let eventName = main.getParameterByName("event", window.location.href)
   
    switch (eventName) {
        case 'viewer.workbench':{
             global_scope = {'wb' : workBenchStart()};
            break;
        }
            
    
        default:
            break;
    }
    elt2.html("Hello Shirak Avakian");
    return global_scope;
}

function workBenchStart() {
    let workbench = new WorkBench();
    return workbench;
}


$(document).ready( function () {

    global_scope = start(window.location.pathname);  
   // window.globalVar = "This is global!";

});
