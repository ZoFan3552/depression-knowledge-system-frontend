export interface GraphNode extends d3.SimulationNodeDatum {
    id: string,
    type: string,
    color: string
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
    text: string
}