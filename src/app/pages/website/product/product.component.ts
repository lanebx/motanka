import { Component, inject } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../app.component';
import { Observable, from, map, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  imports: [CommonModule, NotificationComponent],
})
export class ProductComponent {
  private activatedRoute = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  public id: string = this.activatedRoute.snapshot.params['id'];
  
  public product$: Observable<Product>;
  similarProducts$: Observable<Product[]>;
  isInFavorite: boolean = this.isInFavorites();
  isSubmitted: boolean = false;
  submittedstr: string = 'Added to wishlist';

  constructor() {
    const productRef = doc(this.firestore, 'products', this.id);
    this.product$ = docData(productRef) as Observable<Product>;

    const productCollection = collection(this.firestore, 'products');
    this.similarProducts$ = collectionData(productCollection, {
      idField: 'id',
    }).pipe(
      map((products: any[]) =>
        products
          .filter(
            (product) => product['type'] === 'doll' && product['id'] !== this.id
          )
          .slice(0, 3)
      ),
      take(1) // Ограничиваем поток только первыми тремя продуктами
    );
  }

  toggleFavorite() {
    this.isInFavorite = !this.isInFavorite;

    if (this.isInFavorite) {
      this.addToFavorites();
    } else {
      this.removeFromFavorites();
    }
    this.isSubmitted = true;
    setTimeout(() => {
      this.isSubmitted = false;
    }, 3000);
  }

  addToFavorites() {
    localStorage.setItem(this.id, 'true');
    this.submittedstr = 'Added to wishlist';
  }

  removeFromFavorites() {
    localStorage.removeItem(this.id);
    this.submittedstr = 'Removed from wishlist';
  }

  isInFavorites(): boolean {
    return localStorage.getItem(this.id) === 'true';
  }
}
