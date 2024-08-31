import type { TaskService } from "./TaskService.ts";
import type { TaskRepository } from "../repository/TaskRepository.ts";
import {
  AsyncNullable,
  type AsyncResult,
  BaseError,
  DateTime,
  type Nullable,
  ok,
} from "npm:owlelia@0.48.1";
import type { AppHelper } from "../app-helper.ts";
import { RepetitionTask } from "../domain/entity/RepetitionTask.ts";
import { Repetition } from "../domain/vo/Repetition.ts";

const pattern = {
  progress: /[-*] \[~] (?<name>.+)/g,
} as const;

export function isLineProgress(line: string): boolean {
  return Boolean(line.match(pattern.progress));
}
export class NvimTaskService implements TaskService {
  constructor(
    private appHelper: AppHelper,
    private repository: TaskRepository,
  ) {}

  setRepository(repository: TaskRepository): void {
    this.repository = repository;
  }

  async insertTasks(date: DateTime): Promise<Nullable<BaseError>> {
    const [tasks, err] = (await this.loadRepetitionTasks()).unwrap();
    if (err) {
      return err;
    }

    const [holidays, err2] = (await this.loadHolidays()).unwrap();
    if (err2) {
      return err2;
    }

    this.appHelper.writeToBuffer(
      tasks.filter((x) => x.shouldTry(date, holidays)).map((x) => x.toString()),
    );
  }

  loadRepetitionTasks(): AsyncResult<RepetitionTask[], BaseError> {
    return this.repository.loadRepetitionTasks();
  }

  async loadLineAsRepetitionTask(): AsyncNullable<RepetitionTask> {
    let line = await this.appHelper.getCurrentLine();
    line = line.trim();
    if (!line) {
      return null;
    }

    const [name, repetitions, baseDate] = line.split(",");
    return RepetitionTask.of({
      name: name.replace(/^[ \t]+/, ""),
      repetitions: Repetition.fromRepetitionsStr(repetitions),
      baseDate: baseDate ? DateTime.of(baseDate) : undefined,
      indent: name.match("^[ \t]+")?.at(0) ?? "",
    });
  }

  loadHolidays(): AsyncResult<DateTime[], BaseError> {
    return this.repository.loadHolidays();
  }

  calcDatesInFuture(task: RepetitionTask, holidays: DateTime[]): DateTime[] {
    const today = DateTime.today();
    return today
      .toDate(today.plusMonths(6))
      .filter((x) => task.shouldTry(x, holidays));
  }

  async moveToProgress(): Promise<void> {
    const lines = await this.appHelper.readBuffer();
    if (lines.length === 0) {
      return;
    }

    const progressLineIndex = lines.findIndex(isLineProgress);
    if (progressLineIndex !== -1) {
      this.appHelper.setCursor({ row: progressLineIndex + 1, col: 0 });
    }
  }
}
