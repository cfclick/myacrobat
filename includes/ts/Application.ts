///<reference path="global.d.ts"/>
import { Config } from "./Config";
import { Main }   from "./Main";
import { WorkBench } from "./WorkBench";
//import { IGlobalScope } from "./global";


let confirmation_text: any;


function start(path:string):void{
    let GLOBALSCOPE:{};
    //ContactLogger.logContactData();
    const elt2 = $("#greeting");
    let cfg = new Config();
    let main = new Main();
    let eventName = main.getParameterByName("event", window.location.href)
   
    switch (eventName) {
        case 'viewer.workbench':{
            GLOBALSCOPE = {'WorkBench' :  workBenchStart()};
            break;
        }
            
    
        default:
            break;
    }
    elt2.html("Hello Shirak Avakian");
    
}

function workBenchStart():WorkBench {
    let workbench = new WorkBench();
    return workbench;
}

class ContactLogger{
    static logContactData(){
        let CONTACT_DATA = [
            {
                DisplayText: 'help',
                Email: 'help@ss.com'
            }, {
                DisplayText: 'help2',
                Email: 'help2@ss.com'
            }, {
                DisplayText: 'help3',
                Email: 'help3@ss.com'
            }
        ];
        for (let contact of CONTACT_DATA ){
            console.log('Display Text : ' + contact.DisplayText + ', Email : '+ contact.Email);
        }
    }
}

window.onload = () =>{
    ContactLogger.logContactData();
}

$(document).ready( function () {

    start(window.location.pathname);  
   // window.globalVar = "This is global!";

});
