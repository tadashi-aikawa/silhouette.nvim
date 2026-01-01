import type { AsyncResult, BaseError, DateTime, Nullable } from "owlelia";
import type { RepetitionTask } from "silhouette-core";
import type { TaskRepository } from "../repository/TaskRepository.ts";

export interface TaskService {
  setRepository(repository: TaskRepository): void;
  insertTasks(date: DateTime): Promise<Nullable<BaseError>>;
  loadRepetitionTasks(): AsyncResult<RepetitionTask[], BaseError>;
  loadLineAsRepetitionTask(): AsyncResult<Nullable<RepetitionTask>, Error[]>;
  calcDatesInFuture(
    task: RepetitionTask,
    holidays: DateTime[],
    daysAhead: number,
  ): DateTime[];
  loadHolidays(): AsyncResult<DateTime[], BaseError>;
  moveToProgress(): Promise<void>;
}
