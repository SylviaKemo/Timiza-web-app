let counter = 0;

/** Short unique id with a readable prefix, e.g. `t_lx3k9a_1`. */
export function createId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}
