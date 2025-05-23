// 分页功能模块
export const updatePagination = (totalPages, currentPage, callback) => {
    const paginationContainer = document.querySelector('.pg-ctrls');
    // 清空现有内容
    paginationContainer.innerHTML = '';

    // 创建上一页按钮
    const prevButton = document.createElement('button');
    prevButton.id = 'prev-page';
    prevButton.textContent = '上一页';
    prevButton.className = 'pg-btn';
    paginationContainer.appendChild(prevButton);

    // 创建页码容器
    const paginationNumbers = document.createElement('div');
    paginationNumbers.id = 'pagination-numbers';
    paginationContainer.appendChild(paginationNumbers);

    // 创建下一页按钮
    const nextButton = document.createElement('button');
    nextButton.id = 'next-page';
    nextButton.textContent = '下一页';
    nextButton.className = 'pg-btn';
    paginationContainer.appendChild(nextButton);

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
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            callback(currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            callback(currentPage);
        }
    });

    // 辅助函数：添加页码按钮
    function addPageButton(pageNum) {
        const pageNumber = document.createElement('button');
        pageNumber.className = `pagination-number ${pageNum === currentPage ? 'active' : ''}`;
        // 将页码数字替换为空字符串
        pageNumber.textContent = '';

        pageNumber.addEventListener('click', () => {
            callback(pageNum);
        });

        paginationNumbers.appendChild(pageNumber);
    }

    // 辅助函数：添加省略号
    function addEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        paginationNumbers.appendChild(ellipsis);
    }
};