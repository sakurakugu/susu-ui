declare module 'qrcode' {
  export type QRCodeErrorCorrectionLevel =
    'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H'

  export interface QRCodeOptions {
    version?: number
    errorCorrectionLevel?: QRCodeErrorCorrectionLevel
    maskPattern?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  }

  export interface QRCode {
    modules: {
      size: number
      get(row: number, col: number): number
    }
  }

  export function create(text: string, options?: QRCodeOptions): QRCode
}
