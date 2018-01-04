import { Config } from "./Config";
import { Base } from "./Base";
export class Main extends Base {

    config:Config;
    newuserpassword: any;
    url_input : any;
    uploaded_file: any;

    //button
    upload_pdf_btn: any;
    confirm_yes: any;
    urltoPDF_btn: any;
    btnExpiredOk: any;
    password_apply_btn: any;

    //modal
    confirmation_modal: any;
    fileUploadModal: any;
    loading_modal: any;
    errorModalDanger: any;
    session_expired_modal: any;

    //DIV/span/label
    fileUploadModal_body: any;
    confirmation_text: any;
    preload_div: any;
    action_label: any;
    errorModalMessage: any;

    constructor() {
        super();      

        this.config = new Config();

        this.newuserpassword = $('#newuserpassword');
        this.url_input = $('#url_input');
        this.uploaded_file = $('#uploaded_file');

        //button
        this.upload_pdf_btn = $('#upload_pdf_btn');
        this.confirm_yes = $('#confirm_yes');
        this.urltoPDF_btn = $('#urltoPDF_btn');
        this.btnExpiredOk = $('#btnExpiredOk');
        this.password_apply_btn = $('#password_apply_btn');

        //modal
        this.confirmation_modal = $('#confirmation_modal');
        this.fileUploadModal = $('#fileUploadModal');
        this.loading_modal = $('#loading_modal');
        this.errorModalDanger = $('#errorModalDanger');
        this.session_expired_modal = $('#session_expired_modal');

        //DIV/span/label
        this.fileUploadModal_body = $('#fileUploadModal_body');
        this.confirmation_text = $('#confirmation_text');
        this.preload_div = $("#preload_div");
        this.action_label = $("#action_label");
        this.errorModalMessage = $('#errorModalMessage');
       
        this.setEventListeners();
    }
    
    public setEventListeners( event?:Event ):void {

        this.loading_modal.on('hidden.bs.modal', function () {
            $(this).data('bs.modal', null);
        });

        this.confirmation_modal.on('shown.bs.modal', function () {
          //  let redact = new Redact();
        });

        this.confirm_yes.on('click', function (event:Event) {
           /* var view_model = {
                fileName: workBench.fileName.val(),
                password: workBench.passPdf.val()
            };

            var url = main.config.urls.sanitize.apply;
            $.ajax({
                type: "post",
                url: url,
                data: view_model,
                beforeSend: function (xhr) {
                    main.action_label.html('Sanitizing');
                    main.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                },
                success: function (data) {

                    if (data.fileName)
                        var fileName = data.fileName;
                    else
                        var fileName = data.FILENAME;

                    setTimeout(function () { main.loading_modal.modal('hide'); }, 1500);
                    if (data.success || data.SUCCESS)
                        workBench.preview(fileName, true);
                    else {
                        main.errorModalDanger.modal('show');
                        if (data.showerror)
                            main.errorModalMessage.html(data.showerror);
                        else
                            main.errorModalMessage.html(data);
                    }
                },
                error: function (objRequest, strError) {
                    setTimeout(function () { main.loading_modal.modal('hide'); }, 1500);
                    main.errorModalDanger.modal('show');
                    main.errorModalMessage.html(objRequest);
                },
                async: true
            });
*/
            this.confirmation_modal.modal('hide');
        });

    }

    public ping():string{
        return "Main class constructed."
    }

}