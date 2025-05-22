// 工具函数模块
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const calculateTimeDifference = (dateString) => {
  // 时间差计算逻辑（保持原代码）
};