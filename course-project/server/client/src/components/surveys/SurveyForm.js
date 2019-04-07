// SurveyForm shows a form for the user to add input
import React, { Component } from 'react';
// reduxForm is helper that allows ReduxForm to communicate with our Redux Store
// Field is a component that can be used to show any type of html field element
import { reduxForm, Field } from 'redux-form'; 
import { Link } from 'react-router-dom';
import _ from 'lodash';
import validateEmails from '../../utils/validateEmails';

import SurveyField from './SurveyField';
import formFields from './formFields';

class SurveyForm extends Component {

    renderFields() {
        return _.map(formFields, ({ label, name }) => {
            return <Field 
                        key={name}
                        component={SurveyField} 
                        type="text"
                        label={label}
                        name={name} 
                    />    
        });
    };
    
    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields()}
                    <Link to="/surveys" className="red btn-flat white-text">
                        <i className="material-icons left">arrow_back</i>
                        Cancel
                    </Link>
                    <button type="submit" className="teal btn-flat right white-text">
                        Next
                        <i className="material-icons right">arrow_forward</i>
                    </button>
                </form>
            </div>
        );
    };
}

function validate(values) {
    const errors = {};

    errors.recipients = validateEmails(values.recipients || '');

    _.each(formFields,  ({ name }) => {
        if (!values[name]) {
            errors[name] = `Sorry, ${name} required to continue.`;
        }
    })

    return errors;
}

export default reduxForm({
    validate,
    form: 'surveyForm',
    destroyOnUnmount: false // so our values are dumped when we proceed to form review 
})(SurveyForm);