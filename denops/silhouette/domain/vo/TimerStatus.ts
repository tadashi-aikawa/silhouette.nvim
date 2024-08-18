import { toHHmmss } from "../../util/times.ts";
import type { Timer } from "./Timer.ts";

function unsafeMatch(str: string, pattern: RegExp): { [key: string]: string } {
  return Array.from(str.matchAll(pattern))![0].groups!;
}

const pattern = {
  neverRecorded: /[-*] \[.] (?<name>.+)/g,
  recording: /[-*] \[.] (?<name>.+)\(⏳\)$/g,
  recorded: /[-*] \[.] (?<name>.+)\(⏲️(?<time>\d\d:\d\d:\d\d)\)$/g,
} as const;

export function isLineRecording(line: string): boolean {
  return Boolean(line.match(pattern.recording));
}

export const TimerStatus = {
  fromLine(line: string): TimerStatus {
    if (!line) {
      return new NotTaskStatus();
    }

    if (!line.match(pattern.neverRecorded)) {
      return new NotTaskStatus();
    }

    if (isLineRecording(line)) {
      return new RecordingStatus();
    } else if (line.match(pattern.recorded)) {
      return new RecordedStatus();
    } else {
      return new NeverRecordedStatus();
    }
  },
};

export type TimerStatus =
  | NotTaskStatus
  | NeverRecordedStatus
  | RecordingStatus
  | RecordedStatus;

class NotTaskStatus {
  readonly name = "notTask";
}
class NeverRecordedStatus {
  readonly name = "neverRecorded";
  parse(line: string): { name: string } {
    const { name } = unsafeMatch(line, pattern.neverRecorded);
    return { name };
  }
  getNextStatusLine(line: string): string {
    return `${line} (⏳)`;
  }
}
class RecordingStatus {
  readonly name = "recording";
  parse(line: string): { name: string } {
    const { name } = unsafeMatch(line, pattern.recording);
    return { name };
  }
  getNextStatusLine(line: string, timer: Timer): string {
    return line.replace("(⏳)", `(⏲️${toHHmmss(timer.accumulatedSeconds)})`);
  }
}
class RecordedStatus {
  readonly name = "recorded";
  parse(line: string): { name: string; seconds: number } {
    const { name, time } = unsafeMatch(line, pattern.recorded);
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return { name, seconds: hours * 60 * 60 + minutes * 60 + seconds };
  }
  getNextStatusLine(line: string): string {
    return line.replace(/\(⏲️\d\d:\d\d:\d\d\)/, "(⏳)");
  }
}
