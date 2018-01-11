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
    elt2.html("Hello Shirak Avakian");
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
window.onload = function () {
    ContactLogger.logContactData();
};
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
        _this.del_cust_prop_btn = $('.btn orange darken-2 del');
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
                success: function (html) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    properties.custom_prop_div.html(html);
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
        properties.del_cust_prop_btn.on('click', function (e) {
            var prop = $(this).data('prop');
            console.log(prop);
        });
    };
    Properties.prototype.deleteCustomProperty = function (event) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var properties = new Properties();
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
            $('#' + value).click({ value: value }, properties.deleteCustomProperty);
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
        this.property_modal.on('shown.bs.modal', function () {
            /* if (typeof workbench.properties == 'undefined')
                 workbench.properties = new Properties();
             */
            /*$.each(workbench.arrayof_deletebtn_id, function (index,value) {
                $('#' + value).click({value}, workbench.properties.deleteCustomProperty);
            })*/
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
                                    if (typeof workbench.properties == 'undefined')
                                        workbench.properties = new Properties_1.Properties();
                                    workbench.properties.readCustomProperties();
                                    /* $('#here_table').html('');
                                     let table = $('<table></table>').addClass('table');
                                     let thead = $('<thead></thead>').addClass('mdb-color darken-3');
                                     let htr = $('<tr></tr>').addClass('text-white');
                                     let hth = $('<th>##</th><th>Name</th><th>Value</th>');
                                     htr.append(hth);
                                     thead.append(htr);
                                     table.append(thead);
                                     let tbody = $('<tbody></tbody>');
 
                                     $.each(data.pdf.Properties, function (key: string, value: string) {
                                         let btn_id = 'del_cust_' + key;
                                         workbench.arrayof_deletebtn_id.push( btn_id );
                                         let row = $('<tr><td>' + key + '</td><td>' + value + '</td><td><button id="' + btn_id + '">Delete</button></td></tr>');
                                         tbody.append(row);
                                         let catEl = document.getElementById('"' + btn_id + '"');
                                         table.append(tbody);
 
                                     });
                                     
                                     
                                     $('#here_table').append(table);
                                     */
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
                    /*
                         for (i = 0; i < 3; i++) {
                             var row = $('<tr></tr>').addClass('bar').text('result ' + i);
                             table.append(row);
                         }*/
                    workbench.property_modal.modal('show');
                    /* if (typeof workbench.properties == 'undefined')
                         workbench.properties = new Properties();*/
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
        workbench.properties.deleteCustomProperty(prop);
        return "WorkBench class constructed.";
    };
    return WorkBench;
}(Base_1.Base));
exports.WorkBench = WorkBench;
},{"./Barcode":2,"./Base":3,"./DigitalSignature":6,"./Properties":8,"./Redact":9,"./Stamp":10}]},{},[1,11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy90cy9BcHBsaWNhdGlvbi50cyIsImluY2x1ZGVzL3RzL0JhcmNvZGUudHMiLCJpbmNsdWRlcy90cy9CYXNlLnRzIiwiaW5jbHVkZXMvdHMvQ29tbW9uLnRzIiwiaW5jbHVkZXMvdHMvQ29uZmlnLnRzIiwiaW5jbHVkZXMvdHMvRGlnaXRhbFNpZ25hdHVyZS50cyIsImluY2x1ZGVzL3RzL01haW4udHMiLCJpbmNsdWRlcy90cy9Qcm9wZXJ0aWVzLnRzIiwiaW5jbHVkZXMvdHMvUmVkYWN0LnRzIiwiaW5jbHVkZXMvdHMvU3RhbXAudHMiLCJpbmNsdWRlcy90cy9Xb3JrQmVuY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGtDQUFrQztBQUNsQyxtQ0FBa0M7QUFDbEMsK0JBQWdDO0FBQ2hDLHlDQUF3QztBQUN4QywwQ0FBMEM7QUFHMUMsSUFBSSxpQkFBc0IsQ0FBQztBQUczQixlQUFlLElBQVc7SUFDdEIsSUFBSSxXQUFjLENBQUM7SUFDbkIsaUNBQWlDO0lBQ2pDLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QixJQUFJLEdBQUcsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0lBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7SUFDdEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRXRFLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsS0FBSyxrQkFBa0IsRUFBQyxDQUFDO1lBQ3JCLFdBQVcsR0FBRyxFQUFDLFdBQVcsRUFBSSxjQUFjLEVBQUUsRUFBQyxDQUFDO1lBQ2hELEtBQUssQ0FBQztRQUNWLENBQUM7UUFHRDtZQUNJLEtBQUssQ0FBQztJQUNkLENBQUM7SUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFdEMsQ0FBQztBQUVEO0lBQ0ksSUFBSSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7SUFDaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBRUQ7SUFBQTtJQWtCQSxDQUFDO0lBakJVLDRCQUFjLEdBQXJCO1FBQ0ksSUFBSSxZQUFZLEdBQUc7WUFDZjtnQkFDSSxXQUFXLEVBQUUsTUFBTTtnQkFDbkIsS0FBSyxFQUFFLGFBQWE7YUFDdkIsRUFBRTtnQkFDQyxXQUFXLEVBQUUsT0FBTztnQkFDcEIsS0FBSyxFQUFFLGNBQWM7YUFDeEIsRUFBRTtnQkFDQyxXQUFXLEVBQUUsT0FBTztnQkFDcEIsS0FBSyxFQUFFLGNBQWM7YUFDeEI7U0FDSixDQUFDO1FBQ0YsR0FBRyxDQUFDLENBQWdCLFVBQVksRUFBWiw2QkFBWSxFQUFaLDBCQUFZLEVBQVosSUFBWTtZQUEzQixJQUFJLE9BQU8scUJBQUE7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxXQUFXLEdBQUcsWUFBWSxHQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0RjtJQUNMLENBQUM7SUFDTCxvQkFBQztBQUFELENBbEJBLEFBa0JDLElBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHO0lBQ1osYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25DLENBQUMsQ0FBQTtBQUVELENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUU7SUFFZixLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyx3Q0FBd0M7QUFFM0MsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbEVILCtCQUE4QjtBQUU5QjtJQUE2QiwyQkFBSTtJQVM3QjtRQUFBLFlBQ0ksaUJBQU8sU0FVVjtRQVJHLFNBQVM7UUFDVCxLQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRTdDLFFBQVE7UUFDUixLQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQixLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUV2QyxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7SUFDN0IsQ0FBQztJQUVTLG1DQUFpQixHQUEzQixVQUE0QixLQUFhO1FBRXJDLElBQUksTUFBTSxHQUFHLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQy9CLElBQUksTUFBTSxHQUFHLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQy9CLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztRQUVuQixPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFPO1lBRWpELElBQUksVUFBVSxHQUFHO2dCQUNiLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDekIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO2dCQUMvQixZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUU7YUFDN0MsQ0FBQztZQUVGLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdkMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRVosSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO2dCQUVsQyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUNILElBQUksRUFBRSxNQUFNO29CQUNaLEdBQUcsRUFBRSxHQUFHO29CQUNSLElBQUksRUFBRSxVQUFVO29CQUNoQixVQUFVLEVBQUUsVUFBVSxHQUFhO3dCQUMvQixNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3dCQUMzQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDcEYsQ0FBQztvQkFDRCxPQUFPLEVBQUUsVUFBVSxJQUFJO3dCQUNuQixVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFFdEUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFFdEIsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ2xCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7d0JBQzVGLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQ0FDZCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOzRCQUNqQyxJQUFJO2dDQUNBLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7NEJBRWpDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0NBQy9CLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDOzRCQUNwQyxDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNKLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7b0NBQ2YsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQ2xELElBQUk7b0NBQ0EsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDNUMsQ0FBQzt3QkFDTCxDQUFDO29CQUNMLENBQUM7b0JBQ0QsS0FBSyxFQUFFLFVBQVUsVUFBVSxFQUFFLFFBQVE7d0JBQ2pDLFVBQVUsQ0FBQyxjQUFjLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUV0RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN0QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUM1QyxDQUFDO29CQUNELEtBQUssRUFBRSxJQUFJO2lCQUNkLENBQUMsQ0FBQztZQUVQLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHTywwQkFBUSxHQUFoQixVQUFpQixLQUFTO1FBRXRCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0IsT0FBTyxJQUFJLGdDQUFnQyxDQUFDO1FBRWhELENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsT0FBTyxJQUFJLHVEQUF1RCxDQUFDO1FBQ3ZFLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0F2R0EsQUF1R0MsQ0F2RzRCLFdBQUksR0F1R2hDO0FBdkdZLDBCQUFPOzs7O0FDRnBCLG1DQUFrQztBQUNsQyxtQ0FBa0M7QUFHbEM7SUFLSTtRQUNJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTSxzQkFBTyxHQUFkLFVBQWUsUUFBZ0IsRUFBRSxNQUFlO1FBQzVDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxHQUFHLFFBQVEsR0FBRyxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBQzFGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0sd0JBQVMsR0FBaEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0sd0JBQVMsR0FBaEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0saUNBQWtCLEdBQXpCLFVBQTBCLElBQVcsRUFBRSxHQUFVO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3JDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQzNELE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDM0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQXJDQSxBQXFDQyxJQUFBO0FBckNxQixvQkFBSTs7OztBQ0oxQjtJQXNCSTtRQUNJLE1BQU07UUFDTixJQUFJLENBQUMsaUJBQWlCLEdBQUksQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFlBQVksR0FBUyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLGlCQUFpQixHQUFJLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRWxELE9BQU87UUFDUCxJQUFJLENBQUMsa0JBQWtCLEdBQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGFBQWEsR0FBWSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsZ0JBQWdCLEdBQVMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLHFCQUFxQixHQUFJLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBRTFELE9BQU87UUFDUCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxHQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRTdDLE9BQU87UUFDUCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0wsYUFBQztBQUFELENBMUNBLEFBMENDLElBQUE7QUExQ1ksd0JBQU07Ozs7QUNBbkI7SUFRSTtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUN6QyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUUvRixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFFLElBQUksQ0FBRSxDQUFDO0lBRW5DLENBQUM7SUFFTCxhQUFDO0FBQUQsQ0FuQkEsQUFtQkMsSUFBQTtBQW5CWSx3QkFBTTtBQXFCbkI7SUFZSSxnQkFBWSxFQUFTO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUwsYUFBQztBQUFELENBeEJBLEFBd0JDLElBQUE7QUFFRCwyQkFBMkI7QUFDM0I7SUFNSSxjQUFZLEtBQVk7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsbUJBQW1CLENBQUM7UUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLEdBQUcseUJBQXlCLENBQUM7UUFDckQsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLEdBQUcsMEJBQTBCLENBQUM7UUFDdkQsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLEdBQUcsa0JBQWtCLENBQUM7SUFDM0MsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQVpBLEFBWUMsSUFBQTtBQUVEO0lBRUksMEJBQVksS0FBYTtRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssR0FBRyxrQ0FBa0MsQ0FBQztJQUMvRCxDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUxBLEFBS0MsSUFBQTtBQUVEO0lBRUksZUFBWSxLQUFhO1FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLGtCQUFrQixDQUFDO0lBQzFDLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFFRDtJQUdJLGtCQUFZLEtBQWE7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsdUJBQXVCLENBQUM7SUFDakQsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQU5BLEFBTUMsSUFBQTtBQUVEO0lBR0ksZ0JBQVksS0FBYTtRQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxtQkFBbUIsQ0FBQztJQUMzQyxDQUFDO0lBQ0wsYUFBQztBQUFELENBTkEsQUFNQyxJQUFBO0FBRUQ7SUFFSSxpQkFBWSxLQUFhO1FBQ3pCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLG9CQUFvQixDQUFDO0lBQ3hDLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFFRDtJQVNJLG9CQUFZLEtBQWE7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBSSxLQUFLLEdBQUcseUJBQXlCLENBQUM7UUFDaEQsSUFBSSxDQUFDLEdBQUcsR0FBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUM7UUFDOUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsMEJBQTBCLENBQUM7UUFDakQsSUFBSSxDQUFDLElBQUksR0FBSyxLQUFLLEdBQUcsd0JBQXdCLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsMEJBQTBCLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsMEJBQTBCLENBQUM7UUFDakQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssR0FBRywwQ0FBMEMsQ0FBQztJQUNyRixDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQWxCQSxBQWtCQyxJQUFBO0FBRUQ7SUFPSSxnQkFBWSxLQUFhO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO1FBQ2xELElBQUksQ0FBQyxNQUFNLEdBQU8sS0FBSyxHQUFHLHNCQUFzQixDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLEdBQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO1FBQ2xELElBQUksQ0FBQyxJQUFJLEdBQVMsS0FBSyxHQUFHLG9CQUFvQixDQUFDO1FBQy9DLElBQUksQ0FBQyxLQUFLLEdBQVEsS0FBSyxHQUFHLHFCQUFxQixDQUFDO0lBQ3BELENBQUM7SUFFTCxhQUFDO0FBQUQsQ0FmQSxBQWVDLElBQUE7QUFFRDtJQUdJLGNBQVksS0FBYTtRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBQ0wsV0FBQztBQUFELENBTkQsQUFNRSxJQUFBOzs7Ozs7Ozs7Ozs7OztBQzlJRiwrQkFBOEI7QUFFOUI7SUFBc0Msb0NBQUk7SUFhdEM7UUFBQSxZQUNJLGlCQUFPLFNBYVY7UUFYRyxTQUFTO1FBQ1QsS0FBSSxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBRTdELEtBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLEtBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLEtBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLEtBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLEtBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLEtBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWpDLEtBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztJQUM3QixDQUFDO0lBRVMsNENBQWlCLEdBQTNCLFVBQTRCLEtBQWE7UUFFckMsSUFBSSxNQUFNLEdBQUcsaUJBQU0sU0FBUyxXQUFFLENBQUM7UUFDL0IsSUFBSSxNQUFNLEdBQUcsaUJBQU0sU0FBUyxXQUFFLENBQUM7UUFDL0IsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFFNUIsZ0JBQWdCLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQU87WUFFbEUsSUFBSSxVQUFVLEdBQUc7Z0JBQ2IsZUFBZSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFO2dCQUMzQyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsRUFBRSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQy9CLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUMvQixFQUFFLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ2pDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUMzQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7YUFDcEMsQ0FBQztZQUVGLElBQUksR0FBRyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBRSxVQUFVLENBQUUsQ0FBQztZQUNsRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztnQkFFaEQsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDSCxJQUFJLEVBQUUsTUFBTTtvQkFDWixHQUFHLEVBQUUsR0FBRztvQkFDUixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsVUFBVSxFQUFFLFVBQVUsR0FBYTt3QkFDL0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQzt3QkFDbkQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7b0JBQ3BGLENBQUM7b0JBQ0QsT0FBTyxFQUFFLFVBQVUsSUFBSTt3QkFDbkIsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBRXRFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRXRCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUNsQixNQUFNLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUM1RixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0NBQ2QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzs0QkFDakMsSUFBSTtnQ0FDQSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOzRCQUVqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dDQUMvQixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLDZJQUE2SSxDQUFDLENBQUM7NEJBQy9KLENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ0osTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQ0FDdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQ0FDZixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDbEQsSUFBSTtvQ0FDQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM1QyxDQUFDO3dCQUNMLENBQUM7b0JBQ0wsQ0FBQztvQkFDRCxLQUFLLEVBQUUsVUFBVSxVQUFVLEVBQUUsUUFBUTt3QkFDakMsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3RFLE1BQU0sQ0FBQyxNQUFNLENBQUMsNkRBQTZELENBQUMsQ0FBQztvQkFDakYsQ0FBQztvQkFDRCxLQUFLLEVBQUUsSUFBSTtpQkFDZCxDQUFDLENBQUM7WUFDUCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBRUwsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sbUNBQVEsR0FBaEIsVUFBa0IsS0FBUztRQUV2QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSwrQkFBK0IsQ0FBQztRQUUvQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSwrQkFBK0IsQ0FBQztRQUUvQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSwrQkFBK0IsQ0FBQztRQUUvQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSwrQkFBK0IsQ0FBQztRQUUvQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sSUFBSSxzQ0FBc0MsQ0FBQztRQUV0RCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sSUFBSSw4QkFBOEIsQ0FBQztRQUM5QyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sSUFBSSx1Q0FBdUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQXJJQSxBQXFJQyxDQXJJcUMsV0FBSSxHQXFJekM7QUFySVksNENBQWdCOzs7Ozs7Ozs7Ozs7OztBQ0Q3QiwrQkFBOEI7QUFDOUI7SUFBMEIsd0JBQUk7SUFvQjFCO1FBQUEsWUFDSSxpQkFBTyxTQW9CVjtRQWxCRyxLQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNqQyxLQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXpDLFFBQVE7UUFDUixLQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNDLEtBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3JDLEtBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZDLEtBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZDLEtBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUVuRCxPQUFPO1FBR1AsZ0JBQWdCO1FBQ2hCLEtBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN2RCxLQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVyQyxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7SUFDN0IsQ0FBQztJQUVTLGdDQUFpQixHQUEzQixVQUE2QixLQUFZO1FBQ3JDLElBQUksTUFBTSxHQUFHLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQy9CLElBQUksTUFBTSxHQUFHLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUVoQixNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtZQUN2QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7WUFDN0MsOEJBQThCO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBVztZQUM5QyxJQUFJLFVBQVUsR0FBRztnQkFDYixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7Z0JBQy9CLFFBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTthQUNqQyxDQUFDO1lBRUYsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ0gsSUFBSSxFQUFFLE1BQU07Z0JBQ1osR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxVQUFVLEdBQUc7b0JBQ3JCLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUN2QyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDcEYsQ0FBQztnQkFDRCxPQUFPLEVBQUUsVUFBVSxJQUFJO29CQUVuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO3dCQUNkLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ2pDLElBQUk7d0JBQ0EsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFFakMsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3RFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQzt3QkFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxDQUFDO3dCQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7NEJBQ2YsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2xELElBQUk7NEJBQ0EsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDNUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEtBQUssRUFBRSxVQUFVLFVBQVUsRUFBRSxRQUFRO29CQUNqQyxVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztnQkFDRCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRU0sbUJBQUksR0FBWDtRQUNJLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQTtJQUNwQyxDQUFDO0lBRUwsV0FBQztBQUFELENBMUdBLEFBMEdDLENBMUd5QixXQUFJLEdBMEc3QjtBQTFHWSxvQkFBSTs7Ozs7Ozs7Ozs7Ozs7QUNDakIsK0JBQThCO0FBRTlCO0lBQWdDLDhCQUFJO0lBd0JoQztRQUFBLFlBQ0ksaUJBQU8sU0F3QlY7UUF0QkcsU0FBUztRQUNULEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNyRCxLQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDckQsS0FBSSxDQUFDLGVBQWUsR0FBTyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNqRCxLQUFJLENBQUMsZUFBZSxHQUFPLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2pELEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUV2RCxNQUFNO1FBQ04sS0FBSSxDQUFDLGVBQWUsR0FBUSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNsRCxLQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFFdkQsUUFBUTtRQUNSLEtBQUksQ0FBQyxpQkFBaUIsR0FBSSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNsRCxLQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDbkQsS0FBSSxDQUFDLFdBQVcsR0FBVSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUMsS0FBSSxDQUFDLFlBQVksR0FBUyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDN0MsS0FBSSxDQUFDLGFBQWEsR0FBUSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM5QyxLQUFJLENBQUMsY0FBYyxHQUFPLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQy9DLE9BQU87UUFDUCxLQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUV4QyxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7SUFDN0IsQ0FBQztJQUVTLHNDQUFpQixHQUEzQixVQUE0QixLQUFhO1FBRXJDLElBQUksTUFBTSxHQUFRLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQ3BDLElBQUksTUFBTSxHQUFRLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQ3BDLElBQUksVUFBVSxHQUFJLElBQUksQ0FBQztRQUV2QixVQUFVLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQU87WUFDeEQsSUFBSSxVQUFVLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO2dCQUMvQixJQUFJLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtnQkFDeEMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUU7YUFDN0MsQ0FBQztZQUNGLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUVyQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNILElBQUksRUFBRSxNQUFNO2dCQUNaLEdBQUcsRUFBRSxHQUFHO2dCQUNSLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsVUFBVSxHQUFjO29CQUNoQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbkMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ3BGLENBQUM7Z0JBQ0QsT0FBTyxFQUFFLFVBQVUsSUFBSTtvQkFDbkIsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3RFLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxDQUFDO2dCQUNELEtBQUssRUFBRSxVQUFVLFVBQVUsRUFBRSxRQUFRO29CQUNqQyxVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFFdEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztnQkFDRCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFPO1lBRXhELFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUMxQixJQUFJLFVBQVUsR0FBRztnQkFDYixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7Z0JBQy9CLEtBQUssRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRTtnQkFDbkMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFO2dCQUNyQyxPQUFPLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3ZDLFFBQVEsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRTthQUM1QyxDQUFDO1lBQ0YsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBRXRDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ0gsSUFBSSxFQUFFLE1BQU07Z0JBQ1osR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxVQUFVLEdBQWE7b0JBQy9CLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNuQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDcEYsQ0FBQztnQkFDRCxPQUFPLEVBQUUsVUFBVSxJQUFJO29CQUNuQixVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdEUsVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0MsQ0FBQztnQkFDRCxLQUFLLEVBQUUsVUFBVSxVQUFVLEVBQUUsUUFBUTtvQkFDakMsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3RFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzlDLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLElBQUk7YUFDZCxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUdILFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQU87WUFFcEQsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzFCLElBQUksVUFBVSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsS0FBSyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFO2dCQUNuQyxNQUFNLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JDLE9BQU8sRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRTtnQkFDdkMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO2FBQzVDLENBQUM7WUFDRixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFFeEMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDSCxJQUFJLEVBQUUsTUFBTTtnQkFDWixHQUFHLEVBQUUsR0FBRztnQkFDUixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLFVBQVUsR0FBYTtvQkFDL0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNwRixDQUFDO2dCQUNELE9BQU8sRUFBRSxVQUFVLElBQUk7b0JBRW5CLFVBQVUsQ0FBQyxjQUFjLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUV0RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDZixNQUFNLENBQUMsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7b0JBQ3BELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDdEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDeEMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEtBQUssRUFBRSxVQUFVLFVBQVUsRUFBRSxRQUFRO29CQUNqQyxVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztnQkFDRCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFPO1lBQ3JELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFTSx5Q0FBb0IsR0FBM0IsVUFBNEIsS0FBUztRQUVqQyxJQUFJLE1BQU0sR0FBVSxpQkFBTSxTQUFTLFdBQUUsQ0FBQztRQUN0QyxJQUFJLE1BQU0sR0FBVSxpQkFBTSxTQUFTLFdBQUUsQ0FBQztRQUN0QyxJQUFJLFVBQVUsR0FBTSxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLElBQUksSUFBSSxHQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEMsSUFBSSxVQUFVLEdBQUc7WUFDYixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDL0IsSUFBSSxFQUFFLElBQUk7U0FFYixDQUFDO1FBQ0YsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBRXhDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLEdBQUcsRUFBRSxHQUFHO1lBQ1IsSUFBSSxFQUFFLFVBQVU7WUFDaEIsVUFBVSxFQUFFLFVBQVUsR0FBYTtnQkFDL0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BGLENBQUM7WUFDRCxPQUFPLEVBQUUsVUFBVSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV0QixFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDbEIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDMUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUMvQixDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUMxQixVQUFVLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVDLENBQUM7b0JBQUEsSUFBSSxDQUFBLENBQUM7d0JBQ0YsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3RFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQzt3QkFDMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO29CQUN0RCxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBQ0QsS0FBSyxFQUFFLFVBQVUsVUFBVSxFQUFFLFFBQVE7Z0JBQ2pDLFVBQVUsQ0FBQyxjQUFjLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLENBQUM7WUFDRCxLQUFLLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSwyQ0FBc0IsR0FBN0IsVUFBOEIsSUFBUztRQUVuQyxJQUFJLE1BQU0sR0FBRyxpQkFBTSxTQUFTLFdBQUUsQ0FBQztRQUMvQixJQUFJLE1BQU0sR0FBRyxpQkFBTSxTQUFTLFdBQUUsQ0FBQztRQUMvQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFdEIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDaEUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVqQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBVyxFQUFFLEtBQWE7WUFDNUQsSUFBSSxNQUFNLEdBQUcsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUMvQixVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLFdBQVcsR0FBRyxLQUFLLEdBQUcsNkJBQTZCLEdBQUcsR0FBRyxHQUFFLE9BQU8sR0FBRyxNQUFNLEdBQUcsNkJBQTZCLENBQUMsQ0FBQztZQUM1SSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEIsQ0FBQyxDQUFDLENBQUM7UUFHSCxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9CLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLFVBQVUsS0FBSyxFQUFFLEtBQUs7WUFDMUQsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxFQUFFLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVNLHlDQUFvQixHQUEzQixVQUE0QixJQUFTO1FBRWpDLElBQUksTUFBTSxHQUFHLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQy9CLElBQUksTUFBTSxHQUFHLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQy9CLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztRQUV0QixJQUFJLFVBQVUsR0FBRztZQUNiLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUMvQixRQUFRLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7U0FDakMsQ0FBQztRQUNGLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHNCQUFzQixDQUFDO1FBQ3pELENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLEdBQUcsRUFBRSxJQUFJO1lBQ1QsSUFBSSxFQUFFLFVBQVU7WUFDaEIsVUFBVSxFQUFFLFVBQVUsR0FBYztnQkFDaEMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBQ0QsT0FBTyxFQUFFLFVBQVUsSUFBSTtnQkFFbkIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFdEIsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzFCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsVUFBVSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN4QyxVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFFMUUsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDdEUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO3dCQUMxRCxNQUFNLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7b0JBQ3RELENBQUM7Z0JBQ0wsQ0FBQztZQUVMLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxVQUFVLEVBQUUsUUFBUTtnQkFFcEMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsS0FBSyxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7SUFHUCxDQUFDO0lBRU8saUNBQVksR0FBcEI7UUFDSSxJQUFJLENBQUMsV0FBVyxHQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsWUFBWSxHQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsYUFBYSxHQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FqVEEsQUFpVEMsQ0FqVCtCLFdBQUksR0FpVG5DO0FBalRZLGdDQUFVOzs7Ozs7Ozs7Ozs7OztBQ0x2QiwrQkFBOEI7QUFJOUI7SUFBNEIsMEJBQUk7SUFnQjVCO1FBQUEsWUFDSSxpQkFBTyxTQVlWO1FBWEcsU0FBUztRQUNULEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUUvQyxRQUFRO1FBQ1IsS0FBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkIsS0FBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkIsS0FBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkIsS0FBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkIsS0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFM0IsS0FBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7O0lBQzdCLENBQUM7SUFFUyxrQ0FBaUIsR0FBM0IsVUFBNEIsS0FBYTtRQUVyQyxJQUFJLE1BQU0sR0FBRyxpQkFBTSxTQUFTLFdBQUUsQ0FBQztRQUMvQixJQUFJLE1BQU0sR0FBRyxpQkFBTSxTQUFTLFdBQUUsQ0FBQztRQUMvQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFFbEIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFPO1lBQ2pELElBQUksVUFBVSxHQUFHO2dCQUNiLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRTtnQkFDM0MsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNyQixFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JCLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDckIsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNyQixJQUFJLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pCLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTthQUNwQyxDQUFDO1lBRUYsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBRWpDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ0gsSUFBSSxFQUFFLE1BQU07b0JBQ1osR0FBRyxFQUFFLEdBQUc7b0JBQ1IsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLFVBQVUsRUFBRSxVQUFVLEdBQWE7d0JBQy9CLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUN0QyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDcEYsQ0FBQztvQkFDRCxPQUFPLEVBQUUsVUFBVSxJQUFJO3dCQUVuQixVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFFdEUsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQzs0QkFDMUIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDL0MsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dDQUNkLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7NEJBQ2pDLElBQUk7Z0NBQ0EsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzs0QkFFakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQ0FDL0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQ25DLENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ0osTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQ0FDdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQ0FDZixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDbEQsSUFBSTtvQ0FDQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM1QyxDQUFDO3dCQUNMLENBQUM7b0JBQ0wsQ0FBQztvQkFDRCxLQUFLLEVBQUUsVUFBVSxVQUFVLEVBQUUsUUFBUTt3QkFDakMsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3RFLE1BQU0sQ0FBQyxNQUFNLENBQUMsNkRBQTZELENBQUMsQ0FBQztvQkFDakYsQ0FBQztvQkFDRCxLQUFLLEVBQUUsSUFBSTtpQkFDZCxDQUFDLENBQUM7WUFDUCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR08seUJBQVEsR0FBaEIsVUFBa0IsS0FBUztRQUV2QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSwrQkFBK0IsQ0FBQztRQUUvQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSwrQkFBK0IsQ0FBQztRQUUvQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSwrQkFBK0IsQ0FBQztRQUUvQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSwrQkFBK0IsQ0FBQztRQUUvQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sSUFBSSw4QkFBOEIsQ0FBQztRQUM5QyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sSUFBSSx1Q0FBdUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBQ0wsYUFBQztBQUFELENBOUhBLEFBOEhDLENBOUgyQixXQUFJLEdBOEgvQjtBQTlIWSx3QkFBTTs7Ozs7Ozs7Ozs7Ozs7QUNKbkIsK0JBQThCO0FBRTlCO0lBQTJCLHlCQUFJO0lBYzNCO1FBQUEsWUFDSSxpQkFBTyxTQWVWO1FBNUJELFNBQVM7UUFDWixtQkFBYSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBYzdCLFNBQVM7UUFDVCxLQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXpDLFFBQVE7UUFDUixLQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixLQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixLQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixLQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixLQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQixLQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuQyxLQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVuQyxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7SUFDN0IsQ0FBQztJQUVTLGlDQUFpQixHQUEzQixVQUE0QixLQUFhO1FBRXJDLElBQUksTUFBTSxHQUFHLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQy9CLElBQUksTUFBTSxHQUFHLGlCQUFNLFNBQVMsV0FBRSxDQUFDO1FBQy9CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUVqQixLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO1lBQ3ZDLElBQUksVUFBVSxHQUFHO2dCQUNiLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRTtnQkFDM0MsRUFBRSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNwQixFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3BCLEVBQUUsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsRUFBRSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNwQixLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pCLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUMvQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ25ELElBQUksRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTthQUNqQyxDQUFDO1lBQ0YsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFWixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBRWhDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ0gsSUFBSSxFQUFFLE1BQU07b0JBQ1osR0FBRyxFQUFFLEdBQUc7b0JBQ1IsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLFVBQVUsRUFBRSxVQUFVLEdBQWE7d0JBQy9CLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUN6QyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDcEYsQ0FBQztvQkFDRCxPQUFPLEVBQUUsVUFBVSxJQUFJO3dCQUVuQixVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFFdEUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFFdEIsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ2xCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7d0JBQzVGLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQ0FDZCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOzRCQUNqQyxJQUFJO2dDQUNBLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7NEJBRWpDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0NBQy9CLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDOzRCQUNsQyxDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNKLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7b0NBQ2YsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQ2xELElBQUk7b0NBQ0EsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDNUMsQ0FBQzt3QkFDTCxDQUFDO29CQUNMLENBQUM7b0JBQ0QsS0FBSyxFQUFFLFVBQVUsVUFBVSxFQUFFLFFBQVE7d0JBQ2pDLFVBQVUsQ0FBQyxjQUFjLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUV0RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN0QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUM5QyxDQUFDO29CQUNELEtBQUssRUFBRSxJQUFJO2lCQUNkLENBQUMsQ0FBQztZQUVQLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFHTyx3QkFBUSxHQUFoQixVQUFpQixLQUFTO1FBRXRCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxJQUFJLCtCQUErQixDQUFDO1FBRS9DLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxJQUFJLCtCQUErQixDQUFDO1FBRS9DLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxJQUFJLCtCQUErQixDQUFDO1FBRS9DLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxJQUFJLCtCQUErQixDQUFDO1FBRS9DLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsT0FBTyxJQUFJLHFEQUFxRCxDQUFDO1FBQ3JFLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEIsT0FBTyxJQUFJLDZCQUE2QixDQUFDO1FBQzdDLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFHTCxZQUFDO0FBQUQsQ0EzSUEsQUEySUMsQ0EzSTBCLFdBQUksR0EySTlCO0FBM0lZLHNCQUFLOzs7Ozs7Ozs7Ozs7OztBQ0FsQiwrQkFBNEI7QUFDNUIsdURBQXNEO0FBQ3RELG1DQUFrQztBQUNsQyxpQ0FBZ0M7QUFDaEMscUNBQW9DO0FBQ3BDLDJDQUEwQztBQUUxQztJQUErQiw2QkFBSTtJQW9DL0Isa0NBQWtDO0lBRWxDO1FBQUEsWUFDSSxpQkFBTyxTQTZCVjtRQTVCRyxTQUFTO1FBQ1QsS0FBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakMsS0FBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkMsS0FBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakMsS0FBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMzQyxLQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyQyxLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN2QyxLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUV2QyxRQUFRO1FBQ1IsS0FBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkMsS0FBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdkMsS0FBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFdkMsUUFBUTtRQUNSLEtBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUM3RCxLQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyQyxLQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pDLEtBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZDLEtBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDM0MsS0FBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFckMsV0FBVztRQUNYLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNyRCxLQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDbEQsMkNBQTJDO1FBRTFDLEtBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztJQUM3QixDQUFDO0lBRVMscUNBQWlCLEdBQTNCLFVBQTRCLEtBQWE7UUFFckMsSUFBSSxNQUFNLEdBQUcsaUJBQU0sU0FBUyxXQUFFLENBQUM7UUFDL0IsSUFBSSxNQUFNLEdBQUcsaUJBQU0sU0FBUyxXQUFFLENBQUM7UUFDL0IsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBRXJCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7WUFFOUMsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUMsZ0JBQWdCLElBQUksV0FBVyxDQUFDO2dCQUNqRCxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1FBRTVELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7WUFFbkMsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQztnQkFDdkMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBRXhDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7WUFFbEMsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQztnQkFDdEMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1FBRXRDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7WUFFcEMsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQztnQkFDeEMsU0FBUyxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUUxQyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFO1lBRXRDOztlQUVHO1lBQ0Y7O2dCQUVJO1FBQ1IsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFFeEIsSUFBSSxVQUFVLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO2FBQ2xDLENBQUM7WUFFRixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDcEMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDSCxJQUFJLEVBQUUsTUFBTTtnQkFDWixHQUFHLEVBQUUsR0FBRztnQkFDUixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLFVBQVUsR0FBYTtvQkFDL0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDOUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ3BGLENBQUM7Z0JBQ0QsT0FBTyxFQUFFLFVBQVUsSUFBSTtvQkFDbkIsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBRXRFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXRCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUNsQixNQUFNLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUM1RixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBLENBQUM7NEJBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDL0MsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN0QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN4QyxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxLQUFLLEVBQUUsVUFBVSxVQUFVLEVBQUUsUUFBUTtvQkFDakMsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3RFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzlDLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLElBQUk7YUFDZCxDQUFDLENBQUM7UUFFUCxDQUFDLENBQUMsQ0FBQztRQUdILElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQVc7WUFFOUMsSUFBSSxVQUFVLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO2FBQ2xDLENBQUM7WUFFRixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDckMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDSCxJQUFJLEVBQUUsTUFBTTtnQkFDWixHQUFHLEVBQUUsR0FBRztnQkFDUixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLFVBQVUsR0FBYTtvQkFDL0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNwRixDQUFDO2dCQUNELE9BQU8sRUFBRSxVQUFVLElBQUk7b0JBQ25CLFVBQVUsQ0FBQyxjQUFjLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUV0RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO3dCQUNkLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ2pDLElBQUk7d0JBQ0EsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFFakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO3dCQUM3QixTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLENBQUM7d0JBQ0YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDdEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDeEMsQ0FBQztnQkFFTCxDQUFDO2dCQUNELEtBQUssRUFBRSxVQUFVLFVBQVUsRUFBRSxRQUFRO29CQUNqQyxVQUFVLENBQUMsY0FBYyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUUsQ0FBQztnQkFDRCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBR0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1lBQ3ZCLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBR0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1lBRTVCLElBQUksVUFBVSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsTUFBTSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNsQyxPQUFPLEVBQUUsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JDLE9BQU8sRUFBRSxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRTthQUN4QyxDQUFDO1lBRUYsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ0gsSUFBSSxFQUFFLE1BQU07Z0JBQ1osR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxVQUFVLEdBQWE7b0JBQy9CLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNwQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDckMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ3BGLENBQUM7Z0JBQ0QsT0FBTyxFQUFFLFVBQVUsSUFBSTtvQkFDbkIsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBRXRFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXRCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUNsQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN0QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN4QyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQzt3QkFDeEMsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN0QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN4QyxDQUFDO29CQUNMLENBQUM7Z0JBRUwsQ0FBQztnQkFDRCxLQUFLLEVBQUUsVUFBVSxVQUFVLEVBQUUsUUFBUTtvQkFDakMsVUFBVSxDQUFDLGNBQWMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3RFLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBRTlDLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLElBQUk7YUFDZCxDQUFDLENBQUM7UUFFUCxDQUFDLENBQUMsQ0FBQztRQUdILElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQVk7WUFDaEQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7UUFHSCxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFZO1lBRWhELElBQUksVUFBVSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO2FBQ2pDLENBQUM7WUFFRixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDdkMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDSCxJQUFJLEVBQUUsTUFBTTtnQkFDWixHQUFHLEVBQUUsR0FBRztnQkFDUixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLFVBQVUsR0FBYTtvQkFDL0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3BDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNwRixDQUFDO2dCQUNELE9BQU8sRUFBRSxVQUFVLElBQUk7b0JBQ25CLFVBQVUsQ0FBQyxjQUFjLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUN0RSxTQUFTLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUV6QyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQztvQkFDekQsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDSCxJQUFJLEVBQUUsTUFBTTt3QkFDWixHQUFHLEVBQUUsSUFBSTt3QkFDVCxJQUFJLEVBQUUsVUFBVTt3QkFDaEIsVUFBVSxFQUFFLFVBQVUsR0FBYzs0QkFDaEMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDeEMsQ0FBQzt3QkFDRCxPQUFPLEVBQUUsVUFBVSxJQUFJOzRCQUVuQixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUV0QixFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQ0FDbEIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDMUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQ0FDdEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDeEMsQ0FBQzs0QkFBQyxJQUFJLENBQUMsQ0FBQztnQ0FDSixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29DQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQyxVQUFVLElBQUksV0FBVyxDQUFDO3dDQUMzQyxTQUFTLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO29DQUU1QyxTQUFTLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLENBQUM7b0NBQzdDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VDQXNCRztnQ0FDTixDQUFDO2dDQUFDLElBQUksQ0FBQyxDQUFDO29DQUNKLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztvQ0FDMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO2dDQUN0RCxDQUFDOzRCQUNMLENBQUM7d0JBRUwsQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLFVBQVUsRUFBRSxRQUFROzRCQUVwQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUNwQyxDQUFDO3dCQUNELEtBQUssRUFBRSxJQUFJO3FCQUNkLENBQUMsQ0FBQztvQkFHUjs7Ozs0QkFJUTtvQkFJSCxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFJeEM7bUVBQytDO2dCQUNsRCxDQUFDO2dCQUNELEtBQUssRUFBRSxVQUFVLFVBQVUsRUFBRSxRQUFRO29CQUNqQyxVQUFVLENBQUMsY0FBYyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDcEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztnQkFDRCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRU0sd0JBQUksR0FBWCxVQUFhLElBQVc7UUFDcEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsOEJBQThCLENBQUE7SUFDekMsQ0FBQztJQUNMLGdCQUFDO0FBQUQsQ0FqWEEsQUFpWEMsQ0FqWDhCLFdBQUksR0FpWGxDO0FBalhZLDhCQUFTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cImdsb2JhbC5kLnRzXCIvPlxyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgTWFpbiB9ICAgZnJvbSBcIi4vTWFpblwiO1xyXG5pbXBvcnQgeyBXb3JrQmVuY2ggfSBmcm9tIFwiLi9Xb3JrQmVuY2hcIjtcclxuLy9pbXBvcnQgeyBJR2xvYmFsU2NvcGUgfSBmcm9tIFwiLi9nbG9iYWxcIjtcclxuXHJcblxyXG5sZXQgY29uZmlybWF0aW9uX3RleHQ6IGFueTtcclxuXHJcblxyXG5mdW5jdGlvbiBzdGFydChwYXRoOnN0cmluZyk6dm9pZHtcclxuICAgIGxldCBHTE9CQUxTQ09QRTp7fTtcclxuICAgIC8vQ29udGFjdExvZ2dlci5sb2dDb250YWN0RGF0YSgpO1xyXG4gICAgY29uc3QgZWx0MiA9ICQoXCIjZ3JlZXRpbmdcIik7XHJcbiAgICBsZXQgY2ZnID0gbmV3IENvbmZpZygpO1xyXG4gICAgbGV0IG1haW4gPSBuZXcgTWFpbigpO1xyXG4gICAgbGV0IGV2ZW50TmFtZSA9IG1haW4uZ2V0UGFyYW1ldGVyQnlOYW1lKFwiZXZlbnRcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXHJcbiAgIFxyXG4gICAgc3dpdGNoIChldmVudE5hbWUpIHtcclxuICAgICAgICBjYXNlICd2aWV3ZXIud29ya2JlbmNoJzp7XHJcbiAgICAgICAgICAgIEdMT0JBTFNDT1BFID0geydXb3JrQmVuY2gnIDogIHdvcmtCZW5jaFN0YXJ0KCl9O1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBlbHQyLmh0bWwoXCJIZWxsbyBTaGlyYWsgQXZha2lhblwiKTtcclxuICAgIFxyXG59XHJcblxyXG5mdW5jdGlvbiB3b3JrQmVuY2hTdGFydCgpOldvcmtCZW5jaCB7XHJcbiAgICBsZXQgd29ya2JlbmNoID0gbmV3IFdvcmtCZW5jaCgpO1xyXG4gICAgcmV0dXJuIHdvcmtiZW5jaDtcclxufVxyXG5cclxuY2xhc3MgQ29udGFjdExvZ2dlcntcclxuICAgIHN0YXRpYyBsb2dDb250YWN0RGF0YSgpe1xyXG4gICAgICAgIGxldCBDT05UQUNUX0RBVEEgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERpc3BsYXlUZXh0OiAnaGVscCcsXHJcbiAgICAgICAgICAgICAgICBFbWFpbDogJ2hlbHBAc3MuY29tJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBEaXNwbGF5VGV4dDogJ2hlbHAyJyxcclxuICAgICAgICAgICAgICAgIEVtYWlsOiAnaGVscDJAc3MuY29tJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBEaXNwbGF5VGV4dDogJ2hlbHAzJyxcclxuICAgICAgICAgICAgICAgIEVtYWlsOiAnaGVscDNAc3MuY29tJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuICAgICAgICBmb3IgKGxldCBjb250YWN0IG9mIENPTlRBQ1RfREFUQSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRGlzcGxheSBUZXh0IDogJyArIGNvbnRhY3QuRGlzcGxheVRleHQgKyAnLCBFbWFpbCA6ICcrIGNvbnRhY3QuRW1haWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+e1xyXG4gICAgQ29udGFjdExvZ2dlci5sb2dDb250YWN0RGF0YSgpO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSggZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHN0YXJ0KHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7ICBcclxuICAgLy8gd2luZG93Lmdsb2JhbFZhciA9IFwiVGhpcyBpcyBnbG9iYWwhXCI7XHJcblxyXG59KTtcclxuIiwiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCYXJjb2RlIGV4dGVuZHMgQmFzZSB7XHJcblxyXG4gICAgLy9idXR0b25zXHJcbiAgICBhZGRfYmFyY29kZV9idG4gOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dHNcclxuICAgIGJfcGFnZSA6IGFueTtcclxuICAgIHRleHRUb0VuY29kZSA6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLmFkZF9iYXJjb2RlX2J0biA9ICQoJyNhZGRfYmFyY29kZV9idG4nKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dHNcclxuICAgICAgICB0aGlzLmJfcGFnZSA9ICQoXCIjYl9wYWdlXCIpO1xyXG4gICAgICAgIHRoaXMudGV4dFRvRW5jb2RlID0gJChcIiN0ZXh0VG9FbmNvZGVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBiYXJjb2RlID0gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICBiYXJjb2RlLmFkZF9iYXJjb2RlX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZTpFdmVudCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlczogYmFyY29kZS5iX3BhZ2UudmFsKClcclxuICAgICAgICAgICAgICAgICwgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB0ZXh0VG9FbmNvZGU6IGJhcmNvZGUudGV4dFRvRW5jb2RlLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgbXNnID0gYmFyY29kZS52YWxpZGF0ZSh2aWV3X21vZGVsKTtcclxuICAgICAgICAgICAgaWYgKG1zZyA9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLmJhcmNvZGUuYWRkO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0FkZGluZyBCYXJjb2RlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uc2Vzc2lvbl9leHBpcmVkX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXJjb2RlLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YS5zaG93ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChzdHJFcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZShtb2RlbDphbnkpOnN0cmluZyB7XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlID0gXCJcIjtcclxuICAgICAgICBpZiAobW9kZWwudGV4dFRvRW5jb2RlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlRleHQgVG8gRW5jb2RlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC5wYWdlcyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJOdW1iZXIgb2YgcGFnZXMgdG8gYXBwbHkgdGhlIGJhcmNvZGUgaXMgcmVxdWlyZWQuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb21tb24gfSBmcm9tIFwiLi9Db21tb25cIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIHRvYXN0ciBmcm9tIFwidG9hc3RyXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZSB7XHJcblxyXG4gICAgY29uZmlnOkNvbmZpZztcclxuICAgIGNvbW1vbjpDb21tb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgbGV0IGJhc2UgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuY29tbW9uID0gbmV3IENvbW1vbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmV2aWV3KGZpbGVOYW1lOiBzdHJpbmcsIGlzdGVtcDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmNvbmZpZy51cmxzLnZpZXdlci5wcmV2aWV3ICsgXCImZmlsZU5hbWU9XCIgKyBmaWxlTmFtZSArICcmaXN0ZW1wPScgKyBpc3RlbXA7XHJcbiAgICAgICAgdGhpcy5nZXRDb21tb24oKS5wZGZfaWZyYW1lLmF0dHIoXCJzcmNcIiwgdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29uZmlnKCk6Q29uZmlne1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb25maWcgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29tbW9uKCk6Q29tbW9ue1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb21tb24gPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHRoaXMuY29tbW9uID0gbmV3IENvbW1vbigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbW1vbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UGFyYW1ldGVyQnlOYW1lKG5hbWU6c3RyaW5nLCB1cmw6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICBsZXQgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgbmFtZSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksXHJcbiAgICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICghcmVzdWx0c1syXSkgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb21tb24ge1xyXG5cclxuICAgIC8vdGV4dFxyXG4gICAgY29uZmlybWF0aW9uX3RleHQ6IGFueTtcclxuICAgIGFjdGlvbl9sYWJlbDogYW55O1xyXG4gICAgZXJyb3JNb2RhbE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgICAvL2lucHV0XHJcbiAgICBmaWxlTmFtZTogYW55O1xyXG4gICAgZmllbGROYW1lOiBhbnk7XHJcbiAgICBwYXNzUGRmOiBhbnk7XHJcbiAgICBuZXd1c2VycGFzc3dvcmQ6IGFueTtcclxuXHJcbiAgICAvL21vZGFsXHJcbiAgICBjb25maXJtYXRpb25fbW9kYWw6IGFueTtcclxuICAgIGxvYWRpbmdfbW9kYWw6IGFueTtcclxuICAgIGVycm9yTW9kYWxEYW5nZXI6IGFueTtcclxuICAgIHNlc3Npb25fZXhwaXJlZF9tb2RhbDogYW55O1xyXG5cclxuICAgIC8vT3RoZXJcclxuICAgIHBkZl9pZnJhbWU6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgICAgICAgXHJcbiAgICAgICAgLy90ZXh0XHJcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb25fdGV4dCAgPSAkKCcjY29uZmlybWF0aW9uX3RleHQnKTtcclxuICAgICAgICB0aGlzLmFjdGlvbl9sYWJlbCAgICAgICA9ICQoXCIjYWN0aW9uX2xhYmVsXCIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3JNb2RhbE1lc3NhZ2UgID0gJCgnI2Vycm9yTW9kYWxNZXNzYWdlJyk7XHJcblxyXG4gICAgICAgIC8vbW9kYWxcclxuICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbl9tb2RhbCAgICAgPSAkKCcjY29uZmlybWF0aW9uX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nX21vZGFsICAgICAgICAgID0gJCgnI2xvYWRpbmdfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLmVycm9yTW9kYWxEYW5nZXIgICAgICAgPSAkKCcjZXJyb3JNb2RhbERhbmdlcicpO1xyXG4gICAgICAgIHRoaXMuc2Vzc2lvbl9leHBpcmVkX21vZGFsICA9ICQoJyNzZXNzaW9uX2V4cGlyZWRfbW9kYWwnKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dFxyXG4gICAgICAgIHRoaXMuZmlsZU5hbWUgPSAkKCcjZmlsZU5hbWUnKTtcclxuICAgICAgICB0aGlzLnBhc3NQZGYgID0gJCgnI3Bhc3NQZGYnKTtcclxuICAgICAgICB0aGlzLm5ld3VzZXJwYXNzd29yZCA9ICQoJyNuZXd1c2VycGFzc3dvcmQnKTtcclxuXHJcbiAgICAgICAgLy9vdGhlclxyXG4gICAgICAgIHRoaXMucGRmX2lmcmFtZSA9ICQoJyNwZGZfaWZyYW1lJyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICB0aGVBY3R1YWxTZXJ2ZXI6IHN0cmluZztcclxuICAgIHByb3RvY29sOiBzdHJpbmc7XHJcbiAgICBhcHBGb2xkZXI6IHN0cmluZztcclxuICAgIENHSVNjcmlwdE5hbWUgOiBzdHJpbmc7XHJcbiAgICB1cmxzOiBNeVVybHM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy50aGVBY3R1YWxTZXJ2ZXIgPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgICAgICB0aGlzLnByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xyXG4gICAgICAgIHRoaXMuYXBwRm9sZGVyID0gXCIvXCI7ICBcclxuICAgICAgICB0aGlzLkNHSVNjcmlwdE5hbWUgPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnByb3RvY29sICsgXCIvL1wiICsgdGhpcy50aGVBY3R1YWxTZXJ2ZXIgKyB0aGlzLmFwcEZvbGRlciArIHRoaXMuQ0dJU2NyaXB0TmFtZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVybHMgPSBuZXcgTXlVcmxzKCBwYXRoICk7XHJcbiAgICAgICBcclxuICAgIH1cclxuXHJcbn0gXHJcblxyXG5jbGFzcyBNeVVybHN7XHJcblxyXG4gICAgbWFpbjogTWFpbjtcclxuICAgIGRpZ2l0YWxzaWduYXR1cmU6IERpZ2l0YWxzaWduYXR1cmU7XHJcbiAgICBzdGFtcDogU3RhbXA7XHJcbiAgICBzYW5pdGl6ZTogU2FuaXRpemU7XHJcbiAgICByZWRhY3Q6IFJlZGFjdDtcclxuICAgIGJhcmNvZGU6IEJhcmNvZGU7XHJcbiAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xyXG4gICAgdmlld2VyOiBWaWV3ZXI7XHJcbiAgICByb290OiBSb290O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5tYWluID0gbmV3IE1haW4oX3ApO1xyXG4gICAgICAgIHRoaXMuZGlnaXRhbHNpZ25hdHVyZSA9IG5ldyBEaWdpdGFsc2lnbmF0dXJlKF9wKTtcclxuICAgICAgICB0aGlzLnN0YW1wID0gbmV3IFN0YW1wKF9wKTtcclxuICAgICAgICB0aGlzLnNhbml0aXplID0gbmV3IFNhbml0aXplKF9wKTtcclxuICAgICAgICB0aGlzLnJlZGFjdCA9IG5ldyBSZWRhY3QoX3ApO1xyXG4gICAgICAgIHRoaXMuYmFyY29kZSA9IG5ldyBCYXJjb2RlKF9wKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBuZXcgUHJvcGVydGllcyhfcCk7XHJcbiAgICAgICAgdGhpcy52aWV3ZXIgPSBuZXcgVmlld2VyKF9wKTtcclxuICAgICAgICB0aGlzLnJvb3QgPSBuZXcgUm9vdChfcCk7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuLy9EaWdpdGFsIFNpZ25hdHVyZSBIYW5kbGVyXHJcbmNsYXNzIE1haW4ge1xyXG4gICAgaW5kZXg6IHN0cmluZztcclxuICAgIHVwbG9hZEZpbGVzOiBzdHJpbmc7XHJcbiAgICByZWFkTWV0YWRhdGE6IHN0cmluZztcclxuICAgIHBpbmc6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBfcGF0aCArIFwiP2V2ZW50PW1haW4uaW5kZXhcIjtcclxuICAgICAgICB0aGlzLnVwbG9hZEZpbGVzID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnVwbG9hZEZpbGVzXCI7XHJcbiAgICAgICAgdGhpcy5yZWFkTWV0YWRhdGEgPSBfcGF0aCArIFwiP2V2ZW50PW1haW4ucmVhZE1ldGFkYXRhXCI7XHJcbiAgICAgICAgdGhpcy5waW5nID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnBpbmdcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGlnaXRhbHNpZ25hdHVyZSB7XHJcbiAgICBhZGRGaWVsZDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkRmllbGQgPSBfcGF0aCArIFwiP2V2ZW50PWRpZ2l0YWxzaWduYXR1cmUuYWRkRmllbGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU3RhbXAge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PXN0YW1wLmFkZFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTYW5pdGl6ZXtcclxuICAgIGFwcGx5IDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFwcGx5ID0gX3BhdGggKyBcIj9ldmVudD1zYW5pdGl6ZS5hcHBseVwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWRhY3Qge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PXJlZGFjdC5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQmFyY29kZSB7XHJcbiAgICBhZGQgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmFkZCA9IF9wYXRoICsgXCI/ZXZlbnQ9YmFyY29kZS5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUHJvcGVydGllcyAge1xyXG4gICAgaW5kZXg6IHN0cmluZztcclxuICAgIGFkZDogc3RyaW5nOyBcclxuICAgIGRlbGV0ZTogc3RyaW5nOyBcclxuICAgIHNhdmU6IHN0cmluZzsgXHJcbiAgICBleHBvcnQ6IHN0cmluZzsgICAgICAgIFxyXG4gICAgaW1wb3J0OiBzdHJpbmc7ICBcclxuICAgIHJlYWRDdXN0b21lclByb3BlcnRpZXM6IHN0cmluZztcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuaW5kZXggID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmluZGV4XCI7XHJcbiAgICAgICAgdGhpcy5hZGQgICAgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMuYWRkXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGUgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMuZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5zYXZlICAgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMuc2F2ZVwiO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0ID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmV4cG9ydFwiO1xyXG4gICAgICAgIHRoaXMuaW1wb3J0ID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmltcG9ydFwiO1xyXG4gICAgICAgIHRoaXMucmVhZEN1c3RvbWVyUHJvcGVydGllcyA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5yZWFkQ3VzdG9tZXJQcm9wZXJ0aWVzXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFZpZXdlciB7XHJcbiAgICBwcmV2aWV3IDogc3RyaW5nOyBcclxuICAgIGRlbGV0ZTogc3RyaW5nO1xyXG4gICAgcmVzdG9yZTogc3RyaW5nO1xyXG4gICAgc2F2ZTogc3RyaW5nO1xyXG4gICAgZW1haWw6IHN0cmluZztcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucHJldmlldyAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLnByZXZpZXdcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZSAgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5kZWxldGVcIjtcclxuICAgICAgICB0aGlzLnJlc3RvcmUgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5yZXN0b3JlXCI7XHJcbiAgICAgICAgdGhpcy5zYXZlICAgICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIuc2F2ZVwiO1xyXG4gICAgICAgIHRoaXMuZW1haWwgICAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLmVtYWlsXCI7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBSb290IHtcclxuICAgICBwYXRoOnN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKXtcclxuICAgICAgICAgdGhpcy5wYXRoID0gX3BhdGg7XHJcbiAgICAgfVxyXG4gfVxyXG4iLCJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERpZ2l0YWxTaWduYXR1cmUgZXh0ZW5kcyBCYXNlIHtcclxuXHJcbiAgICAvL0J1dHRvblxyXG5cdGFkZF9zaWduYXR1cmVfZmllbGRfYnRuIDogYW55O1xyXG5cclxuICAgIGZpbGVOYW1lIDogYW55O1xyXG4gICAgZF94MSA6IGFueTtcclxuICAgIGRfeTEgOiBhbnk7XHJcbiAgICBkX3gyIDogYW55O1xyXG4gICAgZF95MiA6IGFueTtcclxuICAgIHBhZ2UgOiBhbnk7XHJcbiAgICBmaWVsZE5hbWUgOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLmFkZF9zaWduYXR1cmVfZmllbGRfYnRuID0gJCgnI2FkZF9zaWduYXR1cmVfZmllbGRfYnRuJyk7XHJcblxyXG4gICAgICAgIHRoaXMuZF94MSA9ICQoXCIjZF94MVwiKTtcclxuICAgICAgICB0aGlzLmRfeTEgPSAkKFwiI2RfeTFcIik7XHJcbiAgICAgICAgdGhpcy5kX3gyID0gJChcIiNkX3gyXCIpO1xyXG4gICAgICAgIHRoaXMuZF95MiA9ICQoXCIjZF95MlwiKTtcclxuICAgICAgICB0aGlzLnBhZ2UgPSAkKFwiI3BhZ2VcIik7XHJcbiAgICAgICAgdGhpcy5maWVsZE5hbWUgPSAkKFwiI2ZpZWxkTmFtZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IGRpZ2l0YWxTaWduYXR1cmUgPSB0aGlzO1xyXG5cclxuICAgICAgICBkaWdpdGFsU2lnbmF0dXJlLmFkZF9zaWduYXR1cmVfZmllbGRfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIG5ld3VzZXJwYXNzd29yZDogY29tbW9uLm5ld3VzZXJwYXNzd29yZC52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4MTogZGlnaXRhbFNpZ25hdHVyZS5kX3gxLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHkxOiBkaWdpdGFsU2lnbmF0dXJlLmRfeTEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDI6IGRpZ2l0YWxTaWduYXR1cmUuZF94Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5MjogZGlnaXRhbFNpZ25hdHVyZS5kX3kyLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHBhZ2U6IGRpZ2l0YWxTaWduYXR1cmUucGFnZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBmaWVsZE5hbWU6IGRpZ2l0YWxTaWduYXR1cmUuZmllbGROYW1lLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtc2cgPSBkaWdpdGFsU2lnbmF0dXJlLnZhbGlkYXRlKCB2aWV3X21vZGVsICk7XHJcbiAgICAgICAgICAgIGlmIChtc2cgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGNvbmZpZy51cmxzLmRpZ2l0YWxzaWduYXR1cmUuYWRkRmllbGQ7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnQWRkaW5nIHNpZ25hdHVyZSBmaWVsZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLnNlc3Npb25fZXhwaXJlZF9tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlnaXRhbFNpZ25hdHVyZS5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuaW5mbygnU2lnbmF0dXJlIGZpZWxkIHdpbGwgbm90IHNob3cgdXAgaWYgeW91IGFyZSB1c2luZyBDaHJvbWUvRmlyZWZveC9TYWZhcmkgYnJvd2VzZXJzISBkb3dubG9hZCB0aGUgUERGIGFuZCBvcGVuIGl0IHVzaW5nIEFkb2JlIEFjcm9iYXQgUmVhZGVyLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YS5zaG93ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZGFuZ2VyKCdFeGNlcHRpb24hLCBvdXIgZGV2ZWxvcG1lbnQgdGVhbSB3aWxsIGxvb2sgaW50byB0aGlzIGlzc3VlLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZSggbW9kZWw6YW55ICk6c3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIGlmIChtb2RlbC54MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLnkxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueDIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwueTIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwuZmllbGROYW1lID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlNpZ25hdHVyZSBmaWVsZCBuYW1lIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC5wYWdlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlBhZ2UgbnVtYmVyIGlzIHJlcXVpcmVkLjxicj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChOdW1iZXIobW9kZWwucGFnZSkgPD0gMCkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiRW50ZXIgYSBwb3NpdGl2ZSBudW1iZXIgZm9yIHBhZ2UuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5leHBvcnQgY2xhc3MgTWFpbiBleHRlbmRzIEJhc2Uge1xyXG4gICAvLyBtYWluOnRoaXM7XHJcbiAgICBjb25maWc6Q29uZmlnO1xyXG4gICBcclxuICAgIHVybF9pbnB1dCA6IGFueTtcclxuICAgIHVwbG9hZGVkX2ZpbGU6IGFueTtcclxuXHJcbiAgICAvL2J1dHRvblxyXG4gICAgdXBsb2FkX3BkZl9idG46IGFueTtcclxuICAgIGNvbmZpcm1feWVzOiBhbnk7XHJcbiAgICB1cmx0b1BERl9idG46IGFueTtcclxuICAgIGJ0bkV4cGlyZWRPazogYW55O1xyXG4gICAgcGFzc3dvcmRfYXBwbHlfYnRuOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbFxyXG5cclxuICAgIC8vRElWL3NwYW4vbGFiZWxcclxuICAgIGZpbGVVcGxvYWRNb2RhbF9ib2R5OiBhbnk7XHJcbiAgICBwcmVsb2FkX2RpdjogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7ICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cmxfaW5wdXQgPSAkKCcjdXJsX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy51cGxvYWRlZF9maWxlID0gJCgnI3VwbG9hZGVkX2ZpbGUnKTtcclxuXHJcbiAgICAgICAgLy9idXR0b25cclxuICAgICAgICB0aGlzLnVwbG9hZF9wZGZfYnRuID0gJCgnI3VwbG9hZF9wZGZfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5jb25maXJtX3llcyA9ICQoJyNjb25maXJtX3llcycpO1xyXG4gICAgICAgIHRoaXMudXJsdG9QREZfYnRuID0gJCgnI3VybHRvUERGX2J0bicpO1xyXG4gICAgICAgIHRoaXMuYnRuRXhwaXJlZE9rID0gJCgnI2J0bkV4cGlyZWRPaycpO1xyXG4gICAgICAgIHRoaXMucGFzc3dvcmRfYXBwbHlfYnRuID0gJCgnI3Bhc3N3b3JkX2FwcGx5X2J0bicpO1xyXG5cclxuICAgICAgICAvL21vZGFsXHJcblxyXG5cclxuICAgICAgICAvL0RJVi9zcGFuL2xhYmVsXHJcbiAgICAgICAgdGhpcy5maWxlVXBsb2FkTW9kYWxfYm9keSA9ICQoJyNmaWxlVXBsb2FkTW9kYWxfYm9keScpOyAgICAgICBcclxuICAgICAgICB0aGlzLnByZWxvYWRfZGl2ID0gJChcIiNwcmVsb2FkX2RpdlwiKTtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKCBldmVudD86RXZlbnQgKTp2b2lkIHtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBtYWluID0gdGhpcztcclxuXHJcbiAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdicy5tb2RhbCcsIG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIC8vICBsZXQgcmVkYWN0ID0gbmV3IFJlZGFjdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbmZpcm1feWVzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDpFdmVudCkge1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogY29tbW9uLnBhc3NQZGYudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy5zYW5pdGl6ZS5hcHBseTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnU2FuaXRpemluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW4ucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbW1vbi5jb25maXJtYXRpb25fbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpbmcoKTpzdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIFwiTWFpbiBjbGFzcyBjb25zdHJ1Y3RlZC5cIlxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5pbXBvcnQgeyBDb21tb24gfSBmcm9tIFwiLi9Db21tb25cIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvcGVydGllcyBleHRlbmRzIEJhc2Uge1xyXG5cclxuICAgIC8vYnV0dG9uc1xyXG5cdGFkZF9jdXN0b21fcHJvcF9idG4gOiBhbnk7XHJcbiAgICBzYXZlX3Byb3BlcnRpZXNfYnRuIDogYW55O1xyXG4gICAgZXhwb3J0X21ldGFfYnRuICAgICA6IGFueTtcclxuICAgIGltcG9ydF9tZXRhX2J0biAgICAgOiBhbnk7XHJcbiAgICBkZWxfY3VzdF9wcm9wX2J0biAgIDogYW55O1xyXG5cclxuICAgIC8vZGl2c1xyXG4gICAgY3VzdG9tX3Byb3BfZGl2ICAgICAgOiBhbnk7XHJcbiAgICBtYWluX3Byb3BlcnRpZXNfYm9keSA6IGFueTtcclxuXHJcbiAgICAvL2lucHV0c1xyXG4gICAgY3VzdG9tZV9wcm9wX25hbWUgICA6IGFueTtcclxuICAgIGN1c3RvbWVfcHJvcF92YWx1ZSAgOiBhbnk7XHJcbiAgICB0aXRsZV9pbnB1dCAgICAgICAgIDogYW55O1xyXG4gICAgYXV0aG9yX2lucHV0ICAgICAgICA6IGFueTtcclxuICAgIHN1YmplY3RfaW5wdXQgICAgICAgOiBhbnk7XHJcbiAgICBrZXl3b3Jkc19pbnB1dCAgICAgIDogYW55O1xyXG4gICAgXHJcbiAgICAvL090aGVyXHJcbiAgICBhcnJheW9mX2RlbGV0ZWJ0bl9pZDogc3RyaW5nW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5hZGRfY3VzdG9tX3Byb3BfYnRuID0gJCgnI2FkZF9jdXN0b21fcHJvcF9idG4nKTtcclxuICAgICAgICB0aGlzLnNhdmVfcHJvcGVydGllc19idG4gPSAkKCcjc2F2ZV9wcm9wZXJ0aWVzX2J0bicpO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0X21ldGFfYnRuICAgICA9ICQoJyNleHBvcnRfbWV0YV9idG4nKTtcclxuICAgICAgICB0aGlzLmltcG9ydF9tZXRhX2J0biAgICAgPSAkKCcjaW1wb3J0X21ldGFfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5kZWxfY3VzdF9wcm9wX2J0biA9ICQoJy5idG4gb3JhbmdlIGRhcmtlbi0yIGRlbCcpO1xyXG4gICAgIFxyXG4gICAgICAgIC8vZGl2c1xyXG4gICAgICAgIHRoaXMuY3VzdG9tX3Byb3BfZGl2ICAgICAgPSAkKCcjY3VzdG9tX3Byb3BfZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5tYWluX3Byb3BlcnRpZXNfYm9keSA9ICQoJyNtYWluX3Byb3BlcnRpZXNfYm9keScpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMuY3VzdG9tZV9wcm9wX25hbWUgID0gJCgnI2N1c3RvbWVfcHJvcF9uYW1lJyk7XHJcbiAgICAgICAgdGhpcy5jdXN0b21lX3Byb3BfdmFsdWUgPSAkKCcjY3VzdG9tZV9wcm9wX3ZhbHVlJyk7XHJcbiAgICAgICAgdGhpcy50aXRsZV9pbnB1dCAgICAgICAgPSAkKCcjdGl0bGVfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmF1dGhvcl9pbnB1dCAgICAgICA9ICQoJyNhdXRob3JfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLnN1YmplY3RfaW5wdXQgICAgICA9ICQoJyNzdWJqZWN0X2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5rZXl3b3Jkc19pbnB1dCAgICAgPSAkKCcja2V5d29yZHNfaW5wdXQnKTtcclxuICAgICAgICAvL090aGVyXHJcbiAgICAgICAgdGhpcy5hcnJheW9mX2RlbGV0ZWJ0bl9pZCA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1vbiAgICAgID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyAgICAgID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgID0gdGhpcztcclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5hZGRfY3VzdG9tX3Byb3BfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHByb3BlcnRpZXMuY3VzdG9tZV9wcm9wX25hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogcHJvcGVydGllcy5jdXN0b21lX3Byb3BfdmFsdWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMuYWRkO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdBZGRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VzdG9tX3Byb3BfZGl2Lmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5zYXZlX3Byb3BlcnRpZXNfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnJlaW5pdElucHV0cygpO1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBUaXRsZTogcHJvcGVydGllcy50aXRsZV9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIEF1dGhvcjogcHJvcGVydGllcy5hdXRob3JfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBTdWJqZWN0OiBwcm9wZXJ0aWVzLnN1YmplY3RfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBLZXl3b3JkczogcHJvcGVydGllcy5rZXl3b3Jkc19pbnB1dC52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMucHJvcGVydGllcy5zYXZlO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ1NhdmluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5tYWluX3Byb3BlcnRpZXNfYm9keS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHByb3BlcnRpZXMuZXhwb3J0X21ldGFfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnJlaW5pdElucHV0cygpO1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBUaXRsZTogcHJvcGVydGllcy50aXRsZV9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIEF1dGhvcjogcHJvcGVydGllcy5hdXRob3JfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBTdWJqZWN0OiBwcm9wZXJ0aWVzLnN1YmplY3RfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBLZXl3b3JkczogcHJvcGVydGllcy5rZXl3b3Jkc19pbnB1dC52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMucHJvcGVydGllcy5leHBvcnQ7XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnRXhwb3J0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ01ldGFkYXRhIGV4cG90ZWQgc3VjY2Vzc2Z1bGx5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5kZWxfY3VzdF9wcm9wX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbihlOkV2ZW50KXtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSAkKHRoaXMpLmRhdGEoJ3Byb3AnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocHJvcCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGVDdXN0b21Qcm9wZXJ0eShldmVudDphbnkpOnZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uOkNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWc6Q29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgICAgPSBuZXcgUHJvcGVydGllcygpO1xyXG4gICAgICAgIGxldCBwcm9wID0gICQodGhpcykuYXR0cihcImRhdGEtcHJvcFwiKTtcclxuICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgbmFtZTogcHJvcFxyXG5cclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLmRlbGV0ZTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdEZWxldGluZycpO1xyXG4gICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlckN1c3RvbVByb3BlcnRpZXMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5odG1sKCdVbmFibGUgdG8gbG9hZCBjdXN0b20gcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZGFuZ2VyKCdVbmFibGUgdG8gbG9hZCBjdXN0b20gcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXJDdXN0b21Qcm9wZXJ0aWVzKGRhdGE6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgPSB0aGlzO1xyXG5cclxuICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJycpO1xyXG4gICAgICAgIGxldCB0YWJsZSA9ICQoJzx0YWJsZT48L3RhYmxlPicpLmFkZENsYXNzKCd0YWJsZScpO1xyXG4gICAgICAgIGxldCB0aGVhZCA9ICQoJzx0aGVhZD48L3RoZWFkPicpLmFkZENsYXNzKCdtZGItY29sb3IgZGFya2VuLTMnKTtcclxuICAgICAgICBsZXQgaHRyID0gJCgnPHRyPjwvdHI+JykuYWRkQ2xhc3MoJ3RleHQtd2hpdGUnKTtcclxuICAgICAgICBsZXQgaHRoID0gJCgnPHRoPiMjPC90aD48dGg+TmFtZTwvdGg+PHRoPlZhbHVlPC90aD4nKTtcclxuICAgICAgICBodHIuYXBwZW5kKGh0aCk7XHJcbiAgICAgICAgdGhlYWQuYXBwZW5kKGh0cik7XHJcbiAgICAgICAgdGFibGUuYXBwZW5kKHRoZWFkKTtcclxuICAgICAgICBsZXQgdGJvZHkgPSAkKCc8dGJvZHk+PC90Ym9keT4nKTtcclxuXHJcbiAgICAgICAgJC5lYWNoKGRhdGEucGRmLlByb3BlcnRpZXMsIGZ1bmN0aW9uIChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBsZXQgYnRuX2lkID0gJ2RlbF9jdXN0XycgKyBrZXk7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMuYXJyYXlvZl9kZWxldGVidG5faWQucHVzaChidG5faWQpO1xyXG4gICAgICAgICAgICBsZXQgcm93ID0gJCgnPHRyPjx0ZD4nICsga2V5ICsgJzwvdGQ+PHRkPicgKyB2YWx1ZSArICc8L3RkPjx0ZD48YnV0dG9uIGRhdGEtcHJvcD0nICsga2V5ICsnIGlkPVwiJyArIGJ0bl9pZCArICdcIj5EZWxldGU8L2J1dHRvbj48L3RkPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgIHRib2R5LmFwcGVuZChyb3cpO1xyXG4gICAgICAgICAgICB0YWJsZS5hcHBlbmQodGJvZHkpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICQoJyNoZXJlX3RhYmxlJykuYXBwZW5kKHRhYmxlKTtcclxuXHJcbiAgICAgICAgJC5lYWNoKHByb3BlcnRpZXMuYXJyYXlvZl9kZWxldGVidG5faWQsIGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcclxuICAgICAgICAgICAgJCgnIycgKyB2YWx1ZSkuY2xpY2soeyB2YWx1ZSB9LCBwcm9wZXJ0aWVzLmRlbGV0ZUN1c3RvbVByb3BlcnR5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWFkQ3VzdG9tUHJvcGVydGllcyhkYXRhPzphbnkpOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgPSB0aGlzO1xyXG5cclxuICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGNvbW1vbi5wYXNzUGRmLnZhbCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgdXJsMiA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMucmVhZEN1c3RvbWVyUHJvcGVydGllcztcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgdXJsOiB1cmwyLFxyXG4gICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnTG9hZGluZy4uLicpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlckN1c3RvbVByb3BlcnRpZXMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJ1VuYWJsZSB0byBsb2FkIGN1c3RvbSBwcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5kYW5nZXIoJ1VuYWJsZSB0byBsb2FkIGN1c3RvbSBwcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSwgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNoZXJlX3RhYmxlJykuaHRtbChzdHJFcnJvcik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWluaXRJbnB1dHMoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLnRpdGxlX2lucHV0ICAgID0gJCgnI3RpdGxlX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5hdXRob3JfaW5wdXQgICA9ICQoJyNhdXRob3JfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLnN1YmplY3RfaW5wdXQgID0gJCgnI3N1YmplY3RfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmtleXdvcmRzX2lucHV0ID0gJCgnI2tleXdvcmRzX2lucHV0Jyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgQ29tbW9uIH0gZnJvbSBcIi4vQ29tbW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVkYWN0IGV4dGVuZHMgQmFzZSB7XHJcblxyXG4gICAgLy9DbGFzc2VzXHJcbiAgICBjb25maWcgOiBDb25maWc7XHJcbiAgICBjb21tb24gOiBDb21tb247XHJcblxyXG4gICAgLy9idXR0b25zXHJcblx0cmVkYWN0X2FwcGx5X2J0biA6IGFueTtcclxuXHJcbiAgICAvL2lucHV0cyBcclxuICAgIHJfeDEgOiBhbnk7XHJcbiAgICByX3kxIDogYW55O1xyXG4gICAgcl94MiA6IGFueTtcclxuICAgIHJfeTIgOiBhbnk7XHJcbiAgICByX3BhZ2UgOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLnJlZGFjdF9hcHBseV9idG4gPSAkKCcjcmVkYWN0X2FwcGx5X2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMucl94MSA9ICQoXCIjcl94MVwiKTtcclxuICAgICAgICB0aGlzLnJfeTEgPSAkKFwiI3JfeTFcIik7XHJcbiAgICAgICAgdGhpcy5yX3gyID0gJChcIiNyX3gyXCIpO1xyXG4gICAgICAgIHRoaXMucl95MiA9ICQoXCIjcl95MlwiKTtcclxuICAgICAgICB0aGlzLnJfcGFnZSA9ICQoXCIjcl9wYWdlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWcgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgcmVkYWN0ID0gdGhpcztcclxuXHJcbiAgICAgICAgcmVkYWN0LnJlZGFjdF9hcHBseV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBuZXd1c2VycGFzc3dvcmQ6IGNvbW1vbi5uZXd1c2VycGFzc3dvcmQudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDE6IHJlZGFjdC5yX3gxLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHkxOiByZWRhY3Qucl95MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4MjogcmVkYWN0LnJfeDIudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTI6IHJlZGFjdC5yX3kyLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHBhZ2U6IHJlZGFjdC5yX3BhZ2UudmFsKClcclxuICAgICAgICAgICAgICAgICwgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IG1zZyA9IHJlZGFjdC52YWxpZGF0ZSh2aWV3X21vZGVsKTtcclxuICAgICAgICAgICAgaWYgKG1zZyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gY29uZmlnLnVybHMucmVkYWN0LmFkZDtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdSZWRhY3RpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZGFjdC5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaG93ZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmRhbmdlcignRXhjZXB0aW9uISwgb3VyIGRldmVsb3BtZW50IHRlYW0gd2lsbCBsb29rIGludG8gdGhpcyBpc3N1ZS4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGUgKG1vZGVsOmFueSk6c3RyaW5nIHtcclxuICAgICBcclxuICAgICAgICBsZXQgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKG1vZGVsLngxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlgxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueTEgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTEgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbC54MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC55MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJZMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC5wYWdlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlBhZ2UgbnVtYmVyIGlzIHJlcXVpcmVkLjxicj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChOdW1iZXIobW9kZWwucGFnZSkgPD0gMCkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiRW50ZXIgYSBwb3NpdGl2ZSBudW1iZXIgZm9yIHBhZ2UuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhbXAgZXh0ZW5kcyBCYXNlIHtcclxuXHJcbiAgICAvL2J1dHRvbnNcclxuXHRhZGRfc3RhbXBfYnRuID0gJCgnI2FkZF9zdGFtcF9idG4nKTtcclxuXHJcbiAgICAvL2lucHV0c1xyXG4gICAgc194MSA6IGFueTtcclxuICAgIHNfeTEgOiBhbnk7XHJcbiAgICBzX3gyIDogYW55O1xyXG4gICAgc195MiA6IGFueTtcclxuICAgIHNfcGFnZSA6IGFueTtcclxuICAgIHN0YW1wX25vdGUgOiBhbnk7XHJcbiAgICBzdGFtcF90eXBlIDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vYnV0dG9uc1xyXG4gICAgICAgIHRoaXMuYWRkX3N0YW1wX2J0biA9ICQoJyNhZGRfc3RhbXBfYnRuJyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRzXHJcbiAgICAgICAgdGhpcy5zX3gxID0gJChcIiNzX3gxXCIpO1xyXG4gICAgICAgIHRoaXMuc195MSA9ICQoXCIjc195MVwiKTtcclxuICAgICAgICB0aGlzLnNfeDIgPSAkKFwiI3NfeDJcIik7XHJcbiAgICAgICAgdGhpcy5zX3kyID0gJChcIiNzX3kyXCIpO1xyXG4gICAgICAgIHRoaXMuc19wYWdlID0gJChcIiNzX3BhZ2VcIik7XHJcbiAgICAgICAgdGhpcy5zdGFtcF9ub3RlID0gJChcIiNzdGFtcF9ub3RlXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhbXBfdHlwZSA9ICQoXCIjc3RhbXBfdHlwZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHN0YW1wID0gdGhpcztcclxuXHJcbiAgICAgICAgc3RhbXAuYWRkX3N0YW1wX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIG5ld3VzZXJwYXNzd29yZDogY29tbW9uLm5ld3VzZXJwYXNzd29yZC52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4MTogc3RhbXAuc194MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5MTogc3RhbXAuc195MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4Mjogc3RhbXAuc194Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5Mjogc3RhbXAuc195Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBwYWdlczogc3RhbXAuc19wYWdlLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgICAgICwgdHlwZTogJChcIiNzdGFtcF90eXBlXCIpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpXHJcbiAgICAgICAgICAgICAgICAsIHR5cGVWYWx1ZTogJChcIiNzdGFtcF90eXBlXCIpLmZpbmQoXCI6c2VsZWN0ZWRcIikudmFsKClcclxuICAgICAgICAgICAgICAgICwgbm90ZTogc3RhbXAuc3RhbXBfbm90ZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgbXNnID0gc3RhbXAudmFsaWRhdGUodmlld19tb2RlbCk7XHJcbiAgICAgICAgICAgIGlmIChtc2cgPT0gXCJcIikge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy5zdGFtcC5hZGQ7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnQWRkaW5nIHN0YW1wJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLnNlc3Npb25fZXhwaXJlZF9tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbXAucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2hvd2Vycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobXNnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZShtb2RlbDphbnkpOnN0cmluZyB7XHJcbiAgICAgICBcclxuICAgICAgICBsZXQgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKG1vZGVsLngxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlgxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueTEgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTEgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbC54MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC55MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJZMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC5wYWdlcyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJOdW1iZXIgb2YgcGFnZXMgdG8gYXBwbHkgdGhlIHN0YW1wIGlzIHJlcXVpcmVkLjxicj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC50eXBlVmFsdWUgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiU3RhbXAgdHlwZSBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IENvbW1vbiB9IGZyb20gXCIuL0NvbW1vblwiO1xyXG5pbXBvcnQge0Jhc2V9IGZyb20gXCIuL0Jhc2VcIjtcclxuaW1wb3J0IHsgRGlnaXRhbFNpZ25hdHVyZSB9IGZyb20gXCIuL0RpZ2l0YWxTaWduYXR1cmVcIjtcclxuaW1wb3J0IHsgUmVkYWN0IH0gZnJvbSBcIi4vUmVkYWN0XCI7XHJcbmltcG9ydCB7IFN0YW1wIH0gZnJvbSBcIi4vU3RhbXBcIjtcclxuaW1wb3J0IHsgQmFyY29kZSB9IGZyb20gXCIuL0JhcmNvZGVcIjtcclxuaW1wb3J0IHsgUHJvcGVydGllcyB9IGZyb20gXCIuL1Byb3BlcnRpZXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JrQmVuY2ggZXh0ZW5kcyBCYXNle1xyXG5cclxuICAgIC8vY2xhc3Nlc1xyXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcclxuICAgIGJhcmNvZGUgOiBCYXJjb2RlO1xyXG4gICAgc3RhbXAgOiBTdGFtcDtcclxuICAgIHJlZGFjdCA6IFJlZGFjdDtcclxuICAgIGRpZ2l0YWxTaWduYXR1cmU6IERpZ2l0YWxTaWduYXR1cmU7XHJcbiAgICBjb25maWc6IENvbmZpZztcclxuICAgIGNvbW1vbjogQ29tbW9uO1xyXG5cclxuICAgIC8vYnV0dG9uc1xyXG4gICAgcmVzZXRfYnRuIDogYW55O1xyXG4gICAgZGVsZXRlX2J0bjogYW55O1xyXG4gICAgZW1haWxfYnRuOiBhbnk7XHJcbiAgICBzZW5kX2VtYWlsX2J0bjogYW55O1xyXG4gICAgcmVzdG9yZV9idG46IGFueTtcclxuICAgIHNhbml0aXplX2J0bjogYW55O1xyXG4gICAgcHJvcGVydHlfYnRuOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dHNcclxuICAgIHlvdXJfZW1haWw6IGFueTtcclxuICAgIHlvdXJfc3ViamVjdDogYW55O1xyXG4gICAgeW91cl9tZXNzYWdlOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbHNcclxuICAgIGRpZ2l0YWxfc2lnbmF0dXJlX21vZGFsOiBhbnk7XHJcbiAgICBzdGFtcF9tb2RhbDogYW55O1xyXG4gICAgYmFyY29kZV9tb2RhbDogYW55O1xyXG4gICAgcmVkYWN0X21vZGFsOiBhbnk7XHJcbiAgICBwcm9wZXJ0eV9tb2RhbDogYW55O1xyXG4gICAgZW1haWxfbW9kYWw6IGFueTtcclxuXHJcbiAgICAvL290aGVyL0RJVlxyXG4gICAgcHJvcGVydHlfbW9kYWxfYm9keTogYW55O1xyXG4gICAgYXR0YWNoZWRfZmlsZU5hbWU6IGFueTtcclxuICAgIC8vYXJyYXlvZl9kZWxldGVidG5faWQgOiBzdHJpbmdbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5yZXNldF9idG4gPSAkKCcjcmVzZXRfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVfYnRuID0gJCgnI2RlbGV0ZV9idG4nKTtcclxuICAgICAgICB0aGlzLmVtYWlsX2J0biA9ICQoJyNlbWFpbF9idG4nKTtcclxuICAgICAgICB0aGlzLnNlbmRfZW1haWxfYnRuID0gJCgnI3NlbmRfZW1haWxfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5yZXN0b3JlX2J0biA9ICQoJyNyZXN0b3JlX2J0bicpO1xyXG4gICAgICAgIHRoaXMuc2FuaXRpemVfYnRuID0gJCgnI3Nhbml0aXplX2J0bicpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlfYnRuID0gJCgnI3Byb3BlcnR5X2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMueW91cl9lbWFpbCA9ICQoJyN5b3VyX2VtYWlsJyk7XHJcbiAgICAgICAgdGhpcy55b3VyX3N1YmplY3QgPSAkKCcjeW91cl9zdWJqZWN0Jyk7XHJcbiAgICAgICAgdGhpcy55b3VyX21lc3NhZ2UgPSAkKCcjeW91cl9tZXNzYWdlJyk7XHJcblxyXG4gICAgICAgIC8vbW9kYWxzXHJcbiAgICAgICAgdGhpcy5kaWdpdGFsX3NpZ25hdHVyZV9tb2RhbCA9ICQoJyNkaWdpdGFsX3NpZ25hdHVyZV9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMuc3RhbXBfbW9kYWwgPSAkKCcjc3RhbXBfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLmJhcmNvZGVfbW9kYWwgPSAkKCcjYmFyY29kZV9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMucmVkYWN0X21vZGFsID0gJCgnI3JlZGFjdF9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWwgPSAkKCcjcHJvcGVydHlfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLmVtYWlsX21vZGFsID0gJCgnI2VtYWlsX21vZGFsJyk7XHJcblxyXG4gICAgICAgIC8vb3RoZXIvRElWXHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eV9tb2RhbF9ib2R5ID0gJCgnI3Byb3BlcnR5X21vZGFsX2JvZHknKTtcclxuICAgICAgICB0aGlzLmF0dGFjaGVkX2ZpbGVOYW1lID0gJCgnI2F0dGFjaGVkX2ZpbGVOYW1lJyk7XHJcbiAgICAgICAvLyB0aGlzLmFycmF5b2ZfZGVsZXRlYnRuX2lkID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHdvcmtiZW5jaCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3b3JrYmVuY2guZGlnaXRhbFNpZ25hdHVyZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5kaWdpdGFsU2lnbmF0dXJlID0gbmV3IERpZ2l0YWxTaWduYXR1cmUoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVkYWN0X21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLnJlZGFjdCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5yZWRhY3QgPSBuZXcgUmVkYWN0KCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnN0YW1wX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLnN0YW1wID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgd29ya2JlbmNoLnN0YW1wID0gbmV3IFN0YW1wKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJhcmNvZGVfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3b3JrYmVuY2guYmFyY29kZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5iYXJjb2RlID0gbmV3IEJhcmNvZGUoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgLyogaWYgKHR5cGVvZiB3b3JrYmVuY2gucHJvcGVydGllcyA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLyokLmVhY2god29ya2JlbmNoLmFycmF5b2ZfZGVsZXRlYnRuX2lkLCBmdW5jdGlvbiAoaW5kZXgsdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICQoJyMnICsgdmFsdWUpLmNsaWNrKHt2YWx1ZX0sIHdvcmtiZW5jaC5wcm9wZXJ0aWVzLmRlbGV0ZUN1c3RvbVByb3BlcnR5KTtcclxuICAgICAgICAgICAgfSkqL1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRlbGV0ZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMudmlld2VyLmRlbGV0ZTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0RlbGV0aW5nIHRoZSBmaWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2F0aW9uLmhyZWYgPSBjb25maWcudXJscy5yb290LnBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVzdG9yZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy52aWV3ZXIucmVzdG9yZTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ1Jlc3RvcmluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5lbWFpbF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3b3JrYmVuY2guYXR0YWNoZWRfZmlsZU5hbWUuaHRtbChjb21tb24uZmlsZU5hbWUudmFsKCkpO1xyXG4gICAgICAgICAgICB3b3JrYmVuY2guZW1haWxfbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2VuZF9lbWFpbF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgbWFpbHRvOiB3b3JrYmVuY2gueW91cl9lbWFpbC52YWwoKSxcclxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IHdvcmtiZW5jaC55b3VyX3N1YmplY3QudmFsKCksXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB3b3JrYmVuY2gueW91cl9tZXNzYWdlLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMudmlld2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5lbWFpbF9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnRW1haWxpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5pbmZvKCdFbWFpbCBoYXMgYmVlbiBzZW50LicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLmVtYWlsX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdVbmFibGUgdG8gc2VuZCB0aGUgZW1haWwuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2FuaXRpemVfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDogRXZlbnQpIHtcclxuICAgICAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl90ZXh0Lmh0bWwoJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBTYW5pdGl6ZSB0aGUgUERGPycpO1xyXG4gICAgICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnByb3BlcnR5X2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6IEV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogY29tbW9uLnBhc3NQZGYudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLmluZGV4O1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnTG9hZGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLnByb3BlcnR5X21vZGFsX2JvZHkuaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVybDIgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLnJlYWRDdXN0b21lclByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJ0xvYWRpbmcuLi4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLnByb3BlcnRpZXMgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydGllcyA9IG5ldyBQcm9wZXJ0aWVzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydGllcy5yZWFkQ3VzdG9tUHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICQoJyNoZXJlX3RhYmxlJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0YWJsZSA9ICQoJzx0YWJsZT48L3RhYmxlPicpLmFkZENsYXNzKCd0YWJsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGhlYWQgPSAkKCc8dGhlYWQ+PC90aGVhZD4nKS5hZGRDbGFzcygnbWRiLWNvbG9yIGRhcmtlbi0zJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBodHIgPSAkKCc8dHI+PC90cj4nKS5hZGRDbGFzcygndGV4dC13aGl0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHRoID0gJCgnPHRoPiMjPC90aD48dGg+TmFtZTwvdGg+PHRoPlZhbHVlPC90aD4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRyLmFwcGVuZChodGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVhZC5hcHBlbmQoaHRyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUuYXBwZW5kKHRoZWFkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRib2R5ID0gJCgnPHRib2R5PjwvdGJvZHk+Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZGF0YS5wZGYuUHJvcGVydGllcywgZnVuY3Rpb24gKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnRuX2lkID0gJ2RlbF9jdXN0XycgKyBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2guYXJyYXlvZl9kZWxldGVidG5faWQucHVzaCggYnRuX2lkICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gJCgnPHRyPjx0ZD4nICsga2V5ICsgJzwvdGQ+PHRkPicgKyB2YWx1ZSArICc8L3RkPjx0ZD48YnV0dG9uIGlkPVwiJyArIGJ0bl9pZCArICdcIj5EZWxldGU8L2J1dHRvbj48L3RkPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Ym9keS5hcHBlbmQocm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdcIicgKyBidG5faWQgKyAnXCInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlLmFwcGVuZCh0Ym9keSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmFwcGVuZCh0YWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2hlcmVfdGFibGUnKS5odG1sKCdVbmFibGUgdG8gbG9hZCBjdXN0b20gcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZGFuZ2VyKCdVbmFibGUgdG8gbG9hZCBjdXN0b20gcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGVyZV90YWJsZScpLmh0bWwoc3RyRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSAkKCc8dHI+PC90cj4nKS5hZGRDbGFzcygnYmFyJykudGV4dCgncmVzdWx0ICcgKyBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUuYXBwZW5kKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLnByb3BlcnR5X21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgIC8qIGlmICh0eXBlb2Ygd29ya2JlbmNoLnByb3BlcnRpZXMgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoKTsqL1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoc3RyRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGluZyggcHJvcDpzdHJpbmcgKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgd29ya2JlbmNoID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZygncGluZyBjbGlja2VkJyk7XHJcbiAgICAgICAgd29ya2JlbmNoLnByb3BlcnRpZXMuZGVsZXRlQ3VzdG9tUHJvcGVydHkocHJvcCk7XHJcbiAgICAgICAgcmV0dXJuIFwiV29ya0JlbmNoIGNsYXNzIGNvbnN0cnVjdGVkLlwiXHJcbiAgICB9XHJcbn0iXX0=
