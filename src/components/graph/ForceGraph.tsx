'use client'

import React, { useEffect, useRef, useMemo, useCallback, useState } from "react";
import * as d3 from "d3";
import { GraphLink, GraphNode } from "../../types/Graph";
import ControlPanel from "./ForceGraphControlPanel";
import ColorPicker from "../common/ColorPicker";
import Dropdown from "../common/Dropdown";
import GraphLegend from "./GraphLegend";
import { getNodesColors, getNodesTypes } from "@/utils/GraphUtil";
import { showToast } from "../common/Toast";

interface ForceGraphProps {
  width?: number;
  height?: number;
  nodes: GraphNode[];
  links: GraphLink[];
  nodeColorConfig: Record<string, string>;
  initialParams?: {
    nodeRadius: number;
    linkDistance: number;
    chargeStrength: number;
  };
}

/**
 * 默认图表配置参数
 */
const DEFAULT_PARAMS = {
  nodeRadius: 10,
  linkDistance: 100,
  chargeStrength: -600
};

/**
 * Force Graph 组件
 * 基于 D3.js 实现的交互式网络图可视化组件
 * 支持节点拖拽、缩放、平移等操作
 * 
 * @component
 * @param {ForceGraphProps} props - 组件属性
 * @returns {React.ReactElement} Force Graph 组件
 */
