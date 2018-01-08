import { Base } from "./Base";

export class DigitalSignature extends Base {

    //Button
	add_signature_field_btn : any;

    fileName : any;
    d_x1 : any;
    d_y1 : any;
    d_x2 : any;
    d_y2 : any;
    page : any;
    fieldName : any;

    constructor() {
        super();
        
        //buttons
        this.add_signature_field_btn = $('#add_signature_field_btn');

        this.d_x1 = $("#d_x1");
        this.d_y1 = $("#d_y1");
        this.d_x2 = $("#d_x2");
        this.d_y2 = $("#d_y2");
        this.page = $("#page");
        this.fieldName = $("#fieldName");

        this.setEventListeners();
    }

    protected setEventListeners(event?: Event): void {

        let common = super.getCommon();
        let config = super.getConfig();
        let digitalSignature = this;

        digitalSignature.add_signature_field_btn.on('click', function (e:Event) {

            let view_model = {
                newuserpassword: common.newuserpassword.val()
                , x1: digitalSignature.d_x1.val()
                , y1: digitalSignature.d_y1.val()
                , x2: digitalSignature.d_x2.val()
                , y2: digitalSignature.d_y2.val()
                , page: digitalSignature.page.val()
                , fieldName: digitalSignature.fieldName.val()
                , fileName: common.fileName.val()
            };

            let msg = digitalSignature.validate( view_model );
            if (msg == "") {
                var url = config.urls.digitalsignature.addField;

                $.ajax({
                    type: "post",
                    url: url,
                    data: view_model,
                    beforeSend: function (xhr:JQueryXHR) {
                        common.action_label.html('Adding signature field');
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
                                digitalSignature.preview(fileName, true);
                                toastr.info('Signature field will not show up if you are using Chrome/Firefox/Safari browesers! download the PDF and open it using Adobe Acrobat Reader.');
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
                        toastr.danger('Exception!, our development team will look into this issue.');
                    },
                    async: true
                });
            } else {
                toastr.error(msg);
            }

        });
    }

    private validate( model:any ):string {

        let message = "";
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
    }
}