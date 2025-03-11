import { GraphConfigState } from "@/types/graph";
import { create } from "zustand";

export const useGraphConfigStore = create<GraphConfigState>((set) => ({
  width: 800,
  height: 800,
  nodeRadius: 10,
  chargeStrength: -600,
  nodeDefaultColor: "#4B5563",
  linkDefaultColor: "#9CA3AF",
  linkDistance: 100,
  linkWidth: 1.5,
  isShowLinkLabel: false,
  maxZoom: 4,
  minZoom: 0.1,
  zoomStep: 1.5,
  updateConfig: (newConfig) =>
    set((state) => ({
      ...state,
      ...newConfig,
    })),
}));
