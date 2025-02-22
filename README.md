<div align="center">
    <h1>Silhouette.nvim</h1>
    <img src="./silhouette.webp" width="256" />
    <p>
        <div>Neovimでシンプルにタスクを管理するためのプラグインです。</div>
        <div>目の前のタスクに集中することのみにフォーカスしています。</div>
    </p>
    <a href="https://github.com/tadashi-aikawa/silhouette.nvim/releases/latest"><img src="https://img.shields.io/github/release/tadashi-aikawa/silhouette.nvim.svg" /></a>
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" />
</div>

## はじめに

`Silhouette.nvim`は[Silhouette]をNeovimプラグインとして移植を試みるプロジェクトです。プラグインの思想については[Silhouette]のREADMEをご覧ください。

## インストール

### 前提条件

[Deno]のインストールが必要です。

### Neovimの設定

[denops.vim]に依存します。

[lazy.nvim]の場合は以下のような設定をします。

```lua
{
  "tadashi-aikawa/silhouette.nvim",
  ft = "markdown",
  dependencies = {
    "vim-denops/denops.vim",
  },
  keys = {
    { "<Space>sp", ":SilhouetteMoveToProgress<CR>", silent = true },
  },
  config = function()
    -- denops.nvimが起動し終わる前に実行されるとエラーになるためwaitを入れる
    -- マシンスペックや環境によって1000(ms)の値を調整する必要あり
    vim.defer_fn(function()
      require("silhouette").setup({
        -- デフォルト
        task = {
          repetition_tasks_path = "./repetition-tasks.md",
          holidays_path = "./holidays.md",
        },
        timer = {
          -- デフォルト
          time_storage_path = "./time-storage.json",
          -- デフォルト
          check_box_mark: {
            -- デフォルト
            recording: "~",
            -- デフォルトでは未指定
            -- stop: " ",
          },
        },
      })
    end, 1000)
  end,
}
```

## 利用前の準備

以下のファイルを作成してください。

| ファイル                 | ファイルパス(デフォルト) |
|--------------------------|--------------------------|
| [繰り返しタスクファイル] | `./repetition-tasks.md`  |
| [休日設定ファイル]       | `./holidays.md`          |

> [!TIP]
> ファイルパスは設定で変更できます。

## 対応コマンド (Task系)

### `SilhouetteInsertTasks <date?>`

#### 本日のタスクを挿入

```vim
:SilhouetteInsertTasks
```

#### 2024-08-20のタスクを挿入

```vim
:SilhouetteInsertTasks 2024-08-20
```

### `SilhouetteMoveToProgress`

進行中タスク(`- [~]`)が最初に出現する行に移動します。

### `SilhouetteShowTaskDates <daysAhead>`

[繰り返しタスクファイル]でカーソル配下のタスクファイルの実行予定日を表示します。

#### 90日後まで表示(default)

```vim
:SilhouetteShowTaskDates
```

#### 1年後まで表示

```vim
:SilhouetteShowTaskDates 365
```

## 対応コマンド (Time系)

### `SilhouettePushTimer`

カーソル配下のタスク状態に応じて、タスクの計測を開始/終了します。

```vim
:SilhouettePushTimer
```

> [!INFO]
> 詳細は [Silhouette: Push timer](https://github.com/tadashi-aikawa/silhouette?tab=readme-ov-file#silhouette-push-timer) を参照

### `SilhouetteForceStopRecording`

強制的に現在計測中のタスク計測を停止します。

```vim
SilhouetteForceStopRecording
```

> [!INFO]
> 詳細は [Silhouette: Force stop recording](https://github.com/tadashi-aikawa/silhouette?tab=readme-ov-file#silhouette-force-stop-recording) を参照

## FAQ

#### `SilhouettePushTimer` で計測開始したときのタスクのマークを変えたくない

configの `timer.check_box_mark.recording` を指定しないようにしてください。

#### `SilhouettePushTimer` で計測終了したときにタスクのマークを変えたい

configの `timer.check_box_mark.stop` に任意のマークを設定してください。( `-` `x` など)

#### markdown-toggle.nvim でタスクを完了(マークをxに)したときだけ計測終了したい

[markdown-toggle.nvim] のキーバインドでtoggle後に特定条件下のときだけ `SilhouettePushTimer` を実行するようにします。コメントが書かれている箇所がポイント。

```lua
{
  "roodolv/markdown-toggle.nvim",
  config = function()
    require("markdown-toggle").setup({
      cycle_box_table = true,
      box_table = { "x" },
      list_before_box = true,
    })

    vim.api.nvim_create_autocmd("FileType", {
      desc = "markdown-toggle.nvim keymaps",
      pattern = { "markdown", "markdown.mdx" },
      callback = function(args)
        local opts = { silent = true, noremap = true, buffer = args.buf }
        local toggle = require("markdown-toggle")

        vim.keymap.set({ "n", "v" }, "<F12>", function()
          toggle.checkbox()

          -- 現在行を取得し
          local cline = vim.api.nvim_get_current_line()
          -- 計測中かつ完了マークになっているときだけ
          if string.find(cline, "- %[x%] .+ ``") then
            -- SilhouettePushTimer を実行 -> 計測完了となる
            vim.cmd("SilhouettePushTimer")
          end
        end, opts)
      end,
    })
  end,
}
```

## 制限事項

> [!IMPORTANT]
> このプラグインは[Silhouette]の機能全てを実装するわけではありません。移植中の機能もあれば移植しない機能もあります。

## 開発者向け

### 準備

以下でhooksの場所を変更する。

```bash
git config core.hooksPath hooks
```

[denops.nvim]の部分を開発する場合は `denops/silhouette` にカレントディレクトリを移動することを推奨します。

### リリース

[Release Action](https://github.com/tadashi-aikawa/silhouette.nvim/actions/workflows/release.yaml) を実行。

---

[Silhouette]: https://github.com/tadashi-aikawa/silhouette
[Deno]: https://deno.com/
[denops.vim]: https://github.com/vim-denops/denops.vim
[lazy.nvim]: https://github.com/folke/lazy.nvim
[繰り返しタスクファイル]: https://github.com/tadashi-aikawa/silhouette?tab=readme-ov-file#%E7%B9%B0%E3%82%8A%E8%BF%94%E3%81%97%E3%82%BF%E3%82%B9%E3%82%AF%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB
[休日設定ファイル]: https://github.com/tadashi-aikawa/silhouette?tab=readme-ov-file#%E4%BC%91%E6%97%A5%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB
[markdown-toggle.nvim]: https://github.com/roodolv/markdown-toggle.nvim
