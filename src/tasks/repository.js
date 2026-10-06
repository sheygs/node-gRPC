export function createTaskRepository(seed = []) {
  const tasks = new Map(seed.map((task) => [task.id, { ...task }]));

  return {
    list: () => [...tasks.values()].map((task) => ({ ...task })),
    find: (id) => (tasks.has(id) ? { ...tasks.get(id) } : undefined),
    save(task) {
      tasks.set(task.id, { ...task });
      return { ...task };
    },

    delete: (id) => tasks.delete(id),
  };
}
