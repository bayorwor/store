import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [
      {
        product: 'https://via.placeholder.com/150',
        name: 'Snickers',
        price: 200,
        quantity: 8,
        id: 1,
      },
      {
        product: 'https://via.placeholder.com/150',
        name: 'Noodles',
        price: 100,
        quantity: 5,
        id: 2,
      },
    ],
  };

  dataSource: Array<CartItem> = [];

  displayColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQnty(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onReduceQnty(item: CartItem): void {
    this.cartService.reduceQnty(item);
  }

  onCheckout(): void {
    this.http
      .post('http://localhost:4242/checkout', {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          'pk_test_51Lti9KILqnvI8agCZJUIMswSJ6xUHhIYrTXhBmx6r5TcHgICqLpJ0Vj5SCPbCy3lPFfLLVqjOkckE8Pgu1raxmEB00FpVMSuuh'
        );

        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
