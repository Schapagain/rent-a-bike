import CartSingleBike from "./CartSingleBike";
export default function OrderInfo({
  bikes,
  addBikeToOrder,
  removeBikeFromOrder,
  total,
}) {
  return (
    <div className="w-full items-end flex flex-col h-4/5">
      <Items
        bikes={bikes}
        addBikeToOrder={addBikeToOrder}
        removeBikeFromOrder={removeBikeFromOrder}
      />
      <Seperator />
      <Total total={total} />
    </div>
  );
}

const Items = ({ bikes, addBikeToOrder, removeBikeFromOrder }) => (
  <div className="w-full h-3/4 overflow-y-auto flex flex-col">
    {bikes.map(({ bike, quantity }) => (
      <CartSingleBike
        key={bike.id}
        bike={bike}
        quantity={quantity}
        handleAddOne={addBikeToOrder}
        handleSubtractOne={removeBikeFromOrder}
      />
    ))}
  </div>
);

const Seperator = () => <div className="h-1 mr-2 my-5 w-1/2 bg-offwhite"></div>;
const Total = ({ total }) => <div className="mr-2">${total}</div>;
