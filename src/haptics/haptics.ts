function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // Vibration not supported
  }
}

export function vibrateShort(): void {
  vibrate(10);
}

export function vibrateError(): void {
  vibrate([10, 50, 10]);
}

export function vibrateSuccess(): void {
  vibrate([30, 50, 30, 50, 60]);
}
