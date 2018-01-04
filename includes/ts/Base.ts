import { Common } from "./Common";
import { Config } from "./Config";
export abstract class Base {
    config:Config;
    constructor() {
        let base = this;
        this.config = new Config();
    }

    public preview(fileName: string, istemp: boolean): void {
        let url = this.config.urls.viewer.preview + "&fileName=" + fileName + '&istemp=' + istemp;
        this.getCommon().pdf_iframe.attr("src", url);
    }

    public getConfig():Config{
        return this.config;
    }

    public getCommon():Common{
        return new Common();
    }

    public getParameterByName(name:string, url:string):string {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}