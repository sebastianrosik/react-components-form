import React, { PropTypes } from 'react';

export class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            schema: props.schema || {},
            model: props.model || this.getDefaultModelValue(props.schema),
            errors: {},
            validateOnChange: props.validateOnChange
        };

        this.setModel = this.setModel.bind(this);
        this.getModel = this.getModel.bind(this);
        this.getSchema = this.getSchema.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.getErrors = this.getErrors.bind(this);
        this.validateModel = this.validateModel.bind(this);
    }

    getDefaultModelValue(schema) {
        if (typeof schema.getDefaultValues === 'function') return schema.getDefaultValues();
        return {};
    }

    setModel(name, value) {
        const model = Object.assign({}, this.state.model);
        model[name] = value;
        this.setState({ model });
        if (this.state.validateOnChange) this.validateModel(model);
    }

    getModel(name) {
        return this.state.model[name];
    }

    getSchema(name) {
        if(typeof this.state.schema.getField !== 'function') return {};
        return this.state.schema.getField(name);
    }

    getErrors(name) {
        return this.state.errors[name] || {};
    }

    validateModel(model) {
        const { schema } = this.state;
        const { customValidation } = this.props;
        let errors = {};
        if (typeof schema.validate === 'function') errors = schema.validate(model);
        if (typeof customValidation === 'function') errors = customValidation(model);
        this.setState({ errors });
        return errors;
    }

    submitForm() {
        const model = Object.assign({}, this.state.model);
        const errors = this.validateModel(model);

        if (Object.keys(errors).length > 0) {
            if (this.props.onError) this.props.onError(errors, model);
            return;
        }
        if (this.props.onSubmit) this.props.onSubmit(model);
    }

    getChildContext() {
        return {
            setModel: this.setModel,
            getModel: this.getModel,
            getSchema: this.getSchema,
            submitForm: this.submitForm,
            getErrors: this.getErrors
        }
    }

    render() {
        const { children, className } = this.props;
        return (
            <div className={className}>
                {children}
            </div>
        );
    }
}

Form.childContextTypes = {
    setModel: PropTypes.func,
    getModel: PropTypes.func,
    getSchema: PropTypes.func,
    submitForm: PropTypes.func,
    getErrors: PropTypes.func
};

Form.propTypes = {
    model: PropTypes.shape({}),
    schema: PropTypes.shape({}),
    onError: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    validateOnChange: PropTypes.bool,
    customValidation: PropTypes.func
};

export default Form;
