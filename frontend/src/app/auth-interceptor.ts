import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); 

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        
        Authorization: `Bearer ${token}` 
      }
    });
    console.log('Interceptor working, token added to request');
    return next(clonedReq);
  }

  console.warn('Interceptor: token not found in localStorage');
  return next(req);
};


