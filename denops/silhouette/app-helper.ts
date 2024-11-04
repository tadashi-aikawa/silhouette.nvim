import { Denops } from "jsr:@denops/core@^7.0.0/type";
import * as fn from "jsr:@denops/std/function/nvim";

export type Buffer = number & { _id: Buffer };
export type WindowHandler = number;
export type Cursor = { row: number; col: number };

const levels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  OFF: 5,
} as const;
type Level = keyof typeof levels;

export class AppHelper {
  constructor(private denops: Denops) {}

  loadFile(path: string): Promise<string> {
    if (!this.existsFile(path)) {
      throw Error(`The file is not found: ${path}`);
    }
    return Deno.readTextFile(path);
  }

  async existsFile(path: string): Promise<boolean> {
    return (await Deno.stat(path)).isFile;
  }

  createBuffer(): Promise<Buffer> {
    return fn.nvim_create_buf(this.denops, false, true) as Promise<Buffer>;
  }

  getCurrentBuffer(): Promise<Buffer> {
    return fn.nvim_get_current_buf(this.denops) as Promise<Buffer>;
  }

  getCurrentLine(): Promise<string> {
    // nullableかも???
    return fn.nvim_get_current_line(this.denops) as Promise<string>;
  }

  getCurrentWindow(): Promise<WindowHandler> {
    return fn.nvim_get_current_win(this.denops) as Promise<WindowHandler>;
  }

  getWindowWidth(handler: WindowHandler): Promise<number> {
    return fn.nvim_win_get_width(this.denops, handler) as Promise<number>;
  }

  getWindowHeight(handler: WindowHandler): Promise<number> {
    return fn.nvim_win_get_height(this.denops, handler) as Promise<number>;
  }

  async getCursor(): Promise<Cursor> {
    const [row, col] = (await fn.nvim_win_get_cursor(this.denops, 0)) as [
      number,
      number,
    ];
    return { row, col };
  }

  async setCursor(cursor: Cursor): Promise<void> {
    await fn.nvim_win_set_cursor(this.denops, 0, [cursor.row, cursor.col]);
  }

  async readBuffer(): Promise<string[]> {
    const cBuf = await this.getCurrentBuffer();
    const r = await fn.nvim_buf_get_lines(this.denops, cBuf, 0, -1, false);
    return r as string[];
  }

  async writeToBuffer(text: string[]) {
    await fn.nvim_put(this.denops, text, "", false, false);
  }

  async notify(message: string, level: Level): Promise<void> {
    await fn.nvim_notify(this.denops, message, levels[level], {});
  }
}
