import React from "react";
import {
  DiagramWidget,
  DiagramEngine,
  DefaultNodeFactory,
  DefaultLinkFactory,
  DiagramModel,
  DefaultNodeModel,
  DefaultPortModel,
  LinkModel
} from "storm-react-diagrams";
import { getNodes } from "./data";

import "./srd.css";

class DemoOne extends React.Component {
  componentWillMount() {
    this.engine = new DiagramEngine();

    this.engine.registerNodeFactory(new DefaultNodeFactory());
    this.engine.registerLinkFactory(new DefaultLinkFactory());

    const model = new DiagramModel();
    const node = getNodes(model);

    const link1 = new LinkModel();
    link1.setSourcePort(node["NaturalGasPipelineType"]);
    link1.setTargetPort(node["NaturalGasPipeline"].ports[2]);
    model.addLink(link1);

    this.engine.setDiagramModel(model);
  }
  render() {
    return (
      <div>
        <DiagramWidget diagramEngine={this.engine} />
      </div>
    );
  }
}

export default DemoOne;
