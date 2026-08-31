/**
 * 아주 작은 마크다운 렌더러.
 * 노션 본문에서 실제로 쓰는 문법만 다룬다: 문단 / ## ### 제목 / - 목록 / 1. 목록 / **굵게** / *기울임* / `코드` / [링크](url) / ---
 * 외부 라이브러리를 쓰지 않아 의존성 사고가 없고, HTML 은 직접 만들지 않고 React 요소로 돌려 XSS 여지를 없앤다.
 */
import React from 'react'

type Inline = React.ReactNode

function renderInline(text: string, keyBase: string): Inline[] {
  const out: Inline[] = []
  // 링크 → 코드 → 굵게 → 기울임 순으로 자른다.
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(`([^`]+)`)|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const key = `${keyBase}-i${i++}`
    if (m[1]) {
      out.push(
        React.createElement(
          'a',
          { key, href: m[3], target: '_blank', rel: 'noopener noreferrer', className: 'md-link' },
          m[2],
        ),
      )
    } else if (m[4]) {
      out.push(React.createElement('code', { key, className: 'md-code' }, m[5]))
    } else if (m[6]) {
      out.push(React.createElement('strong', { key }, m[7]))
    } else if (m[8]) {
      out.push(React.createElement('em', { key }, m[9]))
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function renderMarkdown(md: string): React.ReactNode[] {
  if (!md) return []
  const lines = md.split('\n')
  const nodes: React.ReactNode[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let k = 0

  const flushList = () => {
    if (!list) return
    const tag = list.ordered ? 'ol' : 'ul'
    nodes.push(
      React.createElement(
        tag,
        { key: `l${k++}`, className: list.ordered ? 'md-ol' : 'md-ul' },
        list.items.map((it, idx) =>
          React.createElement('li', { key: idx }, renderInline(it, `l${k}-${idx}`)),
        ),
      ),
    )
    list = null
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      flushList()
      continue
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line)
    if (h) {
      flushList()
      const level = Math.min(h[1].length + 1, 5) // 문서 안에서는 h2 부터 시작한다
      nodes.push(
        React.createElement(
          `h${level}`,
          { key: `h${k++}`, className: 'md-h' },
          renderInline(h[2], `h${k}`),
        ),
      )
      continue
    }
    if (/^---+$/.test(line.trim())) {
      flushList()
      nodes.push(React.createElement('hr', { key: `r${k++}`, className: 'md-hr' }))
      continue
    }
    const ul = /^[-*]\s+(.*)$/.exec(line.trim())
    if (ul) {
      if (!list || list.ordered) {
        flushList()
        list = { ordered: false, items: [] }
      }
      list.items.push(ul[1])
      continue
    }
    const ol = /^\d+\.\s+(.*)$/.exec(line.trim())
    if (ol) {
      if (!list || !list.ordered) {
        flushList()
        list = { ordered: true, items: [] }
      }
      list.items.push(ol[1])
      continue
    }
    const q = /^>\s+(.*)$/.exec(line.trim())
    if (q) {
      flushList()
      nodes.push(
        React.createElement(
          'blockquote',
          { key: `q${k++}`, className: 'md-quote' },
          renderInline(q[1], `q${k}`),
        ),
      )
      continue
    }
    flushList()
    nodes.push(
      React.createElement('p', { key: `p${k++}`, className: 'md-p' }, renderInline(line, `p${k}`)),
    )
  }
  flushList()
  return nodes
}
