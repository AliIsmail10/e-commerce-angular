import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService { 
  constructor(private _translate: TranslateService) {
   

    if(typeof window !== 'undefined' && localStorage.getItem('lang') !=='undefined') {
      this._translate.setDefaultLang("en");

      const lang=localStorage.getItem("lang");
      if(lang){
      this._translate.use(lang);
      }
      this.changeDir()
   
     }
   }

   
 
   changeDir() {
    if (localStorage.getItem("lang") === "en") {
      document.body.setAttribute("dir", "ltr");
      document.body.classList.remove("rtl");
      document.body.classList.add("ltr");
    } else if (localStorage.getItem("lang") === "ar") {
      document.body.setAttribute("dir", "rtl");
      document.body.classList.remove("ltr");
      document.body.classList.add("rtl");
    }
  }
  

      

   changeLanguage(lang:string){
    localStorage.setItem("lang",lang);
    this._translate.use(lang);
    this.changeDir()
    
    }

  }