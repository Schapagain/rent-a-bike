export class Order {
  constructor(order = null, type = "dinein") {
    this.order = order ? new Map(order) : new Map();
    this.bikeIds = this.createBikeIdArray(this.order);
    this.type = type ? type : "dinein";
    this.time = 1;
  }

  createBikeIdArray(order) {
    if (!order) return [];

    const bikeIds = Array.from(order.keys());
    return bikeIds
      .map((id) => {
        const quantity = order.get(id).quantity;
        return Array(quantity).fill(id);
      })
      .flat();
  }

  addBike(bike) {
    this.order.set(bike.id, {
      bike,
      quantity: this.order.has(bike.id)
        ? this.order.get(bike.id).quantity + 1
        : 1,
    });
    this.bikeIds.push(bike.id);
  }

  setTime(time) {
    this.time = time;
  }

  setType(type) {
    this.type = type;
  }

  removeBike(bikeId) {
    if (!this.order.has(bikeId)) return;
    if (this.order.get(bikeId).quantity === 1) {
      this.order.delete(bikeId);
      return;
    }
    this.order.set(bikeId, {
      ...this.order.get(bikeId),
      quantity: this.order.get(bikeId).quantity - 1,
    });
    this.bikeIds.splice(bikeId, 1);
  }

  getOrderDetails() {
    return this.order;
  }

  get orderTime() {
    return this.time;
  }

  get orderType() {
    return this.type;
  }

  get bikes() {
    return this.order;
  }

  get totalBikes() {
    return [...(this.order.values())].reduce((acc,val)=>val.quantity + acc, 0);
  }

  get totalPrice() {
    if (!this.order) return 0;

    let orderPrice = 0;
    this.order.forEach(({ bike, quantity }) => {
      orderPrice += bike.price * quantity;
    });
    return orderPrice.toFixed(2);
  }

  get jsonStringifiedOrder() {
    return JSON.stringify(Array.from(this.order.entries()));
  }
}
