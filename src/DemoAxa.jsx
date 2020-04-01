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
    initialPointY = 20;

    auxPointX;
    auxPointY;

    workflowNodes = [];

    workflowAxa = null;
    engine = new DiagramEngine();

    clearDiagram() {
        debugger;
        // this.engine.getDiagramModel().clearDiagram();
        if (this.workflowNodes.length>0) {
            this.workflowNodes.map((nodeW, i) => {
                nodeW.remove();
            });
        }
        this.forceUpdate();
    }

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
        this.workflowNodes.push(node);
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
            this.engine.getDiagramModel().addNode(nodeWorkflow);
            this.workflowNodes.push(nodeWorkflow);
            element.tasks.map((task, j) => {
                var nodeTask = null;
                nodeTask = new TaskNodeModel(task.name, '#00008f');
                var taskPort1 = nodeTask.addPort(new TaskPortModel(true, 'in-1', 'In'));
                var taskPort2 = nodeTask.addPort(new TaskPortModel(true, 'out-1', 'Out'));
                nodeTask.x = this.auxPointX += 150;
                nodeTask.y = this.auxPointY;
                this.engine.getDiagramModel().addNode(nodeTask);
                this.workflowNodes.push(nodeTask);
                this.linkPortsTask(j, currentWorkflowPort, taskPort1, lastTaskPort);
                lastTaskPort = taskPort2;
                this.forceUpdate();
            });
           
            var linkWorkflow = new LinkModel();
            lastWorkflowPort = this.linkPortsWorkflow(i, linkWorkflow, lastWorkflowPort, currentWorkflowPort);
            
            this.auxPointX = this.initialPointX;
            nodeWorkflow.y = this.auxPointY;
            this.forceUpdate();
            this.auxPointY += 120;
        });
        this.forceUpdate();
    }

    linkPortsWorkflow(i, linkWorkflow, lastWorkflowPort, currentWorkflowPort) {
        if (i > 0) {
            linkWorkflow.setSourcePort(lastWorkflowPort);
            linkWorkflow.setTargetPort(currentWorkflowPort);
            this.engine.getDiagramModel().addLink(linkWorkflow);
        }
        return currentWorkflowPort;
    }

    linkPortsTask(j, currentWorkflowPort, taskPort1, lastTaskPort) {
        var linkTask = new LinkModel();
        if (j == 0) {
            linkTask.setSourcePort(currentWorkflowPort);
            linkTask.setTargetPort(taskPort1);
        }
        else {
            linkTask.setSourcePort(lastTaskPort);
            linkTask.setTargetPort(taskPort1);
        }
        this.engine.getDiagramModel().addLink(linkTask);
    }

    loadWorkflowFiles() {
        this.workflowAxa = [];
        workflows.map((element, i) => {
            this.workflowAxa.push(new WorkflowAxa(JSON.parse(JSON.stringify(element))))
        });
    }

    renderWorkflows() {
        return <div class="menu"><p><label>Workflow:&nbsp;</label><select onChange={this.loadElement.bind(this, this.value)}><option />{this.LoadJsonWorkflow()}</select></p></div>;
    }

    render() {
        return (
            <div className="content">
                <div className="top">Workflow Visualizer</div>
                {this.renderWorkflows()}
                <TrayWidget>
                    <TrayItemWidget model={{ type: 'out' }} name="Workflow" color="red" />
                    <TrayItemWidget model={{ type: 'in' }} name="Task" color="#00008f" />
                </TrayWidget>
                <button onClick={this.clearDiagram.bind(this)}> clear </button>
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