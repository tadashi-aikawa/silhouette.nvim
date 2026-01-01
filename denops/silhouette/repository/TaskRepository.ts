import type { AsyncResult, BaseError, DateTime } from "owlelia";
import type { RepetitionTask } from "silhouette-core";

export interface TaskRepository {
  loadRepetitionTasks(): AsyncResult<RepetitionTask[], BaseError>;
  loadHolidays(): AsyncResult<DateTime[], BaseError>;
}
