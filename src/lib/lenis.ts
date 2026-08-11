export interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
  touchMultiplier?: number;
}

export class Lenis {
  private isDestroyed: boolean = false;

  constructor(options?: LenisOptions) {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('lenis', 'lenis-smooth');
    }
  }

  public raf(_time: number) {
    if (this.isDestroyed) return;
  }

  public destroy() {
    this.isDestroyed = true;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    }
  }
}

export default Lenis;
