import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import ParamEditor, {
  Model,
  Param,
  Color,
} from "./components/ParamEditor/ParamEditor";
import Modal from "./components/Modal/Modal";
import "./App.css";
import { mockData, mockColors } from "./data/models";

const baseParams: Omit<Param, "options">[] = [
  { id: 1, name: "Назначение", type: "string" },
  { id: 2, name: "Длина", type: "string" },
  { id: 3, name: "Количество", type: "number" },
  { id: 4, name: "Цвет", type: "select" },
];

const defaultColorsForNewModel: Color[] = mockColors.slice(0, 3);

const createNewModelTemplate = (): Model => ({
  id: 0,
  name: "",
  paramValues: [],
  colors: [...defaultColorsForNewModel],
});

const App: React.FC = () => {
  const [models, setModels] = useState<Model[]>(mockData);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [currentModelName, setCurrentModelName] = useState<string>("");
  const editorRef = useRef<ParamEditor>(null);

  const editorParams: Param[] = baseParams.map((p) => ({ ...p }));

  useEffect(() => {
    if (editingModel) {
      setCurrentModelName(editingModel.name);
    } else {
      setCurrentModelName("");
    }
  }, [editingModel]);

  const handleOpenAddModal = () => {
    setIsAddingNew(true);
    setEditingModel(createNewModelTemplate());
  };

  const handleOpenEditModal = (model: Model) => {
    setIsAddingNew(false);
    setEditingModel(model);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentModelName(event.target.value);
  };

  const handleSave = () => {
    if (editorRef.current && editingModel) {
      const updatedModelData = editorRef.current.getEditedModel();

      const finalModel: Model = {
        ...updatedModelData,
        name:
          currentModelName.trim() ||
          (isAddingNew ? "Новая модель" : editingModel.name),
      };

      if (isAddingNew) {
        const maxId = models.reduce((max, m) => Math.max(max, m.id), 0);
        const newModelWithId = {
          ...finalModel,
          id: maxId + 1,
        };
        setModels([...models, newModelWithId]);
      } else {
        setModels(
          models.map((model) =>
            model.id === editingModel.id ? finalModel : model
          )
        );
      }

      setEditingModel(null);
      setIsAddingNew(false);
      setCurrentModelName("");
    }
  };

  const handleCancel = () => {
    setEditingModel(null);
    setIsAddingNew(false);
    setCurrentModelName("");
  };

  const getDisplayValue = (model: Model, paramId: number): string => {
    const paramDef = editorParams.find((p) => p.id === paramId);
    const paramValue = model.paramValues.find(
      (pValue) => pValue.paramId === paramId
    );

    let displayValue = paramValue?.value ?? "N/A";

    if (paramDef?.name === "Цвет" && !displayValue) {
      return "Не выбран";
    }
    if (paramDef?.type === "number" && displayValue === "") {
      return "0";
    }

    return displayValue;
  };

  return (
    <div className="app-container">
      <div className="app-header-container">
        {" "}
        <h1 className="app-header">Модели продукции</h1>
        <button className="button button-add" onClick={handleOpenAddModal}>
          {" "}
          Добавить модель
        </button>
      </div>

      {models.length === 0 ? (
        <p className="no-models-message">
          Нет доступных моделей. Добавьте новую модель.
        </p>
      ) : (
        <div className="models-grid">
          {models.map((model) => (
            <div key={model.id} className="model-card">
              <h3>{model.name}</h3>
              <div className="params-container">
                {editorParams.map((param) => (
                  <div key={param.id} className="param-item">
                    <strong>{param.name}:</strong>
                    <span>{getDisplayValue(model, param.id)}</span>
                  </div>
                ))}
                <div className="param-item">
                  <strong>Доступные цвета:</strong>
                  <span>
                    {model.colors.map((c) => c.name).join(", ") || "Нет"}
                  </span>
                </div>
              </div>
              <button
                className="button button-edit"
                onClick={() => handleOpenEditModal(model)}
              >
                Редактировать
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!editingModel} onClose={handleCancel}>
        {editingModel && (
          <>
            <h2>
              {isAddingNew
                ? "Добавление новой модели"
                : `Редактирование: ${editingModel.name}`}
            </h2>
            <div className="param-editor-item">
              <label htmlFor="modelName" className="param-editor-label">
                Название модели
              </label>
              <input
                type="text"
                id="modelName"
                value={currentModelName}
                onChange={handleNameChange}
                className="param-editor-input"
                placeholder="Введите название"
              />
            </div>
            <ParamEditor
              ref={editorRef}
              params={editorParams}
              model={editingModel}
            />
            <div className="modal-actions">
              <button
                className="button button-save"
                onClick={handleSave}
                disabled={!currentModelName.trim()}
              >
                {" "}
                Сохранить
              </button>
              <button className="button button-cancel" onClick={handleCancel}>
                Отмена
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default App;
