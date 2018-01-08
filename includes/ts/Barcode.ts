import { Base } from "./Base";

export class Barcode extends Base {

    //buttons
    add_barcode_btn : any;

    //inputs
    b_page : any;
    textToEncode : any;

    constructor() {
        super();

        //buttons
        this.add_barcode_btn = $('#add_barcode_btn');

        //inputs
        this.b_page = $("#b_page");
        this.textToEncode = $("#textToEncode");

        this.setEventListeners();
    }

    protected setEventListeners(event?: Event): void {

        let common = super.getCommon();
        let config = super.getConfig();
        let barcode = this;
        
        barcode.add_barcode_btn.on('click', function (e:Event) {

            let view_model = {
                pages: barcode.b_page.val()
                , fileName: common.fileName.val()
                , textToEncode: barcode.textToEncode.val()
            };

            let msg = barcode.validate(view_model);
            if (msg == "") {

                let url = config.urls.barcode.add;

                $.ajax({
                    type: "post",
                    url: url,
                    data: view_model,
                    beforeSend: function (xhr:JQueryXHR) {
                        common.action_label.html('Adding Barcode');
                        common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                    },
                    success: function (data) {
                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);

                        var tp = $.type(data);

                        if (tp === 'string') {
                            common.session_expired_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                        } else {
                            if (data.fileName)
                                var fileName = data.fileName;
                            else
                                var fileName = data.FILENAME;

                            if (data.success || data.SUCCESS) {
                                barcode.preview(fileName, true);
                            } else {
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

            } else {
                toastr.error(msg);
            }
        });
    }


    private validate(model:any):string {

        let message = "";
        if (model.textToEncode == "") {
            message += "Text To Encode is required<br>";

        }

        if (model.pages == "") {
            message += "Number of pages to apply the barcode is required.<br>";
        }

        return message;
    }
}