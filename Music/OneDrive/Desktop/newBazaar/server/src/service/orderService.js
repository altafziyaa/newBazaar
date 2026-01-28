// service/orderService.js
import Order from "../model/Order.js";
import OrderItem from "../model/OrderItem.js";
import AppError from "../utils/AppError.js";
import OrderStatus from "../domain/OrderStatus.js";
import { PaymentStatus } from "../domain/paymentStatus.js";



class OrderService {

 async createOrder(userId, seller, shippingAddress, items = []) {
    if (!items.length) throw new AppError("Order items are required", 400);

    let totalMrp = 0;
    let totalSell = 0;

    const orderItemPayload = items.map((item) => {
      if (!item.productId) throw new AppError("Product ID missing", 400);
      if (!item.quantity || item.quantity <= 0)
        throw new AppError("Invalid quantity", 400);

      totalMrp += item.mrpPrice * item.quantity;
      totalSell += item.sellingPrice * item.quantity;

      return {
        product: item.productId,
        quantity: item.quantity,
        mrpPrice: item.mrpPrice,
        sellingPrice: item.sellingPrice,
      };
    });

    const createdItems = await OrderItem.insertMany(orderItemPayload);
    const itemIds = createdItems.map((i) => i._id);

    const totalDiscount = totalMrp - totalSell;
    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

    return Order.create({
      userId,
      seller,
      orderItems: itemIds,
      shippingAddress,
      totalMrpPrice: totalMrp,
      totalSellingPrice: totalSell,
      totalDiscount,
      totalItems,
      orderStatus: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    });
  }

  async getUserOrders(userId) {
    return Order.find({ userId })
      .populate("orderItems")
      .populate("seller", "name email")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });
  }

  async getOrderById(orderId) {
    const order = await Order.findById(orderId)
      .populate("orderItems")
      .populate("seller", "name email")
      .populate("shippingAddress");

    if (!order) throw new AppError("Order not found", 404);
    return order;
  }

  async updateOrderStatus(orderId, status) {
    // validate status exists in OrderStatus or allow string if you have set
    if (!Object.values(OrderStatus).includes(status)) {
      throw new AppError("Invalid order status", 400);
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!updated) throw new AppError("Order not found", 404);
    return updated;
  }

  async deleteOrder(orderId, userId) {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    // only owner can delete and only if not processed/placed (business rule)
    if (order.userId.toString() !== userId.toString()) {
      throw new AppError("Unauthorized", 403);
    }

    if (![OrderStatus.PENDING, OrderStatus.CANCELLED].includes(order.orderStatus)) {
      throw new AppError("Order cannot be deleted at this stage", 400);
    }

    await order.deleteOne();
    return { message: "Order deleted successfully" };
  }

  async getUserHistory(userId) {
    return Order.find({ userId })
      .populate("orderItems")
      .populate("seller", "name email")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });
  }

  async cancelOrder(orderId, userId) {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) throw new AppError("Order not found", 404);

    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new AppError("Order already cancelled", 400);
    }

    if (![OrderStatus.PENDING, OrderStatus.PROCESSING].includes(order.orderStatus)) {
      throw new AppError("Order cannot be cancelled now", 400);
    }

    order.orderStatus = OrderStatus.CANCELLED;
    await order.save();
    return order;
  }

  async getCancelledOrders(userId) {
    return Order.find({ userId, orderStatus: OrderStatus.CANCELLED })
      .populate("orderItems")
      .populate("seller", "name email")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });
  }

  async getSellerOrders(sellerId) {
    return Order.find({ seller: sellerId })
      .populate("orderItems")
      .populate("userId", "name email")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });
  }
}

export default OrderService;
