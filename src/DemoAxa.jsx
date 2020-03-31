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
import { workflows } from './../src/workflows/claims_notification.json'
import { WorkflowAxa } from './components/Nodes/Workflow/WorkflowAxa'
import './srd.css';

class DemoAxa extends React.Component {
    //1) setup the diagram engine
    initialPointX = 100;
    initialPointY = 0;

    auxPointX;
    auxPointY;

    workflowAxa = null;
    engine = new DiagramEngine();

    loadFromFile(isTask) {
        var node = null;
        var nodesCount = Lodash.keys(this.engine.getDiagramModel().getNodes()).length;
        if (!isTask) {
            node = new DefaultNodeModel('Worklow ' + (nodesCount + 1), 'red');
            node.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
        } else {
            node = new TaskNodeModel('Task ' + (nodesCount + 1), '#00008f');
            node.addPort(new TaskPortModel(true, 'in-1', 'In'));
            node.addPort(new TaskPortModel(true, 'out-1', 'Out'));
        }
        node.x = 350;
        node.y = 200;
        this.engine.getDiagramModel().addNode(node);
        this.forceUpdate();

    }

    ReadJson(path) {
        // http://localhost:3000
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {
                this.workflows = json;
            })
    }

    LoadJsonWorkflow() {
        this.workflowAxa = [];
        workflows.map((element, i) => {
            this.workflowAxa.push(new WorkflowAxa(JSON.parse(JSON.stringify(element))))
        });
        return this.workflowAxa.map((object, i) => <option value={i}>{object.name}</option>);
    }
    renderButtons() {
        return <div class="menu"><p><label>claims_notification.json</label><select onChange={this.loadElement.bind(this, this.value)}><option />{this.LoadJsonWorkflow()}</select></p></div>;
    }

    componentWillMount() {
        this.engine.registerNodeFactory(new DefaultNodeFactory());
        this.engine.registerLinkFactory(new DefaultLinkFactory());
    }

    loadElement(e, params) {
        if (!params) {
            this.addElementFromEvent(e);
        } else {
            this.addElementJsonDefinition(params);
        }
    }

    addElementFromEvent(event) {
        var node = null;
        var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
        var nodesCount = Lodash.keys(this.engine.getDiagramModel().getNodes()).length;
        if (data.type === 'in') {
            node = new TaskNodeModel('Task ' + (nodesCount + 1), '#00008f');
            node.addPort(new TaskPortModel(true, 'in-1', 'In'));
            node.addPort(new TaskPortModel(true, 'out-1', 'Out'));
        } else {
            node = new DefaultNodeModel('Worklow ' + (nodesCount + 1), 'red');
            node.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
        }
        var points = this.engine.getRelativeMousePoint(event);
        node.x = points.x;
        node.y = points.y;
        this.engine.getDiagramModel().addNode(node);
        this.forceUpdate();
    }

    addElementJsonDefinition(params) {
        this.auxPointX = this.initialPointX;
        this.auxPointY = this.initialPointY;
        var lastWorkflowPort = null;
        var currentWorkflowPort;
        var lastTaskPort = null;
        this.workflowAxa.map((element, i) => {
            var nodeWorkflow = new DefaultNodeModel(element.name, 'red');
            currentWorkflowPort = nodeWorkflow.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
            element.tasks.map((task, j) => {
                var nodeTask = null;
                nodeTask = new TaskNodeModel(task.name, '#00008f');
                var taskPort1 = nodeTask.addPort(new TaskPortModel(true, 'in-1', 'In'));
                var taskPort2 = nodeTask.addPort(new TaskPortModel(true, 'out-1', 'Out'));
                nodeTask.x = this.auxPointX += 150;
                nodeTask.y = this.auxPointY;
                this.engine.getDiagramModel().addNode(nodeTask);
                this.forceUpdate();
                var linkTask = new LinkModel();
                if(j==0){
                    linkTask.setSourcePort(currentWorkflowPort);
                    linkTask.setTargetPort(taskPort1);
                }else{
                    linkTask.setSourcePort(lastTaskPort);
                    linkTask.setTargetPort(taskPort2);
                }
                lastTaskPort = taskPort2;
            });
            var linkWorkflow = new LinkModel();
            if(i>0){
                linkWorkflow.setSourcePort(lastWorkflowPort);
                linkWorkflow.setTargetPort(currentWorkflowPort);
            }else{
                lastWorkflowPort = currentWorkflowPort;
            }
            this.auxPointX = this.initialPointX;
            nodeWorkflow.y = this.auxPointY;
            this.engine.getDiagramModel().addNode(nodeWorkflow);
            this.forceUpdate();
            this.auxPointY += 120;
        });
        this.forceUpdate();
    }

loadWorkflowFiles() {
    this.workflowAxa = [];
    workflows.map((element, i) => {
        this.workflowAxa.push(new WorkflowAxa(JSON.parse(JSON.stringify(element))))
    });
}
render() {
    return (
        <div className="conte{nt">
            {this.renderButtons()}
            <TrayWidget>
                <TrayItemWidget model={{ type: 'in' }} name="Task" color="#00008f" />
                <TrayItemWidget model={{ type: 'out' }} name="Workflow" color="red" />
            </TrayWidget>
            <div
                className="diagram-layer"
                onDrop={event => {
                    { this.loadElement(event) }
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