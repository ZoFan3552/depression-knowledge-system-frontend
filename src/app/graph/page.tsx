import ForceGraph from "@/components/graph/ForceGraph";
import NavBar from "@/components/ui/NavBar";
import { mockDepressions } from "@/test/mockGraphData";
import { convertDepressionArrayToGraph } from "@/utils/GraphUtil";

const Graph = () => {
    const data = convertDepressionArrayToGraph(mockDepressions);
    const nodes = data.nodes;
    const links = data.links;
    const nodeColorConfig:Record<string, string> = {};
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <NavBar />
            <main className="flex-1 relative overflow-hidden">
                <ForceGraph nodeColorConfig={nodeColorConfig} nodes={nodes} links={links} />
            </main>
        </div>
    )
}

export default Graph;