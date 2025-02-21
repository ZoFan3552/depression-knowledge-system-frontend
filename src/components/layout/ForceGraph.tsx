'use client'

import React, { useEffect, useRef, useMemo, useCallback, useState } from "react";
import * as d3 from "d3";
import { GraphLink, GraphNode } from "../../types/Graph";
import ControlPanel from "./ForceGraphControlPanel";

/**
 * ForceGraph 组件的属性接口
 * @interface ForceGraphProps
 */
interface ForceGraphProps {
  /** 图表宽度（默认800） */
  width?: number;
  /** 图表高度（默认800） */
  height?: number;
  /** 节点数据数组 */
  nodes: GraphNode[];
  /** 连接关系数据数组 */
  links: GraphLink[];
  /**
   * 控制面板的初始参数
   */
  initialParams?: {
    nodeRadius: number;
    linkDistance: number;
    chargeStrength: number;
  };
}

/**
 * 力导向图组件
 * 使用 D3.js 实现的交互式网络图可视化组件
 * 支持节点拖拽、缩放和平移等操作
 */
const ForceGraph: React.FC<ForceGraphProps> = ({
  width = 800,
  height = 800,
  nodes,
  links,
  initialParams = {
    nodeRadius: 10,
    linkDistance: 100,
    chargeStrength: -600
  }
}) => {
  const [nodeRadius, setNodeRadius] = useState(initialParams.nodeRadius);
  const [linkDistance, setLinkDistance] = useState(initialParams.linkDistance);
  const [chargeStrength, setChargeStrength] = useState(initialParams.chargeStrength);
  const [isShowLinkLabel, setIsShowLinkLabel] = useState(false);

  // SVG DOM 元素的 React 引用
  const svgRef = useRef<SVGSVGElement | null>(null);
  // D3 力模拟器的引用
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  // 当前缩放级别状态（默认1倍）
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // 使用 useMemo 缓存图表配置参数
  const graphConfig = useMemo(() => ({
    centerX: width / 2,          // 画布水平中心
    centerY: height / 2,         // 画布垂直中心
    nodeColor: '#4B5563',        // 节点填充颜色
    linkColor: '#9CA3AF',        // 连接线颜色
    linkWidth: 1.5,              // 连接线宽度
    maxZoom: 4,                  // 最大缩放倍数
    minZoom: 0.1,                // 最小缩放倍数
    zoomStep: 1.5,               // 缩放步长系数
  }), [width, height]);          // 依赖项：宽高变化时重新计算

  /**
   * 创建节点拖拽行为
   * 使用 useCallback 优化性能，避免重复创建
   */
  const handleDrag = useCallback(() => {
    return d3.drag<SVGGElement, GraphNode>()
      // 拖拽开始事件处理
      .on('start', (event, d) => {
        if (!event.active && simulationRef.current) {
          // alphaTarget是力导向图（Force-Directed Graph）布局的一部分，属于d3.forceSimulation中的参数之一。
          // 它用于控制力学模拟过程中的“温度”或“动量”，即节点在模拟过程中趋向稳定的速度。
          simulationRef.current.alphaTarget(0.3).restart(); // 激活模拟器
        }
        d.fx = d.x; // 固定节点初始位置
        d.fy = d.y;
      })
      // 拖拽中事件处理
      .on('drag', (event, d) => {
        d.fx = event.x; // 更新节点固定位置
        d.fy = event.y;
      })
      // 拖拽结束事件处理
      .on('end', (event, d) => {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0); // 停止模拟器
        }
        d.fx = null; // 释放节点固定
        d.fy = null;
      });
  }, []);

  /**
   * 初始化力导向模拟器
   * 配置多种作用力组合
   */
  const initializeSimulation = useCallback(() => {
    return d3.forceSimulation<GraphNode>(nodes)
      .force('charge', d3.forceManyBody<GraphNode>().strength(chargeStrength)) // 节点间排斥力
      .force('link', d3.forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)                // 指定节点 ID 访问器
        .distance(linkDistance))       // 连接线目标长度
      .force('center', d3.forceCenter<GraphNode>(graphConfig.centerX, graphConfig.centerY)) // 向心力
      .force('collide', d3.forceCollide(nodeRadius + 30)) // 碰撞力（防止重叠）
      .force('x', d3.forceX(graphConfig.centerX).strength(0.03)) // X 轴向心力
      .force('y', d3.forceY(graphConfig.centerY).strength(0.03)); // Y 轴向心力
  }, [nodes, links, chargeStrength, linkDistance, nodeRadius, graphConfig]);

  /**
   * 创建 SVG 箭头标记定义
   * @param svg - SVG 选择器对象
   */
  const createArrowMarker = useCallback((svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')         // 标记 ID
      .attr('viewBox', '-0 -5 10 10')  // 视图框
      .attr('refX', nodeRadius + 13)    // 箭头定位点 X
      .attr('refY', 0)                 // 箭头定位点 Y
      .attr('orient', 'auto')          // 自动方向
      .attr('markerWidth', 6)          // 标记宽度
      .attr('markerHeight', 6)         // 标记高度
      .attr('xoverflow', 'visible')    // 溢出可见
      .append('svg:path')              // 箭头路径
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5') // 三角形路径
      .attr('fill', graphConfig.linkColor) // 填充颜色
      .style('stroke', 'none');        // 无描边
  }, [nodeRadius, graphConfig.linkColor]);

  // 缩放行为引用（用于程序化控制缩放）
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // 主渲染副作用（组件挂载/更新时执行）
  useEffect(() => {
    if (!svgRef.current) return; // 确保 SVG 元素存在

    // 选择 SVG 元素并设置基础属性
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr("viewBox", `0 0 ${width} ${height}`);//居中屏幕展示

    svg.selectAll('*').remove(); // 清空现有内容

    // 创建主容器组（用于应用缩放变换）
    const g = svg.append('g');

    // 配置缩放行为
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([graphConfig.minZoom, graphConfig.maxZoom]) // 缩放范围
      .on('zoom', (event) => { // 缩放事件处理
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom; // 保存缩放实例引用

    svg.call(zoom); // 应用缩放行为到 SVG
    svg.transition().duration(500).call(zoom.scaleTo, zoomLevel); // 初始化缩放级别

    // 初始化力导向模拟器
    simulationRef.current = initializeSimulation();

    // 创建箭头标记
    createArrowMarker(svg);

    // 绘制连接线
    const link = g.selectAll('.link')
      .data(links)               // 绑定数据
      .join('line')              // 数据连接
      .attr('class', 'link')     // CSS 类名
      .attr('stroke', graphConfig.linkColor) // 线条颜色
      .attr('stroke-width', graphConfig.linkWidth) // 线条宽度
      .attr('marker-end', 'url(#arrowhead)'); // 箭头标记

    // 添加连线标签
    const linkLabel = g.selectAll('.link-label')
      .data(links)              // 绑定数据
      .join('text')             // 创建文本元素
      .attr('class', 'link-label') // CSS 类名
      .attr('x', d => (d.source as GraphNode).x!) // 设置标签位置的X坐标
      .attr('y', d => (d.source as GraphNode).y!) // 设置标签位置的Y坐标
      .attr('dx', d => ((d.target as GraphNode).x! - (d.source as GraphNode).x!) / 2)  // 计算连线中点X坐标
      .attr('dy', d => ((d.target as GraphNode).y! - (d.source as GraphNode).y!) / 2)  // 计算连线中点Y坐标
      .attr('text-anchor', 'middle')  // 使文本居中
      .attr('fill', '#000')           // 设置字体颜色，确保可见
      .style('font-size', '12px')     // 字体大小
      .style('pointer-events', 'none')  // 禁用文本的指针事件
      .style('user-select', 'none')   // 禁用文本选择
      .text(isShowLinkLabel ? (d => d.text || "none") : "");    // 显示文本内容，默认为"none"

    // 创建节点组（包含圆形和文本）
    const nodeGroup = g.selectAll<SVGGElement, GraphNode>('.node-group')
      .data(nodes)               // 绑定节点数据
      .join('g')                 // 创建组元素
      .attr('class', 'node-group') // CSS 类名
      .call(handleDrag());       // 应用拖拽行为

    // 绘制节点圆形
    nodeGroup.append('circle')
      .attr('r', nodeRadius)         // 半径
      .attr('fill', d => d.color || graphConfig.nodeColor) // 填充色
      .attr('stroke', '#000')        // 描边颜色
      .attr('stroke-width', 1.5);     // 描边宽度

    // 添加节点标签文本
    nodeGroup.append('text')
      .text(d => d.id)
      .attr('dx', nodeRadius + 10)               // 显示节点 ID
      .attr('dy', 5)                 // 垂直偏移
      .attr('text-anchor', 'start') // 文本居中
      .attr('fill', '#000')          // 文本颜色
      .style('font-size', '12px')    // 字号
      .style('pointer-events', 'none') // 禁用指针事件
      .style('user-select', 'none'); // 禁止文本选择

    // 模拟器 tick 事件处理（每帧更新）
    simulationRef.current.on('tick', () => {
      // 更新连接线位置
      link
        .attr('x1', d => (d.source as GraphNode).x!) // 起点 X
        .attr('y1', d => (d.source as GraphNode).y!) // 起点 Y
        .attr('x2', d => (d.target as GraphNode).x!) // 终点 X
        .attr('y2', d => (d.target as GraphNode).y!);// 终点 Y

      // 更新连线标签位置
      linkLabel
        .attr('x', d => (d.source as GraphNode).x!) // 标签起点 X 坐标
        .attr('y', d => (d.source as GraphNode).y!) // 标签起点 Y 坐标
        .attr('dx', d => ((d.target as GraphNode).x! - (d.source as GraphNode).x!) / 2)  // 中点 X 坐标
        .attr('dy', d => ((d.target as GraphNode).y! - (d.source as GraphNode).y!) / 2);  // 中点 Y 坐标

      // 更新节点组位置
      nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // 清理函数（组件卸载时停止模拟）
    return () => {
      simulationRef.current?.stop();
    };
  }, [nodes, links, width, height, graphConfig, handleDrag, initializeSimulation, nodeRadius, zoomLevel, createArrowMarker, isShowLinkLabel]);

  // 放大控制函数
  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * graphConfig.zoomStep, graphConfig.maxZoom));
  }, [graphConfig.zoomStep, graphConfig.maxZoom]);

  // 缩小控制函数
  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev / graphConfig.zoomStep, graphConfig.minZoom));
  }, [graphConfig.zoomStep, graphConfig.minZoom]);

  // 重置缩放和视图位置函数
