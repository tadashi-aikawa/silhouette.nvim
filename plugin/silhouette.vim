if exists('g:loaded_silhouette')
  finish
endif
let g:loaded_silhouette = 1

" Function called once the plugin is loaded
function! s:init() abort
  command! -nargs=? Silhouette call denops#request('silhouette', 'insertTasks', [<f-args>])
endfunction

augroup silhouette
  autocmd!
  autocmd User DenopsPluginPost:silhouette call s:init()
augroup END
