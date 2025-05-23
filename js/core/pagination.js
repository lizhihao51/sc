// 分页功能模块
export const updatePagination = (totalPages, currentPage, callback) => {
    // 修改获取元素的 id 为 pg-ctrls
    const paginationNumbers = document.getElementById('pg-ctrls'); 
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    // 清空现有页码
    if (paginationNumbers) {
        paginationNumbers.innerHTML = '';
    }

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
    if (prevButton) {
        prevButton.disabled = currentPage === 1;
    }
    if (nextButton) {
        nextButton.disabled = currentPage === totalPages;
    }

    // 为按钮添加点击事件
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                callback(currentPage);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                callback(currentPage);
            }
        });
    }

    // 辅助函数：添加页码按钮
    function addPageButton(pageNum) {
        const pageNumber = document.createElement('button');
        pageNumber.className = `pagination-number ${pageNum === currentPage ? 'active' : ''}`;
        pageNumber.textContent = pageNum;

        pageNumber.addEventListener('click', () => {
            callback(pageNum);
        });

        if (paginationNumbers) {
            paginationNumbers.appendChild(pageNumber);
        }
    }

    // 辅助函数：添加省略号
    function addEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';

        if (paginationNumbers) {
            paginationNumbers.appendChild(ellipsis);
        }
    }
};