const resetZoom = useCallback(() => {
  if (!svgRef.current || !zoomRef.current) return;

  const svg = d3.select(svgRef.current);
  
  // 计算节点的质心（即节点最集中的区域）
  let sumX = 0, sumY = 0;
  let validNodeCount = 0;
  
  nodes.forEach(node => {
    // 只考虑有有效位置的节点
    if (node.x != null && node.y != null) {
      sumX += node.x;
      sumY += node.y;
      validNodeCount++;
    }
  });
  
  // 计算平均位置（质心）
  const centroidX = validNodeCount > 0 ? sumX / validNodeCount : graphConfig.centerX;
  const centroidY = validNodeCount > 0 ? sumY / validNodeCount : graphConfig.centerY;
  
  // 计算缩放视图需要的变换
  // 使用 zoomIdentity 创建基本变换，然后平移到质心位置
  const transform = d3.zoomIdentity
    .translate(width / 2 - centroidX, height / 2 - centroidY)
    .scale(1);
  
  // 应用变换，将节点集中区域移动到视图中心
  svg.transition()
    .duration(750) // 稍微延长动画时间，让过渡更平滑
    .call(zoomRef.current.transform, transform);
  
  // 如果模拟当前静止，可以轻微扰动使其重新排列
  if (simulationRef.current) {
    // 为避免节点完全重置位置，只重启模拟而不重置位置
    simulationRef.current.alpha(0.3).restart();
    
    // 清除任何固定的节点
    nodes.forEach(node => {
      node.fx = null;
      node.fy = null;
    });
  }
  
  // 重置缩放级别状态
  setZoomLevel(1);
}, [nodes, width, height, graphConfig.centerX, graphConfig.centerY]);

  return (
    // 移除内边距，使用 h-full 确保填充父容器
    <div className="relative w-full h-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg space-y-4 z-10">
        {/* 控制面板 */}
        <ControlPanel
          nodeRadius={nodeRadius}
          setNodeRadius={setNodeRadius}
          linkDistance={linkDistance}
          setLinkDistance={setLinkDistance}
          chargeStrength={chargeStrength}
          setChargeStrength={setChargeStrength}
          isShowLinkLabel={isShowLinkLabel}
          setIsShowLinkLabel={setIsShowLinkLabel}
        />
      </div>

      {/* 控制按钮 */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col space-y-2">
        <button
          onClick={zoomIn}
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
          onClick={zoomOut}
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
          onClick={resetZoom}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          title="重置"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
          </svg>
        </button>
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