import { LOCATION_CHANGE, LocationChangeAction } from "connected-react-router";
import { ActionsObservable } from "redux-observable";
import { Action } from "typescript-fsa";
import { initialized } from "utils/Apps";
import {Observable} from "rxjs/Observable";

export function locationChangeOf(observable: ActionsObservable<Action<string>>, pattern: RegExp): Observable<LocationChangeAction> {
  const locationChangeAction: Observable<any> = observable.ofType(LOCATION_CHANGE);
  return locationChangeAction.filter(action => pattern.test(action.payload.location.pathname) && initialized());
}
