import ForceGraph from "@/components/layout/ForceGraph";
import NavBar from "@/components/ui/NavBar";
import { mockDepressions } from "@/test/mockGraphData";
import { convertDepressionArrayToGraph } from "@/utils/GraphUtil";

const Graph = () => {
    const data = convertDepressionArrayToGraph(mockDepressions);
    const nodes = data.nodes;
    const links = data.links;
    return (
        // 使用 h-screen 而不是 min-h-screen，确保精确高度
        <div className="h-screen flex flex-col overflow-hidden">
            <NavBar />
            {/* 移除 padding，使用 overflow-hidden */}
            <main className="flex-1 relative overflow-hidden">
                <ForceGraph nodes={nodes} links={links} />
            </main>
        </div>
    )
}

export default Graph;