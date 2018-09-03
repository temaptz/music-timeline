// Сгенерировать id
export const generateId = (): number => {
  return new Date().getTime() + Math.round(Math.random() * 100000);
};

// Генерация цвета
export const generateColor = (): string => {
  return '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
};
