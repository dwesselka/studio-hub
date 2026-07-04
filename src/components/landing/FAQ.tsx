import { useState } from 'react'
import type { FAQItem } from '@/data/content'
import { faq } from '@/data/content'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section faq">
      <div className="container">
        <div className="section__header">
          <h2>Perguntas frequentes</h2>
          <p>Não encontrou sua resposta? Use o chat no canto da tela.</p>
        </div>
        <div className="faq__list">
          {faq.map((item: FAQItem, index: number) => (
            <div
              key={item.question}
              className={`faq__item${openIndex === index ? ' faq__item--open' : ''}`}
            >
              <button
                type="button"
                className="faq__question"
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
              >
                {item.question}
                <span className="faq__icon" aria-hidden="true" />
              </button>
              <div className="faq__answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
