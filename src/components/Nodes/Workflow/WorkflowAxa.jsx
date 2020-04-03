export class WorkflowAxa {
    name;
    type;
    removeAtEnd;
    simulatedType;
    tasks = {};

    constructor(params) {
        this.name = params.name;
        this.type = params.type;
        this.removeAtEnd = params.removeAtEnd;
        this.tasks = params.tasks;
    }
}