// Toast notification utility
// Creates temporary toast notifications that appear at the top of the screen

type ToastType = 'success' | 'error' | 'info'

interface ToastOptions {
  type?: ToastType
  duration?: number
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600'
}

const typeIcons: Record<ToastType, string> = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export function showToast(message: string, options: ToastOptions = {}) {
  const { type = 'success', duration = 4000 } = options
  
  const toast = document.createElement('div')
  toast.className = `fixed top-4 left-1/2 -translate-x-1/2 z-[9999] ${typeStyles[type]} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in max-w-md`
  toast.innerHTML = `
    ${typeIcons[type]}
    <span>${escapeHtml(message)}</span>
  `
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 0.3s'
    setTimeout(() => toast.remove(), 300)
  }, duration)
  
  return toast
}

export function showSuccessToast(message: string, duration?: number) {
  return showToast(message, { type: 'success', duration })
}

export function showErrorToast(message: string, duration?: number) {
  return showToast(message, { type: 'error', duration })
}

export function showInfoToast(message: string, duration?: number) {
  return showToast(message, { type: 'info', duration })
}
