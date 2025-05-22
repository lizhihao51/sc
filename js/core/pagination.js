// 分页功能模块
export const updatePagination = (totalPages, currentPage, callback) => {
  // 生成分页按钮逻辑
  const paginationNumbers = document.getElementById('pagination-numbers');
  paginationNumbers.innerHTML = '';

  // 添加页码按钮
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.addEventListener('click', () => callback(i));
    paginationNumbers.appendChild(btn);
  }
};