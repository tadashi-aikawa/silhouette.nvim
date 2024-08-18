import { DateTime, Entity } from "npm:owlelia@0.48.1";

interface Props {
  name: string;
  date: DateTime;
}

const _brand = Symbol();
export class OnetimeTask extends Entity<Props> {
  private [_brand]!: void;

  static of(props: Props): OnetimeTask {
    return new OnetimeTask(props.name, props);
  }

  get name(): string {
    return this._props.name;
  }

  get date(): DateTime {
    return this._props.date;
  }
}
