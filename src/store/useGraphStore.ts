import { create } from "zustand";
import { GraphLink, GraphNode, GraphState } from "@/types/graph";
import { generateCompleteGraph } from "@/utils/depressionUtils";
import {
  diseasesData,
  medicationsData,
  risksData,
  symptomsData,
  therapiesData,
} from "@/test/mockGraphData";

const entities = [
  diseasesData,
  symptomsData,
  medicationsData,
  risksData,
  therapiesData,
];
let mockNodes: GraphNode[] = [],
  mockLinks: GraphLink[] = [];
const graphData = generateCompleteGraph(entities);
mockNodes = graphData.nodes;
mockLinks = graphData.links;

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: mockNodes,
  links: mockLinks,
  extraInfo: null,
  loading: false,
  error: null,
  setLoading: (loading: boolean) => {
    set((state) => ({
      ...state,
      loading,
    }));
  },
  setError: (error: string | null) => {
    set((state) => ({
      ...state,
      error,
    }));
  },

  fetchNodeTypes: () => {
    return get().nodes.map((node) => node.type);
  },
  fetchNodesColors: () => {
    return get().nodes.map((node) => node.color);
  },
  changeGraphNodeColor: (nodeId, newColor) => {
    const newNodes = get().nodes.map((node) =>
      node.id === nodeId ? { ...node, color: newColor } : node,
    );
    set((state) => ({
      ...state,
      nodes: newNodes,
    }));
  },
  changeGraphLegend: (nodeType, newColor) => {
    const newNodes = get().nodes.map((node) =>
      node.type === nodeType ? { ...node, color: newColor } : node,
    );
    set((state) => ({
      ...state,
      nodes: newNodes,
    }));
  },
}));
