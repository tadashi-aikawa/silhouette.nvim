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
} from "jsr:@tadashi-aikawa/silhouette-core@^1.6.0";

export class NvimTaskRepository implements TaskRepository {
  constructor(
    private appHelper: AppHelper,
    private repetitionTasksFilePath: string,
    private holidaysFilePath: string,
  ) {}

  loadRepetitionTasks(): AsyncResult<RepetitionTask[], BaseError> {
    // TODO: 起点日登録ミスは警告したい
    return fromPromise(
      this.appHelper.loadFile(this.repetitionTasksFilePath).then((tasksStr) => {
        const recordOrErrors = tasksStr
          .split("\n")
          .filter((line) => !line.startsWith("//") && line.trim() !== "")
          .map((line) => line.split(","))
          .map(([name, repetitions, baseDate]) => {
            const _repetitions = repetitions?.trim();
            if (!_repetitions) {
              return {
                errors: [
                  {
                    message: `${name}:\n  繰り返しパターンが指定されていません`,
                  },
                ],
              };
            }

            const [reps, errs] =
              Repetition.fromRepetitionsStr(_repetitions).unwrap();
            if (errs) {
              return {
                errors: errs.map((e) => ({
                  message: `${name}:\n  ${e.message}`,
                })),
              };
            }
            return {
              record: RepetitionTask.of({
                name: name.replace(/^[ \t]+/, ""),
                repetitions: reps,
                baseDate: baseDate ? DateTime.of(baseDate) : undefined,
                indent: name.match("^[ \t]+")?.at(0) ?? "",
              }),
            };
          });

        const errors = recordOrErrors
          .map((x) => x.errors)
          .filter((x) => x !== undefined)
          .flat();
        if (errors.length > 0) {
          throw {
            name: "繰り返しタスクの読み込み時にパースエラーが発生",
            message: errors.map((x) => `${x.message}`).join("\n"),
          };
        }

        return recordOrErrors
          .map((x) => x.record)
          .filter((x) => x !== undefined);
      }),
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
