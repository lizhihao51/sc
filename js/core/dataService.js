// 数据加载与处理模块
export const fetchBookmarks = async () => {
  try {
    const response = await fetch('bookmarks.json');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('数据加载失败:', error);
    throw error;
  }
};