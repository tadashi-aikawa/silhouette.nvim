import type { Entrypoint } from "jsr:@denops/std@7.0.3";
import { AppHelper } from "./app-helper.ts";
import { NvimTaskService } from "./app/NvimTaskService.ts";
import { NvimTaskRepository } from "./repository/NvimTaskRepository.ts";
import { DateTime } from "npm:owlelia@0.48.1";
import { assert, is } from "jsr:@core/unknownutil";
import { TaskRepository } from "./repository/TaskRepository.ts";
import { TaskService } from "./app/TaskService.ts";
import { config, setup as setupConfig } from "./config.ts";

export const main: Entrypoint = (denops) => {
  const appHelper = new AppHelper(denops);
  let taskRepository: TaskRepository;
  let taskService: TaskService;

  denops.dispatcher = {
    setup(opts) {
      assert(opts, is.String);
      setupConfig(JSON.parse(opts));

      taskRepository = new NvimTaskRepository(
        appHelper,
        config.task.repetition_tasks_path,
        config.task.holidays_path,
      );
      taskService = new NvimTaskService(appHelper, taskRepository);
    },

    /**
     * _dateで指定した日付(yyyy-MM-dd)のタスクを挿入します
     */
    async insertTasks(_date) {
      const dateStr = _date ?? DateTime.today().displayDate;
      assert(dateStr, is.String);
      const date = DateTime.of(dateStr);

      const err = await taskService.insertTasks(date);
      if (err) {
        await appHelper.notify(err.message, "ERROR");
        return;
      }

      await appHelper.notify(
        `Successfully inserted tasks for ${date.displayDate}`,
        "INFO",
      );
    },

    /**
     * 進行中のタスクが存在する行に移動する
     * 複数存在する場合は最初のそれに移動する
     */
    async moveToProgress() {
      await taskService.moveToProgress();
    },
  };
};
