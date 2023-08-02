import { createStore, applyMiddleware, combineReducers } from "redux";
import axios from "axios";

import logger from "redux-logger";
import thunk from "redux-thunk";

//action name constants
// const init = "init";
// const inc = "increment";
// const dec = "decrement";
// const incByAmt = "incrementByAmount";
// const incBonus = "incrementBonus";

// const init = "account/init";
const inc = "account/increment";
const dec = "account/decrement";
const incByAmt = "account/incrementByAmount";
const getAccUserPending = "account/getUser/pending";
const getAccUserFulfilled = "account/getUser/fulfilled";
const getAccUserRejected = "account/getUser/rejected";
const incBonus = "bonus/incrementBonus";

//store
// const store = createStore(
//   reducer,
//   applyMiddleware(logger.default, thunk.default)
// );

const store = createStore(
  combineReducers({
    account: accountReducer,
    bonus: bonusReducer,
  }),
  applyMiddleware(logger.default, thunk.default)
);

const history = [];

//reducer
// function reducer(state = { amount: 1 }, action) {
//   if (action.type === inc) {
//     // state.amount = state.amount + 1; // mutable This is wrong approach because it is changing original one
//     return { amount: state.amount + 1 }; //immutability
//   }
//   if (action.type === dec) {
//     return { amount: state.amount - 1 };
//   }

//   if (action.type === incByAmt) {
//     return { amount: state.amount + action.payload };
//   }

//   return state;
// }

//BETTER WAY FOR REDUCER IS BY USING SWITCH CASE
// function accountReducer(state = { amount: 1 }, action) {
//   switch (action.type) {
//     case init:
//       return { amount: action.payload };
//     case inc:
//       return { amount: state.amount + 1 };
//     case dec:
//       return { amount: state.amount - 1 };
//     case incByAmt:
//       return { amount: state.amount + action.payload };
//     default:
//       return state;
//   }
// }

function bonusReducer(state = { points: 1 }, action) {
  switch (action.type) {
    // case init:
    //   return { amount: action.payload };
    // case inc:
    //   return { points: state.points + 1 };
    // case dec:
    //   return { amount: state.amount - 1 };
    case incBonus:
      return { points: state.points + 1 };

    case incByAmt:
      if (action.payload >= 100) return { points: state.points + 1 };
    default:
      return state;
  }
}

function accountReducer(state = { amount: 1 }, action) {
  switch (action.type) {
    case getAccUserFulfilled:
      return { amount: action.payload, pending: false };
    case getAccUserRejected:
      return { ...state, error: action.error, pending: false };
    case getAccUserPending:
      return { ...state, pending: true };
    case inc:
      return { amount: state.amount + 1 };
    case dec:
      return { amount: state.amount - 1 };

    case incByAmt:
      return { amount: state.amount + action.payload };
    default:
      return state;
  }
}

//ASYNC API CALL
// async function getUser() {
//   const { data } = await axios.get("http://localhost:3000/accounts/1");
//   console.log(data);
// }

// getUser();

//globalState
// store.subscribe(() => {
//   history.push(store.getState());
//   console.log(history);
// });
// console.log(store.getState());

//ACTION CREATORS

// async function initUser() {
//   const { data } = await axios.get("http://localhost:3000/accounts/1"); //NOT A CORRECT WAY BEACUSE ACTION CREATORS AR ONLY MADE FOR PLAIN TEXT that's why middlewares are used
//   return { type: init, payload: data.amount }; //PLAIN TEXT LIKE THIS
// }

// async function getUser(dispatch, getState) {
//   const { data } = await axios.get("http://localhost:3000/accounts/1");
//   dispatch(initUser(data.amount));
// }

// function getUserAccount(id) {
//   return async (dispatch, getState) => {
//     const { data } = await axios.get(`http://localhost:3000/accounts/${id}`);
//     dispatch(initUser(data.amount));
//   };
// }

function getUserAccount(id) {
  return async (dispatch, getState) => {
    try {
      dispatch(getAccountUserPending());

      const { data } = await axios.get(`http://localhost:3000/accounts/${id}`);
      dispatch(getAccountUserFulfilled(data.amount));
    } catch (error) {
      dispatch(getAccountUserRejected(error.message));
    }
  };
}

function getAccountUserFulfilled(value) {
  return { type: getAccUserFulfilled, payload: value };
}

function getAccountUserRejected(error) {
  return { type: getAccUserRejected, error: error };
}

function getAccountUserPending(value) {
  return { type: getAccUserPending, payload: value };
}

function increment() {
  return { type: inc };
}

function decrement() {
  return { type: dec };
}

function incrementByAmount(value) {
  return { type: incByAmt, payload: value };
}

function incrementBonus(value) {
  return { type: incBonus };
}

// setInterval(() => {
//   // store.dispatch({ type: "incrementByAmount", payload: 4 }); //action
//   store.dispatch(incrementByAmount(4));
// }, 2000);

// setInterval(() => {
//   store.dispatch(initUser(500));
// }, 2000);

setTimeout(() => {
  store.dispatch(getUserAccount(2));
}, 2000);

// setTimeout(() => {
//   store.dispatch(incrementByAmount(200));
// }, 2000);

// setTimeout(() => {
//   store.dispatch(incrementBonus());
// }, 2000);

// store.dispatch({ type: "increment" }); //action

// console.log(store.getState());
