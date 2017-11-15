import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from './store';
import {getReducer} from './model';
import {EffectsModule,Actions, Effect} from './effect';
import {storeFreeze} from 'ngrx-store-freeze';
import {storeLogger} from 'ngrx-store-logger';
import {Params, RouterStateSnapshot} from '@angular/router';

import {
  StoreRouterConnectingModule,
  routerReducer,
  RouterReducerState,
  RouterStateSerializer
} from '@ngrx/router-store';

//store & effect
export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return storeLogger()(reducer);
}

export const states = [];
export const reducers = {};
export const effects = [];
export const KEYS = ['routerReducer'];

export const metaReducers: MetaReducer<any>[] = [storeFreeze, logger];

export function AddCore(core) {
  if (core.KEY) {
    KEYS.push(core.KEY);
  }
  if (core.reducers && core.initialState) {
    states[core.KEY] = core.initialState;
    reducers[core.KEY] = getReducer(core.reducers, core.initialState);;
  }
  if (core.Effects) {
    effects.push(core.Effects);
  }
}

//router
export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

export interface State {
  routerReducer: RouterReducerState<RouterStateUrl>;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const {url} = routerState;
    const queryParams = routerState.root.queryParams;

    return {url, queryParams};
  }
}

reducers[KEYS[0]] = routerReducer; //Push routerReducer in first KEYS

export const routerProvide = {provide: RouterStateSerializer, useClass: CustomSerializer};
