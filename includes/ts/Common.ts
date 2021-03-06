export class Common {

    //text
    confirmation_text: any;
    action_label: any;
    errorModalMessage: any;

    //input
    fileName: any;
    fieldName: any;
    passPdf: any;
    newuserpassword: any;

    //modal
    confirmation_modal: any;
    loading_modal: any;
    errorModalDanger: any;
    session_expired_modal: any;

    //Other
    pdf_iframe: any;

    constructor() {       
        //text
        this.confirmation_text  = $('#confirmation_text');
        this.action_label       = $("#action_label");
        this.errorModalMessage  = $('#errorModalMessage');

        //modal
        this.confirmation_modal     = $('#confirmation_modal');
        this.loading_modal          = $('#loading_modal');
        this.errorModalDanger       = $('#errorModalDanger');
        this.session_expired_modal  = $('#session_expired_modal');

        //input
        this.fileName = $('#fileName');
        this.passPdf  = $('#passPdf');
        this.newuserpassword = $('#newuserpassword');

        //other
        this.pdf_iframe = $('#pdf_iframe');
    }
}