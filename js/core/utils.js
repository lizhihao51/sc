// 工具函数模块
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const calculateTimeDifference = (dateString) => {
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
};