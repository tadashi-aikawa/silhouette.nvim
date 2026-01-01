import type { AppHelper } from "../app-helper.ts";
import { type AsyncResult, BaseError, DateTime, fromPromise } from "owlelia";
import type { TimerRepository } from "./TimerRepository.ts";
import { Timer } from "../domain/vo/Timer.ts";

interface TimerDict {
  name: string;
  accumulatedSeconds: number;
  startTime?: number;
}

export class NvimTimerRepository implements TimerRepository {
  constructor(
    private appHelper: AppHelper,
    private timerStorageFilePath: string,
  ) {}

  get normalizedTimerStoragePath(): string {
    // WARNING: そのままでいい気もするけど念のためIFだけは残しておく
    return this.timerStorageFilePath;
  }

  hasTimer(): Promise<boolean> {
    return this.appHelper.existsFile(this.normalizedTimerStoragePath);
  }

  loadTimer(): AsyncResult<Timer, BaseError> {
    return fromPromise(
      this.appHelper
        .loadJson<TimerDict>(this.normalizedTimerStoragePath)
        .then((x) =>
          Timer.of({
            name: x.name,
            accumulatedSeconds: x.accumulatedSeconds,
            startTime: x.startTime ? DateTime.of(x.startTime) : undefined,
          })
        ),
    );
  }

  saveTimer(timer: Timer): AsyncResult<void, BaseError> {
    return fromPromise(
      this.appHelper.saveJson<TimerDict>(this.normalizedTimerStoragePath, {
        name: timer.name,
        accumulatedSeconds: timer.accumulatedSeconds,
        startTime: timer.startTime?.unix,
      }),
    );
  }

  clearTimer(): AsyncResult<void, BaseError> {
    return fromPromise(
      this.appHelper.deleteFile(this.normalizedTimerStoragePath),
    );
  }
}
