// 筛选功能
export function initFilterButtons(allBookmarks, currentFilter, updateListCallback) {
  const filterContainer = document.querySelector('.filter-tags');
  if (!filterContainer) {
    console.error('筛选标签容器不存在');
    return;
  }

  // 清空现有标签（保留"全部"）
  const allButton = filterContainer.querySelector('.filter-btn.active');
  filterContainer.innerHTML = '';
  filterContainer.appendChild(allButton);

  // 添加所有标签
  const uniqueTags = [...new Set(allBookmarks.flatMap(bookmark => bookmark.tags))];

  uniqueTags.forEach(tag => {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.textContent = tag;
    button.dataset.filter = tag;

    button.addEventListener('click', () => {
      // 移除所有按钮的活动状态
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      // 添加当前按钮的活动状态
      button.classList.add('active');

      // 更新筛选条件
      currentFilter = tag;
      updateListCallback();
    });

    filterContainer.appendChild(button);
  });

  // 为"全部"按钮添加点击事件
  allButton.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    allButton.classList.add('active');

    currentFilter = '全部';
    updateListCallback();
  });
}