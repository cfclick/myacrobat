export class Config {

    theActualServer: string;
    protocol: string;
    appFolder: string;
    CGIScriptName : string;
    urls: MyUrls;

    constructor() {
        this.theActualServer = window.location.host;
        this.protocol = window.location.protocol;
        this.appFolder = "/";  
        this.CGIScriptName = "";
        const path = this.protocol + "//" + this.theActualServer + this.appFolder + this.CGIScriptName;
        
        this.urls = new MyUrls( path );
       
    }

} 

class MyUrls{

    main: Main;
    digitalsignature: Digitalsignature;
    stamp: Stamp;
    sanitize: Sanitize;
    redact: Redact;
    barcode: Barcode;
    properties: Properties;
    viewer: Viewer;
    root: Root;

    constructor(_p:string){
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
    
}

//Digital Signature Handler
class Main {
    index: string;
    uploadFiles: string;
    readMetadata: string;
    ping: string;

    constructor(_path:string){
        this.index = _path + "?event=main.index";
        this.uploadFiles = _path + "?event=main.uploadFiles";
        this.readMetadata = _path + "?event=main.readMetadata";
        this.ping = _path + "?event=main.ping";
    }
}

class Digitalsignature {
    addField: string;
    constructor(_path: string) {
        this.addField = _path + "?event=digitalsignature.addField";
    }
}

class Stamp {
    add : string;
    constructor(_path: string){
        this.add = _path + "?event=stamp.add";
    }
}

class Sanitize{
    apply : string;

    constructor(_path: string) {
        this.apply = _path + "?event=sanitize.apply";
    }
}

class Redact {
    add : string;
    
    constructor(_path: string) {
        this.add = _path + "?event = redact.add";
    }
}

class Barcode {
    add : string;
    constructor(_path: string) {
    this.add = _path + "?event = barcode.add";
    }
}

class Properties  {
    index: string;
    add: string; 
    delete: string; 
    save: string; 
    export: string;        
    import: string;  
    
    constructor(_path: string) {
        this.index  = _path + "?event = properties.index";
        this.add    = _path + "?event = properties.add";
        this.delete = _path + "?event = properties.delete";
        this.save   = _path + "?event = properties.save";
        this.export = _path + "?event = properties.export";
        this.import = _path + "?event = properties.import";
    }
}

class Viewer {
    preview : string; 
    delete: string;
    restore: string;
    save: string;
    email: string;
    
    constructor(_path: string) {
        this.preview    = _path + "?event = viewer.index";
        this.delete     = _path + "?event = viewer.delete";
        this.restore    = _path + "?event = viewer.save";
        this.save       = _path + "?event = viewer.export";
        this.email      = _path + "?event = viewer.import";
    }

}

class Root {
     path:string;

    constructor(_path: string){
         this.path = _path;
     }
 }
