import { Card } from './components/View/Card';
import './scss/styles.scss';
import { cloneTemplate } from './utils/utils';

const gallery = document.querySelector('.gallery');
const cardPreview = new Card(cloneTemplate('#card-basket'));

const obj1 = {
  title: 'Smartphone',
  image: 'https://example.com/smartphone.jpg',
  price: 699,
  description: 'Latest model with advanced features.',
  id: '1'
}

gallery.append(cardPreview.render(obj1));