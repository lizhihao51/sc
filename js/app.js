// 应用入口，整合所有模块
import { fetchBookmarks } from './core/dataService.js';
import { renderBookmarks } from './uiRenderer.js';
import { initSearch } from './core/search.js';
import { updatePagination } from './core/pagination.js';

// 全局状态
let allBookmarks = [];
let currentPage = 1;

// 初始化应用
const initApp = async () => {
  try {
    allBookmarks = await fetchBookmarks();
    const listElement = document.getElementById('bookmark-list');
    renderBookmarks(allBookmarks.slice(0, 5), listElement); // 初始渲染前5条
    initSearch(); // 初始化搜索功能
    updatePagination(allBookmarks.length); // 初始化分页
  } catch (error) {
    console.error('应用初始化失败:', error);
  }
};

// 启动应用
initApp();