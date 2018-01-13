
import { Common } from "./Common";
import { Config } from "./Config";
import { Base } from "./Base";

export class Properties extends Base {

    //buttons
	add_custom_prop_btn : any;
    save_properties_btn : any;
    export_meta_btn     : any;
    import_meta_btn     : any;
    //del_cust_prop_btn   : any;

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
    
    //Other
    arrayof_deletebtn_id: string[];

    constructor() {
        super();

        //buttons
        this.add_custom_prop_btn = $('#add_custom_prop_btn');
        this.save_properties_btn = $('#save_properties_btn');
        this.export_meta_btn     = $('#export_meta_btn');
        this.import_meta_btn     = $('#import_meta_btn');
       // this.del_cust_prop_btn = $('.btn orange darken-2 del');
     
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
        //Other
        this.arrayof_deletebtn_id = new Array();

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
                success: function (data) {
                    setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
                    let tp = $.type(data);

                    if (tp === 'string') {
                    
                        common.errorModalDanger.modal('show');
                        common.errorModalMessage.html(data);
                    } else {
                        if (data.success || data.SUCCESS) {
                            $('#here_table').html('');
                            properties.renderCustomProperties(data);
                        } else {
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

       /* properties.del_cust_prop_btn.on('click', function(e:Event){
            let prop = $(this).data('prop');
            console.log(prop);
        });*/

    }

    public deleteCustomProperty(event:any,prp?:Properties):void {

        let common:Common = super.getCommon();
        let config:Config = super.getConfig();
        if( typeof prp == 'undefined' )
            prp = new Properties();

        let properties    = prp;
        let prop =  $(this).attr("data-prop");
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
            success: function (data) {
                let tp = $.type(data);

                if (tp === 'string') {
                    $('#here_table').html('');
                    common.errorModalDanger.modal('show');
                    common.errorModalMessage.html(data);
                } else {
                    if (data.success || data.SUCCESS) {
                        $('#here_table').html('');
                        properties.renderCustomProperties(data);
                    }else{
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
    }

    public renderCustomProperties(data: any): void {
        
        let common = super.getCommon();
        let config = super.getConfig();
        let properties = this;

        $('#here_table').html('');
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
            properties.arrayof_deletebtn_id.push(btn_id);
            let row = $('<tr><td>' + key + '</td><td>' + value + '</td><td><button data-prop=' + key +' id="' + btn_id + '">Delete</button></td></tr>');
            tbody.append(row);
            table.append(tbody);

        });


        $('#here_table').append(table);

        $.each(properties.arrayof_deletebtn_id, function (index, value) {
            $('#' + value).click({ value,properties }, properties.deleteCustomProperty);
        });

        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);
    }

    public readCustomProperties(data?:any):void{

        let common = super.getCommon();
        let config = super.getConfig();
        let properties = this;

        let view_model = {
            fileName: common.fileName.val(),
            password: common.passPdf.val()
        };
        let url2 = config.urls.properties.readCustomerProperties;
        $.ajax({
            type: "post",
            url: url2,
            data: view_model,
            beforeSend: function (xhr: JQueryXHR) {
                $('#here_table').html('Loading...');
            },
            success: function (data) {

                let tp = $.type(data);

                if (tp === 'string') {
                    $('#here_table').html('');
                    common.errorModalDanger.modal('show');
                    common.errorModalMessage.html(data);
                } else {
                    if (data.success || data.SUCCESS) {
                        properties.renderCustomProperties(data);
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);

                    } else {
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

       
    }

    private reinitInputs():void {
        this.title_input    = $('#title_input');
        this.author_input   = $('#author_input');
        this.subject_input  = $('#subject_input');
        this.keywords_input = $('#keywords_input');
    }
}