import { DefaultPortModel } from 'storm-react-diagrams';
import Lodash from 'lodash';

export class TaskPortModel extends DefaultPortModel {
	position: string | 'top' | 'bottom' | 'left' | 'right';

	serialize() {
		return Lodash.merge(super.serialize(), {
			position: this.position
		});
	}

	deSerialize(data: any) {
		super.deSerialize(data);
		this.position = data.position;
	}
}
