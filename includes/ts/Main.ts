import { Config } from "./Config";
import { Base } from "./Base";
export class Main extends Base {
   // main:this;
    config:Config;
   
    url_input : any;
    uploaded_file: any;

    //button
    upload_pdf_btn: any;
    confirm_yes: any;
    urltoPDF_btn: any;
    btnExpiredOk: any;
    password_apply_btn: any;

    //modal

    //DIV/span/label
    fileUploadModal_body: any;
    preload_div: any;

    constructor() {
        super();      
        
        this.url_input = $('#url_input');
        this.uploaded_file = $('#uploaded_file');

        //button
        this.upload_pdf_btn = $('#upload_pdf_btn');
        this.confirm_yes = $('#confirm_yes');
        this.urltoPDF_btn = $('#urltoPDF_btn');
        this.btnExpiredOk = $('#btnExpiredOk');
        this.password_apply_btn = $('#password_apply_btn');

        //modal


        //DIV/span/label
        this.fileUploadModal_body = $('#fileUploadModal_body');       
        this.preload_div = $("#preload_div");
       
        this.setEventListeners();
    }
    
    protected setEventListeners( event?:Event ):void {
        let config = super.getConfig();
        let common = super.getCommon();
        let main = this;

        common.loading_modal.on('hidden.bs.modal', function () {
            $(this).data('bs.modal', null);
        });

        common.confirmation_modal.on('shown.bs.modal', function () {
          //  let redact = new Redact();
        });

        this.confirm_yes.on('click', function (event:Event) {
            let view_model = {
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

    }

    public ping():string{
        return "Main class constructed."
    }

}