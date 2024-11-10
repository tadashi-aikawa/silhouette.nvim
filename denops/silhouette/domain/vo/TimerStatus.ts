import { toHHmmss } from "../../utils/times.ts";
import type { Timer } from "./Timer.ts";

// FIXME: refactor
function unsafeMatch(str: string, pattern: RegExp): { [key: string]: string } {
  return Array.from(str.matchAll(pattern))![0].groups!;
}

export interface CheckBoxMarks {
  recording?: string;
  stop?: string;
}

const pattern = {
  neverRecorded: /[-*] \[.] (?<name>.+)/g,
  recording: /[-*] \[.] (?<name>.+)``$/g,
  recorded: /[-*] \[.] (?<name>.+)` (?<time>\d\d:\d\d:\d\d)`$/g,
} as const;

export function isLineRecording(line: string): boolean {
  return Boolean(line.match(pattern.recording));
}

function replaceCheckBoxMark(line: string, mark: string): string {
  return line.replace(/([-*]) \[.\] /, `$1 [${mark}] `);
}

// TODO: いつかなおす
// deno-lint-ignore  no-namespace
export namespace TimerStatus {
  export function fromLine(
    line: string,
    opts?: {
      checkBoxMarks?: CheckBoxMarks;
    },
  ): TimerStatus {
    if (!line) {
      return new NotTaskStatus(opts);
    }

    if (!line.match(pattern.neverRecorded)) {
      return new NotTaskStatus(opts);
    }

    if (isLineRecording(line)) {
      return new RecordingStatus(opts);
    } else if (line.match(pattern.recorded)) {
      return new RecordedStatus(opts);
    } else {
      return new NeverRecordedStatus(opts);
    }
  }
}

export type TimerStatus =
  | NotTaskStatus
  | NeverRecordedStatus
  | RecordingStatus
  | RecordedStatus;

class AbstractStatus {
  constructor(public opts?: { checkBoxMarks?: CheckBoxMarks }) {}
}

class NotTaskStatus extends AbstractStatus {
  readonly name = "notTask";
}
class NeverRecordedStatus extends AbstractStatus {
  readonly name = "neverRecorded";

  parse(line: string): { name: string } {
    const { name } = unsafeMatch(line, pattern.neverRecorded);
    return { name };
  }
  getNextStatusLine(line: string): string {
    const m = this.opts?.checkBoxMarks?.recording;
    const newLine = `${line} \`\``;
    return m ? replaceCheckBoxMark(newLine, m) : newLine;
  }
}
class RecordingStatus extends AbstractStatus {
  readonly name = "recording";
  parse(line: string): { name: string } {
    const { name } = unsafeMatch(line, pattern.recording);
    return { name };
  }
  getNextStatusLine(line: string, timer: Timer): string {
    const m = this.opts?.checkBoxMarks?.stop;
    const newLine = line.replace(
      "``",
      `\` ${toHHmmss(timer.accumulatedSeconds)}\``,
    );
    return m ? replaceCheckBoxMark(newLine, m) : newLine;
  }
}
class RecordedStatus extends AbstractStatus {
  readonly name = "recorded";
  parse(line: string): { name: string; seconds: number } {
    const { name, time } = unsafeMatch(line, pattern.recorded);
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return { name, seconds: hours * 60 * 60 + minutes * 60 + seconds };
  }
  getNextStatusLine(line: string): string {
    const m = this.opts?.checkBoxMarks?.recording;
    const newLine = line.replace(/` \d\d:\d\d:\d\d`/, "``");
    return m ? replaceCheckBoxMark(newLine, m) : newLine;
  }
}
