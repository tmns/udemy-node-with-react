import { FETCH_USER } from '../actions/types';

// by default, we dont know if our user is logged in or not,
// so we set default value of state to null
export default function(state = null, action) {
    // console.log(action)
    switch (action.type) {
        case FETCH_USER:
            return action.payload || false; // always returns null, the user model, or false
        default:
            return state;
    }
}