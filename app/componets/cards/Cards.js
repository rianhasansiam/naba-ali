import CardsClient from './CardsClient';

// Server component wrapper that passes data to client component
const Cards = ({ products }) => {
  return <CardsClient products={products} />;
};

export default Cards;
