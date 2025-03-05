'use client'

import { showToast } from "@/components/common/Toast";
import ForceGraph from "@/components/graph/ForceGraph";
import NavBar from "@/components/ui/NavBar";
import { getAllDepressions } from "@/services/KnowledgeService";
import { GraphLink, GraphNode } from "@/types/Graph";
import { convertDepressionArrayToGraph } from "@/utils/GraphUtil";
import { useEffect, useState } from "react";

const Graph = () => {
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [links, setLinks] = useState<GraphLink[]>([]);
    const handleFetchData = async () => {
        try {
            const response = await getAllDepressions();
            if (response && response.data) {
                const graphData = response.data;
                const { nodes, links } = convertDepressionArrayToGraph(graphData);
                setNodes(nodes);
                setLinks(links);
            }
        } catch (error) {
            console.log(error);
            showToast("获取数据失败", 3000, 'error');
        }
    }
    useEffect(() => {
        handleFetchData();
    }, [])
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <NavBar />
            <main className="flex-1 relative overflow-hidden">
                <ForceGraph nodes={nodes} links={links} />
            </main>
        </div>
    )
}

export default Graph;