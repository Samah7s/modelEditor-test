import React from "react";

// Типы данных
type ParamType = "string" | "number" | "select";

export interface Param {
  id: number;
  name: string;
  type: ParamType;
  options?: string[];
}

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
    this.props.params.forEach((param) => {
      const savedValue = this.props.model.paramValues.find(
        (pValue) => pValue.paramId === param.id
      );
      values.set(
        param.id,
        savedValue?.value || this.getDefaultValue(param.type)
      );
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
    const value = this.state.paramValues.get(param.id) || "";

    switch (param.type) {
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => this.handleChange(param.id, e.target.value)}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => this.handleChange(param.id, e.target.value)}
          >
            {param.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => this.handleChange(param.id, e.target.value)}
          />
        );
    }
  }

  render() {
    console.log("getModel: ", this.getModel());
    return (
      <div>
        {this.props.params.map((param) => (
          <div key={param.id}>
            <label>{param.name}</label>
            {this.renderInput(param)}
          </div>
        ))}
      </div>
    );
  }
}

export default ParamEditor;
