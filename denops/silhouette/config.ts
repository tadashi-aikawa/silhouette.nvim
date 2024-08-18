import { deepMerge } from "https://deno.land/std@0.224.0/collections/deep_merge.ts";

const defaultConfig = {
  task: {
    // 繰り返しタスクファイルのパス
    repetition_tasks_path: "./repetition-tasks.md",
    // 休日設定ファイルのパス
    holidays_path: "./holidays.md",
  },
};
type Config = typeof defaultConfig;

// _configのsetupがされなければundefinedだが、そうならないようにする想定なので...
export let config: Config;

// 無理やりだけどLuaからのcallにあわせる
export function setup(opts: unknown) {
  const _opts = opts as Partial<Config>;
  config = deepMerge(defaultConfig, _opts);
}
