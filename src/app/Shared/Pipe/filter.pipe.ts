import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../Interfaces/product';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(productList: Product[], searchTerm: string): Product[] {
    if (!productList) return [];
    if (!searchTerm) return productList;
    return productList.filter((p) => {
      return p.title.toLowerCase().includes(searchTerm.toLowerCase());  
    });
  }
}
