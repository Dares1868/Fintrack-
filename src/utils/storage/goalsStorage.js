// Deprecated: Use goalService API calls instead
// These functions are kept only for migration purposes

export const getGoals = () => {
  console.warn('getGoals is deprecated. Use goalService.getGoals() instead');
  return JSON.parse(localStorage.getItem("goalsData") || "[]");
};

export const saveGoals = (goalsArray) => {
  console.warn('saveGoals is deprecated. Use goalService.createGoal() instead');
  localStorage.setItem("goalsData", JSON.stringify(goalsArray));
};
