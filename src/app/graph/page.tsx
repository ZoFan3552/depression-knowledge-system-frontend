"use client";

import ForceGraph from "@/components/graph/ForceGraph";
import NavBar from "@/components/ui/NavBar";

const Graph = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <NavBar />
      <main className="relative flex-1 overflow-hidden">
        <ForceGraph />
      </main>
    </div>
  );
};

export default Graph;
