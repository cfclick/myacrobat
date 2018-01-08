import { Base } from "./Base";
import { Config } from "./Config";
import { Common } from "./Common";

export class Redact extends Base {

    //Classes
    config : Config;
    common : Common;

    //buttons
	redact_apply_btn : any;

    //inputs 
    r_x1 : any;
    r_y1 : any;
    r_x2 : any;
    r_y2 : any;
    r_page : any;

    constructor() {
        super();
        //buttons
        this.redact_apply_btn = $('#redact_apply_btn');

        //inputs
        this.r_x1 = $("#r_x1");
        this.r_y1 = $("#r_y1");
        this.r_x2 = $("#r_x2");
        this.r_y2 = $("#r_y2");
        this.r_page = $("#r_page");

        this.setEventListeners();
    }

    protected setEventListeners(event?: Event): void {

        let common = super.getCommon();
        let config = super.getConfig();
        let redact = this;

        redact.redact_apply_btn.on('click', function (e:Event) {
            var view_model = {
                newuserpassword: common.newuserpassword.val()
                , x1: redact.r_x1.val()
                , y1: redact.r_y1.val()
                , x2: redact.r_x2.val()
                , y2: redact.r_y2.val()
                , page: redact.r_page.val()
                , fileName: common.fileName.val()
            };

            let msg = redact.validate(view_model);
            if (msg == "") {
                var url = config.urls.redact.add;

                $.ajax({
                    type: "post",
                    url: url,
                    data: view_model,
                    beforeSend: function (xhr:JQueryXHR) {
                        common.action_label.html('Redacting');
                        common.loading_modal.modal({ show: true, backdrop: 'static', keyboard: false });
                    },
                    success: function (data) {

                        setTimeout(function () { common.loading_modal.modal('hide'); }, 1500);

                        if (typeof data == 'string') {
                            common.session_expired_modal.modal('show');
                        } else {
                            if (data.fileName)
                                var fileName = data.fileName;
                            else
                                var fileName = data.FILENAME;

                            if (data.success || data.SUCCESS) {
                                redact.preview(fileName, true);
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


    private validate (model:any):string {
     
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

        if (model.page == "") {
            message += "Page number is required.<br>";
        }

        if (Number(model.page) <= 0) {
            message += "Enter a positive number for page.<br>";
        }
        return message;
    }
}