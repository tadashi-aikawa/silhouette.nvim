import type {
  AsyncResult,
  BaseError,
  DateTime,
  Nullable,
} from "npm:owlelia@0.48.1";
import type { RepetitionTask } from "../domain/entity/RepetitionTask.ts";
import type { TaskRepository } from "../repository/TaskRepository.ts";

export interface TaskService {
  setRepository(repository: TaskRepository): void;
  insertTasks(date: DateTime): Promise<Nullable<BaseError>>;
  loadRepetitionTasks(): AsyncResult<RepetitionTask[], BaseError>;
  calcDatesInFuture(task: RepetitionTask, holidays: DateTime[]): DateTime[];
  loadHolidays(): AsyncResult<DateTime[], BaseError>;
}
