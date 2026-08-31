// 노션 블록 → 마크다운. 지원하지 않는 블록은 조용히 건너뛴다(빌드를 막지 않는다).
import { plain } from './_lib.mjs'

function rich(r) {
  if (!Array.isArray(r)) return ''
  return r
    .map((t) => {
      let s = t?.plain_text ?? ''
      if (!s) return ''
      const a = t.annotations || {}
      if (a.code) s = '`' + s + '`'
      if (a.bold) s = '**' + s + '**'
      if (a.italic) s = '*' + s + '*'
      if (t.href) s = `[${s}](${t.href})`
      return s
    })
    .join('')
}

export function blocksToMarkdown(blocks) {
  const lines = []
  for (const b of blocks || []) {
    const d = b.data || {}
    switch (b.type) {
      case 'paragraph': {
        const t = rich(d.rich_text)
        lines.push(t)
        break
      }
      case 'heading_1':
        lines.push('# ' + rich(d.rich_text))
        break
      case 'heading_2':
        lines.push('## ' + rich(d.rich_text))
        break
      case 'heading_3':
        lines.push('### ' + rich(d.rich_text))
        break
      case 'bulleted_list_item':
        lines.push('- ' + rich(d.rich_text))
        break
      case 'numbered_list_item':
        lines.push('1. ' + rich(d.rich_text))
        break
      case 'quote':
        lines.push('> ' + rich(d.rich_text))
        break
      case 'code':
        lines.push('```' + (d.language || '') + '\n' + plain(d.rich_text) + '\n```')
        break
      case 'divider':
        lines.push('---')
        break
      case 'to_do':
        lines.push('- ' + rich(d.rich_text))
        break
      default:
        break // 이미지·임베드 등은 본문에서 다루지 않는다
    }
  }
  return lines.join('\n\n').replace(/\n{3,}/g, '\n\n').trim()
}

/**
 * 본문을 한국어/영어로 가른다.
 * `## EN` (대소문자 무시) 이 나오는 지점부터 영어로 본다. 없으면 전부 한국어.
 */
export function splitLangBody(markdown) {
  if (!markdown) return { ko: '', en: '' }
  const lines = markdown.split('\n')
  const idx = lines.findIndex((l) => /^#{1,3}\s*EN\s*$/i.test(l.trim()))
  if (idx === -1) return { ko: markdown.trim(), en: '' }
  return {
    ko: lines.slice(0, idx).join('\n').trim(),
    en: lines.slice(idx + 1).join('\n').trim(),
  }
}
