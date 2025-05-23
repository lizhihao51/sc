// 从JSON文件获取书签数据
export const fetchbms = async () => {
    try {
        const response = await fetch('bookmarks.json');
        if (!response.ok) {
            throw new Error('无法获取书签数据');
        }
        return await response.json();
    } catch (error) {
        // 如果无法获取JSON文件，则使用模拟数据
        console.warn('使用模拟数据:', error);
        return generateMockbms(30); // 生成30条模拟数据
    }
};

// 生成模拟书签数据
function generateMockbms(count) {
    const categories = ['技术', '设计', '工具', '资源', '学习'];
    const tags = ['前端', '后端', 'UI', 'UX', 'CSS', 'JavaScript', 'Python', '免费', '教程', '代码'];
    const titles = [
        'MDN Web Docs', 'Tailwind CSS', 'Dribbble', 'GitHub', 'Figma',
        'Stack Overflow', 'Unsplash', 'VS Code', 'Canva', 'Regex101',
        'CSS-Tricks', 'CodePen', 'Behance', 'Google Fonts', 'JSONPlaceholder',
        'Font Awesome', 'React官方文档', 'Vue.js', 'TypeScript', 'Webpack',
        'Babel', 'ESLint', 'Prettier', 'PostgreSQL', 'MongoDB', 'Firebase'
    ];

    const bms = [];
    for (let i = 1; i <= count; i++) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);

        // 生成过去1-90天内的随机日期
        const randomDaysAgo = Math.floor(Math.random() * 90) + 1;
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - randomDaysAgo);

        bms.push({
            id: i,
            title: randomTitle,
            url: `https://example.com/${randomTitle.toLowerCase().replace(/\s+/g, '-')}`,
            category: randomCategory,
            tags: randomTags,
            updatedAt: randomDate.toISOString().split('T')[0]
        });
    }

    return bms;
}