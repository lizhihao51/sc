// 应用入口，整合所有模块
import { fetchBookmarks } from './core/dataService.js';
import { renderBookmarks } from './uiRenderer.js';
import { initSearch } from './core/search.js';
import { updatePagination } from './core/pagination.js';
import { initFilterButtons } from './filters.js';

// 全局状态
let allBookmarks = [];
let currentFilter = '全部';
let currentSearchQuery = '';
let currentPage = 1;
const itemsPerPage = {
  desktop: 10,
  mobile: 5
};

// 初始化应用
const initApp = async () => {
  try {
    // 显示加载状态
    showLoadingState();

    // 获取数据
    allBookmarks = await fetchBookmarks();

    // 初始渲染
    updateBookmarkList();

    // 初始化交互功能
    initFilterButtons(allBookmarks, currentFilter, updateBookmarkList);
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    initSearch(searchInput, searchSuggestions, (query) => {
      currentSearchQuery = query;
      currentPage = 1;
      updateBookmarkList();
    });
    initScrollEffects();
    initResponsiveLayout();
  } catch (error) {
    console.error('加载收藏失败:', error);
    showErrorState();
  }
};

// 显示加载状态
function showLoadingState() {
  const listElement = document.getElementById('bookmark-list');
  listElement.innerHTML = `
    <tr>
      <td colspan="4" class="px-6 py-12 text-center text-gray-500">
        <i class="fa-solid fa-spinner fa-spin text-3xl mb-2 block"></i>
        <p>加载中...</p>
      </td>
    </tr>
  `;
}

// 显示错误状态
function showErrorState() {
  const listElement = document.getElementById('bookmark-list');
  listElement.innerHTML = `
    <tr>
      <td colspan="4" class="px-6 py-12 text-center text-red-500">
        <i class="fa-solid fa-exclamation-triangle text-3xl mb-2 block"></i>
        <p>加载收藏失败，请重试</p>
      </td>
    </tr>
  `;
}

// 更新书签列表
function updateBookmarkList() {
  // 应用筛选和搜索
  let filteredBookmarks = filterAndSearchBookmarks();

  // 更新总数
  document.getElementById('total-count').textContent = filteredBookmarks.length;

  // 获取当前页的项目数
  const itemsPerPageValue = getItemsPerPage();

  // 计算总页数
  const totalPages = Math.max(1, Math.ceil(filteredBookmarks.length / itemsPerPageValue));

  // 确保当前页在有效范围内
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // 计算当前页的数据范围
  const startIndex = (currentPage - 1) * itemsPerPageValue;
  const endIndex = Math.min(startIndex + itemsPerPageValue, filteredBookmarks.length);

  // 获取当前页的数据
  const currentPageData = filteredBookmarks.slice(startIndex, endIndex);

  // 渲染书签
  const listElement = document.getElementById('bookmark-list');
  renderBookmarks(currentPageData, listElement);

  // 更新分页信息
  updatePaginationInfo(startIndex, endIndex, filteredBookmarks.length);

  // 更新分页控件
  updatePagination(totalPages, currentPage, (page) => {
    currentPage = page;
    updateBookmarkList();
  });
}

// 筛选和搜索书签
function filterAndSearchBookmarks() {
  return allBookmarks.filter(bookmark => {
    // 应用筛选
    const matchesFilter = currentFilter === '全部' || 
                         bookmark.category === currentFilter || 
                         bookmark.tags.includes(currentFilter);

    // 应用搜索
    const searchTerm = currentSearchQuery.toLowerCase();
    const matchesSearch = 
      bookmark.title.toLowerCase().includes(searchTerm) ||
      bookmark.category.toLowerCase().includes(searchTerm) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm));

    return matchesFilter && matchesSearch;
  });
}

// 获取当前页的项目数
function getItemsPerPage() {
  return window.innerWidth < 768 ? itemsPerPage.mobile : itemsPerPage.desktop;
}

// 更新分页信息
function updatePaginationInfo(startIndex, endIndex, totalCount) {
  document.getElementById('start-index').textContent = startIndex + 1;
  document.getElementById('end-index').textContent = endIndex;
  document.getElementById('total-count').textContent = totalCount;
}

// 初始化滚动效果
function initScrollEffects() {
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // 滚动时添加阴影
    if (currentScrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 向上滚动时显示导航栏，向下滚动时隐藏（超过一定距离）
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  });
}

// 初始化响应式布局
function initResponsiveLayout() {
  // 窗口大小改变时重新计算分页
  window.addEventListener('resize', () => {
    updateBookmarkList();
  });
}

// 启动应用
initApp();