import { Denops } from "jsr:@denops/core@^7.0.0/type";
import * as fn from "jsr:@denops/std/function/nvim";

export type Buffer = unknown & { _id: Buffer };
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

  getCurrentBuffer(): Promise<Buffer> {
    return fn.nvim_get_current_buf(this.denops) as Promise<Buffer>;
  }

  async getCursor(): Promise<Cursor> {
    const [row, col] = (await fn.nvim_win_get_cursor(this.denops, 0)) as [
      number,
      number,
    ];
    return { row, col };
  }

  async writeToBuffer(text: string[]) {
    const cBuf = await this.getCurrentBuffer();
    const cur = await this.getCursor();
    await fn.nvim_buf_set_lines(
      this.denops,
      cBuf,
      cur.row - 1,
      cur.row,
      false,
      text,
    );
  }

  async notify(message: string, level: Level): Promise<void> {
    await fn.nvim_notify(this.denops, message, levels[level], {});
  }
}
