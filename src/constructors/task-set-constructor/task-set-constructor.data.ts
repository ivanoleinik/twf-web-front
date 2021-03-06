import { TaskConstructorInputs } from "../task-constructor/task-constructor.types";
import { MathInputFormat } from "../../utils/kotlin-lib-functions";

export const subjectTypes: string[] = [
  "subject type 1",
  "subject type 2",
  "subject type 3",
  "subject type 4",
  "subject type 5",
  "subject type 6",
  "subject type 7",
  "subject type 8",
  "subject type 9",
  "subject type 10",
];

export const taskConstructorDefaultValues: TaskConstructorInputs = {
  taskCreationType: "manual",
  nameEn: "",
  nameRu: "",
  code: "",
  namespace: "",
  subjectTypes: "",
  startExpression: {
    format: MathInputFormat.TEX,
    expression: "",
  },
  goalType: "",
  goalExpression: {
    format: MathInputFormat.TEX,
    expression: "",
  },
  goalNumberProperty: 0,
  goalPattern: "",
  rulePacks: "",
  stepsNumber: 0,
  time: 0,
  difficulty: 0,
  solution: {
    format: MathInputFormat.TEX,
    expression: "",
  },
  countOfAutoGeneratedTasks: 0,
  operations: "",
  stepsCountInterval: 0,
  implicitTransformationsCount: 0,
  autoGeneratedRulePacks: "",
  lightWeightOperations: "",
  nullWeightOperations: "",
  startTime: "",
  endTime: "",
};
