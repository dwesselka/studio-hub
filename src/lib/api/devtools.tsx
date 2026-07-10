import { useState, useEffect, useCallback } from 'react'
import { simulator, type NetworkConfig, type SimulationEvent } from './simulator'

const styles = `
.mock-devtools {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99999;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #e0e0e0;
}
.mock-devtools__toggle {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #444;
  background: #1a1a2e;
  color: #e0e0e0;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.mock-devtools__panel {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 400px;
  max-height: 70vh;
  background: #1a1a2e;
  border: 1px solid #333;
  border-radius: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 2px 12px rgba(0,0,0,0.4);
}
.mock-devtools__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #333;
  background: #16213e;
  border-radius: 8px 0 0 0;
}
.mock-devtools__header h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #4fc3f7;
}
.mock-devtools__close {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  line-height: 1;
}
.mock-devtools__body {
  overflow-y: auto;
  padding: 8px 12px;
  flex: 1;
}
.mock-devtools__section {
  margin-bottom: 12px;
}
.mock-devtools__section h4 {
  margin: 0 0 6px;
  font-size: 11px;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 0.5px;
}
.mock-devtools__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.mock-devtools__row label {
  font-size: 11px;
  color: #aaa;
}
.mock-devtools__row input[type="range"] {
  width: 100px;
  accent-color: #4fc3f7;
}
.mock-devtools__row input[type="number"] {
  width: 60px;
  padding: 2px 4px;
  background: #16213e;
  border: 1px solid #444;
  color: #e0e0e0;
  border-radius: 3px;
  font-size: 11px;
}
.mock-devtools__value {
  font-size: 11px;
  color: #4fc3f7;
  min-width: 30px;
  text-align: right;
}
.mock-devtools__btn {
  padding: 4px 10px;
  background: #16213e;
  border: 1px solid #444;
  color: #e0e0e0;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
}
.mock-devtools__btn:hover {
  background: #0f3460;
}
.mock-devtools__btn--danger {
  border-color: #e74c3c;
  color: #e74c3c;
}
.mock-devtools__log {
  max-height: 200px;
  overflow-y: auto;
  background: #0d1117;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 10px;
}
.mock-devtools__log-entry {
  padding: 2px 0;
  border-bottom: 1px solid #1a1a2e;
  display: flex;
  gap: 6px;
}
.mock-devtools__log-method {
  font-weight: 600;
  min-width: 40px;
}
.mock-devtools__log-method.GET { color: #4fc3f7; }
.mock-devtools__log-method.POST { color: #81c784; }
.mock-devtools__log-method.PUT { color: #ffb74d; }
.mock-devtools__log-method.PATCH { color: #aed581; }
.mock-devtools__log-method.DELETE { color: #e57373; }
.mock-devtools__log-status {
  min-width: 24px;
}
.mock-devtools__log-status.ok { color: #81c784; }
.mock-devtools__log-status.err { color: #e57373; }
.mock-devtools__log-duration {
  color: #888;
  margin-left: auto;
}
`

