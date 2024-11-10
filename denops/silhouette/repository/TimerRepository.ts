import type { AsyncResult, BaseError } from "npm:owlelia@0.48.1";
import type { Timer } from "../domain/vo/Timer.ts";

export interface TimerRepository {
  hasTimer(): Promise<boolean>;
  loadTimer(): AsyncResult<Timer, BaseError>;
  saveTimer(timer: Timer): AsyncResult<void, BaseError>;
  clearTimer(): AsyncResult<void, BaseError>;
}
