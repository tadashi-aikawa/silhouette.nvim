import { DateTime, ValueObject } from "owlelia";

interface Props {
  name: string;
  accumulatedSeconds: number;
  startTime?: DateTime;
}

export class Timer extends ValueObject<Props> {
  static of(props: Props): Timer {
    return new Timer(props);
  }

  stop(now: DateTime): Timer {
    return new Timer({
      ...this._value,
      startTime: undefined,
      accumulatedSeconds: this.getPastSeconds(now),
    });
  }

  getPastSeconds(now: DateTime): number {
    return (
      now.diffSeconds(this._value.startTime!) + this._value.accumulatedSeconds
    );
  }

  get name(): Props["name"] {
    return this._value.name;
  }
  get accumulatedSeconds(): Props["accumulatedSeconds"] {
    return this._value.accumulatedSeconds;
  }
  get startTime(): Props["startTime"] {
    return this._value.startTime;
  }
}
