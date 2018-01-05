(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var Main_1 = require("./Main");
var WorkBench_1 = require("./WorkBench");
var confirmation_text;
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
},{"./Config":4,"./Main":5,"./WorkBench":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("./Common");
var Config_1 = require("./Config");
var Base = /** @class */ (function () {
    function Base() {
        var base = this;
        this.config = new Config_1.Config();
    }
    Base.prototype.preview = function (fileName, istemp) {
        var url = this.config.urls.viewer.preview + "&fileName=" + fileName + '&istemp=' + istemp;
        this.getCommon().pdf_iframe.attr("src", url);
    };
    Base.prototype.getConfig = function () {
        return this.config;
    };
    Base.prototype.getCommon = function () {
        return new Common_1.Common();
    };
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
},{"./Common":3,"./Config":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common = /** @class */ (function () {
    function Common() {
        //text
        this.confirmation_text = $('#confirmation_text');
        this.action_label = $("#action_label");
        this.errorModalMessage = $('#errorModalMessage');
        //modal
        this.confirmation_modal = $('#confirmation_modal');
        this.loading_modal = $('#loading_modal');
        this.errorModalDanger = $('#errorModalDanger');
        this.session_expired_modal = $('#session_expired_modal');
        //input
        this.fileName = $('#fileName');
        this.passPdf = $('#passPdf');
        //other
        this.pdf_iframe = $('#pdf_iframe');
    }
    return Common;
}());
exports.Common = Common;
},{}],4:[function(require,module,exports){
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
        this.add = _path + "?event=redact.add";
    }
    return Redact;
}());
var Barcode = /** @class */ (function () {
    function Barcode(_path) {
        this.add = _path + "?event=barcode.add";
    }
    return Barcode;
}());
var Properties = /** @class */ (function () {
    function Properties(_path) {
        this.index = _path + "?event=properties.index";
        this.add = _path + "?event=properties.add";
        this.delete = _path + "?event=properties.delete";
        this.save = _path + "?event=properties.save";
        this.export = _path + "?event=properties.export";
        this.import = _path + "?event=properties.import";
    }
    return Properties;
}());
var Viewer = /** @class */ (function () {
    function Viewer(_path) {
        this.preview = _path + "?event=viewer.preview";
        this.delete = _path + "?event=viewer.delete";
        this.restore = _path + "?event=viewer.restore";
        this.save = _path + "?event=viewer.save";
        this.email = _path + "?event=viewer.email";
    }
    return Viewer;
}());
var Root = /** @class */ (function () {
    function Root(_path) {
        this.path = _path;
    }
    return Root;
}());
},{}],5:[function(require,module,exports){
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
var Base_1 = require("./Base");
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    //action_label: any;
    // errorModalMessage: any;
    function Main() {
        var _this = _super.call(this) || this;
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
        //this.confirmation_modal = $('#confirmation_modal');
        _this.fileUploadModal = $('#fileUploadModal');
        // this.loading_modal = $('#loading_modal');
        // this.errorModalDanger = $('#errorModalDanger');
        //  this.session_expired_modal = $('#session_expired_modal');
        //DIV/span/label
        _this.fileUploadModal_body = $('#fileUploadModal_body');
        _this.preload_div = $("#preload_div");
        // this.action_label = $("#action_label");
        // this.errorModalMessage = $('#errorModalMessage');
        _this.setEventListeners();
        return _this;
    }
    Main.prototype.setEventListeners = function (event) {
        var config = _super.prototype.getConfig.call(this);
        var common = _super.prototype.getCommon.call(this);
        var main = this;
        common.loading_modal.on('hidden.bs.modal', function () {
            $(this).data('bs.modal', null);
        });
        common.confirmation_modal.on('shown.bs.modal', function () {
            //  let redact = new Redact();
        });
        this.confirm_yes.on('click', function (event) {
            var view_model = {
                fileName: common.fileName.val(),
                password: common.passPdf.val()
            };
            var url = config.urls.sanitize.apply;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    common.action_label.html('Sanitizing');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {
                    if (data.fileName)
                        var fileName = data.fileName;
                    else
                        var fileName = data.FILENAME;
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    if (data.success || data.SUCCESS)
                        main.preview(fileName, true);
                    else {
                        common.errorModalDanger.modal('show');
                        if (data.showerror)
                            common.errorModalMessage.html(data.showerror);
                        else
                            common.errorModalMessage.html(data);
                    }
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    common.errorModalDanger.modal('show');
                    common.errorModalMessage.html(objRequest);
                },
                async: true
            });
            common.confirmation_modal.modal('hide');
        });
    };
    Main.prototype.ping = function () {
        return "Main class constructed.";
    };
    return Main;
}(Base_1.Base));
exports.Main = Main;
},{"./Base":2}],6:[function(require,module,exports){
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
var Base_1 = require("./Base");
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
        // this.fileName = $('#fileName');
        //  this.passPdf = $('#passPdf');
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
        // this.pdf_iframe = $('#pdf_iframe');
        _this.property_modal_body = $('#property_modal_body');
        _this.attached_fileName = $('#attached_fileName');
        //this.common = super.getCommon();
        _this.setEventListeners();
        return _this;
    }
    WorkBench.prototype.setEventListeners = function (event) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var workbench = this;
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
                fileName: common.fileName.val()
            };
            var url = config.urls.viewer.delete;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    common.action_label.html('Deleting the file');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    var tp = $.type(data);
                    if (tp === 'string') {
                        common.session_expired_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                    }
                    else {
                        if (data.success || data.SUCCESS) {
                            self.location.href = config.urls.root.path;
                        }
                        else {
                            common.errorModalDanger.modal('show');
                            common.errorModalMessage.html(data);
                        }
                    }
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    common.errorModalDanger.modal('show');
                    common.errorModalMessage.html(objRequest);
                },
                async: true
            });
        });
        this.restore_btn.on('click', function (event) {
            var view_model = {
                fileName: common.fileName.val()
            };
            var url = config.urls.viewer.restore;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    common.action_label.html('Restoring');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    if (data.fileName)
                        var fileName = data.fileName;
                    else
                        var fileName = data.FILENAME;
                    if (data.success || data.SUCCESS)
                        workbench.preview(fileName, true);
                    else {
                        common.errorModalDanger.modal('show');
                        common.errorModalMessage.html(data);
                    }
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                },
                async: true
            });
        });
        this.email_btn.on('click', function () {
            workbench.attached_fileName.html(common.fileName.val());
            workbench.email_modal.modal('show');
        });
        this.send_email_btn.on('click', function () {
            var view_model = {
                fileName: common.fileName.val(),
                mailto: workbench.your_email.val(),
                subject: workbench.your_subject.val(),
                message: workbench.your_message.val()
            };
            var url = config.urls.viewer.email;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    workbench.email_modal.modal('hide');
                    common.action_label.html('Emailing');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    var tp = $.type(data);
                    if (tp === 'string') {
                        common.errorModalDanger.modal('show');
                        common.errorModalMessage.html(data);
                    }
                    else {
                        if (data.success || data.SUCCESS) {
                            toastr.info('Email has been sent.');
                        }
                        else {
                            common.errorModalDanger.modal('show');
                            common.errorModalMessage.html(data);
                        }
                    }
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    workbench.email_modal.modal('hide');
                    toastr.error('Unable to send the email.');
                },
                async: true
            });
        });
        this.sanitize_btn.on('click', function (event) {
            common.confirmation_text.html('Are you sure you want to Sanitize the PDF?');
            common.confirmation_modal.modal('show');
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
    /*
        public preview( fileName:string, istemp:boolean ):void{
            let url = this.config.urls.viewer.preview + "&fileName=" + fileName + '&istemp=' + istemp;
            this.pdf_iframe.attr("src", url);
        }
    */
    WorkBench.prototype.ping = function () {
        return "WorkBench class constructed.";
    };
    return WorkBench;
}(Base_1.Base));
exports.WorkBench = WorkBench;
},{"./Base":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy90cy9BcHBsaWNhdGlvbi50cyIsImluY2x1ZGVzL3RzL0Jhc2UudHMiLCJpbmNsdWRlcy90cy9Db21tb24udHMiLCJpbmNsdWRlcy90cy9Db25maWcudHMiLCJpbmNsdWRlcy90cy9NYWluLnRzIiwiaW5jbHVkZXMvdHMvV29ya0JlbmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxtQ0FBa0M7QUFDbEMsK0JBQWdDO0FBQ2hDLHlDQUF3QztBQUV4QyxJQUFJLGlCQUFzQixDQUFDO0FBRTNCLGVBQWUsSUFBVztJQUV0QixJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztJQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO0lBQ3RCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN0RSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZCLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsS0FBSyxrQkFBa0IsRUFBQyxDQUFDO1lBQ3JCLGNBQWMsRUFBRSxDQUFDO1lBQ2pCLEtBQUssQ0FBQztRQUNWLENBQUM7UUFHRDtZQUNJLEtBQUssQ0FBQztJQUNkLENBQUM7SUFDRCxJQUFJ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b0JBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNsRixDQUFDO2dCQUNELE9BQU8sRUFBRSxVQUFVLElBQUk7b0JBQ25CLFVBQVUsQ0FBQyxjQUFjLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNwRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFbkMsc0NBQXNDO2dCQUN6QyxDQUFDO2dCQUNELEtBQUssRUFBRSxVQUFVLFVBQVUsRUFBRSxRQUFRO29CQUNqQyxVQUFVLENBQUMsY0FBYyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEUsQ0FBQztnQkFDRCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBQ0w7Ozs7O01BS0U7SUFDUyx3QkFBSSxHQUFYO1FBQ0ksTUFBTSxDQUFDLDhCQUE4QixDQUFBO0lBQ3pDLENBQUM7SUFDTCxnQkFBQztBQUFELENBdlNBLEFBdVNDLENBdlM4QixXQUFJLEdBdVNsQztBQXZTWSw4QkFBUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgTWFpbiB9ICAgZnJvbSBcIi4vTWFpblwiO1xyXG5pbXBvcnQgeyBXb3JrQmVuY2ggfSBmcm9tIFwiLi9Xb3JrQmVuY2hcIjtcclxuXHJcbmxldCBjb25maXJtYXRpb25fdGV4dDogYW55O1xyXG5cclxuZnVuY3Rpb24gc3RhcnQocGF0aDpzdHJpbmcpIHtcclxuXHJcbiAgICBjb25zdCBlbHQyID0gJChcIiNncmVldGluZ1wiKTtcclxuICAgIGxldCBjZmcgPSBuZXcgQ29uZmlnKCk7XHJcbiAgICBsZXQgbWFpbiA9IG5ldyBNYWluKCk7XHJcbiAgICBsZXQgZXZlbnROYW1lID0gbWFpbi5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJldmVudFwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcclxuICAgIGNvbnNvbGUubG9nKGNmZy51cmxzLm1haW4uaW5kZXgpO1xyXG4gICAgY29uc29sZS5sb2cobWFpbi5waW5nKCkpO1xyXG4gICAgY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICBjb25zb2xlLmxvZyhldmVudE5hbWUpO1xyXG4gICAgc3dpdGNoIChldmVudE5hbWUpIHtcclxuICAgICAgICBjYXNlICd2aWV3ZXIud29ya2JlbmNoJzp7XHJcbiAgICAgICAgICAgIHdvcmtCZW5jaFN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICBcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGVsdDIuaHRtbChcIkhlbGxvIFNoaXJhayBBdmFraWFuXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3b3JrQmVuY2hTdGFydCgpIHtcclxuICAgIGxldCB3b3JrYmVuY2ggPSBuZXcgV29ya0JlbmNoKCk7XHJcbiAgICBjb25zb2xlLmxvZyhcIldvcmtiZW5jaCBzdGFydGVkXCIpO1xyXG4gICAgY29uc29sZS5sb2cod29ya2JlbmNoLnBpbmcoKSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCBmdW5jdGlvbiAoKSB7XHJcbiAgICBzdGFydCh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xyXG59KTtcclxuLypcclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBhY3RpdmF0ZSBhbGwgZHJvcCBkb3duc1xyXG4gICAgJCgnLmRyb3Bkb3duLXRvZ2dsZScpLmRyb3Bkb3duKCk7XHJcbiAgICAvLyBUb29sdGlwc1xyXG4gICAgJChcIltyZWw9dG9vbHRpcF1cIikudG9vbHRpcCgpO1xyXG59KTtcclxuKi9cclxuLypcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICQoXCIuYnV0dG9uLWNvbGxhcHNlXCIpLnNpZGVOYXYoKTtcclxuICAgIGFwcGxpY2F0aW9uID0gdGhpcztcclxuXHJcbiAgICBpZiAoIWFwcGxpY2F0aW9uLm1haW4pXHJcbiAgICAgICAgYXBwbGljYXRpb24ubWFpbiA9IG5ldyBNYWluKCk7XHJcblxyXG4gICAgXHJcbiAgICAkKCcucG9wb3Zlci1kaXNtaXNzJykucG9wb3Zlcih7XHJcbiAgICAgICAgdHJpZ2dlcjogJ2ZvY3VzJ1xyXG4gICAgfSlcclxuXHJcbn0pOyovIiwiaW1wb3J0IHsgQ29tbW9uIH0gZnJvbSBcIi4vQ29tbW9uXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgKiBhcyB0b2FzdHIgZnJvbSBcInRvYXN0clwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2Uge1xyXG4gICAgY29uZmlnOkNvbmZpZztcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGxldCBiYXNlID0gdGhpcztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJldmlldyhmaWxlTmFtZTogc3RyaW5nLCBpc3RlbXA6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5jb25maWcudXJscy52aWV3ZXIucHJldmlldyArIFwiJmZpbGVOYW1lPVwiICsgZmlsZU5hbWUgKyAnJmlzdGVtcD0nICsgaXN0ZW1wO1xyXG4gICAgICAgIHRoaXMuZ2V0Q29tbW9uKCkucGRmX2lmcmFtZS5hdHRyKFwic3JjXCIsIHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbmZpZygpOkNvbmZpZ3tcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbW1vbigpOkNvbW1vbntcclxuICAgICAgICByZXR1cm4gbmV3IENvbW1vbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQYXJhbWV0ZXJCeU5hbWUobmFtZTpzdHJpbmcsIHVybDpzdHJpbmcpOnN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF1cmwpIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpO1xyXG4gICAgICAgIGxldCByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSxcclxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgICAgIGlmICghcmVzdWx0cykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKCFyZXN1bHRzWzJdKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbW1vbiB7XHJcblxyXG4gICAgLy90ZXh0XHJcbiAgICBjb25maXJtYXRpb25fdGV4dDogYW55O1xyXG4gICAgYWN0aW9uX2xhYmVsOiBhbnk7XHJcbiAgICBlcnJvck1vZGFsTWVzc2FnZTogYW55O1xyXG5cclxuICAgIC8vaW5wdXRcclxuICAgIGZpbGVOYW1lOiBhbnk7XHJcbiAgICBwYXNzUGRmOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbFxyXG4gICAgY29uZmlybWF0aW9uX21vZGFsOiBhbnk7XHJcbiAgICBsb2FkaW5nX21vZGFsOiBhbnk7XHJcbiAgICBlcnJvck1vZGFsRGFuZ2VyOiBhbnk7XHJcbiAgICBzZXNzaW9uX2V4cGlyZWRfbW9kYWw6IGFueTtcclxuXHJcbiAgICAvL090aGVyXHJcbiAgICBwZGZfaWZyYW1lOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7ICAgICAgIFxyXG4gICAgICAgIC8vdGV4dFxyXG4gICAgICAgIHRoaXMuY29uZmlybWF0aW9uX3RleHQgID0gJCgnI2NvbmZpcm1hdGlvbl90ZXh0Jyk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25fbGFiZWwgICAgICAgPSAkKFwiI2FjdGlvbl9sYWJlbFwiKTtcclxuICAgICAgICB0aGlzLmVycm9yTW9kYWxNZXNzYWdlICA9ICQoJyNlcnJvck1vZGFsTWVzc2FnZScpO1xyXG5cclxuICAgICAgICAvL21vZGFsXHJcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb25fbW9kYWwgICAgID0gJCgnI2NvbmZpcm1hdGlvbl9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMubG9hZGluZ19tb2RhbCAgICAgICAgICA9ICQoJyNsb2FkaW5nX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5lcnJvck1vZGFsRGFuZ2VyICAgICAgID0gJCgnI2Vycm9yTW9kYWxEYW5nZXInKTtcclxuICAgICAgICB0aGlzLnNlc3Npb25fZXhwaXJlZF9tb2RhbCAgPSAkKCcjc2Vzc2lvbl9leHBpcmVkX21vZGFsJyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRcclxuICAgICAgICB0aGlzLmZpbGVOYW1lID0gJCgnI2ZpbGVOYW1lJyk7XHJcbiAgICAgICAgdGhpcy5wYXNzUGRmICA9ICQoJyNwYXNzUGRmJyk7XHJcblxyXG4gICAgICAgIC8vb3RoZXJcclxuICAgICAgICB0aGlzLnBkZl9pZnJhbWUgPSAkKCcjcGRmX2lmcmFtZScpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgdGhlQWN0dWFsU2VydmVyOiBzdHJpbmc7XHJcbiAgICBwcm90b2NvbDogc3RyaW5nO1xyXG4gICAgYXBwRm9sZGVyOiBzdHJpbmc7XHJcbiAgICBDR0lTY3JpcHROYW1lIDogc3RyaW5nO1xyXG4gICAgdXJsczogTXlVcmxzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudGhlQWN0dWFsU2VydmVyID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICAgICAgdGhpcy5wcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcclxuICAgICAgICB0aGlzLmFwcEZvbGRlciA9IFwiL1wiOyAgXHJcbiAgICAgICAgdGhpcy5DR0lTY3JpcHROYW1lID0gXCJcIjtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5wcm90b2NvbCArIFwiLy9cIiArIHRoaXMudGhlQWN0dWFsU2VydmVyICsgdGhpcy5hcHBGb2xkZXIgKyB0aGlzLkNHSVNjcmlwdE5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cmxzID0gbmV3IE15VXJscyggcGF0aCApO1xyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG59IFxyXG5cclxuY2xhc3MgTXlVcmxze1xyXG5cclxuICAgIG1haW46IE1haW47XHJcbiAgICBkaWdpdGFsc2lnbmF0dXJlOiBEaWdpdGFsc2lnbmF0dXJlO1xyXG4gICAgc3RhbXA6IFN0YW1wO1xyXG4gICAgc2FuaXRpemU6IFNhbml0aXplO1xyXG4gICAgcmVkYWN0OiBSZWRhY3Q7XHJcbiAgICBiYXJjb2RlOiBCYXJjb2RlO1xyXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcclxuICAgIHZpZXdlcjogVmlld2VyO1xyXG4gICAgcm9vdDogUm9vdDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMubWFpbiA9IG5ldyBNYWluKF9wKTtcclxuICAgICAgICB0aGlzLmRpZ2l0YWxzaWduYXR1cmUgPSBuZXcgRGlnaXRhbHNpZ25hdHVyZShfcCk7XHJcbiAgICAgICAgdGhpcy5zdGFtcCA9IG5ldyBTdGFtcChfcCk7XHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZSA9IG5ldyBTYW5pdGl6ZShfcCk7XHJcbiAgICAgICAgdGhpcy5yZWRhY3QgPSBuZXcgUmVkYWN0KF9wKTtcclxuICAgICAgICB0aGlzLmJhcmNvZGUgPSBuZXcgQmFyY29kZShfcCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoX3ApO1xyXG4gICAgICAgIHRoaXMudmlld2VyID0gbmV3IFZpZXdlcihfcCk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gbmV3IFJvb3QoX3ApO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbi8vRGlnaXRhbCBTaWduYXR1cmUgSGFuZGxlclxyXG5jbGFzcyBNYWluIHtcclxuICAgIGluZGV4OiBzdHJpbmc7XHJcbiAgICB1cGxvYWRGaWxlczogc3RyaW5nO1xyXG4gICAgcmVhZE1ldGFkYXRhOiBzdHJpbmc7XHJcbiAgICBwaW5nOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmluZGV4ID0gX3BhdGggKyBcIj9ldmVudD1tYWluLmluZGV4XCI7XHJcbiAgICAgICAgdGhpcy51cGxvYWRGaWxlcyA9IF9wYXRoICsgXCI/ZXZlbnQ9bWFpbi51cGxvYWRGaWxlc1wiO1xyXG4gICAgICAgIHRoaXMucmVhZE1ldGFkYXRhID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnJlYWRNZXRhZGF0YVwiO1xyXG4gICAgICAgIHRoaXMucGluZyA9IF9wYXRoICsgXCI/ZXZlbnQ9bWFpbi5waW5nXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERpZ2l0YWxzaWduYXR1cmUge1xyXG4gICAgYWRkRmllbGQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFkZEZpZWxkID0gX3BhdGggKyBcIj9ldmVudD1kaWdpdGFsc2lnbmF0dXJlLmFkZEZpZWxkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFN0YW1wIHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudD1zdGFtcC5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU2FuaXRpemV7XHJcbiAgICBhcHBseSA6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hcHBseSA9IF9wYXRoICsgXCI/ZXZlbnQ9c2FuaXRpemUuYXBwbHlcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVkYWN0IHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudD1yZWRhY3QuYWRkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEJhcmNvZGUge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PWJhcmNvZGUuYWRkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb3BlcnRpZXMgIHtcclxuICAgIGluZGV4OiBzdHJpbmc7XHJcbiAgICBhZGQ6IHN0cmluZzsgXHJcbiAgICBkZWxldGU6IHN0cmluZzsgXHJcbiAgICBzYXZlOiBzdHJpbmc7IFxyXG4gICAgZXhwb3J0OiBzdHJpbmc7ICAgICAgICBcclxuICAgIGltcG9ydDogc3RyaW5nOyAgXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmluZGV4ICA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5pbmRleFwiO1xyXG4gICAgICAgIHRoaXMuYWRkICAgID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmFkZFwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZSAgID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLnNhdmVcIjtcclxuICAgICAgICB0aGlzLmV4cG9ydCA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5leHBvcnRcIjtcclxuICAgICAgICB0aGlzLmltcG9ydCA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5pbXBvcnRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVmlld2VyIHtcclxuICAgIHByZXZpZXcgOiBzdHJpbmc7IFxyXG4gICAgZGVsZXRlOiBzdHJpbmc7XHJcbiAgICByZXN0b3JlOiBzdHJpbmc7XHJcbiAgICBzYXZlOiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3ICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIucHJldmlld1wiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlICAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLmRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMucmVzdG9yZSAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLnJlc3RvcmVcIjtcclxuICAgICAgICB0aGlzLnNhdmUgICAgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5zYXZlXCI7XHJcbiAgICAgICAgdGhpcy5lbWFpbCAgICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIuZW1haWxcIjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIFJvb3Qge1xyXG4gICAgIHBhdGg6c3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpe1xyXG4gICAgICAgICB0aGlzLnBhdGggPSBfcGF0aDtcclxuICAgICB9XHJcbiB9XHJcbiIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5leHBvcnQgY2xhc3MgTWFpbiBleHRlbmRzIEJhc2Uge1xyXG4gICAvLyBtYWluOnRoaXM7XHJcbiAgICBjb25maWc6Q29uZmlnO1xyXG4gICAgbmV3dXNlcnBhc3N3b3JkOiBhbnk7XHJcbiAgICB1cmxfaW5wdXQgOiBhbnk7XHJcbiAgICB1cGxvYWRlZF9maWxlOiBhbnk7XHJcblxyXG4gICAgLy9idXR0b25cclxuICAgIHVwbG9hZF9wZGZfYnRuOiBhbnk7XHJcbiAgICBjb25maXJtX3llczogYW55O1xyXG4gICAgdXJsdG9QREZfYnRuOiBhbnk7XHJcbiAgICBidG5FeHBpcmVkT2s6IGFueTtcclxuICAgIHBhc3N3b3JkX2FwcGx5X2J0bjogYW55O1xyXG5cclxuICAgIC8vbW9kYWxcclxuICAgIC8vY29uZmlybWF0aW9uX21vZGFsOiBhbnk7XHJcbiAgICBmaWxlVXBsb2FkTW9kYWw6IGFueTtcclxuICAgIC8vbG9hZGluZ19tb2RhbDogYW55O1xyXG4gICAgLy9lcnJvck1vZGFsRGFuZ2VyOiBhbnk7XHJcbiAgICAvL3Nlc3Npb25fZXhwaXJlZF9tb2RhbDogYW55O1xyXG5cclxuICAgIC8vRElWL3NwYW4vbGFiZWxcclxuICAgIGZpbGVVcGxvYWRNb2RhbF9ib2R5OiBhbnk7XHJcbiAgICBwcmVsb2FkX2RpdjogYW55O1xyXG4gICAgLy9hY3Rpb25fbGFiZWw6IGFueTtcclxuICAgLy8gZXJyb3JNb2RhbE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpOyAgICAgIFxyXG4gICAgICAgIHRoaXMubmV3dXNlcnBhc3N3b3JkID0gJCgnI25ld3VzZXJwYXNzd29yZCcpO1xyXG4gICAgICAgIHRoaXMudXJsX2lucHV0ID0gJCgnI3VybF9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMudXBsb2FkZWRfZmlsZSA9ICQoJyN1cGxvYWRlZF9maWxlJyk7XHJcblxyXG4gICAgICAgIC8vYnV0dG9uXHJcbiAgICAgICAgdGhpcy51cGxvYWRfcGRmX2J0biA9ICQoJyN1cGxvYWRfcGRmX2J0bicpO1xyXG4gICAgICAgIHRoaXMuY29uZmlybV95ZXMgPSAkKCcjY29uZmlybV95ZXMnKTtcclxuICAgICAgICB0aGlzLnVybHRvUERGX2J0biA9ICQoJyN1cmx0b1BERl9idG4nKTtcclxuICAgICAgICB0aGlzLmJ0bkV4cGlyZWRPayA9ICQoJyNidG5FeHBpcmVkT2snKTtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkX2FwcGx5X2J0biA9ICQoJyNwYXNzd29yZF9hcHBseV9idG4nKTtcclxuXHJcbiAgICAgICAgLy9tb2RhbFxyXG4gICAgICAgIC8vdGhpcy5jb25maXJtYXRpb25fbW9kYWwgPSAkKCcjY29uZmlybWF0aW9uX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5maWxlVXBsb2FkTW9kYWwgPSAkKCcjZmlsZVVwbG9hZE1vZGFsJyk7XHJcbiAgICAgICAvLyB0aGlzLmxvYWRpbmdfbW9kYWwgPSAkKCcjbG9hZGluZ19tb2RhbCcpO1xyXG4gICAgICAgLy8gdGhpcy5lcnJvck1vZGFsRGFuZ2VyID0gJCgnI2Vycm9yTW9kYWxEYW5nZXInKTtcclxuICAgICAgLy8gIHRoaXMuc2Vzc2lvbl9leHBpcmVkX21vZGFsID0gJCgnI3Nlc3Npb25fZXhwaXJlZF9tb2RhbCcpO1xyXG5cclxuICAgICAgICAvL0RJVi9zcGFuL2xhYmVsXHJcbiAgICAgICAgdGhpcy5maWxlVXBsb2FkTW9kYWxfYm9keSA9ICQoJyNmaWxlVXBsb2FkTW9kYWxfYm9keScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucHJlbG9hZF9kaXYgPSAkKFwiI3ByZWxvYWRfZGl2XCIpO1xyXG4gICAgICAgLy8gdGhpcy5hY3Rpb25fbGFiZWwgPSAkKFwiI2FjdGlvbl9sYWJlbFwiKTtcclxuICAgICAgIC8vIHRoaXMuZXJyb3JNb2RhbE1lc3NhZ2UgPSAkKCcjZXJyb3JNb2RhbE1lc3NhZ2UnKTtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKCBldmVudD86RXZlbnQgKTp2b2lkIHtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBtYWluID0gdGhpcztcclxuXHJcbiAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdicy5tb2RhbCcsIG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIC8vICBsZXQgcmVkYWN0ID0gbmV3IFJlZGFjdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbmZpcm1feWVzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDpFdmVudCkge1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogY29tbW9uLnBhc3NQZGYudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy5zYW5pdGl6ZS5hcHBseTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnU2FuaXRpemluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW4ucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbW1vbi5jb25maXJtYXRpb25fbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpbmcoKTpzdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIFwiTWFpbiBjbGFzcyBjb25zdHJ1Y3RlZC5cIlxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBDb21tb24gfSBmcm9tIFwiLi9Db21tb25cIjtcclxuaW1wb3J0IHtCYXNlfSBmcm9tIFwiLi9CYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ya0JlbmNoIGV4dGVuZHMgQmFzZXtcclxuXHJcbiAgICBjb25maWc6IENvbmZpZztcclxuICAgIGNvbW1vbjogQ29tbW9uO1xyXG4gICAgcmVzZXRfYnRuIDogYW55O1xyXG4gICAgZGVsZXRlX2J0bjogYW55O1xyXG4gICAgZW1haWxfYnRuOiBhbnk7XHJcbiAgICBzZW5kX2VtYWlsX2J0bjogYW55O1xyXG4gICAgcmVzdG9yZV9idG46IGFueTtcclxuICAgIHNhbml0aXplX2J0bjogYW55O1xyXG4gICAgcHJvcGVydHlfYnRuOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dHNcclxuICAgLy8gZmlsZU5hbWU6IGFueTtcclxuICAgLy8gcGFzc1BkZjogYW55O1xyXG4gICAgeW91cl9lbWFpbDogYW55O1xyXG4gICAgeW91cl9zdWJqZWN0OiBhbnk7XHJcbiAgICB5b3VyX21lc3NhZ2U6IGFueTtcclxuXHJcblxyXG4gICAgLy9tb2RhbHNcclxuICAgIGRpZ2l0YWxfc2lnbmF0dXJlX21vZGFsOiBhbnk7XHJcbiAgICBzdGFtcF9tb2RhbDogYW55O1xyXG4gICAgYmFyY29kZV9tb2RhbDogYW55O1xyXG4gICAgcmVkYWN0X21vZGFsOiBhbnk7XHJcbiAgICBwcm9wZXJ0eV9tb2RhbDogYW55O1xyXG4gICAgZW1haWxfbW9kYWw6IGFueTtcclxuICAgIHBhc3N3b3JkX21vZGFsOiBhbnk7XHJcblxyXG4gICAgLy9vdGhlci9ESVZcclxuICAgLy8gcGRmX2lmcmFtZTogYW55O1xyXG4gICAgcHJvcGVydHlfbW9kYWxfYm9keTogYW55O1xyXG4gICAgYXR0YWNoZWRfZmlsZU5hbWU6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5yZXNldF9idG4gPSAkKCcjcmVzZXRfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVfYnRuID0gJCgnI2RlbGV0ZV9idG4nKTtcclxuICAgICAgICB0aGlzLmVtYWlsX2J0biA9ICQoJyNlbWFpbF9idG4nKTtcclxuICAgICAgICB0aGlzLnNlbmRfZW1haWxfYnRuID0gJCgnI3NlbmRfZW1haWxfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5yZXN0b3JlX2J0biA9ICQoJyNyZXN0b3JlX2J0bicpO1xyXG4gICAgICAgIHRoaXMuc2FuaXRpemVfYnRuID0gJCgnI3Nhbml0aXplX2J0bicpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlfYnRuID0gJCgnI3Byb3BlcnR5X2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgLy8gdGhpcy5maWxlTmFtZSA9ICQoJyNmaWxlTmFtZScpO1xyXG4gICAgICAvLyAgdGhpcy5wYXNzUGRmID0gJCgnI3Bhc3NQZGYnKTtcclxuICAgICAgICB0aGlzLnlvdXJfZW1haWwgPSAkKCcjeW91cl9lbWFpbCcpO1xyXG4gICAgICAgIHRoaXMueW91cl9zdWJqZWN0ID0gJCgnI3lvdXJfc3ViamVjdCcpO1xyXG4gICAgICAgIHRoaXMueW91cl9tZXNzYWdlID0gJCgnI3lvdXJfbWVzc2FnZScpO1xyXG5cclxuXHJcbiAgICAgICAgLy9tb2RhbHNcclxuICAgICAgICB0aGlzLmRpZ2l0YWxfc2lnbmF0dXJlX21vZGFsID0gJCgnI2RpZ2l0YWxfc2lnbmF0dXJlX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5zdGFtcF9tb2RhbCA9ICQoJyNzdGFtcF9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMuYmFyY29kZV9tb2RhbCA9ICQoJyNiYXJjb2RlX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5yZWRhY3RfbW9kYWwgPSAkKCcjcmVkYWN0X21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eV9tb2RhbCA9ICQoJyNwcm9wZXJ0eV9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMuZW1haWxfbW9kYWwgPSAkKCcjZW1haWxfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkX21vZGFsID0gJCgnI3Bhc3N3b3JkX21vZGFsJyk7XHJcblxyXG4gICAgICAgIC8vb3RoZXIvRElWXHJcbiAgICAgICAvLyB0aGlzLnBkZl9pZnJhbWUgPSAkKCcjcGRmX2lmcmFtZScpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWxfYm9keSA9ICQoJyNwcm9wZXJ0eV9tb2RhbF9ib2R5Jyk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hlZF9maWxlTmFtZSA9ICQoJyNhdHRhY2hlZF9maWxlTmFtZScpO1xyXG4gICAgICAgIC8vdGhpcy5jb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCB3b3JrYmVuY2ggPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmRpZ2l0YWxfc2lnbmF0dXJlX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAvL1RPRE86IFxyXG4gICAgICAgICAgIC8qIGlmICh0eXBlb2YgZGlnaXRhbFNpZ25hdHVyZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIGRpZ2l0YWxTaWduYXR1cmUgPSBuZXcgRGlnaXRhbFNpZ25hdHVyZSgpOyovXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJlZGFjdF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgLy9UT0RPOiBcclxuICAgICAgICAgICAvKiBpZiAodHlwZW9mIHJlZGFjdCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHJlZGFjdCA9IG5ldyBSZWRhY3QoKTsqL1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFtcF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgLy9UT0RPOiBcclxuICAgICAgICAgICAvKiBpZiAodHlwZW9mIHN0YW1wID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgc3RhbXAgPSBuZXcgU3RhbXAoKTsqL1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXNzd29yZF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzogXHJcbiAgICAgICAgICAgIC8qaWYgKHR5cGVvZiBwcm90ZWN0ID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgcHJvdGVjdCA9IG5ldyBQcm90ZWN0KCk7Ki9cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmFyY29kZV9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzogXHJcbiAgICAgICAgICAgIC8qaWYgKHR5cGVvZiBiYXJjb2RlID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgYmFyY29kZSA9IG5ldyBCYXJjb2RlKCk7Ki9cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy52aWV3ZXIuZGVsZXRlO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnRGVsZXRpbmcgdGhlIGZpbGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLnNlc3Npb25fZXhwaXJlZF9tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9jYXRpb24uaHJlZiA9IGNvbmZpZy51cmxzLnJvb3QucGF0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5yZXN0b3JlX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6RXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9IGNvbmZpZy51cmxzLnZpZXdlci5yZXN0b3JlO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnUmVzdG9yaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUylcclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmVtYWlsX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdvcmtiZW5jaC5hdHRhY2hlZF9maWxlTmFtZS5odG1sKGNvbW1vbi5maWxlTmFtZS52YWwoKSk7XHJcbiAgICAgICAgICAgIHdvcmtiZW5jaC5lbWFpbF9tb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZW5kX2VtYWlsX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBtYWlsdG86IHdvcmtiZW5jaC55b3VyX2VtYWlsLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgc3ViamVjdDogd29ya2JlbmNoLnlvdXJfc3ViamVjdC52YWwoKSxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHdvcmtiZW5jaC55b3VyX21lc3NhZ2UudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy52aWV3ZXIuZW1haWw7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLmVtYWlsX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdFbWFpbGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmluZm8oJ0VtYWlsIGhhcyBiZWVuIHNlbnQuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2guZW1haWxfbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1VuYWJsZSB0byBzZW5kIHRoZSBlbWFpbC4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OiBFdmVudCkge1xyXG4gICAgICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX3RleHQuaHRtbCgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIFNhbml0aXplIHRoZSBQREY/Jyk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5jb25maXJtYXRpb25fbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucHJvcGVydHlfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDogRXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5wYXNzUGRmLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdXJsID0gdGhpcy5jb25maWcudXJscy5wcm9wZXJ0aWVzLmluZGV4O1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25fbGFiZWwuaHRtbCgnTG9hZGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5X21vZGFsX2JvZHkuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5X21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgLy9UT0RPOiBwcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4vKlxyXG4gICAgcHVibGljIHByZXZpZXcoIGZpbGVOYW1lOnN0cmluZywgaXN0ZW1wOmJvb2xlYW4gKTp2b2lke1xyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmNvbmZpZy51cmxzLnZpZXdlci5wcmV2aWV3ICsgXCImZmlsZU5hbWU9XCIgKyBmaWxlTmFtZSArICcmaXN0ZW1wPScgKyBpc3RlbXA7XHJcbiAgICAgICAgdGhpcy5wZGZfaWZyYW1lLmF0dHIoXCJzcmNcIiwgdXJsKTtcclxuICAgIH1cclxuKi9cclxuICAgIHB1YmxpYyBwaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiV29ya0JlbmNoIGNsYXNzIGNvbnN0cnVjdGVkLlwiXHJcbiAgICB9XHJcbn0iXX0=
