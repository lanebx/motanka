import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
} from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { getDocs } from 'firebase/firestore';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  switchMap,
} from 'rxjs';
import { Product } from '../../../app.component';
import { CardComponent } from '../../../components/card/card.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  imports: [CommonModule, RouterModule, CardComponent],
})
export class ShopComponent {
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  private localProducts: Product[] = [];
  products$?: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  isLoading: boolean = true;
  isTypeDropdownOpen: boolean = true;
  isPriceDropdownOpen: boolean = true;

  selectedType$: BehaviorSubject<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined);

  sortDirection$: BehaviorSubject<'ascending' | 'descending'> =
    new BehaviorSubject<'ascending' | 'descending'>('ascending');

  searchQuery$: BehaviorSubject<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined);

  constructor() {
    this.loadProductsFromFirestore();
    // get a reference to the user-profile collection
    this.filteredProducts$ = combineLatest([
      this.selectedType$,
      this.sortDirection$,
      this.searchQuery$,
    ]).pipe(
      map(([selectedType, sortDirection, searchQuery]) => {
        let filteredProducts = this.localProducts;

        if (selectedType) {
          filteredProducts = filteredProducts.filter(
            (product) => product.type === selectedType
          );
        }

        if (sortDirection === 'ascending') {
          filteredProducts.sort((a, b) => a.price - b.price);
        } else {
          filteredProducts.sort((a, b) => b.price - a.price);
        }

        if (searchQuery) {
          filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        return filteredProducts;
      })
    );
  }

  loadProductsFromFirestore() {
    const productCollection = collection(this.firestore, 'products');
    console.log('запрос к БД');

    this.products$ = collectionData(productCollection, {
      idField: 'id',
    }) as Observable<Product[]>;

    this.products$.subscribe((products: Product[]) => {
      console.log('продукты получены и вложены в localProducts');
      this.localProducts = products; // Сохраняем полученные продукты в локальное хранилище
      this.isLoading = false;
    });
  }

  toggleTypeDropdown() {
    this.isTypeDropdownOpen = !this.isTypeDropdownOpen;
  }

  togglePriceDropdown() {
    this.isPriceDropdownOpen = !this.isPriceDropdownOpen;
  }

  setType(type: string) {
    this.isTypeDropdownOpen = false; // Устанавливаем isTypeDropdownOpen в false для закрытия выпадающего списка
    this.selectedType$.next(type); // Устанавливаем выбранный элемент
  }

  setPrice(direction: 'ascending' | 'descending') {
    this.isPriceDropdownOpen = false; // Устанавливаем isTypeDropdownOpen в false для закрытия выпадающего списка
    this.sortDirection$.next(direction);
  }

  handleSearchInput(event: Event) {
    let target = event.target as HTMLInputElement;
    this.searchQuery$.next(target.value);
  }
}
