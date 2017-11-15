import {OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import * as Rx from 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import {Store} from './store';
import {KEYS, states} from './index';

import _ from 'lodash';

export const getReducer = (reducers, state) => {
  return handleActions(reducers || {}, state);
}

function identify(value) {
  return value;
}

function handleAction(actionType, reducer: any = identify): any {
  return (state, action) => {
    const {type} = action;
    if (type && actionType !== type) {
      return state;
    }
    return reducer(state, action);
  };
}

function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce(
      (p, r) => r(p, current),
      previous,
    );
}

function handleActions(handlers, defaultState) {
  const reducers = Object.keys(handlers).map(type => handleAction(type, handlers[type]));
  const reducer = reduceReducers(...reducers);
  return (state = defaultState, action) => reducer(state, action);
}

export class connect implements OnDestroy {
  serviceStateSubscription: Subscription;
  service$: Observable<any>;

  state: any;
  nextState: any;

  store: Store<any>;

  // checkKEY: Array<string> = [];

  constructor(store) {
    this.store = store;
    const objState = {};
    const selects = KEYS.map(key => store.select(key))
    this.service$ = Rx.Observable.combineLatest(...selects);

    this.serviceStateSubscription = this.service$
      .subscribe(state => {
        KEYS.forEach((key, index) => {
          objState[key] = state[index];
        });

        this.nextState = this.mapState(objState);
        this.willReceiveState(this.state ? this.state : this.mapState(states), this.nextState);
        this.state = this.nextState;
      }, error => console.error(error));
  }

  mapState(state) {
    return state;
  };

  willReceiveState(state, nextState) {
  }

  ngOnDestroy() {
    this.serviceStateSubscription.unsubscribe();
  }
}
