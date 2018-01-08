(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var Main_1 = require("./Main");
var WorkBench_1 = require("./WorkBench");
var confirmation_text;
var globale_scope;
function start(path) {
    var gl = {};
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
            gl = { 'workbench': workBenchStart() };
            break;
        }
        default:
            break;
    }
    elt2.html("Hello Shirak Avakian");
    return gl;
}
function workBenchStart() {
    var workbench = new WorkBench_1.WorkBench();
    return workbench;
}
$(document).ready(function () {
    globale_scope = start(window.location.pathname);
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
        _this.del_cust_prop_btn = $('#del_cust_prop_btn');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy90cy9BcHBsaWNhdGlvbi50cyIsImluY2x1ZGVzL3RzL0JhcmNvZGUudHMiLCJpbmNsdWRlcy90cy9CYXNlLnRzIiwiaW5jbHVkZXMvdHMvQ29tbW9uLnRzIiwiaW5jbHVkZXMvdHMvQ29uZmlnLnRzIiwiaW5jbHVkZXMvdHMvRGlnaXRhbFNpZ25hdHVyZS50cyIsImluY2x1ZGVzL3RzL01haW4udHMiLCJpbmNsdWRlcy90cy9Qcm9wZXJ0aWVzLnRzIiwiaW5jbHVkZXMvdHMvUmVkYWN0LnRzIiwiaW5jbHVkZXMvdHMvU3RhbXAudHMiLCJpbmNsdWRlcy90cy9Xb3JrQmVuY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLG1DQUFrQztBQUNsQywrQkFBZ0M7QUFDaEMseUNBQXdDO0FBR3hDLElBQUksaUJBQXNCLENBQUM7QUFDM0IsSUFBSSxhQUFpQixDQUFDO0FBRXRCLGVBQWUsSUFBVztJQUN0QixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDWixJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztJQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO0lBQ3RCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN0RSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQixPQUFP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QUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBRXZDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sU0FBUyxDQUFDLFVBQVUsSUFBSSxXQUFXLENBQUM7d0JBQzNDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7Z0JBQ2hELENBQUM7Z0JBQ0QsS0FBSyxFQUFFLFVBQVUsVUFBVSxFQUFFLFFBQVE7b0JBQ2pDLFVBQVUsQ0FBQyxjQUFjLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNwRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN0QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUNELEtBQUssRUFBRSxJQUFJO2FBQ2QsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFTSx3QkFBSSxHQUFYO1FBQ0ksTUFBTSxDQUFDLDhCQUE4QixDQUFBO0lBQ3pDLENBQUM7SUFDTCxnQkFBQztBQUFELENBNVJBLEFBNFJDLENBNVI4QixXQUFJLEdBNFJsQztBQTVSWSw4QkFBUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgTWFpbiB9ICAgZnJvbSBcIi4vTWFpblwiO1xyXG5pbXBvcnQgeyBXb3JrQmVuY2ggfSBmcm9tIFwiLi9Xb3JrQmVuY2hcIjtcclxuXHJcblxyXG5sZXQgY29uZmlybWF0aW9uX3RleHQ6IGFueTtcclxubGV0IGdsb2JhbGVfc2NvcGU6YW55O1xyXG5cclxuZnVuY3Rpb24gc3RhcnQocGF0aDpzdHJpbmcpIHtcclxuICAgIGxldCBnbCA9IHt9O1xyXG4gICAgY29uc3QgZWx0MiA9ICQoXCIjZ3JlZXRpbmdcIik7XHJcbiAgICBsZXQgY2ZnID0gbmV3IENvbmZpZygpO1xyXG4gICAgbGV0IG1haW4gPSBuZXcgTWFpbigpO1xyXG4gICAgbGV0IGV2ZW50TmFtZSA9IG1haW4uZ2V0UGFyYW1ldGVyQnlOYW1lKFwiZXZlbnRcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXHJcbiAgICBjb25zb2xlLmxvZyhjZmcudXJscy5tYWluLmluZGV4KTtcclxuICAgIGNvbnNvbGUubG9nKG1haW4ucGluZygpKTtcclxuICAgIGNvbnNvbGUubG9nKHBhdGgpO1xyXG4gICAgY29uc29sZS5sb2coZXZlbnROYW1lKTtcclxuICAgIHN3aXRjaCAoZXZlbnROYW1lKSB7XHJcbiAgICAgICAgY2FzZSAndmlld2VyLndvcmtiZW5jaCc6e1xyXG4gICAgICAgICAgICBnbCA9IHsnd29ya2JlbmNoJzogd29ya0JlbmNoU3RhcnQoKX07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICBcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGVsdDIuaHRtbChcIkhlbGxvIFNoaXJhayBBdmFraWFuXCIpO1xyXG5cclxuICAgIHJldHVybiBnbDtcclxufVxyXG5cclxuZnVuY3Rpb24gd29ya0JlbmNoU3RhcnQoKSB7XHJcbiAgICBsZXQgd29ya2JlbmNoID0gbmV3IFdvcmtCZW5jaCgpO1xyXG4gICByZXR1cm4gd29ya2JlbmNoO1xyXG59XHJcblxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBnbG9iYWxlX3Njb3BlID0gIHN0YXJ0KHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7XHJcbiAgICBjb25zb2xlLmxvZyhnbG9iYWxlX3Njb3BlLndvcmtiZW5jaCk7XHJcbn0pO1xyXG4vKlxyXG4kKGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGFjdGl2YXRlIGFsbCBkcm9wIGRvd25zXHJcbiAgICAkKCcuZHJvcGRvd24tdG9nZ2xlJykuZHJvcGRvd24oKTtcclxuICAgIC8vIFRvb2x0aXBzXHJcbiAgICAkKFwiW3JlbD10b29sdGlwXVwiKS50b29sdGlwKCk7XHJcbn0pO1xyXG4qL1xyXG4vKlxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJChcIi5idXR0b24tY29sbGFwc2VcIikuc2lkZU5hdigpO1xyXG4gICAgYXBwbGljYXRpb24gPSB0aGlzO1xyXG5cclxuICAgIGlmICghYXBwbGljYXRpb24ubWFpbilcclxuICAgICAgICBhcHBsaWNhdGlvbi5tYWluID0gbmV3IE1haW4oKTtcclxuXHJcbiAgICBcclxuICAgICQoJy5wb3BvdmVyLWRpc21pc3MnKS5wb3BvdmVyKHtcclxuICAgICAgICB0cmlnZ2VyOiAnZm9jdXMnXHJcbiAgICB9KVxyXG5cclxufSk7Ki8iLCJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vQmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhcmNvZGUgZXh0ZW5kcyBCYXNlIHtcclxuXHJcbiAgICAvL2J1dHRvbnNcclxuICAgIGFkZF9iYXJjb2RlX2J0biA6IGFueTtcclxuXHJcbiAgICAvL2lucHV0c1xyXG4gICAgYl9wYWdlIDogYW55O1xyXG4gICAgdGV4dFRvRW5jb2RlIDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vYnV0dG9uc1xyXG4gICAgICAgIHRoaXMuYWRkX2JhcmNvZGVfYnRuID0gJCgnI2FkZF9iYXJjb2RlX2J0bicpO1xyXG5cclxuICAgICAgICAvL2lucHV0c1xyXG4gICAgICAgIHRoaXMuYl9wYWdlID0gJChcIiNiX3BhZ2VcIik7XHJcbiAgICAgICAgdGhpcy50ZXh0VG9FbmNvZGUgPSAkKFwiI3RleHRUb0VuY29kZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBjb21tb24gPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IGJhcmNvZGUgPSB0aGlzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGJhcmNvZGUuYWRkX2JhcmNvZGVfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlOkV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiBiYXJjb2RlLmJfcGFnZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHRleHRUb0VuY29kZTogYmFyY29kZS50ZXh0VG9FbmNvZGUudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtc2cgPSBiYXJjb2RlLnZhbGlkYXRlKHZpZXdfbW9kZWwpO1xyXG4gICAgICAgICAgICBpZiAobXNnID09IFwiXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMuYmFyY29kZS5hZGQ7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnQWRkaW5nIEJhcmNvZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5zZXNzaW9uX2V4cGlyZWRfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5GSUxFTkFNRTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzIHx8IGRhdGEuU1VDQ0VTUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhcmNvZGUucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2hvd2Vycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKHN0ckVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobXNnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlKG1vZGVsOmFueSk6c3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIGlmIChtb2RlbC50ZXh0VG9FbmNvZGUgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiVGV4dCBUbyBFbmNvZGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnBhZ2VzID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIk51bWJlciBvZiBwYWdlcyB0byBhcHBseSB0aGUgYmFyY29kZSBpcyByZXF1aXJlZC48YnI+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbW1vbiB9IGZyb20gXCIuL0NvbW1vblwiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0ICogYXMgdG9hc3RyIGZyb20gXCJ0b2FzdHJcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlIHtcclxuICAgIGNvbmZpZzpDb25maWc7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBsZXQgYmFzZSA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBuZXcgQ29uZmlnKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZXZpZXcoZmlsZU5hbWU6IHN0cmluZywgaXN0ZW1wOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHVybCA9IHRoaXMuY29uZmlnLnVybHMudmlld2VyLnByZXZpZXcgKyBcIiZmaWxlTmFtZT1cIiArIGZpbGVOYW1lICsgJyZpc3RlbXA9JyArIGlzdGVtcDtcclxuICAgICAgICB0aGlzLmdldENvbW1vbigpLnBkZl9pZnJhbWUuYXR0cihcInNyY1wiLCB1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb25maWcoKTpDb25maWd7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb21tb24oKTpDb21tb257XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb21tb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UGFyYW1ldGVyQnlOYW1lKG5hbWU6c3RyaW5nLCB1cmw6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICBsZXQgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgbmFtZSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksXHJcbiAgICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICghcmVzdWx0c1syXSkgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb21tb24ge1xyXG5cclxuICAgIC8vdGV4dFxyXG4gICAgY29uZmlybWF0aW9uX3RleHQ6IGFueTtcclxuICAgIGFjdGlvbl9sYWJlbDogYW55O1xyXG4gICAgZXJyb3JNb2RhbE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgICAvL2lucHV0XHJcbiAgICBmaWxlTmFtZTogYW55O1xyXG4gICAgcGFzc1BkZjogYW55O1xyXG4gICAgbmV3dXNlcnBhc3N3b3JkOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbFxyXG4gICAgY29uZmlybWF0aW9uX21vZGFsOiBhbnk7XHJcbiAgICBsb2FkaW5nX21vZGFsOiBhbnk7XHJcbiAgICBlcnJvck1vZGFsRGFuZ2VyOiBhbnk7XHJcbiAgICBzZXNzaW9uX2V4cGlyZWRfbW9kYWw6IGFueTtcclxuXHJcbiAgICAvL090aGVyXHJcbiAgICBwZGZfaWZyYW1lOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7ICAgICAgIFxyXG4gICAgICAgIC8vdGV4dFxyXG4gICAgICAgIHRoaXMuY29uZmlybWF0aW9uX3RleHQgID0gJCgnI2NvbmZpcm1hdGlvbl90ZXh0Jyk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25fbGFiZWwgICAgICAgPSAkKFwiI2FjdGlvbl9sYWJlbFwiKTtcclxuICAgICAgICB0aGlzLmVycm9yTW9kYWxNZXNzYWdlICA9ICQoJyNlcnJvck1vZGFsTWVzc2FnZScpO1xyXG5cclxuICAgICAgICAvL21vZGFsXHJcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb25fbW9kYWwgICAgID0gJCgnI2NvbmZpcm1hdGlvbl9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMubG9hZGluZ19tb2RhbCAgICAgICAgICA9ICQoJyNsb2FkaW5nX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5lcnJvck1vZGFsRGFuZ2VyICAgICAgID0gJCgnI2Vycm9yTW9kYWxEYW5nZXInKTtcclxuICAgICAgICB0aGlzLnNlc3Npb25fZXhwaXJlZF9tb2RhbCAgPSAkKCcjc2Vzc2lvbl9leHBpcmVkX21vZGFsJyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRcclxuICAgICAgICB0aGlzLmZpbGVOYW1lID0gJCgnI2ZpbGVOYW1lJyk7XHJcbiAgICAgICAgdGhpcy5wYXNzUGRmICA9ICQoJyNwYXNzUGRmJyk7XHJcbiAgICAgICAgdGhpcy5uZXd1c2VycGFzc3dvcmQgPSAkKCcjbmV3dXNlcnBhc3N3b3JkJyk7XHJcblxyXG4gICAgICAgIC8vb3RoZXJcclxuICAgICAgICB0aGlzLnBkZl9pZnJhbWUgPSAkKCcjcGRmX2lmcmFtZScpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgdGhlQWN0dWFsU2VydmVyOiBzdHJpbmc7XHJcbiAgICBwcm90b2NvbDogc3RyaW5nO1xyXG4gICAgYXBwRm9sZGVyOiBzdHJpbmc7XHJcbiAgICBDR0lTY3JpcHROYW1lIDogc3RyaW5nO1xyXG4gICAgdXJsczogTXlVcmxzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudGhlQWN0dWFsU2VydmVyID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICAgICAgdGhpcy5wcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcclxuICAgICAgICB0aGlzLmFwcEZvbGRlciA9IFwiL1wiOyAgXHJcbiAgICAgICAgdGhpcy5DR0lTY3JpcHROYW1lID0gXCJcIjtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5wcm90b2NvbCArIFwiLy9cIiArIHRoaXMudGhlQWN0dWFsU2VydmVyICsgdGhpcy5hcHBGb2xkZXIgKyB0aGlzLkNHSVNjcmlwdE5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cmxzID0gbmV3IE15VXJscyggcGF0aCApO1xyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG59IFxyXG5cclxuY2xhc3MgTXlVcmxze1xyXG5cclxuICAgIG1haW46IE1haW47XHJcbiAgICBkaWdpdGFsc2lnbmF0dXJlOiBEaWdpdGFsc2lnbmF0dXJlO1xyXG4gICAgc3RhbXA6IFN0YW1wO1xyXG4gICAgc2FuaXRpemU6IFNhbml0aXplO1xyXG4gICAgcmVkYWN0OiBSZWRhY3Q7XHJcbiAgICBiYXJjb2RlOiBCYXJjb2RlO1xyXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcclxuICAgIHZpZXdlcjogVmlld2VyO1xyXG4gICAgcm9vdDogUm9vdDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMubWFpbiA9IG5ldyBNYWluKF9wKTtcclxuICAgICAgICB0aGlzLmRpZ2l0YWxzaWduYXR1cmUgPSBuZXcgRGlnaXRhbHNpZ25hdHVyZShfcCk7XHJcbiAgICAgICAgdGhpcy5zdGFtcCA9IG5ldyBTdGFtcChfcCk7XHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZSA9IG5ldyBTYW5pdGl6ZShfcCk7XHJcbiAgICAgICAgdGhpcy5yZWRhY3QgPSBuZXcgUmVkYWN0KF9wKTtcclxuICAgICAgICB0aGlzLmJhcmNvZGUgPSBuZXcgQmFyY29kZShfcCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoX3ApO1xyXG4gICAgICAgIHRoaXMudmlld2VyID0gbmV3IFZpZXdlcihfcCk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gbmV3IFJvb3QoX3ApO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbi8vRGlnaXRhbCBTaWduYXR1cmUgSGFuZGxlclxyXG5jbGFzcyBNYWluIHtcclxuICAgIGluZGV4OiBzdHJpbmc7XHJcbiAgICB1cGxvYWRGaWxlczogc3RyaW5nO1xyXG4gICAgcmVhZE1ldGFkYXRhOiBzdHJpbmc7XHJcbiAgICBwaW5nOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmluZGV4ID0gX3BhdGggKyBcIj9ldmVudD1tYWluLmluZGV4XCI7XHJcbiAgICAgICAgdGhpcy51cGxvYWRGaWxlcyA9IF9wYXRoICsgXCI/ZXZlbnQ9bWFpbi51cGxvYWRGaWxlc1wiO1xyXG4gICAgICAgIHRoaXMucmVhZE1ldGFkYXRhID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnJlYWRNZXRhZGF0YVwiO1xyXG4gICAgICAgIHRoaXMucGluZyA9IF9wYXRoICsgXCI/ZXZlbnQ9bWFpbi5waW5nXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERpZ2l0YWxzaWduYXR1cmUge1xyXG4gICAgYWRkRmllbGQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFkZEZpZWxkID0gX3BhdGggKyBcIj9ldmVudD1kaWdpdGFsc2lnbmF0dXJlLmFkZEZpZWxkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFN0YW1wIHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudD1zdGFtcC5hZGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU2FuaXRpemV7XHJcbiAgICBhcHBseSA6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hcHBseSA9IF9wYXRoICsgXCI/ZXZlbnQ9c2FuaXRpemUuYXBwbHlcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVkYWN0IHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudD1yZWRhY3QuYWRkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEJhcmNvZGUge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PWJhcmNvZGUuYWRkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb3BlcnRpZXMgIHtcclxuICAgIGluZGV4OiBzdHJpbmc7XHJcbiAgICBhZGQ6IHN0cmluZzsgXHJcbiAgICBkZWxldGU6IHN0cmluZzsgXHJcbiAgICBzYXZlOiBzdHJpbmc7IFxyXG4gICAgZXhwb3J0OiBzdHJpbmc7ICAgICAgICBcclxuICAgIGltcG9ydDogc3RyaW5nOyAgXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmluZGV4ICA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5pbmRleFwiO1xyXG4gICAgICAgIHRoaXMuYWRkICAgID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmFkZFwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLmRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZSAgID0gX3BhdGggKyBcIj9ldmVudD1wcm9wZXJ0aWVzLnNhdmVcIjtcclxuICAgICAgICB0aGlzLmV4cG9ydCA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5leHBvcnRcIjtcclxuICAgICAgICB0aGlzLmltcG9ydCA9IF9wYXRoICsgXCI/ZXZlbnQ9cHJvcGVydGllcy5pbXBvcnRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVmlld2VyIHtcclxuICAgIHByZXZpZXcgOiBzdHJpbmc7IFxyXG4gICAgZGVsZXRlOiBzdHJpbmc7XHJcbiAgICByZXN0b3JlOiBzdHJpbmc7XHJcbiAgICBzYXZlOiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3ICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIucHJldmlld1wiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlICAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLmRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMucmVzdG9yZSAgICA9IF9wYXRoICsgXCI/ZXZlbnQ9dmlld2VyLnJlc3RvcmVcIjtcclxuICAgICAgICB0aGlzLnNhdmUgICAgICAgPSBfcGF0aCArIFwiP2V2ZW50PXZpZXdlci5zYXZlXCI7XHJcbiAgICAgICAgdGhpcy5lbWFpbCAgICAgID0gX3BhdGggKyBcIj9ldmVudD12aWV3ZXIuZW1haWxcIjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIFJvb3Qge1xyXG4gICAgIHBhdGg6c3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpe1xyXG4gICAgICAgICB0aGlzLnBhdGggPSBfcGF0aDtcclxuICAgICB9XHJcbiB9XHJcbiIsImltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGlnaXRhbFNpZ25hdHVyZSBleHRlbmRzIEJhc2Uge1xyXG5cclxuICAgIC8vQnV0dG9uXHJcblx0YWRkX3NpZ25hdHVyZV9maWVsZF9idG4gOiBhbnk7XHJcblxyXG4gICAgZmlsZU5hbWUgOiBhbnk7XHJcbiAgICBkX3gxIDogYW55O1xyXG4gICAgZF95MSA6IGFueTtcclxuICAgIGRfeDIgOiBhbnk7XHJcbiAgICBkX3kyIDogYW55O1xyXG4gICAgcGFnZSA6IGFueTtcclxuICAgIGZpZWxkTmFtZSA6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYnV0dG9uc1xyXG4gICAgICAgIHRoaXMuYWRkX3NpZ25hdHVyZV9maWVsZF9idG4gPSAkKCcjYWRkX3NpZ25hdHVyZV9maWVsZF9idG4nKTtcclxuXHJcbiAgICAgICAgdGhpcy5kX3gxID0gJChcIiNkX3gxXCIpO1xyXG4gICAgICAgIHRoaXMuZF95MSA9ICQoXCIjZF95MVwiKTtcclxuICAgICAgICB0aGlzLmRfeDIgPSAkKFwiI2RfeDJcIik7XHJcbiAgICAgICAgdGhpcy5kX3kyID0gJChcIiNkX3kyXCIpO1xyXG4gICAgICAgIHRoaXMucGFnZSA9ICQoXCIjcGFnZVwiKTtcclxuICAgICAgICB0aGlzLmZpZWxkTmFtZSA9ICQoXCIjZmllbGROYW1lXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWcgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgZGlnaXRhbFNpZ25hdHVyZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGRpZ2l0YWxTaWduYXR1cmUuYWRkX3NpZ25hdHVyZV9maWVsZF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgbmV3dXNlcnBhc3N3b3JkOiBjb21tb24ubmV3dXNlcnBhc3N3b3JkLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHgxOiBkaWdpdGFsU2lnbmF0dXJlLmRfeDEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTE6IGRpZ2l0YWxTaWduYXR1cmUuZF95MS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4MjogZGlnaXRhbFNpZ25hdHVyZS5kX3gyLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHkyOiBkaWdpdGFsU2lnbmF0dXJlLmRfeTIudmFsKClcclxuICAgICAgICAgICAgICAgICwgcGFnZTogZGlnaXRhbFNpZ25hdHVyZS5wYWdlLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIGZpZWxkTmFtZTogZGlnaXRhbFNpZ25hdHVyZS5maWVsZE5hbWUudmFsKClcclxuICAgICAgICAgICAgICAgICwgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IG1zZyA9IGRpZ2l0YWxTaWduYXR1cmUudmFsaWRhdGUoIHZpZXdfbW9kZWwgKTtcclxuICAgICAgICAgICAgaWYgKG1zZyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gY29uZmlnLnVybHMuZGlnaXRhbHNpZ25hdHVyZS5hZGRGaWVsZDtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdBZGRpbmcgc2lnbmF0dXJlIGZpZWxkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uc2Vzc2lvbl9leHBpcmVkX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWdpdGFsU2lnbmF0dXJlLnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5pbmZvKCdTaWduYXR1cmUgZmllbGQgd2lsbCBub3Qgc2hvdyB1cCBpZiB5b3UgYXJlIHVzaW5nIENocm9tZS9GaXJlZm94L1NhZmFyaSBicm93ZXNlcnMhIGRvd25sb2FkIHRoZSBQREYgYW5kIG9wZW4gaXQgdXNpbmcgQWRvYmUgQWNyb2JhdCBSZWFkZXIuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2hvd2Vycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhLnNob3dlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5kYW5nZXIoJ0V4Y2VwdGlvbiEsIG91ciBkZXZlbG9wbWVudCB0ZWFtIHdpbGwgbG9vayBpbnRvIHRoaXMgaXNzdWUuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobXNnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlKCBtb2RlbDphbnkgKTpzdHJpbmcge1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKG1vZGVsLngxID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlgxIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZWwueTEgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWTEgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbC54MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJYMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC55MiA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJZMiBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbC5maWVsZE5hbWUgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiU2lnbmF0dXJlIGZpZWxkIG5hbWUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnBhZ2UgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiUGFnZSBudW1iZXIgaXMgcmVxdWlyZWQuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKE51bWJlcihtb2RlbC5wYWdlKSA8PSAwKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJFbnRlciBhIHBvc2l0aXZlIG51bWJlciBmb3IgcGFnZS48YnI+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcbmV4cG9ydCBjbGFzcyBNYWluIGV4dGVuZHMgQmFzZSB7XHJcbiAgIC8vIG1haW46dGhpcztcclxuICAgIGNvbmZpZzpDb25maWc7XHJcbiAgICBuZXd1c2VycGFzc3dvcmQ6IGFueTtcclxuICAgIHVybF9pbnB1dCA6IGFueTtcclxuICAgIHVwbG9hZGVkX2ZpbGU6IGFueTtcclxuXHJcbiAgICAvL2J1dHRvblxyXG4gICAgdXBsb2FkX3BkZl9idG46IGFueTtcclxuICAgIGNvbmZpcm1feWVzOiBhbnk7XHJcbiAgICB1cmx0b1BERl9idG46IGFueTtcclxuICAgIGJ0bkV4cGlyZWRPazogYW55O1xyXG4gICAgcGFzc3dvcmRfYXBwbHlfYnRuOiBhbnk7XHJcblxyXG4gICAgLy9tb2RhbFxyXG5cclxuICAgIC8vRElWL3NwYW4vbGFiZWxcclxuICAgIGZpbGVVcGxvYWRNb2RhbF9ib2R5OiBhbnk7XHJcbiAgICBwcmVsb2FkX2RpdjogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7ICAgICAgXHJcbiAgICAgICAgdGhpcy5uZXd1c2VycGFzc3dvcmQgPSAkKCcjbmV3dXNlcnBhc3N3b3JkJyk7XHJcbiAgICAgICAgdGhpcy51cmxfaW5wdXQgPSAkKCcjdXJsX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy51cGxvYWRlZF9maWxlID0gJCgnI3VwbG9hZGVkX2ZpbGUnKTtcclxuXHJcbiAgICAgICAgLy9idXR0b25cclxuICAgICAgICB0aGlzLnVwbG9hZF9wZGZfYnRuID0gJCgnI3VwbG9hZF9wZGZfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5jb25maXJtX3llcyA9ICQoJyNjb25maXJtX3llcycpO1xyXG4gICAgICAgIHRoaXMudXJsdG9QREZfYnRuID0gJCgnI3VybHRvUERGX2J0bicpO1xyXG4gICAgICAgIHRoaXMuYnRuRXhwaXJlZE9rID0gJCgnI2J0bkV4cGlyZWRPaycpO1xyXG4gICAgICAgIHRoaXMucGFzc3dvcmRfYXBwbHlfYnRuID0gJCgnI3Bhc3N3b3JkX2FwcGx5X2J0bicpO1xyXG5cclxuICAgICAgICAvL21vZGFsXHJcblxyXG5cclxuICAgICAgICAvL0RJVi9zcGFuL2xhYmVsXHJcbiAgICAgICAgdGhpcy5maWxlVXBsb2FkTW9kYWxfYm9keSA9ICQoJyNmaWxlVXBsb2FkTW9kYWxfYm9keScpOyAgICAgICBcclxuICAgICAgICB0aGlzLnByZWxvYWRfZGl2ID0gJChcIiNwcmVsb2FkX2RpdlwiKTtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKCBldmVudD86RXZlbnQgKTp2b2lkIHtcclxuICAgICAgICBsZXQgY29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBtYWluID0gdGhpcztcclxuXHJcbiAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdicy5tb2RhbCcsIG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tb24uY29uZmlybWF0aW9uX21vZGFsLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIC8vICBsZXQgcmVkYWN0ID0gbmV3IFJlZGFjdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbmZpcm1feWVzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDpFdmVudCkge1xyXG4gICAgICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBjb21tb24uZmlsZU5hbWUudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogY29tbW9uLnBhc3NQZGYudmFsKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy5zYW5pdGl6ZS5hcHBseTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnU2FuaXRpemluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW4ucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbW1vbi5jb25maXJtYXRpb25fbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpbmcoKTpzdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIFwiTWFpbiBjbGFzcyBjb25zdHJ1Y3RlZC5cIlxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvcGVydGllcyBleHRlbmRzIEJhc2Uge1xyXG5cclxuICAgIC8vYnV0dG9uc1xyXG5cdGFkZF9jdXN0b21fcHJvcF9idG4gOiBhbnk7XHJcbiAgICBzYXZlX3Byb3BlcnRpZXNfYnRuIDogYW55O1xyXG4gICAgZXhwb3J0X21ldGFfYnRuICAgICA6IGFueTtcclxuICAgIGltcG9ydF9tZXRhX2J0biAgICAgOiBhbnk7XHJcbiAgICBkZWxfY3VzdF9wcm9wX2J0biAgIDogYW55O1xyXG5cclxuICAgIC8vZGl2c1xyXG4gICAgY3VzdG9tX3Byb3BfZGl2ICAgICAgOiBhbnk7XHJcbiAgICBtYWluX3Byb3BlcnRpZXNfYm9keSA6IGFueTtcclxuXHJcbiAgICAvL2lucHV0c1xyXG4gICAgY3VzdG9tZV9wcm9wX25hbWUgICA6IGFueTtcclxuICAgIGN1c3RvbWVfcHJvcF92YWx1ZSAgOiBhbnk7XHJcbiAgICB0aXRsZV9pbnB1dCAgICAgICAgIDogYW55O1xyXG4gICAgYXV0aG9yX2lucHV0ICAgICAgICA6IGFueTtcclxuICAgIHN1YmplY3RfaW5wdXQgICAgICAgOiBhbnk7XHJcbiAgICBrZXl3b3Jkc19pbnB1dCAgICAgIDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vYnV0dG9uc1xyXG4gICAgICAgIHRoaXMuYWRkX2N1c3RvbV9wcm9wX2J0biA9ICQoJyNhZGRfY3VzdG9tX3Byb3BfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5zYXZlX3Byb3BlcnRpZXNfYnRuID0gJCgnI3NhdmVfcHJvcGVydGllc19idG4nKTtcclxuICAgICAgICB0aGlzLmV4cG9ydF9tZXRhX2J0biAgICAgPSAkKCcjZXhwb3J0X21ldGFfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5pbXBvcnRfbWV0YV9idG4gICAgID0gJCgnI2ltcG9ydF9tZXRhX2J0bicpO1xyXG4gICAgICAgIHRoaXMuZGVsX2N1c3RfcHJvcF9idG4gICA9ICQoJyNkZWxfY3VzdF9wcm9wX2J0bicpO1xyXG5cclxuICAgICAgICAvL2RpdnNcclxuICAgICAgICB0aGlzLmN1c3RvbV9wcm9wX2RpdiAgICAgID0gJCgnI2N1c3RvbV9wcm9wX2RpdicpO1xyXG4gICAgICAgIHRoaXMubWFpbl9wcm9wZXJ0aWVzX2JvZHkgPSAkKCcjbWFpbl9wcm9wZXJ0aWVzX2JvZHknKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dHNcclxuICAgICAgICB0aGlzLmN1c3RvbWVfcHJvcF9uYW1lICA9ICQoJyNjdXN0b21lX3Byb3BfbmFtZScpO1xyXG4gICAgICAgIHRoaXMuY3VzdG9tZV9wcm9wX3ZhbHVlID0gJCgnI2N1c3RvbWVfcHJvcF92YWx1ZScpO1xyXG4gICAgICAgIHRoaXMudGl0bGVfaW5wdXQgICAgICAgID0gJCgnI3RpdGxlX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5hdXRob3JfaW5wdXQgICAgICAgPSAkKCcjYXV0aG9yX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5zdWJqZWN0X2lucHV0ICAgICAgPSAkKCcjc3ViamVjdF9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMua2V5d29yZHNfaW5wdXQgICAgID0gJCgnI2tleXdvcmRzX2lucHV0Jyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uICAgICAgPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnICAgICAgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyAgPSB0aGlzO1xyXG5cclxuICAgICAgICBwcm9wZXJ0aWVzLmFkZF9jdXN0b21fcHJvcF9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogcHJvcGVydGllcy5jdXN0b21lX3Byb3BfbmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzLmN1c3RvbWVfcHJvcF92YWx1ZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMucHJvcGVydGllcy5hZGQ7XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0FkZGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5jdXN0b21fcHJvcF9kaXYuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwcm9wZXJ0aWVzLnNhdmVfcHJvcGVydGllc19idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVpbml0SW5wdXRzKCk7XHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBwcm9wZXJ0aWVzLnRpdGxlX2lucHV0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgQXV0aG9yOiBwcm9wZXJ0aWVzLmF1dGhvcl9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIFN1YmplY3Q6IHByb3BlcnRpZXMuc3ViamVjdF9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIEtleXdvcmRzOiBwcm9wZXJ0aWVzLmtleXdvcmRzX2lucHV0LnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLnNhdmU7XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5hY3Rpb25fbGFiZWwuaHRtbCgnU2F2aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLm1haW5fcHJvcGVydGllc19ib2R5Lmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5leHBvcnRfbWV0YV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6RXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVpbml0SW5wdXRzKCk7XHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBwcm9wZXJ0aWVzLnRpdGxlX2lucHV0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgQXV0aG9yOiBwcm9wZXJ0aWVzLmF1dGhvcl9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIFN1YmplY3Q6IHByb3BlcnRpZXMuc3ViamVjdF9pbnB1dC52YWwoKSxcclxuICAgICAgICAgICAgICAgIEtleXdvcmRzOiBwcm9wZXJ0aWVzLmtleXdvcmRzX2lucHV0LnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLmV4cG9ydDtcclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdFeHBvcnRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnTWV0YWRhdGEgZXhwb3RlZCBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwcm9wZXJ0aWVzLmRlbF9jdXN0X3Byb3BfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGU6RXZlbnQpe1xyXG4gICAgICAgICAgICBsZXQgcHJvcCA9ICQodGhpcykuZGF0YSgncHJvcCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9wKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlQ3VzdG9tUHJvcGVydHkocHJvcDphbnkpOnZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uICAgICAgPSBzdXBlci5nZXRDb21tb24oKTtcclxuICAgICAgICBsZXQgY29uZmlnICAgICAgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyAgPSB0aGlzO1xyXG5cclxuICAgICAgICBsZXQgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgbmFtZTogcHJvcFxyXG5cclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCB1cmwgPSBjb25maWcudXJscy5wcm9wZXJ0aWVzLmRlbGV0ZTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdEZWxldGluZycpO1xyXG4gICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VzdG9tX3Byb3BfZGl2Lmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlaW5pdElucHV0cygpOnZvaWQge1xyXG4gICAgICAgIHRoaXMudGl0bGVfaW5wdXQgICAgPSAkKCcjdGl0bGVfaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmF1dGhvcl9pbnB1dCAgID0gJCgnI2F1dGhvcl9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuc3ViamVjdF9pbnB1dCAgPSAkKCcjc3ViamVjdF9pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMua2V5d29yZHNfaW5wdXQgPSAkKCcja2V5d29yZHNfaW5wdXQnKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9CYXNlXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBDb21tb24gfSBmcm9tIFwiLi9Db21tb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWRhY3QgZXh0ZW5kcyBCYXNlIHtcclxuXHJcbiAgICAvL0NsYXNzZXNcclxuICAgIGNvbmZpZyA6IENvbmZpZztcclxuICAgIGNvbW1vbiA6IENvbW1vbjtcclxuXHJcbiAgICAvL2J1dHRvbnNcclxuXHRyZWRhY3RfYXBwbHlfYnRuIDogYW55O1xyXG5cclxuICAgIC8vaW5wdXRzIFxyXG4gICAgcl94MSA6IGFueTtcclxuICAgIHJfeTEgOiBhbnk7XHJcbiAgICByX3gyIDogYW55O1xyXG4gICAgcl95MiA6IGFueTtcclxuICAgIHJfcGFnZSA6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vYnV0dG9uc1xyXG4gICAgICAgIHRoaXMucmVkYWN0X2FwcGx5X2J0biA9ICQoJyNyZWRhY3RfYXBwbHlfYnRuJyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRzXHJcbiAgICAgICAgdGhpcy5yX3gxID0gJChcIiNyX3gxXCIpO1xyXG4gICAgICAgIHRoaXMucl95MSA9ICQoXCIjcl95MVwiKTtcclxuICAgICAgICB0aGlzLnJfeDIgPSAkKFwiI3JfeDJcIik7XHJcbiAgICAgICAgdGhpcy5yX3kyID0gJChcIiNyX3kyXCIpO1xyXG4gICAgICAgIHRoaXMucl9wYWdlID0gJChcIiNyX3BhZ2VcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRMaXN0ZW5lcnMoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY29tbW9uID0gc3VwZXIuZ2V0Q29tbW9uKCk7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IHN1cGVyLmdldENvbmZpZygpO1xyXG4gICAgICAgIGxldCByZWRhY3QgPSB0aGlzO1xyXG5cclxuICAgICAgICByZWRhY3QucmVkYWN0X2FwcGx5X2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZTpFdmVudCkge1xyXG4gICAgICAgICAgICB2YXIgdmlld19tb2RlbCA9IHtcclxuICAgICAgICAgICAgICAgIG5ld3VzZXJwYXNzd29yZDogY29tbW9uLm5ld3VzZXJwYXNzd29yZC52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB4MTogcmVkYWN0LnJfeDEudmFsKClcclxuICAgICAgICAgICAgICAgICwgeTE6IHJlZGFjdC5yX3kxLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHgyOiByZWRhY3Qucl94Mi52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB5MjogcmVkYWN0LnJfeTIudmFsKClcclxuICAgICAgICAgICAgICAgICwgcGFnZTogcmVkYWN0LnJfcGFnZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgbXNnID0gcmVkYWN0LnZhbGlkYXRlKHZpZXdfbW9kZWwpO1xyXG4gICAgICAgICAgICBpZiAobXNnID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBjb25maWcudXJscy5yZWRhY3QuYWRkO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyOkpRdWVyeVhIUikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ1JlZGFjdGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLnNlc3Npb25fZXhwaXJlZF9tb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLkZJTEVOQU1FO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkYWN0LnByZXZpZXcoZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbERhbmdlci5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNob3dlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YS5zaG93ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZGFuZ2VyKCdFeGNlcHRpb24hLCBvdXIgZGV2ZWxvcG1lbnQgdGVhbSB3aWxsIGxvb2sgaW50byB0aGlzIGlzc3VlLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZSAobW9kZWw6YW55KTpzdHJpbmcge1xyXG4gICAgIFxyXG4gICAgICAgIGxldCBtZXNzYWdlID0gXCJcIjtcclxuICAgICAgICBpZiAobW9kZWwueDEgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDEgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbC55MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJZMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLngyID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlgyIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnkyID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkyIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnBhZ2UgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiUGFnZSBudW1iZXIgaXMgcmVxdWlyZWQuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKE51bWJlcihtb2RlbC5wYWdlKSA8PSAwKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJFbnRlciBhIHBvc2l0aXZlIG51bWJlciBmb3IgcGFnZS48YnI+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCIuL0Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGFtcCBleHRlbmRzIEJhc2Uge1xyXG5cclxuICAgIC8vYnV0dG9uc1xyXG5cdGFkZF9zdGFtcF9idG4gPSAkKCcjYWRkX3N0YW1wX2J0bicpO1xyXG5cclxuICAgIC8vaW5wdXRzXHJcbiAgICBzX3gxIDogYW55O1xyXG4gICAgc195MSA6IGFueTtcclxuICAgIHNfeDIgOiBhbnk7XHJcbiAgICBzX3kyIDogYW55O1xyXG4gICAgc19wYWdlIDogYW55O1xyXG4gICAgc3RhbXBfbm90ZSA6IGFueTtcclxuICAgIHN0YW1wX3R5cGUgOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy9idXR0b25zXHJcbiAgICAgICAgdGhpcy5hZGRfc3RhbXBfYnRuID0gJCgnI2FkZF9zdGFtcF9idG4nKTtcclxuXHJcbiAgICAgICAgLy9pbnB1dHNcclxuICAgICAgICB0aGlzLnNfeDEgPSAkKFwiI3NfeDFcIik7XHJcbiAgICAgICAgdGhpcy5zX3kxID0gJChcIiNzX3kxXCIpO1xyXG4gICAgICAgIHRoaXMuc194MiA9ICQoXCIjc194MlwiKTtcclxuICAgICAgICB0aGlzLnNfeTIgPSAkKFwiI3NfeTJcIik7XHJcbiAgICAgICAgdGhpcy5zX3BhZ2UgPSAkKFwiI3NfcGFnZVwiKTtcclxuICAgICAgICB0aGlzLnN0YW1wX25vdGUgPSAkKFwiI3N0YW1wX25vdGVcIik7XHJcbiAgICAgICAgdGhpcy5zdGFtcF90eXBlID0gJChcIiNzdGFtcF90eXBlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50TGlzdGVuZXJzKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWcgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgc3RhbXAgPSB0aGlzO1xyXG5cclxuICAgICAgICBzdGFtcC5hZGRfc3RhbXBfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgbmV3dXNlcnBhc3N3b3JkOiBjb21tb24ubmV3dXNlcnBhc3N3b3JkLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHgxOiBzdGFtcC5zX3gxLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHkxOiBzdGFtcC5zX3kxLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHgyOiBzdGFtcC5zX3gyLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHkyOiBzdGFtcC5zX3kyLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAsIHBhZ2VzOiBzdGFtcC5zX3BhZ2UudmFsKClcclxuICAgICAgICAgICAgICAgICwgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCB0eXBlOiAkKFwiI3N0YW1wX3R5cGVcIikuZmluZChcIjpzZWxlY3RlZFwiKS50ZXh0KClcclxuICAgICAgICAgICAgICAgICwgdHlwZVZhbHVlOiAkKFwiI3N0YW1wX3R5cGVcIikuZmluZChcIjpzZWxlY3RlZFwiKS52YWwoKVxyXG4gICAgICAgICAgICAgICAgLCBub3RlOiBzdGFtcC5zdGFtcF9ub3RlLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBtc2cgPSBzdGFtcC52YWxpZGF0ZSh2aWV3X21vZGVsKTtcclxuICAgICAgICAgICAgaWYgKG1zZyA9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGNvbmZpZy51cmxzLnN0YW1wLmFkZDtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdfbW9kZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdBZGRpbmcgc3RhbXAnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHAgPSAkLnR5cGUoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uc2Vzc2lvbl9leHBpcmVkX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhLmZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFtcC5wcmV2aWV3KGZpbGVOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaG93ZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEuc2hvd2Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKG9ialJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlKG1vZGVsOmFueSk6c3RyaW5nIHtcclxuICAgICAgIFxyXG4gICAgICAgIGxldCBtZXNzYWdlID0gXCJcIjtcclxuICAgICAgICBpZiAobW9kZWwueDEgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiWDEgY29ucmRpbmF0ZSBpcyByZXF1aXJlZDxicj5cIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbC55MSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJZMSBjb25yZGluYXRlIGlzIHJlcXVpcmVkPGJyPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vZGVsLngyID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlgyIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnkyID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlkyIGNvbnJkaW5hdGUgaXMgcmVxdWlyZWQ8YnI+XCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnBhZ2VzID09IFwiXCIpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIk51bWJlciBvZiBwYWdlcyB0byBhcHBseSB0aGUgc3RhbXAgaXMgcmVxdWlyZWQuPGJyPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsLnR5cGVWYWx1ZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJTdGFtcCB0eXBlIGlzIHJlcXVpcmVkLjxicj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgQ29tbW9uIH0gZnJvbSBcIi4vQ29tbW9uXCI7XHJcbmltcG9ydCB7QmFzZX0gZnJvbSBcIi4vQmFzZVwiO1xyXG5pbXBvcnQgeyBEaWdpdGFsU2lnbmF0dXJlIH0gZnJvbSBcIi4vRGlnaXRhbFNpZ25hdHVyZVwiO1xyXG5pbXBvcnQgeyBSZWRhY3QgfSBmcm9tIFwiLi9SZWRhY3RcIjtcclxuaW1wb3J0IHsgU3RhbXAgfSBmcm9tIFwiLi9TdGFtcFwiO1xyXG5pbXBvcnQgeyBCYXJjb2RlIH0gZnJvbSBcIi4vQmFyY29kZVwiO1xyXG5pbXBvcnQgeyBQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vUHJvcGVydGllc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmtCZW5jaCBleHRlbmRzIEJhc2V7XHJcblxyXG4gICAgLy9jbGFzc2VzXHJcbiAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xyXG4gICAgYmFyY29kZSA6IEJhcmNvZGU7XHJcbiAgICBzdGFtcCA6IFN0YW1wO1xyXG4gICAgcmVkYWN0IDogUmVkYWN0O1xyXG4gICAgZGlnaXRhbFNpZ25hdHVyZTogRGlnaXRhbFNpZ25hdHVyZTtcclxuICAgIGNvbmZpZzogQ29uZmlnO1xyXG4gICAgY29tbW9uOiBDb21tb247XHJcblxyXG4gICAgLy9idXR0b25zXHJcbiAgICByZXNldF9idG4gOiBhbnk7XHJcbiAgICBkZWxldGVfYnRuOiBhbnk7XHJcbiAgICBlbWFpbF9idG46IGFueTtcclxuICAgIHNlbmRfZW1haWxfYnRuOiBhbnk7XHJcbiAgICByZXN0b3JlX2J0bjogYW55O1xyXG4gICAgc2FuaXRpemVfYnRuOiBhbnk7XHJcbiAgICBwcm9wZXJ0eV9idG46IGFueTtcclxuXHJcbiAgICAvL2lucHV0c1xyXG4gICAgeW91cl9lbWFpbDogYW55O1xyXG4gICAgeW91cl9zdWJqZWN0OiBhbnk7XHJcbiAgICB5b3VyX21lc3NhZ2U6IGFueTtcclxuXHJcbiAgICAvL21vZGFsc1xyXG4gICAgZGlnaXRhbF9zaWduYXR1cmVfbW9kYWw6IGFueTtcclxuICAgIHN0YW1wX21vZGFsOiBhbnk7XHJcbiAgICBiYXJjb2RlX21vZGFsOiBhbnk7XHJcbiAgICByZWRhY3RfbW9kYWw6IGFueTtcclxuICAgIHByb3BlcnR5X21vZGFsOiBhbnk7XHJcbiAgICBlbWFpbF9tb2RhbDogYW55O1xyXG5cclxuICAgIC8vb3RoZXIvRElWXHJcbiAgICBwcm9wZXJ0eV9tb2RhbF9ib2R5OiBhbnk7XHJcbiAgICBhdHRhY2hlZF9maWxlTmFtZTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICB0aGlzLnJlc2V0X2J0biA9ICQoJyNyZXNldF9idG4nKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZV9idG4gPSAkKCcjZGVsZXRlX2J0bicpO1xyXG4gICAgICAgIHRoaXMuZW1haWxfYnRuID0gJCgnI2VtYWlsX2J0bicpO1xyXG4gICAgICAgIHRoaXMuc2VuZF9lbWFpbF9idG4gPSAkKCcjc2VuZF9lbWFpbF9idG4nKTtcclxuICAgICAgICB0aGlzLnJlc3RvcmVfYnRuID0gJCgnI3Jlc3RvcmVfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZV9idG4gPSAkKCcjc2FuaXRpemVfYnRuJyk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eV9idG4gPSAkKCcjcHJvcGVydHlfYnRuJyk7XHJcblxyXG4gICAgICAgIC8vaW5wdXRzXHJcbiAgICAgICAgdGhpcy55b3VyX2VtYWlsID0gJCgnI3lvdXJfZW1haWwnKTtcclxuICAgICAgICB0aGlzLnlvdXJfc3ViamVjdCA9ICQoJyN5b3VyX3N1YmplY3QnKTtcclxuICAgICAgICB0aGlzLnlvdXJfbWVzc2FnZSA9ICQoJyN5b3VyX21lc3NhZ2UnKTtcclxuXHJcbiAgICAgICAgLy9tb2RhbHNcclxuICAgICAgICB0aGlzLmRpZ2l0YWxfc2lnbmF0dXJlX21vZGFsID0gJCgnI2RpZ2l0YWxfc2lnbmF0dXJlX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5zdGFtcF9tb2RhbCA9ICQoJyNzdGFtcF9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMuYmFyY29kZV9tb2RhbCA9ICQoJyNiYXJjb2RlX21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5yZWRhY3RfbW9kYWwgPSAkKCcjcmVkYWN0X21vZGFsJyk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eV9tb2RhbCA9ICQoJyNwcm9wZXJ0eV9tb2RhbCcpO1xyXG4gICAgICAgIHRoaXMuZW1haWxfbW9kYWwgPSAkKCcjZW1haWxfbW9kYWwnKTtcclxuXHJcbiAgICAgICAgLy9vdGhlci9ESVZcclxuICAgICAgICB0aGlzLnByb3BlcnR5X21vZGFsX2JvZHkgPSAkKCcjcHJvcGVydHlfbW9kYWxfYm9keScpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoZWRfZmlsZU5hbWUgPSAkKCcjYXR0YWNoZWRfZmlsZU5hbWUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRFdmVudExpc3RlbmVycyhldmVudD86IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvbW1vbiA9IHN1cGVyLmdldENvbW1vbigpO1xyXG4gICAgICAgIGxldCBjb25maWcgPSBzdXBlci5nZXRDb25maWcoKTtcclxuICAgICAgICBsZXQgd29ya2JlbmNoID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5kaWdpdGFsX3NpZ25hdHVyZV9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdvcmtiZW5jaC5kaWdpdGFsU2lnbmF0dXJlID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgd29ya2JlbmNoLmRpZ2l0YWxTaWduYXR1cmUgPSBuZXcgRGlnaXRhbFNpZ25hdHVyZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWRhY3RfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3b3JrYmVuY2gucmVkYWN0ID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgd29ya2JlbmNoLnJlZGFjdCA9IG5ldyBSZWRhY3QoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhbXBfbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3b3JrYmVuY2guc3RhbXAgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICB3b3JrYmVuY2guc3RhbXAgPSBuZXcgU3RhbXAoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmFyY29kZV9tb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdvcmtiZW5jaC5iYXJjb2RlID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgd29ya2JlbmNoLmJhcmNvZGUgPSBuZXcgQmFyY29kZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5kZWxldGVfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLnZpZXdlci5kZWxldGU7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdEZWxldGluZyB0aGUgZmlsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0cCA9ICQudHlwZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uc2Vzc2lvbl9leHBpcmVkX21vZGFsLm1vZGFsKHsgc2hvdzogdHJ1ZSwgYmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyB8fCBkYXRhLlNVQ0NFU1Mpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2NhdGlvbi5ocmVmID0gY29uZmlnLnVybHMucm9vdC5wYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoJ2hpZGUnKTsgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxEYW5nZXIubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChvYmpSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnJlc3RvcmVfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudDpFdmVudCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gY29uZmlnLnVybHMudmlld2VyLnJlc3RvcmU7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdmlld19tb2RlbCxcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHI6SlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFjdGlvbl9sYWJlbC5odG1sKCdSZXN0b3JpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YS5maWxlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGEuRklMRU5BTUU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2gucHJldmlldyhmaWxlTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmpSZXF1ZXN0LCBzdHJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZW1haWxfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd29ya2JlbmNoLmF0dGFjaGVkX2ZpbGVOYW1lLmh0bWwoY29tbW9uLmZpbGVOYW1lLnZhbCgpKTtcclxuICAgICAgICAgICAgd29ya2JlbmNoLmVtYWlsX21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNlbmRfZW1haWxfYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3X21vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6IGNvbW1vbi5maWxlTmFtZS52YWwoKSxcclxuICAgICAgICAgICAgICAgIG1haWx0bzogd29ya2JlbmNoLnlvdXJfZW1haWwudmFsKCksXHJcbiAgICAgICAgICAgICAgICBzdWJqZWN0OiB3b3JrYmVuY2gueW91cl9zdWJqZWN0LnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogd29ya2JlbmNoLnlvdXJfbWVzc2FnZS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy51cmxzLnZpZXdlci5lbWFpbDtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrYmVuY2guZW1haWxfbW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0VtYWlsaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmxvYWRpbmdfbW9kYWwubW9kYWwoeyBzaG93OiB0cnVlLCBiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCgnaGlkZScpOyB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRwID0gJC50eXBlKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsTWVzc2FnZS5odG1sKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgfHwgZGF0YS5TVUNDRVNTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuaW5mbygnRW1haWwgaGFzIGJlZW4gc2VudC4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uZXJyb3JNb2RhbE1lc3NhZ2UuaHRtbChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG9ialJlcXVlc3QsIHN0ckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5lbWFpbF9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignVW5hYmxlIHRvIHNlbmQgdGhlIGVtYWlsLicpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNhbml0aXplX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbW1vbi5jb25maXJtYXRpb25fdGV4dC5odG1sKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gU2FuaXRpemUgdGhlIFBERj8nKTtcclxuICAgICAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl9tb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eV9idG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50OiBFdmVudCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXdfbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29tbW9uLmZpbGVOYW1lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IGNvbW1vbi5wYXNzUGRmLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdXJsID0gY29uZmlnLnVybHMucHJvcGVydGllcy5pbmRleDtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB2aWV3X21vZGVsLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24uYWN0aW9uX2xhYmVsLmh0bWwoJ0xvYWRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb24ubG9hZGluZ19tb2RhbC5tb2RhbCh7IHNob3c6IHRydWUsIGJhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNvbW1vbi5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtiZW5jaC5wcm9wZXJ0eV9tb2RhbF9ib2R5Lmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLnByb3BlcnR5X21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB3b3JrYmVuY2gucHJvcGVydGllcyA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ya2JlbmNoLnByb3BlcnRpZXMgPSBuZXcgUHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqUmVxdWVzdCwgc3RyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhpcy5sb2FkaW5nX21vZGFsLm1vZGFsKCdoaWRlJyk7IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbi5lcnJvck1vZGFsRGFuZ2VyLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmVycm9yTW9kYWxNZXNzYWdlLmh0bWwoc3RyRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29tbW9uLmNvbmZpcm1hdGlvbl9tb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIldvcmtCZW5jaCBjbGFzcyBjb25zdHJ1Y3RlZC5cIlxyXG4gICAgfVxyXG59Il19
