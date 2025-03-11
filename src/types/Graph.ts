export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: string;
  color: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  text: string;
}

export interface GraphState {
  nodes: GraphNode[];
  links: GraphLink[];
  extraInfo: null | unknown;
  loading: boolean;
  error: string | null;

  fetchNodesColors: () => string[];
  fetchNodeTypes: () => string[];
  changeGraphNodeColor: (nodeId: string, newColor: string) => void;
  changeGraphLegend: (nodeType: string, newColor: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface GraphConfigState {
  width: number; // 图表的宽度（单位：像素）
  height: number; // 图表的高度（单位：像素）
  nodeRadius: number; // 节点（点）的半径大小
  chargeStrength: number; // 节点之间的斥力强度（负值表示斥力，正值表示引力）
  nodeDefaultColor: string; // 节点的默认颜色（十六进制颜色值）
  linkDefaultColor: string; // 连接线的默认颜色（十六进制颜色值）
  linkDistance: number; // 连接线的默认长度（影响力的布局）
  linkWidth: number; // 连接线的默认宽度
  isShowLinkLabel: boolean; // 是否显示连接线标签
  maxZoom: number; // 最大缩放比例
  minZoom: number; // 最小缩放比例
  zoomStep: number; // 缩放的步长（影响缩放的速度）
  /**
   * 更新图表配置的方法
   * @param newConfig - 需要更新的部分配置（Partial<GraphConfig> 表示可以只提供部分属性）
   */
  updateConfig: (newConfig: Partial<GraphConfigState>) => void;
}
