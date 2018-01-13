(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="global.d.ts"/>
var Config_1 = require("./Config");
var Main_1 = require("./Main");
var WorkBench_1 = require("./WorkBench");
//import { IGlobalScope } from "./global";
var confirmation_text;
function start(path) {
    var GLOBALSCOPE;
    //ContactLogger.logContactData();
    var elt2 = $("#greeting");
    var cfg = new Config_1.Config();
    var main = new Main_1.Main();
    var eventName = main.getParameterByName("event", window.location.href);
    switch (eventName) {
        case 'viewer.workbench': {
            GLOBALSCOPE = { 'WorkBench': workBenchStart() };
            break;
        }
        default:
            break;
    }
    elt2.html("");
}
function workBenchStart() {
    var workbench = new WorkBench_1.WorkBench();
    return workbench;
}
var ContactLogger = /** @class */ (function () {
    function ContactLogger() {
    }
    ContactLogger.logContactData = function () {
        var CONTACT_DATA = [
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
        for (var _i = 0, CONTACT_DATA_1 = CONTACT_DATA; _i < CONTACT_DATA_1.length; _i++) {
            var contact = CONTACT_DATA_1[_i];
            console.log('Display Text : ' + contact.DisplayText + ', Email : ' + contact.Email);
        }
    };
    return ContactLogger;
}());
/*
window.onload = () =>{
    ContactLogger.logContactData();
}*/
$(document).ready(function () {
    start(window.location.pathname);
    // window.globalVar = "This is global!";
});
},{"./Config":5,"./Main":7,"./WorkBench":11}],2:[function(require,module,exports){
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
var Barcode = /** @class */ (function (_super) {
    __extends(Barcode, _super);
    function Barcode() {
        var _this = _super.call(this) || this;
        //buttons
        _this.add_barcode_btn = $('#add_barcode_btn');
        //inputs
        _this.b_page = $("#b_page");
        _this.textToEncode = $("#textToEncode");
        _this.setEventListeners();
        return _this;
    }
    Barcode.prototype.setEventListeners = function (event) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var barcode = this;
        barcode.add_barcode_btn.on('click', function (e) {
            var view_model = {
                pages: barcode.b_page.val(),
                fileName: common.fileName.val(),
                textToEncode: barcode.textToEncode.val()
            };
            var msg = barcode.validate(view_model);
            if (msg == "") {
                var url = config.urls.barcode.add;
                $.ajax({
                    type: "post",
                    url: url,
                    data: view_model,
                    beforeSend: function (xhr) {
                        common.action_label.html('Adding Barcode');
                        common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                    },
                    success: function (data) {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                        var tp = $.type(data);
                        if (tp === 'string') {
                            common.session_expired_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                        }
                        else {
                            if (data.fileName)
                                var fileName = data.fileName;
                            else
                                var fileName = data.FILENAME;
                            if (data.success || data.SUCCESS) {
                                barcode.preview(fileName, true);
                            }
                            else {
                                common.errorModalDanger.modal('show');
                                if (data.showerror)
                                    common.errorModalMessage.html(data.showerror);
                                else
                                    common.errorModalMessage.html(data);
                            }
                        }
                    },
                    error: function (objRequest, strError) {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                        common.errorModalDanger.modal('show');
                        common.errorModalMessage.html(strError);
                    },
                    async: true
                });
            }
            else {
                toastr.error(msg);
            }
        });
    };
    Barcode.prototype.validate = function (model) {
        var message = "";
        if (model.textToEncode == "") {
            message += "Text To Encode is required<br>";
        }
        if (model.pages == "") {
            message += "Number of pages to apply the barcode is required.<br>";
        }
        return message;
    };
    return Barcode;
}(Base_1.Base));
exports.Barcode = Barcode;
},{"./Base":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("./Common");
var Config_1 = require("./Config");
var Base = /** @class */ (function () {
    function Base() {
        var base = this;
        this.config = new Config_1.Config();
        this.common = new Common_1.Common();
    }
    Base.prototype.preview = function (fileName, istemp) {
        var url = this.config.urls.viewer.preview + "&fileName=" + fileName + '&istemp=' + istemp;
        this.getCommon().pdf_iframe.attr("src", url);
    };
    Base.prototype.getConfig = function () {
        if (typeof this.config == 'undefined')
            this.config = new Config_1.Config();
        return this.config;
    };
    Base.prototype.getCommon = function () {
        if (typeof this.common == 'undefined')
            this.common = new Common_1.Common();
        return this.common;
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
},{"./Common":4,"./Config":5}],4:[function(require,module,exports){
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
        this.newuserpassword = $('#newuserpassword');
        //other
        this.pdf_iframe = $('#pdf_iframe');
    }
    return Common;
}());
exports.Common = Common;
},{}],5:[function(require,module,exports){
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
        this.readCustomerProperties = _path + "?event=properties.readCustomerProperties";
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
},{}],6:[function(require,module,exports){
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
var DigitalSignature = /** @class */ (function (_super) {
    __extends(DigitalSignature, _super);
    function DigitalSignature() {
        var _this = _super.call(this) || this;
        //buttons
        _this.add_signature_field_btn = $('#add_signature_field_btn');
        _this.d_x1 = $("#d_x1");
        _this.d_y1 = $("#d_y1");
        _this.d_x2 = $("#d_x2");
        _this.d_y2 = $("#d_y2");
        _this.page = $("#page");
        _this.fieldName = $("#fieldName");
        _this.setEventListeners();
        return _this;
    }
    DigitalSignature.prototype.setEventListeners = function (event) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var digitalSignature = this;
        digitalSignature.add_signature_field_btn.on('click', function (e) {
            var view_model = {
                newuserpassword: common.newuserpassword.val(),
                x1: digitalSignature.d_x1.val(),
                y1: digitalSignature.d_y1.val(),
                x2: digitalSignature.d_x2.val(),
                y2: digitalSignature.d_y2.val(),
                page: digitalSignature.page.val(),
                fieldName: digitalSignature.fieldName.val(),
                fileName: common.fileName.val()
            };
            var msg = digitalSignature.validate(view_model);
            if (msg == "") {
                var url = config.urls.digitalsignature.addField;
                $.ajax({
                    type: "post",
                    url: url,
                    data: view_model,
                    beforeSend: function (xhr) {
                        common.action_label.html('Adding signature field');
                        common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                    },
                    success: function (data) {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                        var tp = $.type(data);
                        if (tp === 'string') {
                            common.session_expired_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                        }
                        else {
                            if (data.fileName)
                                var fileName = data.fileName;
                            else
                                var fileName = data.FILENAME;
                            if (data.success || data.SUCCESS) {
                                digitalSignature.preview(fileName, true);
                                toastr.info('Signature field will not show up if you are using Chrome/Firefox/Safari browesers! download the PDF and open it using Adobe Acrobat Reader.');
                            }
                            else {
                                common.errorModalDanger.modal('show');
                                if (data.showerror)
                                    common.errorModalMessage.html(data.showerror);
                                else
                                    common.errorModalMessage.html(data);
                            }
                        }
                    },
                    error: function (objRequest, strError) {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                        toastr.danger('Exception!, our development team will look into this issue.');
                    },
                    async: true
                });
            }
            else {
                toastr.error(msg);
            }
        });
    };
    DigitalSignature.prototype.validate = function (model) {
        var message = "";
        if (model.x1 == "") {
            message += "X1 conrdinate is required<br>";
        }
        if (model.y1 == "") {
            message += "Y1 conrdinate is required<br>";
        }
        if (model.x2 == "") {
            message += "X2 conrdinate is required<br>";
        }
        if (model.y2 == "") {
            message += "Y2 conrdinate is required<br>";
        }
        if (model.fieldName == "") {
            message += "Signature field name is required<br>";
        }
        if (model.page == "") {
            message += "Page number is required.<br>";
        }
        if (Number(model.page) <= 0) {
            message += "Enter a positive number for page.<br>";
        }
        return message;
    };
    return DigitalSignature;
}(Base_1.Base));
exports.DigitalSignature = DigitalSignature;
},{"./Base":3}],7:[function(require,module,exports){
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
    function Main() {
        var _this = _super.call(this) || this;
        _this.url_input = $('#url_input');
        _this.uploaded_file = $('#uploaded_file');
        //button
        _this.upload_pdf_btn = $('#upload_pdf_btn');
        _this.confirm_yes = $('#confirm_yes');
        _this.urltoPDF_btn = $('#urltoPDF_btn');
        _this.btnExpiredOk = $('#btnExpiredOk');
        _this.password_apply_btn = $('#password_apply_btn');
        //modal
        //DIV/span/label
        _this.fileUploadModal_body = $('#fileUploadModal_body');
        _this.preload_div = $("#preload_div");
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
},{"./Base":3}],8:[function(require,module,exports){
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
var Properties = /** @class */ (function (_super) {
    __extends(Properties, _super);
    function Properties() {
        var _this = _super.call(this) || this;
        //buttons
        _this.add_custom_prop_btn = $('#add_custom_prop_btn');
        _this.save_properties_btn = $('#save_properties_btn');
        _this.export_meta_btn = $('#export_meta_btn');
        _this.import_meta_btn = $('#import_meta_btn');
        // this.del_cust_prop_btn = $('.btn orange darken-2 del');
        //divs
        _this.custom_prop_div = $('#custom_prop_div');
        _this.main_properties_body = $('#main_properties_body');
        //inputs
        _this.custome_prop_name = $('#custome_prop_name');
        _this.custome_prop_value = $('#custome_prop_value');
        _this.title_input = $('#title_input');
        _this.author_input = $('#author_input');
        _this.subject_input = $('#subject_input');
        _this.keywords_input = $('#keywords_input');
        //Other
        _this.arrayof_deletebtn_id = new Array();
        _this.setEventListeners();
        return _this;
    }
    Properties.prototype.setEventListeners = function (event) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var properties = this;
        properties.add_custom_prop_btn.on('click', function (e) {
            var view_model = {
                fileName: common.fileName.val(),
                name: properties.custome_prop_name.val(),
                value: properties.custome_prop_value.val()
            };
            var url = config.urls.properties.add;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    common.action_label.html('Adding');
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
                            $('#here_table').html('');
                            properties.renderCustomProperties(data);
                        }
                        else {
                            setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                            toastr.danger('Unable to add custom properties');
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
        properties.save_properties_btn.on('click', function (e) {
            properties.reinitInputs();
            var view_model = {
                fileName: common.fileName.val(),
                Title: properties.title_input.val(),
                Author: properties.author_input.val(),
                Subject: properties.subject_input.val(),
                Keywords: properties.keywords_input.val()
            };
            var url = config.urls.properties.save;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    common.action_label.html('Saving');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (html) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    properties.main_properties_body.html(html);
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    common.errorModalDanger.modal('show');
                    common.errorModalMessage.html(objRequest);
                },
                async: true
            });
        });
        properties.export_meta_btn.on('click', function (e) {
            properties.reinitInputs();
            var view_model = {
                fileName: common.fileName.val(),
                Title: properties.title_input.val(),
                Author: properties.author_input.val(),
                Subject: properties.subject_input.val(),
                Keywords: properties.keywords_input.val()
            };
            var url = config.urls.properties.export;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    common.action_label.html('Exporting');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    if (data.success) {
                        toastr.success('Metadata expoted successfully');
                    }
                    else {
                        common.errorModalDanger.modal('show');
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
        });
        /* properties.del_cust_prop_btn.on('click', function(e:Event){
             let prop = $(this).data('prop');
             console.log(prop);
         });*/
    };
    Properties.prototype.deleteCustomProperty = function (event, prp) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        if (typeof prp == 'undefined')
            prp = new Properties();
        var properties = prp;
        var prop = $(this).attr("data-prop");
        var view_model = {
            fileName: common.fileName.val(),
            name: prop
        };
        var url = config.urls.properties.delete;
        $.ajax({
            type: "post",
            url: url,
            data: view_model,
            beforeSend: function (xhr) {
                common.action_label.html('Deleting');
                common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
            },
            success: function (data) {
                var tp = $.type(data);
                if (tp === 'string') {
                    $('#here_table').html('');
                    common.errorModalDanger.modal('show');
                    common.errorModalMessage.html(data);
                }
                else {
                    if (data.success || data.SUCCESS) {
                        $('#here_table').html('');
                        properties.renderCustomProperties(data);
                    }
                    else {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                        $('#here_table').html('Unable to load custom properties');
                        toastr.danger('Unable to load custom properties');
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
    };
    Properties.prototype.renderCustomProperties = function (data) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var properties = this;
        $('#here_table').html('');
        var table = $('<table></table>').addClass('table');
        var thead = $('<thead></thead>').addClass('mdb-color darken-3');
        var htr = $('<tr></tr>').addClass('text-white');
        var hth = $('<th>##</th><th>Name</th><th>Value</th>');
        htr.append(hth);
        thead.append(htr);
        table.append(thead);
        var tbody = $('<tbody></tbody>');
        $.each(data.pdf.Properties, function (key, value) {
            var btn_id = 'del_cust_' + key;
            properties.arrayof_deletebtn_id.push(btn_id);
            var row = $('<tr><td>' + key + '</td><td>' + value + '</td><td><button data-prop=' + key + ' id="' + btn_id + '">Delete</button></td></tr>');
            tbody.append(row);
            table.append(tbody);
        });
        $('#here_table').append(table);
        $.each(properties.arrayof_deletebtn_id, function (index, value) {
            $('#' + value).click({ value: value, properties: properties }, properties.deleteCustomProperty);
        });
        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
    };
    Properties.prototype.readCustomProperties = function (data) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var properties = this;
        var view_model = {
            fileName: common.fileName.val(),
            password: common.passPdf.val()
        };
        var url2 = config.urls.properties.readCustomerProperties;
        $.ajax({
            type: "post",
            url: url2,
            data: view_model,
            beforeSend: function (xhr) {
                $('#here_table').html('Loading...');
            },
            success: function (data) {
                var tp = $.type(data);
                if (tp === 'string') {
                    $('#here_table').html('');
                    common.errorModalDanger.modal('show');
                    common.errorModalMessage.html(data);
                }
                else {
                    if (data.success || data.SUCCESS) {
                        properties.renderCustomProperties(data);
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    }
                    else {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                        $('#here_table').html('Unable to load custom properties');
                        toastr.danger('Unable to load custom properties');
                    }
                }
            }, error: function (objRequest, strError) {
                $('#here_table').html(strError);
            },
            async: true
        });
    };
    Properties.prototype.reinitInputs = function () {
        this.title_input = $('#title_input');
        this.author_input = $('#author_input');
        this.subject_input = $('#subject_input');
        this.keywords_input = $('#keywords_input');
    };
    return Properties;
}(Base_1.Base));
exports.Properties = Properties;
},{"./Base":3}],9:[function(require,module,exports){
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
var Redact = /** @class */ (function (_super) {
    __extends(Redact, _super);
    function Redact() {
        var _this = _super.call(this) || this;
        //buttons
        _this.redact_apply_btn = $('#redact_apply_btn');
        //inputs
        _this.r_x1 = $("#r_x1");
        _this.r_y1 = $("#r_y1");
        _this.r_x2 = $("#r_x2");
        _this.r_y2 = $("#r_y2");
        _this.r_page = $("#r_page");
        _this.setEventListeners();
        return _this;
    }
    Redact.prototype.setEventListeners = function (event) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var redact = this;
        redact.redact_apply_btn.on('click', function (e) {
            var view_model = {
                newuserpassword: common.newuserpassword.val(),
                x1: redact.r_x1.val(),
                y1: redact.r_y1.val(),
                x2: redact.r_x2.val(),
                y2: redact.r_y2.val(),
                page: redact.r_page.val(),
                fileName: common.fileName.val()
            };
            var msg = redact.validate(view_model);
            if (msg == "") {
                var url = config.urls.redact.add;
                $.ajax({
                    type: "post",
                    url: url,
                    data: view_model,
                    beforeSend: function (xhr) {
                        common.action_label.html('Redacting');
                        common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                    },
                    success: function (data) {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                        if (typeof data == 'string') {
                            common.session_expired_modal.modal('show');
                        }
                        else {
                            if (data.fileName)
                                var fileName = data.fileName;
                            else
                                var fileName = data.FILENAME;
                            if (data.success || data.SUCCESS) {
                                redact.preview(fileName, true);
                            }
                            else {
                                common.errorModalDanger.modal('show');
                                if (data.showerror)
                                    common.errorModalMessage.html(data.showerror);
                                else
                                    common.errorModalMessage.html(data);
                            }
                        }
                    },
                    error: function (objRequest, strError) {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                        toastr.danger('Exception!, our development team will look into this issue.');
                    },
                    async: true
                });
            }
            else {
                toastr.error(msg);
            }
        });
    };
    Redact.prototype.validate = function (model) {
        var message = "";
        if (model.x1 == "") {
            message += "X1 conrdinate is required<br>";
        }
        if (model.y1 == "") {
            message += "Y1 conrdinate is required<br>";
        }
        if (model.x2 == "") {
            message += "X2 conrdinate is required<br>";
        }
        if (model.y2 == "") {
            message += "Y2 conrdinate is required<br>";
        }
        if (model.page == "") {
            message += "Page number is required.<br>";
        }
        if (Number(model.page) <= 0) {
            message += "Enter a positive number for page.<br>";
        }
        return message;
    };
    return Redact;
}(Base_1.Base));
exports.Redact = Redact;
},{"./Base":3}],10:[function(require,module,exports){
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
var Stamp = /** @class */ (function (_super) {
    __extends(Stamp, _super);
    function Stamp() {
        var _this = _super.call(this) || this;
        //buttons
        _this.add_stamp_btn = $('#add_stamp_btn');
        //buttons
        _this.add_stamp_btn = $('#add_stamp_btn');
        //inputs
        _this.s_x1 = $("#s_x1");
        _this.s_y1 = $("#s_y1");
        _this.s_x2 = $("#s_x2");
        _this.s_y2 = $("#s_y2");
        _this.s_page = $("#s_page");
        _this.stamp_note = $("#stamp_note");
        _this.stamp_type = $("#stamp_type");
        _this.setEventListeners();
        return _this;
    }
    Stamp.prototype.setEventListeners = function (event) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var stamp = this;
        stamp.add_stamp_btn.on('click', function (e) {
            var view_model = {
                newuserpassword: common.newuserpassword.val(),
                x1: stamp.s_x1.val(),
                y1: stamp.s_y1.val(),
                x2: stamp.s_x2.val(),
                y2: stamp.s_y2.val(),
                pages: stamp.s_page.val(),
                fileName: common.fileName.val(),
                type: $("#stamp_type").find(":selected").text(),
                typeValue: $("#stamp_type").find(":selected").val(),
                note: stamp.stamp_note.val()
            };
            var msg = stamp.validate(view_model);
            if (msg == "") {
                var url = config.urls.stamp.add;
                $.ajax({
                    type: "post",
                    url: url,
                    data: view_model,
                    beforeSend: function (xhr) {
                        common.action_label.html('Adding stamp');
                        common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                    },
                    success: function (data) {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                        var tp = $.type(data);
                        if (tp === 'string') {
                            common.session_expired_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                        }
                        else {
                            if (data.fileName)
                                var fileName = data.fileName;
                            else
                                var fileName = data.FILENAME;
                            if (data.success || data.SUCCESS) {
                                stamp.preview(fileName, true);
                            }
                            else {
                                common.errorModalDanger.modal('show');
                                if (data.showerror)
                                    common.errorModalMessage.html(data.showerror);
                                else
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
            }
            else {
                toastr.error(msg);
            }
        });
    };
    Stamp.prototype.validate = function (model) {
        var message = "";
        if (model.x1 == "") {
            message += "X1 conrdinate is required<br>";
        }
        if (model.y1 == "") {
            message += "Y1 conrdinate is required<br>";
        }
        if (model.x2 == "") {
            message += "X2 conrdinate is required<br>";
        }
        if (model.y2 == "") {
            message += "Y2 conrdinate is required<br>";
        }
        if (model.pages == "") {
            message += "Number of pages to apply the stamp is required.<br>";
        }
        if (model.typeValue == "") {
            message += "Stamp type is required.<br>";
        }
        return message;
    };
    return Stamp;
}(Base_1.Base));
exports.Stamp = Stamp;
},{"./Base":3}],11:[function(require,module,exports){
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
var DigitalSignature_1 = require("./DigitalSignature");
var Redact_1 = require("./Redact");
var Stamp_1 = require("./Stamp");
var Barcode_1 = require("./Barcode");
var Properties_1 = require("./Properties");
var WorkBench = /** @class */ (function (_super) {
    __extends(WorkBench, _super);
    //arrayof_deletebtn_id : string[];
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
        //other/DIV
        _this.property_modal_body = $('#property_modal_body');
        _this.attached_fileName = $('#attached_fileName');
        // this.arrayof_deletebtn_id = new Array();
        _this.setEventListeners();
        return _this;
    }
    WorkBench.prototype.setEventListeners = function (event) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var workbench = this;
        this.digital_signature_modal.on('shown.bs.modal', function () {
            if (typeof workbench.digitalSignature == 'undefined')
                workbench.digitalSignature = new DigitalSignature_1.DigitalSignature();
        });
        this.redact_modal.on('shown.bs.modal', function () {
            if (typeof workbench.redact == 'undefined')
                workbench.redact = new Redact_1.Redact();
        });
        this.stamp_modal.on('shown.bs.modal', function () {
            if (typeof workbench.stamp == 'undefined')
                workbench.stamp = new Stamp_1.Stamp();
        });
        this.barcode_modal.on('shown.bs.modal', function () {
            if (typeof workbench.barcode == 'undefined')
                workbench.barcode = new Barcode_1.Barcode();
        });
        this.property_modal.on('show.bs.modal', function () {
            if (typeof workbench.properties == 'undefined')
                workbench.properties = new Properties_1.Properties();
            else if (workbench.properties == null)
                workbench.properties = new Properties_1.Properties();
        });
        this.property_modal.on('hide.bs.modal', function () {
            workbench.properties = null;
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
                fileName: common.fileName.val(),
                password: common.passPdf.val()
            };
            var url = config.urls.properties.index;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    common.action_label.html('Loading');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (html) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    workbench.property_modal_body.html(html);
                    var url2 = config.urls.properties.readCustomerProperties;
                    $.ajax({
                        type: "post",
                        url: url2,
                        data: view_model,
                        beforeSend: function (xhr) {
                            $('#here_table').html('Loading...');
                        },
                        success: function (data) {
                            var tp = $.type(data);
                            if (tp === 'string') {
                                $('#here_table').html('');
                                common.errorModalDanger.modal('show');
                                common.errorModalMessage.html(data);
                            }
                            else {
                                if (data.success || data.SUCCESS) {
                                    /*if (typeof workbench.properties == 'undefined')
                                        workbench.properties = new Properties();
*/
                                    workbench.properties.readCustomProperties();
                                }
                                else {
                                    $('#here_table').html('Unable to load custom properties');
                                    toastr.danger('Unable to load custom properties');
                                }
                            }
                        }, error: function (objRequest, strError) {
                            $('#here_table').html(strError);
                        },
                        async: true
                    });
                    workbench.property_modal.modal('show');
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { this.loading_modal.modal('hide'); }, 1500);
                    common.errorModalDanger.modal('show');
                    common.errorModalMessage.html(strError);
                },
                async: true
            });
            common.confirmation_modal.modal('hide');
        });
    };
    WorkBench.prototype.ping = function (prop) {
        var workbench = this;
        console.log('ping clicked');
        workbench.properties.deleteCustomProperty(prop, null);
        return "WorkBench class constructed.";
    };
    return WorkBench;
}(Base_1.Base));
exports.WorkBench = WorkBench;
},{"./Barcode":2,"./Base":3,"./DigitalSignature":6,"./Properties":8,"./Redact":9,"./Stamp":10}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy90cy9BcHBsaWNhdGlvbi50cyIsImluY2x1ZGVzL3RzL0JhcmNvZGUudHMiLCJpbmNsdWRlcy90cy9CYXNlLnRzIiwiaW5jbHVkZXMvdHMvQ29tbW9uLnRzIiwiaW5jbHVkZXMvdHMvQ29uZmlnLnRzIiwiaW5jbHVkZXMvdHMvRGlnaXRhbFNpZ25hdHVyZS50cyIsImluY2x1ZGVzL3RzL01haW4udHMiLCJpbmNsdWRlcy90cy9Qcm9wZXJ0aWVzLnRzIiwiaW5jbHVkZXMvdHMvUmVkYWN0LnRzIiwiaW5jbHVkZXMvdHMvU3RhbXAudHMiLCJpbmNsdWRlcy90cy9Xb3JrQmVuY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGtDQUFrQztBQUNsQyxtQ0FBa0M7QUFDbEMsK0JBQWdDO0FBQ2hDLHlDQUF3QztBQUN4QywwQ0FBMEM7QUFHMUMsSUFBSSxpQkFBc0IsQ0FBQztBQUczQixlQUFlLElBQVc7SUFDdEIsSUFBSSxXQUFjLENBQUM7SUFDbkIsaUNBQWlDO0lBQ2pDLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QixJQUFJLEdBQUcsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0lBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7SUFDdEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRXRFLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsS0FBSyxrQkFBa0IsRUFBQyxDQUFDO1lBQ3JCLFdBQVcsR0FBRyxFQUFDLFdBQVcsRUFBSSxjQUFjLEVBQUUsRUFBQyxDQUFDO1lBQ2hELEtBQUssQ0FBQztRQUNWLENBQUM7UUFHRDtZQUNJLEtBQUssQ0FBQztJQUNk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Q3BCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztRQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLFNBQVMsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQTtJQUN6QyxDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQWxWQSxBQWtWQyxDQWxWOEIsV0FBSSxHQWtWbEM7QUFsVlksOEJBQVMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiZ2xvYmFsLmQudHNcIi8+XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBNYWluIH0gICBmcm9tIFwiLi9NYWluXCI7XHJcbmltcG9ydCB7IFdvcmtCZW5jaCB9IGZyb20gXCIuL1dvcmtCZW5jaFwiO1xyXG4vL2ltcG9ydCB7IElHbG9iYWxTY29wZSB9IGZyb20gXCIuL2dsb2JhbFwiO1xyXG5cclxuXHJcbmxldCBjb25maXJtYXRpb25fdGV4dDogYW55O1xyXG5cclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KHBhdGg6c3RyaW5nKTp2b2lke1xyXG4gICAgbGV0IEdMT0JBTFNDT1BFOnt9O1xyXG4gICAgLy9Db250YWN0TG9nZ2VyLmxvZ0NvbnRhY3REYXRhKCk7XHJcbiAgICBjb25zdCBlbHQyID0gJChcIiNncmVldGluZ1wiKTtcclxuICAgIGxldCBjZmcgPSBuZXcgQ29uZmlnKCk7XHJcbiAgICBsZXQgbWFpbiA9IG5ldyBNYWluKCk7XHJcbiAgICBsZXQgZXZlbnROYW1lID0gbWFpbi5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJldmVudFwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcclxuICAgXHJcbiAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xyXG4gICAgICAgIGNhc2UgJ3ZpZXdlci53b3JrYmVuY2gnOntcclxuICAgICAgICAgICAgR0xPQkFMU0NPUEUgPSB7J1dvcmtCZW5jaCcgOiAgd29ya0JlbmNoU3RhcnQoKX07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICBcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGVsdDIuaHRtbChcIlwiKTtcclxuICAgIFxyXG59XHJcblxyXG5mdW5jdGlvbiB3b3JrQmVuY2hTdGFydCgpOldvcmtCZW5jaCB7XHJcbiAgICBsZXQgd29ya2JlbmNoID0gbmV3IFdvcmtCZW5jaCgpO1xyXG4gICAgcmV0dXJuIHdvcmtiZW5jaDtcclxufVxyXG5cclxuY2xhc3MgQ29udGFjdExvZ2dlcntcclxuICAgIHN0YXRpYyBsb2dDb250YWN0RGF0YSgpe1xyXG4gICAgICAgIGxldCBDT05UQUNUX0RBVEEgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERpc3BsYXlUZXh0OiAnaGVscCcsXHJcbiAgICAgICAgICAgICAgICBFbWFpbDogJ2hlbHBAc3MuY29tJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBEaXNwbGF5VGV4dDogJ2hlbHAyJyxcclxuICAgICAgICAgICAgICAgIEVtYWlsOiAnaGVscDJAc3MuY29tJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBEaXNwbGF5VGV4dDogJ2hlbHAzJyxcclxuICAgICAgICAgICAgICAgIEVtYWlsOiAnaGVscDNAc3MuY29tJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuICAgICAgICBmb3IgKGxldCBjb250YWN0IG9mIENPTlRBQ1RfREFUQSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRGlzcGxheSBUZXh0IDogJyArIGNvbnRhY3QuRGlzcGxheVRleHQgKyAnLCBFbWFpbCA6ICcrIGNvbnRhY3QuRW1haWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKlxyXG53aW5kb3cub25sb2FkID0gKCkgPT57XHJcbiAgICBDb250YWN0TG9nZ2VyLmxvZ0NvbnRhY3REYXRhKCk7XHJcbn0qL1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBzdGFydCh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpOyAgXHJcbiAgIC8vIHdpbmRvdy5nbG9iYWxWYXIgPSBcIlRoaXMgaXMgZ2xvYmFsIVwiO1xyXG5cclxufSk7XHJcbiIsImltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmFyY29kZSBleHRlbmRzIEJhc2Uge1xyXG5cclxuICAgIC8vYnV0dG9uc1xyXG4gICAgYWRkX2JhcmNvZGVfYnRuIDogYW55O1xyXG5cclxuICAgIC8vaW5wdXRzXHJcbiAgICBiX3BhZ2UgOiBhbnk7XHJcbiAgICB0ZXh0VG9FbmNvZGUgOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5hZGRfYmFyY29kZV9idG4gPSAkKCcjYWRkX2JhcmNvZGVfYnRuJyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRzXHJcbiAgICAgICAgdGhpcy5iX3BhZ2UgPSAkKFwiI2JfcGFnZVwiKTtcclxuICAgICAgICB0aGlzLnRleHRUb0VuY29kZSA9ICQoXCIjdGV4dFRvRW5jb2RlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWcgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgYmFyY29kZSA9IHRoaXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYmFyY29kZS5hZGRfYmFyY29kZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgcGFnZXM6IGJhcmNvZGUuYl9wYWdlLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgICAgICwgdGV4dFRvRW5jb2RlOiBiYXJjb2RlLnRleHRUb0VuY29kZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IG1zZyA9IGJhcmNvZGUudmFsaWRhdGUodmlld19tb2RlbCk7XHJcbiAgICAgICAgICAgIGlmIChtc2cgPT0gXCJcIikge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5iYXJjb2RlLmFkZDtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdBZGRpbmcgQmFyY29kZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLnNlc3Npb25fZXhwaXJlZF9tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFyY29kZS5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaG93ZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoc3RyRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGUobW9kZWw6YW55KTpzdHJpbmcge1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKG1vZGVsLnRleHRUb0VuY29kZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJUZXh0IFRvIEVuY29kZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwucGFnZXMgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiTnVtYmVyIG9mIHBhZ2VzIHRvIGFwcGx5IHRoZSBiYXJjb2RlIGlzIHJlcXVpcmVkLjxicj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29tbW9uIH0gZnJvbSBcIi4vQ29tbW9uXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgKiBhcyB0b2FzdHIgZnJvbSBcInRvYXN0clwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2Uge1xyXG5cclxuICAgIGNvbmZpZzpDb25maWc7XHJcbiAgICBjb21tb246Q29tbW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGxldCBiYXNlID0gdGhpcztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcoKTtcclxuICAgICAgICB0aGlzLmNvbW1vbiA9IG5ldyBDb21tb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJldmlldyhmaWxlTmFtZTogc3RyaW5nLCBpc3RlbXA6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5jb25maWcudXJscy52aWV3ZXIucHJldmlldyArIFwiJmZpbGVOYW1lPVwiICsgZmlsZU5hbWUgKyAnJmlzdGVtcD0nICsgaXN0ZW1wO1xyXG4gICAgICAgIHRoaXMuZ2V0Q29tbW9uKCkucGRmX2lmcmFtZS5hdHRyKFwic3JjXCIsIHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbmZpZygpOkNvbmZpZ3tcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuY29uZmlnID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbW1vbigpOkNvbW1vbntcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuY29tbW9uID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICB0aGlzLmNvbW1vbiA9IG5ldyBDb21tb24oKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21tb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhcmFtZXRlckJ5TmFtZShuYW1lOnN0cmluZywgdXJsOnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBpZiAoIXVybCkgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcXFxcJCZcIik7XHJcbiAgICAgICAgbGV0IHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLFxyXG4gICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XHJcbiAgICAgICAgaWYgKCFyZXN1bHRzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAoIXJlc3VsdHNbMl0pIHJldHVybiAnJztcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ29tbW9uIHtcclxuXHJcbiAgICAvL3RleHRcclxuICAgIGNvbmZpcm1hdGlvbl90ZXh0OiBhbnk7XHJcbiAgICBhY3Rpb25fbGFiZWw6IGFueTtcclxuICAgIGVycm9yTW9kYWxNZXNzYWdlOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dFxyXG4gICAgZmlsZU5hbWU6IGFueTtcclxuICAgIGZpZWxkTmFtZTogYW55O1xyXG4gICAgcGFzc1BkZjogYW55O1xyXG4gICAgbmV3dXNlcnBhc3N3b3JkOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbFxyXG4gICAgY29uZmlybWF0aW9uX21vZGFsOiBhbnk7XHJcbiAgICBsb2FkaW5nX21vZGFsOiBhbnk7XHJcbiAgICBlcnJvck1vZGFsRGFuZ2VyOiBhbnk7XHJcbiAgICBzZXNzaW9uX2V4cGlyZWRfbW9kYWw6IGFueTtcclxuXHJcbiAgICAvL090aGVyXHJcbiAgICBwZGZfaWZyYW1lOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7ICAgICAgIFxyXG4gICAgICAgIC8vdGV4dFxyXG4gICAgICAgIHRoaXMuY29uZmlybWF0aW9uX3RleHQgID0gJCgnI2NvbmZpcm1hdGlvbl90ZXh0Jyk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25fbGFiZWwgICAgICAgPSAkKFwiI2FjdGlvbl9sYWJlbFwiKTtcclxuICAgICAgICB0aGlzLmVycm9yTW9kYWxNZXNzYWdlICA9ICQoJyNlcnJvck1vZGFsTWVzc2FnZScpO1xyXG5cclxuICAgICAgICAvL21vZGFsXHJcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb25fbW9kYWwgICAgID0gJCgnI2NvbmZpcm1hdGlvbl9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMubG9hZGluZ19tb2RhbCAgICAgICAgICA9ICQoJyNsb2FkaW5nX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5lcnJvck1vZGFsRGFuZ2VyICAgICAgID0gJCgnI2Vycm9yTW9kYWxEYW5nZXInKTtcclxuICAgICAgICB0aGlzLnNlc3Npb25fZXhwaXJlZF9tb2RhbCAgPSAkKCcjc2Vzc2lvbl9leHBpcmVkX21vZGFsJyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRcclxuICAgICAgICB0aGlzLmZpbGVOYW1lID0gJCgnI2ZpbGVOYW1lJyk7XHJcbiAgICAgICAgdGhpcy5wYXNzUGRmICA9ICQoJyNwYXNzUGRmJyk7XHJcbiAgICAgICAgdGhpcy5uZXd1c2VycGFzc3dvcmQgPSAkKCcjbmV3dXNlcnBhc3N3b3JkJyk7XHJcblxyXG4gICAgICAgIC8vb3RoZXJcclxuICAgICAgICB0aGlzLnBkZl9pZnJhbWUgPSAkKCcjcGRmX2lmcmFtZScpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgdGhlQWN0dWFsU2VydmVyOiBzdHJpbmc7XHJcbiAgICBwcm90b2NvbDogc3RyaW5nO1xyXG4gICAgYXBwRm9sZGVyOiBzdHJpbmc7XHJcbiAgICBDR0lTY3JpcHROYW1lIDogc3RyaW5nO1xyXG4gICAgdXJsczogTXlVcmxzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudGhlQWN0dWFsU2VydmVyID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICAgICAgdGhpcy5wcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcclxuICAgICAgICB0aGlzLmFwcEZvbGRlciA9IFwiL1wiOyAgXHJcbiAgICAgICAgdGhpcy5DR0lTY3JpcHROYW1lID0gXCJcIjtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5wcm90b2NvbCArIFwiLy9cIiArIHRoaXMudGhlQWN0dWFsU2VydmVyICsgdGhpcy5hcHBGb2xkZXIgKyB0aGlzLkNHSVNjcmlwdE5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cmxzID0gbmV3IE15VXJscyggcGF0aCApO1xyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG59IFxyXG5cclxuY2xhc3MgTXlVcmxze1xyXG5cclxuICAgIG1haW46IE1haW47XHJcbiAgICBkaWdpdGFsc2lnbmF0dXJlOiBEaWdpdGFsc2lnbmF0dXJlO1xyXG4gICAgc3RhbXA6IFN0YW1wO1xyXG4gICAgc2FuaXRpemU6IFNhbml0aXplO1xyXG4gICAgcmVkYWN0OiBSZWRhY3Q7XHJcbiAgICBiYXJjb2RlOiBCYXJjb2RlO1xyXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcclxuICAgIHZpZXdlcjogVmlld2VyO1xyXG4gICAgcm9vdDogUm9vdDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMubWFpbiA9IG5ldyBNYWluKF9wKTtcclxuICAgICAgICB0aGlzLmRpZ2l0YWxzaWduYXR1cmUgPSBuZXcgRGlnaXRhbHNpZ25hdHVyZShfcCk7XHJcbiAgICAgICAgdGhpcy5zdGFtcCA9IG5ldyBTdGFtcChfcCk7XHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZSA9IG5ldyBTYW5pdGl6ZShfcCk7XHJcbiAgICAgICAgdGhpcy5yZWRhY3QgPSBuZXcgUmVkYWN0KF9wKTtcclxuICAgICAgICB0aGlzLmJhcmNvZGUgPSBuZXcgQmFyY29kZShfcCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoX3ApO1xyXG4gICAgICAgIHRoaXMudmlld2VyID0gbmV3IFZpZXdlcihfcCk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gbmV3IFJvb3QoX3ApO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbi8vRGlnaXRhbCBTaWduYXR1cmUgSGFuZGxlclxyXG5jbGFzcyBNYWluIHtcclxuICAgIGluZGV4OiBzdHJpbmc7XHJcbiAgICB1cGxvYWRGaWxlczogc3RyaW5nO1xyXG4gICAgcmVhZE1ldGFkYXRhOiBzdHJpbmc7XHJcbiAgICBwaW5nOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmluZGV4ID0gX3BhdGggKyBcIj9ldmVudD1tYWluLmluZGV4XCI7XHJcbiAgICAgICAgdGhpcy51cGxvYWRGaWxlcyA9IF9wYXRoICsgXCI/ZXZlbnQ9bWFpbi51cGxvYWRGaWxlc1wiO1xyXG4gICAgICAgIHRoaXMucmVhZE1ldGFkYXRhID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnJlYWRNZXRhZGF0YVwiO1xyXG4gICAgICAgIHRoaXMucGluZyA9IF9wYXRoICsgXCI/ZXZlbnQ9bWFpbi5waW5nXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERpZ2l0YWxzaWduYXR1cmUge1xyXG4gICAgYWRkRmllbGQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFkZEZpZWxkID0gX3BhdGggKyBcIj9ldmVudD1kaWdpdGFsc2lnbmF0dXJlLmFkZEZpZWxkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFN0YW1wIHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudD1zdGFtcC5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU2FuaXRpemV7XHJcbiAgICBhcHBseSA6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hcHBseSA9IF9wYXRoICsgXCI/ZXZlbnQ9c2FuaXRpemUuYXBwbHlcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVkYWN0IHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudD1yZWRhY3QuYWRkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEJhcmNvZGUge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PWJhcmNvZGUuYWRkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb3BlcnRpZXMgIHtcclxuICAgIGluZGV4OiBzdHJpbmc7XHJcbiAgICBhZGQ6IHN0cmluZzsgXHJcbiAgICBkZWxldGU6IHN0cmluZzsgXHJcbiAgICBzYXZlOiBzdHJpbmc7IFxyXG4gICAgZXhwb3J0OiBzdHJpbmc7ICAgICAgICBcclxuICAgIGltcG9ydDogc3RyaW5nOyAgXHJcbiAgICByZWFkQ3VzdG9tZXJQcm9wZXJ0aWVzOiBzdHJpbmc7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmluZGV4ICA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5pbmRleFwiO1xyXG4gICAgICAgIHRoaXMuYWRkICAgID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmFkZFwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZSAgID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLnNhdmVcIjtcclxuICAgICAgICB0aGlzLmV4cG9ydCA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5leHBvcnRcIjtcclxuICAgICAgICB0aGlzLmltcG9ydCA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5pbXBvcnRcIjtcclxuICAgICAgICB0aGlzLnJlYWRDdXN0b21lclByb3BlcnRpZXMgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMucmVhZEN1c3RvbWVyUHJvcGVydGllc1wiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBWaWV3ZXIge1xyXG4gICAgcHJldmlldyA6IHN0cmluZzsgXHJcbiAgICBkZWxldGU6IHN0cmluZztcclxuICAgIHJlc3RvcmU6IHN0cmluZztcclxuICAgIHNhdmU6IHN0cmluZztcclxuICAgIGVtYWlsOiBzdHJpbmc7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnByZXZpZXcgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5wcmV2aWV3XCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGUgICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIuZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5yZXN0b3JlICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIucmVzdG9yZVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZSAgICAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLnNhdmVcIjtcclxuICAgICAgICB0aGlzLmVtYWlsICAgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5lbWFpbFwiO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgUm9vdCB7XHJcbiAgICAgcGF0aDpzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgIHRoaXMucGF0aCA9IF9wYXRoO1xyXG4gICAgIH1cclxuIH1cclxuIiwiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEaWdpdGFsU2lnbmF0dXJlIGV4dGVuZHMgQmFzZSB7XHJcblxyXG4gICAgLy9CdXR0b25cclxuXHRhZGRfc2lnbmF0dXJlX2ZpZWxkX2J0biA6IGFueTtcclxuXHJcbiAgICBmaWxlTmFtZSA6IGFueTtcclxuICAgIGRfeDEgOiBhbnk7XHJcbiAgICBkX3kxIDogYW55O1xyXG4gICAgZF94MiA6IGFueTtcclxuICAgIGRfeTIgOiBhbnk7XHJcbiAgICBwYWdlIDogYW55O1xyXG4gICAgZmllbGROYW1lIDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5hZGRfc2lnbmF0dXJlX2ZpZWxkX2J0biA9ICQoJyNhZGRfc2lnbmF0dXJlX2ZpZWxkX2J0bicpO1xyXG5cclxuICAgICAgICB0aGlzLmRfeDEgPSAkKFwiI2RfeDFcIik7XHJcbiAgICAgICAgdGhpcy5kX3kxID0gJChcIiNkX3kxXCIpO1xyXG4gICAgICAgIHRoaXMuZF94MiA9ICQoXCIjZF94MlwiKTtcclxuICAgICAgICB0aGlzLmRfeTIgPSAkKFwiI2RfeTJcIik7XHJcbiAgICAgICAgdGhpcy5wYWdlID0gJChcIiNwYWdlXCIpO1xyXG4gICAgICAgIHRoaXMuZmllbGROYW1lID0gJChcIiNmaWVsZE5hbWVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBkaWdpdGFsU2lnbmF0dXJlID0gdGhpcztcclxuXHJcbiAgICAgICAgZGlnaXRhbFNpZ25hdHVyZS5hZGRfc2lnbmF0dXJlX2ZpZWxkX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZTpFdmVudCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBuZXd1c2VycGFzc3dvcmQ6IGNvbW1vbi5uZXd1c2VycGFzc3dvcmQudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDE6IGRpZ2l0YWxTaWduYXR1cmUuZF94MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5MTogZGlnaXRhbFNpZ25hdHVyZS5kX3kxLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHgyOiBkaWdpdGFsU2lnbmF0dXJlLmRfeDIudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTI6IGRpZ2l0YWxTaWduYXR1cmUuZF95Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBwYWdlOiBkaWdpdGFsU2lnbmF0dXJlLnBhZ2UudmFsKClcclxuICAgICAgICAgICAgICAgICwgZmllbGROYW1lOiBkaWdpdGFsU2lnbmF0dXJlLmZpZWxkTmFtZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgbXNnID0gZGlnaXRhbFNpZ25hdHVyZS52YWxpZGF0ZSggdmlld19tb2RlbCApO1xyXG4gICAgICAgICAgICBpZiAobXNnID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy5kaWdpdGFsc2lnbmF0dXJlLmFkZEZpZWxkO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0FkZGluZyBzaWduYXR1cmUgZmllbGQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZ2l0YWxTaWduYXR1cmUucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmluZm8oJ1NpZ25hdHVyZSBmaWVsZCB3aWxsIG5vdCBzaG93IHVwIGlmIHlvdSBhcmUgdXNpbmcgQ2hyb21lL0ZpcmVmb3gvU2FmYXJpIGJyb3dlc2VycyEgZG93bmxvYWQgdGhlIFBERiBhbmQgb3BlbiBpdCB1c2luZyBBZG9iZSBBY3JvYmF0IFJlYWRlci4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaG93ZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmRhbmdlcignRXhjZXB0aW9uISwgb3VyIGRldmVsb3BtZW50IHRlYW0gd2lsbCBsb29rIGludG8gdGhpcyBpc3N1ZS4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGUoIG1vZGVsOmFueSApOnN0cmluZyB7XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlID0gXCJcIjtcclxuICAgICAgICBpZiAobW9kZWwueDEgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDEgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbC55MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJZMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLngyID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlgyIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnkyID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkyIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLmZpZWxkTmFtZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJTaWduYXR1cmUgZmllbGQgbmFtZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwucGFnZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJQYWdlIG51bWJlciBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTnVtYmVyKG1vZGVsLnBhZ2UpIDw9IDApIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIkVudGVyIGEgcG9zaXRpdmUgbnVtYmVyIGZvciBwYWdlLjxicj5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuZXhwb3J0IGNsYXNzIE1haW4gZXh0ZW5kcyBCYXNlIHtcclxuICAgLy8gbWFpbjp0aGlzO1xyXG4gICAgY29uZmlnOkNvbmZpZztcclxuICAgXHJcbiAgICB1cmxfaW5wdXQgOiBhbnk7XHJcbiAgICB1cGxvYWRlZF9maWxlOiBhbnk7XHJcblxyXG4gICAgLy9idXR0b25cclxuICAgIHVwbG9hZF9wZGZfYnRuOiBhbnk7XHJcbiAgICBjb25maXJtX3llczogYW55O1xyXG4gICAgdXJsdG9QREZfYnRuOiBhbnk7XHJcbiAgICBidG5FeHBpcmVkT2s6IGFueTtcclxuICAgIHBhc3N3b3JkX2FwcGx5X2J0bjogYW55O1xyXG5cclxuICAgIC8vbW9kYWxcclxuXHJcbiAgICAvL0RJVi9zcGFuL2xhYmVsXHJcbiAgICBmaWxlVXBsb2FkTW9kYWxfYm9keTogYW55O1xyXG4gICAgcHJlbG9hZF9kaXY6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpOyAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXJsX2lucHV0ID0gJCgnI3VybF9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMudXBsb2FkZWRfZmlsZSA9ICQoJyN1cGxvYWRlZF9maWxlJyk7XHJcblxyXG4gICAgICAgIC8vYnV0dG9uXHJcbiAgICAgICAgdGhpcy51cGxvYWRfcGRmX2J0biA9ICQoJyN1cGxvYWRfcGRmX2J0bicpO1xyXG4gICAgICAgIHRoaXMuY29uZmlybV95ZXMgPSAkKCcjY29uZmlybV95ZXMnKTtcclxuICAgICAgICB0aGlzLnVybHRvUERGX2J0biA9ICQoJyN1cmx0b1BERl9idG4nKTtcclxuICAgICAgICB0aGlzLmJ0bkV4cGlyZWRPayA9ICQoJyNidG5FeHBpcmVkT2snKTtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkX2FwcGx5X2J0biA9ICQoJyNwYXNzd29yZF9hcHBseV9idG4nKTtcclxuXHJcbiAgICAgICAgLy9tb2RhbFxyXG5cclxuXHJcbiAgICAgICAgLy9ESVYvc3Bhbi9sYWJlbFxyXG4gICAgICAgIHRoaXMuZmlsZVVwbG9hZE1vZGFsX2JvZHkgPSAkKCcjZmlsZVVwbG9hZE1vZGFsX2JvZHknKTsgICAgICAgXHJcbiAgICAgICAgdGhpcy5wcmVsb2FkX2RpdiA9ICQoXCIjcHJlbG9hZF9kaXZcIik7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyggZXZlbnQ/OkV2ZW50ICk6dm9pZCB7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgbWFpbiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZGF0YSgnYnMubW9kYWwnLCBudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAvLyAgbGV0IHJlZGFjdCA9IG5ldyBSZWRhY3QoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maXJtX3llcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6RXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IGNvbW1vbi5wYXNzUGRmLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gY29uZmlnLnVybHMuc2FuaXRpemUuYXBwbHk7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ1Nhbml0aXppbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaG93ZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwaW5nKCk6c3RyaW5ne1xyXG4gICAgICAgIHJldHVybiBcIk1haW4gY2xhc3MgY29uc3RydWN0ZWQuXCJcclxuICAgIH1cclxuXHJcbn0iLCJcclxuaW1wb3J0IHsgQ29tbW9uIH0gZnJvbSBcIi4vQ29tbW9uXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb3BlcnRpZXMgZXh0ZW5kcyBCYXNlIHtcclxuXHJcbiAgICAvL2J1dHRvbnNcclxuXHRhZGRfY3VzdG9tX3Byb3BfYnRuIDogYW55O1xyXG4gICAgc2F2ZV9wcm9wZXJ0aWVzX2J0biA6IGFueTtcclxuICAgIGV4cG9ydF9tZXRhX2J0biAgICAgOiBhbnk7XHJcbiAgICBpbXBvcnRfbWV0YV9idG4gICAgIDogYW55O1xyXG4gICAgLy9kZWxfY3VzdF9wcm9wX2J0biAgIDogYW55O1xyXG5cclxuICAgIC8vZGl2c1xyXG4gICAgY3VzdG9tX3Byb3BfZGl2ICAgICAgOiBhbnk7XHJcbiAgICBtYWluX3Byb3BlcnRpZXNfYm9keSA6IGFueTtcclxuXHJcbiAgICAvL2lucHV0c1xyXG4gICAgY3VzdG9tZV9wcm9wX25hbWUgICA6IGFueTtcclxuICAgIGN1c3RvbWVfcHJvcF92YWx1ZSAgOiBhbnk7XHJcbiAgICB0aXRsZV9pbnB1dCAgICAgICAgIDogYW55O1xyXG4gICAgYXV0aG9yX2lucHV0ICAgICAgICA6IGFueTtcclxuICAgIHN1YmplY3RfaW5wdXQgICAgICAgOiBhbnk7XHJcbiAgICBrZXl3b3Jkc19pbnB1dCAgICAgIDogYW55O1xyXG4gICAgXHJcbiAgICAvL090aGVyXHJcbiAgICBhcnJheW9mX2RlbGV0ZWJ0bl9pZDogc3RyaW5nW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5hZGRfY3VzdG9tX3Byb3BfYnRuID0gJCgnI2FkZF9jdXN0b21fcHJvcF9idG4nKTtcclxuICAgICAgICB0aGlzLnNhdmVfcHJvcGVydGllc19idG4gPSAkKCcjc2F2ZV9wcm9wZXJ0aWVzX2J0bicpO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0X21ldGFfYnRuICAgICA9ICQoJyNleHBvcnRfbWV0YV9idG4nKTtcclxuICAgICAgICB0aGlzLmltcG9ydF9tZXRhX2J0biAgICAgPSAkKCcjaW1wb3J0X21ldGFfYnRuJyk7XHJcbiAgICAgICAvLyB0aGlzLmRlbF9jdXN0X3Byb3BfYnRuID0gJCgnLmJ0biBvcmFuZ2UgZGFya2VuLTIgZGVsJyk7XHJcbiAgICAgXHJcbiAgICAgICAgLy9kaXZzXHJcbiAgICAgICAgdGhpcy5jdXN0b21fcHJvcF9kaXYgICAgICA9ICQoJyNjdXN0b21fcHJvcF9kaXYnKTtcclxuICAgICAgICB0aGlzLm1haW5fcHJvcGVydGllc19ib2R5ID0gJCgnI21haW5fcHJvcGVydGllc19ib2R5Jyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRzXHJcbiAgICAgICAgdGhpcy5jdXN0b21lX3Byb3BfbmFtZSAgPSAkKCcjY3VzdG9tZV9wcm9wX25hbWUnKTtcclxuICAgICAgICB0aGlzLmN1c3RvbWVfcHJvcF92YWx1ZSA9ICQoJyNjdXN0b21lX3Byb3BfdmFsdWUnKTtcclxuICAgICAgICB0aGlzLnRpdGxlX2lucHV0ICAgICAgICA9ICQoJyN0aXRsZV9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuYXV0aG9yX2lucHV0ICAgICAgID0gJCgnI2F1dGhvcl9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuc3ViamVjdF9pbnB1dCAgICAgID0gJCgnI3N1YmplY3RfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmtleXdvcmRzX2lucHV0ICAgICA9ICQoJyNrZXl3b3Jkc19pbnB1dCcpO1xyXG4gICAgICAgIC8vT3RoZXJcclxuICAgICAgICB0aGlzLmFycmF5b2ZfZGVsZXRlYnRuX2lkID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uICAgICAgPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnICAgICAgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyAgPSB0aGlzO1xyXG5cclxuICAgICAgICBwcm9wZXJ0aWVzLmFkZF9jdXN0b21fcHJvcF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogcHJvcGVydGllcy5jdXN0b21lX3Byb3BfbmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzLmN1c3RvbWVfcHJvcF92YWx1ZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMucHJvcGVydGllcy5hZGQ7XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0FkZGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJDdXN0b21Qcm9wZXJ0aWVzKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5kYW5nZXIoJ1VuYWJsZSB0byBhZGQgY3VzdG9tIHByb3BlcnRpZXMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwcm9wZXJ0aWVzLnNhdmVfcHJvcGVydGllc19idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVpbml0SW5wdXRzKCk7XHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBwcm9wZXJ0aWVzLnRpdGxlX2lucHV0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgQXV0aG9yOiBwcm9wZXJ0aWVzLmF1dGhvcl9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIFN1YmplY3Q6IHByb3BlcnRpZXMuc3ViamVjdF9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIEtleXdvcmRzOiBwcm9wZXJ0aWVzLmtleXdvcmRzX2lucHV0LnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLnNhdmU7XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnU2F2aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLm1haW5fcHJvcGVydGllc19ib2R5Lmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5leHBvcnRfbWV0YV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVpbml0SW5wdXRzKCk7XHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBwcm9wZXJ0aWVzLnRpdGxlX2lucHV0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgQXV0aG9yOiBwcm9wZXJ0aWVzLmF1dGhvcl9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIFN1YmplY3Q6IHByb3BlcnRpZXMuc3ViamVjdF9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIEtleXdvcmRzOiBwcm9wZXJ0aWVzLmtleXdvcmRzX2lucHV0LnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLmV4cG9ydDtcclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdFeHBvcnRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnTWV0YWRhdGEgZXhwb3RlZCBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgIC8qIHByb3BlcnRpZXMuZGVsX2N1c3RfcHJvcF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZTpFdmVudCl7XHJcbiAgICAgICAgICAgIGxldCBwcm9wID0gJCh0aGlzKS5kYXRhKCdwcm9wJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb3ApO1xyXG4gICAgICAgIH0pOyovXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGVDdXN0b21Qcm9wZXJ0eShldmVudDphbnkscHJwPzpQcm9wZXJ0aWVzKTp2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1vbjpDb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnOkNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGlmKCB0eXBlb2YgcHJwID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBwcnAgPSBuZXcgUHJvcGVydGllcygpO1xyXG5cclxuICAgICAgICBsZXQgcHJvcGVydGllcyAgICA9IHBycDtcclxuICAgICAgICBsZXQgcHJvcCA9ICAkKHRoaXMpLmF0dHIoXCJkYXRhLXByb3BcIik7XHJcbiAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgIG5hbWU6IHByb3BcclxuXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMucHJvcGVydGllcy5kZWxldGU7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnRGVsZXRpbmcnKTtcclxuICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJDdXN0b21Qcm9wZXJ0aWVzKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnVW5hYmxlIHRvIGxvYWQgY3VzdG9tIHByb3BlcnRpZXMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmRhbmdlcignVW5hYmxlIHRvIGxvYWQgY3VzdG9tIHByb3BlcnRpZXMnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyQ3VzdG9tUHJvcGVydGllcyhkYXRhOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBwcm9wZXJ0aWVzID0gdGhpcztcclxuXHJcbiAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5odG1sKCcnKTtcclxuICAgICAgICBsZXQgdGFibGUgPSAkKCc8dGFibGU+PC90YWJsZT4nKS5hZGRDbGFzcygndGFibGUnKTtcclxuICAgICAgICBsZXQgdGhlYWQgPSAkKCc8dGhlYWQ+PC90aGVhZD4nKS5hZGRDbGFzcygnbWRiLWNvbG9yIGRhcmtlbi0zJyk7XHJcbiAgICAgICAgbGV0IGh0ciA9ICQoJzx0cj48L3RyPicpLmFkZENsYXNzKCd0ZXh0LXdoaXRlJyk7XHJcbiAgICAgICAgbGV0IGh0aCA9ICQoJzx0aD4jIzwvdGg+PHRoPk5hbWU8L3RoPjx0aD5WYWx1ZTwvdGg+Jyk7XHJcbiAgICAgICAgaHRyLmFwcGVuZChodGgpO1xyXG4gICAgICAgIHRoZWFkLmFwcGVuZChodHIpO1xyXG4gICAgICAgIHRhYmxlLmFwcGVuZCh0aGVhZCk7XHJcbiAgICAgICAgbGV0IHRib2R5ID0gJCgnPHRib2R5PjwvdGJvZHk+Jyk7XHJcblxyXG4gICAgICAgICQuZWFjaChkYXRhLnBkZi5Qcm9wZXJ0aWVzLCBmdW5jdGlvbiAoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbGV0IGJ0bl9pZCA9ICdkZWxfY3VzdF8nICsga2V5O1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmFycmF5b2ZfZGVsZXRlYnRuX2lkLnB1c2goYnRuX2lkKTtcclxuICAgICAgICAgICAgbGV0IHJvdyA9ICQoJzx0cj48dGQ+JyArIGtleSArICc8L3RkPjx0ZD4nICsgdmFsdWUgKyAnPC90ZD48dGQ+PGJ1dHRvbiBkYXRhLXByb3A9JyArIGtleSArJyBpZD1cIicgKyBidG5faWQgKyAnXCI+RGVsZXRlPC9idXR0b24+PC90ZD48L3RyPicpO1xyXG4gICAgICAgICAgICB0Ym9keS5hcHBlbmQocm93KTtcclxuICAgICAgICAgICAgdGFibGUuYXBwZW5kKHRib2R5KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAkKCcjaGVyZV90YWJsZScpLmFwcGVuZCh0YWJsZSk7XHJcblxyXG4gICAgICAgICQuZWFjaChwcm9wZXJ0aWVzLmFycmF5b2ZfZGVsZXRlYnRuX2lkLCBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICQoJyMnICsgdmFsdWUpLmNsaWNrKHsgdmFsdWUscHJvcGVydGllcyB9LCBwcm9wZXJ0aWVzLmRlbGV0ZUN1c3RvbVByb3BlcnR5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWFkQ3VzdG9tUHJvcGVydGllcyhkYXRhPzphbnkpOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgPSB0aGlzO1xyXG5cclxuICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGNvbW1vbi5wYXNzUGRmLnZhbCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgdXJsMiA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMucmVhZEN1c3RvbWVyUHJvcGVydGllcztcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgdXJsOiB1cmwyLFxyXG4gICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnTG9hZGluZy4uLicpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlckN1c3RvbVByb3BlcnRpZXMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJ1VuYWJsZSB0byBsb2FkIGN1c3RvbSBwcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5kYW5nZXIoJ1VuYWJsZSB0byBsb2FkIGN1c3RvbSBwcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSwgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbChzdHJFcnJvcik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWluaXRJbnB1dHMoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLnRpdGxlX2lucHV0ICAgID0gJCgnI3RpdGxlX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5hdXRob3JfaW5wdXQgICA9ICQoJyNhdXRob3JfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLnN1YmplY3RfaW5wdXQgID0gJCgnI3N1YmplY3RfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmtleXdvcmRzX2lucHV0ID0gJCgnI2tleXdvcmRzX2lucHV0Jyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgQ29tbW9uIH0gZnJvbSBcIi4vQ29tbW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVkYWN0IGV4dGVuZHMgQmFzZSB7XHJcblxyXG4gICAgLy9DbGFzc2VzXHJcbiAgICBjb25maWcgOiBDb25maWc7XHJcbiAgICBjb21tb24gOiBDb21tb247XHJcblxyXG4gICAgLy9idXR0b25zXHJcblx0cmVkYWN0X2FwcGx5X2J0biA6IGFueTtcclxuXHJcbiAgICAvL2lucHV0cyBcclxuICAgIHJfeDEgOiBhbnk7XHJcbiAgICByX3kxIDogYW55O1xyXG4gICAgcl94MiA6IGFueTtcclxuICAgIHJfeTIgOiBhbnk7XHJcbiAgICByX3BhZ2UgOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLnJlZGFjdF9hcHBseV9idG4gPSAkKCcjcmVkYWN0X2FwcGx5X2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMucl94MSA9ICQoXCIjcl94MVwiKTtcclxuICAgICAgICB0aGlzLnJfeTEgPSAkKFwiI3JfeTFcIik7XHJcbiAgICAgICAgdGhpcy5yX3gyID0gJChcIiNyX3gyXCIpO1xyXG4gICAgICAgIHRoaXMucl95MiA9ICQoXCIjcl95MlwiKTtcclxuICAgICAgICB0aGlzLnJfcGFnZSA9ICQoXCIjcl9wYWdlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWcgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgcmVkYWN0ID0gdGhpcztcclxuXHJcbiAgICAgICAgcmVkYWN0LnJlZGFjdF9hcHBseV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBuZXd1c2VycGFzc3dvcmQ6IGNvbW1vbi5uZXd1c2VycGFzc3dvcmQudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDE6IHJlZGFjdC5yX3gxLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHkxOiByZWRhY3Qucl95MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4MjogcmVkYWN0LnJfeDIudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTI6IHJlZGFjdC5yX3kyLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHBhZ2U6IHJlZGFjdC5yX3BhZ2UudmFsKClcclxuICAgICAgICAgICAgICAgICwgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IG1zZyA9IHJlZGFjdC52YWxpZGF0ZSh2aWV3X21vZGVsKTtcclxuICAgICAgICAgICAgaWYgKG1zZyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gY29uZmlnLnVybHMucmVkYWN0LmFkZDtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdSZWRhY3RpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZGFjdC5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaG93ZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmRhbmdlcignRXhjZXB0aW9uISwgb3VyIGRldmVsb3BtZW50IHRlYW0gd2lsbCBsb29rIGludG8gdGhpcyBpc3N1ZS4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGUgKG1vZGVsOmFueSk6c3RyaW5nIHtcclxuICAgICBcclxuICAgICAgICBsZXQgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKG1vZGVsLngxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlgxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueTEgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTEgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbC54MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC55MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJZMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC5wYWdlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlBhZ2UgbnVtYmVyIGlzIHJlcXVpcmVkLjxicj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChOdW1iZXIobW9kZWwucGFnZSkgPD0gMCkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiRW50ZXIgYSBwb3NpdGl2ZSBudW1iZXIgZm9yIHBhZ2UuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhbXAgZXh0ZW5kcyBCYXNlIHtcclxuXHJcbiAgICAvL2J1dHRvbnNcclxuXHRhZGRfc3RhbXBfYnRuID0gJCgnI2FkZF9zdGFtcF9idG4nKTtcclxuXHJcbiAgICAvL2lucHV0c1xyXG4gICAgc194MSA6IGFueTtcclxuICAgIHNfeTEgOiBhbnk7XHJcbiAgICBzX3gyIDogYW55O1xyXG4gICAgc195MiA6IGFueTtcclxuICAgIHNfcGFnZSA6IGFueTtcclxuICAgIHN0YW1wX25vdGUgOiBhbnk7XHJcbiAgICBzdGFtcF90eXBlIDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vYnV0dG9uc1xyXG4gICAgICAgIHRoaXMuYWRkX3N0YW1wX2J0biA9ICQoJyNhZGRfc3RhbXBfYnRuJyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRzXHJcbiAgICAgICAgdGhpcy5zX3gxID0gJChcIiNzX3gxXCIpO1xyXG4gICAgICAgIHRoaXMuc195MSA9ICQoXCIjc195MVwiKTtcclxuICAgICAgICB0aGlzLnNfeDIgPSAkKFwiI3NfeDJcIik7XHJcbiAgICAgICAgdGhpcy5zX3kyID0gJChcIiNzX3kyXCIpO1xyXG4gICAgICAgIHRoaXMuc19wYWdlID0gJChcIiNzX3BhZ2VcIik7XHJcbiAgICAgICAgdGhpcy5zdGFtcF9ub3RlID0gJChcIiNzdGFtcF9ub3RlXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhbXBfdHlwZSA9ICQoXCIjc3RhbXBfdHlwZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHN0YW1wID0gdGhpcztcclxuXHJcbiAgICAgICAgc3RhbXAuYWRkX3N0YW1wX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIG5ld3VzZXJwYXNzd29yZDogY29tbW9uLm5ld3VzZXJwYXNzd29yZC52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4MTogc3RhbXAuc194MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5MTogc3RhbXAuc195MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4Mjogc3RhbXAuc194Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5Mjogc3RhbXAuc195Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBwYWdlczogc3RhbXAuc19wYWdlLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgICAgICwgdHlwZTogJChcIiNzdGFtcF90eXBlXCIpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpXHJcbiAgICAgICAgICAgICAgICAsIHR5cGVWYWx1ZTogJChcIiNzdGFtcF90eXBlXCIpLmZpbmQoXCI6c2VsZWN0ZWRcIikudmFsKClcclxuICAgICAgICAgICAgICAgICwgbm90ZTogc3RhbXAuc3RhbXBfbm90ZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgbXNnID0gc3RhbXAudmFsaWRhdGUodmlld19tb2RlbCk7XHJcbiAgICAgICAgICAgIGlmIChtc2cgPT0gXCJcIikge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy5zdGFtcC5hZGQ7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnQWRkaW5nIHN0YW1wJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLnNlc3Npb25fZXhwaXJlZF9tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbXAucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2hvd2Vycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobXNnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZShtb2RlbDphbnkpOnN0cmluZyB7XHJcbiAgICAgICBcclxuICAgICAgICBsZXQgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKG1vZGVsLngxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlgxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueTEgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTEgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbC54MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC55MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJZMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC5wYWdlcyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJOdW1iZXIgb2YgcGFnZXMgdG8gYXBwbHkgdGhlIHN0YW1wIGlzIHJlcXVpcmVkLjxicj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC50eXBlVmFsdWUgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiU3RhbXAgdHlwZSBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IENvbW1vbiB9IGZyb20gXCIuL0NvbW1vblwiO1xyXG5pbXBvcnQge0Jhc2V9IGZyb20gXCIuL0Jhc2VcIjtcclxuaW1wb3J0IHsgRGlnaXRhbFNpZ25hdHVyZSB9IGZyb20gXCIuL0RpZ2l0YWxTaWduYXR1cmVcIjtcclxuaW1wb3J0IHsgUmVkYWN0IH0gZnJvbSBcIi4vUmVkYWN0XCI7XHJcbmltcG9ydCB7IFN0YW1wIH0gZnJvbSBcIi4vU3RhbXBcIjtcclxuaW1wb3J0IHsgQmFyY29kZSB9IGZyb20gXCIuL0JhcmNvZGVcIjtcclxuaW1wb3J0IHsgUHJvcGVydGllcyB9IGZyb20gXCIuL1Byb3BlcnRpZXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JrQmVuY2ggZXh0ZW5kcyBCYXNle1xyXG5cclxuICAgIC8vY2xhc3Nlc1xyXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcclxuICAgIGJhcmNvZGUgOiBCYXJjb2RlO1xyXG4gICAgc3RhbXAgOiBTdGFtcDtcclxuICAgIHJlZGFjdCA6IFJlZGFjdDtcclxuICAgIGRpZ2l0YWxTaWduYXR1cmU6IERpZ2l0YWxTaWduYXR1cmU7XHJcbiAgICBjb25maWc6IENvbmZpZztcclxuICAgIGNvbW1vbjogQ29tbW9uO1xyXG5cclxuICAgIC8vYnV0dG9uc1xyXG4gICAgcmVzZXRfYnRuIDogYW55O1xyXG4gICAgZGVsZXRlX2J0bjogYW55O1xyXG4gICAgZW1haWxfYnRuOiBhbnk7XHJcbiAgICBzZW5kX2VtYWlsX2J0bjogYW55O1xyXG4gICAgcmVzdG9yZV9idG46IGFueTtcclxuICAgIHNhbml0aXplX2J0bjogYW55O1xyXG4gICAgcHJvcGVydHlfYnRuOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dHNcclxuICAgIHlvdXJfZW1haWw6IGFueTtcclxuICAgIHlvdXJfc3ViamVjdDogYW55O1xyXG4gICAgeW91cl9tZXNzYWdlOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbHNcclxuICAgIGRpZ2l0YWxfc2lnbmF0dXJlX21vZGFsOiBhbnk7XHJcbiAgICBzdGFtcF9tb2RhbDogYW55O1xyXG4gICAgYmFyY29kZV9tb2RhbDogYW55O1xyXG4gICAgcmVkYWN0X21vZGFsOiBhbnk7XHJcbiAgICBwcm9wZXJ0eV9tb2RhbDogYW55O1xyXG4gICAgZW1haWxfbW9kYWw6IGFueTtcclxuXHJcbiAgICAvL290aGVyL0RJVlxyXG4gICAgcHJvcGVydHlfbW9kYWxfYm9keTogYW55O1xyXG4gICAgYXR0YWNoZWRfZmlsZU5hbWU6IGFueTtcclxuICAgIC8vYXJyYXlvZl9kZWxldGVidG5faWQgOiBzdHJpbmdbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5yZXNldF9idG4gPSAkKCcjcmVzZXRfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVfYnRuID0gJCgnI2RlbGV0ZV9idG4nKTtcclxuICAgICAgICB0aGlzLmVtYWlsX2J0biA9ICQoJyNlbWFpbF9idG4nKTtcclxuICAgICAgICB0aGlzLnNlbmRfZW1haWxfYnRuID0gJCgnI3NlbmRfZW1haWxfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5yZXN0b3JlX2J0biA9ICQoJyNyZXN0b3JlX2J0bicpO1xyXG4gICAgICAgIHRoaXMuc2FuaXRpemVfYnRuID0gJCgnI3Nhbml0aXplX2J0bicpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlfYnRuID0gJCgnI3Byb3BlcnR5X2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMueW91cl9lbWFpbCA9ICQoJyN5b3VyX2VtYWlsJyk7XHJcbiAgICAgICAgdGhpcy55b3VyX3N1YmplY3QgPSAkKCcjeW91cl9zdWJqZWN0Jyk7XHJcbiAgICAgICAgdGhpcy55b3VyX21lc3NhZ2UgPSAkKCcjeW91cl9tZXNzYWdlJyk7XHJcblxyXG4gICAgICAgIC8vbW9kYWxzXHJcbiAgICAgICAgdGhpcy5kaWdpdGFsX3NpZ25hdHVyZV9tb2RhbCA9ICQoJyNkaWdpdGFsX3NpZ25hdHVyZV9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMuc3RhbXBfbW9kYWwgPSAkKCcjc3RhbXBfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLmJhcmNvZGVfbW9kYWwgPSAkKCcjYmFyY29kZV9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMucmVkYWN0X21vZGFsID0gJCgnI3JlZGFjdF9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWwgPSAkKCcjcHJvcGVydHlfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLmVtYWlsX21vZGFsID0gJCgnI2VtYWlsX21vZGFsJyk7XHJcblxyXG4gICAgICAgIC8vb3RoZXIvRElWXHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eV9tb2RhbF9ib2R5ID0gJCgnI3Byb3BlcnR5X21vZGFsX2JvZHknKTtcclxuICAgICAgICB0aGlzLmF0dGFjaGVkX2ZpbGVOYW1lID0gJCgnI2F0dGFjaGVkX2ZpbGVOYW1lJyk7XHJcbiAgICAgICAvLyB0aGlzLmFycmF5b2ZfZGVsZXRlYnRuX2lkID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHdvcmtiZW5jaCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3b3JrYmVuY2guZGlnaXRhbFNpZ25hdHVyZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5kaWdpdGFsU2lnbmF0dXJlID0gbmV3IERpZ2l0YWxTaWduYXR1cmUoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVkYWN0X21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLnJlZGFjdCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5yZWRhY3QgPSBuZXcgUmVkYWN0KCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnN0YW1wX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLnN0YW1wID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgd29ya2JlbmNoLnN0YW1wID0gbmV3IFN0YW1wKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJhcmNvZGVfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3b3JrYmVuY2guYmFyY29kZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5iYXJjb2RlID0gbmV3IEJhcmNvZGUoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWwub24oJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3b3JrYmVuY2gucHJvcGVydGllcyA9PSAndW5kZWZpbmVkJyApXHJcbiAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydGllcyA9IG5ldyBQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCB3b3JrYmVuY2gucHJvcGVydGllcyA9PSBudWxsIClcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWwub24oJ2hpZGUuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydGllcyA9IG51bGw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy52aWV3ZXIuZGVsZXRlO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnRGVsZXRpbmcgdGhlIGZpbGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLnNlc3Npb25fZXhwaXJlZF9tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9jYXRpb24uaHJlZiA9IGNvbmZpZy51cmxzLnJvb3QucGF0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5yZXN0b3JlX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6RXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9IGNvbmZpZy51cmxzLnZpZXdlci5yZXN0b3JlO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnUmVzdG9yaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUylcclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmVtYWlsX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdvcmtiZW5jaC5hdHRhY2hlZF9maWxlTmFtZS5odG1sKGNvbW1vbi5maWxlTmFtZS52YWwoKSk7XHJcbiAgICAgICAgICAgIHdvcmtiZW5jaC5lbWFpbF9tb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZW5kX2VtYWlsX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBtYWlsdG86IHdvcmtiZW5jaC55b3VyX2VtYWlsLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgc3ViamVjdDogd29ya2JlbmNoLnlvdXJfc3ViamVjdC52YWwoKSxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHdvcmtiZW5jaC55b3VyX21lc3NhZ2UudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy52aWV3ZXIuZW1haWw7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLmVtYWlsX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdFbWFpbGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmluZm8oJ0VtYWlsIGhhcyBiZWVuIHNlbnQuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2guZW1haWxfbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1VuYWJsZSB0byBzZW5kIHRoZSBlbWFpbC4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OiBFdmVudCkge1xyXG4gICAgICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX3RleHQuaHRtbCgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIFNhbml0aXplIHRoZSBQREY/Jyk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5jb25maXJtYXRpb25fbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucHJvcGVydHlfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDogRXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBjb21tb24ucGFzc1BkZi52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMuaW5kZXg7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdMb2FkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydHlfbW9kYWxfYm9keS5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsMiA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMucmVhZEN1c3RvbWVyUHJvcGVydGllcztcclxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnTG9hZGluZy4uLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHsgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qaWYgKHR5cGVvZiB3b3JrYmVuY2gucHJvcGVydGllcyA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoKTtcclxuKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLnByb3BlcnRpZXMucmVhZEN1c3RvbVByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJ1VuYWJsZSB0byBsb2FkIGN1c3RvbSBwcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5kYW5nZXIoJ1VuYWJsZSB0byBsb2FkIGN1c3RvbSBwcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbChzdHJFcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcm9wZXJ0eV9tb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoc3RyRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGluZyggcHJvcDpzdHJpbmcgKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgd29ya2JlbmNoID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZygncGluZyBjbGlja2VkJyk7XHJcbiAgICAgICAgd29ya2JlbmNoLnByb3BlcnRpZXMuZGVsZXRlQ3VzdG9tUHJvcGVydHkocHJvcCxudWxsKTtcclxuICAgICAgICByZXR1cm4gXCJXb3JrQmVuY2ggY2xhc3MgY29uc3RydWN0ZWQuXCJcclxuICAgIH1cclxufSJdfQ==
