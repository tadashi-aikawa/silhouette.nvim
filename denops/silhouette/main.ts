import type { Entrypoint } from "jsr:@denops/std@7.0.3";
import { AppHelper } from "./app-helper.ts";
import { NvimTaskService } from "./app/NvimTaskService.ts";
import { NvimTaskRepository } from "./repository/NvimTaskRepository.ts";
import { DateTime } from "npm:owlelia@0.48.1";
import { assert, is } from "jsr:@core/unknownutil";

export const main: Entrypoint = (denops) => {
  const appHelper = new AppHelper(denops);
  const taskRepository = new NvimTaskRepository(
    appHelper,
    "./repetition-tasks.md",
    "./holidays.md",
  );
  const appService = new NvimTaskService(appHelper, taskRepository);

  denops.dispatcher = {
    async insertTasks(_date) {
      const dateStr = _date ?? DateTime.today().displayDate;
      assert(dateStr, is.String);
      const date = DateTime.of(dateStr);

      const err = await appService.insertTasks(date);
      if (err) {
        await appHelper.notify(err.message, "ERROR");
        return;
      }

      await appHelper.notify(
        `Successfully inserted tasks for ${date.displayDate}`,
        "INFO",
      );
    },
  };
};
