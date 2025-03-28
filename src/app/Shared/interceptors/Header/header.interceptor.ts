import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined' && localStorage.getItem('userToken')!==null) {
    req = req.clone({
      setHeaders: { 'token': localStorage.getItem('userToken')! }
    });
  }

  return next(req);
};
