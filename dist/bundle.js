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
        _this.session_expired_modal = $('#session_expired_modal');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy90cy9BcHBsaWNhdGlvbi50cyIsImluY2x1ZGVzL3RzL0Jhc2UudHMiLCJpbmNsdWRlcy90cy9Db21tb24udHMiLCJpbmNsdWRlcy90cy9Db25maWcudHMiLCJpbmNsdWRlcy90cy9NYWluLnRzIiwiaW5jbHVkZXMvdHMvV29ya0JlbmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxtQ0FBa0M7QUFDbEMsK0JBQWdDO0FBQ2hDLHlDQUF3QztBQUV4QyxJQUFJLGlCQUFzQixDQUFDO0FBRTNCLGVBQWUsSUFBVztJQUV0QixJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztJQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO0lBQ3RCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN0RSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZCLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsS0FBSyxrQkFBa0IsRUFBQyxDQUFDO1lBQ3JCLGNBQWMsRUFBRSxDQUFDO1lBQ2pCLEtBQUssQ0FBQztRQUNWLENBQUM7UUFHRDtZQUNJLEtBQUssQ0FBQztJQUNkLENBQUM7SUFDRCxJQUFJ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TSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBQ0w7Ozs7O01BS0U7SUFDUyx3QkFBSSxHQUFYO1FBQ0ksTUFBTSxDQUFDLDhCQUE4QixDQUFBO0lBQ3pDLENBQUM7SUFDTCxnQkFBQztBQUFELENBMVJBLEFBMFJDLENBMVI4QixXQUFJLEdBMFJsQztBQTFSWSw4QkFBUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgTWFpbiB9ICAgZnJvbSBcIi4vTWFpblwiO1xyXG5pbXBvcnQgeyBXb3JrQmVuY2ggfSBmcm9tIFwiLi9Xb3JrQmVuY2hcIjtcclxuXHJcbmxldCBjb25maXJtYXRpb25fdGV4dDogYW55O1xyXG5cclxuZnVuY3Rpb24gc3RhcnQocGF0aDpzdHJpbmcpIHtcclxuXHJcbiAgICBjb25zdCBlbHQyID0gJChcIiNncmVldGluZ1wiKTtcclxuICAgIGxldCBjZmcgPSBuZXcgQ29uZmlnKCk7XHJcbiAgICBsZXQgbWFpbiA9IG5ldyBNYWluKCk7XHJcbiAgICBsZXQgZXZlbnROYW1lID0gbWFpbi5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJldmVudFwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcclxuICAgIGNvbnNvbGUubG9nKGNmZy51cmxzLm1haW4uaW5kZXgpO1xyXG4gICAgY29uc29sZS5sb2cobWFpbi5waW5nKCkpO1xyXG4gICAgY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICBjb25zb2xlLmxvZyhldmVudE5hbWUpO1xyXG4gICAgc3dpdGNoIChldmVudE5hbWUpIHtcclxuICAgICAgICBjYXNlICd2aWV3ZXIud29ya2JlbmNoJzp7XHJcbiAgICAgICAgICAgIHdvcmtCZW5jaFN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICBcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGVsdDIuaHRtbChcIkhlbGxvIFNoaXJhayBBdmFraWFuXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3b3JrQmVuY2hTdGFydCgpIHtcclxuICAgIGxldCB3b3JrYmVuY2ggPSBuZXcgV29ya0JlbmNoKCk7XHJcbiAgICBjb25zb2xlLmxvZyhcIldvcmtiZW5jaCBzdGFydGVkXCIpO1xyXG4gICAgY29uc29sZS5sb2cod29ya2JlbmNoLnBpbmcoKSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCBmdW5jdGlvbiAoKSB7XHJcbiAgICBzdGFydCh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xyXG59KTtcclxuLypcclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBhY3RpdmF0ZSBhbGwgZHJvcCBkb3duc1xyXG4gICAgJCgnLmRyb3Bkb3duLXRvZ2dsZScpLmRyb3Bkb3duKCk7XHJcbiAgICAvLyBUb29sdGlwc1xyXG4gICAgJChcIltyZWw9dG9vbHRpcF1cIikudG9vbHRpcCgpO1xyXG59KTtcclxuKi9cclxuLypcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICQoXCIuYnV0dG9uLWNvbGxhcHNlXCIpLnNpZGVOYXYoKTtcclxuICAgIGFwcGxpY2F0aW9uID0gdGhpcztcclxuXHJcbiAgICBpZiAoIWFwcGxpY2F0aW9uLm1haW4pXHJcbiAgICAgICAgYXBwbGljYXRpb24ubWFpbiA9IG5ldyBNYWluKCk7XHJcblxyXG4gICAgXHJcbiAgICAkKCcucG9wb3Zlci1kaXNtaXNzJykucG9wb3Zlcih7XHJcbiAgICAgICAgdHJpZ2dlcjogJ2ZvY3VzJ1xyXG4gICAgfSlcclxuXHJcbn0pOyovIiwiaW1wb3J0IHsgQ29tbW9uIH0gZnJvbSBcIi4vQ29tbW9uXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZSB7XHJcbiAgICBjb25maWc6Q29uZmlnO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgbGV0IGJhc2UgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmV2aWV3KGZpbGVOYW1lOiBzdHJpbmcsIGlzdGVtcDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmNvbmZpZy51cmxzLnZpZXdlci5wcmV2aWV3ICsgXCImZmlsZU5hbWU9XCIgKyBmaWxlTmFtZSArICcmaXN0ZW1wPScgKyBpc3RlbXA7XHJcbiAgICAgICAgdGhpcy5nZXRDb21tb24oKS5wZGZfaWZyYW1lLmF0dHIoXCJzcmNcIiwgdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29uZmlnKCk6Q29uZmlne1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29tbW9uKCk6Q29tbW9ue1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29tbW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhcmFtZXRlckJ5TmFtZShuYW1lOnN0cmluZywgdXJsOnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBpZiAoIXVybCkgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcXFxcJCZcIik7XHJcbiAgICAgICAgbGV0IHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLFxyXG4gICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XHJcbiAgICAgICAgaWYgKCFyZXN1bHRzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAoIXJlc3VsdHNbMl0pIHJldHVybiAnJztcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ29tbW9uIHtcclxuXHJcbiAgICAvL3RleHRcclxuICAgIGNvbmZpcm1hdGlvbl90ZXh0OiBhbnk7XHJcbiAgICBhY3Rpb25fbGFiZWw6IGFueTtcclxuICAgIGVycm9yTW9kYWxNZXNzYWdlOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dFxyXG4gICAgZmlsZU5hbWU6IGFueTtcclxuICAgIHBhc3NQZGY6IGFueTtcclxuXHJcbiAgICAvL21vZGFsXHJcbiAgICBjb25maXJtYXRpb25fbW9kYWw6IGFueTtcclxuICAgIGxvYWRpbmdfbW9kYWw6IGFueTtcclxuICAgIGVycm9yTW9kYWxEYW5nZXI6IGFueTtcclxuXHJcbiAgICAvL090aGVyXHJcbiAgICBwZGZfaWZyYW1lOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7ICAgICAgIFxyXG4gICAgICAgIC8vdGV4dFxyXG4gICAgICAgIHRoaXMuY29uZmlybWF0aW9uX3RleHQgID0gJCgnI2NvbmZpcm1hdGlvbl90ZXh0Jyk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25fbGFiZWwgPSAkKFwiI2FjdGlvbl9sYWJlbFwiKTtcclxuICAgICAgICB0aGlzLmVycm9yTW9kYWxNZXNzYWdlID0gJCgnI2Vycm9yTW9kYWxNZXNzYWdlJyk7XHJcblxyXG4gICAgICAgIC8vbW9kYWxcclxuICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbl9tb2RhbCA9ICQoJyNjb25maXJtYXRpb25fbW9kYWwnKTtcclxuICAgICAgICB0aGlzLmxvYWRpbmdfbW9kYWwgICAgICA9ICQoJyNsb2FkaW5nX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5lcnJvck1vZGFsRGFuZ2VyICAgPSAkKCcjZXJyb3JNb2RhbERhbmdlcicpO1xyXG5cclxuICAgICAgICAvL2lucHV0XHJcbiAgICAgICAgdGhpcy5maWxlTmFtZSAgICAgICAgICAgPSAkKCcjZmlsZU5hbWUnKTtcclxuICAgICAgICB0aGlzLnBhc3NQZGYgICAgICAgICAgICA9ICQoJyNwYXNzUGRmJyk7XHJcblxyXG4gICAgICAgIC8vb3RoZXJcclxuICAgICAgICB0aGlzLnBkZl9pZnJhbWUgICAgICAgICA9ICQoJyNwZGZfaWZyYW1lJyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICB0aGVBY3R1YWxTZXJ2ZXI6IHN0cmluZztcclxuICAgIHByb3RvY29sOiBzdHJpbmc7XHJcbiAgICBhcHBGb2xkZXI6IHN0cmluZztcclxuICAgIENHSVNjcmlwdE5hbWUgOiBzdHJpbmc7XHJcbiAgICB1cmxzOiBNeVVybHM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy50aGVBY3R1YWxTZXJ2ZXIgPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgICAgICB0aGlzLnByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xyXG4gICAgICAgIHRoaXMuYXBwRm9sZGVyID0gXCIvXCI7ICBcclxuICAgICAgICB0aGlzLkNHSVNjcmlwdE5hbWUgPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnByb3RvY29sICsgXCIvL1wiICsgdGhpcy50aGVBY3R1YWxTZXJ2ZXIgKyB0aGlzLmFwcEZvbGRlciArIHRoaXMuQ0dJU2NyaXB0TmFtZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVybHMgPSBuZXcgTXlVcmxzKCBwYXRoICk7XHJcbiAgICAgICBcclxuICAgIH1cclxuXHJcbn0gXHJcblxyXG5jbGFzcyBNeVVybHN7XHJcblxyXG4gICAgbWFpbjogTWFpbjtcclxuICAgIGRpZ2l0YWxzaWduYXR1cmU6IERpZ2l0YWxzaWduYXR1cmU7XHJcbiAgICBzdGFtcDogU3RhbXA7XHJcbiAgICBzYW5pdGl6ZTogU2FuaXRpemU7XHJcbiAgICByZWRhY3Q6IFJlZGFjdDtcclxuICAgIGJhcmNvZGU6IEJhcmNvZGU7XHJcbiAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xyXG4gICAgdmlld2VyOiBWaWV3ZXI7XHJcbiAgICByb290OiBSb290O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5tYWluID0gbmV3IE1haW4oX3ApO1xyXG4gICAgICAgIHRoaXMuZGlnaXRhbHNpZ25hdHVyZSA9IG5ldyBEaWdpdGFsc2lnbmF0dXJlKF9wKTtcclxuICAgICAgICB0aGlzLnN0YW1wID0gbmV3IFN0YW1wKF9wKTtcclxuICAgICAgICB0aGlzLnNhbml0aXplID0gbmV3IFNhbml0aXplKF9wKTtcclxuICAgICAgICB0aGlzLnJlZGFjdCA9IG5ldyBSZWRhY3QoX3ApO1xyXG4gICAgICAgIHRoaXMuYmFyY29kZSA9IG5ldyBCYXJjb2RlKF9wKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBuZXcgUHJvcGVydGllcyhfcCk7XHJcbiAgICAgICAgdGhpcy52aWV3ZXIgPSBuZXcgVmlld2VyKF9wKTtcclxuICAgICAgICB0aGlzLnJvb3QgPSBuZXcgUm9vdChfcCk7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuLy9EaWdpdGFsIFNpZ25hdHVyZSBIYW5kbGVyXHJcbmNsYXNzIE1haW4ge1xyXG4gICAgaW5kZXg6IHN0cmluZztcclxuICAgIHVwbG9hZEZpbGVzOiBzdHJpbmc7XHJcbiAgICByZWFkTWV0YWRhdGE6IHN0cmluZztcclxuICAgIHBpbmc6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBfcGF0aCArIFwiP2V2ZW50PW1haW4uaW5kZXhcIjtcclxuICAgICAgICB0aGlzLnVwbG9hZEZpbGVzID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnVwbG9hZEZpbGVzXCI7XHJcbiAgICAgICAgdGhpcy5yZWFkTWV0YWRhdGEgPSBfcGF0aCArIFwiP2V2ZW50PW1haW4ucmVhZE1ldGFkYXRhXCI7XHJcbiAgICAgICAgdGhpcy5waW5nID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnBpbmdcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGlnaXRhbHNpZ25hdHVyZSB7XHJcbiAgICBhZGRGaWVsZDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkRmllbGQgPSBfcGF0aCArIFwiP2V2ZW50PWRpZ2l0YWxzaWduYXR1cmUuYWRkRmllbGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU3RhbXAge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PXN0YW1wLmFkZFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTYW5pdGl6ZXtcclxuICAgIGFwcGx5IDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFwcGx5ID0gX3BhdGggKyBcIj9ldmVudD1zYW5pdGl6ZS5hcHBseVwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWRhY3Qge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50ID0gcmVkYWN0LmFkZFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBCYXJjb2RlIHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudCA9IGJhcmNvZGUuYWRkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb3BlcnRpZXMgIHtcclxuICAgIGluZGV4OiBzdHJpbmc7XHJcbiAgICBhZGQ6IHN0cmluZzsgXHJcbiAgICBkZWxldGU6IHN0cmluZzsgXHJcbiAgICBzYXZlOiBzdHJpbmc7IFxyXG4gICAgZXhwb3J0OiBzdHJpbmc7ICAgICAgICBcclxuICAgIGltcG9ydDogc3RyaW5nOyAgXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmluZGV4ICA9IF9wYXRoICsgXCI/ZXZlbnQgPSBwcm9wZXJ0aWVzLmluZGV4XCI7XHJcbiAgICAgICAgdGhpcy5hZGQgICAgPSBfcGF0aCArIFwiP2V2ZW50ID0gcHJvcGVydGllcy5hZGRcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZSA9IF9wYXRoICsgXCI/ZXZlbnQgPSBwcm9wZXJ0aWVzLmRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZSAgID0gX3BhdGggKyBcIj9ldmVudCA9IHByb3BlcnRpZXMuc2F2ZVwiO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0ID0gX3BhdGggKyBcIj9ldmVudCA9IHByb3BlcnRpZXMuZXhwb3J0XCI7XHJcbiAgICAgICAgdGhpcy5pbXBvcnQgPSBfcGF0aCArIFwiP2V2ZW50ID0gcHJvcGVydGllcy5pbXBvcnRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVmlld2VyIHtcclxuICAgIHByZXZpZXcgOiBzdHJpbmc7IFxyXG4gICAgZGVsZXRlOiBzdHJpbmc7XHJcbiAgICByZXN0b3JlOiBzdHJpbmc7XHJcbiAgICBzYXZlOiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3ICAgID0gX3BhdGggKyBcIj9ldmVudCA9IHZpZXdlci5pbmRleFwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlICAgICA9IF9wYXRoICsgXCI/ZXZlbnQgPSB2aWV3ZXIuZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5yZXN0b3JlICAgID0gX3BhdGggKyBcIj9ldmVudCA9IHZpZXdlci5zYXZlXCI7XHJcbiAgICAgICAgdGhpcy5zYXZlICAgICAgID0gX3BhdGggKyBcIj9ldmVudCA9IHZpZXdlci5leHBvcnRcIjtcclxuICAgICAgICB0aGlzLmVtYWlsICAgICAgPSBfcGF0aCArIFwiP2V2ZW50ID0gdmlld2VyLmltcG9ydFwiO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgUm9vdCB7XHJcbiAgICAgcGF0aDpzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgIHRoaXMucGF0aCA9IF9wYXRoO1xyXG4gICAgIH1cclxuIH1cclxuIiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcbmV4cG9ydCBjbGFzcyBNYWluIGV4dGVuZHMgQmFzZSB7XHJcbiAgIC8vIG1haW46dGhpcztcclxuICAgIGNvbmZpZzpDb25maWc7XHJcbiAgICBuZXd1c2VycGFzc3dvcmQ6IGFueTtcclxuICAgIHVybF9pbnB1dCA6IGFueTtcclxuICAgIHVwbG9hZGVkX2ZpbGU6IGFueTtcclxuXHJcbiAgICAvL2J1dHRvblxyXG4gICAgdXBsb2FkX3BkZl9idG46IGFueTtcclxuICAgIGNvbmZpcm1feWVzOiBhbnk7XHJcbiAgICB1cmx0b1BERl9idG46IGFueTtcclxuICAgIGJ0bkV4cGlyZWRPazogYW55O1xyXG4gICAgcGFzc3dvcmRfYXBwbHlfYnRuOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbFxyXG4gICAgLy9jb25maXJtYXRpb25fbW9kYWw6IGFueTtcclxuICAgIGZpbGVVcGxvYWRNb2RhbDogYW55O1xyXG4gICAgLy9sb2FkaW5nX21vZGFsOiBhbnk7XHJcbiAgICAvL2Vycm9yTW9kYWxEYW5nZXI6IGFueTtcclxuICAgIHNlc3Npb25fZXhwaXJlZF9tb2RhbDogYW55O1xyXG5cclxuICAgIC8vRElWL3NwYW4vbGFiZWxcclxuICAgIGZpbGVVcGxvYWRNb2RhbF9ib2R5OiBhbnk7XHJcbiAgICBwcmVsb2FkX2RpdjogYW55O1xyXG4gICAgLy9hY3Rpb25fbGFiZWw6IGFueTtcclxuICAgLy8gZXJyb3JNb2RhbE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpOyAgICAgIFxyXG4gICAgICAgIHRoaXMubmV3dXNlcnBhc3N3b3JkID0gJCgnI25ld3VzZXJwYXNzd29yZCcpO1xyXG4gICAgICAgIHRoaXMudXJsX2lucHV0ID0gJCgnI3VybF9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMudXBsb2FkZWRfZmlsZSA9ICQoJyN1cGxvYWRlZF9maWxlJyk7XHJcblxyXG4gICAgICAgIC8vYnV0dG9uXHJcbiAgICAgICAgdGhpcy51cGxvYWRfcGRmX2J0biA9ICQoJyN1cGxvYWRfcGRmX2J0bicpO1xyXG4gICAgICAgIHRoaXMuY29uZmlybV95ZXMgPSAkKCcjY29uZmlybV95ZXMnKTtcclxuICAgICAgICB0aGlzLnVybHRvUERGX2J0biA9ICQoJyN1cmx0b1BERl9idG4nKTtcclxuICAgICAgICB0aGlzLmJ0bkV4cGlyZWRPayA9ICQoJyNidG5FeHBpcmVkT2snKTtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkX2FwcGx5X2J0biA9ICQoJyNwYXNzd29yZF9hcHBseV9idG4nKTtcclxuXHJcbiAgICAgICAgLy9tb2RhbFxyXG4gICAgICAgIC8vdGhpcy5jb25maXJtYXRpb25fbW9kYWwgPSAkKCcjY29uZmlybWF0aW9uX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5maWxlVXBsb2FkTW9kYWwgPSAkKCcjZmlsZVVwbG9hZE1vZGFsJyk7XHJcbiAgICAgICAvLyB0aGlzLmxvYWRpbmdfbW9kYWwgPSAkKCcjbG9hZGluZ19tb2RhbCcpO1xyXG4gICAgICAgLy8gdGhpcy5lcnJvck1vZGFsRGFuZ2VyID0gJCgnI2Vycm9yTW9kYWxEYW5nZXInKTtcclxuICAgICAgICB0aGlzLnNlc3Npb25fZXhwaXJlZF9tb2RhbCA9ICQoJyNzZXNzaW9uX2V4cGlyZWRfbW9kYWwnKTtcclxuXHJcbiAgICAgICAgLy9ESVYvc3Bhbi9sYWJlbFxyXG4gICAgICAgIHRoaXMuZmlsZVVwbG9hZE1vZGFsX2JvZHkgPSAkKCcjZmlsZVVwbG9hZE1vZGFsX2JvZHknKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnByZWxvYWRfZGl2ID0gJChcIiNwcmVsb2FkX2RpdlwiKTtcclxuICAgICAgIC8vIHRoaXMuYWN0aW9uX2xhYmVsID0gJChcIiNhY3Rpb25fbGFiZWxcIik7XHJcbiAgICAgICAvLyB0aGlzLmVycm9yTW9kYWxNZXNzYWdlID0gJCgnI2Vycm9yTW9kYWxNZXNzYWdlJyk7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyggZXZlbnQ/OkV2ZW50ICk6dm9pZCB7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgbWFpbiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZGF0YSgnYnMubW9kYWwnLCBudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAvLyAgbGV0IHJlZGFjdCA9IG5ldyBSZWRhY3QoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maXJtX3llcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6RXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IGNvbW1vbi5wYXNzUGRmLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gY29uZmlnLnVybHMuc2FuaXRpemUuYXBwbHk7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ1Nhbml0aXppbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaG93ZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwaW5nKCk6c3RyaW5ne1xyXG4gICAgICAgIHJldHVybiBcIk1haW4gY2xhc3MgY29uc3RydWN0ZWQuXCJcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgQ29tbW9uIH0gZnJvbSBcIi4vQ29tbW9uXCI7XHJcbmltcG9ydCB7QmFzZX0gZnJvbSBcIi4vQmFzZVwiXHJcbmV4cG9ydCBjbGFzcyBXb3JrQmVuY2ggZXh0ZW5kcyBCYXNle1xyXG5cclxuICAgIGNvbmZpZzogQ29uZmlnO1xyXG4gICAgY29tbW9uOiBDb21tb247XHJcbiAgICByZXNldF9idG4gOiBhbnk7XHJcbiAgICBkZWxldGVfYnRuOiBhbnk7XHJcbiAgICBlbWFpbF9idG46IGFueTtcclxuICAgIHNlbmRfZW1haWxfYnRuOiBhbnk7XHJcbiAgICByZXN0b3JlX2J0bjogYW55O1xyXG4gICAgc2FuaXRpemVfYnRuOiBhbnk7XHJcbiAgICBwcm9wZXJ0eV9idG46IGFueTtcclxuXHJcbiAgICAvL2lucHV0c1xyXG4gICAvLyBmaWxlTmFtZTogYW55O1xyXG4gICAvLyBwYXNzUGRmOiBhbnk7XHJcbiAgICB5b3VyX2VtYWlsOiBhbnk7XHJcbiAgICB5b3VyX3N1YmplY3Q6IGFueTtcclxuICAgIHlvdXJfbWVzc2FnZTogYW55O1xyXG5cclxuXHJcbiAgICAvL21vZGFsc1xyXG4gICAgZGlnaXRhbF9zaWduYXR1cmVfbW9kYWw6IGFueTtcclxuICAgIHN0YW1wX21vZGFsOiBhbnk7XHJcbiAgICBiYXJjb2RlX21vZGFsOiBhbnk7XHJcbiAgICByZWRhY3RfbW9kYWw6IGFueTtcclxuICAgIHByb3BlcnR5X21vZGFsOiBhbnk7XHJcbiAgICBlbWFpbF9tb2RhbDogYW55O1xyXG4gICAgcGFzc3dvcmRfbW9kYWw6IGFueTtcclxuXHJcbiAgICAvL290aGVyL0RJVlxyXG4gICAvLyBwZGZfaWZyYW1lOiBhbnk7XHJcbiAgICBwcm9wZXJ0eV9tb2RhbF9ib2R5OiBhbnk7XHJcbiAgICBhdHRhY2hlZF9maWxlTmFtZTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLnJlc2V0X2J0biA9ICQoJyNyZXNldF9idG4nKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZV9idG4gPSAkKCcjZGVsZXRlX2J0bicpO1xyXG4gICAgICAgIHRoaXMuZW1haWxfYnRuID0gJCgnI2VtYWlsX2J0bicpO1xyXG4gICAgICAgIHRoaXMuc2VuZF9lbWFpbF9idG4gPSAkKCcjc2VuZF9lbWFpbF9idG4nKTtcclxuICAgICAgICB0aGlzLnJlc3RvcmVfYnRuID0gJCgnI3Jlc3RvcmVfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZV9idG4gPSAkKCcjc2FuaXRpemVfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eV9idG4gPSAkKCcjcHJvcGVydHlfYnRuJyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRzXHJcbiAgICAgICAvLyB0aGlzLmZpbGVOYW1lID0gJCgnI2ZpbGVOYW1lJyk7XHJcbiAgICAgIC8vICB0aGlzLnBhc3NQZGYgPSAkKCcjcGFzc1BkZicpO1xyXG4gICAgICAgIHRoaXMueW91cl9lbWFpbCA9ICQoJyN5b3VyX2VtYWlsJyk7XHJcbiAgICAgICAgdGhpcy55b3VyX3N1YmplY3QgPSAkKCcjeW91cl9zdWJqZWN0Jyk7XHJcbiAgICAgICAgdGhpcy55b3VyX21lc3NhZ2UgPSAkKCcjeW91cl9tZXNzYWdlJyk7XHJcblxyXG5cclxuICAgICAgICAvL21vZGFsc1xyXG4gICAgICAgIHRoaXMuZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwgPSAkKCcjZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnN0YW1wX21vZGFsID0gJCgnI3N0YW1wX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5iYXJjb2RlX21vZGFsID0gJCgnI2JhcmNvZGVfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnJlZGFjdF9tb2RhbCA9ICQoJyNyZWRhY3RfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnByb3BlcnR5X21vZGFsID0gJCgnI3Byb3BlcnR5X21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5lbWFpbF9tb2RhbCA9ICQoJyNlbWFpbF9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMucGFzc3dvcmRfbW9kYWwgPSAkKCcjcGFzc3dvcmRfbW9kYWwnKTtcclxuXHJcbiAgICAgICAgLy9vdGhlci9ESVZcclxuICAgICAgIC8vIHRoaXMucGRmX2lmcmFtZSA9ICQoJyNwZGZfaWZyYW1lJyk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eV9tb2RhbF9ib2R5ID0gJCgnI3Byb3BlcnR5X21vZGFsX2JvZHknKTtcclxuICAgICAgICB0aGlzLmF0dGFjaGVkX2ZpbGVOYW1lID0gJCgnI2F0dGFjaGVkX2ZpbGVOYW1lJyk7XHJcbiAgICAgICAgLy90aGlzLmNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgXHJcbiAgICAgICAgdGhpcy5kaWdpdGFsX3NpZ25hdHVyZV9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgLy9UT0RPOiBcclxuICAgICAgICAgICAvKiBpZiAodHlwZW9mIGRpZ2l0YWxTaWduYXR1cmUgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICBkaWdpdGFsU2lnbmF0dXJlID0gbmV3IERpZ2l0YWxTaWduYXR1cmUoKTsqL1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWRhY3RfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgIC8vVE9ETzogXHJcbiAgICAgICAgICAgLyogaWYgKHR5cGVvZiByZWRhY3QgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICByZWRhY3QgPSBuZXcgUmVkYWN0KCk7Ki9cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhbXBfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgIC8vVE9ETzogXHJcbiAgICAgICAgICAgLyogaWYgKHR5cGVvZiBzdGFtcCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHN0YW1wID0gbmV3IFN0YW1wKCk7Ki9cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGFzc3dvcmRfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL1RPRE86IFxyXG4gICAgICAgICAgICAvKmlmICh0eXBlb2YgcHJvdGVjdCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHByb3RlY3QgPSBuZXcgUHJvdGVjdCgpOyovXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJhcmNvZGVfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL1RPRE86IFxyXG4gICAgICAgICAgICAvKmlmICh0eXBlb2YgYmFyY29kZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIGJhcmNvZGUgPSBuZXcgQmFyY29kZSgpOyovXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRlbGV0ZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9IHRoaXMuY29uZmlnLnVybHMudmlld2VyLmRlbGV0ZTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uX2xhYmVsLmh0bWwoJ0RlbGV0aW5nIHRoZSBmaWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IHNlbGYubG9jYXRpb24gPSB0aGlzLmNvbmZpZy51cmxzLnJvb3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCh0aGlzLmNvbmZpZy51cmxzLnJvb3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aGlzLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVzdG9yZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gdGhpcy5jb25maWcudXJscy52aWV3ZXIucmVzdG9yZTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uX2xhYmVsLmh0bWwoJ1Jlc3RvcmluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5lbWFpbF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmF0dGFjaGVkX2ZpbGVOYW1lLmh0bWwodGhpcy5maWxlTmFtZS52YWwoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuZW1haWxfbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2VuZF9lbWFpbF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBtYWlsdG86IHRoaXMueW91cl9lbWFpbC52YWwoKSxcclxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IHRoaXMueW91cl9zdWJqZWN0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy55b3VyX21lc3NhZ2UudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSB0aGlzLmNvbmZpZy51cmxzLnZpZXdlci5lbWFpbDtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1haWxfbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbl9sYWJlbC5odG1sKCdFbWFpbGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChmaWxlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aGlzLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAvL1RPRE86ICB0b2FzdHIuaW5mbygnRW1haWwgaGFzIGJlZW4gc2VudC4nKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWFpbF9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgLy9UT0RPOiAgdG9hc3RyLmVycm9yKCdVbmFibGUgdG8gc2VuZCB0aGUgZW1haWwuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2FuaXRpemVfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDogRXZlbnQpIHtcclxuICAgICAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl90ZXh0Lmh0bWwoJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBTYW5pdGl6ZSB0aGUgUERGPycpO1xyXG4gICAgICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnByb3BlcnR5X2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6IEV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc1BkZi52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHVybCA9IHRoaXMuY29uZmlnLnVybHMucHJvcGVydGllcy5pbmRleDtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uX2xhYmVsLmh0bWwoJ0xvYWRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aGlzLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eV9tb2RhbF9ib2R5Lmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eV9tb2RhbC5tb2RhbCgnc2hvdycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgIC8vVE9ETzogcHJvcGVydGllcyA9IG5ldyBQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aGlzLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbl9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuLypcclxuICAgIHB1YmxpYyBwcmV2aWV3KCBmaWxlTmFtZTpzdHJpbmcsIGlzdGVtcDpib29sZWFuICk6dm9pZHtcclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5jb25maWcudXJscy52aWV3ZXIucHJldmlldyArIFwiJmZpbGVOYW1lPVwiICsgZmlsZU5hbWUgKyAnJmlzdGVtcD0nICsgaXN0ZW1wO1xyXG4gICAgICAgIHRoaXMucGRmX2lmcmFtZS5hdHRyKFwic3JjXCIsIHVybCk7XHJcbiAgICB9XHJcbiovXHJcbiAgICBwdWJsaWMgcGluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIldvcmtCZW5jaCBjbGFzcyBjb25zdHJ1Y3RlZC5cIlxyXG4gICAgfVxyXG59Il19
