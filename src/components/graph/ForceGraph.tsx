"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { GraphLink, GraphNode } from "@/types/graph";
import ControlPanel from "./ControlPanel";
import GraphLegend from "./GraphLegend";
import { useGraphConfigStore } from "@/store/useGraphConfigStore";
import { useGraphStore } from "@/store/useGraphStore";

const ForceGraph = () => {
  const graphConfig = useGraphConfigStore();
  const graph = useGraphStore();
  const { nodes, links } = graph;
  const {
    width,
    height,
    nodeRadius,
    chargeStrength,
    nodeDefaultColor,
    linkDefaultColor,
    linkDistance,
    linkWidth,
    isShowLinkLabel,
    maxZoom,
    minZoom,
    zoomStep,
  } = graphConfig;
  const centerX = width / 2;
  const centerY = height / 2;

  // 缩放状态
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Refs
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(
    null,
  );
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  /**
   * 节点拖拽行为处理器
   * @returns {d3.DragBehavior} D3 拖拽行为对象
   */
  const handleDrag = useCallback(() => {
    return d3
      .drag<SVGGElement, GraphNode>()
      .on("start", (event, d) => {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
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
    return d3
      .forceSimulation<GraphNode>(nodes)
      .force("charge", d3.forceManyBody<GraphNode>().strength(chargeStrength))
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(linkDistance),
      )
      .force("center", d3.forceCenter<GraphNode>(width / 2, height / 2))
      .force("collide", d3.forceCollide(nodeRadius + 30))
      .force("x", d3.forceX(centerX).strength(0.03))
      .force("y", d3.forceY(centerY).strength(0.03));
  }, [
    centerX,
    centerY,
    chargeStrength,
    height,
    linkDistance,
    links,
    nodeRadius,
    nodes,
    width,
  ]);

  /**
   * 创建箭头标记定义
   * @param {d3.Selection} svg - SVG 选择器对象
   */
  const createArrowMarker = useCallback(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", nodeRadius + 13)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("xoverflow", "visible")
        .append("svg:path")
        .attr("d", "M 0,-5 L 10 ,0 L 0,5")
        .attr("fill", linkDefaultColor)
        .style("stroke", "none");
    },
    [nodeRadius, linkDefaultColor],
  );

  /**
   * 渲染主图表
   * 包含节点、连接线和标签的创建与更新
   */
  useEffect(() => {
    if (!svgRef.current) return;

    // 初始化 SVG 容器
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();

    // 创建主容器组
    const g = svg.append("g");

    /**
     * 配置缩放行为
     * 设置缩放范围和事件处理
     */
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
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
    const link = g
      .selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", linkDefaultColor)
      .attr("stroke-width", linkWidth)
      .attr("marker-end", "url(#arrowhead)");

    const linkLabel = g
      .selectAll(".link-label")
      .data(links)
      .join("text")
      .attr("class", "link-label")
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("user-select", "none")
      .text(isShowLinkLabel ? (d) => d.text || "none" : "");

    /**
     * 创建节点组
     * 包含节点圆形和文本标签
     */
    const nodeGroup = g
      .selectAll<SVGGElement, GraphNode>(".node-group")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .call(handleDrag());

    // 添加节点圆形
    nodeGroup
      .append("circle")
      .attr("r", nodeRadius)
      .attr("fill", (d) => {
        return d.color || nodeDefaultColor;
      })
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

    // 添加节点文本标签
    nodeGroup
      .append("text")
      .text((d) => d.id)
      .attr("dx", nodeRadius + 10)
      .attr("dy", 5)
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .style("font-size", "14px")
      .style("pointer-events", "none")
      .style("user-select", "none");

    /**
     * 配置模拟器的每帧更新函数
     * 更新所有元素的位置
     */
    simulationRef.current.on("tick", () => {
      // 更新连接线位置
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      // 更新连接线标签位置
      linkLabel
        .attr("x", (d) => {
          const sourceX = (d.source as GraphNode).x!;
          const targetX = (d.target as GraphNode).x!;
          return sourceX + (targetX - sourceX) / 2;
        })
        .attr("y", (d) => {
          const sourceY = (d.source as GraphNode).y!;
          const targetY = (d.target as GraphNode).y!;
          return sourceY + (targetY - sourceY) / 2;
        });

      // 更新节点组位置
      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // 组件卸载时清理
    return () => {
      simulationRef.current?.stop();
    };
  }, [
    createArrowMarker,
    handleDrag,
    height,
    initializeSimulation,
    isShowLinkLabel,
    linkDefaultColor,
    linkWidth,
    links,
    maxZoom,
    minZoom,
    nodeDefaultColor,
    nodeRadius,
    nodes,
    width,
    zoomLevel,
  ]);

  /**
   * 缩放控制函数
   */
  const zoomControls = {
    zoomIn: useCallback(() => {
      setZoomLevel((prev) => Math.min(prev * zoomStep, maxZoom));
    }, [zoomStep, maxZoom]),

    zoomOut: useCallback(() => {
      setZoomLevel((prev) => Math.max(prev / zoomStep, minZoom));
    }, [zoomStep, minZoom]),

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
        { x: 0, y: 0, count: 0 },
      );

      const centroidX =
        centroid.count > 0 ? centroid.x / centroid.count : centerX;
      const centroidY =
        centroid.count > 0 ? centroid.y / centroid.count : centerY;

      // 应用变换
      const transform = d3.zoomIdentity
        .translate(width / 2 - centroidX, height / 2 - centroidY)
        .scale(1);

      svg.transition().duration(750).call(zoomRef.current.transform, transform);

      // 重启模拟器
      if (simulationRef.current) {
        simulationRef.current.alpha(0.3).restart();
        nodes.forEach((node) => {
          node.fx = null;
          node.fy = null;
        });
      }

      setZoomLevel(1);
    }, [nodes, width, height, centerX, centerY]),
  };

  return (
    <div className="relative h-full w-full">
      {/* 控制面板 */}
      <ControlPanel />
      {/* 缩放控制按钮 */}
      <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col space-y-2">
        <button
          onClick={zoomControls.zoomIn}
          className="rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
          title="放大"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
            />
            <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
            <path
              fillRule="evenodd"
              d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"
            />
          </svg>
        </button>
        <button
          onClick={zoomControls.zoomOut}
          className="rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
          title="缩小"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
            />
            <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
            <path
              fillRule="evenodd"
              d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </button>
        <button
          onClick={zoomControls.resetZoom}
          className="rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
          title="重置"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
          </svg>
        </button>
      </div>

      {/* 图例 */}
      <div className="absolute left-1/2 top-20 -translate-x-1/2">
        <GraphLegend />
      </div>

      {/* SVG 容器 */}
      <div className="h-full w-full bg-gray-50">
        <svg
          ref={svgRef}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
};

export default ForceGraph;
