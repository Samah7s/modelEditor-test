import React, { useState, useRef } from "react";
import ParamEditor, {
  Model,
  Param,
} from "./components/ParamEditor/ParamEditor";
import Modal from "./components/Modal/Modal";
import {
  cancelButton,
  editButton,
  modalActions,
  modelCard,
  paramItem,
  paramsContainer,
  saveButton,
} from "./AppStyles.tsx";

const mockData = [
  {
    id: 1,
    name: "Повседневное платье",
    paramValues: [
      { paramId: 1, value: "повседневное" },
      { paramId: 2, value: "макси" },
      { paramId: 3, value: "5" },
      { paramId: 4, value: "Синий" },
    ],
    colors: [],
  },
  {
    id: 2,
    name: "Выходное платье",
    paramValues: [
      { paramId: 1, value: "выходное" },
      { paramId: 2, value: "мини" },
      { paramId: 3, value: "5" },
      { paramId: 4, value: "Синий" },
    ],
    colors: [],
  },
  {
    id: 3,
    name: "Пальто",
    paramValues: [
      { paramId: 1, value: "выходное" },
      { paramId: 2, value: "медиум" },
      { paramId: 3, value: "5" },
      { paramId: 4, value: "Синий" },
    ],
    colors: [],
  },
];

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Модели продукции</h1>

      <div style={{ display: "grid", gap: "10px" }}>
        {models.map((model) => (
          <div key={model.id} style={modelCard}>
            <h3>{model.name}</h3>
            <div style={paramsContainer}>
              {model.paramValues.map((pValue) => (
                <div key={pValue.paramId} style={paramItem}>
                  <strong>
                    {params.find((p) => p.id === pValue.paramId)?.name}:
                  </strong>
                  <span>{pValue.value}</span>
                </div>
              ))}
            </div>
            <button style={editButton} onClick={() => setEditingModel(model)}>
              Редактировать
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={!!editingModel} onClose={() => setEditingModel(null)}>
        {editingModel && (
          <>
            <h2>Редактирование: {editingModel.name}</h2>
            <ParamEditor ref={editorRef} params={params} model={editingModel} />
            <div style={modalActions}>
              <button style={saveButton} onClick={handleSave}>
                Сохранить
              </button>
              <button
                style={cancelButton}
                onClick={() => setEditingModel(null)}
              >
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
