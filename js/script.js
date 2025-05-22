// 初始化滚动效果
export const initScrollEffects = () => {
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
};

// 初始化响应式布局
export const initResponsiveLayout = () => {
    // 窗口大小改变时重新计算分页
    window.addEventListener('resize', () => {
        // 这里调用更新书签列表的函数
        // 由于函数定义在app.js中，这里可以通过事件触发或者直接调用
        // 为了简单起见，假设在全局作用域中有一个updateBookmarkList函数
        if (typeof updateBookmarkList === 'function') {
            updateBookmarkList();
        }
    });
};