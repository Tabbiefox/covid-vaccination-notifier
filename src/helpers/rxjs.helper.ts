import { ConnectableObservable, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { publishReplay } from 'rxjs/operators';

export function commit<T>(): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) => {
    const output$ = source$.pipe(publishReplay(1));

    (output$ as ConnectableObservable<T>).connect();

    return output$;
  }
}