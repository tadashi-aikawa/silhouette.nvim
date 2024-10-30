import type {
  AsyncNullable,
  AsyncResult,
  BaseError,
  DateTime,
  Nullable,
} from "npm:owlelia@0.48.1";
import type { RepetitionTask } from "jsr:@tadashi-aikawa/silhouette-core@^1.1.0";
import type { TaskRepository } from "../repository/TaskRepository.ts";

export interface TaskService {
  setRepository(repository: TaskRepository): void;
  insertTasks(date: DateTime): Promise<Nullable<BaseError>>;
  loadRepetitionTasks(): AsyncResult<RepetitionTask[], BaseError>;
  loadLineAsRepetitionTask(): AsyncNullable<RepetitionTask>;
  calcDatesInFuture(
    task: RepetitionTask,
    holidays: DateTime[],
    daysAhead: number,
  ): DateTime[];
  loadHolidays(): AsyncResult<DateTime[], BaseError>;
  moveToProgress(): Promise<void>;
}
