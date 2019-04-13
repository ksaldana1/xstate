import { StateNodeConfig, MachineConfig, EventObject } from '../types';
import { assign } from '..';

interface StateSchema {
  states?: Record<string, StateNodeConfig<any, any, any>>;
}

type PluckContext<T> = T extends StateNodeConfig<infer TContext, any, any>
  ? TContext
  : never;

type ContextMapFromStateSchema<T extends StateSchema> = {
  [K in keyof T['states']]: PluckContext<T['states'][K]>
};

type ContextUnionFromContextMap<
  T extends ContextMapFromStateSchema<any>
> = T[keyof T];

export type ContextUnionFromStateSchema<
  T extends StateSchema
> = ContextUnionFromContextMap<ContextMapFromStateSchema<T>>;

type Events = {
  type: 'TOGGLE';
};

interface ToggleSchema {
  states: {
    active: {
      context: { value: 'ON' };
    };
    inactive: { context: { value: 'OFF' } };
  };
}

type IMachineConfig<
  T extends StateSchema,
  TEvents extends EventObject
> = MachineConfig<ContextUnionFromStateSchema<T>, T, TEvents>;

const toggleConfig: IMachineConfig<ToggleSchema, Events> = {
  id: 'toggle',
  states: {
    active: {
      on: {
        TOGGLE: {
          target: 'inactive',
          actions: assign({
            value: 'OFF'
          })
        }
      }
    },
    inactive: {}
  }
};
