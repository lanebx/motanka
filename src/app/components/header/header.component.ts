import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
  // решилось с помощью препроцесора, но если на ts - то так 
  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   this.isMenuOpen = window.innerWidth < 900;
  // }

}
