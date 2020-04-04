export class RoutesAxa {
    constructor(params) {
        this.type = params.type;
        this.clientId = params.clientId;
        this.paymentType = params.paymentType;
        this.workflow = params.workflow;
        this.sequence = params.sequence;
        this.partner = params.partner;
        this.pageId = params.pageId;
        this.paymentGateway = params.paymentGateway;
    }
}
