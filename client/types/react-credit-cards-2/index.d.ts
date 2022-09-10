declare module 'react-credit-cards-2' {
  import { Component } from 'react';

  export interface ReactCreditCardProps {
	cvc: string;
	expiry: string;
	focused: string;
	name: string;
	number: string;
	preview: boolean;
  }

  export default class ReactCreditCard extends Component<ReactCreditCardProps> {}
}