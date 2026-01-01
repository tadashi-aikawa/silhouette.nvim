import { Denops } from "@denops/core/type";
import * as fn from "@denops/std/function/nvim";

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

  async existsFile(path: string): Promise<boolean> {
    try {
      const stat = await Deno.stat(path);
      return stat.isFile;
    } catch {
      return false;
    }
  }

  async loadFile(path: string): Promise<string> {
    if (!(await this.existsFile(path))) {
      throw Error(`The file is not found: ${path}`);
    }
    return Deno.readTextFile(path);
  }
  saveFile<T extends string | ReadableStream<string>>(
    path: string,
    data: T,
  ): Promise<void> {
    return Deno.writeTextFile(path, data);
  }
  async deleteFile(path: string): Promise<void> {
    if (!(await this.existsFile(path))) {
      throw Error(`The file is not found: ${path}`);
    }
    return Deno.remove(path);
  }

  async loadJson<T>(path: string): Promise<T> {
    return JSON.parse(await this.loadFile(path)) as T;
  }
  saveJson<T>(path: string, data: T): Promise<void> {
    return this.saveFile(path, JSON.stringify(data, null, 2));
  }

  createBuffer(): Promise<Buffer> {
    return fn.nvim_create_buf(this.denops, false, true) as Promise<Buffer>;
  }

  /**
   * WARN: バッファへの書き込み前に呼び出すと書き込み後のconcealによる描画が正しくされない ことがある
   */
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

  /**
   * WARN: バッファへの書き込み前に呼び出すと書き込み後のconcealによる描画が正しくされない ことがある
   */
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

  async replaceStringInCurrentLine(str: string): Promise<void> {
    await fn.nvim_set_current_line(this.denops, str);
  }

  async notify(message: string, level: Level): Promise<void> {
    await this.denops.call("nvim_notify", message, levels[level], {});
  }
}
