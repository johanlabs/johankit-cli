// src/core/vm.ts
import { NodeVM, VMScript } from 'vm2';

export function runInVm(code: string, sandbox: Record<string, any> = {}) {
  const vm = new NodeVM({
    console: 'inherit',
    sandbox,
    require: {
      external: true,
      builtin: ['*'],
    },
    wrapper: 'commonjs',
    timeout: 1000
  });

  const script = new VMScript(code);
  return vm.run(script);
}