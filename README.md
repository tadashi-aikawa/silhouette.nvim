<div align="center">
    <h1>Silhouette.nvim</h1>
    <img src="./silhouette.webp" width="256" />
    <p>
        <div>Neovimでシンプルにタスクを管理するためのプラグインです。</div>
        <div>目の前のタスクに集中することのみにフォーカスしています。</div>
    </p>
    <a href="https://github.com/tadashi-aikawa/silhouette.nvim/releases/latest"><img src="https://img.shields.io/github/release/tadashi-aikawa/silhouette.nvim.svg" /></a>
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
      -- 設定はデフォルト値. 指定しなかった場合は下記の値になります
      require("silhouette").setup({
        task = {
          repetition_tasks_path = "./repetition-tasks.md",
          holidays_path = "./holidays.md",
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

## 対応コマンド

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

進行中タスク(`- [~]`)が最初に出現する行に移動する。

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

## 制限事項

> [!IMPORTANT]
> このプラグインは[Silhouette]の機能全てを実装するわけではありません。移植中の機能もあれば移植しない機能もあります。

## 開発者向け

### 準備

以下でhooksの場所を変更する。

```bash
git config core.hooksPath hooks
```

### リリース

[Release Action](https://github.com/tadashi-aikawa/silhouette.nvim/actions/workflows/release.yaml) を実行。

---

[Silhouette]: https://github.com/tadashi-aikawa/silhouette
[Deno]: https://deno.com/
[denops.vim]: https://github.com/vim-denops/denops.vim
[lazy.nvim]: https://github.com/folke/lazy.nvim
[繰り返しタスクファイル]: https://github.com/tadashi-aikawa/silhouette?tab=readme-ov-file#%E7%B9%B0%E3%82%8A%E8%BF%94%E3%81%97%E3%82%BF%E3%82%B9%E3%82%AF%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB
[休日設定ファイル]: https://github.com/tadashi-aikawa/silhouette?tab=readme-ov-file#%E4%BC%91%E6%97%A5%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB
