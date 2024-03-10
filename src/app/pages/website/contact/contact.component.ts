import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface ContactRequests {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactUsControl!: FormGroup;
  isSubmitted: Boolean = false;
  isRejected: Boolean = false;
  submittedstr: string = "Your message has been delivered, expect a response within 2 business days";
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  // contactRequests$: Observable<ContactRequests[]>;

  constructor() {}

  ngOnInit(): void {
    this.contactUsControl = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required),
    });

    this.contactUsControl.valueChanges.subscribe((value) => {
      console.log('Form validity:', this.contactUsControl.valid);
    });
  }

  onSubmit() {
    if (this.contactUsControl.valid) {
      const formData = this.contactUsControl.value;
      const contactRequestsCollections = collection(
        this.firestore,
        'contactRequests'
      );
      addDoc(contactRequestsCollections, formData)
        .then(() => {
          console.log('Form submitted successfully!');
          this.contactUsControl.reset();
          this.isSubmitted = true;
          this.submittedstr = "Your message has been delivered, expect a response within 2 business days";


          setTimeout(() => {
            this.isSubmitted = false;
          }, 3000);
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
          this.isRejected = true;
          this.submittedstr = "The message was not delivered, please try again"
          setTimeout(() => {
            this.isRejected = false;
          }, 3000); // 15 секунд в миллисекундах
        });
    } else {
      console.log(
        'Form is invalid. Please fill all required fields correctly.'
      );
    }
  }
}
