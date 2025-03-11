import { create } from "zustand";
import { GraphState } from "@/types/graph";
import { convertDepressionArrayToGraph } from "@/utils/graphUtil";
import { mockDepressions } from "@/test/mockGraphData";

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: convertDepressionArrayToGraph(mockDepressions).nodes,
  links: convertDepressionArrayToGraph(mockDepressions).links,
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
