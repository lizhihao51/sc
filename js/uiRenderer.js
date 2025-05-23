// UI 渲染模块
import { formatDate, calculateTimeDifference } from './core/utils.js';

// 预设分类颜色
const categoryColors = {
    '技术': { bg: '#dbeafe', text: '#1e40af' },
    '设计': { bg: '#ede9fe', text: '#5b21b6' },
    '工具': { bg: '#dcfce7', text: '#166534' },
    '资源': { bg: '#ffedd5', text: '#92400e' },
    '学习': { bg: '#fee2e2', text: '#991b1b' }
};

// 预设标签颜色
const tagColors = {
    '前端': { bg: '#dbeafe', text: '#1e40af' },
    '后端': { bg: '#dbeafe', text: '#1e40af' },
    'UI': { bg: '#ede9fe', text: '#5b21b6' },
    'UX': { bg: '#ede9fe', text: '#5b21b6' },
    'CSS': { bg: '#dbeafe', text: '#1e40af' },
    'JavaScript': { bg: '#dbeafe', text: '#1e40af' },
    'Python': { bg: '#dcfce7', text: '#166534' },
    '免费': { bg: '#dcfce7', text: '#166534' },
    '教程': { bg: '#ffedd5', text: '#92400e' },
    '代码': { bg: '#fee2e2', text: '#991b1b' },
    '文档': { bg: '#dbeafe', text: '#1e40af' },
    '框架': { bg: '#dbeafe', text: '#1e40af' },
    '灵感': { bg: '#ede9fe', text: '#5b21b6' },
    '代码托管': { bg: '#dbeafe', text: '#1e40af' },
    '开源': { bg: '#dbeafe', text: '#1e40af' },
    'UI设计': { bg: '#ede9fe', text: '#5b21b6' },
    '协作': { bg: '#ede9fe', text: '#5b21b6' },
    '问答': { bg: '#dbeafe', text: '#1e40af' },
    '社区': { bg: '#dbeafe', text: '#1e40af' },
    '图片': { bg: '#ffedd5', text: '#92400e' },
    '编辑器': { bg: '#dcfce7', text: '#166534' },
    '开发': { bg: '#dcfce7', text: '#166534' },
    '设计工具': { bg: '#ede9fe', text: '#5b21b6' },
    '简单': { bg: '#ede9fe', text: '#5b21b6' }
};

export const renderbms = (bms, listElement) => {
    listElement.innerHTML = '';
    if (bms.length === 0) {
        listElement.innerHTML = `
            <tr><td colspan="4" class="empty-state">没有找到匹配的收藏</td></tr>
        `;
        return;
    }

    bms.forEach((bm, index) => {
        const row = document.createElement('tr');
        row.className = 'bm-item';

        // 应用分类颜色
        const categoryStyle = categoryColors[bm.category] || { bg: '#e5e7eb', text: '#4b5563' };
        const categoryHtml = `<span class="cat-tag" style="background-color: ${categoryStyle.bg}; color: ${categoryStyle.text}">${bm.category}</span>`;

        // 应用标签颜色
        const tagHtml = bm.tags.map(tag => {
            const tagStyle = tagColors[tag] || { bg: '#e5e7eb', text: '#4b5563' };
            return `<span class="tag" style="background-color: ${tagStyle.bg}; color: ${tagStyle.text}">${tag.toLowerCase()}</span>`;
        }).join(' ');

        row.innerHTML = `
            <td class="bm-title-cell">
                <a href="${bm.url}" target="_blank">${bm.title}</a>
                <div class="bm-desc">${bm.description}</div>
                <div class="bm-time">
                    <i class="fa-solid fa-clock-o"></i> ${calculateTimeDifference(bm.updatedAt)}
                </div>
            </td>
            <td class="bm-category-cell">${categoryHtml}</td>
            <td class="bm-tags-cell">${tagHtml}</td>
            <td class="bm-time-cell">${formatDate(bm.updatedAt)}</td>
        `;
        listElement.appendChild(row);
    });
};