import type { AppHelper } from "../app-helper.ts";
import type { TaskRepository } from "./TaskRepository.ts";
import {
  type AsyncResult,
  BaseError,
  DateTime,
  fromPromise,
} from "npm:owlelia@0.48.1";
import {
  Repetition,
  RepetitionTask,
} from "jsr:@tadashi-aikawa/silhouette-core@^1.1.0";

export class NvimTaskRepository implements TaskRepository {
  constructor(
    private appHelper: AppHelper,
    private repetitionTasksFilePath: string,
    private holidaysFilePath: string,
  ) {}

  loadRepetitionTasks(): AsyncResult<RepetitionTask[], BaseError> {
    // TODO: 起点日登録ミスは警告したい
    return fromPromise(
      this.appHelper.loadFile(this.repetitionTasksFilePath).then((tasksStr) =>
        tasksStr
          .split("\n")
          .filter((line) => !line.startsWith("//") && line.trim() !== "")
          .map((line) => line.split(","))
          .filter((cols) => cols.length > 1)
          .map(([name, repetitions, baseDate]) => {
            return RepetitionTask.of({
              name: name.replace(/^[ \t]+/, ""),
              repetitions: Repetition.fromRepetitionsStr(repetitions),
              baseDate: baseDate ? DateTime.of(baseDate) : undefined,
              indent: name.match("^[ \t]+")?.at(0) ?? "",
            });
          })
      ),
    );
  }

  loadHolidays(): AsyncResult<DateTime[], BaseError> {
    // TODO: 日付フォーマットミスは警告したい
    return fromPromise(
      this.holidaysFilePath
        ? this.appHelper.loadFile(this.holidaysFilePath).then(
          (holidaysStr) =>
            holidaysStr
              .split("\n")
              .filter((line) => !line.startsWith("//") && line.trim() !== "")
              .map(DateTime.of)
              .filter((x) => !Number.isNaN(x.date.getTime())), // TODO: owleliaに実装する
        )
        : Promise.resolve([]),
    );
  }
}
