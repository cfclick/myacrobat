import { Base } from "./Base";

export class Stamp extends Base {

    //buttons
	add_stamp_btn = $('#add_stamp_btn');

    //inputs
    s_x1 : any;
    s_y1 : any;
    s_x2 : any;
    s_y2 : any;
    s_page : any;
    stamp_note : any;
    stamp_type : any;

    constructor() {
        super();

        //buttons
        this.add_stamp_btn = $('#add_stamp_btn');

        //inputs
        this.s_x1 = $("#s_x1");
        this.s_y1 = $("#s_y1");
        this.s_x2 = $("#s_x2");
        this.s_y2 = $("#s_y2");
        this.s_page = $("#s_page");
        this.stamp_note = $("#stamp_note");
        this.stamp_type = $("#stamp_type");

        this.setEventListeners();
    }

    protected setEventListeners(event?: Event): void {

        let common = super.getCommon();
        let config = super.getConfig();
        let stamp = this;

        stamp.add_stamp_btn.on('click', function (e) {
            let view_model = {
                newuserpassword: common.newuserpassword.val()
                , x1: stamp.s_x1.val()
                , y1: stamp.s_y1.val()
                , x2: stamp.s_x2.val()
                , y2: stamp.s_y2.val()
                , pages: stamp.s_page.val()
                , fileName: common.fileName.val()
                , type: $("#stamp_type").find(":selected").text()
                , typeValue: $("#stamp_type").find(":selected").val()
                , note: stamp.stamp_note.val()
            };
            let msg = stamp.validate(view_model);
            if (msg == "") {

                var url = config.urls.stamp.add;

                $.ajax({
                    type: "post",
                    url: url,
                    data: view_model,
                    beforeSend: function (xhr:JQueryXHR) {
                        common.action_label.html('Adding stamp');
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
                                stamp.preview(fileName, true);
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
                        common.errorModalMessage.html(objRequest);
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

        if (model.pages == "") {
            message += "Number of pages to apply the stamp is required.<br>";
        }

        if (model.typeValue == "") {
            message += "Stamp type is required.<br>";
        }

        return message;
    }


}