(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var Main_1 = require("./Main");
var WorkBench_1 = require("./WorkBench");
var confirmation_text;
var global_scope;
function start(path) {
    var elt2 = $("#greeting");
    var cfg = new Config_1.Config();
    var main = new Main_1.Main();
    var eventName = main.getParameterByName("event", window.location.href);
    switch (eventName) {
        case 'viewer.workbench': {
            global_scope = { 'wb': workBenchStart() };
            break;
        }
        default:
            break;
    }
    elt2.html("Hello Shirak Avakian");
    return global_scope;
}
function workBenchStart() {
    var workbench = new WorkBench_1.WorkBench();
    return workbench;
}
$(document).ready(function () {
    global_scope = start(window.location.pathname);
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
        var divs = document.querySelectorAll('.btn orange darken-2 del');
        [].forEach.call(divs, function (div) {
            // do whatever
            console.log(div);
        });
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
    Properties.prototype.deleteCustomProperty = function (prop) {
        var common = _super.prototype.getCommon.call(this);
        var config = _super.prototype.getConfig.call(this);
        var properties = this;
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
                    workbench.property_modal.modal('show');
                    if (typeof workbench.properties == 'undefined')
                        workbench.properties = new Properties_1.Properties();
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
    WorkBench.prototype.ping = function () {
        return "WorkBench class constructed.";
    };
    return WorkBench;
}(Base_1.Base));
exports.WorkBench = WorkBench;
},{"./Barcode":2,"./Base":3,"./DigitalSignature":6,"./Properties":8,"./Redact":9,"./Stamp":10}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy90cy9BcHBsaWNhdGlvbi50cyIsImluY2x1ZGVzL3RzL0JhcmNvZGUudHMiLCJpbmNsdWRlcy90cy9CYXNlLnRzIiwiaW5jbHVkZXMvdHMvQ29tbW9uLnRzIiwiaW5jbHVkZXMvdHMvQ29uZmlnLnRzIiwiaW5jbHVkZXMvdHMvRGlnaXRhbFNpZ25hdHVyZS50cyIsImluY2x1ZGVzL3RzL01haW4udHMiLCJpbmNsdWRlcy90cy9Qcm9wZXJ0aWVzLnRzIiwiaW5jbHVkZXMvdHMvUmVkYWN0LnRzIiwiaW5jbHVkZXMvdHMvU3RhbXAudHMiLCJpbmNsdWRlcy90cy9Xb3JrQmVuY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLG1DQUFrQztBQUNsQywrQkFBZ0M7QUFDaEMseUNBQXdDO0FBR3hDLElBQUksaUJBQXNCLENBQUM7QUFDM0IsSUFBSSxZQUFnQixDQUFDO0FBRXJCLGVBQWUsSUFBVztJQUV0QixJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztJQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO0lBQ3RCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUV0RSxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLEtBQUssa0JBQWtCLEVBQUMsQ0FBQztZQUNwQixZQUFZLEdBQUcsRUFBQyxJQUFJLEVBQUcsY0FBYyxFQUFFLEVBQUMsQ0FBQztZQUMxQyxLQUFLLENBQUM7UUFDVixDQUFDO1FBR0Q7WUFDSSxLQUFLLENBQUM7SUFDZCxDQUFDO0lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0Is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dUJBQVUsRUFBRSxDQUFDO2dCQUNoRCxDQUFDO2dCQUNELEtBQUssRUFBRSxVQUFVLFVBQVUsRUFBRSxRQUFRO29CQUNqQyxVQUFVLENBQUMsY0FBYyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDcEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztnQkFDRCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRU0sd0JBQUksR0FBWDtRQUNJLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQTtJQUN6QyxDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQTVSQSxBQTRSQyxDQTVSOEIsV0FBSSxHQTRSbEM7QUE1UlksOEJBQVMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IE1haW4gfSAgIGZyb20gXCIuL01haW5cIjtcclxuaW1wb3J0IHsgV29ya0JlbmNoIH0gZnJvbSBcIi4vV29ya0JlbmNoXCI7XHJcblxyXG5cclxubGV0IGNvbmZpcm1hdGlvbl90ZXh0OiBhbnk7XHJcbmxldCBnbG9iYWxfc2NvcGU6YW55O1xyXG5cclxuZnVuY3Rpb24gc3RhcnQocGF0aDpzdHJpbmcpOmFueXtcclxuICAgXHJcbiAgICBjb25zdCBlbHQyID0gJChcIiNncmVldGluZ1wiKTtcclxuICAgIGxldCBjZmcgPSBuZXcgQ29uZmlnKCk7XHJcbiAgICBsZXQgbWFpbiA9IG5ldyBNYWluKCk7XHJcbiAgICBsZXQgZXZlbnROYW1lID0gbWFpbi5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJldmVudFwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcclxuICAgXHJcbiAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xyXG4gICAgICAgIGNhc2UgJ3ZpZXdlci53b3JrYmVuY2gnOntcclxuICAgICAgICAgICAgIGdsb2JhbF9zY29wZSA9IHsnd2InIDogd29ya0JlbmNoU3RhcnQoKX07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICBcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGVsdDIuaHRtbChcIkhlbGxvIFNoaXJhayBBdmFraWFuXCIpO1xyXG4gICAgcmV0dXJuIGdsb2JhbF9zY29wZTtcclxufVxyXG5cclxuZnVuY3Rpb24gd29ya0JlbmNoU3RhcnQoKSB7XHJcbiAgICBsZXQgd29ya2JlbmNoID0gbmV3IFdvcmtCZW5jaCgpO1xyXG4gICAgcmV0dXJuIHdvcmtiZW5jaDtcclxufVxyXG5cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgZ2xvYmFsX3Njb3BlID0gc3RhcnQod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTsgIFxyXG4gICAvLyB3aW5kb3cuZ2xvYmFsVmFyID0gXCJUaGlzIGlzIGdsb2JhbCFcIjtcclxuXHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhcmNvZGUgZXh0ZW5kcyBCYXNlIHtcclxuXHJcbiAgICAvL2J1dHRvbnNcclxuICAgIGFkZF9iYXJjb2RlX2J0biA6IGFueTtcclxuXHJcbiAgICAvL2lucHV0c1xyXG4gICAgYl9wYWdlIDogYW55O1xyXG4gICAgdGV4dFRvRW5jb2RlIDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vYnV0dG9uc1xyXG4gICAgICAgIHRoaXMuYWRkX2JhcmNvZGVfYnRuID0gJCgnI2FkZF9iYXJjb2RlX2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMuYl9wYWdlID0gJChcIiNiX3BhZ2VcIik7XHJcbiAgICAgICAgdGhpcy50ZXh0VG9FbmNvZGUgPSAkKFwiI3RleHRUb0VuY29kZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IGJhcmNvZGUgPSB0aGlzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGJhcmNvZGUuYWRkX2JhcmNvZGVfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiBiYXJjb2RlLmJfcGFnZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHRleHRUb0VuY29kZTogYmFyY29kZS50ZXh0VG9FbmNvZGUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtc2cgPSBiYXJjb2RlLnZhbGlkYXRlKHZpZXdfbW9kZWwpO1xyXG4gICAgICAgICAgICBpZiAobXNnID09IFwiXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMuYmFyY29kZS5hZGQ7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnQWRkaW5nIEJhcmNvZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhcmNvZGUucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2hvd2Vycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKHN0ckVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobXNnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlKG1vZGVsOmFueSk6c3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIGlmIChtb2RlbC50ZXh0VG9FbmNvZGUgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiVGV4dCBUbyBFbmNvZGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnBhZ2VzID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIk51bWJlciBvZiBwYWdlcyB0byBhcHBseSB0aGUgYmFyY29kZSBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbW1vbiB9IGZyb20gXCIuL0NvbW1vblwiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0ICogYXMgdG9hc3RyIGZyb20gXCJ0b2FzdHJcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlIHtcclxuICAgIGNvbmZpZzpDb25maWc7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBsZXQgYmFzZSA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBuZXcgQ29uZmlnKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZXZpZXcoZmlsZU5hbWU6IHN0cmluZywgaXN0ZW1wOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHVybCA9IHRoaXMuY29uZmlnLnVybHMudmlld2VyLnByZXZpZXcgKyBcIiZmaWxlTmFtZT1cIiArIGZpbGVOYW1lICsgJyZpc3RlbXA9JyArIGlzdGVtcDtcclxuICAgICAgICB0aGlzLmdldENvbW1vbigpLnBkZl9pZnJhbWUuYXR0cihcInNyY1wiLCB1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb25maWcoKTpDb25maWd7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb21tb24oKTpDb21tb257XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb21tb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UGFyYW1ldGVyQnlOYW1lKG5hbWU6c3RyaW5nLCB1cmw6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICBsZXQgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgbmFtZSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksXHJcbiAgICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICghcmVzdWx0c1syXSkgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb21tb24ge1xyXG5cclxuICAgIC8vdGV4dFxyXG4gICAgY29uZmlybWF0aW9uX3RleHQ6IGFueTtcclxuICAgIGFjdGlvbl9sYWJlbDogYW55O1xyXG4gICAgZXJyb3JNb2RhbE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgICAvL2lucHV0XHJcbiAgICBmaWxlTmFtZTogYW55O1xyXG4gICAgZmllbGROYW1lOiBhbnk7XHJcbiAgICBwYXNzUGRmOiBhbnk7XHJcbiAgICBuZXd1c2VycGFzc3dvcmQ6IGFueTtcclxuXHJcbiAgICAvL21vZGFsXHJcbiAgICBjb25maXJtYXRpb25fbW9kYWw6IGFueTtcclxuICAgIGxvYWRpbmdfbW9kYWw6IGFueTtcclxuICAgIGVycm9yTW9kYWxEYW5nZXI6IGFueTtcclxuICAgIHNlc3Npb25fZXhwaXJlZF9tb2RhbDogYW55O1xyXG5cclxuICAgIC8vT3RoZXJcclxuICAgIHBkZl9pZnJhbWU6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgICAgICAgXHJcbiAgICAgICAgLy90ZXh0XHJcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb25fdGV4dCAgPSAkKCcjY29uZmlybWF0aW9uX3RleHQnKTtcclxuICAgICAgICB0aGlzLmFjdGlvbl9sYWJlbCAgICAgICA9ICQoXCIjYWN0aW9uX2xhYmVsXCIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3JNb2RhbE1lc3NhZ2UgID0gJCgnI2Vycm9yTW9kYWxNZXNzYWdlJyk7XHJcblxyXG4gICAgICAgIC8vbW9kYWxcclxuICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbl9tb2RhbCAgICAgPSAkKCcjY29uZmlybWF0aW9uX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nX21vZGFsICAgICAgICAgID0gJCgnI2xvYWRpbmdfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLmVycm9yTW9kYWxEYW5nZXIgICAgICAgPSAkKCcjZXJyb3JNb2RhbERhbmdlcicpO1xyXG4gICAgICAgIHRoaXMuc2Vzc2lvbl9leHBpcmVkX21vZGFsICA9ICQoJyNzZXNzaW9uX2V4cGlyZWRfbW9kYWwnKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dFxyXG4gICAgICAgIHRoaXMuZmlsZU5hbWUgPSAkKCcjZmlsZU5hbWUnKTtcclxuICAgICAgICB0aGlzLnBhc3NQZGYgID0gJCgnI3Bhc3NQZGYnKTtcclxuICAgICAgICB0aGlzLm5ld3VzZXJwYXNzd29yZCA9ICQoJyNuZXd1c2VycGFzc3dvcmQnKTtcclxuXHJcbiAgICAgICAgLy9vdGhlclxyXG4gICAgICAgIHRoaXMucGRmX2lmcmFtZSA9ICQoJyNwZGZfaWZyYW1lJyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICB0aGVBY3R1YWxTZXJ2ZXI6IHN0cmluZztcclxuICAgIHByb3RvY29sOiBzdHJpbmc7XHJcbiAgICBhcHBGb2xkZXI6IHN0cmluZztcclxuICAgIENHSVNjcmlwdE5hbWUgOiBzdHJpbmc7XHJcbiAgICB1cmxzOiBNeVVybHM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy50aGVBY3R1YWxTZXJ2ZXIgPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgICAgICB0aGlzLnByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xyXG4gICAgICAgIHRoaXMuYXBwRm9sZGVyID0gXCIvXCI7ICBcclxuICAgICAgICB0aGlzLkNHSVNjcmlwdE5hbWUgPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnByb3RvY29sICsgXCIvL1wiICsgdGhpcy50aGVBY3R1YWxTZXJ2ZXIgKyB0aGlzLmFwcEZvbGRlciArIHRoaXMuQ0dJU2NyaXB0TmFtZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVybHMgPSBuZXcgTXlVcmxzKCBwYXRoICk7XHJcbiAgICAgICBcclxuICAgIH1cclxuXHJcbn0gXHJcblxyXG5jbGFzcyBNeVVybHN7XHJcblxyXG4gICAgbWFpbjogTWFpbjtcclxuICAgIGRpZ2l0YWxzaWduYXR1cmU6IERpZ2l0YWxzaWduYXR1cmU7XHJcbiAgICBzdGFtcDogU3RhbXA7XHJcbiAgICBzYW5pdGl6ZTogU2FuaXRpemU7XHJcbiAgICByZWRhY3Q6IFJlZGFjdDtcclxuICAgIGJhcmNvZGU6IEJhcmNvZGU7XHJcbiAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xyXG4gICAgdmlld2VyOiBWaWV3ZXI7XHJcbiAgICByb290OiBSb290O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5tYWluID0gbmV3IE1haW4oX3ApO1xyXG4gICAgICAgIHRoaXMuZGlnaXRhbHNpZ25hdHVyZSA9IG5ldyBEaWdpdGFsc2lnbmF0dXJlKF9wKTtcclxuICAgICAgICB0aGlzLnN0YW1wID0gbmV3IFN0YW1wKF9wKTtcclxuICAgICAgICB0aGlzLnNhbml0aXplID0gbmV3IFNhbml0aXplKF9wKTtcclxuICAgICAgICB0aGlzLnJlZGFjdCA9IG5ldyBSZWRhY3QoX3ApO1xyXG4gICAgICAgIHRoaXMuYmFyY29kZSA9IG5ldyBCYXJjb2RlKF9wKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBuZXcgUHJvcGVydGllcyhfcCk7XHJcbiAgICAgICAgdGhpcy52aWV3ZXIgPSBuZXcgVmlld2VyKF9wKTtcclxuICAgICAgICB0aGlzLnJvb3QgPSBuZXcgUm9vdChfcCk7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuLy9EaWdpdGFsIFNpZ25hdHVyZSBIYW5kbGVyXHJcbmNsYXNzIE1haW4ge1xyXG4gICAgaW5kZXg6IHN0cmluZztcclxuICAgIHVwbG9hZEZpbGVzOiBzdHJpbmc7XHJcbiAgICByZWFkTWV0YWRhdGE6IHN0cmluZztcclxuICAgIHBpbmc6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBfcGF0aCArIFwiP2V2ZW50PW1haW4uaW5kZXhcIjtcclxuICAgICAgICB0aGlzLnVwbG9hZEZpbGVzID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnVwbG9hZEZpbGVzXCI7XHJcbiAgICAgICAgdGhpcy5yZWFkTWV0YWRhdGEgPSBfcGF0aCArIFwiP2V2ZW50PW1haW4ucmVhZE1ldGFkYXRhXCI7XHJcbiAgICAgICAgdGhpcy5waW5nID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnBpbmdcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGlnaXRhbHNpZ25hdHVyZSB7XHJcbiAgICBhZGRGaWVsZDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkRmllbGQgPSBfcGF0aCArIFwiP2V2ZW50PWRpZ2l0YWxzaWduYXR1cmUuYWRkRmllbGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU3RhbXAge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PXN0YW1wLmFkZFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTYW5pdGl6ZXtcclxuICAgIGFwcGx5IDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFwcGx5ID0gX3BhdGggKyBcIj9ldmVudD1zYW5pdGl6ZS5hcHBseVwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWRhY3Qge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PXJlZGFjdC5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQmFyY29kZSB7XHJcbiAgICBhZGQgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmFkZCA9IF9wYXRoICsgXCI/ZXZlbnQ9YmFyY29kZS5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUHJvcGVydGllcyAge1xyXG4gICAgaW5kZXg6IHN0cmluZztcclxuICAgIGFkZDogc3RyaW5nOyBcclxuICAgIGRlbGV0ZTogc3RyaW5nOyBcclxuICAgIHNhdmU6IHN0cmluZzsgXHJcbiAgICBleHBvcnQ6IHN0cmluZzsgICAgICAgIFxyXG4gICAgaW1wb3J0OiBzdHJpbmc7ICBcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuaW5kZXggID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmluZGV4XCI7XHJcbiAgICAgICAgdGhpcy5hZGQgICAgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMuYWRkXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGUgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMuZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5zYXZlICAgPSBfcGF0aCArIFwiP2V2ZW50PXByb3BlcnRpZXMuc2F2ZVwiO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0ID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmV4cG9ydFwiO1xyXG4gICAgICAgIHRoaXMuaW1wb3J0ID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmltcG9ydFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBWaWV3ZXIge1xyXG4gICAgcHJldmlldyA6IHN0cmluZzsgXHJcbiAgICBkZWxldGU6IHN0cmluZztcclxuICAgIHJlc3RvcmU6IHN0cmluZztcclxuICAgIHNhdmU6IHN0cmluZztcclxuICAgIGVtYWlsOiBzdHJpbmc7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnByZXZpZXcgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5wcmV2aWV3XCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGUgICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIuZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5yZXN0b3JlICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIucmVzdG9yZVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZSAgICAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLnNhdmVcIjtcclxuICAgICAgICB0aGlzLmVtYWlsICAgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5lbWFpbFwiO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgUm9vdCB7XHJcbiAgICAgcGF0aDpzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgIHRoaXMucGF0aCA9IF9wYXRoO1xyXG4gICAgIH1cclxuIH1cclxuIiwiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEaWdpdGFsU2lnbmF0dXJlIGV4dGVuZHMgQmFzZSB7XHJcblxyXG4gICAgLy9CdXR0b25cclxuXHRhZGRfc2lnbmF0dXJlX2ZpZWxkX2J0biA6IGFueTtcclxuXHJcbiAgICBmaWxlTmFtZSA6IGFueTtcclxuICAgIGRfeDEgOiBhbnk7XHJcbiAgICBkX3kxIDogYW55O1xyXG4gICAgZF94MiA6IGFueTtcclxuICAgIGRfeTIgOiBhbnk7XHJcbiAgICBwYWdlIDogYW55O1xyXG4gICAgZmllbGROYW1lIDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5hZGRfc2lnbmF0dXJlX2ZpZWxkX2J0biA9ICQoJyNhZGRfc2lnbmF0dXJlX2ZpZWxkX2J0bicpO1xyXG5cclxuICAgICAgICB0aGlzLmRfeDEgPSAkKFwiI2RfeDFcIik7XHJcbiAgICAgICAgdGhpcy5kX3kxID0gJChcIiNkX3kxXCIpO1xyXG4gICAgICAgIHRoaXMuZF94MiA9ICQoXCIjZF94MlwiKTtcclxuICAgICAgICB0aGlzLmRfeTIgPSAkKFwiI2RfeTJcIik7XHJcbiAgICAgICAgdGhpcy5wYWdlID0gJChcIiNwYWdlXCIpO1xyXG4gICAgICAgIHRoaXMuZmllbGROYW1lID0gJChcIiNmaWVsZE5hbWVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBkaWdpdGFsU2lnbmF0dXJlID0gdGhpcztcclxuXHJcbiAgICAgICAgZGlnaXRhbFNpZ25hdHVyZS5hZGRfc2lnbmF0dXJlX2ZpZWxkX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZTpFdmVudCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBuZXd1c2VycGFzc3dvcmQ6IGNvbW1vbi5uZXd1c2VycGFzc3dvcmQudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDE6IGRpZ2l0YWxTaWduYXR1cmUuZF94MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5MTogZGlnaXRhbFNpZ25hdHVyZS5kX3kxLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHgyOiBkaWdpdGFsU2lnbmF0dXJlLmRfeDIudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTI6IGRpZ2l0YWxTaWduYXR1cmUuZF95Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBwYWdlOiBkaWdpdGFsU2lnbmF0dXJlLnBhZ2UudmFsKClcclxuICAgICAgICAgICAgICAgICwgZmllbGROYW1lOiBkaWdpdGFsU2lnbmF0dXJlLmZpZWxkTmFtZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgbXNnID0gZGlnaXRhbFNpZ25hdHVyZS52YWxpZGF0ZSggdmlld19tb2RlbCApO1xyXG4gICAgICAgICAgICBpZiAobXNnID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy5kaWdpdGFsc2lnbmF0dXJlLmFkZEZpZWxkO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0FkZGluZyBzaWduYXR1cmUgZmllbGQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZ2l0YWxTaWduYXR1cmUucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmluZm8oJ1NpZ25hdHVyZSBmaWVsZCB3aWxsIG5vdCBzaG93IHVwIGlmIHlvdSBhcmUgdXNpbmcgQ2hyb21lL0ZpcmVmb3gvU2FmYXJpIGJyb3dlc2VycyEgZG93bmxvYWQgdGhlIFBERiBhbmQgb3BlbiBpdCB1c2luZyBBZG9iZSBBY3JvYmF0IFJlYWRlci4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaG93ZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmRhbmdlcignRXhjZXB0aW9uISwgb3VyIGRldmVsb3BtZW50IHRlYW0gd2lsbCBsb29rIGludG8gdGhpcyBpc3N1ZS4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGUoIG1vZGVsOmFueSApOnN0cmluZyB7XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlID0gXCJcIjtcclxuICAgICAgICBpZiAobW9kZWwueDEgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDEgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbC55MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJZMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLngyID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlgyIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnkyID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkyIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLmZpZWxkTmFtZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJTaWduYXR1cmUgZmllbGQgbmFtZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwucGFnZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJQYWdlIG51bWJlciBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTnVtYmVyKG1vZGVsLnBhZ2UpIDw9IDApIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIkVudGVyIGEgcG9zaXRpdmUgbnVtYmVyIGZvciBwYWdlLjxicj5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuZXhwb3J0IGNsYXNzIE1haW4gZXh0ZW5kcyBCYXNlIHtcclxuICAgLy8gbWFpbjp0aGlzO1xyXG4gICAgY29uZmlnOkNvbmZpZztcclxuICAgIG5ld3VzZXJwYXNzd29yZDogYW55O1xyXG4gICAgdXJsX2lucHV0IDogYW55O1xyXG4gICAgdXBsb2FkZWRfZmlsZTogYW55O1xyXG5cclxuICAgIC8vYnV0dG9uXHJcbiAgICB1cGxvYWRfcGRmX2J0bjogYW55O1xyXG4gICAgY29uZmlybV95ZXM6IGFueTtcclxuICAgIHVybHRvUERGX2J0bjogYW55O1xyXG4gICAgYnRuRXhwaXJlZE9rOiBhbnk7XHJcbiAgICBwYXNzd29yZF9hcHBseV9idG46IGFueTtcclxuXHJcbiAgICAvL21vZGFsXHJcblxyXG4gICAgLy9ESVYvc3Bhbi9sYWJlbFxyXG4gICAgZmlsZVVwbG9hZE1vZGFsX2JvZHk6IGFueTtcclxuICAgIHByZWxvYWRfZGl2OiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTsgICAgICBcclxuICAgICAgICB0aGlzLm5ld3VzZXJwYXNzd29yZCA9ICQoJyNuZXd1c2VycGFzc3dvcmQnKTtcclxuICAgICAgICB0aGlzLnVybF9pbnB1dCA9ICQoJyN1cmxfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLnVwbG9hZGVkX2ZpbGUgPSAkKCcjdXBsb2FkZWRfZmlsZScpO1xyXG5cclxuICAgICAgICAvL2J1dHRvblxyXG4gICAgICAgIHRoaXMudXBsb2FkX3BkZl9idG4gPSAkKCcjdXBsb2FkX3BkZl9idG4nKTtcclxuICAgICAgICB0aGlzLmNvbmZpcm1feWVzID0gJCgnI2NvbmZpcm1feWVzJyk7XHJcbiAgICAgICAgdGhpcy51cmx0b1BERl9idG4gPSAkKCcjdXJsdG9QREZfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5idG5FeHBpcmVkT2sgPSAkKCcjYnRuRXhwaXJlZE9rJyk7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZF9hcHBseV9idG4gPSAkKCcjcGFzc3dvcmRfYXBwbHlfYnRuJyk7XHJcblxyXG4gICAgICAgIC8vbW9kYWxcclxuXHJcblxyXG4gICAgICAgIC8vRElWL3NwYW4vbGFiZWxcclxuICAgICAgICB0aGlzLmZpbGVVcGxvYWRNb2RhbF9ib2R5ID0gJCgnI2ZpbGVVcGxvYWRNb2RhbF9ib2R5Jyk7ICAgICAgIFxyXG4gICAgICAgIHRoaXMucHJlbG9hZF9kaXYgPSAkKFwiI3ByZWxvYWRfZGl2XCIpO1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoIGV2ZW50PzpFdmVudCApOnZvaWQge1xyXG4gICAgICAgIGxldCBjb25maWcgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IG1haW4gPSB0aGlzO1xyXG5cclxuICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmRhdGEoJ2JzLm1vZGFsJywgbnVsbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1vbi5jb25maXJtYXRpb25fbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgLy8gIGxldCByZWRhY3QgPSBuZXcgUmVkYWN0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uZmlybV95ZXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OkV2ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBjb21tb24ucGFzc1BkZi52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9IGNvbmZpZy51cmxzLnNhbml0aXplLmFwcGx5O1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdTYW5pdGl6aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUylcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFpbi5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2hvd2Vycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YS5zaG93ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGluZygpOnN0cmluZ3tcclxuICAgICAgICByZXR1cm4gXCJNYWluIGNsYXNzIGNvbnN0cnVjdGVkLlwiXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9wZXJ0aWVzIGV4dGVuZHMgQmFzZSB7XHJcblxyXG4gICAgLy9idXR0b25zXHJcblx0YWRkX2N1c3RvbV9wcm9wX2J0biA6IGFueTtcclxuICAgIHNhdmVfcHJvcGVydGllc19idG4gOiBhbnk7XHJcbiAgICBleHBvcnRfbWV0YV9idG4gICAgIDogYW55O1xyXG4gICAgaW1wb3J0X21ldGFfYnRuICAgICA6IGFueTtcclxuICAgIGRlbF9jdXN0X3Byb3BfYnRuICAgOiBhbnk7XHJcblxyXG4gICAgLy9kaXZzXHJcbiAgICBjdXN0b21fcHJvcF9kaXYgICAgICA6IGFueTtcclxuICAgIG1haW5fcHJvcGVydGllc19ib2R5IDogYW55O1xyXG5cclxuICAgIC8vaW5wdXRzXHJcbiAgICBjdXN0b21lX3Byb3BfbmFtZSAgIDogYW55O1xyXG4gICAgY3VzdG9tZV9wcm9wX3ZhbHVlICA6IGFueTtcclxuICAgIHRpdGxlX2lucHV0ICAgICAgICAgOiBhbnk7XHJcbiAgICBhdXRob3JfaW5wdXQgICAgICAgIDogYW55O1xyXG4gICAgc3ViamVjdF9pbnB1dCAgICAgICA6IGFueTtcclxuICAgIGtleXdvcmRzX2lucHV0ICAgICAgOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5hZGRfY3VzdG9tX3Byb3BfYnRuID0gJCgnI2FkZF9jdXN0b21fcHJvcF9idG4nKTtcclxuICAgICAgICB0aGlzLnNhdmVfcHJvcGVydGllc19idG4gPSAkKCcjc2F2ZV9wcm9wZXJ0aWVzX2J0bicpO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0X21ldGFfYnRuICAgICA9ICQoJyNleHBvcnRfbWV0YV9idG4nKTtcclxuICAgICAgICB0aGlzLmltcG9ydF9tZXRhX2J0biAgICAgPSAkKCcjaW1wb3J0X21ldGFfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5kZWxfY3VzdF9wcm9wX2J0biA9ICQoJy5idG4gb3JhbmdlIGRhcmtlbi0yIGRlbCcpO1xyXG4gICAgICAgIGxldCBkaXZzOmFueSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idG4gb3JhbmdlIGRhcmtlbi0yIGRlbCcpO1xyXG5cclxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZGl2cywgZnVuY3Rpb24gKGRpdjphbnkpIHtcclxuICAgICAgICAgICAgLy8gZG8gd2hhdGV2ZXJcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGl2KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9kaXZzXHJcbiAgICAgICAgdGhpcy5jdXN0b21fcHJvcF9kaXYgICAgICA9ICQoJyNjdXN0b21fcHJvcF9kaXYnKTtcclxuICAgICAgICB0aGlzLm1haW5fcHJvcGVydGllc19ib2R5ID0gJCgnI21haW5fcHJvcGVydGllc19ib2R5Jyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRzXHJcbiAgICAgICAgdGhpcy5jdXN0b21lX3Byb3BfbmFtZSAgPSAkKCcjY3VzdG9tZV9wcm9wX25hbWUnKTtcclxuICAgICAgICB0aGlzLmN1c3RvbWVfcHJvcF92YWx1ZSA9ICQoJyNjdXN0b21lX3Byb3BfdmFsdWUnKTtcclxuICAgICAgICB0aGlzLnRpdGxlX2lucHV0ICAgICAgICA9ICQoJyN0aXRsZV9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuYXV0aG9yX2lucHV0ICAgICAgID0gJCgnI2F1dGhvcl9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuc3ViamVjdF9pbnB1dCAgICAgID0gJCgnI3N1YmplY3RfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmtleXdvcmRzX2lucHV0ICAgICA9ICQoJyNrZXl3b3Jkc19pbnB1dCcpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1vbiAgICAgID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyAgICAgID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgID0gdGhpcztcclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5hZGRfY3VzdG9tX3Byb3BfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHByb3BlcnRpZXMuY3VzdG9tZV9wcm9wX25hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogcHJvcGVydGllcy5jdXN0b21lX3Byb3BfdmFsdWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMuYWRkO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdBZGRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VzdG9tX3Byb3BfZGl2Lmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5zYXZlX3Byb3BlcnRpZXNfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnJlaW5pdElucHV0cygpO1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBUaXRsZTogcHJvcGVydGllcy50aXRsZV9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIEF1dGhvcjogcHJvcGVydGllcy5hdXRob3JfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBTdWJqZWN0OiBwcm9wZXJ0aWVzLnN1YmplY3RfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBLZXl3b3JkczogcHJvcGVydGllcy5rZXl3b3Jkc19pbnB1dC52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMucHJvcGVydGllcy5zYXZlO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ1NhdmluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5tYWluX3Byb3BlcnRpZXNfYm9keS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHByb3BlcnRpZXMuZXhwb3J0X21ldGFfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnJlaW5pdElucHV0cygpO1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBUaXRsZTogcHJvcGVydGllcy50aXRsZV9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIEF1dGhvcjogcHJvcGVydGllcy5hdXRob3JfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBTdWJqZWN0OiBwcm9wZXJ0aWVzLnN1YmplY3RfaW5wdXQudmFsKCksXHJcbiAgICAgICAgICAgICAgICBLZXl3b3JkczogcHJvcGVydGllcy5rZXl3b3Jkc19pbnB1dC52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMucHJvcGVydGllcy5leHBvcnQ7XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnRXhwb3J0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ01ldGFkYXRhIGV4cG90ZWQgc3VjY2Vzc2Z1bGx5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5kZWxfY3VzdF9wcm9wX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbihlOkV2ZW50KXtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSAkKHRoaXMpLmRhdGEoJ3Byb3AnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocHJvcCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGVDdXN0b21Qcm9wZXJ0eShwcm9wOmFueSk6dm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gICAgICA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWcgICAgICA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBwcm9wZXJ0aWVzICA9IHRoaXM7XHJcblxyXG4gICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICBuYW1lOiBwcm9wXHJcblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLnByb3BlcnRpZXMuZGVsZXRlO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0RlbGV0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5jdXN0b21fcHJvcF9kaXYuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVpbml0SW5wdXRzKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy50aXRsZV9pbnB1dCAgICA9ICQoJyN0aXRsZV9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuYXV0aG9yX2lucHV0ICAgPSAkKCcjYXV0aG9yX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5zdWJqZWN0X2lucHV0ICA9ICQoJyNzdWJqZWN0X2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5rZXl3b3Jkc19pbnB1dCA9ICQoJyNrZXl3b3Jkc19pbnB1dCcpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IENvbW1vbiB9IGZyb20gXCIuL0NvbW1vblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlZGFjdCBleHRlbmRzIEJhc2Uge1xyXG5cclxuICAgIC8vQ2xhc3Nlc1xyXG4gICAgY29uZmlnIDogQ29uZmlnO1xyXG4gICAgY29tbW9uIDogQ29tbW9uO1xyXG5cclxuICAgIC8vYnV0dG9uc1xyXG5cdHJlZGFjdF9hcHBseV9idG4gOiBhbnk7XHJcblxyXG4gICAgLy9pbnB1dHMgXHJcbiAgICByX3gxIDogYW55O1xyXG4gICAgcl95MSA6IGFueTtcclxuICAgIHJfeDIgOiBhbnk7XHJcbiAgICByX3kyIDogYW55O1xyXG4gICAgcl9wYWdlIDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5yZWRhY3RfYXBwbHlfYnRuID0gJCgnI3JlZGFjdF9hcHBseV9idG4nKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dHNcclxuICAgICAgICB0aGlzLnJfeDEgPSAkKFwiI3JfeDFcIik7XHJcbiAgICAgICAgdGhpcy5yX3kxID0gJChcIiNyX3kxXCIpO1xyXG4gICAgICAgIHRoaXMucl94MiA9ICQoXCIjcl94MlwiKTtcclxuICAgICAgICB0aGlzLnJfeTIgPSAkKFwiI3JfeTJcIik7XHJcbiAgICAgICAgdGhpcy5yX3BhZ2UgPSAkKFwiI3JfcGFnZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IHJlZGFjdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJlZGFjdC5yZWRhY3RfYXBwbHlfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcbiAgICAgICAgICAgIHZhciB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgbmV3dXNlcnBhc3N3b3JkOiBjb21tb24ubmV3dXNlcnBhc3N3b3JkLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHgxOiByZWRhY3Qucl94MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5MTogcmVkYWN0LnJfeTEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDI6IHJlZGFjdC5yX3gyLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHkyOiByZWRhY3Qucl95Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBwYWdlOiByZWRhY3Qucl9wYWdlLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtc2cgPSByZWRhY3QudmFsaWRhdGUodmlld19tb2RlbCk7XHJcbiAgICAgICAgICAgIGlmIChtc2cgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGNvbmZpZy51cmxzLnJlZGFjdC5hZGQ7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnUmVkYWN0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uc2Vzc2lvbl9leHBpcmVkX21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWRhY3QucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2hvd2Vycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5kYW5nZXIoJ0V4Y2VwdGlvbiEsIG91ciBkZXZlbG9wbWVudCB0ZWFtIHdpbGwgbG9vayBpbnRvIHRoaXMgaXNzdWUuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobXNnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlIChtb2RlbDphbnkpOnN0cmluZyB7XHJcbiAgICAgXHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIGlmIChtb2RlbC54MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLnkxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueDIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwueTIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwucGFnZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJQYWdlIG51bWJlciBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTnVtYmVyKG1vZGVsLnBhZ2UpIDw9IDApIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIkVudGVyIGEgcG9zaXRpdmUgbnVtYmVyIGZvciBwYWdlLjxicj5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YW1wIGV4dGVuZHMgQmFzZSB7XHJcblxyXG4gICAgLy9idXR0b25zXHJcblx0YWRkX3N0YW1wX2J0biA9ICQoJyNhZGRfc3RhbXBfYnRuJyk7XHJcblxyXG4gICAgLy9pbnB1dHNcclxuICAgIHNfeDEgOiBhbnk7XHJcbiAgICBzX3kxIDogYW55O1xyXG4gICAgc194MiA6IGFueTtcclxuICAgIHNfeTIgOiBhbnk7XHJcbiAgICBzX3BhZ2UgOiBhbnk7XHJcbiAgICBzdGFtcF9ub3RlIDogYW55O1xyXG4gICAgc3RhbXBfdHlwZSA6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLmFkZF9zdGFtcF9idG4gPSAkKCcjYWRkX3N0YW1wX2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMuc194MSA9ICQoXCIjc194MVwiKTtcclxuICAgICAgICB0aGlzLnNfeTEgPSAkKFwiI3NfeTFcIik7XHJcbiAgICAgICAgdGhpcy5zX3gyID0gJChcIiNzX3gyXCIpO1xyXG4gICAgICAgIHRoaXMuc195MiA9ICQoXCIjc195MlwiKTtcclxuICAgICAgICB0aGlzLnNfcGFnZSA9ICQoXCIjc19wYWdlXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhbXBfbm90ZSA9ICQoXCIjc3RhbXBfbm90ZVwiKTtcclxuICAgICAgICB0aGlzLnN0YW1wX3R5cGUgPSAkKFwiI3N0YW1wX3R5cGVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCBzdGFtcCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHN0YW1wLmFkZF9zdGFtcF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBuZXd1c2VycGFzc3dvcmQ6IGNvbW1vbi5uZXd1c2VycGFzc3dvcmQudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDE6IHN0YW1wLnNfeDEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTE6IHN0YW1wLnNfeTEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeDI6IHN0YW1wLnNfeDIudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTI6IHN0YW1wLnNfeTIudmFsKClcclxuICAgICAgICAgICAgICAgICwgcGFnZXM6IHN0YW1wLnNfcGFnZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHR5cGU6ICQoXCIjc3RhbXBfdHlwZVwiKS5maW5kKFwiOnNlbGVjdGVkXCIpLnRleHQoKVxyXG4gICAgICAgICAgICAgICAgLCB0eXBlVmFsdWU6ICQoXCIjc3RhbXBfdHlwZVwiKS5maW5kKFwiOnNlbGVjdGVkXCIpLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIG5vdGU6IHN0YW1wLnN0YW1wX25vdGUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IG1zZyA9IHN0YW1wLnZhbGlkYXRlKHZpZXdfbW9kZWwpO1xyXG4gICAgICAgICAgICBpZiAobXNnID09IFwiXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gY29uZmlnLnVybHMuc3RhbXAuYWRkO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0FkZGluZyBzdGFtcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW1wLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YS5zaG93ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwob2JqUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGUobW9kZWw6YW55KTpzdHJpbmcge1xyXG4gICAgICAgXHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIGlmIChtb2RlbC54MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLnkxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueDIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwueTIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTIgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwucGFnZXMgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiTnVtYmVyIG9mIHBhZ2VzIHRvIGFwcGx5IHRoZSBzdGFtcCBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwudHlwZVZhbHVlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlN0YW1wIHR5cGUgaXMgcmVxdWlyZWQuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcblxyXG5cclxufSIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBDb21tb24gfSBmcm9tIFwiLi9Db21tb25cIjtcclxuaW1wb3J0IHtCYXNlfSBmcm9tIFwiLi9CYXNlXCI7XHJcbmltcG9ydCB7IERpZ2l0YWxTaWduYXR1cmUgfSBmcm9tIFwiLi9EaWdpdGFsU2lnbmF0dXJlXCI7XHJcbmltcG9ydCB7IFJlZGFjdCB9IGZyb20gXCIuL1JlZGFjdFwiO1xyXG5pbXBvcnQgeyBTdGFtcCB9IGZyb20gXCIuL1N0YW1wXCI7XHJcbmltcG9ydCB7IEJhcmNvZGUgfSBmcm9tIFwiLi9CYXJjb2RlXCI7XHJcbmltcG9ydCB7IFByb3BlcnRpZXMgfSBmcm9tIFwiLi9Qcm9wZXJ0aWVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ya0JlbmNoIGV4dGVuZHMgQmFzZXtcclxuXHJcbiAgICAvL2NsYXNzZXNcclxuICAgIHByb3BlcnRpZXM6IFByb3BlcnRpZXM7XHJcbiAgICBiYXJjb2RlIDogQmFyY29kZTtcclxuICAgIHN0YW1wIDogU3RhbXA7XHJcbiAgICByZWRhY3QgOiBSZWRhY3Q7XHJcbiAgICBkaWdpdGFsU2lnbmF0dXJlOiBEaWdpdGFsU2lnbmF0dXJlO1xyXG4gICAgY29uZmlnOiBDb25maWc7XHJcbiAgICBjb21tb246IENvbW1vbjtcclxuXHJcbiAgICAvL2J1dHRvbnNcclxuICAgIHJlc2V0X2J0biA6IGFueTtcclxuICAgIGRlbGV0ZV9idG46IGFueTtcclxuICAgIGVtYWlsX2J0bjogYW55O1xyXG4gICAgc2VuZF9lbWFpbF9idG46IGFueTtcclxuICAgIHJlc3RvcmVfYnRuOiBhbnk7XHJcbiAgICBzYW5pdGl6ZV9idG46IGFueTtcclxuICAgIHByb3BlcnR5X2J0bjogYW55O1xyXG5cclxuICAgIC8vaW5wdXRzXHJcbiAgICB5b3VyX2VtYWlsOiBhbnk7XHJcbiAgICB5b3VyX3N1YmplY3Q6IGFueTtcclxuICAgIHlvdXJfbWVzc2FnZTogYW55O1xyXG5cclxuICAgIC8vbW9kYWxzXHJcbiAgICBkaWdpdGFsX3NpZ25hdHVyZV9tb2RhbDogYW55O1xyXG4gICAgc3RhbXBfbW9kYWw6IGFueTtcclxuICAgIGJhcmNvZGVfbW9kYWw6IGFueTtcclxuICAgIHJlZGFjdF9tb2RhbDogYW55O1xyXG4gICAgcHJvcGVydHlfbW9kYWw6IGFueTtcclxuICAgIGVtYWlsX21vZGFsOiBhbnk7XHJcblxyXG4gICAgLy9vdGhlci9ESVZcclxuICAgIHByb3BlcnR5X21vZGFsX2JvZHk6IGFueTtcclxuICAgIGF0dGFjaGVkX2ZpbGVOYW1lOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vYnV0dG9uc1xyXG4gICAgICAgIHRoaXMucmVzZXRfYnRuID0gJCgnI3Jlc2V0X2J0bicpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlX2J0biA9ICQoJyNkZWxldGVfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5lbWFpbF9idG4gPSAkKCcjZW1haWxfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5zZW5kX2VtYWlsX2J0biA9ICQoJyNzZW5kX2VtYWlsX2J0bicpO1xyXG4gICAgICAgIHRoaXMucmVzdG9yZV9idG4gPSAkKCcjcmVzdG9yZV9idG4nKTtcclxuICAgICAgICB0aGlzLnNhbml0aXplX2J0biA9ICQoJyNzYW5pdGl6ZV9idG4nKTtcclxuICAgICAgICB0aGlzLnByb3BlcnR5X2J0biA9ICQoJyNwcm9wZXJ0eV9idG4nKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dHNcclxuICAgICAgICB0aGlzLnlvdXJfZW1haWwgPSAkKCcjeW91cl9lbWFpbCcpO1xyXG4gICAgICAgIHRoaXMueW91cl9zdWJqZWN0ID0gJCgnI3lvdXJfc3ViamVjdCcpO1xyXG4gICAgICAgIHRoaXMueW91cl9tZXNzYWdlID0gJCgnI3lvdXJfbWVzc2FnZScpO1xyXG5cclxuICAgICAgICAvL21vZGFsc1xyXG4gICAgICAgIHRoaXMuZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwgPSAkKCcjZGlnaXRhbF9zaWduYXR1cmVfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnN0YW1wX21vZGFsID0gJCgnI3N0YW1wX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5iYXJjb2RlX21vZGFsID0gJCgnI2JhcmNvZGVfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnJlZGFjdF9tb2RhbCA9ICQoJyNyZWRhY3RfbW9kYWwnKTtcclxuICAgICAgICB0aGlzLnByb3BlcnR5X21vZGFsID0gJCgnI3Byb3BlcnR5X21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5lbWFpbF9tb2RhbCA9ICQoJyNlbWFpbF9tb2RhbCcpO1xyXG5cclxuICAgICAgICAvL290aGVyL0RJVlxyXG4gICAgICAgIHRoaXMucHJvcGVydHlfbW9kYWxfYm9keSA9ICQoJyNwcm9wZXJ0eV9tb2RhbF9ib2R5Jyk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hlZF9maWxlTmFtZSA9ICQoJyNhdHRhY2hlZF9maWxlTmFtZScpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCB3b3JrYmVuY2ggPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmRpZ2l0YWxfc2lnbmF0dXJlX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLmRpZ2l0YWxTaWduYXR1cmUgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICB3b3JrYmVuY2guZGlnaXRhbFNpZ25hdHVyZSA9IG5ldyBEaWdpdGFsU2lnbmF0dXJlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJlZGFjdF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdvcmtiZW5jaC5yZWRhY3QgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICB3b3JrYmVuY2gucmVkYWN0ID0gbmV3IFJlZGFjdCgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFtcF9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdvcmtiZW5jaC5zdGFtcCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5zdGFtcCA9IG5ldyBTdGFtcCgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5iYXJjb2RlX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd29ya2JlbmNoLmJhcmNvZGUgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICB3b3JrYmVuY2guYmFyY29kZSA9IG5ldyBCYXJjb2RlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRlbGV0ZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMudmlld2VyLmRlbGV0ZTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0RlbGV0aW5nIHRoZSBmaWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2F0aW9uLmhyZWYgPSBjb25maWcudXJscy5yb290LnBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVzdG9yZV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy52aWV3ZXIucmVzdG9yZTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ1Jlc3RvcmluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5lbWFpbF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3b3JrYmVuY2guYXR0YWNoZWRfZmlsZU5hbWUuaHRtbChjb21tb24uZmlsZU5hbWUudmFsKCkpO1xyXG4gICAgICAgICAgICB3b3JrYmVuY2guZW1haWxfbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2VuZF9lbWFpbF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgbWFpbHRvOiB3b3JrYmVuY2gueW91cl9lbWFpbC52YWwoKSxcclxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IHdvcmtiZW5jaC55b3VyX3N1YmplY3QudmFsKCksXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB3b3JrYmVuY2gueW91cl9tZXNzYWdlLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMudmlld2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5lbWFpbF9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnRW1haWxpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5pbmZvKCdFbWFpbCBoYXMgYmVlbiBzZW50LicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLmVtYWlsX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdVbmFibGUgdG8gc2VuZCB0aGUgZW1haWwuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2FuaXRpemVfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDogRXZlbnQpIHtcclxuICAgICAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl90ZXh0Lmh0bWwoJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBTYW5pdGl6ZSB0aGUgUERGPycpO1xyXG4gICAgICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnByb3BlcnR5X2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6IEV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogY29tbW9uLnBhc3NQZGYudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLmluZGV4O1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnTG9hZGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLnByb3BlcnR5X21vZGFsX2JvZHkuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydHlfbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHdvcmtiZW5jaC5wcm9wZXJ0aWVzID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJvcGVydGllcyA9IG5ldyBQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aGlzLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChzdHJFcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiV29ya0JlbmNoIGNsYXNzIGNvbnN0cnVjdGVkLlwiXHJcbiAgICB9XHJcbn0iXX0=
