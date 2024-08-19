local M = {}

function M.setup(opts)
	-- ここでdenopsがsilhouetteを読み込み終わるまで待っているつもりが...
	-- local result = vim.fn["denops#plugin#wait"]("silhouette", {timeout = 5000, interval = 100})
	-- if result ~= 0 then
	-- 	print(result)
	-- end
	-- ここが実行されてsetupが見つからなくてエラーになってしまう...
	vim.fn["denops#request"]("silhouette", "setup", { vim.fn.json_encode(opts) })

	vim.api.nvim_create_user_command("Silhouette", function(command)
		vim.fn["denops#request"]("silhouette", "insertTasks", command.fargs)
	end, { nargs = "?" })
	vim.api.nvim_create_user_command("SilhouetteMoveToProgress", function(command)
		vim.fn["denops#request"]("silhouette", "moveToProgress", command.fargs)
	end, { nargs = "?" })
end

return M
