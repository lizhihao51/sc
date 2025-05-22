// script.js - 收藏网站的交互逻辑

// 全局变量
let allBookmarks = [];
let currentFilter = '全部';
let currentSearchQuery = '';
let currentPage = 1;
const itemsPerPage = {
    desktop: 10,
    mobile: 5
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// 初始化应用
async function initApp() {
    try {
        // 显示加载状态
        showLoadingState();
        
        // 获取数据
        allBookmarks = await fetchBookmarks();
        
        // 初始渲染
        updateBookmarkList();
        
        // 初始化交互功能
        initFilterButtons();
        initSearch();
        initScrollEffects();
        initResponsiveLayout();
    } catch (error) {
        console.error('加载收藏失败:', error);
        showErrorState();
    }
}

// 从JSON文件获取书签数据
async function fetchBookmarks() {
    try {
        const response = await fetch('bookmarks.json');
        if (!response.ok) {
            throw new Error('无法获取书签数据');
        }
        return await response.json();
    } catch (error) {
        // 如果无法获取JSON文件，则使用模拟数据
        console.warn('使用模拟数据:', error);
        return generateMockBookmarks(30); // 生成30条模拟数据
    }
}

// 生成模拟书签数据
function generateMockBookmarks(count) {
    const categories = ['技术', '设计', '工具', '资源', '学习'];
    const tags = ['前端', '后端', 'UI', 'UX', 'CSS', 'JavaScript', 'Python', '免费', '教程', '代码'];
    const titles = [
        'MDN Web Docs', 'Tailwind CSS', 'Dribbble', 'GitHub', 'Figma',
        'Stack Overflow', 'Unsplash', 'VS Code', 'Canva', 'Regex101',
        'CSS-Tricks', 'CodePen', 'Behance', 'Google Fonts', 'JSONPlaceholder',
        'Font Awesome', 'React官方文档', 'Vue.js', 'TypeScript', 'Webpack',
        'Babel', 'ESLint', 'Prettier', 'PostgreSQL', 'MongoDB', 'Firebase'
    ];
    
    const bookmarks = [];
    for (let i = 1; i <= count; i++) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
        
        // 生成过去1-90天内的随机日期
        const randomDaysAgo = Math.floor(Math.random() * 90) + 1;
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - randomDaysAgo);
        
        bookmarks.push({
            id: i,
            title: randomTitle,
            url: `https://example.com/${randomTitle.toLowerCase().replace(/\s+/g, '-')}`,
            category: randomCategory,
            tags: randomTags,
            updatedAt: randomDate.toISOString().split('T')[0]
        });
    }
    
    return bookmarks;
}

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
    renderBookmarks(currentPageData);
    
    // 更新分页信息
    updatePaginationInfo(startIndex, endIndex, filteredBookmarks.length);
    
    // 更新分页控件
    updatePaginationControls(totalPages);
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

// 渲染书签列表
function renderBookmarks(bookmarks) {
    const listElement = document.getElementById('bookmark-list');
    listElement.innerHTML = '';
    
    if (bookmarks.length === 0) {
        listElement.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                    <i class="fa-solid fa-bookmark-o text-3xl mb-2 block"></i>
                    <p>没有找到匹配的收藏</p>
                </td>
            </tr>
        `;
        return;
    }
    
    bookmarks.forEach(bookmark => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        
        // 计算时间差
        const timeDiff = calculateTimeDifference(bookmark.updatedAt);
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <a href="${bookmark.url}" target="_blank" class="text-blue-600 hover:text-blue-900 font-medium truncate max-w-xs md:max-w-md">
                        ${bookmark.title}
                    </a>
                </div>
                <div class="text-xs text-gray-500 mt-1">${timeDiff}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    ${bookmark.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                    ${bookmark.tags.map(tag => `
                        <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            ${tag}
                        </span>
                    `).join('')}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDate(bookmark.updatedAt)}
            </td>
        `;
        
        listElement.appendChild(row);
    });
}

// 格式化日期
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
}

// 计算时间差
function calculateTimeDifference(dateString) {
    const now = new Date();
    const updated = new Date(dateString);
    const diffInMs = now - updated;
    
    // 转换为不同的时间单位
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
    
    if (diffInYears > 0) {
        return `${diffInYears}年前`;
    } else if (diffInMonths > 0) {
        return `${diffInMonths}个月前`;
    } else if (diffInWeeks > 0) {
        return `${diffInWeeks}周前`;
    } else if (diffInDays > 0) {
        return `${diffInDays}天前`;
    } else if (diffInHours > 0) {
        return `${diffInHours}小时前`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes}分钟前`;
    } else {
        return `${diffInSeconds}秒前`;
    }
}

// 更新分页信息
function updatePaginationInfo(startIndex, endIndex, totalCount) {
    document.getElementById('start-index').textContent = startIndex + 1;
    document.getElementById('end-index').textContent = endIndex;
    document.getElementById('total-count').textContent = totalCount;
}

// 更新分页控件
function updatePaginationControls(totalPages) {
    const paginationNumbers = document.getElementById('pagination-numbers');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    // 清空现有页码
    paginationNumbers.innerHTML = '';
    
    // 生成分页按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // 添加第一页按钮（如果需要）
    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            addEllipsis();
        }
    }
    
    // 添加可见页码
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }
    
    // 添加最后一页按钮（如果需要）
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            addEllipsis();
        }
        addPageButton(totalPages);
    }
    
    // 更新按钮状态
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    
    // 为按钮添加点击事件
    prevButton.addEventListener('click', goToPrevPage);
    nextButton.addEventListener('click', goToNextPage);
    
    // 辅助函数：添加页码按钮
    function addPageButton(pageNum) {
        const pageNumber = document.createElement('button');
        pageNumber.className = `px-3 py-1 rounded-md text-sm font-medium ${pageNum === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`;
        pageNumber.textContent = pageNum;
        
        pageNumber.addEventListener('click', () => {
            currentPage = pageNum;
            updateBookmarkList();
        });
        
        paginationNumbers.appendChild(pageNumber);
    }
    
    // 辅助函数：添加省略号
    function addEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'px-2 py-1 text-sm text-gray-500';
        ellipsis.textContent = '...';
        paginationNumbers.appendChild(ellipsis);
    }
}

// 前往上一页
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateBookmarkList();
    }
}

// 前往下一页
function goToNextPage() {
    const totalPages = Math.ceil(filterAndSearchBookmarks().length / getItemsPerPage());
    if (currentPage < totalPages) {
        currentPage++;
        updateBookmarkList();
    }
}

// 初始化筛选按钮
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的活动状态
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            // 添加当前按钮的活动状态
            button.classList.remove('bg-gray-200', 'text-gray-700');
            button.classList.add('active', 'bg-blue-500', 'text-white');
            
            // 更新筛选条件
            currentFilter = button.textContent.trim();
            
            // 重置页码并更新列表
            currentPage = 1;
            updateBookmarkList();
        });
    });
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    const performSearch = () => {
        currentSearchQuery = searchInput.value.toLowerCase().trim();
        currentPage = 1; // 重置页码
        updateBookmarkList();
    };
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 搜索输入框获得焦点时的动画效果
    searchInput.addEventListener('focus', () => {
        document.querySelector('header').classList.add('py-2');
        document.querySelector('header').classList.remove('py-3');
    });
    
    searchInput.addEventListener('blur', () => {
        if (!searchInput.value) {
            document.querySelector('header').classList.add('py-3');
            document.querySelector('header').classList.remove('py-2');
        }
    });
}

// 初始化滚动效果
function initScrollEffects() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 滚动时添加阴影
        if (currentScrollY > 10) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
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
    // 初始设置
    updateItemsPerPage();
    
    // 窗口大小改变时更新
    window.addEventListener('resize', updateItemsPerPage);
}

// 更新每页显示数量
function updateItemsPerPage() {
    const isMobile = window.innerWidth < 768; // 以768px为分界线
    const newItemsPerPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
    
    // 如果每页显示数量改变了，重置当前页并更新列表
    if (newItemsPerPage !== getItemsPerPage()) {
        currentPage = 1;
        updateBookmarkList();
    }
}

// 获取当前每页显示数量
function getItemsPerPage() {
    return window.innerWidth < 768 ? itemsPerPage.mobile : itemsPerPage.desktop;
}
    