const ForceGraph: React.FC<ForceGraphProps> = ({
  width = 800,
  height = 800,
  nodes,
  links,
  initialParams = DEFAULT_PARAMS
}) => {
  // 状态管理
  const [graphParams, setGraphParams] = useState({
    nodeRadius: initialParams.nodeRadius,
    linkDistance: initialParams.linkDistance,
    chargeStrength: initialParams.chargeStrength,
    isShowLinkLabel: false,
  });

  const [nodeStyles, setNodeStyles] = useState({
    colorConfig: nodes.reduce((acc, node) => {
      acc[node.type] = node.color;
      return acc;
    }, {} as Record<string, string>),
    currentColor: '#ff0000',
    currentType: 'NULL'
  });

  // 缩放状态
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Refs
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  /**
   * 图表基础配置
   * 使用 useMemo 优化性能，仅在宽高变化时重新计算
   */
  const graphConfig = useMemo(() => ({
    centerX: width / 2,
    centerY: height / 2,
    nodeDefaultColor: '#4B5563',
    linkColor: '#9CA3AF',
    linkWidth: 1.5,
    maxZoom: 4,
    minZoom: 0.1,
    zoomStep: 1.5,
    nodeTypes: getNodesTypes(nodes),
    nodeColors: getNodesColors(nodes)
  }), [width, height, nodes]);

  /**
   * 节点拖拽行为处理器
   * @returns {d3.DragBehavior} D3 拖拽行为对象
   */
  const handleDrag = useCallback(() => {
    return d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      });
  }, []);

  /**
   * 初始化力导向模拟器
   * @returns {d3.Simulation} 力导向模拟器实例
   */
  const initializeSimulation = useCallback(() => {
    const { chargeStrength, linkDistance, nodeRadius } = graphParams;

    return d3.forceSimulation<GraphNode>(nodes)
      .force('charge', d3.forceManyBody<GraphNode>().strength(chargeStrength))
      .force('link', d3.forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)
        .distance(linkDistance))
      .force('center', d3.forceCenter<GraphNode>(graphConfig.centerX, graphConfig.centerY))
      .force('collide', d3.forceCollide(nodeRadius + 30))
      .force('x', d3.forceX(graphConfig.centerX).strength(0.03))
      .force('y', d3.forceY(graphConfig.centerY).strength(0.03));
  }, [nodes, links, graphParams, graphConfig]);

  /**
   * 创建箭头标记定义
   * @param {d3.Selection} svg - SVG 选择器对象
   */
  const createArrowMarker = useCallback((svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', graphParams.nodeRadius + 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', graphConfig.linkColor)
      .style('stroke', 'none');
  }, [graphParams.nodeRadius, graphConfig.linkColor]);

  /**
   * 渲染主图表
   * 包含节点、连接线和标签的创建与更新
   */
  useEffect(() => {
    if (!svgRef.current) return;

    // 初始化 SVG 容器
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();

    // 创建主容器组
    const g = svg.append('g');

    /**
     * 配置缩放行为
     * 设置缩放范围和事件处理
     */
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([graphConfig.minZoom, graphConfig.maxZoom])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);
    svg.transition().duration(500).call(zoom.scaleTo, zoomLevel);

    // 初始化力导向模拟器
    simulationRef.current = initializeSimulation();
    createArrowMarker(svg);

    /**
     * 创建连接线元素
     * 包含线条和可选的文本标签
     */
    const link = g.selectAll('.link')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', graphConfig.linkColor)
      .attr('stroke-width', graphConfig.linkWidth)
      .attr('marker-end', 'url(#arrowhead)');

    const linkLabel = g.selectAll('.link-label')
      .data(links)
      .join('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .text(graphParams.isShowLinkLabel ? (d => d.text || "none") : "");

    /**
     * 创建节点组
     * 包含节点圆形和文本标签
     */
    const nodeGroup = g.selectAll<SVGGElement, GraphNode>('.node-group')
      .data(nodes)
      .join('g')
      .attr('class', 'node-group')
      .call(handleDrag());

    // 添加节点圆形
    nodeGroup.append('circle')
      .attr('r', graphParams.nodeRadius)
      .attr('fill', d => {
        const nodeType = d.type;
        const configColor = nodeStyles.colorConfig[nodeType];
        return configColor || d.color || graphConfig.nodeDefaultColor;
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5);

    // 添加节点文本标签
    nodeGroup.append('text')
      .text(d => d.id)
      .attr('dx', graphParams.nodeRadius + 10)
      .attr('dy', 5)
      .attr('text-anchor', 'start')
      .attr('fill', '#000')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    /**
     * 配置模拟器的每帧更新函数
     * 更新所有元素的位置
     */
    simulationRef.current.on('tick', () => {
      // 更新连接线位置
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      // 更新连接线标签位置
      linkLabel
        .attr('x', d => {
          const sourceX = (d.source as GraphNode).x!;
          const targetX = (d.target as GraphNode).x!;
          return sourceX + (targetX - sourceX) / 2;
        })
        .attr('y', d => {
          const sourceY = (d.source as GraphNode).y!;
          const targetY = (d.target as GraphNode).y!;
          return sourceY + (targetY - sourceY) / 2;
        });

      // 更新节点组位置
      nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // 组件卸载时清理
    return () => {
      simulationRef.current?.stop();
    };
  }, [
    nodes,
    links,
    width,
    height,
    nodeStyles.colorConfig,
    graphConfig,
    graphParams,
    handleDrag,
    initializeSimulation,
    zoomLevel,
    createArrowMarker
  ]);

  /**
   * 缩放控制函数
   */
  const zoomControls = {
    zoomIn: useCallback(() => {
      setZoomLevel(prev => Math.min(prev * graphConfig.zoomStep, graphConfig.maxZoom));
    }, [graphConfig.zoomStep, graphConfig.maxZoom]),

    zoomOut: useCallback(() => {
      setZoomLevel(prev => Math.max(prev / graphConfig.zoomStep, graphConfig.minZoom));
    }, [graphConfig.zoomStep, graphConfig.minZoom]),

    resetZoom: useCallback(() => {
      if (!svgRef.current || !zoomRef.current) return;

      const svg = d3.select(svgRef.current);

      // 计算节点质心
      const centroid = nodes.reduce(
        (acc, node) => {
          if (node.x != null && node.y != null) {
            acc.x += node.x;
            acc.y += node.y;
            acc.count += 1;
          }
          return acc;
        },
        { x: 0, y: 0, count: 0 }
      );

      const centroidX = centroid.count > 0 ? centroid.x / centroid.count : graphConfig.centerX;
      const centroidY = centroid.count > 0 ? centroid.y / centroid.count : graphConfig.centerY;

      // 应用变换
      const transform = d3.zoomIdentity
        .translate(width / 2 - centroidX, height / 2 - centroidY)
        .scale(1);

      svg.transition()
        .duration(750)
        .call(zoomRef.current.transform, transform);

      // 重启模拟器
      if (simulationRef.current) {
        simulationRef.current.alpha(0.3).restart();
        nodes.forEach(node => {
          node.fx = null;
          node.fy = null;
        });
      }

      setZoomLevel(1);
    }, [nodes, width, height, graphConfig.centerX, graphConfig.centerY])
  };

  /**
   * 更新节点颜色配置
   */
  //waring：带有判断条件的函数不应该使用 useCallback 缓存，否则会有 bug
  const handleChangeNodeColorConfig = () => {
    if(nodeStyles.currentType === 'NULL'){
      return;
    }
    setNodeStyles(prev => ({
      ...prev,
      colorConfig: {
        ...prev.colorConfig,
        [prev.currentType]: prev.currentColor
      }
    }));
    showToast("修改成功！", 3000);
  };

  return (
    <div className="relative w-full h-full">
      {/* 控制面板 */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg space-y-4 z-10">
        <Dropdown
        placeholder="请选择一个结点类型"
          items={graphConfig.nodeTypes.map(n => ({ label: n, value: n }))}
          defaultValue={''}
          onChange={(type) => setNodeStyles(prev => ({ ...prev, currentType: type }))}
        />
        <ColorPicker
          setCurrentColor={(color) => setNodeStyles(prev => ({ ...prev, currentColor: color }))}
        />
        <div className="flex justify-center items-center">
          <button
            className="bg-gray-200 shadow rounded px-6 py-2 font-semibold hover:bg-gray-300 transition-colors"
            onClick={handleChangeNodeColorConfig}
          >
            确认更改
          </button>
        </div>
        <ControlPanel
          {...graphParams}
          setNodeRadius={(value) => setGraphParams(prev => ({ ...prev, nodeRadius: value }))}
          setLinkDistance={(value) => setGraphParams(prev => ({ ...prev, linkDistance: value }))}
          setChargeStrength={(value) => setGraphParams(prev => ({ ...prev, chargeStrength: value }))}
          setIsShowLinkLabel={(value) => setGraphParams(prev => ({ ...prev, isShowLinkLabel: value }))}
        />
      </div>

      {/* 缩放控制按钮 */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col space-y-2">
        <button
          onClick={zoomControls.zoomIn}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          title="放大"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
            <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
            <path fillRule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5" />
          </svg>
        </button>
        <button
          onClick={zoomControls.zoomOut}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          title="缩小"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
            <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
            <path fillRule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5" />
          </svg>
        </button>
        <button
          onClick={zoomControls.resetZoom}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          title="重置"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
          </svg>
        </button>
      </div>

      {/* 图例 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-20">
        <GraphLegend nodeColorConfig={nodeStyles.colorConfig} />
      </div>

      {/* SVG 容器 */}
      <div className="w-full h-full bg-gray-50">
        <svg
          ref={svgRef}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
};

export default ForceGraph;