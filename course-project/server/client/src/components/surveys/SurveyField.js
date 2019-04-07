// SurveyField contains logic to render a single label and text input
import React from 'react';

export default ({ input, label, meta: { error, touched } }) => { // destructuring used here to pull out individual props
    return (
        <div>
            <label>{label}</label>
            <input {...input} style={{ marginBottom: '0.3rem' }}/>
            <div className="red-text" style={{ marginBottom: '1.25rem'}}>
                {touched && error}
            </div>
        </div>
    );
};  