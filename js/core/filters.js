// 筛选功能模块
export const initFilterButtons = (allbms, callback) => {
    const filterContainer = document.querySelector('.filter-tags');
    const allButton = document.querySelector('.filter-btn[data-filter="全部"]');

    // 获取所有标签
    const allTags = new Set();
    allbms.forEach(bm => {
        bm.tags.forEach(tag => allTags.add(tag));
    });

    // 创建筛选按钮
    allTags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.filter = tag;
        button.textContent = tag;

        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            callback(tag);
        });

        filterContainer.appendChild(button);
    });

    // 为"全部"按钮添加点击事件
    allButton.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        allButton.classList.add('active');

        callback('全部');
    });
};