import { ActionsObservable } from 'redux-observable';
import { Action, ActionCreator, isType } from 'typescript-fsa';
import * as Redux from 'redux';
import 'rxjs/add/operator/filter';

// https://www.npmjs.com/package/typescript-fsa-redux-observable
declare module 'redux-observable' {

  interface ActionsObservable<T extends Redux.Action> {
    ofAction<T, P>(action: ActionCreator<P>): ActionsObservable<Action<P>>;
  }
}

ActionsObservable.prototype.ofAction =
  function <P>(this: ActionsObservable<Action<P>>, actionCreator: ActionCreator<P>): ActionsObservable<Action<P>> {
    return this.filter(action => (isType(action, actionCreator))) as ActionsObservable<Action<P>>;
  };
