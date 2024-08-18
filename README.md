<div align="center">
    <h1>Silhouette.nvim</h1>
    <img src="./silhouette.webp" width="384" />
    <p>
    <div>Neovimでシンプルにタスクを管理するためのプラグインです。</div>
    <div>目の前のタスクに集中することのみにフォーカスしています。</div>
    </p>
</div>

> [!WARNING]
> このプラグインはまだ開発を始めたばかりです。制限事項やバグが多く、ドキュメントがなくても構わないという方のみお試しください。

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
  dependencies = {
    "vim-denops/denops.vim",
  }
}
```

## 利用前の準備

以下のファイルを作成してください。

| ファイル                 | ファイルパス            |
|--------------------------|-------------------------|
| [繰り返しタスクファイル] | `./repetition-tasks.md` |
| [休日設定ファイル]       | `./holidays.md`         |

> [!NOTE]
> 近いうちにファイルパスは設定に追加予定です。

## 対応コマンド

### `Silhouette <date?>`

### 本日のタスクを挿入

```vim
:Silhouette
```

### 2024-08-20のタスクを挿入

```vim
:Silhouette 2024-08-20
```

## ロードマップ

TODO:

---

[Silhouette]: https://github.com/tadashi-aikawa/silhouette
[Deno]: https://deno.com/
[denops.vim]: https://github.com/vim-denops/denops.vim
[lazy.nvim]: https://github.com/folke/lazy.nvim
[繰り返しタスクファイル]: https://github.com/tadashi-aikawa/silhouette?tab=readme-ov-file#%E7%B9%B0%E3%82%8A%E8%BF%94%E3%81%97%E3%82%BF%E3%82%B9%E3%82%AF%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB
[休日設定ファイル]: https://github.com/tadashi-aikawa/silhouette?tab=readme-ov-file#%E4%BC%91%E6%97%A5%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB
