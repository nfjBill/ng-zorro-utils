import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from './store';
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

export const reducer = {};
export const effect = [];

export const metaReducers: MetaReducer<any>[] = [storeFreeze, logger];

export function AddCore(core) {
  if (core.reducer) {
    reducer[core.KEY] = core.reducer;
  }
  if (core.Effects) {
    effect.push(core.Effects);
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

reducer['routerReducer'] = routerReducer;

export const routerProvide = {provide: RouterStateSerializer, useClass: CustomSerializer};
