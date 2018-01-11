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
},{"./Barcode":2,"./Base":3,"./DigitalSignature":6,"./Properties":8,"./Redact":9,"./Stamp":10}]},{},[1,11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy90cy9BcHBsaWNhdGlvbi50cyIsImluY2x1ZGVzL3RzL0JhcmNvZGUudHMiLCJpbmNsdWRlcy90cy9CYXNlLnRzIiwiaW5jbHVkZXMvdHMvQ29tbW9uLnRzIiwiaW5jbHVkZXMvdHMvQ29uZmlnLnRzIiwiaW5jbHVkZXMvdHMvRGlnaXRhbFNpZ25hdHVyZS50cyIsImluY2x1ZGVzL3RzL01haW4udHMiLCJpbmNsdWRlcy90cy9Qcm9wZXJ0aWVzLnRzIiwiaW5jbHVkZXMvdHMvUmVkYWN0LnRzIiwiaW5jbHVkZXMvdHMvU3RhbXAudHMiLCJpbmNsdWRlcy90cy9Xb3JrQmVuY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGtDQUFrQztBQUNsQyxtQ0FBa0M7QUFDbEMsK0JBQWdDO0FBQ2hDLHlDQUF3QztBQUN4QywwQ0FBMEM7QUFHMUMsSUFBSSxpQkFBc0IsQ0FBQztBQUczQixlQUFlLElBQVc7SUFDdEIsSUFBSSxXQUFjLENBQUM7SUFDbkIsaUNBQWlDO0lBQ2pDLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QixJQUFJLEdBQUcsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0lBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7SUFDdEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRXRFLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsS0FBSyxrQkFBa0IsRUFBQyxDQUFDO1lBQ3JCLFdBQVcsR0FBRyxFQUFDLFdBQVcsRUFBSSxjQUFjLEVBQUUsRUFBQyxDQUFDO1lBQ2hELEtBQUssQ0FBQztRQUNWLENBQUM7UUFHRDtZQUNJLEtBQUssQ0FBQztJQUNk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QUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDLDhCQUE4QixDQUFBO0lBQ3pDLENBQUM7SUFDTCxnQkFBQztBQUFELENBbFZBLEFBa1ZDLENBbFY4QixXQUFJLEdBa1ZsQztBQWxWWSw4QkFBUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJnbG9iYWwuZC50c1wiLz5cclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IE1haW4gfSAgIGZyb20gXCIuL01haW5cIjtcclxuaW1wb3J0IHsgV29ya0JlbmNoIH0gZnJvbSBcIi4vV29ya0JlbmNoXCI7XHJcbi8vaW1wb3J0IHsgSUdsb2JhbFNjb3BlIH0gZnJvbSBcIi4vZ2xvYmFsXCI7XHJcblxyXG5cclxubGV0IGNvbmZpcm1hdGlvbl90ZXh0OiBhbnk7XHJcblxyXG5cclxuZnVuY3Rpb24gc3RhcnQocGF0aDpzdHJpbmcpOnZvaWR7XHJcbiAgICBsZXQgR0xPQkFMU0NPUEU6e307XHJcbiAgICAvL0NvbnRhY3RMb2dnZXIubG9nQ29udGFjdERhdGEoKTtcclxuICAgIGNvbnN0IGVsdDIgPSAkKFwiI2dyZWV0aW5nXCIpO1xyXG4gICAgbGV0IGNmZyA9IG5ldyBDb25maWcoKTtcclxuICAgIGxldCBtYWluID0gbmV3IE1haW4oKTtcclxuICAgIGxldCBldmVudE5hbWUgPSBtYWluLmdldFBhcmFtZXRlckJ5TmFtZShcImV2ZW50XCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxyXG4gICBcclxuICAgIHN3aXRjaCAoZXZlbnROYW1lKSB7XHJcbiAgICAgICAgY2FzZSAndmlld2VyLndvcmtiZW5jaCc6e1xyXG4gICAgICAgICAgICBHTE9CQUxTQ09QRSA9IHsnV29ya0JlbmNoJyA6ICB3b3JrQmVuY2hTdGFydCgpfTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgIFxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgZWx0Mi5odG1sKFwiXCIpO1xyXG4gICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdvcmtCZW5jaFN0YXJ0KCk6V29ya0JlbmNoIHtcclxuICAgIGxldCB3b3JrYmVuY2ggPSBuZXcgV29ya0JlbmNoKCk7XHJcbiAgICByZXR1cm4gd29ya2JlbmNoO1xyXG59XHJcblxyXG5jbGFzcyBDb250YWN0TG9nZ2Vye1xyXG4gICAgc3RhdGljIGxvZ0NvbnRhY3REYXRhKCl7XHJcbiAgICAgICAgbGV0IENPTlRBQ1RfREFUQSA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRGlzcGxheVRleHQ6ICdoZWxwJyxcclxuICAgICAgICAgICAgICAgIEVtYWlsOiAnaGVscEBzcy5jb20nXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIERpc3BsYXlUZXh0OiAnaGVscDInLFxyXG4gICAgICAgICAgICAgICAgRW1haWw6ICdoZWxwMkBzcy5jb20nXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIERpc3BsYXlUZXh0OiAnaGVscDMnLFxyXG4gICAgICAgICAgICAgICAgRW1haWw6ICdoZWxwM0Bzcy5jb20nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG4gICAgICAgIGZvciAobGV0IGNvbnRhY3Qgb2YgQ09OVEFDVF9EQVRBICl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEaXNwbGF5IFRleHQgOiAnICsgY29udGFjdC5EaXNwbGF5VGV4dCArICcsIEVtYWlsIDogJysgY29udGFjdC5FbWFpbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PntcclxuICAgIENvbnRhY3RMb2dnZXIubG9nQ29udGFjdERhdGEoKTtcclxufSovXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSggZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHN0YXJ0KHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7ICBcclxuICAgLy8gd2luZG93Lmdsb2JhbFZhciA9IFwiVGhpcyBpcyBnbG9iYWwhXCI7XHJcblxyXG59KTtcclxuIiwiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCYXJjb2RlIGV4dGVuZHMgQmFzZSB7XHJcblxyXG4gICAgLy9idXR0b25zXHJcbiAgICBhZGRfYmFyY29kZV9idG4gOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dHNcclxuICAgIGJfcGFnZSA6IGFueTtcclxuICAgIHRleHRUb0VuY29kZSA6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLmFkZF9iYXJjb2RlX2J0biA9ICQoJyNhZGRfYmFyY29kZV9idG4nKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dHNcclxuICAgICAgICB0aGlzLmJfcGFnZSA9ICQoXCIjYl9wYWdlXCIpO1xyXG4gICAgICAgIHRoaXMudGV4dFRvRW5jb2RlID0gJChcIiN0ZXh0VG9FbmNvZGVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBiYXJjb2RlID0gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICBiYXJjb2RlLmFkZF9iYXJjb2RlX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZTpFdmVudCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlczogYmFyY29kZS5iX3BhZ2UudmFsKClcclxuICAgICAgICAgICAgICAgICwgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB0ZXh0VG9FbmNvZGU6IGJhcmNvZGUudGV4dFRvRW5jb2RlLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgbXNnID0gYmFyY29kZS52YWxpZGF0ZSh2aWV3X21vZGVsKTtcclxuICAgICAgICAgICAgaWYgKG1zZyA9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLmJhcmNvZGUuYWRkO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0FkZGluZyBCYXJjb2RlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uc2Vzc2lvbl9leHBpcmVkX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXJjb2RlLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YS5zaG93ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChzdHJFcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZShtb2RlbDphbnkpOnN0cmluZyB7XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlID0gXCJcIjtcclxuICAgICAgICBpZiAobW9kZWwudGV4dFRvRW5jb2RlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlRleHQgVG8gRW5jb2RlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC5wYWdlcyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJOdW1iZXIgb2YgcGFnZXMgdG8gYXBwbHkgdGhlIGJhcmNvZGUgaXMgcmVxdWlyZWQuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb21tb24gfSBmcm9tIFwiLi9Db21tb25cIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIHRvYXN0ciBmcm9tIFwidG9hc3RyXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZSB7XHJcblxyXG4gICAgY29uZmlnOkNvbmZpZztcclxuICAgIGNvbW1vbjpDb21tb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgbGV0IGJhc2UgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuY29tbW9uID0gbmV3IENvbW1vbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmV2aWV3KGZpbGVOYW1lOiBzdHJpbmcsIGlzdGVtcDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmNvbmZpZy51cmxzLnZpZXdlci5wcmV2aWV3ICsgXCImZmlsZU5hbWU9XCIgKyBmaWxlTmFtZSArICcmaXN0ZW1wPScgKyBpc3RlbXA7XHJcbiAgICAgICAgdGhpcy5nZXRDb21tb24oKS5wZGZfaWZyYW1lLmF0dHIoXCJzcmNcIiwgdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29uZmlnKCk6Q29uZmlne1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb25maWcgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29tbW9uKCk6Q29tbW9ue1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb21tb24gPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHRoaXMuY29tbW9uID0gbmV3IENvbW1vbigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbW1vbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UGFyYW1ldGVyQnlOYW1lKG5hbWU6c3RyaW5nLCB1cmw6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICBsZXQgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgbmFtZSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksXHJcbiAgICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICghcmVzdWx0c1syXSkgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb21tb24ge1xyXG5cclxuICAgIC8vdGV4dFxyXG4gICAgY29uZmlybWF0aW9uX3RleHQ6IGFueTtcclxuICAgIGFjdGlvbl9sYWJlbDogYW55O1xyXG4gICAgZXJyb3JNb2RhbE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgICAvL2lucHV0XHJcbiAgICBmaWxlTmFtZTogYW55O1xyXG4gICAgZmllbGROYW1lOiBhbnk7XHJcbiAgICBwYXNzUGRmOiBhbnk7XHJcbiAgICBuZXd1c2VycGFzc3dvcmQ6IGFueTtcclxuXHJcbiAgICAvL21vZGFsXHJcbiAgICBjb25maXJtYXRpb25fbW9kYWw6IGFueTtcclxuICAgIGxvYWRpbmdfbW9kYWw6IGFueTtcclxuICAgIGVycm9yTW9kYWxEYW5nZXI6IGFueTtcclxuICAgIHNlc3Npb25fZXhwaXJlZF9tb2RhbDogYW55O1xyXG5cclxuICAgIC8vT3RoZXJcclxuICAgIHBkZl9pZnJhbWU6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgICAgICAgXHJcbiAgICAgICAgLy90ZXh0XHJcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb25fdGV4dCAgPSAkKCcjY29uZmlybWF0aW9uX3RleHQnKTtcclxuICAgICAgICB0aGlzLmFjdGlvbl9sYWJlbCAgICAgICA9ICQoXCIjYWN0aW9uX2xhYmVsXCIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3JNb2RhbE1lc3NhZ2UgID0gJCgnI2Vycm9yTW9kYWxNZXNzYWdlJyk7XHJcblxyXG4gICAgICAgIC8vbW9kYWxcclxuICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbl9tb2RhbCAgICAgPSAkKCcjY29uZmlybWF0aW9uX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nX21vZGFsICAgICAgICAgID0gJCgnI2xvYWRpbmdfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLmVycm9yTW9kYWxEYW5nZXIgICAgICAgPSAkKCcjZXJyb3JNb2RhbERhbmdlcicpO1xyXG4gICAgICAgIHRoaXMuc2Vzc2lvbl9leHBpcmVkX21vZGFsICA9ICQoJyNzZXNzaW9uX2V4cGlyZWRfbW9kYWwnKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dFxyXG4gICAgICAgIHRoaXMuZmlsZU5hbWUgPSAkKCcjZmlsZU5hbWUnKTtcclxuICAgICAgICB0aGlzLnBhc3NQZGYgID0gJCgnI3Bhc3NQZGYnKTtcclxuICAgICAgICB0aGlzLm5ld3VzZXJwYXNzd29yZCA9ICQoJyNuZXd1c2VycGFzc3dvcmQnKTtcclxuXHJcbiAgICAgICAgLy9vdGhlclxyXG4gICAgICAgIHRoaXMucGRmX2lmcmFtZSA9ICQoJyNwZGZfaWZyYW1lJyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICB0aGVBY3R1YWxTZXJ2ZXI6IHN0cmluZztcclxuICAgIHByb3RvY29sOiBzdHJpbmc7XHJcbiAgICBhcHBGb2xkZXI6IHN0cmluZztcclxuICAgIENHSVNjcmlwdE5hbWUgOiBzdHJpbmc7XHJcbiAgICB1cmxzOiBNeVVybHM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy50aGVBY3R1YWxTZXJ2ZXIgPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgICAgICB0aGlzLnByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xyXG4gICAgICAgIHRoaXMuYXBwRm9sZGVyID0gXCIvXCI7ICBcclxuICAgICAgICB0aGlzLkNHSVNjcmlwdE5hbWUgPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnByb3RvY29sICsgXCIvL1wiICsgdGhpcy50aGVBY3R1YWxTZXJ2ZXIgKyB0aGlzLmFwcEZvbGRlciArIHRoaXMuQ0dJU2NyaXB0TmFtZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVybHMgPSBuZXcgTXlVcmxzKCBwYXRoICk7XHJcbiAgICAgICBcclxuICAgIH1cclxuXHJcbn0gXHJcblxyXG5jbGFzcyBNeVVybHN7XHJcblxyXG4gICAgbWFpbjogTWFpbjtcclxuICAgIGRpZ2l0YWxzaWduYXR1cmU6IERpZ2l0YWxzaWduYXR1cmU7XHJcbiAgICBzdGFtcDogU3RhbXA7XHJcbiAgICBzYW5pdGl6ZTogU2FuaXRpemU7XHJcbiAgICByZWRhY3Q6IFJlZGFjdDtcclxuICAgIGJhcmNvZGU6IEJhcmNvZGU7XHJcbiAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xyXG4gICAgdmlld2VyOiBWaWV3ZXI7XHJcbiAgICByb290OiBSb290O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5tYWluID0gbmV3IE1haW4oX3ApO1xyXG4gICAgICAgIHRoaXMuZGlnaXRhbHNpZ25hdHVyZSA9IG5ldyBEaWdpdGFsc2lnbmF0dXJlKF9wKTtcclxuICAgICAgICB0aGlzLnN0YW1wID0gbmV3IFN0YW1wKF9wKTtcclxuICAgICAgICB0aGlzLnNhbml0aXplID0gbmV3IFNhbml0aXplKF9wKTtcclxuICAgICAgICB0aGlzLnJlZGFjdCA9IG5ldyBSZWRhY3QoX3ApO1xyXG4gICAgICAgIHRoaXMuYmFyY29kZSA9IG5ldyBCYXJjb2RlKF9wKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBuZXcgUHJvcGVydGllcyhfcCk7XHJcbiAgICAgICAgdGhpcy52aWV3ZXIgPSBuZXcgVmlld2VyKF9wKTtcclxuICAgICAgICB0aGlzLnJvb3QgPSBuZXcgUm9vdChfcCk7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuLy9EaWdpdGFsIFNpZ25hdHVyZSBIYW5kbGVyXHJcbmNsYXNzIE1haW4ge1xyXG4gICAgaW5kZXg6IHN0cmluZztcclxuICAgIHVwbG9hZEZpbGVzOiBzdHJpbmc7XHJcbiAgICByZWFkTWV0YWRhdGE6IHN0cmluZztcclxuICAgIHBpbmc6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBfcGF0aCArIFwiP2V2ZW50PW1haW4uaW5kZXhcIjtcclxuICAgICAgICB0aGlzLnVwbG9hZEZpbGVzID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnVwbG9hZEZpbGVzXCI7XHJcbiAgICAgICAgdGhpcy5yZWFkTWV0YWRhdGEgPSBfcGF0aCArIFwiP2V2ZW50PW1haW4ucmVhZE1ldGFkYXRhXCI7XHJcbiAgICAgICAgdGhpcy5waW5nID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnBpbmdcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGlnaXRhbHNpZ25hdHVyZSB7XHJcbiAgICBhZGRGaWVsZDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkRmllbGQgPSBfcGF0aCArIFwiP2V2ZW50PWRpZ2l0YWxzaWduYXR1cmUuYWRkRmllbGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU3RhbXAge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PXN0YW1wLmFkZFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTYW5pdGl6ZXtcclxuICAgIGFwcGx5IDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFwcGx5ID0gX3BhdGggKyBcIj9ldmVudD1zYW5pdGl6ZS5hcHBseVwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWRhY3Qge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PXJlZGFjdC5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQmFyY29kZSB7XHJcbiAgICBhZGQgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmFkZCA9IF9wYXRoICsgXCI/ZXZlbnQ9YmFyY29kZS5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUHJvcGVydGllcyAge1xyXG4gICAgaW5kZXg6IHN0cmluZztcclxuICAgIGFkZDogc3RyaW5nOyBcclxuICAgIGRlbGV0ZTogc3RyaW5nOyBcclxuICAgIHNhdmU6IHN0cmluZzsgXHJcbiAgICBleHBvcnQ6IHN0cmluZzsgICAgICAgIFxyXG4gICAgaW1wb3J0OiBzdHJpbmc7ICBcclxuICAgIHJlYWRDdXN0b21lclByb3BlcnRpZXM6IHN0cmluZztcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuaW5kZXggID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmluZGV4XCI7XHJcbiAgICAgICAgdGhpcy5hZGQgICAgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMuYWRkXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGUgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMuZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5zYXZlICAgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMuc2F2ZVwiO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0ID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmV4cG9ydFwiO1xyXG4gICAgICAgIHRoaXMuaW1wb3J0ID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmltcG9ydFwiO1xyXG4gICAgICAgIHRoaXMucmVhZEN1c3RvbWVyUHJvcGVydGllcyA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5yZWFkQ3VzdG9tZXJQcm9wZXJ0aWVzXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFZpZXdlciB7XHJcbiAgICBwcmV2aWV3IDogc3RyaW5nOyBcclxuICAgIGRlbGV0ZTogc3RyaW5nO1xyXG4gICAgcmVzdG9yZTogc3RyaW5nO1xyXG4gICAgc2F2ZTogc3RyaW5nO1xyXG4gICAgZW1haWw6IHN0cmluZztcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucHJldmlldyAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLnByZXZpZXdcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZSAgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5kZWxldGVcIjtcclxuICAgICAgICB0aGlzLnJlc3RvcmUgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5yZXN0b3JlXCI7XHJcbiAgICAgICAgdGhpcy5zYXZlICAgICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIuc2F2ZVwiO1xyXG4gICAgICAgIHRoaXMuZW1haWwgICAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLmVtYWlsXCI7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBSb290IHtcclxuICAgICBwYXRoOnN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKXtcclxuICAgICAgICAgdGhpcy5wYXRoID0gX3BhdGg7XHJcbiAgICAgfVxyXG4gfVxyXG4iLCJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERpZ2l0YWxTaWduYXR1cmUgZXh0ZW5kcyBCYXNlIHtcclxuXHJcbiAgICAvL0J1dHRvblxyXG5cdGFkZF9zaWduYXR1cmVfZmllbGRfYnRuIDogYW55O1xyXG5cclxuICAgIGZpbGVOYW1lIDogYW55O1xyXG4gICAgZF94MSA6IGFueTtcclxuICAgIGRfeTEgOiBhbnk7XHJcbiAgICBkX3gyIDogYW55O1xyXG4gICAgZF95MiA6IGFueTtcclxuICAgIHBhZ2UgOiBhbnk7XHJcbiAgICBmaWVsZE5hbWUgOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLmFkZF9zaWduYXR1cmVfZmllbGRfYnRuID0gJCgnI2FkZF9zaWduYXR1cmVfZmllbGRfYnRuJyk7XHJcblxyXG4gICAgICAgIHRoaXMuZF94MSA9ICQoXCIjZF94MVwiKTtcclxuICAgICAgICB0aGlzLmRfeTEgPSAkKFwiI2RfeTFcIik7XHJcbiAgICAgICAgdGhpcy5kX3gyID0gJChcIiNkX3gyXCIpO1xyXG4gICAgICAgIHRoaXMuZF95MiA9ICQoXCIjZF95MlwiKTtcclxuICAgICAgICB0aGlzLnBhZ2UgPSAkKFwiI3BhZ2VcIik7XHJcbiAgICAgICAgdGhpcy5maWVsZE5hbWUgPSAkKFwiI2ZpZWxkTmFtZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IGRpZ2l0YWxTaWduYXR1cmUgPSB0aGlzO1xyXG5cclxuICAgICAgICBkaWdpdGFsU2lnbmF0dXJlLmFkZF9zaWduYXR1cmVfZmllbGRfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIG5ld3VzZXJwYXNzd29yZDogY29tbW9uLm5ld3VzZXJwYXNzd29yZC52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4MTogZGlnaXRhbFNpZ25hdHVyZS5kX3gxLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHkxOiBkaWdpdGFsU2lnbmF0dXJlLmRfeTEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDI6IGRpZ2l0YWxTaWduYXR1cmUuZF94Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5MjogZGlnaXRhbFNpZ25hdHVyZS5kX3kyLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHBhZ2U6IGRpZ2l0YWxTaWduYXR1cmUucGFnZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBmaWVsZE5hbWU6IGRpZ2l0YWxTaWduYXR1cmUuZmllbGROYW1lLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtc2cgPSBkaWdpdGFsU2lnbmF0dXJlLnZhbGlkYXRlKCB2aWV3X21vZGVsICk7XHJcbiAgICAgICAgICAgIGlmIChtc2cgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGNvbmZpZy51cmxzLmRpZ2l0YWxzaWduYXR1cmUuYWRkRmllbGQ7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnQWRkaW5nIHNpZ25hdHVyZSBmaWVsZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLnNlc3Npb25fZXhwaXJlZF9tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlnaXRhbFNpZ25hdHVyZS5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuaW5mbygnU2lnbmF0dXJlIGZpZWxkIHdpbGwgbm90IHNob3cgdXAgaWYgeW91IGFyZSB1c2luZyBDaHJvbWUvRmlyZWZveC9TYWZhcmkgYnJvd2VzZXJzISBkb3dubG9hZCB0aGUgUERGIGFuZCBvcGVuIGl0IHVzaW5nIEFkb2JlIEFjcm9iYXQgUmVhZGVyLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YS5zaG93ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZGFuZ2VyKCdFeGNlcHRpb24hLCBvdXIgZGV2ZWxvcG1lbnQgdGVhbSB3aWxsIGxvb2sgaW50byB0aGlzIGlzc3VlLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZSggbW9kZWw6YW55ICk6c3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIGlmIChtb2RlbC54MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLnkxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueDIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwueTIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwuZmllbGROYW1lID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlNpZ25hdHVyZSBmaWVsZCBuYW1lIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC5wYWdlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlBhZ2UgbnVtYmVyIGlzIHJlcXVpcmVkLjxicj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChOdW1iZXIobW9kZWwucGFnZSkgPD0gMCkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiRW50ZXIgYSBwb3NpdGl2ZSBudW1iZXIgZm9yIHBhZ2UuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5leHBvcnQgY2xhc3MgTWFpbiBleHRlbmRzIEJhc2Uge1xyXG4gICAvLyBtYWluOnRoaXM7XHJcbiAgICBjb25maWc6Q29uZmlnO1xyXG4gICBcclxuICAgIHVybF9pbnB1dCA6IGFueTtcclxuICAgIHVwbG9hZGVkX2ZpbGU6IGFueTtcclxuXHJcbiAgICAvL2J1dHRvblxyXG4gICAgdXBsb2FkX3BkZl9idG46IGFueTtcclxuICAgIGNvbmZpcm1feWVzOiBhbnk7XHJcbiAgICB1cmx0b1BERl9idG46IGFueTtcclxuICAgIGJ0bkV4cGlyZWRPazogYW55O1xyXG4gICAgcGFzc3dvcmRfYXBwbHlfYnRuOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbFxyXG5cclxuICAgIC8vRElWL3NwYW4vbGFiZWxcclxuICAgIGZpbGVVcGxvYWRNb2RhbF9ib2R5OiBhbnk7XHJcbiAgICBwcmVsb2FkX2RpdjogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7ICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cmxfaW5wdXQgPSAkKCcjdXJsX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy51cGxvYWRlZF9maWxlID0gJCgnI3VwbG9hZGVkX2ZpbGUnKTtcclxuXHJcbiAgICAgICAgLy9idXR0b25cclxuICAgICAgICB0aGlzLnVwbG9hZF9wZGZfYnRuID0gJCgnI3VwbG9hZF9wZGZfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5jb25maXJtX3llcyA9ICQoJyNjb25maXJtX3llcycpO1xyXG4gICAgICAgIHRoaXMudXJsdG9QREZfYnRuID0gJCgnI3VybHRvUERGX2J0bicpO1xyXG4gICAgICAgIHRoaXMuYnRuRXhwaXJlZE9rID0gJCgnI2J0bkV4cGlyZWRPaycpO1xyXG4gICAgICAgIHRoaXMucGFzc3dvcmRfYXBwbHlfYnRuID0gJCgnI3Bhc3N3b3JkX2FwcGx5X2J0bicpO1xyXG5cclxuICAgICAgICAvL21vZGFsXHJcblxyXG5cclxuICAgICAgICAvL0RJVi9zcGFuL2xhYmVsXHJcbiAgICAgICAgdGhpcy5maWxlVXBsb2FkTW9kYWxfYm9keSA9ICQoJyNmaWxlVXBsb2FkTW9kYWxfYm9keScpOyAgICAgICBcclxuICAgICAgICB0aGlzLnByZWxvYWRfZGl2ID0gJChcIiNwcmVsb2FkX2RpdlwiKTtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKCBldmVudD86RXZlbnQgKTp2b2lkIHtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBtYWluID0gdGhpcztcclxuXHJcbiAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdicy5tb2RhbCcsIG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIC8vICBsZXQgcmVkYWN0ID0gbmV3IFJlZGFjdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbmZpcm1feWVzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDpFdmVudCkge1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogY29tbW9uLnBhc3NQZGYudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy5zYW5pdGl6ZS5hcHBseTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnU2FuaXRpemluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW4ucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbW1vbi5jb25maXJtYXRpb25fbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpbmcoKTpzdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIFwiTWFpbiBjbGFzcyBjb25zdHJ1Y3RlZC5cIlxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5pbXBvcnQgeyBDb21tb24gfSBmcm9tIFwiLi9Db21tb25cIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvcGVydGllcyBleHRlbmRzIEJhc2Uge1xyXG5cclxuICAgIC8vYnV0dG9uc1xyXG5cdGFkZF9jdXN0b21fcHJvcF9idG4gOiBhbnk7XHJcbiAgICBzYXZlX3Byb3BlcnRpZXNfYnRuIDogYW55O1xyXG4gICAgZXhwb3J0X21ldGFfYnRuICAgICA6IGFueTtcclxuICAgIGltcG9ydF9tZXRhX2J0biAgICAgOiBhbnk7XHJcbiAgICAvL2RlbF9jdXN0X3Byb3BfYnRuICAgOiBhbnk7XHJcblxyXG4gICAgLy9kaXZzXHJcbiAgICBjdXN0b21fcHJvcF9kaXYgICAgICA6IGFueTtcclxuICAgIG1haW5fcHJvcGVydGllc19ib2R5IDogYW55O1xyXG5cclxuICAgIC8vaW5wdXRzXHJcbiAgICBjdXN0b21lX3Byb3BfbmFtZSAgIDogYW55O1xyXG4gICAgY3VzdG9tZV9wcm9wX3ZhbHVlICA6IGFueTtcclxuICAgIHRpdGxlX2lucHV0ICAgICAgICAgOiBhbnk7XHJcbiAgICBhdXRob3JfaW5wdXQgICAgICAgIDogYW55O1xyXG4gICAgc3ViamVjdF9pbnB1dCAgICAgICA6IGFueTtcclxuICAgIGtleXdvcmRzX2lucHV0ICAgICAgOiBhbnk7XHJcbiAgICBcclxuICAgIC8vT3RoZXJcclxuICAgIGFycmF5b2ZfZGVsZXRlYnRuX2lkOiBzdHJpbmdbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLmFkZF9jdXN0b21fcHJvcF9idG4gPSAkKCcjYWRkX2N1c3RvbV9wcm9wX2J0bicpO1xyXG4gICAgICAgIHRoaXMuc2F2ZV9wcm9wZXJ0aWVzX2J0biA9ICQoJyNzYXZlX3Byb3BlcnRpZXNfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5leHBvcnRfbWV0YV9idG4gICAgID0gJCgnI2V4cG9ydF9tZXRhX2J0bicpO1xyXG4gICAgICAgIHRoaXMuaW1wb3J0X21ldGFfYnRuICAgICA9ICQoJyNpbXBvcnRfbWV0YV9idG4nKTtcclxuICAgICAgIC8vIHRoaXMuZGVsX2N1c3RfcHJvcF9idG4gPSAkKCcuYnRuIG9yYW5nZSBkYXJrZW4tMiBkZWwnKTtcclxuICAgICBcclxuICAgICAgICAvL2RpdnNcclxuICAgICAgICB0aGlzLmN1c3RvbV9wcm9wX2RpdiAgICAgID0gJCgnI2N1c3RvbV9wcm9wX2RpdicpO1xyXG4gICAgICAgIHRoaXMubWFpbl9wcm9wZXJ0aWVzX2JvZHkgPSAkKCcjbWFpbl9wcm9wZXJ0aWVzX2JvZHknKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dHNcclxuICAgICAgICB0aGlzLmN1c3RvbWVfcHJvcF9uYW1lICA9ICQoJyNjdXN0b21lX3Byb3BfbmFtZScpO1xyXG4gICAgICAgIHRoaXMuY3VzdG9tZV9wcm9wX3ZhbHVlID0gJCgnI2N1c3RvbWVfcHJvcF92YWx1ZScpO1xyXG4gICAgICAgIHRoaXMudGl0bGVfaW5wdXQgICAgICAgID0gJCgnI3RpdGxlX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5hdXRob3JfaW5wdXQgICAgICAgPSAkKCcjYXV0aG9yX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5zdWJqZWN0X2lucHV0ICAgICAgPSAkKCcjc3ViamVjdF9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMua2V5d29yZHNfaW5wdXQgICAgID0gJCgnI2tleXdvcmRzX2lucHV0Jyk7XHJcbiAgICAgICAgLy9PdGhlclxyXG4gICAgICAgIHRoaXMuYXJyYXlvZl9kZWxldGVidG5faWQgPSBuZXcgQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gICAgICA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWcgICAgICA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBwcm9wZXJ0aWVzICA9IHRoaXM7XHJcblxyXG4gICAgICAgIHByb3BlcnRpZXMuYWRkX2N1c3RvbV9wcm9wX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZTpFdmVudCkge1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBwcm9wZXJ0aWVzLmN1c3RvbWVfcHJvcF9uYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHByb3BlcnRpZXMuY3VzdG9tZV9wcm9wX3ZhbHVlLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLmFkZDtcclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnQWRkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlckN1c3RvbVByb3BlcnRpZXMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmRhbmdlcignVW5hYmxlIHRvIGFkZCBjdXN0b20gcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHByb3BlcnRpZXMuc2F2ZV9wcm9wZXJ0aWVzX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZTpFdmVudCkge1xyXG5cclxuICAgICAgICAgICAgcHJvcGVydGllcy5yZWluaXRJbnB1dHMoKTtcclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgVGl0bGU6IHByb3BlcnRpZXMudGl0bGVfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBBdXRob3I6IHByb3BlcnRpZXMuYXV0aG9yX2lucHV0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgU3ViamVjdDogcHJvcGVydGllcy5zdWJqZWN0X2lucHV0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgS2V5d29yZHM6IHByb3BlcnRpZXMua2V5d29yZHNfaW5wdXQudmFsKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMuc2F2ZTtcclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdTYXZpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMubWFpbl9wcm9wZXJ0aWVzX2JvZHkuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBwcm9wZXJ0aWVzLmV4cG9ydF9tZXRhX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZTpFdmVudCkge1xyXG5cclxuICAgICAgICAgICAgcHJvcGVydGllcy5yZWluaXRJbnB1dHMoKTtcclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgVGl0bGU6IHByb3BlcnRpZXMudGl0bGVfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBBdXRob3I6IHByb3BlcnRpZXMuYXV0aG9yX2lucHV0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgU3ViamVjdDogcHJvcGVydGllcy5zdWJqZWN0X2lucHV0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgS2V5d29yZHM6IHByb3BlcnRpZXMua2V5d29yZHNfaW5wdXQudmFsKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMuZXhwb3J0O1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0V4cG9ydGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdNZXRhZGF0YSBleHBvdGVkIHN1Y2Nlc3NmdWxseScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgLyogcHJvcGVydGllcy5kZWxfY3VzdF9wcm9wX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbihlOkV2ZW50KXtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSAkKHRoaXMpLmRhdGEoJ3Byb3AnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocHJvcCk7XHJcbiAgICAgICAgfSk7Ki9cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZUN1c3RvbVByb3BlcnR5KGV2ZW50OmFueSxwcnA/OlByb3BlcnRpZXMpOnZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uOkNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWc6Q29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgICAgPSBwcnA7XHJcbiAgICAgICAgbGV0IHByb3AgPSAgJCh0aGlzKS5hdHRyKFwiZGF0YS1wcm9wXCIpO1xyXG4gICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICBuYW1lOiBwcm9wXHJcblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMuZGVsZXRlO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0RlbGV0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyQ3VzdG9tUHJvcGVydGllcyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJ1VuYWJsZSB0byBsb2FkIGN1c3RvbSBwcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5kYW5nZXIoJ1VuYWJsZSB0byBsb2FkIGN1c3RvbSBwcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlckN1c3RvbVByb3BlcnRpZXMoZGF0YTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWcgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyA9IHRoaXM7XHJcblxyXG4gICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnJyk7XHJcbiAgICAgICAgbGV0IHRhYmxlID0gJCgnPHRhYmxlPjwvdGFibGU+JykuYWRkQ2xhc3MoJ3RhYmxlJyk7XHJcbiAgICAgICAgbGV0IHRoZWFkID0gJCgnPHRoZWFkPjwvdGhlYWQ+JykuYWRkQ2xhc3MoJ21kYi1jb2xvciBkYXJrZW4tMycpO1xyXG4gICAgICAgIGxldCBodHIgPSAkKCc8dHI+PC90cj4nKS5hZGRDbGFzcygndGV4dC13aGl0ZScpO1xyXG4gICAgICAgIGxldCBodGggPSAkKCc8dGg+IyM8L3RoPjx0aD5OYW1lPC90aD48dGg+VmFsdWU8L3RoPicpO1xyXG4gICAgICAgIGh0ci5hcHBlbmQoaHRoKTtcclxuICAgICAgICB0aGVhZC5hcHBlbmQoaHRyKTtcclxuICAgICAgICB0YWJsZS5hcHBlbmQodGhlYWQpO1xyXG4gICAgICAgIGxldCB0Ym9keSA9ICQoJzx0Ym9keT48L3Rib2R5PicpO1xyXG5cclxuICAgICAgICAkLmVhY2goZGF0YS5wZGYuUHJvcGVydGllcywgZnVuY3Rpb24gKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCBidG5faWQgPSAnZGVsX2N1c3RfJyArIGtleTtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5hcnJheW9mX2RlbGV0ZWJ0bl9pZC5wdXNoKGJ0bl9pZCk7XHJcbiAgICAgICAgICAgIGxldCByb3cgPSAkKCc8dHI+PHRkPicgKyBrZXkgKyAnPC90ZD48dGQ+JyArIHZhbHVlICsgJzwvdGQ+PHRkPjxidXR0b24gZGF0YS1wcm9wPScgKyBrZXkgKycgaWQ9XCInICsgYnRuX2lkICsgJ1wiPkRlbGV0ZTwvYnV0dG9uPjwvdGQ+PC90cj4nKTtcclxuICAgICAgICAgICAgdGJvZHkuYXBwZW5kKHJvdyk7XHJcbiAgICAgICAgICAgIHRhYmxlLmFwcGVuZCh0Ym9keSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5hcHBlbmQodGFibGUpO1xyXG5cclxuICAgICAgICAkLmVhY2gocHJvcGVydGllcy5hcnJheW9mX2RlbGV0ZWJ0bl9pZCwgZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAkKCcjJyArIHZhbHVlKS5jbGljayh7IHZhbHVlLHByb3BlcnRpZXMgfSwgcHJvcGVydGllcy5kZWxldGVDdXN0b21Qcm9wZXJ0eSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVhZEN1c3RvbVByb3BlcnRpZXMoZGF0YT86YW55KTp2b2lke1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBwcm9wZXJ0aWVzID0gdGhpcztcclxuXHJcbiAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBjb21tb24ucGFzc1BkZi52YWwoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHVybDIgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLnJlYWRDdXN0b21lclByb3BlcnRpZXM7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogdXJsMixcclxuICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJ0xvYWRpbmcuLi4nKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJDdXN0b21Qcm9wZXJ0aWVzKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5odG1sKCdVbmFibGUgdG8gbG9hZCBjdXN0b20gcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZGFuZ2VyKCdVbmFibGUgdG8gbG9hZCBjdXN0b20gcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoc3RyRXJyb3IpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVpbml0SW5wdXRzKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy50aXRsZV9pbnB1dCAgICA9ICQoJyN0aXRsZV9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuYXV0aG9yX2lucHV0ICAgPSAkKCcjYXV0aG9yX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5zdWJqZWN0X2lucHV0ICA9ICQoJyNzdWJqZWN0X2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5rZXl3b3Jkc19pbnB1dCA9ICQoJyNrZXl3b3Jkc19pbnB1dCcpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IENvbW1vbiB9IGZyb20gXCIuL0NvbW1vblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlZGFjdCBleHRlbmRzIEJhc2Uge1xyXG5cclxuICAgIC8vQ2xhc3Nlc1xyXG4gICAgY29uZmlnIDogQ29uZmlnO1xyXG4gICAgY29tbW9uIDogQ29tbW9uO1xyXG5cclxuICAgIC8vYnV0dG9uc1xyXG5cdHJlZGFjdF9hcHBseV9idG4gOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dHMgXHJcbiAgICByX3gxIDogYW55O1xyXG4gICAgcl95MSA6IGFueTtcclxuICAgIHJfeDIgOiBhbnk7XHJcbiAgICByX3kyIDogYW55O1xyXG4gICAgcl9wYWdlIDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5yZWRhY3RfYXBwbHlfYnRuID0gJCgnI3JlZGFjdF9hcHBseV9idG4nKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dHNcclxuICAgICAgICB0aGlzLnJfeDEgPSAkKFwiI3JfeDFcIik7XHJcbiAgICAgICAgdGhpcy5yX3kxID0gJChcIiNyX3kxXCIpO1xyXG4gICAgICAgIHRoaXMucl94MiA9ICQoXCIjcl94MlwiKTtcclxuICAgICAgICB0aGlzLnJfeTIgPSAkKFwiI3JfeTJcIik7XHJcbiAgICAgICAgdGhpcy5yX3BhZ2UgPSAkKFwiI3JfcGFnZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHJlZGFjdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJlZGFjdC5yZWRhY3RfYXBwbHlfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcbiAgICAgICAgICAgIHZhciB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgbmV3dXNlcnBhc3N3b3JkOiBjb21tb24ubmV3dXNlcnBhc3N3b3JkLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHgxOiByZWRhY3Qucl94MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5MTogcmVkYWN0LnJfeTEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDI6IHJlZGFjdC5yX3gyLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHkyOiByZWRhY3Qucl95Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBwYWdlOiByZWRhY3Qucl9wYWdlLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtc2cgPSByZWRhY3QudmFsaWRhdGUodmlld19tb2RlbCk7XHJcbiAgICAgICAgICAgIGlmIChtc2cgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGNvbmZpZy51cmxzLnJlZGFjdC5hZGQ7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnUmVkYWN0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uc2Vzc2lvbl9leHBpcmVkX21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWRhY3QucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2hvd2Vycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5kYW5nZXIoJ0V4Y2VwdGlvbiEsIG91ciBkZXZlbG9wbWVudCB0ZWFtIHdpbGwgbG9vayBpbnRvIHRoaXMgaXNzdWUuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobXNnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlIChtb2RlbDphbnkpOnN0cmluZyB7XHJcbiAgICAgXHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIGlmIChtb2RlbC54MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLnkxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueDIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwueTIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwucGFnZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJQYWdlIG51bWJlciBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTnVtYmVyKG1vZGVsLnBhZ2UpIDw9IDApIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIkVudGVyIGEgcG9zaXRpdmUgbnVtYmVyIGZvciBwYWdlLjxicj5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YW1wIGV4dGVuZHMgQmFzZSB7XHJcblxyXG4gICAgLy9idXR0b25zXHJcblx0YWRkX3N0YW1wX2J0biA9ICQoJyNhZGRfc3RhbXBfYnRuJyk7XHJcblxyXG4gICAgLy9pbnB1dHNcclxuICAgIHNfeDEgOiBhbnk7XHJcbiAgICBzX3kxIDogYW55O1xyXG4gICAgc194MiA6IGFueTtcclxuICAgIHNfeTIgOiBhbnk7XHJcbiAgICBzX3BhZ2UgOiBhbnk7XHJcbiAgICBzdGFtcF9ub3RlIDogYW55O1xyXG4gICAgc3RhbXBfdHlwZSA6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLmFkZF9zdGFtcF9idG4gPSAkKCcjYWRkX3N0YW1wX2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMuc194MSA9ICQoXCIjc194MVwiKTtcclxuICAgICAgICB0aGlzLnNfeTEgPSAkKFwiI3NfeTFcIik7XHJcbiAgICAgICAgdGhpcy5zX3gyID0gJChcIiNzX3gyXCIpO1xyXG4gICAgICAgIHRoaXMuc195MiA9ICQoXCIjc195MlwiKTtcclxuICAgICAgICB0aGlzLnNfcGFnZSA9ICQoXCIjc19wYWdlXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhbXBfbm90ZSA9ICQoXCIjc3RhbXBfbm90ZVwiKTtcclxuICAgICAgICB0aGlzLnN0YW1wX3R5cGUgPSAkKFwiI3N0YW1wX3R5cGVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBzdGFtcCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHN0YW1wLmFkZF9zdGFtcF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBuZXd1c2VycGFzc3dvcmQ6IGNvbW1vbi5uZXd1c2VycGFzc3dvcmQudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDE6IHN0YW1wLnNfeDEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTE6IHN0YW1wLnNfeTEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDI6IHN0YW1wLnNfeDIudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTI6IHN0YW1wLnNfeTIudmFsKClcclxuICAgICAgICAgICAgICAgICwgcGFnZXM6IHN0YW1wLnNfcGFnZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHR5cGU6ICQoXCIjc3RhbXBfdHlwZVwiKS5maW5kKFwiOnNlbGVjdGVkXCIpLnRleHQoKVxyXG4gICAgICAgICAgICAgICAgLCB0eXBlVmFsdWU6ICQoXCIjc3RhbXBfdHlwZVwiKS5maW5kKFwiOnNlbGVjdGVkXCIpLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIG5vdGU6IHN0YW1wLnN0YW1wX25vdGUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IG1zZyA9IHN0YW1wLnZhbGlkYXRlKHZpZXdfbW9kZWwpO1xyXG4gICAgICAgICAgICBpZiAobXNnID09IFwiXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gY29uZmlnLnVybHMuc3RhbXAuYWRkO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0FkZGluZyBzdGFtcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW1wLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YS5zaG93ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGUobW9kZWw6YW55KTpzdHJpbmcge1xyXG4gICAgICAgXHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIGlmIChtb2RlbC54MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLnkxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueDIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwueTIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwucGFnZXMgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiTnVtYmVyIG9mIHBhZ2VzIHRvIGFwcGx5IHRoZSBzdGFtcCBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwudHlwZVZhbHVlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlN0YW1wIHR5cGUgaXMgcmVxdWlyZWQuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcblxyXG5cclxufSIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBDb21tb24gfSBmcm9tIFwiLi9Db21tb25cIjtcclxuaW1wb3J0IHtCYXNlfSBmcm9tIFwiLi9CYXNlXCI7XHJcbmltcG9ydCB7IERpZ2l0YWxTaWduYXR1cmUgfSBmcm9tIFwiLi9EaWdpdGFsU2lnbmF0dXJlXCI7XHJcbmltcG9ydCB7IFJlZGFjdCB9IGZyb20gXCIuL1JlZGFjdFwiO1xyXG5pbXBvcnQgeyBTdGFtcCB9IGZyb20gXCIuL1N0YW1wXCI7XHJcbmltcG9ydCB7IEJhcmNvZGUgfSBmcm9tIFwiLi9CYXJjb2RlXCI7XHJcbmltcG9ydCB7IFByb3BlcnRpZXMgfSBmcm9tIFwiLi9Qcm9wZXJ0aWVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ya0JlbmNoIGV4dGVuZHMgQmFzZXtcclxuXHJcbiAgICAvL2NsYXNzZXNcclxuICAgIHByb3BlcnRpZXM6IFByb3BlcnRpZXM7XHJcbiAgICBiYXJjb2RlIDogQmFyY29kZTtcclxuICAgIHN0YW1wIDogU3RhbXA7XHJcbiAgICByZWRhY3QgOiBSZWRhY3Q7XHJcbiAgICBkaWdpdGFsU2lnbmF0dXJlOiBEaWdpdGFsU2lnbmF0dXJlO1xyXG4gICAgY29uZmlnOiBDb25maWc7XHJcbiAgICBjb21tb246IENvbW1vbjtcclxuXHJcbiAgICAvL2J1dHRvbnNcclxuICAgIHJlc2V0X2J0biA6IGFueTtcclxuICAgIGRlbGV0ZV9idG46IGFueTtcclxuICAgIGVtYWlsX2J0bjogYW55O1xyXG4gICAgc2VuZF9lbWFpbF9idG46IGFueTtcclxuICAgIHJlc3RvcmVfYnRuOiBhbnk7XHJcbiAgICBzYW5pdGl6ZV9idG46IGFueTtcclxuICAgIHByb3BlcnR5X2J0bjogYW55O1xyXG5cclxuICAgIC8vaW5wdXRzXHJcbiAgICB5b3VyX2VtYWlsOiBhbnk7XHJcbiAgICB5b3VyX3N1YmplY3Q6IGFueTtcclxuICAgIHlvdXJfbWVzc2FnZTogYW55O1xyXG5cclxuICAgIC8vbW9kYWxzXHJcbiAgICBkaWdpdGFsX3NpZ25hdHVyZV9tb2RhbDogYW55O1xyXG4gICAgc3RhbXBfbW9kYWw6IGFueTtcclxuICAgIGJhcmNvZGVfbW9kYWw6IGFueTtcclxuICAgIHJlZGFjdF9tb2RhbDogYW55O1xyXG4gICAgcHJvcGVydHlfbW9kYWw6IGFueTtcclxuICAgIGVtYWlsX21vZGFsOiBhbnk7XHJcblxyXG4gICAgLy9vdGhlci9ESVZcclxuICAgIHByb3BlcnR5X21vZGFsX2JvZHk6IGFueTtcclxuICAgIGF0dGFjaGVkX2ZpbGVOYW1lOiBhbnk7XHJcbiAgICAvL2FycmF5b2ZfZGVsZXRlYnRuX2lkIDogc3RyaW5nW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vYnV0dG9uc1xyXG4gICAgICAgIHRoaXMucmVzZXRfYnRuID0gJCgnI3Jlc2V0X2J0bicpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlX2J0biA9ICQoJyNkZWxldGVfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5lbWFpbF9idG4gPSAkKCcjZW1haWxfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5zZW5kX2VtYWlsX2J0biA9ICQoJyNzZW5kX2VtYWlsX2J0bicpO1xyXG4gICAgICAgIHRoaXMucmVzdG9yZV9idG4gPSAkKCcjcmVzdG9yZV9idG4nKTtcclxuICAgICAgICB0aGlzLnNhbml0aXplX2J0biA9ICQoJyNzYW5pdGl6ZV9idG4nKTtcclxuICAgICAgICB0aGlzLnByb3BlcnR5X2J0biA9ICQoJyNwcm9wZXJ0eV9idG4nKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dHNcclxuICAgICAgICB0aGlzLnlvdXJfZW1haWwgPSAkKCcjeW91cl9lbWFpbCcpO1xyXG4gICAgICAgIHRoaXMueW91cl9zdWJqZWN0ID0gJCgnI3lvdXJfc3ViamVjdCcpO1xyXG4gICAgICAgIHRoaXMueW91cl9tZXNzYWdlID0gJCgnI3lvdXJfbWVzc2FnZScpO1xyXG5cclxuICAgICAgICAvL21vZGFsc1xyXG4gICAgICAgIHRoaXMuZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwgPSAkKCcjZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnN0YW1wX21vZGFsID0gJCgnI3N0YW1wX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5iYXJjb2RlX21vZGFsID0gJCgnI2JhcmNvZGVfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnJlZGFjdF9tb2RhbCA9ICQoJyNyZWRhY3RfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnByb3BlcnR5X21vZGFsID0gJCgnI3Byb3BlcnR5X21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5lbWFpbF9tb2RhbCA9ICQoJyNlbWFpbF9tb2RhbCcpO1xyXG5cclxuICAgICAgICAvL290aGVyL0RJVlxyXG4gICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWxfYm9keSA9ICQoJyNwcm9wZXJ0eV9tb2RhbF9ib2R5Jyk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hlZF9maWxlTmFtZSA9ICQoJyNhdHRhY2hlZF9maWxlTmFtZScpO1xyXG4gICAgICAgLy8gdGhpcy5hcnJheW9mX2RlbGV0ZWJ0bl9pZCA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCB3b3JrYmVuY2ggPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmRpZ2l0YWxfc2lnbmF0dXJlX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLmRpZ2l0YWxTaWduYXR1cmUgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICB3b3JrYmVuY2guZGlnaXRhbFNpZ25hdHVyZSA9IG5ldyBEaWdpdGFsU2lnbmF0dXJlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJlZGFjdF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdvcmtiZW5jaC5yZWRhY3QgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICB3b3JrYmVuY2gucmVkYWN0ID0gbmV3IFJlZGFjdCgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFtcF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdvcmtiZW5jaC5zdGFtcCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5zdGFtcCA9IG5ldyBTdGFtcCgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5iYXJjb2RlX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLmJhcmNvZGUgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICB3b3JrYmVuY2guYmFyY29kZSA9IG5ldyBCYXJjb2RlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BlcnR5X21vZGFsLm9uKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLnByb3BlcnRpZXMgPT0gJ3VuZGVmaW5lZCcgKVxyXG4gICAgICAgICAgICAgICAgd29ya2JlbmNoLnByb3BlcnRpZXMgPSBuZXcgUHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICggd29ya2JlbmNoLnByb3BlcnRpZXMgPT0gbnVsbCApXHJcbiAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydGllcyA9IG5ldyBQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BlcnR5X21vZGFsLm9uKCdoaWRlLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgd29ya2JlbmNoLnByb3BlcnRpZXMgPSBudWxsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRlbGV0ZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMudmlld2VyLmRlbGV0ZTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0RlbGV0aW5nIHRoZSBmaWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2F0aW9uLmhyZWYgPSBjb25maWcudXJscy5yb290LnBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVzdG9yZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy52aWV3ZXIucmVzdG9yZTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ1Jlc3RvcmluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5lbWFpbF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3b3JrYmVuY2guYXR0YWNoZWRfZmlsZU5hbWUuaHRtbChjb21tb24uZmlsZU5hbWUudmFsKCkpO1xyXG4gICAgICAgICAgICB3b3JrYmVuY2guZW1haWxfbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2VuZF9lbWFpbF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgbWFpbHRvOiB3b3JrYmVuY2gueW91cl9lbWFpbC52YWwoKSxcclxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IHdvcmtiZW5jaC55b3VyX3N1YmplY3QudmFsKCksXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB3b3JrYmVuY2gueW91cl9tZXNzYWdlLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMudmlld2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5lbWFpbF9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnRW1haWxpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5pbmZvKCdFbWFpbCBoYXMgYmVlbiBzZW50LicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLmVtYWlsX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdVbmFibGUgdG8gc2VuZCB0aGUgZW1haWwuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2FuaXRpemVfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDogRXZlbnQpIHtcclxuICAgICAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl90ZXh0Lmh0bWwoJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBTYW5pdGl6ZSB0aGUgUERGPycpO1xyXG4gICAgICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnByb3BlcnR5X2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6IEV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogY29tbW9uLnBhc3NQZGYudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLmluZGV4O1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnTG9hZGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLnByb3BlcnR5X21vZGFsX2JvZHkuaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVybDIgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLnJlYWRDdXN0b21lclByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJ0xvYWRpbmcuLi4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKmlmICh0eXBlb2Ygd29ya2JlbmNoLnByb3BlcnRpZXMgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydGllcyA9IG5ldyBQcm9wZXJ0aWVzKCk7XHJcbiovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcm9wZXJ0aWVzLnJlYWRDdXN0b21Qcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5odG1sKCdVbmFibGUgdG8gbG9hZCBjdXN0b20gcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZGFuZ2VyKCdVbmFibGUgdG8gbG9hZCBjdXN0b20gcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoc3RyRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydHlfbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRoaXMubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKHN0ckVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbW1vbi5jb25maXJtYXRpb25fbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpbmcoIHByb3A6c3RyaW5nICk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHdvcmtiZW5jaCA9IHRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3BpbmcgY2xpY2tlZCcpO1xyXG4gICAgICAgIHdvcmtiZW5jaC5wcm9wZXJ0aWVzLmRlbGV0ZUN1c3RvbVByb3BlcnR5KHByb3AsbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIFwiV29ya0JlbmNoIGNsYXNzIGNvbnN0cnVjdGVkLlwiXHJcbiAgICB9XHJcbn0iXX0=
