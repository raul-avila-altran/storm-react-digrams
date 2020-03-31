import {
  // DiagramWidget,
  // DiagramEngine,
  // DefaultNodeFactory,
  // DefaultLinkFactory,
  // DiagramModel,
  DefaultNodeModel,
  DefaultPortModel
  // LinkModel
} from "storm-react-diagrams";

export const nodes = {
  NaturalGasPipeline: {
    node: "NaturalGasPipeline",
    color: "blue",
    ports: [
      {
        isInput: false,
        name: "ngp-id",
        label: "id: UUID",
        targetPort: "geoline-metadata"
      },
      {
        isInput: false,
        name: "ngp-created_at",
        label: "created_at: timestamp"
      },
      {
        isInput: true,
        name: "ngp-typepipe",
        label: "typepipe: NaturalGasPipelineTypepipe",
        sourcePort: "ngptypepipe-enum"
      },
      {
        isInput: false,
        name: "ngp-georef",
        label: "georef: UUID",
        targetPort: "geoline-id"
      }
    ]
  },

  GeoLine: {
    name: "GeoLine",
    color: "yellow",
    ports: [
      {
        isInput: true,
        name: "geoline-id",
        label: "id UUID",
        sourcePort: "ngp-georef"
      },
      {
        isInput: true,
        name: "geoline-metadata",
        label: "metadata_id: UUID",
        sourcePort: "ngp-id"
      },
      {
        isInput: true,
        name: "geolinetype",
        label: "type: GeoLineType"
      },
      {
        isInput: false,
        name: "geoline-feature",
        label: "feature: GEOGRAPHY(Linestring)"
      }
    ]
  },
  GeoLineType: {
    name: "GeoLineType",
    color: "red",
    targetPort: "geoline-type",
    ports: [
      {
        isInput: false,
        name: "geolinetype-hvl",
        label: "HIGH_VOLTAGE_LINE"
      },
      {
        isInput: false,
        name: "geolinetype-ngp",
        label: "NATURAL_GAS_PIPELINE"
      }
    ]
  },
  NaturalGasPipelineType: {
    name: "NaturalGasPipelineType",
    color: "red",
    targetPort: "ngp-typepipe",
    ports: [
      { isInput: false, name: "ngptypepipe-enum", label: "INTERSTATE" },
      { isInput: false, name: "ngptypepipe-enum", label: "INTRASTATE" },
      { isInput: false, name: "ngptypepipe-enum", label: "GATHERING" },
      { isInput: false, name: "ngptypepipe-enum", label: "OTHER" }
    ]
  }
};

export const nodeArr = Object.keys(nodes);
const node = {};

export function getNodes(model) {
  return nodeArr.map(k => {
    node[k] = new DefaultNodeModel(nodes[k].name, nodes[k].color);
    nodes[k].ports.map(p => {
      node[k].ports = new DefaultPortModel(p.input, p.name, p.label);
      return node[k].ports;
    });
    return model.addNode(nodes[k]);
  });
}
