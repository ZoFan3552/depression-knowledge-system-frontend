import { Depression } from "@/types/Knowledge";
import { GraphNode, GraphLink } from "@/types/Graph";
import { useMemo } from "react";

// 定义一个类型映射来设置节点颜色
enum NodeColor {
    DEPRESSION = '#00000',
    SYMPTOM = '#ff5733',  // 症状的颜色
    CAUSE = '#33c3ff',    // 原因的颜色
    DIAGNOSIS = '#7dff33', // 诊断的颜色
    TREATMENT = '#8e44ad', // 治疗的颜色
    PREVENTION = '#f5a623', // 预防的颜色
    MEDICATION = '#2ecc71' // 药物的颜色
}

// 将Depression数组对象转换为图表的节点和连线
export function convertDepressionArrayToGraph(depressions: Depression[]): { nodes: GraphNode[], links: GraphLink[] } {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    //缓存结点 ID set 防止重复创建结点
    const nodeSetMemo = useMemo(() => ({
        nodeSet: new Set<string | number>
    }), [])

    function pushNewNode(newNode: GraphNode) {
        if (!nodeSetMemo.nodeSet.has(newNode.id)) {
            nodes.push(newNode);
            nodeSetMemo.nodeSet.add(newNode.id);
        }
    }
    depressions.forEach(depression => {
        // 创建Depression节点
        pushNewNode({
            id: depression.name,
            type: 'Depression',
            color: NodeColor.DEPRESSION // Depression节点颜色为黑色
        });



        // 为症状创建节点
        depression.symptoms.forEach(symptom => {
            pushNewNode({
                id: symptom.name,
                type: 'Symptom',
                color: NodeColor.SYMPTOM
            });

            // 创建症状与Depression的连线
            links.push({
                source: depression.name,
                target: symptom.name,
                text: 'HAS_SYMPTOM'
            });
        });

        // 为原因创建节点
        depression.causes.forEach(cause => {
            pushNewNode({
                id: cause.name,
                type: 'Cause',
                color: NodeColor.CAUSE
            });

            // 创建原因与Depression的连线
            links.push({
                source: depression.name,
                target: cause.name,
                text: 'HAS_CAUSE'
            });
        });

        // 为诊断创建节点
        depression.diagnoses.forEach(diagnosis => {
            pushNewNode({
                id: diagnosis.name,
                type: 'Diagnosis',
                color: NodeColor.DIAGNOSIS
            });

            // 创建诊断与Depression的连线
            links.push({
                source: depression.name,
                target: diagnosis.name,
                text: 'HAS_DIAGNOSIS'
            });
        });

        // 为治疗创建节点
        depression.treatments.forEach(treatment => {
            pushNewNode({
                id: treatment.name,
                type: 'Treatment',
                color: NodeColor.TREATMENT
            });

            // 创建治疗与Depression的连线
            links.push({
                source: depression.name,
                target: treatment.name,
                text: 'HAS_TREATMENT'
            });
        });

        // 为预防创建节点
        depression.preventions.forEach(prevention => {
            pushNewNode({
                id: prevention.name,
                type: 'Prevention',
                color: NodeColor.PREVENTION
            });

            // 创建预防与Depression的连线
            links.push({
                source: depression.name,
                target: prevention.name,
                text: 'HAS_PREVENTION'
            });
        });

        // 为药物创建节点
        depression.medications.forEach(medication => {
            pushNewNode({
                id: medication.name,
                type: 'Medication',
                color: NodeColor.MEDICATION
            });

            // 创建药物与Depression的连线
            links.push({
                source: depression.name,
                target: medication.name,
                text: 'HAS_MEDICATION'
            });
        });
    });

    return { nodes, links };
}

