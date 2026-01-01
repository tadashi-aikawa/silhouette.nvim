import { DateTime } from "owlelia";
import type { AppHelper } from "../app-helper.ts";
import { Timer } from "../domain/vo/Timer.ts";
import { type CheckBoxMarks, TimerStatus } from "../domain/vo/TimerStatus.ts";
import type { TimerRepository } from "../repository/TimerRepository.ts";
import type { TimerService } from "./TimerService.ts";
import { ExhaustiveError } from "silhouette-core-errors";

export class NvimTimerService implements TimerService {
  constructor(
    private appHelper: AppHelper,
    private repository: TimerRepository,
  ) {}

  static create(
    appHelper: AppHelper,
    repository: TimerRepository,
  ): TimerService {
    return new NvimTimerService(appHelper, repository);
  }

  serRepository(repository: TimerRepository): void {
    this.repository = repository;
  }

  private async getTimer(): Promise<Timer> {
    return (await this.repository.loadTimer()).orThrow();
  }

  private hasTimer(): Promise<boolean> {
    return this.repository.hasTimer();
  }

  private async hasNotTimer(): Promise<boolean> {
    return !(await this.hasTimer());
  }

  async execute(opts?: { checkBoxMarks?: CheckBoxMarks }): Promise<void> {
    const line = (await this.appHelper.getCurrentLine()) || "";
    const lineTimeStatus = TimerStatus.fromLine(line, opts);
    const lineTimeStatusName = lineTimeStatus.name;
    if (lineTimeStatusName === "notTask") {
      return;
    }

    switch (lineTimeStatusName) {
      case "recording":
        if (await this.hasNotTimer()) {
          this.appHelper.notify(
            "計測中のタスクがないため、カーソル配下のタスクを計測済にできません。",
            "ERROR",
          );
          return;
        }
        this.appHelper.replaceStringInCurrentLine(
          lineTimeStatus.getNextStatusLine(
            line,
            (await this.getTimer()).stop(DateTime.now()),
          ),
        );

        await this.repository.clearTimer();
        break;
      case "neverRecorded":
        if (await this.hasTimer()) {
          this.appHelper.notify(
            "計測中のタスクがあるため、新たなタスクを計測開始できません。計測中のタスクを思い出せない場合は 'Force stop recording' コマンドを実行し、強制的に計測中のタスクを計測完了させてください。",
            "ERROR",
          );
          return;
        }
        await this.repository.saveTimer(
          Timer.of({
            name: lineTimeStatus.parse(line).name,
            startTime: DateTime.now(),
            accumulatedSeconds: 0,
          }),
        );

        this.appHelper.replaceStringInCurrentLine(
          lineTimeStatus.getNextStatusLine(line),
        );
        break;
      case "recorded": {
        if (await this.hasTimer()) {
          this.appHelper.notify(
            "計測中のタスクがあるため、新たなタスクを計測開始できません。計測中のタスクを思い出せない場合は 'Force stop recording' コマンドを実行し、強制的に計測中のタスクを計測完了させてください。",
            "ERROR",
          );
          return;
        }
        const { name, seconds: accumulatedSeconds } = lineTimeStatus.parse(
          line,
        );

        this.appHelper.replaceStringInCurrentLine(
          lineTimeStatus.getNextStatusLine(line),
        );

        await this.repository.saveTimer(
          Timer.of({
            name,
            startTime: DateTime.now(),
            accumulatedSeconds,
          }),
        );
        break;
      }
      default:
        throw new ExhaustiveError(lineTimeStatusName);
    }
  }

  async forceStopRecording(): Promise<void> {
    await this.repository.clearTimer();
  }
}
