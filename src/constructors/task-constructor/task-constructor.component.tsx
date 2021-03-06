// libs and hooks
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
// redux
import { connect, ConnectedProps } from "react-redux";
import { selectTaskSetJSON } from "../../redux/constructor-jsons/constructor-jsons.selectors";
import { updateTaskSetJSON } from "../../redux/constructor-jsons/constructor-jsons.actions";
import { selectAllLevelsHiddenFields } from "../../redux/levels-hidden-fields/levels-hidden-fields.selectors";
import { createStructuredSelector } from "reselect";
import reduxWatch from "redux-watch";
import store from "../../redux/store";
import {
  toggleFieldVisibilityForAllAutoLevels,
  toggleFieldVisibilityForAllManualLevels,
} from "../../redux/levels-hidden-fields/levels-hidden-fields.actions";
// context
import { TasksFieldArrayActionsContext } from "../task-set-constructor/task-set-constructor.component";
// components
import AppModalComponent from "../../components/app-modal/app-modal.component";
import ActionButton from "../../components/action-button/action-button.component";
import ConstructorForm from "../../components/constructor-form/constructor-form.component";
// types
import { ActionButtonProps } from "../../components/action-button/action-button.types";
import { AllLevelsHiddenFields } from "../../redux/levels-hidden-fields/levels-hidden-fields.types";
import { TaskSetConstructorInputs } from "../task-set-constructor/task-set-constructor.types";
import { ConstructorInputProps } from "../../components/constructor-input/construcor-input.types";
import { ConstructorSelectProps } from "../../components/constructor-select/constructor-select.types";
import { RootState } from "../../redux/root-reducer";
import { TaskConstructorProps } from "./task-constructor.types";
// data
import { goalTypes, rulePacks, subjectTypes } from "./task-constructor.data";
// icons
import Icon from "@mdi/react";
import {
  mdiArrowDown,
  mdiArrowExpandDown,
  mdiArrowExpandLeft,
  mdiArrowExpandRight,
  mdiArrowExpandUp,
  mdiArrowUp,
  mdiClose,
  mdiContentCopy,
  mdiEye,
  mdiEyeOff,
  mdiFileEye,
  mdiPlayCircle,
  mdiRobot,
  mdiWrench,
} from "@mdi/js";
// styles
import "./task-constructor.styles.scss";

