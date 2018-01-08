import { Base } from "./Base";

export class Properties extends Base {

    //buttons
	add_custom_prop_btn : any;
    save_properties_btn : any;
    export_meta_btn     : any;
    import_meta_btn     : any;
    del_cust_prop_btn   : any;

    //divs
    custom_prop_div      : any;
    main_properties_body : any;

    //inputs
    custome_prop_name   : any;
    custome_prop_value  : any;
    title_input         : any;
    author_input        : any;
    subject_input       : any;
    keywords_input      : any;

    constructor() {
        super();

        //buttons
        this.add_custom_prop_btn = $('#add_custom_prop_btn');
        this.save_properties_btn = $('#save_properties_btn');
        this.export_meta_btn     = $('#export_meta_btn');
        this.import_meta_btn     = $('#import_meta_btn');
        this.del_cust_prop_btn = $('.btn orange darken-2 del');
        let divs:any = document.querySelectorAll('.btn orange darken-2 del');

        [].forEach.call(divs, function (div:any) {
            // do whatever
            console.log(div);
        });

        //divs
        this.custom_prop_div      = $('#custom_prop_div');
        this.main_properties_body = $('#main_properties_body');

        //inputs
        this.custome_prop_name  = $('#custome_prop_name');
        this.custome_prop_value = $('#custome_prop_value');
        this.title_input        = $('#title_input');
        this.author_input       = $('#author_input');
        this.subject_input      = $('#subject_input');
        this.keywords_input     = $('#keywords_input');

        this.setEventListeners();
    }

    protected setEventListeners(event?: Event): void {

        let common      = super.getCommon();
        let config      = super.getConfig();
        let properties  = this;

        properties.add_custom_prop_btn.on('click', function (e:Event) {
            let view_model = {
                fileName: common.fileName.val(),
                name: properties.custome_prop_name.val(),
                value: properties.custome_prop_value.val()
            };
            let url = config.urls.properties.add;

            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr: JQueryXHR) {
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

        properties.save_properties_btn.on('click', function (e:Event) {

            properties.reinitInputs();
            let view_model = {
                fileName: common.fileName.val(),
                Title: properties.title_input.val(),
                Author: properties.author_input.val(),
                Subject: properties.subject_input.val(),
                Keywords: properties.keywords_input.val()
            };
            let url = config.urls.properties.save;

            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr:JQueryXHR) {
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


        properties.export_meta_btn.on('click', function (e:Event) {

            properties.reinitInputs();
            let view_model = {
                fileName: common.fileName.val(),
                Title: properties.title_input.val(),
                Author: properties.author_input.val(),
                Subject: properties.subject_input.val(),
                Keywords: properties.keywords_input.val()
            };
            let url = config.urls.properties.export;

            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr:JQueryXHR) {
                    common.action_label.html('Exporting');
                    common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {

                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);

                    if (data.success) {
                        toastr.success('Metadata expoted successfully');
                    } else {
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

        properties.del_cust_prop_btn.on('click', function(e:Event){
            let prop = $(this).data('prop');
            console.log(prop);
        });

    }

    public deleteCustomProperty(prop:any):void {

        let common      = super.getCommon();
        let config      = super.getConfig();
        let properties  = this;

        let view_model = {
            fileName: common.fileName.val(),
            name: prop

        };
        let url = config.urls.properties.delete;

        $.ajax({
            type: "post",
            url: url,
            data: view_model,
            beforeSend: function (xhr:JQueryXHR) {
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
    }

    private reinitInputs():void {
        this.title_input    = $('#title_input');
        this.author_input   = $('#author_input');
        this.subject_input  = $('#subject_input');
        this.keywords_input = $('#keywords_input');
    }
}