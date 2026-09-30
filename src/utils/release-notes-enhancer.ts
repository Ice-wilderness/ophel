/**
 * 更新日志 HTML 增强工具
 * - 为节日祝贺（如“国庆快乐”）增加醒目的横幅样式（.gh-release-notes-festive）
 * - 为重要公告（⚠️/📢 公告/Notice）增加提示卡片样式（.gh-release-notes-notice）
 */
export const enhanceReleaseNotesHtml = (rawHtml: string): string => {
  let html = rawHtml

  // 为节日问候（如国庆快乐）打上醒目的横幅样式标记
  html = html.replace(
    /<blockquote>(\s*<p>[\s\S]*?国庆快乐[\s\S]*?<\/p>\s*)<\/blockquote>/gu,
    '<blockquote class="gh-release-notes-festive">$1</blockquote>',
  )
  html = html.replace(
    /<p>(<strong>[\s\S]*?国庆快乐[\s\S]*?<\/strong>[\s\S]*?)<\/p>/gu,
    '<div class="gh-release-notes-festive"><p>$1</p></div>',
  )

  // 为重要公告（⚠️ / 📢）打上提示卡片样式标记
  html = html.replace(
    /<p>(<strong>\s*(?:⚠️|📢)\s*(?:公告|Notice)[\s\S]*?<\/strong>)<\/p>/gu,
    '<div class="gh-release-notes-notice"><p>$1</p></div>',
  )

  return html
}
