import type { AsyncResult, BaseError, DateTime } from "npm:owlelia@0.48.1";
import type { RepetitionTask } from "jsr:@tadashi-aikawa/silhouette-core@^1.5.1";

export interface TaskRepository {
  loadRepetitionTasks(): AsyncResult<RepetitionTask[], BaseError>;
  loadHolidays(): AsyncResult<DateTime[], BaseError>;
}
