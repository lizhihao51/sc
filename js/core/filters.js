// 筛选功能模块
export const initFilterButtons = (allbms, callback) => {
    // 修正选择器，使用.flt-tags
    const filterContainer = document.querySelector('.flt-tags');
    // 修正选择器，使用.flt-btn[data-filter="全部"]
    const allButton = document.querySelector('.flt-btn[data-filter="全部"]');

    // 获取所有标签
    const allTags = new Set();
    allbms.forEach(bm => {
        bm.tags.forEach(tag => allTags.add(tag));
    });

    // 创建筛选按钮
    allTags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'flt-btn';
        button.dataset.filter = tag;
        button.textContent = tag;

        button.addEventListener('click', () => {
            document.querySelectorAll('.flt-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            callback(tag);
        });

        filterContainer.appendChild(button);
    });

    // 为"全部"按钮添加点击事件
    allButton.addEventListener('click', () => {
        document.querySelectorAll('.flt-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        allButton.classList.add('active');

        callback('全部');
    });
};