export function MockDevTools() {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<NetworkConfig>(simulator.getConfig())
  const [events, setEvents] = useState<SimulationEvent[]>([])

  useEffect(() => {
    const unsubscribe = simulator.on((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 100))
    })
    return unsubscribe
  }, [])

  const updateConfig = useCallback((key: keyof NetworkConfig, value: number) => {
    const newConfig = simulator.updateConfig({ [key]: value })
    setConfig({ ...newConfig })
  }, [])

  const resetConfig = useCallback(() => {
    simulator.resetConfig()
    setConfig(simulator.getConfig())
  }, [])

  const clearLog = useCallback(() => {
    setEvents([])
  }, [])

  const injectError = useCallback(() => {
    const current = simulator.getConfig()
    simulator.updateConfig({ errorRate: Math.min(1, current.errorRate + 0.1) })
    setConfig(simulator.getConfig())
  }, [])

  if (typeof window === 'undefined') return null

  return (
    <>
      {!open && (
        <button
          className="mock-devtools__toggle"
          onClick={() => setOpen(true)}
          title="Mock API DevTools"
          aria-label="Abrir painel de controle da API mock"
        >
          ⚡
        </button>
      )}

      {open && (
        <div className="mock-devtools mock-devtools__panel">
          <div className="mock-devtools__header">
            <h3>⚡ Mock API DevTools</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                className="mock-devtools__btn mock-devtools__btn--danger"
                onClick={injectError}
                title="Aumenta taxa de erro em 10%"
              >
                💥
              </button>
              <button className="mock-devtools__close" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          <div className="mock-devtools__body">
            <div className="mock-devtools__section">
              <h4>Latência</h4>
              <div className="mock-devtools__row">
                <label>Base</label>
                <input
                  type="range"
                  min={0}
                  max={3000}
                  step={50}
                  value={config.baseLatencyMs}
                  onChange={(e) => updateConfig('baseLatencyMs', Number(e.target.value))}
                />
                <span className="mock-devtools__value">{config.baseLatencyMs}ms</span>
              </div>
              <div className="mock-devtools__row">
                <label>Jitter</label>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={config.jitterMs}
                  onChange={(e) => updateConfig('jitterMs', Number(e.target.value))}
                />
                <span className="mock-devtools__value">{config.jitterMs}ms</span>
              </div>
            </div>

            <div className="mock-devtools__section">
              <h4>Erros</h4>
              <div className="mock-devtools__row">
                <label>Taxa de erro</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={config.errorRate * 100}
                  onChange={(e) => updateConfig('errorRate', Number(e.target.value) / 100)}
                />
                <span className="mock-devtools__value">{(config.errorRate * 100).toFixed(0)}%</span>
              </div>
              <div className="mock-devtools__row">
                <label>Retry count</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={config.retryCount}
                  onChange={(e) => updateConfig('retryCount', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="mock-devtools__section">
              <h4>Timeouts & Rate Limit</h4>
              <div className="mock-devtools__row">
                <label>Timeout</label>
                <input
                  type="range"
                  min={100}
                  max={30000}
                  step={100}
                  value={config.timeoutMs}
                  onChange={(e) => updateConfig('timeoutMs', Number(e.target.value))}
                />
                <span className="mock-devtools__value">
                  {(config.timeoutMs / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="mock-devtools__row">
                <label>Rate limit (req/min)</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={config.rateLimitPerMinute}
                  onChange={(e) => updateConfig('rateLimitPerMinute', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="mock-devtools__section">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <h4 style={{ margin: 0 }}>Request Log ({events.length})</h4>
                <button className="mock-devtools__btn" onClick={clearLog}>
                  Limpar
                </button>
              </div>
              <div className="mock-devtools__log">
                {events.length === 0 && (
                  <div style={{ color: '#555', padding: 4 }}>Nenhuma requisição ainda</div>
                )}
                {events.map((ev, i) => (
                  <div key={i} className="mock-devtools__log-entry">
                    <span className={`mock-devtools__log-method ${ev.method}`}>{ev.method}</span>
                    <span
                      className={`mock-devtools__log-status ${ev.status && ev.status < 400 ? 'ok' : 'err'}`}
                    >
                      {ev.status || '-'}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ev.path}
                    </span>
                    {ev.durationMs && (
                      <span className="mock-devtools__log-duration">
                        {ev.durationMs.toFixed(0)}ms
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '8px 0', display: 'flex', gap: 4 }}>
              <button className="mock-devtools__btn" onClick={resetConfig}>
                Resetar configurações
              </button>
              <button
                className="mock-devtools__btn mock-devtools__btn--danger"
                onClick={() => {
                  simulator.reset()
                  setEvents([])
                }}
              >
                Resetar contadores
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{styles}</style>
    </>
  )
}
