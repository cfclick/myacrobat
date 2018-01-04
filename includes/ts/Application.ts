import { Config } from "./Config";
import { Main }   from "./Main";
import { WorkBench } from "./WorkBench";

function start(path:string) {

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
            workBenchStart();
            break;
        }
            
    
        default:
            break;
    }
    elt2.html("Hello Shirak Avakian");
}

function workBenchStart() {
    let workbench = new WorkBench();
    console.log("Workbench started");
    console.log(workbench.ping());
}

$(document).ready( function () {
    start(window.location.pathname);
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