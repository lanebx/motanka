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
  Subject,
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
  isTypeDropdownHidden: boolean = true;
  isPriceDropdownHidden: boolean = true;
  isEmpty: boolean = false;

  selectedType$: BehaviorSubject<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined);

  sortDirection$: BehaviorSubject<'ascending' | 'descending'> =
    new BehaviorSubject<'ascending' | 'descending'>('ascending');

  selectedAll$ = new BehaviorSubject<boolean>(false);

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
      this.selectedAll$,
    ]).pipe(
      map(([selectedType, sortDirection, searchQuery, selectedAll]) => {
        let filteredProducts = this.localProducts;

        if (selectedAll) {
          this.selectedAll$.next(false);
          return filteredProducts;
        }

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
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name &&
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        this.isEmpty = filteredProducts.length === 0;

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
    this.isTypeDropdownHidden = !this.isTypeDropdownHidden;
    this.isPriceDropdownHidden = true;
  }

  togglePriceDropdown() {
    this.isPriceDropdownHidden = !this.isPriceDropdownHidden;
    this.isTypeDropdownHidden = true;
  }

  setType(type: string) {
    this.isTypeDropdownHidden = false;
    this.selectedType$.next(type);
  }

  setPrice(direction: 'ascending' | 'descending') {
    this.isPriceDropdownHidden = false;
    this.sortDirection$.next(direction);
  }

  clearFilter() {
    console.log('Clear filter function called');
    this.selectedAll$.next(true);
    this.selectedType$.next(undefined); // Сброс типа до значения по умолчанию
    this.sortDirection$.next('ascending'); // Сброс направления сортировки до значения по умолчанию
    this.searchQuery$.next(undefined);
    this.isEmpty = false;
    this.isTypeDropdownHidden = true;
    this.isPriceDropdownHidden = true;

    console.log('selectedAll$ value:', this.selectedAll$.value);
  }

  handleSearchInput(event: Event) {
    let target = event.target as HTMLInputElement;
    this.searchQuery$.next(target.value);
    this.isTypeDropdownHidden = true;
    this.isPriceDropdownHidden = true;
  }
}
