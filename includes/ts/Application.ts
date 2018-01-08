import { Config } from "./Config";
import { Main }   from "./Main";
import { WorkBench } from "./WorkBench";


let confirmation_text: any;
let globale_scope:any;

function start(path:string) {
    let gl = {};
    const elt2 = $("#greeting");
    let cfg = new Config();
    let main = new Main();
    let eventName = main.getParameterByName("event", window.location.href)
    console.log(cfg.urls.main.index);
    console.log(main.ping());
    console.log(path);
    console.log(eventName);
    switch (eventName) {
        case 'viewer.workbench':{
            gl = {'workbench': workBenchStart()};
            break;
        }
            
    
        default:
            break;
    }
    elt2.html("Hello Shirak Avakian");

    return gl;
}

function workBenchStart() {
    let workbench = new WorkBench();
   return workbench;
}


$(document).ready( function () {

    globale_scope =  start(window.location.pathname);
    console.log(globale_scope.workbench);
});
/*
$(function () {
    // activate all drop downs
    $('.dropdown-toggle').dropdown();
    // Tooltips
    $("[rel=tooltip]").tooltip();
});
*/
/*
$(document).ready(function () {

    $(".button-collapse").sideNav();
    application = this;

    if (!application.main)
        application.main = new Main();

    
    $('.popover-dismiss').popover({
        trigger: 'focus'
    })

});*/