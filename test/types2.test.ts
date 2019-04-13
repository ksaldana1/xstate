import {
  Machine,
  assign,
  MachineConfig,
  ContextUnionFromStateSchema,
  ContextMapFromStateSchema
} from '../src/index';
import { Context } from 'vm';

interface LightStateSchema {
  states: {
    green: {
      context: {
        value: 'GREEN';
      };
    };
    yellow: {
      context: {
        value: 'YELLOW';
      };
    };
    red: {
      context: {
        value: 'RED';
      };
    };
  };
}

type Events =
  | {
      type: 'TIMER';
    }
  | { type: 'POWER_OUTAGE' }
  | { type: 'FORBIDDEN_EVENT' };

type B = ContextUnionFromStateSchema<LightStateSchema>;

const machineConfig: MachineConfig<LightStateSchema, Events> = {
  key: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: {
          target: 'yellow',
          actions: assign((ctx, event) => ({
            value: 'GREEN'
          }))
        },
        POWER_OUTAGE: 'red',
        FORBIDDEN_EVENT: undefined
      }
    },
    yellow: {
      on: {
        TIMER: 'red',
        POWER_OUTAGE: 'red'
      }
    },
    red: {
      on: {
        TIMER: 'green',
        POWER_OUTAGE: 'red'
      }
    }
  }
};

const lightMachine = Machine<MachineConfig<LightStateSchema, Events>>({
  key: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: {
          target: 'yellow',
          actions: assign({
            value: 'RED' as 'RED'
          })
        },
        POWER_OUTAGE: 'red',
        FORBIDDEN_EVENT: undefined
      }
    },
    yellow: {
      on: {
        TIMER: 'red',
        POWER_OUTAGE: 'red'
      }
    },
    red: {
      on: {
        TIMER: 'green',
        POWER_OUTAGE: 'red'
      }
    }
  }
});
