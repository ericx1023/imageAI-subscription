/**
 * 驗證模型名稱是否符合格式規範
 * @param name 模型名稱
 * @returns boolean
 */
export const isValidModelName = (name: string): boolean => {
  const pattern = /^[a-z0-9][a-z0-9-._]*[a-z0-9]$|^[a-z0-9]$/;
  return pattern.test(name);
};

/**
 * 驗證 URL 是否有效
 * @param urlString URL 字串
 * @returns boolean
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * 格式化模型名稱
 * @param name 原始名稱
 * @returns 格式化後的名稱
 */
export const formatModelName = (name: string): string => {
  let formatted = name.toLowerCase()
    .replace(/[^a-z0-9\-._]/g, '')
    .replace(/^[-._]+/, '')
    .replace(/[-._]+$/, '');
  
  return formatted || 'model';
}; 