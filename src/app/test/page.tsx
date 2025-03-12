'use client'

import { showToast } from "@/components/common/Toast";
import { getAllDepressions } from "@/services/knowledgeService";

const TestPage = () => {
    const handleResponse = async () => {
        const response = await getAllDepressions();
        showToast(response.message, 3000, 'success');
    }

    return <>
        <button onClick={handleResponse}>
            测试 API 按钮
        </button>
    </>
}

export default TestPage;