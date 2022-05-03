import {
  IsNotEmpty,
  IsString,
  validate,
  ValidateNested,
} from 'class-validator';

import { PlumberConfig } from './rules/plumber.config';

import { ReleaseBranch } from './releaseBranch.model';
import { Rules } from './rules/rules.model';
import { Feedback } from '../feedback.model';
import { Validation } from '../../types/general';
import { ImplementsStatic } from '../../services/common.service';

@ImplementsStatic<Validation<Config>>()
export class Config {
  @IsNotEmpty({
    message: '[Wrong configuration] - "package": "$value" is an empty `string`',
  })
  @IsString({
    message: '[Wrong configuration] - "package": "$value" is not a `string`',
  })
  readonly package?: string;

  @ValidateNested()
  readonly branches?: ReleaseBranch[];

  @ValidateNested()
  private readonly _rules?: Rules;

  constructor(private readonly config: PlumberConfig) {
    this.package = this.config?.package ?? '';
    this.branches = this.config.config?.map(
      record => new ReleaseBranch(record)
    );
    this._rules = new Rules(this.config.rules);
  }

  get rules() {
    return this._rules?.rules;
  }

  static validate(instance: Config) {
    let feedback = new Feedback();

    validate(instance).then(errors => {
      const results = errors.map(error => {
        return {
          property: error.property,
          value: error.value,
          note: error.contexts,
        };
      });

      console.log(results);

      //feedback.setConfigTemplate(results);
    });

    return feedback;
  }
}
