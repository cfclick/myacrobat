(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = /** @class */ (function () {
    function Config() {
        this.theActualServer = window.location.host;
        this.protocol = "http://";
        this.appFolder = "/";
        this.CGIScriptName = "";
        var path = this.protocol + this.theActualServer + this.appFolder + this.CGIScriptName;
        this.urls = new MyUrls(path);
        /*
         //Digital Signature Handler
         
         //Stamp Handler
        
         //Sanitize Handler
        
         //Redact Handler
        
         //Barcode Handler
         
         //Properties Handler
         
         //Viewer Handler
         this.urls.viewer.preview    = path + "?event=viewer.preview";
         this.urls.viewer.delete     = path + "?event=viewer.delete";
         this.urls.viewer.restore    = path + "?event=viewer.restore";
         this.urls.viewer.save       = path + "?event=viewer.save";
         this.urls.viewer.email      = path + "?event=viewer.email";
         //Root URL
         this.urls.root.path         = path;*/
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
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sayHello(name) {
    return "Hello from " + name;
}
exports.sayHello = sayHello;
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var greet_1 = require("./greet");
function showHello(divName, name) {
    var elt2 = $(divName);
    var cfg = new Config_1.Config();
    console.log(cfg.urls.main.index);
    elt2.html(greet_1.sayHello(name));
}
showHello("#greeting", "Shirak");
},{"./Config":1,"./greet":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy90cy9Db25maWcudHMiLCJpbmNsdWRlcy90cy9ncmVldC50cyIsImluY2x1ZGVzL3RzL2hvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0lBUUk7UUFDSSxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFFeEYsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUNoQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OENBb0JzQztJQUN6QyxDQUFDO0lBRUwsYUFBQztBQUFELENBdkNBLEFBdUNDLElBQUE7QUF2Q1ksd0JBQU07QUF5Q25CO0lBWUksZ0JBQVksRUFBUztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVMLGFBQUM7QUFBRCxDQXhCQSxBQXdCQyxJQUFBO0FBRUQ7SUFNSSxjQUFZLEtBQVk7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsbUJBQW1CLENBQUM7UUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLEdBQUcseUJBQXlCLENBQUM7UUFDckQsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLEdBQUcsMEJBQTBCLENBQUM7UUFDdkQsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLEdBQUcsa0JBQWtCLENBQUM7SUFDM0MsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQVpBLEFBWUMsSUFBQTtBQUVEO0lBRUksMEJBQVksS0FBYTtRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssR0FBRyxrQ0FBa0MsQ0FBQztJQUMvRCxDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUxBLEFBS0MsSUFBQTtBQUVEO0lBRUksZUFBWSxLQUFhO1FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLGtCQUFrQixDQUFDO0lBQzFDLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFFRDtJQUdJLGtCQUFZLEtBQWE7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsdUJBQXVCLENBQUM7SUFDakQsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQU5BLEFBTUMsSUFBQTtBQUVEO0lBR0ksZ0JBQVksS0FBYTtRQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxxQkFBcUIsQ0FBQztJQUM3QyxDQUFDO0lBQ0wsYUFBQztBQUFELENBTkEsQUFNQyxJQUFBO0FBRUQ7SUFFSSxpQkFBWSxLQUFhO1FBQ3pCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLHNCQUFzQixDQUFDO0lBQzFDLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFFRDtJQVFJLG9CQUFZLEtBQWE7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBSSxLQUFLLEdBQUcsMkJBQTJCLENBQUM7UUFDbEQsSUFBSSxDQUFDLEdBQUcsR0FBTSxLQUFLLEdBQUcseUJBQXlCLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsNEJBQTRCLENBQUM7UUFDbkQsSUFBSSxDQUFDLElBQUksR0FBSyxLQUFLLEdBQUcsMEJBQTBCLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsNEJBQTRCLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsNEJBQTRCLENBQUM7SUFDdkQsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FoQkEsQUFnQkMsSUFBQTtBQUVEO0lBT0ksZ0JBQVksS0FBYTtRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxHQUFPLEtBQUssR0FBRyx3QkFBd0IsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxHQUFNLEtBQUssR0FBRyxzQkFBc0IsQ0FBQztRQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFTLEtBQUssR0FBRyx3QkFBd0IsQ0FBQztRQUNuRCxJQUFJLENBQUMsS0FBSyxHQUFRLEtBQUssR0FBRyx3QkFBd0IsQ0FBQztJQUN2RCxDQUFDO0lBRUwsYUFBQztBQUFELENBZkEsQUFlQyxJQUFBO0FBRUQ7SUFHSSxjQUFZLEtBQWE7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQU5ELEFBTUUsSUFBQTs7OztBQy9KRixrQkFBeUIsSUFBWTtJQUNqQyxNQUFNLENBQUMsZ0JBQWMsSUFBTSxDQUFDO0FBQ2hDLENBQUM7QUFGRCw0QkFFQzs7OztBQ0ZELG1DQUFnQztBQUNoQyxpQ0FBbUM7QUFFbkMsbUJBQW1CLE9BQWUsRUFBRSxJQUFZO0lBQzVDLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBRSxPQUFPLENBQUMsQ0FBQztJQUN6QixJQUFJLEdBQUcsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDLElBQUksQ0FBRSxnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUM7QUFDaEMsQ0FBQztBQUVELFNBQVMsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgdGhlQWN0dWFsU2VydmVyOiBzdHJpbmc7XHJcbiAgICBwcm90b2NvbDogc3RyaW5nO1xyXG4gICAgYXBwRm9sZGVyOiBzdHJpbmc7XHJcbiAgICBDR0lTY3JpcHROYW1lIDogc3RyaW5nO1xyXG4gICAgdXJsczogTXlVcmxzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudGhlQWN0dWFsU2VydmVyID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICAgICAgdGhpcy5wcm90b2NvbCA9IFwiaHR0cDovL1wiO1xyXG4gICAgICAgIHRoaXMuYXBwRm9sZGVyID0gXCIvXCI7ICBcclxuICAgICAgICB0aGlzLkNHSVNjcmlwdE5hbWUgPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnByb3RvY29sICsgdGhpcy50aGVBY3R1YWxTZXJ2ZXIgKyB0aGlzLmFwcEZvbGRlciArIHRoaXMuQ0dJU2NyaXB0TmFtZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVybHMgPSBuZXcgTXlVcmxzKCBwYXRoICk7XHJcbiAgICAgICAvKlxyXG4gICAgICAgIC8vRGlnaXRhbCBTaWduYXR1cmUgSGFuZGxlclxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vU3RhbXAgSGFuZGxlclxyXG4gICAgICAgXHJcbiAgICAgICAgLy9TYW5pdGl6ZSBIYW5kbGVyXHJcbiAgICAgICBcclxuICAgICAgICAvL1JlZGFjdCBIYW5kbGVyXHJcbiAgICAgICBcclxuICAgICAgICAvL0JhcmNvZGUgSGFuZGxlclxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vUHJvcGVydGllcyBIYW5kbGVyXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9WaWV3ZXIgSGFuZGxlclxyXG4gICAgICAgIHRoaXMudXJscy52aWV3ZXIucHJldmlldyAgICA9IHBhdGggKyBcIj9ldmVudD12aWV3ZXIucHJldmlld1wiO1xyXG4gICAgICAgIHRoaXMudXJscy52aWV3ZXIuZGVsZXRlICAgICA9IHBhdGggKyBcIj9ldmVudD12aWV3ZXIuZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy51cmxzLnZpZXdlci5yZXN0b3JlICAgID0gcGF0aCArIFwiP2V2ZW50PXZpZXdlci5yZXN0b3JlXCI7XHJcbiAgICAgICAgdGhpcy51cmxzLnZpZXdlci5zYXZlICAgICAgID0gcGF0aCArIFwiP2V2ZW50PXZpZXdlci5zYXZlXCI7XHJcbiAgICAgICAgdGhpcy51cmxzLnZpZXdlci5lbWFpbCAgICAgID0gcGF0aCArIFwiP2V2ZW50PXZpZXdlci5lbWFpbFwiO1xyXG4gICAgICAgIC8vUm9vdCBVUkxcclxuICAgICAgICB0aGlzLnVybHMucm9vdC5wYXRoICAgICAgICAgPSBwYXRoOyovXHJcbiAgICB9XHJcblxyXG59IFxyXG5cclxuY2xhc3MgTXlVcmxze1xyXG5cclxuICAgIG1haW46IE1haW47XHJcbiAgICBkaWdpdGFsc2lnbmF0dXJlOiBEaWdpdGFsc2lnbmF0dXJlO1xyXG4gICAgc3RhbXA6IFN0YW1wO1xyXG4gICAgc2FuaXRpemU6IFNhbml0aXplO1xyXG4gICAgcmVkYWN0OiBSZWRhY3Q7XHJcbiAgICBiYXJjb2RlOiBCYXJjb2RlO1xyXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcclxuICAgIHZpZXdlcjogVmlld2VyO1xyXG4gICAgcm9vdDogUm9vdDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMubWFpbiA9IG5ldyBNYWluKF9wKTtcclxuICAgICAgICB0aGlzLmRpZ2l0YWxzaWduYXR1cmUgPSBuZXcgRGlnaXRhbHNpZ25hdHVyZShfcCk7XHJcbiAgICAgICAgdGhpcy5zdGFtcCA9IG5ldyBTdGFtcChfcCk7XHJcbiAgICAgICAgdGhpcy5zYW5pdGl6ZSA9IG5ldyBTYW5pdGl6ZShfcCk7XHJcbiAgICAgICAgdGhpcy5yZWRhY3QgPSBuZXcgUmVkYWN0KF9wKTtcclxuICAgICAgICB0aGlzLmJhcmNvZGUgPSBuZXcgQmFyY29kZShfcCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoX3ApO1xyXG4gICAgICAgIHRoaXMudmlld2VyID0gbmV3IFZpZXdlcihfcCk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gbmV3IFJvb3QoX3ApO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmNsYXNzIE1haW4ge1xyXG4gICAgaW5kZXg6IHN0cmluZztcclxuICAgIHVwbG9hZEZpbGVzOiBzdHJpbmc7XHJcbiAgICByZWFkTWV0YWRhdGE6IHN0cmluZztcclxuICAgIHBpbmc6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBfcGF0aCArIFwiP2V2ZW50PW1haW4uaW5kZXhcIjtcclxuICAgICAgICB0aGlzLnVwbG9hZEZpbGVzID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnVwbG9hZEZpbGVzXCI7XHJcbiAgICAgICAgdGhpcy5yZWFkTWV0YWRhdGEgPSBfcGF0aCArIFwiP2V2ZW50PW1haW4ucmVhZE1ldGFkYXRhXCI7XHJcbiAgICAgICAgdGhpcy5waW5nID0gX3BhdGggKyBcIj9ldmVudD1tYWluLnBpbmdcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGlnaXRhbHNpZ25hdHVyZSB7XHJcbiAgICBhZGRGaWVsZDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkRmllbGQgPSBfcGF0aCArIFwiP2V2ZW50PWRpZ2l0YWxzaWduYXR1cmUuYWRkRmllbGRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU3RhbXAge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50PXN0YW1wLmFkZFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTYW5pdGl6ZXtcclxuICAgIGFwcGx5IDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFwcGx5ID0gX3BhdGggKyBcIj9ldmVudD1zYW5pdGl6ZS5hcHBseVwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWRhY3Qge1xyXG4gICAgYWRkIDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBfcGF0aCArIFwiP2V2ZW50ID0gcmVkYWN0LmFkZFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBCYXJjb2RlIHtcclxuICAgIGFkZCA6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuYWRkID0gX3BhdGggKyBcIj9ldmVudCA9IGJhcmNvZGUuYWRkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb3BlcnRpZXMgIHtcclxuICAgIGluZGV4OiBzdHJpbmc7XHJcbiAgICBhZGQ6IHN0cmluZzsgXHJcbiAgICBkZWxldGU6IHN0cmluZzsgXHJcbiAgICBzYXZlOiBzdHJpbmc7IFxyXG4gICAgZXhwb3J0OiBzdHJpbmc7ICAgICAgICBcclxuICAgIGltcG9ydDogc3RyaW5nOyAgXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmluZGV4ICA9IF9wYXRoICsgXCI/ZXZlbnQgPSBwcm9wZXJ0aWVzLmluZGV4XCI7XHJcbiAgICAgICAgdGhpcy5hZGQgICAgPSBfcGF0aCArIFwiP2V2ZW50ID0gcHJvcGVydGllcy5hZGRcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZSA9IF9wYXRoICsgXCI/ZXZlbnQgPSBwcm9wZXJ0aWVzLmRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZSAgID0gX3BhdGggKyBcIj9ldmVudCA9IHByb3BlcnRpZXMuc2F2ZVwiO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0ID0gX3BhdGggKyBcIj9ldmVudCA9IHByb3BlcnRpZXMuZXhwb3J0XCI7XHJcbiAgICAgICAgdGhpcy5pbXBvcnQgPSBfcGF0aCArIFwiP2V2ZW50ID0gcHJvcGVydGllcy5pbXBvcnRcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVmlld2VyIHtcclxuICAgIHByZXZpZXcgOiBzdHJpbmc7IFxyXG4gICAgZGVsZXRlOiBzdHJpbmc7XHJcbiAgICByZXN0b3JlOiBzdHJpbmc7XHJcbiAgICBzYXZlOiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3ICAgID0gX3BhdGggKyBcIj9ldmVudCA9IHZpZXdlci5pbmRleFwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlICAgICA9IF9wYXRoICsgXCI/ZXZlbnQgPSB2aWV3ZXIuZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5yZXN0b3JlICAgID0gX3BhdGggKyBcIj9ldmVudCA9IHZpZXdlci5zYXZlXCI7XHJcbiAgICAgICAgdGhpcy5zYXZlICAgICAgID0gX3BhdGggKyBcIj9ldmVudCA9IHZpZXdlci5leHBvcnRcIjtcclxuICAgICAgICB0aGlzLmVtYWlsICAgICAgPSBfcGF0aCArIFwiP2V2ZW50ID0gdmlld2VyLmltcG9ydFwiO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgUm9vdCB7XHJcbiAgICAgcGF0aDpzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgIHRoaXMucGF0aCA9IF9wYXRoO1xyXG4gICAgIH1cclxuIH1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNheUhlbGxvKG5hbWU6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGBIZWxsbyBmcm9tICR7bmFtZX1gO1xyXG59IiwiaW1wb3J0IHtDb25maWd9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBzYXlIZWxsbyB9IGZyb20gXCIuL2dyZWV0XCI7XHJcblxyXG5mdW5jdGlvbiBzaG93SGVsbG8oZGl2TmFtZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGVsdDIgPSAkKCBkaXZOYW1lKTtcclxuICAgIGxldCBjZmcgPSBuZXcgQ29uZmlnKCk7XHJcbiAgICBjb25zb2xlLmxvZyhjZmcudXJscy5tYWluLmluZGV4KTtcclxuICAgIGVsdDIuaHRtbCggc2F5SGVsbG8obmFtZSkgKTtcclxufVxyXG5cclxuc2hvd0hlbGxvKFwiI2dyZWV0aW5nXCIsIFwiU2hpcmFrXCIpOyJdfQ==
