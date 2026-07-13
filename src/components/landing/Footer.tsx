import { SITE } from '@/data/content'

export default function Footer() {
  return (
    <footer className="bg-[#09080D] border-t border-zinc-900 py-16 text-zinc-500 font-sans">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              S
            </span>
            <span className="text-zinc-300 font-semibold">{SITE.name}</span>
            <span className="text-[10px] text-zinc-500 font-mono">LAB</span>
          </div>
          <p className="text-xs text-zinc-600 max-w-sm text-center md:text-left font-mono mt-1">
            "Não buscamos apenas construir software. Buscamos evoluir como engenheiros."
          </p>
        </div>

        <div className="flex items-center gap-8 text-xs font-mono">
          <a href="#journey" className="hover:text-zinc-300 transition-colors">
            Jornada
          </a>
          <a href="#principles" className="hover:text-zinc-300 transition-colors">
            Princípios
          </a>
          <a href="#architecture" className="hover:text-zinc-300 transition-colors">
            Arquitetura
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            GitHub
          </a>
        </div>

        <p className="text-[11px] font-mono text-zinc-600">
          &copy; {new Date().getFullYear()} {SITE.name} Engineering. open-source lab.
        </p>
      </div>
    </footer>
  )
}
