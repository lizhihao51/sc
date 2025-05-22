// 应用入口，整合所有模块
import { fetchBookmarks } from './core/dataService.js';
import { renderBookmarks } from './uiRenderer.js';
import { initSearch } from './core/search.js';
import { updatePagination } from './core/pagination.js';
import { initFilterButtons } from './core/filters.js';
import { initScrollEffects, initResponsiveLayout } from './script.js';

// 全局状态
let allBookmarks = [];
let currentPage = 1;
let currentFilter = '全部';
let currentSearchQuery = '';

// 初始化应用
const initApp = async () => {
    try {
        allBookmarks = await fetchBookmarks();
        const listElement = document.getElementById('bookmark-list');
        const searchInput = document.getElementById('search-input');
        const searchSuggestions = document.getElementById('search-suggestions');

        // 初始渲染
        updateBookmarkList();

        // 初始化交互功能
        initSearch(searchInput, searchSuggestions, (query) => {
            currentSearchQuery = query;
            currentPage = 1;
            updateBookmarkList();
        });
        initFilterButtons(allBookmarks, (filter) => {
            currentFilter = filter;
            currentPage = 1;
            updateBookmarkList();
        });
        initScrollEffects();
        initResponsiveLayout();
    } catch (error) {
        console.error('应用初始化失败:', error);
    }
};

// 更新书签列表
const updateBookmarkList = () => {
    // 应用筛选和搜索
    let filteredBookmarks = allBookmarks.filter(bookmark => {
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

    const itemsPerPage = window.innerWidth < 768 ? 10 : 5;
    const totalPages = Math.max(1, Math.ceil(filteredBookmarks.length / itemsPerPage));

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredBookmarks.length);

    const currentPageData = filteredBookmarks.slice(startIndex, endIndex);

    const listElement = document.getElementById('bookmark-list');
    renderBookmarks(currentPageData, listElement);

    updatePagination(totalPages, currentPage, (page) => {
        currentPage = page;
        updateBookmarkList();
    });

    document.getElementById('start-index').textContent = startIndex + 1;
    document.getElementById('end-index').textContent = endIndex;
    document.getElementById('total-count').textContent = filteredBookmarks.length;
};

// 启动应用
initApp();