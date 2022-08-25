import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer, Payment } from 'src/app/models';
import { CustomerService, PaymentService } from 'src/app/services';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnInit {
  private id: string;
  customer: Customer = {
    id: '',
    userName: '',
    normalizedUserName: '',
    email: '',
    normalizedEmail: '',
    emailConfirmed: false,
    passwordHash: '',
    securityStamp: '',
    concurrencyStamp: '',
    phoneNumber: '',
    phoneNumberConfirmed: false,
    twoFactorEnabled: false,
    lockoutEnd: new Date(),
    lockoutEnabled: false,
    accessFailedCount: 0,
    imagePath: '',
    gender: false,
    address: '',
    fullName: '',
  };

  payments: Payment[] = [];

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.customerService.getCustomerById(this.id).subscribe((data) => {
      this.customer.imagePath = data.imagePath;
      this.customer.address = data.address;
      this.customer.email = data.email;
      this.customer.userName = data.userName;
      this.customer.fullName = data.fullName;
      this.customer.phoneNumber = data.phoneNumber;
      this.customer.lockoutEnabled = data.lockoutEnabled;
      this.customer.emailConfirmed = data.emailConfirmed;
      this.customer.gender = data.gender;
    });

    this.paymentService.getPaymentsByCustomerId(this.id).subscribe((result) => {
      this.payments = result.data;
    });
  }
}
