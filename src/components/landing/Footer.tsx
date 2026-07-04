import { SITE } from '@/data/content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <strong>{SITE.name}</strong>
          <p>{SITE.tagline}</p>
        </div>
        <div className="footer__links">
          <a href="#beneficios">Benefícios</a>
          <a href="#planos">Planos</a>
          <a href="#faq">FAQ</a>
        </div>
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
