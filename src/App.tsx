import React, { useState, useRef } from "react";
import ParamEditor, {
  Model,
  Param,
} from "./components/ParamEditor/ParamEditor";
import Modal from "./components/Modal/Modal";
import "./App.css";
import { mockData } from "./data/models";

const App: React.FC = () => {
  const [models, setModels] = useState<Model[]>(mockData);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const editorRef = useRef<ParamEditor>(null);

  const params: Param[] = [
    { id: 1, name: "Назначение", type: "string" },
    { id: 2, name: "Длина", type: "string" },
    { id: 3, name: "Количество", type: "number" },
    {
      id: 4,
      name: "Цвет",
      type: "select",
      options: ["Красный", "Синий", "Зеленый", "Черный"],
    },
  ];

  const handleSave = () => {
    if (editorRef.current && editingModel) {
      const updatedModel = editorRef.current.getModel();
      setModels(
        models.map((model) =>
          model.id === editingModel.id ? updatedModel : model
        )
      );
      setEditingModel(null);
    }
  };
  const handleCancel = () => {
    setEditingModel(null);
  };

  return (
    <div className="app-container">
      <h1 className="app-header">Модели продукции</h1>
      <div className="models-grid">
        {models.map((model) => (
          <div key={model.id} className="model-card">
            <h3>{model.name}</h3>
            <div className="params-container">
              {params.map((param) => {
                const paramValue = model.paramValues.find(
                  (pValue) => pValue.paramId === param.id
                );
                const displayValue = paramValue?.value ?? "N/A";
                return (
                  <div key={param.id} className="param-item">
                    <strong>{param.name}:</strong>
                    <span>{displayValue}</span>
                  </div>
                );
              })}
            </div>
            <button
              className="button button-edit"
              onClick={() => setEditingModel(model)}
            >
              Редактировать
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={!!editingModel} onClose={handleCancel}>
        {editingModel && (
          <>
            <h2>Редактирование: {editingModel.name}</h2>
            <ParamEditor ref={editorRef} params={params} model={editingModel} />
            <div className="modal-actions">
              <button className="button button-save" onClick={handleSave}>
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
