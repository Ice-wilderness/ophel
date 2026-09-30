import { describe, expect, it } from "vitest"

import { enhanceReleaseNotesHtml, renderMarkdown } from "~utils/markdown"

const renderReleaseNotes = (content: string) =>
  renderMarkdown(content, false, { linkGithubReferences: true })

describe("renderMarkdown linkify CJK tail trimming", () => {
  it("does not swallow CJK text after a bare domain", () => {
    const html = renderReleaseNotes(
      "Gemini Spark（gemini.google.com/spark）的任务对话现在可以同步进对话管理。(#902)",
    )

    expect(html).toContain('<a href="http://gemini.google.com/spark">gemini.google.com/spark</a>')
    expect(html).toContain("）的任务对话现在可以同步进对话管理。")
    // GitHub 引用仍渲染为独立的 issue 链接，不被前面的自动链接吞掉
    expect(html).toContain("gh-release-notes-reference-issue")
    expect(html).toContain(">#902</a>")
  })

  it("trims CJK and full-width punctuation after a scheme URL", () => {
    const html = renderMarkdown("详见 https://example.com/doc）后续内容", false)

    expect(html).toContain('<a href="https://example.com/doc">https://example.com/doc</a>')
    expect(html).toContain("）后续内容")
  })

  it("keeps regular auto links intact", () => {
    const html = renderMarkdown("see https://example.com/a?b=1&c=2 for details", false)

    expect(html).toContain(
      '<a href="https://example.com/a?b=1&amp;c=2">https://example.com/a?b=1&amp;c=2</a>',
    )
  })

  it("keeps email linkification intact", () => {
    const html = renderMarkdown("contact test@example.com please", false)

    expect(html).toContain('<a href="mailto:test@example.com">test@example.com</a>')
  })

  it("leaves explicit markdown links untouched", () => {
    const html = renderMarkdown(
      "[文档](https://example.com/) 与 [页面](https://example.com/页面)",
      false,
    )

    expect(html).toContain('<a href="https://example.com/">文档</a>')
    expect(html).toContain("页面</a>")
  })
})

describe("enhanceReleaseNotesHtml", () => {
  it("enhances blockquote with 国庆快乐 into festive banner", () => {
    const raw = renderMarkdown("> 🇨🇳 **国庆快乐！祝各位节日愉快，阖家安康！**", false)
    const enhanced = enhanceReleaseNotesHtml(raw)

    expect(enhanced).toContain('<blockquote class="gh-release-notes-festive">')
    expect(enhanced).toContain("国庆快乐！")
  })

  it("enhances paragraph with 国庆快乐 into festive banner", () => {
    const raw = renderMarkdown("**🎉 国庆快乐！祝大家度过一个愉快充实的假期！**", false)
    const enhanced = enhanceReleaseNotesHtml(raw)

    expect(enhanced).toContain('<div class="gh-release-notes-festive">')
    expect(enhanced).toContain("国庆快乐！")
  })

  it("enhances announcement notices with notice card styling", () => {
    const raw = renderMarkdown(
      "**⚠️ 公告 — 我们的 GitHub 账号暂时被误封禁，目前正在积极申诉。**",
      false,
    )
    const enhanced = enhanceReleaseNotesHtml(raw)

    expect(enhanced).toContain('<div class="gh-release-notes-notice">')
    expect(enhanced).toContain("⚠️ 公告")
  })

  it("enhances English Notice with notice card styling", () => {
    const raw = renderMarkdown(
      "**📢 Notice — ChatGPT is currently rolling out a major web redesign.**",
      false,
    )
    const enhanced = enhanceReleaseNotesHtml(raw)

    expect(enhanced).toContain('<div class="gh-release-notes-notice">')
    expect(enhanced).toContain("📢 Notice")
  })

  it("leaves regular changelog entries and headings untouched", () => {
    const raw = renderMarkdown(
      "### ✨ 功能优化\n\n- **对话管理体验优化** — 优化对话筛选与搜索。 (#965)",
      false,
    )
    const enhanced = enhanceReleaseNotesHtml(raw)

    expect(enhanced).not.toContain("gh-release-notes-festive")
    expect(enhanced).not.toContain("gh-release-notes-notice")
    expect(enhanced).toContain("对话管理体验优化")
  })
})
