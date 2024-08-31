local M = {}

local function show_task_dates_popup()
	local buf = vim.api.nvim_create_buf(false, true)
	local c_win = vim.api.nvim_get_current_win()
	local date_lines = vim.fn["denops#request"]("silhouette", "getTaskDates", {})
	if #date_lines == 0 then
		return
	end

	vim.api.nvim_buf_set_lines(buf, 0, -1, false, date_lines)

	local line_above = vim.fn.winline() - 1
	local win_height = vim.api.nvim_win_get_height(c_win)
	local win_col = vim.fn.wincol()
	local win_width = vim.api.nvim_win_get_width(c_win)

	local width = 21
	local height = 12
	local row, col
	local anchor = ""
	if line_above < win_height - line_above then
		anchor = anchor .. "N"
		row = 1
	else
		anchor = anchor .. "S"
		row = 0
	end
	if win_col + width < win_width then
		anchor = anchor .. "W"
		col = 0
	else
		anchor = anchor .. "E"
		col = 1
	end

	local win = vim.api.nvim_open_win(buf, false, {
		anchor = anchor,
		title = "タスク実施予定日",
		title_pos = "center",
		relative = "cursor",
		width = width,
		height = height,
		row = row,
		col = col,
		style = "minimal",
		border = "single",
	})

	vim.api.nvim_create_autocmd({ "CursorMoved", "InsertEnter", "BufDelete" }, {
		buffer = vim.api.nvim_get_current_buf(),
		once = true,
		callback = function(opt)
			if vim.api.nvim_win_is_valid(win) then
				vim.api.nvim_win_close(win, true)
			end
			vim.api.nvim_del_autocmd(opt.id)
		end,
	})
end

function M.setup(opts)
	-- ここでdenopsがsilhouetteを読み込み終わるまで待っているつもりが...
	-- local result = vim.fn["denops#plugin#wait"]("silhouette", {timeout = 5000, interval = 100})
	-- if result ~= 0 then
	-- 	print(result)
	-- end
	-- ここが実行されてsetupが見つからなくてエラーになってしまう...
	vim.fn["denops#request"]("silhouette", "setup", { vim.fn.json_encode(opts) })

	vim.api.nvim_create_user_command("SilhouetteInsertTasks", function(command)
		vim.fn["denops#request"]("silhouette", "insertTasks", command.fargs)
	end, { nargs = "?" })
	vim.api.nvim_create_user_command("SilhouetteMoveToProgress", function(command)
		vim.fn["denops#request"]("silhouette", "moveToProgress", command.fargs)
	end, { nargs = "?" })
	vim.api.nvim_create_user_command("SilhouetteShowTaskDates", function()
		show_task_dates_popup()
	end, { nargs = "?" })
end

return M
