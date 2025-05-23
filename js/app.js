// 应用入口，整合所有模块
import { fetchbms } from './core/dataService.js';
import { renderbms } from './uiRenderer.js';
import { initSearch } from './core/search.js';
import { updatePagination } from './core/pagination.js';
import { initFilterButtons } from './core/filters.js';
import { initScrollEffects, initResponsiveLayout } from './script.js';

// 全局状态
let allbms = [];
let currentPage = 1;
let currentFilter = '全部';
let currentSearchQuery = '';

// 初始化应用
const initApp = async () => {
    try {
        allbms = await fetchbms();
        const listElement = document.getElementById('bm-list');
        const searchInput = document.getElementById('search-input');
        const searchSuggestions = document.getElementById('search-suggestions');

        // 初始渲染
        updatebmList();

        // 初始化交互功能
        initSearch(searchInput, searchSuggestions, (query) => {
            currentSearchQuery = query;
            currentPage = 1;
            updatebmList();
        });
        initFilterButtons(allbms, (filter) => {
            currentFilter = filter;
            currentPage = 1;
            updatebmList();
        });
        initScrollEffects();
        initResponsiveLayout();
    } catch (error) {
        console.error('应用初始化失败:', error);
    }
};

// 更新书签列表
const updatebmList = () => {
    // 应用筛选和搜索
    let filteredbms = allbms.filter(bm => {
        // 应用筛选
        const matchesFilter = currentFilter === '全部' ||
            bm.category === currentFilter ||
            bm.tags.includes(currentFilter);

        // 应用搜索
        const searchTerm = currentSearchQuery.toLowerCase();
        const matchesSearch =
            bm.title.toLowerCase().includes(searchTerm) ||
            bm.category.toLowerCase().includes(searchTerm) ||
            bm.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        return matchesFilter && matchesSearch;
    });

    const itemsPerPage = window.innerWidth < 768 ? 10 : 5;
    const totalPages = Math.max(1, Math.ceil(filteredbms.length / itemsPerPage));

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredbms.length);

    const currentPageData = filteredbms.slice(startIndex, endIndex);

    const listElement = document.getElementById('bm-list');
    renderbms(currentPageData, listElement);

    updatePagination(totalPages, currentPage, (page) => {
        currentPage = page;
        updatebmList();
    });

    document.getElementById('start-index').textContent = startIndex + 1;
    document.getElementById('end-index').textContent = endIndex;
    document.getElementById('total-count').textContent = filteredbms.length;
};

// 启动应用
initApp();