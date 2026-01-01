import type { Entrypoint } from "@denops/std";
import { AppHelper } from "./app-helper.ts";
import { NvimTaskService } from "./app/NvimTaskService.ts";
import { NvimTaskRepository } from "./repository/NvimTaskRepository.ts";
import { DateTime } from "owlelia";
import { assert, is } from "@core/unknownutil";
import { TaskRepository } from "./repository/TaskRepository.ts";
import { TaskService } from "./app/TaskService.ts";
import { config, setup as setupConfig } from "./config.ts";
import { TimerService } from "./app/TimerService.ts";
import { NvimTimerService } from "./app/NvimTimerService.ts";
import type { TimerRepository } from "./repository/TimerRepository.ts";
import { NvimTimerRepository } from "./repository/NvimTimerRepository.ts";

export const main: Entrypoint = (denops) => {
  const appHelper = new AppHelper(denops);

  let taskRepository: TaskRepository;
  let taskService: TaskService;

  let timerRepository: TimerRepository;
  let timerService: TimerService;

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

      timerRepository = new NvimTimerRepository(
        appHelper,
        config.timer.time_storage_path,
      );
      timerService = NvimTimerService.create(appHelper, timerRepository);
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

    /**
     * 現在行の繰り返しタスク実施予定日直近3ヶ月の日付文字列リストを返します
     */
    async getTaskDates(daysAhead): Promise<string[]> {
      assert(daysAhead, is.Number);

      const [task, errors] = (
        await taskService.loadLineAsRepetitionTask()
      ).unwrap();
      if (errors) {
        await appHelper.notify(
          errors.map((x) => x.message).join("\n"),
          "ERROR",
        );
        return [];
      }
      if (!task) {
        return [];
      }

      const [holidays, err] = (await taskService.loadHolidays()).unwrap();
      if (err) {
        await appHelper.notify(err.message, "ERROR");
        return [];
      }

      const dates = taskService.calcDatesInFuture(task, holidays, daysAhead);

      return dates.map((x) => {
        let s = ` ${x.displayDateFull}`;
        if (holidays.some((d) => d.equals(x))) {
          s = `${s} ㊡`;
        }
        return s;
      });
    },

    /**
     * タイマーを押します
     */
    async pushTimer() {
      await timerService.execute({
        checkBoxMarks: config.timer.check_box_mark,
      });
    },

    /**
     * 計測を強制的に終了します
     */
    async forceStopRecording() {
      await timerService.forceStopRecording();
    },
  };
};
