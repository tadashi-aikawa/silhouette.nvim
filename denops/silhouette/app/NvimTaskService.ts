import type { TaskService } from "./TaskService.ts";
import type { TaskRepository } from "../repository/TaskRepository.ts";
import {
  type AsyncResult,
  BaseError,
  DateTime,
  type Nullable,
} from "npm:owlelia@0.48.1";
import type { AppHelper } from "../app-helper.ts";
import type { RepetitionTask } from "../domain/entity/RepetitionTask.ts";

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

  loadHolidays(): AsyncResult<DateTime[], BaseError> {
    return this.repository.loadHolidays();
  }

  calcDatesInFuture(task: RepetitionTask, holidays: DateTime[]): DateTime[] {
    const today = DateTime.today();
    return today
      .toDate(today.plusMonths(3))
      .filter((x) => task.shouldTry(x, holidays));
  }
}