const TaskConstructor = ({
  index,
  defaultValue,
  hidden,
  updateDemo,
  visualizationMode,
  allLevelsHiddenFields,
  toggleFieldVisibilityForAllManualLevels,
  toggleFieldVisibilityForAllAutoLevels,
  updateName,
  taskSetJSON,
  updateTaskSetJSON,
}: TaskConstructorProps & ConnectedProps<typeof connector>): JSX.Element => {
  const { register, getValues, watch } = useFormContext();
  // @ts-ignore
  const { append, swap, remove } = React.useContext(
    TasksFieldArrayActionsContext
  );

  const taskCreationType = defaultValue.taskCreationType;

  const [showAddFields, setShowAddFields] = useState(false);

  // TODO: rebuild hide and show inputs mechanics

  // TODO: add update name

  const [localHiddenFields, setLocalHiddenFields] = useState<any>(
    (() =>
      taskCreationType === "auto"
        ? allLevelsHiddenFields.autoLevelsHiddenFields
        : allLevelsHiddenFields.manualLevelsHiddenFields)()
  );
  const [showHiddenFieldsModal, setShowHiddenFieldsModal] = useState(false);

  const toggleFieldVisibilityForAllLevels = (fieldName: string): void => {
    setLocalHiddenFields((prevState: any) => {
      return { ...prevState, [fieldName]: !prevState[fieldName] };
    });
    taskCreationType === "auto"
      ? toggleFieldVisibilityForAllAutoLevels(fieldName)
      : toggleFieldVisibilityForAllManualLevels(fieldName);
  };

  const w = reduxWatch(() => selectAllLevelsHiddenFields(store.getState()));
  store.subscribe(
    w((newVal, oldVal) => {
      const taskCreationTypeNewVal =
        taskCreationType === "manual"
          ? newVal.manualLevelsHiddenFields
          : newVal.autoLevelsHiddenFields;
      const taskCreationTypeOldVal =
        taskCreationType === "manual"
          ? oldVal.manualLevelsHiddenFields
          : oldVal.autoLevelsHiddenFields;
      for (const key in taskCreationTypeNewVal) {
        if (taskCreationTypeOldVal[key] !== taskCreationTypeNewVal[key]) {
          setLocalHiddenFields((prevState: any) => {
            return {
              ...prevState,
              [key]: taskCreationTypeNewVal[key],
            };
          });
        }
      }
    })
  );

  /* making these values dynamic with react-hook-form's watch function
  in order to conditionally render dependent fields:
  goalExpression, goalNaturalNumber, goalPattern */
  const goalTypeValue: string = watch(`tasks[${index}].goalType`);

  const allInputs: (ConstructorInputProps | ConstructorSelectProps)[] = [
    {
      name: `tasks[${index}].nameEn`,
      label: "Имя En",
      type: "text",
      defaultValue: defaultValue.nameEn,
    },
    {
      name: `tasks[${index}].nameRu`,
      label: "Имя Ru",
      type: "text",
      defaultValue: defaultValue.nameRu,
    },
    {
      name: `tasks[${index}].code`,
      label: "Код",
      type: "text",
      defaultValue: defaultValue.code,
    },
    {
      name: `tasks[${index}].namespace`,
      label: "Namespace",
      type: "text",
      defaultValue: defaultValue.namespace,
    },
    {
      name: `tasks[${index}].subjectTypes`,
      label: "Предметные области",
      type: "text",
      options: subjectTypes.map((item: string) => ({
        label: item,
        value: item,
      })),
      isMulti: true,
      defaultValue: defaultValue.subjectTypes,
    },
    {
      name: `tasks[${index}].startExpression`,
      label: "Стартовое выражение",
      type: "text",
      expressionInput: true,
      defaultValue: defaultValue.startExpression,
    },
    {
      name: `tasks[${index}].goalType`,
      label: "Тип цели",
      type: "text",
      options: goalTypes.map((item: string) => ({ label: item, value: item })),
      defaultValue: defaultValue.goalType,
    },
    {
      name: `tasks[${index}].goalExpression`,
      label: "Целевое выражение",
      type: "text",
      expressionInput: true,
      defaultValue: defaultValue.goalExpression,
      isVisible: goalTypeValue === "Сведение к целевому выражению",
    },
    {
      name: `tasks[${index}].goalNumberProperty`,
      label: "Целевое числовое значение",
      type: "number",
      defaultValue: defaultValue.goalNumberProperty,
      isVisible:
        goalTypeValue === "Сведение к КНФ" ||
        goalTypeValue === "Сведение к ДНФ",
    },
    {
      name: `tasks[${index}].goalPattern`,
      label: "Патерн цели",
      type: "text",
      defaultValue: defaultValue.goalPattern,
      isVisible:
        goalTypeValue !== "Сведение к целевому выражению" &&
        goalTypeValue !== "Сведение к КНФ" &&
        goalTypeValue !== "Сведение к ДНФ",
    },
    {
      name: `tasks[${index}].rulePacks`,
      label: "Пакеты правил",
      type: "text",
      isMulti: true,
      options: rulePacks.map((item: string) => ({ label: item, value: item })),
      defaultValue: defaultValue.rulePacks,
    },
    {
      name: `tasks[${index}].stepsNumber`,
      label: "Количество шагов",
      type: "number",
      defaultValue: defaultValue.stepsNumber,
    },
    {
      name: `tasks[${index}].time`,
      label: "Время",
      type: "number",
      defaultValue: defaultValue.time,
    },
    {
      name: `tasks[${index}].difficulty`,
      label: "Сложность",
      type: "number",
      defaultValue: defaultValue.difficulty,
    },
    {
      name: `tasks[${index}].solution`,
      label: "Решение",
      type: "text",
      expressionInput: true,
      defaultValue: defaultValue.solution,
    },
    {
      name: `tasks[${index}].countOfAutoGeneratedTasks`,
      label: "Количество автогенерируемых подуровней",
      type: "number",
      defaultValue: defaultValue.countOfAutoGeneratedTasks,
    },
    {
      name: `tasks[${index}].operations`,
      label: "Операции",
      type: "text",
      defaultValue: defaultValue.operations,
    },
    {
      name: `tasks[${index}].stepsCountInterval`,
      label: "Количество шагов",
      type: "number",
      defaultValue: defaultValue.stepsCountInterval,
    },
    {
      name: `tasks[${index}].implicitTransformationsCount`,
      label: "Нетривиальных правил на шаг",
      type: "number",
      defaultValue: defaultValue.implicitTransformationsCount,
    },
    {
      name: `tasks[${index}].autoGeneratedRulePacks`,
      label: "Пакеты правил для автогенерации",
      type: "text",
      isMulti: true,
      options: rulePacks.map((item: string) => ({ label: item, value: item })),
      defaultValue: defaultValue.autoGenerationRulePacks,
    },
    {
      name: `tasks[${index}].lightWeightOperations`,
      label: "lightWeightOperations",
      type: "text",
      defaultValue: defaultValue.lightWeightOperations,
    },
    {
      name: `tasks[${index}].nullWeightOperations`,
      label: "nullWeightOperations",
      type: "text",
      defaultValue: defaultValue.nullWeightOperations,
    },
    {
      name: `tasks[${index}].startTime`,
      label: "Дата запуска",
      type: "text",
      defaultValue: defaultValue.startTime,
    },
    {
      name: `tasks[${index}].endTime`,
      label: "Дата закрытия",
      type: "text",
      defaultValue: defaultValue.endTime,
    },
  ];

  const manualTaskInputsNames = [
    "nameEn",
    "nameRu",
    "startExpression",
    "goalType",
    "goalExpression",
    "goalNaturalNumber",
    "goalPattern",
  ];

  const autoTaskInputsNames = [
    "nameEn",
    "nameRu",
    "operations",
    "subjectTypes",
    "stepsCountInterval",
    "implicitTransformationsCount",
    "autoGeneratedRulePacks",
  ];

  // get basic inputs
  const [manualTaskBasicInputs, autoTaskBasicInputs] = [
    manualTaskInputsNames,
    autoTaskInputsNames,
  ].map((basicInputNames: string[]) => {
    return allInputs.filter(
      (input: ConstructorInputProps | ConstructorSelectProps) => {
        const { name } = input;
        const prefix = `tasks[${index}].`;
        return basicInputNames.some(
          (inputName: string) => prefix + inputName === name
        );
      }
    );
  });

  // get additional inputs
  const [manualTasksAddInputs, autoTasksAddInputs] = [
    manualTaskBasicInputs,
    autoTaskBasicInputs,
  ].map((basicInputs: (ConstructorInputProps | ConstructorSelectProps)[]) => {
    return allInputs
      .filter((input: ConstructorInputProps | ConstructorSelectProps) => {
        return !basicInputs.includes(input);
      })
      .map((input: ConstructorInputProps | ConstructorSelectProps) => {
        return {
          ...input,
          isVisible:
            input.isVisible === undefined
              ? showAddFields
              : input.isVisible && showAddFields,
        };
      });
  });

  const tableActionButtonsLeft: ActionButtonProps[] = [
    {
      mdiIconPath: mdiContentCopy,
      size: 1.5,
      action() {
        append({
          taskCreationType: taskCreationType,
          ...getValues().tasks[index],
        });
      },
    },
    {
      mdiIconPath: mdiArrowUp,
      size: 1.5,
      async action() {
        if (index !== 0) {
          await swap(index, index - 1);
          // @ts-ignore
          updateTaskSetJSON(getValues());
        }
      },
    },
    {
      mdiIconPath: mdiArrowDown,
      size: 1.5,
      async action() {
        if (index !== getValues().tasks.length - 1) {
          await swap(index, index + 1);
          // @ts-ignore
          updateTaskSetJSON(getValues());
        }
      },
    },
  ];

  const tableActionButtonsRight: ActionButtonProps[] = [
    {
      mdiIconPath: mdiClose,
      size: 2,
      async action() {
        if (window.confirm(`Вы точно хотите удалить уровень ${index + 1}?`)) {
          await remove(index);
          // @ts-ignore
          updateTaskSetJSON(getValues());
        }
      },
    },
    {
      mdiIconPath: mdiFileEye,
      size: 2,
      action() {
        setShowHiddenFieldsModal(true);
      },
    },
    {
      mdiIconPath: mdiPlayCircle,
      size: 2,
      action() {
        updateDemo(index);
      },
    },
  ];

  const listTopActionButtons: ActionButtonProps[] = tableActionButtonsLeft
    .concat(tableActionButtonsRight)
    .map((item: ActionButtonProps) => {
      return { ...item, size: 1.5 };
    });

  const isTable = (): boolean => visualizationMode === "table";

  return (
    <div
      className={isTable() ? "task-constructor-table" : "task-constructor-list"}
      style={{
        display: hidden ? "none" : "flex",
      }}
    >
      {isTable() ? (
        <>
          {tableActionButtonsLeft.map(
            (button: ActionButtonProps, i: number) => {
              const { size, action, mdiIconPath } = button;
              return (
                <div key={i} className="task-constructor-table__icon">
                  <ActionButton
                    mdiIconPath={mdiIconPath}
                    size={size}
                    action={action}
                  />
                </div>
              );
            }
          )}
          <div className="task-constructor-table__icon">{index + 1}.</div>
          <div className="task-constructor-table__icon">
            <Icon
              path={taskCreationType === "auto" ? mdiRobot : mdiWrench}
              size={2}
            />
          </div>
        </>
      ) : (
        <div className="task-constructor-list__top-action-buttons">
          {listTopActionButtons.map((button: ActionButtonProps, i: number) => {
            return <ActionButton key={i} {...button} />;
          })}
        </div>
      )}
      <ConstructorForm
        inputs={
          taskCreationType === "auto"
            ? autoTaskBasicInputs.concat(autoTasksAddInputs)
            : manualTaskBasicInputs.concat(manualTasksAddInputs)
        }
        register={register}
        // @ts-ignore
        updateJSON={() => updateTaskSetJSON(getValues())}
      />
      {isTable() ? (
        <>
          <div className="task-constructor-table__icon">
            <ActionButton
              mdiIconPath={
                showAddFields ? mdiArrowExpandLeft : mdiArrowExpandRight
              }
              size={2}
              action={() => setShowAddFields(!showAddFields)}
            />
          </div>
          {tableActionButtonsRight.map(
            (button: ActionButtonProps, i: number) => {
              const { size, mdiIconPath, action } = button;
              return (
                <div key={i} className="task-constructor-table__icon">
                  <ActionButton
                    mdiIconPath={mdiIconPath}
                    size={size}
                    action={action}
                  />
                </div>
              );
            }
          )}
        </>
      ) : (
        <ActionButton
          mdiIconPath={showAddFields ? mdiArrowExpandUp : mdiArrowExpandDown}
          size={2}
          action={() => setShowAddFields(!showAddFields)}
          margin={"2rem 0 0 0"}
        />
      )}
    </div>
  );
};

// connecting redux
const mapStateToProps = createStructuredSelector<
  RootState,
  {
    allLevelsHiddenFields: AllLevelsHiddenFields;
    taskSetJSON: TaskSetConstructorInputs;
  }
>({
  allLevelsHiddenFields: selectAllLevelsHiddenFields,
  taskSetJSON: selectTaskSetJSON,
});

const mapDispatchToProps = (dispatch: any) => ({
  toggleFieldVisibilityForAllManualLevels: (fieldName: string) => {
    return dispatch(toggleFieldVisibilityForAllManualLevels(fieldName));
  },
  toggleFieldVisibilityForAllAutoLevels: (fieldName: string) => {
    return dispatch(toggleFieldVisibilityForAllAutoLevels(fieldName));
  },
  updateTaskSetJSON: (taskSetJSON: TaskSetConstructorInputs) => {
    return dispatch(updateTaskSetJSON(taskSetJSON));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(TaskConstructor);
