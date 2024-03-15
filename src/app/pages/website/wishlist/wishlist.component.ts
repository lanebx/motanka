import { Component, inject, OnInit } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  getDoc,
  DocumentSnapshot,
  docData,
  DocumentData,
} from '@angular/fire/firestore';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../../app.component';
import { BehaviorSubject, Observable, from, map, of, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
// export class WishlistComponent {
//   private activatedRoute = inject(ActivatedRoute);
//   private firestore = inject(Firestore);

//   private localProducts: Product[] = [];
//   products$?: Observable<Product[]>;
//   filteredProducts$?: Observable<Product[]>;
//   isLoading: boolean = true;
//   submittedstr = 'Removed from wishlist';
//   wishlistProducts?: Product[];

//   constructor() {
//     this.loadProductsFromFirestore();

//     this.products$?.subscribe((products: Product[]) => {
//       console.log('продукты получены и вложены в localProducts');
//       this.localProducts = products; // Сохраняем полученные продукты в локальное хранилище

//       const keys = this.getAllKeysFromLocalStorage();
//       console.log('localProducts', this.localProducts);

//       let wishlistProducts = keys.map((key: string) =>
//         this.localProducts.find((product: Product) => product.id === key)
//       ) as Product[];

//       this.isLoading = false;

//       this.filteredProducts$ = of(wishlistProducts);

//       console.log('wishlistProducts', wishlistProducts);
//     });
//   }

//   loadProductsFromFirestore() {
//     const productCollection = collection(this.firestore, 'products');
//     console.log('запрос к БД');

//     this.products$ = collectionData(productCollection, {
//       idField: 'id',
//     }) as Observable<Product[]>;
//   }

//   removeFromFavorites(id: string) {
//     localStorage.removeItem(id);

//     if (this.wishlistProducts) {
//       this.wishlistProducts = this.wishlistProducts.filter(
//         (product) => product.id !== id
//       );
//       this.filteredProducts$ = of(this.wishlistProducts);
//     }
//   }

//   getAllKeysFromLocalStorage(): string[] {
//     const keys: string[] = [];

//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       if (key) {
//         keys.push(key); // Добавляем ключ в массив
//       }
//     }

//     console.log('getAllKeysFromLocalStorage :', keys);
//     return keys; // Возвращаем массив названий ключей из localStorage
//   }
// }
export class WishlistComponent {
  private activatedRoute = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  private localProducts: Product[] = [];
  private wishlistProductsSubject = new BehaviorSubject<Product[]>([]);
  filteredProducts$ = this.wishlistProductsSubject.asObservable();
  isLoading: boolean = true;
  submittedstr = 'Removed from wishlist';

  constructor() {
    this.loadProductsFromFirestore();

    this.filteredProducts$.subscribe((wishlistProducts: Product[]) => {
      console.log('Wishlist products updated:', wishlistProducts);
      this.isLoading = false;
    });
  }

  loadProductsFromFirestore() {
    const productCollection = collection(this.firestore, 'products');
    console.log('Querying database for products');

    const products$ = collectionData(productCollection, {
      idField: 'id',
    }) as Observable<Product[]>;

    products$.subscribe((products: Product[]) => {
      console.log('Products received and stored locally:', products);
      this.localProducts = products;
      const keys = this.getAllKeysFromLocalStorage();
      const wishlistProducts = keys.map((key: string) =>
        this.localProducts.find((product: Product) => product.id === key)
      ) as Product[];

      this.wishlistProductsSubject.next(wishlistProducts);
    });
  }

  removeFromFavorites(id: string) {
    localStorage.removeItem(id);

    const currentWishlistProducts = this.wishlistProductsSubject.getValue();
    const updatedWishlistProducts = currentWishlistProducts.filter(
      (product: Product) => product.id !== id
    );

    this.wishlistProductsSubject.next(updatedWishlistProducts);
  }

  getAllKeysFromLocalStorage(): string[] {
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }

    console.log('Keys retrieved from localStorage:', keys);
    return keys;
  }
}
