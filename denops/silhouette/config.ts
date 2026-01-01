import { deepMerge } from "@std/collections/deep_merge";

const defaultConfig = {
  task: {
    // 繰り返しタスクファイルのパス
    repetition_tasks_path: "./repetition-tasks.md",
    // 休日設定ファイルのパス
    holidays_path: "./holidays.md",
  },
  timer: {
    // 計測途中時間記録用のJSONファイルパス
    time_storage_path: "./time-storage.json",
    // 計測開始・計測停止に切り替わったあとのチェックボックスマーク
    check_box_mark: {
      recording: "~",
      // stop: " ",
    },
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
