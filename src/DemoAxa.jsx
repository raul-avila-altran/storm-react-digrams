import React from 'react';
import Lodash from 'lodash';
import {
    DiagramWidget,
    DiagramEngine,
    DefaultNodeFactory,
    DefaultLinkFactory,
    DiagramModel,
    DefaultNodeModel,
    DefaultPortModel,
    LinkModel
} from 'storm-react-diagrams';
import { TaskNodeModel } from './components/Nodes/Task/TaskNodeModel';
import { TaskPortModel } from './components/Nodes/Task/TaskPortModel';
import TrayWidget from './components/TrayWidget';
import TrayItemWidget from './components/TrayItemWidget';
import {JsonService} from './components/Utils/JsonService';
import './srd.css';

class DemoAxa extends React.Component {
    //1) setup the diagram engine
    componentWillMount() {
        this.engine = new DiagramEngine();
        this.engine.registerNodeFactory(new DefaultNodeFactory());
        this.engine.registerLinkFactory(new DefaultLinkFactory());
    }
    loadFilesFromList() {
        debugger;
        var j =  new JsonService();        

    }
    render() {
        return (
            <div className="content">
                <div>
                    <JsonService />
                    
                </div>
                <TrayWidget>
                    <TrayItemWidget model={{ type: 'in' }} name="Task" color="green" />
                    <TrayItemWidget model={{ type: 'out' }} name="Workflow" color="yellow" />
                </TrayWidget>
                <div
                    className="diagram-layer"
                    onDrop={event => {
                        var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
                        var nodesCount = Lodash.keys(this.engine.getDiagramModel().getNodes()).length;
                        var node = null;
                        if (data.type === 'in') {
                            node = new TaskNodeModel('Task ' + (nodesCount + 1), 'green');
                            node.addPort(new TaskPortModel(true, 'in-1', 'In'));
                            node.addPort(new TaskPortModel(true, 'out-1', 'Out'));
                        } else {
                            node = new DefaultNodeModel('Worklow ' + (nodesCount + 1), 'yellow');
                            node.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
                        }
                        var points = this.engine.getRelativeMousePoint(event);
                        node.x = points.x;
                        node.y = points.y;
                        this.engine.getDiagramModel().addNode(node);
                        this.forceUpdate();
                    }}
                    onDragOver={event => {
                        event.preventDefault();
                    }}
                >
                    <DiagramWidget diagramEngine={this.engine} />
                </div>
            </div>
        );
    }
}
export default DemoAxa;