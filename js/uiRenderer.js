// UI 渲染模块
import { formatDate, calculateTimeDifference } from './core/utils.js';

export const renderbms = (bms, listElement) => {
  listElement.innerHTML = '';
  if (bms.length === 0) {
    listElement.innerHTML = `
      <tr><td colspan="4" class="empty-state">没有找到匹配的收藏</td></tr>
    `;
    return;
  }

  bms.forEach((bm , index) => {
    const row = document.createElement('tr');
    row.className = 'bm-item';
    row.innerHTML = `
      <td class="bm-title-cell">
        <a href="${bm.url}" target="_blank">${bm.title}</a>
        <div class="bm-desc">${bm.description}</div>
        <div class="bm-time">
          <i class="fa-solid fa-clock-o"></i> ${calculateTimeDifference(bm.updatedAt)}
        </div>
      </td>
      <td class="bm-category-cell">${bm.category}</td>
      <td class="bm-tags-cell">${bm.tags.join(', ')}</td>
      <td class="bm-time-cell">${formatDate(bm.updatedAt)}</td>
    `;
    listElement.appendChild(row);
  });
};