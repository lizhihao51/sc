// UI 渲染模块
import { formatDate, calculateTimeDifference } from './core/utils.js';

export const renderBookmarks = (bookmarks, listElement) => {
  listElement.innerHTML = '';
  if (bookmarks.length === 0) {
    listElement.innerHTML = `
      <tr><td colspan="4" class="empty-state">没有找到匹配的收藏</td></tr>
    `;
    return;
  }

  bookmarks.forEach((bookmark, index) => {
    const row = document.createElement('tr');
    row.className = 'bookmark-item';
    row.innerHTML = `
      <td class="bookmark-title-cell">
        <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
        <div class="bookmark-desc">${bookmark.description}</div>
        <div class="bookmark-time">
          <i class="fa-solid fa-clock-o"></i> ${calculateTimeDifference(bookmark.updatedAt)}
        </div>
      </td>
      <td class="bookmark-category-cell">${bookmark.category}</td>
      <td class="bookmark-tags-cell">${bookmark.tags.join(', ')}</td>
      <td class="bookmark-time-cell">${formatDate(bookmark.updatedAt)}</td>
    `;
    listElement.appendChild(row);
  });
};