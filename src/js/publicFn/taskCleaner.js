export const taskCleaner = (tasks, orders, projects) => {
  let result = [];

  if (!tasks) {
    return;
  }

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].ProjectNo) {
      if (Object.keys(projects).includes(tasks[i].ProjectNo)) {
        result.push(tasks[i]);
        continue;
      }
    }

    if (tasks[i].OrderNo) {
      if (Object.keys(orders).includes(tasks[i].OrderNo)) {
        result.push(tasks[i]);
        continue;
      }
    }
  }

  return result;
};
