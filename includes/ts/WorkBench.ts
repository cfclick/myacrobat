import { Config } from "./Config";
import { Common } from "./Common";
import {Base} from "./Base";
import { DigitalSignature } from "./DigitalSignature";
import { Redact } from "./Redact";
import { Stamp } from "./Stamp";
import { Barcode } from "./Barcode";
import { Properties } from "./Properties";

export class WorkBench extends Base{

    //classes
    properties: Properties;
    barcode : Barcode;
    stamp : Stamp;
    redact : Redact;
    digitalSignature: DigitalSignature;
    config: Config;
    common: Common;

    //buttons
    reset_btn : any;
    delete_btn: any;
    email_btn: any;
    send_email_btn: any;
    restore_btn: any;
    sanitize_btn: any;
    property_btn: any;

    //inputs
    your_email: any;
    your_subject: any;
    your_message: any;

    //modals
    digital_signature_modal: any;
    stamp_modal: any;
    barcode_modal: any;
    redact_modal: any;
    property_modal: any;
    email_modal: any;

    //other/DIV
    property_modal_body: any;
    attached_fileName: any;

    constructor(){
        super();
        //buttons
        this.reset_btn = $('#reset_btn');
        this.delete_btn = $('#delete_btn');
        this.email_btn = $('#email_btn');
        this.send_email_btn = $('#send_email_btn');
        this.restore_btn = $('#restore_btn');
        this.sanitize_btn = $('#sanitize_btn');
        this.property_btn = $('#property_btn');

        //inputs
        this.your_email = $('#your_email');
        this.your_subject = $('#your_subject');
        this.your_message = $('#your_message');

        //modals
        this.digital_signature_modal = $('#digital_signature_modal');
        this.stamp_modal = $('#stamp_modal');
        this.barcode_modal = $('#barcode_modal');
        this.redact_modal = $('#redact_modal');
        this.property_modal = $('#property_modal');
        this.email_modal = $('#email_modal');

        //other/DIV
        this.property_modal_body = $('#property_modal_body');
        this.attached_fileName = $('#attached_fileName');

        this.setEventListeners();
    }

    protected setEventListeners(event?: Event): void {
        
        let common = super.getCommon();
        let config = super.getConfig();
        let workbench = this;

        this.digital_signature_modal.on('shown.bs.modal', function () {

            if (typeof workbench.digitalSignature == 'undefined')
                workbench.digitalSignature = new DigitalSignature();

        });

        this.redact_modal.on('shown.bs.modal', function () {

            if (typeof workbench.redact == 'undefined')
                workbench.redact = new Redact();

        });

        this.stamp_modal.on('shown.bs.modal', function () {

            if (typeof workbench.stamp == 'undefined')
                workbench.stamp = new Stamp();

        });

        this.barcode_modal.on('shown.bs.modal', function () {

            if (typeof workbench.barcode == 'undefined')
                workbench.barcode = new Barcode();

        });

        this.delete_btn.on('click', function () {

            let view_model = {
                fileName: common.fileName.val()
            };

            let url = config.urls.viewer.delete;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr:JQueryXHR) {
                    common.action_label.html('Deleting the file');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);

                    let tp = $.type(data);

                    if (tp === 'string') {
                        common.session_expired_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                    } else {
                        if (data.success || data.SUCCESS){
                            self.location.href = config.urls.root.path;
                        } else {
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


        this.restore_btn.on('click', function (event:Event) {

            var view_model = {
                fileName: common.fileName.val()
            };

            var url = config.urls.viewer.restore;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr:JQueryXHR) {
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

            let view_model = {
                fileName: common.fileName.val(),
                mailto: workbench.your_email.val(),
                subject: workbench.your_subject.val(),
                message: workbench.your_message.val()
            };

            let url = config.urls.viewer.email;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr:JQueryXHR) {
                    workbench.email_modal.modal('hide');
                    common.action_label.html('Emailing');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);

                    let tp = $.type(data);

                    if (tp === 'string') {
                        common.errorModalDanger.modal('show');
                        common.errorModalMessage.html(data);
                    } else {
                        if (data.success || data.SUCCESS) {
                            toastr.info('Email has been sent.');
                        } else {
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


        this.sanitize_btn.on('click', function (event: Event) {
            common.confirmation_text.html('Are you sure you want to Sanitize the PDF?');
            common.confirmation_modal.modal('show');
        });


        this.property_btn.on('click', function (event: Event) {

            let view_model = {
                fileName: common.fileName.val(),
                password: common.passPdf.val()
            };

            let url = config.urls.properties.index;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr:JQueryXHR) {
                    common.action_label.html('Loading');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (html) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    workbench.property_modal_body.html(html);
                    workbench.property_modal.modal('show');
                    
                    if (typeof workbench.properties == 'undefined')
                        workbench.properties = new Properties();
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

    }

    public ping(): string {
        return "WorkBench class constructed."
    }
}