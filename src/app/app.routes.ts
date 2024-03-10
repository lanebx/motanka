import { Routes } from '@angular/router';
import { HomeComponent } from './pages/website/home/home.component';
import { AboutComponent } from './pages/website/about/about.component';
import { ShopComponent } from './pages/website/shop/shop.component';
import { BlogComponent } from './pages/website/blog/blog.component';
import { ContactComponent } from './pages/website/contact/contact.component';
import { ProductComponent } from './pages/website/product/product.component';
import { WishlistComponent } from './pages/website/wishlist/wishlist.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'about',
    component: AboutComponent,
  },

  {
    path: 'shop',
    component: ShopComponent,
  },

  {
    path: 'blog',
    component: BlogComponent,
  },

  {
    path: 'contact-us',
    component: ContactComponent,
  },

  {
    path: 'wishlist',
    component: WishlistComponent,
  },

  {
    path: 'product/:id',
    component: ProductComponent,
  },
];
