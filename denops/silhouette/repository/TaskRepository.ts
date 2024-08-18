import type { AsyncResult, BaseError, DateTime } from "npm:owlelia@0.48.1";
import type { RepetitionTask } from "../domain/entity/RepetitionTask.ts";

export interface TaskRepository {
  loadRepetitionTasks(): AsyncResult<RepetitionTask[], BaseError>;
  loadHolidays(): AsyncResult<DateTime[], BaseError>;
}
