import { DefaultNodeModel } from 'storm-react-diagrams';
import { TaskPortModel } from './TaskPortModel';
import { AxaTask } from './AxaTask';

export class TaskNodeModel extends DefaultNodeModel {
	
	axaTask;
	
	constructor(name, color, task) {
		super(name,color);
		this.addPort(new TaskPortModel('left'));
		this.axaTask = task;
	}
}
