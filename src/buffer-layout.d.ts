declare module 'buffer-layout' {
  export interface Layout<T = any> {
    span: number;
    property?: string;
    decode(b: Buffer, offset?: number): T;
    encode(src: T, b: Buffer, offset?: number): number;
    getSpan(b: Buffer, offset?: number): number;
    replicate(name: string): this;
  }

  export function struct(fields: Layout[], property?: string): Layout;
  export function blob(value: number, property: string): Layout;

  export function u8(property?: string): Layout;
  export function u32(property?: string): Layout;

  export function nu64(property?: string): Layout;

  export function offset(layout: Layout, offset: number, property?: string): number;
}
