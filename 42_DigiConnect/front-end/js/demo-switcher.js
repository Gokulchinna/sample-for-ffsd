/**
 * DigiConnect — Universal College Demo Switcher Bar
 * Injected across all pages for instant 1-click role testing and evaluator walkthroughs.
 */
import { DEMO_PERSONAS, switchDemoPersona } from './role-manager.js';

export function initDemoSwitcher() {
  if (document.getElementById('digiconnect-demo-switcher')) return;

  const currentSession = (() => {
    try {
      return JSON.parse(localStorage.getItem('DigiConnect_session')) || {};
    } catch (e) {
      return {};
    }
  })();

  const bar = document.createElement('aside');
  bar.id = 'digiconnect-demo-switcher';
  bar.setAttribute('aria-label', 'College Project Demo Switcher');
  bar.style.cssText = `
    position: fixed;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    background: rgba(15, 23, 42, 0.96);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 9999px;
    padding: 6px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.2);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 95vw;
    overflow-x: auto;
  `;

  bar.innerHTML = `
    <div style="display: flex; align-items: center; gap: 6px; padding-right: 8px; border-right: 1px solid rgba(255,255,255,0.15); white-space: nowrap;">
      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e;"></span>
      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8;">DEMO ACTORS:</span>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
      ${DEMO_PERSONAS.map((p) => {
        const isActive = currentSession.id === p.id || currentSession.roleKey === p.roleKey || currentSession.role === p.roleKey;
        const activeStyle = isActive
          ? 'background: #2563eb; color: #ffffff; font-weight: 700; box-shadow: 0 0 12px rgba(37, 99, 235, 0.6);'
          : 'background: rgba(255,255,255,0.06); color: #cbd5e1; hover:background: rgba(255,255,255,0.12);';
        return `
          <button
            type="button"
            data-persona-id="${p.id}"
            title="${p.name} - ${p.description}"
            style="
              ${activeStyle}
              border: 1px solid rgba(255,255,255,0.1);
              padding: 5px 12px;
              border-radius: 9999px;
              font-size: 11px;
              cursor: pointer;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              gap: 4px;
            "
          >
            <span>${p.title.split('(')[0].trim()}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  bar.querySelectorAll('button[data-persona-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const personaId = btn.getAttribute('data-persona-id');
      switchDemoPersona(personaId);
    });
  });

  document.body.appendChild(bar);
}

// Automatically auto-mount when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoSwitcher);
  } else {
    initDemoSwitcher();
  }
}
