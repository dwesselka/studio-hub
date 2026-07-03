import type { ReactNode } from 'react'

export function formatMessage(text: string): ReactNode {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line
        .split(/(\*\*[^*]+\*\*)/)
        .map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ))
}
