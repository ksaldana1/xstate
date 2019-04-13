import { StateNode } from './StateNode';
import {
  GenericsFromMachineConfig,
  MachineConfig,
  MachineOptions,
  StateMachine
} from './types';

type G<T> = GenericsFromMachineConfig<T>;

export function Machine<TConfig extends MachineConfig<any, any, any>>(
  config: TConfig,
  options: Partial<MachineOptions<G<TConfig>['context'], G<TConfig>['event']>>,
  initialContext:
    | G<TConfig>['context'][G<TConfig>['initial']]
    | undefined = config.context
): StateMachine<
  G<TConfig>['context'],
  G<TConfig>['schema'],
  G<TConfig>['event']
> {
  return new StateNode<
    G<TConfig>['context'],
    G<TConfig>['schema'],
    G<TConfig>['event']
  >(config, options, initialContext);
}
