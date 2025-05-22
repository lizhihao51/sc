// 搜索功能模块（带防抖）
export const initSearch = (searchInput, searchSuggestions, updateListCallback) => {
  let searchTimeout = null;
  const performSearch = (e) => {
    const query = e.target.value.toLowerCase().trim();
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      updateListCallback(query); // 触发列表更新
      showSuggestions(query);
    }, 300);
  };
  searchInput.addEventListener('input', performSearch);
};

const showSuggestions = (query) => {
  // 实现搜索建议逻辑（需依赖数据模块）
};