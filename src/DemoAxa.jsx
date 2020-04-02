import Lodash from 'lodash';
import React from 'react';
import { DefaultLinkFactory, DefaultNodeFactory, DefaultNodeModel, DefaultPortModel, DiagramEngine, DiagramWidget, LinkModel } from 'storm-react-diagrams';
// import { workflows } from './../src/workflows/balance_update.json';
import { Workflows } from './workflows/Worfklows';
import { TaskNodeModel } from './components/Nodes/Task/TaskNodeModel';
import { TaskPortModel } from './components/Nodes/Task/TaskPortModel';
import TrayItemWidget from './components/TrayItemWidget';
import TrayWidget from './components/TrayWidget';
import './srd.css';

class DemoAxa extends React.Component {
    //1) setup the diagram engine
    initialPointX = 100;
    initialPointY = 20;
    marginX = 240;
    marginY = 120;
    auxPointX;
    auxPointY;

    workflowNodes = [];

    workflowAxa = null;
    engine = new DiagramEngine();

    /**
     * remove all items from the diagram
     */
    clearDiagram() {
        if (this.workflowNodes.length > 0) {
            this.workflowNodes.each((nodeW, i) => {
                nodeW.remove();
            });
        }
        this.forceUpdate();
    }

    componentWillMount() {
        this.engine = new DiagramEngine();

        this.engine.registerNodeFactory(new DefaultNodeFactory());
        this.engine.registerLinkFactory(new DefaultLinkFactory());
    }

    /**
     * carga Elemento en Canvas
     */
    loadElement(event) {
        let node = null;
        let data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
        let nodesCount = Lodash.keys(this.engine.getDiagramModel().getNodes()).length;
        if (data.type === 'in') {
            node = new TaskNodeModel('Task: ' + (nodesCount + 1), '#00008f');
            node.addPort(new TaskPortModel(true, 'in-1', 'In'));
            node.addPort(new TaskPortModel(true, 'out-1', 'Out'));
        } else {
            node = new DefaultNodeModel('Worklow: ' + (nodesCount + 1), 'red');
            node.addPort(new DefaultPortModel(false, 'out-1', 'Starts'));
        }
        let points = this.engine.getRelativeMousePoint(event);
        node.x = points.x;
        node.y = points.y;
        this.engine.getDiagramModel().addNode(node);
        this.workflowNodes.push(node);
        this.forceUpdate();
    }

    /**
     * display the selected workflow on the diagram
     */
    addElementJsonDefinition(e, newWorkflows) {
        this.componentWillMount();
        this.auxPointX = this.initialPointX;
        this.auxPointY = this.initialPointY;
        let lastWorkflowPort = null;
        let currentWorkflowPort;
        let lastTaskPort = null;
        if (newWorkflows != null) {
            newWorkflows.forEach((element, i) => {
                let nodeWorkflow = new DefaultNodeModel(element.name, 'red');
                currentWorkflowPort = nodeWorkflow.addPort(new DefaultPortModel(false, 'Starts'));
                this.engine.getDiagramModel().addNode(nodeWorkflow);
                this.workflowNodes.push(nodeWorkflow);
                element.tasks.forEach((task, j) => {
                    let nodeTask = null;
                    nodeTask = new TaskNodeModel(task.name, '#00008f');
                    let taskPort1 = nodeTask.addPort(new TaskPortModel(true, 'in', 'Depends on'));
                    let taskPort2 = nodeTask.addPort(new TaskPortModel(false, 'out', 'Waiting Tasks'));
                    nodeTask.x = this.auxPointX += this.marginX;
                    nodeTask.y = this.auxPointY;
                    this.engine.getDiagramModel().addNode(nodeTask);
                    this.workflowNodes.push(nodeTask);
                    this.linkPortsTask(j, currentWorkflowPort, taskPort1, lastTaskPort);
                    lastTaskPort = taskPort2;
                });

                let linkWorkflow = new LinkModel();
                lastWorkflowPort = this.linkPortsWorkflow(i, linkWorkflow, lastWorkflowPort, currentWorkflowPort);
                this.auxPointX = this.initialPointX;
                nodeWorkflow.y = this.auxPointY;
                this.auxPointY += this.marginY;
            });
            this.forceUpdate();
        }
    }
    /**
     * set a new link for the workflow
     * @param {*} i 
     * @param {*} linkWorkflow 
     * @param {*} lastWorkflowPort 
     * @param {*} currentWorkflowPort 
     */
    linkPortsWorkflow(i, linkWorkflow, lastWorkflowPort, currentWorkflowPort) {
        if (i > 0) {
            linkWorkflow.setSourcePort(lastWorkflowPort);
            linkWorkflow.setTargetPort(currentWorkflowPort);
            this.engine.getDiagramModel().addLink(linkWorkflow)
        }
        return currentWorkflowPort;
    }
    /**
     * set a new link for the task
     * @param {*} j 
     * @param {*} currentWorkflowPort 
     * @param {*} taskPort1 
     * @param {*} lastTaskPort 
     * @param {*} newLinks 
     */

    linkPortsTask(j, currentWorkflowPort, taskPort1, lastTaskPort) {
        let linkTask = new LinkModel();
        if (j === 0) {
            linkTask.setSourcePort(currentWorkflowPort);
            linkTask.setTargetPort(taskPort1);
        }
        else {
            linkTask.setSourcePort(lastTaskPort);
            linkTask.setTargetPort(taskPort1);
        }
        this.engine.getDiagramModel().addLink(linkTask);
    }


    /**
     * renders the workflow selection
     */
    render() {
        return (

            <div className="content">
                <div className="top">Workflow Visualizer</div>
                <div class="menu"><p><label>Workflow:&nbsp;</label><Workflows parentCallback={this.addElementJsonDefinition.bind(this, this.value)}></Workflows></p></div>

                <TrayWidget>
                    <TrayItemWidget model={{ type: 'out' }} name="Workflow" color="red" />
                    <TrayItemWidget model={{ type: 'in' }} name="Task" color="#00008f" />
                </TrayWidget>
                <button onClick={this.clearDiagram.bind(this)}> clear </button>
                <div
                    className="diagram-layer"
                    onDrop={event => 
                        { this.loadElement(event) }
                    }
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