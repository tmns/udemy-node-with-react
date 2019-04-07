import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form'; // renamed to reduxForm to simply avoid confusion
import authReducer from './authReducer';

export default combineReducers({
    auth: authReducer,
    form: reduxForm
});