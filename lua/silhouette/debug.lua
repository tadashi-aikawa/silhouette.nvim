local M = {}

---tableをjson形式でprintする
---@param t table
---@param indent? string
function M.print_table(t, indent)
	indent = indent or ""
	for k, v in pairs(t) do
		if type(v) == "table" then
			print(indent .. k .. ":")
			M.print_table(v, (indent or "") .. "  ")
		else
			print(indent .. k .. ": " .. tostring(v))
		end
	end
end

return M
