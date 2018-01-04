(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var Main_1 = require("./Main");
var WorkBench_1 = require("./WorkBench");
function start(path) {
    var elt2 = $("#greeting");
    var cfg = new Config_1.Config();
    var main = new Main_1.Main();
    var eventName = main.getParameterByName("event", window.location.href);
    console.log(cfg.urls.main.index);
    console.log(main.ping());
    console.log(path);
    console.log(eventName);
    switch (eventName) {
        case 'viewer.workbench': {
            workBenchStart();
            break;
        }
        default:
            break;
    }
    elt2.html("Hello Shirak Avakian");
}
function workBenchStart() {
    var workbench = new WorkBench_1.WorkBench();
    console.log("Workbench started");
    console.log(workbench.ping());
}
$(document).ready(function () {
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
},{"./Config":3,"./Main":4,"./WorkBench":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Base = /** @class */ (function () {
    function Base() {
        var base = this;
    }
    Base.prototype.getParameterByName = function (name, url) {
        if (!url)
            url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    return Base;
}());
exports.Base = Base;
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = /** @class */ (function () {
    function Config() {
        this.theActualServer = window.location.host;
        this.protocol = window.location.protocol;
        this.appFolder = "/";
        this.CGIScriptName = "";
        var path = this.protocol + "//" + this.theActualServer + this.appFolder + this.CGIScriptName;
        this.urls = new MyUrls(path);
    }
    return Config;
}());
exports.Config = Config;
var MyUrls = /** @class */ (function () {
    function MyUrls(_p) {
        this.main = new Main(_p);
        this.digitalsignature = new Digitalsignature(_p);
        this.stamp = new Stamp(_p);
        this.sanitize = new Sanitize(_p);
        this.redact = new Redact(_p);
        this.barcode = new Barcode(_p);
        this.properties = new Properties(_p);
        this.viewer = new Viewer(_p);
        this.root = new Root(_p);
    }
    return MyUrls;
}());
//Digital Signature Handler
var Main = /** @class */ (function () {
    function Main(_path) {
        this.index = _path + "?event=main.index";
        this.uploadFiles = _path + "?event=main.uploadFiles";
        this.readMetadata = _path + "?event=main.readMetadata";
        this.ping = _path + "?event=main.ping";
    }
    return Main;
}());
var Digitalsignature = /** @class */ (function () {
    function Digitalsignature(_path) {
        this.addField = _path + "?event=digitalsignature.addField";
    }
    return Digitalsignature;
}());
var Stamp = /** @class */ (function () {
    function Stamp(_path) {
        this.add = _path + "?event=stamp.add";
    }
    return Stamp;
}());
var Sanitize = /** @class */ (function () {
    function Sanitize(_path) {
        this.apply = _path + "?event=sanitize.apply";
    }
    return Sanitize;
}());
var Redact = /** @class */ (function () {
    function Redact(_path) {
        this.add = _path + "?event = redact.add";
    }
    return Redact;
}());
var Barcode = /** @class */ (function () {
    function Barcode(_path) {
        this.add = _path + "?event = barcode.add";
    }
    return Barcode;
}());
var Properties = /** @class */ (function () {
    function Properties(_path) {
        this.index = _path + "?event = properties.index";
        this.add = _path + "?event = properties.add";
        this.delete = _path + "?event = properties.delete";
        this.save = _path + "?event = properties.save";
        this.export = _path + "?event = properties.export";
        this.import = _path + "?event = properties.import";
    }
    return Properties;
}());
var Viewer = /** @class */ (function () {
    function Viewer(_path) {
        this.preview = _path + "?event = viewer.index";
        this.delete = _path + "?event = viewer.delete";
        this.restore = _path + "?event = viewer.save";
        this.save = _path + "?event = viewer.export";
        this.email = _path + "?event = viewer.import";
    }
    return Viewer;
}());
var Root = /** @class */ (function () {
    function Root(_path) {
        this.path = _path;
    }
    return Root;
}());
},{}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var Base_1 = require("./Base");
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.config = new Config_1.Config();
        _this.newuserpassword = $('#newuserpassword');
        _this.url_input = $('#url_input');
        _this.uploaded_file = $('#uploaded_file');
        //button
        _this.upload_pdf_btn = $('#upload_pdf_btn');
        _this.confirm_yes = $('#confirm_yes');
        _this.urltoPDF_btn = $('#urltoPDF_btn');
        _this.btnExpiredOk = $('#btnExpiredOk');
        _this.password_apply_btn = $('#password_apply_btn');
        //modal
        _this.confirmation_modal = $('#confirmation_modal');
        _this.fileUploadModal = $('#fileUploadModal');
        _this.loading_modal = $('#loading_modal');
        _this.errorModalDanger = $('#errorModalDanger');
        _this.session_expired_modal = $('#session_expired_modal');
        //DIV/span/label
        _this.fileUploadModal_body = $('#fileUploadModal_body');
        _this.confirmation_text = $('#confirmation_text');
        _this.preload_div = $("#preload_div");
        _this.action_label = $("#action_label");
        _this.errorModalMessage = $('#errorModalMessage');
        _this.setEventListeners();
        return _this;
    }
    Main.prototype.setEventListeners = function (event) {
        this.loading_modal.on('hidden.bs.modal', function () {
            $(this).data('bs.modal', null);
        });
        this.confirmation_modal.on('shown.bs.modal', function () {
            //  let redact = new Redact();
        });
        this.confirm_yes.on('click', function (event) {
            /* var view_model = {
                 fileName: workBench.fileName.val(),
                 password: workBench.passPdf.val()
             };
 
             var url = main.config.urls.sanitize.apply;
             $.ajax({
                 type: "post",
                 url: url,
                 data: view_model,
                 beforeSend: function (xhr) {
                     main.action_label.html('Sanitizing');
                     main.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                 },
                 success: function (data) {
 
                     if (data.fileName)
                         var fileName = data.fileName;
                     else
                         var fileName = data.FILENAME;
 
                     setTimeout(function () { main.loading_modal.modal('hide'); }, 1500);
                     if (data.success || data.SUCCESS)
                         workBench.preview(fileName, true);
                     else {
                         main.errorModalDanger.modal('show');
                         if (data.showerror)
                             main.errorModalMessage.html(data.showerror);
                         else
                             main.errorModalMessage.html(data);
                     }
                 },
                 error: function (objRequest, strError) {
                     setTimeout(function () { main.loading_modal.modal('hide'); }, 1500);
                     main.errorModalDanger.modal('show');
                     main.errorModalMessage.html(objRequest);
                 },
                 async: true
             });
 */
            this.confirmation_modal.modal('hide');
        });
    };
    Main.prototype.ping = function () {
        return "Main class constructed.";
    };
    return Main;
}(Base_1.Base));
exports.Main = Main;
},{"./Base":2,"./Config":3}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Main_1 = require("./Main");
var WorkBench = /** @class */ (function (_super) {
    __extends(WorkBench, _super);
    function WorkBench() {
        var _this = _super.call(this) || this;
        //buttons
        _this.reset_btn = $('#reset_btn');
        _this.delete_btn = $('#delete_btn');
        _this.email_btn = $('#email_btn');
        _this.send_email_btn = $('#send_email_btn');
        _this.restore_btn = $('#restore_btn');
        _this.sanitize_btn = $('#sanitize_btn');
        _this.property_btn = $('#property_btn');
        //inputs
        _this.fileName = $('#fileName');
        _this.passPdf = $('#passPdf');
        _this.your_email = $('#your_email');
        _this.your_subject = $('#your_subject');
        _this.your_message = $('#your_message');
        //modals
        _this.digital_signature_modal = $('#digital_signature_modal');
        _this.stamp_modal = $('#stamp_modal');
        _this.barcode_modal = $('#barcode_modal');
        _this.redact_modal = $('#redact_modal');
        _this.property_modal = $('#property_modal');
        _this.email_modal = $('#email_modal');
        _this.password_modal = $('#password_modal');
        //other/DIV
        _this.pdf_iframe = $('#pdf_iframe');
        _this.property_modal_body = $('#property_modal_body');
        _this.attached_fileName = $('#attached_fileName');
        _this.setEventListeners();
        return _this;
    }
    WorkBench.prototype.setEventListeners = function (event) {
        this.digital_signature_modal.on('shown.bs.modal', function () {
            //TODO: 
            /* if (typeof digitalSignature == 'undefined')
                 digitalSignature = new DigitalSignature();*/
        });
        this.redact_modal.on('shown.bs.modal', function () {
            //TODO: 
            /* if (typeof redact == 'undefined')
                 redact = new Redact();*/
        });
        this.stamp_modal.on('shown.bs.modal', function () {
            //TODO: 
            /* if (typeof stamp == 'undefined')
                 stamp = new Stamp();*/
        });
        this.password_modal.on('shown.bs.modal', function () {
            //TODO: 
            /*if (typeof protect == 'undefined')
                protect = new Protect();*/
        });
        this.barcode_modal.on('shown.bs.modal', function () {
            //TODO: 
            /*if (typeof barcode == 'undefined')
                barcode = new Barcode();*/
        });
        this.delete_btn.on('click', function () {
            var view_model = {
                fileName: this.fileName.val()
            };
            var url = this.config.urls.viewer.delete;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    this.action_label.html('Deleting the file');
                    this.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {
                    setTimeout(function () { this.loading_modal.modal('hide'); }, 1500);
                    var tp = $.type(data);
                    if (tp === 'string') {
                        this.session_expired_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                    }
                    else {
                        if (data.success || data.SUCCESS) {
                            //TODO: self.location = this.config.urls.root;
                            alert(this.config.urls.root);
                        }
                        else {
                            this.errorModalDanger.modal('show');
                            this.errorModalMessage.html(data);
                        }
                    }
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { this.loading_modal.modal('hide'); }, 1500);
                    this.errorModalDanger.modal('show');
                    this.errorModalMessage.html(objRequest);
                },
                async: true
            });
        });
        this.restore_btn.on('click', function (event) {
            var view_model = {
                fileName: this.fileName.val()
            };
            var url = this.config.urls.viewer.restore;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    this.action_label.html('Restoring');
                    this.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {
                    setTimeout(function () { this.loading_modal.modal('hide'); }, 1500);
                    if (data.fileName)
                        var fileName = data.fileName;
                    else
                        var fileName = data.FILENAME;
                    if (data.success || data.SUCCESS)
                        this.preview(fileName, true);
                    else {
                        this.errorModalDanger.modal('show');
                        this.errorModalMessage.html(data);
                    }
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { this.loading_modal.modal('hide'); }, 1500);
                },
                async: true
            });
        });
        this.email_btn.on('click', function () {
            this.attached_fileName.html(this.fileName.val());
            this.email_modal.modal('show');
        });
        this.send_email_btn.on('click', function () {
            var view_model = {
                fileName: this.fileName.val(),
                mailto: this.your_email.val(),
                subject: this.your_subject.val(),
                message: this.your_message.val()
            };
            var url = this.config.urls.viewer.email;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    this.email_modal.modal('hide');
                    this.action_label.html('Emailing');
                    this.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (fileName) {
                    setTimeout(function () { this.loading_modal.modal('hide'); }, 1500);
                    //TODO:  toastr.info('Email has been sent.');
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { this.loading_modal.modal('hide'); }, 1500);
                    this.email_modal.modal('hide');
                    //TODO:  toastr.error('Unable to send the email.');
                },
                async: true
            });
        });
        this.sanitize_btn.on('click', function (event) {
            this.confirmation_text.html('Are you sure you want to Sanitize the PDF?');
            this.confirmation_modal.modal('show');
        });
        this.property_btn.on('click', function (event) {
            var view_model = {
                fileName: this.fileName.val(),
                password: this.passPdf.val()
            };
            var url = this.config.urls.properties.index;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    this.action_label.html('Loading');
                    this.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (html) {
                    setTimeout(function () { this.loading_modal.modal('hide'); }, 1500);
                    this.property_modal_body.html(html);
                    this.property_modal.modal('show');
                    //TODO: properties = new Properties();
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { this.loading_modal.modal('hide'); }, 1500);
                },
                async: true
            });
            this.confirmation_modal.modal('hide');
        });
    };
    WorkBench.prototype.preview = function (fileName, istemp) {
        var url = this.config.urls.viewer.preview + "&fileName=" + fileName + '&istemp=' + istemp;
        this.pdf_iframe.attr("src", url);
    };
    WorkBench.prototype.ping = function () {
        return "WorkBench class constructed.";
    };
    return WorkBench;
}(Main_1.Main));
exports.WorkBench = WorkBench;
},{"./Main":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy90cy9BcHBsaWNhdGlvbi50cyIsImluY2x1ZGVzL3RzL0Jhc2UudHMiLCJpbmNsdWRlcy90cy9Db25maWcudHMiLCJpbmNsdWRlcy90cy9NYWluLnRzIiwiaW5jbHVkZXMvdHMvV29ya0JlbmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxtQ0FBa0M7QUFDbEMsK0JBQWdDO0FBQ2hDLHlDQUF3QztBQUV4QyxlQUFlLElBQVc7SUFFdEIsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVCLElBQUksR0FBRyxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7SUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztJQUN0QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QixNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLEtBQUssa0JBQWtCLEVBQUMsQ0FBQztZQUNyQixjQUFjLEVBQUUsQ0FBQztZQUNqQixLQUFLLENBQUM7UUFDVixDQUFDO1FBR0Q7WUFDSSxLQUFLLENBQUM7SUFDZCxDQUFDO0lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFF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bmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBNYWluIH0gICBmcm9tIFwiLi9NYWluXCI7XHJcbmltcG9ydCB7IFdvcmtCZW5jaCB9IGZyb20gXCIuL1dvcmtCZW5jaFwiO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQocGF0aDpzdHJpbmcpIHtcclxuXHJcbiAgICBjb25zdCBlbHQyID0gJChcIiNncmVldGluZ1wiKTtcclxuICAgIGxldCBjZmcgPSBuZXcgQ29uZmlnKCk7XHJcbiAgICBsZXQgbWFpbiA9IG5ldyBNYWluKCk7XHJcbiAgICBsZXQgZXZlbnROYW1lID0gbWFpbi5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJldmVudFwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcclxuICAgIGNvbnNvbGUubG9nKGNmZy51cmxzLm1haW4uaW5kZXgpO1xyXG4gICAgY29uc29sZS5sb2cobWFpbi5waW5nKCkpO1xyXG4gICAgY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICBjb25zb2xlLmxvZyhldmVudE5hbWUpO1xyXG4gICAgc3dpdGNoIChldmVudE5hbWUpIHtcclxuICAgICAgICBjYXNlICd2aWV3ZXIud29ya2JlbmNoJzp7XHJcbiAgICAgICAgICAgIHdvcmtCZW5jaFN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICBcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGVsdDIuaHRtbChcIkhlbGxvIFNoaXJhayBBdmFraWFuXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3b3JrQmVuY2hTdGFydCgpIHtcclxuICAgIGxldCB3b3JrYmVuY2ggPSBuZXcgV29ya0JlbmNoKCk7XHJcbiAgICBjb25zb2xlLmxvZyhcIldvcmtiZW5jaCBzdGFydGVkXCIpO1xyXG4gICAgY29uc29sZS5sb2cod29ya2JlbmNoLnBpbmcoKSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCBmdW5jdGlvbiAoKSB7XHJcbiAgICBzdGFydCh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xyXG59KTtcclxuLypcclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBhY3RpdmF0ZSBhbGwgZHJvcCBkb3duc1xyXG4gICAgJCgnLmRyb3Bkb3duLXRvZ2dsZScpLmRyb3Bkb3duKCk7XHJcbiAgICAvLyBUb29sdGlwc1xyXG4gICAgJChcIltyZWw9dG9vbHRpcF1cIikudG9vbHRpcCgpO1xyXG59KTtcclxuKi9cclxuLypcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICQoXCIuYnV0dG9uLWNvbGxhcHNlXCIpLnNpZGVOYXYoKTtcclxuICAgIGFwcGxpY2F0aW9uID0gdGhpcztcclxuXHJcbiAgICBpZiAoIWFwcGxpY2F0aW9uLm1haW4pXHJcbiAgICAgICAgYXBwbGljYXRpb24ubWFpbiA9IG5ldyBNYWluKCk7XHJcblxyXG4gICAgXHJcbiAgICAkKCcucG9wb3Zlci1kaXNtaXNzJykucG9wb3Zlcih7XHJcbiAgICAgICAgdHJpZ2dlcjogJ2ZvY3VzJ1xyXG4gICAgfSlcclxuXHJcbn0pOyovIiwiXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgbGV0IGJhc2UgPSB0aGlzO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQYXJhbWV0ZXJCeU5hbWUobmFtZTpzdHJpbmcsIHVybDpzdHJpbmcpOnN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF1cmwpIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpO1xyXG4gICAgICAgIGxldCByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSxcclxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgICAgIGlmICghcmVzdWx0cykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKCFyZXN1bHRzWzJdKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgdGhlQWN0dWFsU2VydmVyOiBzdHJpbmc7XHJcbiAgICBwcm90b2NvbDogc3RyaW5nO1xyXG4gICAgYXBwRm9sZGVyOiBzdHJpbmc7XHJcbiAgICBDR0lTY3JpcHROYW1lIDogc3RyaW5nO1xyXG4gICAgdXJsczogTXlVcmxzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudGhlQWN0dWFsU2VydmVyID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICAgICAgdGhpcy5wcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcclxuICAgICAgICB0aGlzLmFwcEZvbGRlciA9IFwiL1wiOyAgXHJcbiAgICAgICAgdGhpcy5DR0lTY3JpcHROYW1lID0gXCJcIjtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5wcm90b2NvbCArIFwiLy9cIiArIHRoaXMudGhlQWN0dWFsU2VydmVyICsgdGhpcy5hcHBGb2xkZXIgKyB0aGlzLkNHSVNjcmlwdE5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cmxzID0gbmV3IE15VXJscyggcGF0aCApO1xyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG59IFxyXG5cclxuY2xhc3MgTXlVcmxze1xyXG5cclxuICAgIG1haW46IE1haW47XHJcbiAgICBkaWdpdGFsc2lnbmF0dXJlOiBEaWdpdGFsc2lnbmF0dXJlO1xyXG4gICAgc3RhbXA6IFN0YW1wO1xyXG4gICAgc2FuaXRpemU6IFNhbml0aXplO1xyXG4gICAgcmVkYWN0OiBSZWRhY3Q7XHJcbiAgICBiYXJjb2RlOiBCYXJjb2RlO1xyXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcclxuICAgIHZpZXdlcjogVmlld2VyO1xyXG4gICAgcm9vdDogUm9vdDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMubWFpbiA9IG5ldyBNYWluKF9wKTtcclxuICAgICAgICB0aGlzLmRpZ2l0YWxzaWduYXR1cmUgPSBuZXcgRGlnaXRhbHNpZ25hdHVyZShfcCk7XHJcbiAgICAgICAgdGhpcy5zdGFtcCA9IG5ldyBTdGFtcChfcCk7XHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZSA9IG5ldyBTYW5pdGl6ZShfcCk7XHJcbiAgICAgICAgdGhpcy5yZWRhY3QgPSBuZXcgUmVkYWN0KF9wKTtcclxuICAgICAgICB0aGlzLmJhcmNvZGUgPSBuZXcgQmFyY29kZShfcCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoX3ApO1xyXG4gICAgICAgIHRoaXMudmlld2VyID0gbmV3IFZpZXdlcihfcCk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gbmV3IFJvb3QoX3ApO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbi8vRGlnaXRhbCBTaWduYXR1cmUgSGFuZGxlclxyXG5jbGFzcyBNYWluIHtcclxuICAgIGluZGV4OiBzdHJpbmc7XHJcbiAgICB1cGxvYWRGaWxlczogc3RyaW5nO1xyXG4gICAgcmVhZE1ldGFkYXRhOiBzdHJpbmc7XHJcbiAgICBwaW5nOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmluZGV4ID0gX3BhdGggKyBcIj9ldmVudD1tYWluLmluZGV4XCI7XHJcbiAgICAgICAgdGhpcy51cGxvYWRGaWxlcyA9IF9wYXRoICsgXCI/ZXZlbnQ9bWFpbi51cGxvYWRGaWxlc1wiO1xyXG4gICAgICAgIHRoaXMucmVhZE1ldGFkYXRhID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnJlYWRNZXRhZGF0YVwiO1xyXG4gICAgICAgIHRoaXMucGluZyA9IF9wYXRoICsgXCI/ZXZlbnQ9bWFpbi5waW5nXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERpZ2l0YWxzaWduYXR1cmUge1xyXG4gICAgYWRkRmllbGQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFkZEZpZWxkID0gX3BhdGggKyBcIj9ldmVudD1kaWdpdGFsc2lnbmF0dXJlLmFkZEZpZWxkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFN0YW1wIHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudD1zdGFtcC5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU2FuaXRpemV7XHJcbiAgICBhcHBseSA6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hcHBseSA9IF9wYXRoICsgXCI/ZXZlbnQ9c2FuaXRpemUuYXBwbHlcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVkYWN0IHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudCA9IHJlZGFjdC5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQmFyY29kZSB7XHJcbiAgICBhZGQgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmFkZCA9IF9wYXRoICsgXCI/ZXZlbnQgPSBiYXJjb2RlLmFkZFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQcm9wZXJ0aWVzICB7XHJcbiAgICBpbmRleDogc3RyaW5nO1xyXG4gICAgYWRkOiBzdHJpbmc7IFxyXG4gICAgZGVsZXRlOiBzdHJpbmc7IFxyXG4gICAgc2F2ZTogc3RyaW5nOyBcclxuICAgIGV4cG9ydDogc3RyaW5nOyAgICAgICAgXHJcbiAgICBpbXBvcnQ6IHN0cmluZzsgIFxyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pbmRleCAgPSBfcGF0aCArIFwiP2V2ZW50ID0gcHJvcGVydGllcy5pbmRleFwiO1xyXG4gICAgICAgIHRoaXMuYWRkICAgID0gX3BhdGggKyBcIj9ldmVudCA9IHByb3BlcnRpZXMuYWRkXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGUgPSBfcGF0aCArIFwiP2V2ZW50ID0gcHJvcGVydGllcy5kZWxldGVcIjtcclxuICAgICAgICB0aGlzLnNhdmUgICA9IF9wYXRoICsgXCI/ZXZlbnQgPSBwcm9wZXJ0aWVzLnNhdmVcIjtcclxuICAgICAgICB0aGlzLmV4cG9ydCA9IF9wYXRoICsgXCI/ZXZlbnQgPSBwcm9wZXJ0aWVzLmV4cG9ydFwiO1xyXG4gICAgICAgIHRoaXMuaW1wb3J0ID0gX3BhdGggKyBcIj9ldmVudCA9IHByb3BlcnRpZXMuaW1wb3J0XCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFZpZXdlciB7XHJcbiAgICBwcmV2aWV3IDogc3RyaW5nOyBcclxuICAgIGRlbGV0ZTogc3RyaW5nO1xyXG4gICAgcmVzdG9yZTogc3RyaW5nO1xyXG4gICAgc2F2ZTogc3RyaW5nO1xyXG4gICAgZW1haWw6IHN0cmluZztcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucHJldmlldyAgICA9IF9wYXRoICsgXCI/ZXZlbnQgPSB2aWV3ZXIuaW5kZXhcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZSAgICAgPSBfcGF0aCArIFwiP2V2ZW50ID0gdmlld2VyLmRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMucmVzdG9yZSAgICA9IF9wYXRoICsgXCI/ZXZlbnQgPSB2aWV3ZXIuc2F2ZVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZSAgICAgICA9IF9wYXRoICsgXCI/ZXZlbnQgPSB2aWV3ZXIuZXhwb3J0XCI7XHJcbiAgICAgICAgdGhpcy5lbWFpbCAgICAgID0gX3BhdGggKyBcIj9ldmVudCA9IHZpZXdlci5pbXBvcnRcIjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIFJvb3Qge1xyXG4gICAgIHBhdGg6c3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpe1xyXG4gICAgICAgICB0aGlzLnBhdGggPSBfcGF0aDtcclxuICAgICB9XHJcbiB9XHJcbiIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5leHBvcnQgY2xhc3MgTWFpbiBleHRlbmRzIEJhc2Uge1xyXG5cclxuICAgIGNvbmZpZzpDb25maWc7XHJcbiAgICBuZXd1c2VycGFzc3dvcmQ6IGFueTtcclxuICAgIHVybF9pbnB1dCA6IGFueTtcclxuICAgIHVwbG9hZGVkX2ZpbGU6IGFueTtcclxuXHJcbiAgICAvL2J1dHRvblxyXG4gICAgdXBsb2FkX3BkZl9idG46IGFueTtcclxuICAgIGNvbmZpcm1feWVzOiBhbnk7XHJcbiAgICB1cmx0b1BERl9idG46IGFueTtcclxuICAgIGJ0bkV4cGlyZWRPazogYW55O1xyXG4gICAgcGFzc3dvcmRfYXBwbHlfYnRuOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbFxyXG4gICAgY29uZmlybWF0aW9uX21vZGFsOiBhbnk7XHJcbiAgICBmaWxlVXBsb2FkTW9kYWw6IGFueTtcclxuICAgIGxvYWRpbmdfbW9kYWw6IGFueTtcclxuICAgIGVycm9yTW9kYWxEYW5nZXI6IGFueTtcclxuICAgIHNlc3Npb25fZXhwaXJlZF9tb2RhbDogYW55O1xyXG5cclxuICAgIC8vRElWL3NwYW4vbGFiZWxcclxuICAgIGZpbGVVcGxvYWRNb2RhbF9ib2R5OiBhbnk7XHJcbiAgICBjb25maXJtYXRpb25fdGV4dDogYW55O1xyXG4gICAgcHJlbG9hZF9kaXY6IGFueTtcclxuICAgIGFjdGlvbl9sYWJlbDogYW55O1xyXG4gICAgZXJyb3JNb2RhbE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpOyAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXd1c2VycGFzc3dvcmQgPSAkKCcjbmV3dXNlcnBhc3N3b3JkJyk7XHJcbiAgICAgICAgdGhpcy51cmxfaW5wdXQgPSAkKCcjdXJsX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy51cGxvYWRlZF9maWxlID0gJCgnI3VwbG9hZGVkX2ZpbGUnKTtcclxuXHJcbiAgICAgICAgLy9idXR0b25cclxuICAgICAgICB0aGlzLnVwbG9hZF9wZGZfYnRuID0gJCgnI3VwbG9hZF9wZGZfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5jb25maXJtX3llcyA9ICQoJyNjb25maXJtX3llcycpO1xyXG4gICAgICAgIHRoaXMudXJsdG9QREZfYnRuID0gJCgnI3VybHRvUERGX2J0bicpO1xyXG4gICAgICAgIHRoaXMuYnRuRXhwaXJlZE9rID0gJCgnI2J0bkV4cGlyZWRPaycpO1xyXG4gICAgICAgIHRoaXMucGFzc3dvcmRfYXBwbHlfYnRuID0gJCgnI3Bhc3N3b3JkX2FwcGx5X2J0bicpO1xyXG5cclxuICAgICAgICAvL21vZGFsXHJcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb25fbW9kYWwgPSAkKCcjY29uZmlybWF0aW9uX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5maWxlVXBsb2FkTW9kYWwgPSAkKCcjZmlsZVVwbG9hZE1vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nX21vZGFsID0gJCgnI2xvYWRpbmdfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLmVycm9yTW9kYWxEYW5nZXIgPSAkKCcjZXJyb3JNb2RhbERhbmdlcicpO1xyXG4gICAgICAgIHRoaXMuc2Vzc2lvbl9leHBpcmVkX21vZGFsID0gJCgnI3Nlc3Npb25fZXhwaXJlZF9tb2RhbCcpO1xyXG5cclxuICAgICAgICAvL0RJVi9zcGFuL2xhYmVsXHJcbiAgICAgICAgdGhpcy5maWxlVXBsb2FkTW9kYWxfYm9keSA9ICQoJyNmaWxlVXBsb2FkTW9kYWxfYm9keScpO1xyXG4gICAgICAgIHRoaXMuY29uZmlybWF0aW9uX3RleHQgPSAkKCcjY29uZmlybWF0aW9uX3RleHQnKTtcclxuICAgICAgICB0aGlzLnByZWxvYWRfZGl2ID0gJChcIiNwcmVsb2FkX2RpdlwiKTtcclxuICAgICAgICB0aGlzLmFjdGlvbl9sYWJlbCA9ICQoXCIjYWN0aW9uX2xhYmVsXCIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3JNb2RhbE1lc3NhZ2UgPSAkKCcjZXJyb3JNb2RhbE1lc3NhZ2UnKTtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNldEV2ZW50TGlzdGVuZXJzKCBldmVudD86RXZlbnQgKTp2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkaW5nX21vZGFsLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZGF0YSgnYnMubW9kYWwnLCBudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb25fbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgLy8gIGxldCByZWRhY3QgPSBuZXcgUmVkYWN0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uZmlybV95ZXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OkV2ZW50KSB7XHJcbiAgICAgICAgICAgLyogdmFyIHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogd29ya0JlbmNoLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHdvcmtCZW5jaC5wYXNzUGRmLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gbWFpbi5jb25maWcudXJscy5zYW5pdGl6ZS5hcHBseTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIG1haW4uYWN0aW9uX2xhYmVsLmh0bWwoJ1Nhbml0aXppbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBtYWluLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBtYWluLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtCZW5jaC5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFpbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW4uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW4uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBtYWluLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4qL1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbl9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGluZygpOnN0cmluZ3tcclxuICAgICAgICByZXR1cm4gXCJNYWluIGNsYXNzIGNvbnN0cnVjdGVkLlwiXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtNYWlufSBmcm9tIFwiLi9NYWluXCJcclxuZXhwb3J0IGNsYXNzIFdvcmtCZW5jaCBleHRlbmRzIE1haW57XHJcblxyXG4gICAgcmVzZXRfYnRuIDogYW55O1xyXG4gICAgZGVsZXRlX2J0bjogYW55O1xyXG4gICAgZW1haWxfYnRuOiBhbnk7XHJcbiAgICBzZW5kX2VtYWlsX2J0bjogYW55O1xyXG4gICAgcmVzdG9yZV9idG46IGFueTtcclxuICAgIHNhbml0aXplX2J0bjogYW55O1xyXG4gICAgcHJvcGVydHlfYnRuOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dHNcclxuICAgIGZpbGVOYW1lOiBhbnk7XHJcbiAgICBwYXNzUGRmOiBhbnk7XHJcbiAgICB5b3VyX2VtYWlsOiBhbnk7XHJcbiAgICB5b3VyX3N1YmplY3Q6IGFueTtcclxuICAgIHlvdXJfbWVzc2FnZTogYW55O1xyXG5cclxuXHJcbiAgICAvL21vZGFsc1xyXG4gICAgZGlnaXRhbF9zaWduYXR1cmVfbW9kYWw6IGFueTtcclxuICAgIHN0YW1wX21vZGFsOiBhbnk7XHJcbiAgICBiYXJjb2RlX21vZGFsOiBhbnk7XHJcbiAgICByZWRhY3RfbW9kYWw6IGFueTtcclxuICAgIHByb3BlcnR5X21vZGFsOiBhbnk7XHJcbiAgICBlbWFpbF9tb2RhbDogYW55O1xyXG4gICAgcGFzc3dvcmRfbW9kYWw6IGFueTtcclxuXHJcbiAgICAvL290aGVyL0RJVlxyXG4gICAgcGRmX2lmcmFtZTogYW55O1xyXG4gICAgcHJvcGVydHlfbW9kYWxfYm9keTogYW55O1xyXG4gICAgYXR0YWNoZWRfZmlsZU5hbWU6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5yZXNldF9idG4gPSAkKCcjcmVzZXRfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVfYnRuID0gJCgnI2RlbGV0ZV9idG4nKTtcclxuICAgICAgICB0aGlzLmVtYWlsX2J0biA9ICQoJyNlbWFpbF9idG4nKTtcclxuICAgICAgICB0aGlzLnNlbmRfZW1haWxfYnRuID0gJCgnI3NlbmRfZW1haWxfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5yZXN0b3JlX2J0biA9ICQoJyNyZXN0b3JlX2J0bicpO1xyXG4gICAgICAgIHRoaXMuc2FuaXRpemVfYnRuID0gJCgnI3Nhbml0aXplX2J0bicpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlfYnRuID0gJCgnI3Byb3BlcnR5X2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMuZmlsZU5hbWUgPSAkKCcjZmlsZU5hbWUnKTtcclxuICAgICAgICB0aGlzLnBhc3NQZGYgPSAkKCcjcGFzc1BkZicpO1xyXG4gICAgICAgIHRoaXMueW91cl9lbWFpbCA9ICQoJyN5b3VyX2VtYWlsJyk7XHJcbiAgICAgICAgdGhpcy55b3VyX3N1YmplY3QgPSAkKCcjeW91cl9zdWJqZWN0Jyk7XHJcbiAgICAgICAgdGhpcy55b3VyX21lc3NhZ2UgPSAkKCcjeW91cl9tZXNzYWdlJyk7XHJcblxyXG5cclxuICAgICAgICAvL21vZGFsc1xyXG4gICAgICAgIHRoaXMuZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwgPSAkKCcjZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnN0YW1wX21vZGFsID0gJCgnI3N0YW1wX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5iYXJjb2RlX21vZGFsID0gJCgnI2JhcmNvZGVfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnJlZGFjdF9tb2RhbCA9ICQoJyNyZWRhY3RfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnByb3BlcnR5X21vZGFsID0gJCgnI3Byb3BlcnR5X21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5lbWFpbF9tb2RhbCA9ICQoJyNlbWFpbF9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMucGFzc3dvcmRfbW9kYWwgPSAkKCcjcGFzc3dvcmRfbW9kYWwnKTtcclxuXHJcbiAgICAgICAgLy9vdGhlci9ESVZcclxuICAgICAgICB0aGlzLnBkZl9pZnJhbWUgPSAkKCcjcGRmX2lmcmFtZScpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWxfYm9keSA9ICQoJyNwcm9wZXJ0eV9tb2RhbF9ib2R5Jyk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hlZF9maWxlTmFtZSA9ICQoJyNhdHRhY2hlZF9maWxlTmFtZScpO1xyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICBcclxuICAgICAgICB0aGlzLmRpZ2l0YWxfc2lnbmF0dXJlX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAvL1RPRE86IFxyXG4gICAgICAgICAgIC8qIGlmICh0eXBlb2YgZGlnaXRhbFNpZ25hdHVyZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIGRpZ2l0YWxTaWduYXR1cmUgPSBuZXcgRGlnaXRhbFNpZ25hdHVyZSgpOyovXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJlZGFjdF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgLy9UT0RPOiBcclxuICAgICAgICAgICAvKiBpZiAodHlwZW9mIHJlZGFjdCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHJlZGFjdCA9IG5ldyBSZWRhY3QoKTsqL1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFtcF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgLy9UT0RPOiBcclxuICAgICAgICAgICAvKiBpZiAodHlwZW9mIHN0YW1wID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgc3RhbXAgPSBuZXcgU3RhbXAoKTsqL1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXNzd29yZF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzogXHJcbiAgICAgICAgICAgIC8qaWYgKHR5cGVvZiBwcm90ZWN0ID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgcHJvdGVjdCA9IG5ldyBQcm90ZWN0KCk7Ki9cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmFyY29kZV9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzogXHJcbiAgICAgICAgICAgIC8qaWYgKHR5cGVvZiBiYXJjb2RlID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgYmFyY29kZSA9IG5ldyBCYXJjb2RlKCk7Ki9cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gdGhpcy5jb25maWcudXJscy52aWV3ZXIuZGVsZXRlO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25fbGFiZWwuaHRtbCgnRGVsZXRpbmcgdGhlIGZpbGUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aGlzLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25fZXhwaXJlZF9tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogc2VsZi5sb2NhdGlvbiA9IHRoaXMuY29uZmlnLnVybHMucm9vdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KHRoaXMuY29uZmlnLnVybHMucm9vdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5yZXN0b3JlX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6RXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSB0aGlzLmNvbmZpZy51cmxzLnZpZXdlci5yZXN0b3JlO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25fbGFiZWwuaHRtbCgnUmVzdG9yaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aGlzLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmVtYWlsX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoZWRfZmlsZU5hbWUuaHRtbCh0aGlzLmZpbGVOYW1lLnZhbCgpKTtcclxuICAgICAgICAgICAgdGhpcy5lbWFpbF9tb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZW5kX2VtYWlsX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIG1haWx0bzogdGhpcy55b3VyX2VtYWlsLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgc3ViamVjdDogdGhpcy55b3VyX3N1YmplY3QudmFsKCksXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLnlvdXJfbWVzc2FnZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9IHRoaXMuY29uZmlnLnVybHMudmlld2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWFpbF9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uX2xhYmVsLmh0bWwoJ0VtYWlsaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGZpbGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgIC8vVE9ETzogIHRvYXN0ci5pbmZvKCdFbWFpbCBoYXMgYmVlbiBzZW50LicpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtYWlsX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAvL1RPRE86ICB0b2FzdHIuZXJyb3IoJ1VuYWJsZSB0byBzZW5kIHRoZSBlbWFpbC4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OiBFdmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbl90ZXh0Lmh0bWwoJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBTYW5pdGl6ZSB0aGUgUERGPycpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbl9tb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OiBFdmVudCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3NQZGYudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1cmwgPSB0aGlzLmNvbmZpZy51cmxzLnByb3BlcnRpZXMuaW5kZXg7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbl9sYWJlbC5odG1sKCdMb2FkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWxfYm9keS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAvL1RPRE86IHByb3BlcnRpZXMgPSBuZXcgUHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb25fbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZXZpZXcoIGZpbGVOYW1lOnN0cmluZywgaXN0ZW1wOmJvb2xlYW4gKTp2b2lke1xyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmNvbmZpZy51cmxzLnZpZXdlci5wcmV2aWV3ICsgXCImZmlsZU5hbWU9XCIgKyBmaWxlTmFtZSArICcmaXN0ZW1wPScgKyBpc3RlbXA7XHJcbiAgICAgICAgdGhpcy5wZGZfaWZyYW1lLmF0dHIoXCJzcmNcIiwgdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIldvcmtCZW5jaCBjbGFzcyBjb25zdHJ1Y3RlZC5cIlxyXG4gICAgfVxyXG59Il19
