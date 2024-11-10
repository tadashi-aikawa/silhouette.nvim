import type { CheckBoxMarks } from "../domain/vo/TimerStatus.ts";
import type { TimerRepository } from "../repository/TimerRepository.ts";

export interface TimerService {
  serRepository(repository: TimerRepository): void;
  execute(opts?: { checkBoxMarks?: CheckBoxMarks }): Promise<void>;
  forceStopRecording(): Promise<void>;
}
