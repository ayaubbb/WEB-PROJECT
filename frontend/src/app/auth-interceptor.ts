import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('token'); 

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        
        Authorization: `Bearer ${token}` 
      }
    });
    console.log('Интерцептор работает: токен добавлен');
    return next(clonedReq);
  }

  console.warn('Интерцептор: токен не найден в localStorage');
  return next(req);
};