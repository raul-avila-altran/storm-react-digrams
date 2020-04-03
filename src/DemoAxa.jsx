import Lodash from 'lodash';
import React from 'react';
import { DefaultLinkFactory, DefaultNodeFactory, DefaultNodeModel, DefaultPortModel, DiagramEngine, DiagramWidget, LinkModel } from 'storm-react-diagrams';
// import { workflows } from './../src/workflows/balance_update.json';
import { WorkflowsSelection } from './workflows/WorkflowsSelection';
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
            this.workflowNodes.forEach((nodeW, i) => {
                nodeW.remove();
            });
        }
        this.forceUpdate();
    }
    /**
     * prepare engine config to display diagram canvas
     */
    componentWillMount() {
        this.engine = new DiagramEngine();

        this.engine.registerNodeFactory(new DefaultNodeFactory());
        this.engine.registerLinkFactory(new DefaultLinkFactory());
    }

    /**
     * config type of new Node
     * @param {*} data 
     * @param {*} node 
     * @param {*} nodesCount 
     * @param {*} event 
     */
    configNewNode(data, node, nodesCount, event) {
        if (data.type === 'in') {
            node = new TaskNodeModel('Task: ' + (nodesCount + 1), '#00008f');
            node.addPort(new TaskPortModel(true, 'in-1', 'In'));
            node.addPort(new TaskPortModel(true, 'out-1', 'Out'));
        }
        else {
            node = new DefaultNodeModel('Worklow: ' + (nodesCount + 1), 'red');
            node.addPort(new DefaultPortModel(false, 'out-1', 'Starts'));
        }
        let points = this.engine.getRelativeMousePoint(event);
        node.x = points.x;
        node.y = points.y;
        return node;
    }

    /**
     * carga Elemento en Canvas
     */
    dragElement(event) {
        let data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
        let nodesCount = Lodash.keys(this.engine.getDiagramModel().getNodes()).length;
        this.workflowNodes.push( this.engine.getDiagramModel().addNode(this.configNewNode(data, null, nodesCount, event)));
        this.forceUpdate();
    }

    /**
     * display the selected workflow on the diagram
     */
    drawElements(e, newWorkflows) {
        this.componentWillMount();
        this.auxPointX = this.initialPointX;
        this.auxPointY = this.initialPointY;
        let lastWorkflowPort, lastTaskPort = null;
        let currentWorkflowPort;
        if (newWorkflows != null) {
            newWorkflows.forEach((element, i) => {
                ({ currentWorkflowPort, lastTaskPort, lastWorkflowPort } = this.drawNewWorfklow(element, currentWorkflowPort, lastTaskPort, lastWorkflowPort, i));
            });
            this.forceUpdate();
        }
    }

    drawNewTasks(element, currentWorkflowPort, lastTaskPort) {
        element.tasks.forEach((task, j) => {
            let nodeTask = new TaskNodeModel(task.name, '#00008f');
            nodeTask.x = this.auxPointX += this.marginX;
            nodeTask.y = this.auxPointY;
            this.engine.getDiagramModel().addNode(nodeTask);
            this.workflowNodes.push(nodeTask);
            this.linkPortsTask(j, currentWorkflowPort, nodeTask.addPort(new TaskPortModel(true, 'in', 'Depends on')), lastTaskPort);
            lastTaskPort = nodeTask.addPort(new TaskPortModel(false, 'out', 'Waiting Tasks'));
        });
        return lastTaskPort;
    }

    drawNewWorfklow(element, currentWorkflowPort, lastTaskPort, lastWorkflowPort, i) {
        let nodeWorkflow = new DefaultNodeModel(element.name, 'red');
        currentWorkflowPort = nodeWorkflow.addPort(new DefaultPortModel(false, 'Starts'));
        this.engine.getDiagramModel().addNode(nodeWorkflow);
        this.workflowNodes.push(nodeWorkflow);
        lastTaskPort = this.drawNewTasks(element, currentWorkflowPort, lastTaskPort);
        lastWorkflowPort = this.linkPortsWorkflow(i, new LinkModel(), lastWorkflowPort, currentWorkflowPort);
        this.auxPointX = this.initialPointX;
        nodeWorkflow.y = this.auxPointY;
        this.auxPointY += this.marginY;
        return { currentWorkflowPort, lastTaskPort, lastWorkflowPort };
    }
   
    /**
     * set a new link for the task
     * @param {*} j 
     * @param {*} currentWorkflowPort 
     * @param {*} taskPort1 
     * @param {*} lastTaskPort 
     */
    linkPortsTask(j, currentWorkflowPort, taskPort1, lastTaskPort) {
        let linkTask = new LinkModel();
        let checkFirst = j > 0;
        linkTask.setSourcePort((!checkFirst) ? currentWorkflowPort : lastTaskPort);
        linkTask.setTargetPort(taskPort1);
        this.engine.getDiagramModel().addLink(linkTask);
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
     * renders the workflow selection
     */
    render() {
        return (

            <div className="content">
                <div className="top"><h1><label>Workflow Visualizer</label></h1></div>
                <div class="menu">
                    <p><WorkflowsSelection handleChange={this.drawElements.bind(this, this.value)}></WorkflowsSelection></p>
                </div>
                <TrayWidget>
                    <TrayItemWidget model={{ type: 'out' }} name="Workflow" color="red" />
                    <TrayItemWidget model={{ type: 'in' }} name="Task" color="#00008f" />
                </TrayWidget>
                <button onClick={() => { this.clearDiagram(this.workflowNodes,this.engine) }}> clear </button>
                <div
                    className="diagram-layer"
                    onDrop={event => { this.dragElement(event) }
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