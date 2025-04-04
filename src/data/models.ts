import { Model, Color } from "../components/ParamEditor/ParamEditor";

export const mockColors: Color[] = [
  { id: 101, name: "Красный" },
  { id: 102, name: "Синий" },
  { id: 103, name: "Зеленый" },
  { id: 104, name: "Черный" },
  { id: 105, name: "Белый" },
  { id: 106, name: "Желтый" },
];

export const mockData: Model[] = [
  {
    id: 1,
    name: "Модель 'Альфа'",
    paramValues: [
      { paramId: 1, value: "Основное" },
      { paramId: 2, value: "100м" },
      { paramId: 3, value: "5" },
      { paramId: 4, value: "Красный" },
    ],
    colors: [mockColors[0], mockColors[1], mockColors[3]],
  },
  {
    id: 2,
    name: "Модель 'Бета'",
    paramValues: [
      { paramId: 1, value: "Специальное" },
      { paramId: 2, value: "250м" },
      { paramId: 3, value: "12" },
      { paramId: 4, value: "" },
    ],
    colors: [
      mockColors[2],
      mockColors[4],
      mockColors[0],
      mockColors[1],
      mockColors[3],
    ],
  },
];
