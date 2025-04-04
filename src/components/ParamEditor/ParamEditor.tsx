import React, { ChangeEvent } from "react";
import "./ParamEditor.css";

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
}) => (
  <select
    id={`param-${param.id}`}
    value={value}
    className="param-editor-select"
    onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
  >
    {!value && (
      <option value="" disabled>
        -- Выберите --
      </option>
    )}
    {param.options?.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const inputComponentRegistry: Record<
  ParamType,
  React.FC<InputComponentProps>
> = {
  string: StringInput,
  number: NumberInput,
  select: SelectInput,
  // Возможность расшерения новых типов
};

interface ParamValue {
  paramId: number;
  value: string;
}

export interface Model {
  id: number;
  name: string;
  paramValues: ParamValue[];
  colors: Color[];
}

interface Color {
  id: number;
  name: string;
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: Map<number, string>;
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paramValues: this.initializeParamValues(),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.model !== this.props.model) {
      this.setState({ paramValues: this.initializeParamValues() });
    }
  }

  private initializeParamValues(): Map<number, string> {
    const values = new Map<number, string>();
    const currentValuesMap = new Map(
      this.props.model.paramValues.map((pValue) => [
        pValue.paramId,
        pValue.value,
      ])
    );
    this.props.params.forEach((param) => {
      const existingValue = currentValuesMap.get(param.id);
      values.set(param.id, existingValue ?? this.getDefaultValue(param.type));
    });
    return values;
  }

  private getDefaultValue(type: ParamType): string {
    switch (type) {
      case "number":
        return "0";
      default:
        return "";
    }
  }

  // public static getDefaultValue(type: ParamType): string {
  //   switch (type) {
  //     case "number":
  //       return "0";
  //     // Добавим случай для select, если нужно дефолтное значение из options
  //     // case "select":
  //     //    return options?.[0] ?? ""; // Например, первый option
  //     default:
  //       return "";
  //   }
  // }

  private handleChange = (paramId: number, value: string) => {
    this.setState((prev) => {
      const newValues = new Map(prev.paramValues);
      newValues.set(paramId, value);
      return { paramValues: newValues };
    });
  };

  public getModel(): Model {
    return {
      ...this.props.model,
      paramValues: Array.from(this.state.paramValues).map(
        ([paramId, value]) => ({
          paramId,
          value,
        })
      ),
    };
  }

  private renderInput(param: Param) {
    const value = this.state.paramValues.get(param.id) ?? "";
    const InputComponent = inputComponentRegistry[param.type];
    if (!InputComponent) {
      console.warn(`No input component registerd for type: ${param.type}`);
      return (
        <span className="param-editor-unsupported">
          Unsupported parameter type : {param.type}
        </span>
      );
    }
    return (
      <InputComponent
        param={param}
        value={value}
        onChange={(newValue) => this.handleChange(param.id, newValue)}
      />
    );
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
