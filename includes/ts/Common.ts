export class Common {

    //text
    confirmation_text: any;
    action_label: any;
    errorModalMessage: any;

    //input
    fileName: any;
    passPdf: any;

    //modal
    confirmation_modal: any;
    loading_modal: any;
    errorModalDanger: any;

    //Other
    pdf_iframe: any;

    constructor() {       
        //text
        this.confirmation_text  = $('#confirmation_text');
        this.action_label = $("#action_label");
        this.errorModalMessage = $('#errorModalMessage');

        //modal
        this.confirmation_modal = $('#confirmation_modal');
        this.loading_modal      = $('#loading_modal');
        this.errorModalDanger   = $('#errorModalDanger');

        //input
        this.fileName           = $('#fileName');
        this.passPdf            = $('#passPdf');

        //other
        this.pdf_iframe         = $('#pdf_iframe');
    }
}