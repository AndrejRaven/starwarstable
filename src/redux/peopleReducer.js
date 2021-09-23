/* eslint-disable no-await-in-loop */
import Axios from 'axios';
import api from '../settings';

/* selectors */
export const getAllPeople = ({ people }) => people.data;
export const getPeopleLoadingState = ({ people }) => people.loading;

/* action name creator */
const reducerName = 'people';
const createActionName = (name) => `app/${reducerName}/${name}`;

/* action types */
const FETCH_ALL_START = createActionName('FETCH_ALL_START');
const FETCH_ALL_SUCCESS = createActionName('FETCH_ALL_SUCCESS');
const FETCH_ALL_ERROR = createActionName('FETCH_ALL_ERROR');
/* action creators */
export const fetchPeopleStarted = (payload) => ({
  payload,
  type: FETCH_ALL_START
});
export const fetchPeopleSuccess = (payload) => ({
  payload,
  type: FETCH_ALL_SUCCESS
});
export const fetchPeopleError = (payload) => ({
  payload,
  type: FETCH_ALL_ERROR
});

/* thunk creators */
export const fetchPeopleFromAPI = () => {
  return (dispatch, getState) => {
    if (getState().people.data.length === 0) {
      dispatch(fetchPeopleStarted());

      Axios.get(`${api.url}/${api.people}`)
        .then(() => {
          (async () => {
            let nextPage = `${api.url}/${api.people}`;

            let people = [];

            while (nextPage) {
              const result = await Axios.get(nextPage);

              const { next, results } = await result.data;

              nextPage = next;

              people = [...people, ...results];
            }
            dispatch(fetchPeopleSuccess(people));
          })();
        })
        .catch((err) => {
          dispatch(fetchPeopleError(err.message || true));
        });
    }
  };
};

/* reducer */
export default function reducer(statePart = [], action = {}) {
  switch (action.type) {
    case FETCH_ALL_START: {
      return {
        ...statePart,
        loading: {
          active: true,
          error: false
        }
      };
    }
    case FETCH_ALL_SUCCESS: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: false
        },
        data: action.payload
      };
    }
    case FETCH_ALL_ERROR: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload
        }
      };
    }
    default:
      return statePart;
  }
}
