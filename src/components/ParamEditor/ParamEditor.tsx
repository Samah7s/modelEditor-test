import React, { ChangeEvent } from "react";
import "./ParamEditor.css";

const COLOR_PARAM_NAME = "Цвет";

type ParamType = "string" | "number" | "select";

export interface Param {
  id: number;
  name: string;
  type: ParamType;
  options?: string[];
}

interface InputComponentProps {
  param: Param;
  value: string;
  onChange: (value: string) => void;
  availableColors?: Color[]; // Pass available colors specifically for the select input
}

const StringInput: React.FC<InputComponentProps> = ({
  param,
  value,
  onChange,
}) => (
  <input
    type="text"
    id={`param-${param.id}`}
    value={value}
    className="param-editor-input"
    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
  />
);

const NumberInput: React.FC<InputComponentProps> = ({
  onChange,
  param,
  value,
}) => (
  <input
    type="number"
    id={`param-${param.id}`}
    value={value}
    className="param-editor-input"
    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
  />
);

const SelectInput: React.FC<InputComponentProps> = ({
  param,
  value,
  onChange,
  availableColors,
}) => {
  const options =
    param.name === COLOR_PARAM_NAME && availableColors
      ? availableColors.map((color) => color.name)
      : param.options ?? [];

  return (
    <select
      id={`param-${param.id}`}
      value={value}
      className="param-editor-select"
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
    >
      {!value && options.length > 0 && (
        <option value="" disabled>
          -- Выберите --
        </option>
      )}
      {param.name === COLOR_PARAM_NAME && availableColors?.length === 0 && (
        <option value="" disabled>
          -- Нет доступных цветов --
        </option>
      )}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const inputComponentRegistry: Record<
  ParamType,
  React.FC<InputComponentProps>
> = {
  string: StringInput,
  number: NumberInput,
  select: SelectInput,
};

interface ParamValue {
  paramId: number;
  value: string;
}

export interface Color {
  id: number;
  name: string;
}

export interface Model {
  id: number;
  name: string;
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
  onModelChange?: (model: Model) => void;
}

interface State {
  currentModel: Model;
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentModel: this.initializeModel(props.model, props.params),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.model.id !== this.props.model.id ||
      prevProps.params !== this.props.params
    ) {
      this.setState({
        currentModel: this.initializeModel(this.props.model, this.props.params),
      });
    }
  }

  private initializeModel(model: Model, params: Param[]): Model {
    const newParamValues = new Map<number, string>();
    const currentValuesMap = new Map(
      model.paramValues.map((pValue) => [pValue.paramId, pValue.value])
    );

    params.forEach((param) => {
      const existingValue = currentValuesMap.get(param.id);
      let defaultValue = this.getDefaultValue(param.type);
      if (param.name === COLOR_PARAM_NAME && model.colors.length > 0) {
        const isValidCurrentColor = model.colors.some(
          (c) => c.name === existingValue
        );
        defaultValue = isValidCurrentColor ? existingValue ?? "" : "";
      }

      newParamValues.set(param.id, existingValue ?? defaultValue);
    });

    return {
      ...model,
      paramValues: Array.from(newParamValues).map(([paramId, value]) => ({
        paramId,
        value,
      })),
    };
  }

  private getDefaultValue(type: ParamType): string {
    switch (type) {
      case "number":
        return "0";
      case "string":
      case "select":
      default:
        return "";
    }
  }

  private handleChange = (paramId: number, value: string) => {
    this.setState(
      (prev) => {
        const updatedParamValues = prev.currentModel.paramValues.map((pValue) =>
          pValue.paramId === paramId ? { ...pValue, value } : pValue
        );
        if (!updatedParamValues.some((pv) => pv.paramId === paramId)) {
          updatedParamValues.push({ paramId, value });
        }

        const updatedModel = {
          ...prev.currentModel,
          paramValues: updatedParamValues,
        };
        return { currentModel: updatedModel };
      },
      () => {
        if (this.props.onModelChange) {
          this.props.onModelChange(this.state.currentModel);
        }
      }
    );
  };

  public getEditedModel(): Model {
    return this.state.currentModel;
  }

  public setModelName = (name: string) => {
    this.setState(
      (prev) => ({
        currentModel: {
          ...prev.currentModel,
          name: name,
        },
      }),
      () => {
        if (this.props.onModelChange) {
          this.props.onModelChange(this.state.currentModel);
        }
      }
    );
  };

  private renderInput(param: Param) {
    const paramValue = this.state.currentModel.paramValues.find(
      (pValue) => pValue.paramId === param.id
    );
    const value = paramValue?.value ?? this.getDefaultValue(param.type);
    const InputComponent = inputComponentRegistry[param.type];
    if (!InputComponent) {
      console.warn(`No input component registered for type: ${param.type}`);
      return (
        <span className="param-editor-unsupported">
          Unsupported parameter type: {param.type}
        </span>
      );
    }
    const inputProps: InputComponentProps = {
      param,
      value,
      onChange: (newValue) => this.handleChange(param.id, newValue),
      ...(param.type === "select" &&
        param.name === COLOR_PARAM_NAME && {
          availableColors: this.state.currentModel.colors,
        }),
    };

    return <InputComponent {...inputProps} />;
  }

  render() {
    return (
      <div>
        {this.props.params.map((param) => (
          <div key={param.id} className="param-editor-item">
            <label htmlFor={`param-${param.id}`} className="param-editor-label">
              {param.name}
            </label>
            {this.renderInput(param)}
          </div>
        ))}
      </div>
    );
  }
}

export default ParamEditor;
