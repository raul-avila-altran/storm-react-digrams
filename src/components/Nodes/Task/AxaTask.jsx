export class AxaTask {
    type;
	waitForReturn;
	queue;
    options;
    dependsOn;
    
    constructor(type,waitForReturn,queue,options,dependsOn){
            this.type = type;
            this.waitForReturn=waitForReturn;
            this.queue = queue;
            this.options = options;
            this.dependsOn = dependsOn;
    }
}