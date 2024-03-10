import { Component, Input } from '@angular/core';
import { Product } from '../../app.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";

@Component({
    selector: 'app-card',
    standalone: true,
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    imports: [CommonModule, RouterModule, LoaderComponent]
})
export class CardComponent {
  @Input() product?: Product;
  
  isLoaded: boolean = false;

  constructor() {
    console.log("CardComponent here ", this.product?.id);
  }

}
