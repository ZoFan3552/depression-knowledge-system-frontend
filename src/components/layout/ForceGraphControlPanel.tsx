interface PanelProps {
    nodeRadius: number;
    setNodeRadius: (value: number) => void;
    linkDistance: number;
    setLinkDistance: (value: number) => void;
    chargeStrength: number;
    setChargeStrength: (value: number) => void;
    isShowLinkLabel:boolean;
    setIsShowLinkLabel:(value: boolean) => void;
}

const ControlPanel: React.FC<PanelProps> = ({
    nodeRadius,
    setNodeRadius,
    linkDistance,
    setLinkDistance,
    chargeStrength,
    setChargeStrength,
    isShowLinkLabel,
    setIsShowLinkLabel
}) => (
    <>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                节点大小: {nodeRadius}
            </label>
            <input
                type="range"
                min="10"
                max="50"
                value={nodeRadius}
                onChange={(e) => setNodeRadius(Number(e.target.value))}
                className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                连接线长度: {linkDistance}
            </label>
            <input
                type="range"
                min="50"
                max="400"
                value={linkDistance}
                onChange={(e) => setLinkDistance(Number(e.target.value))}
                className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                排斥力强度: {Math.abs(chargeStrength)}
            </label>
            <input
                type="range"
                min="100"
                max="1000"
                value={Math.abs(chargeStrength)}
                onChange={(e) => setChargeStrength(-Number(e.target.value))}
                className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                是否显示连线标签
                <input
                className="mt-1 ml-2"
                    type="checkbox"
                    checked={isShowLinkLabel}
                    onChange={() => setIsShowLinkLabel(!isShowLinkLabel)}
                >
                </input>
            </label>

        </div>
    </>
);

export default ControlPanel;