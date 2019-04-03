const PHONE_PRICE = 99.99;
const MYMONEY = 303.91;
const TAX_RATE = 0.08;
const ACCESSORY_PRICE = 9.99;
const heartPrice = 200;

var totalPrice = 0;
while (totalPrice < MYMONEY) {
  totalPrice += PHONE_PRICE;
  if (totalPrice < heartPrice) {
    totalPrice += ACCESSORY_PRICE;
  }
}
totalPrice = totalPrice * (1 + TAX_RATE);
console.log("购买的总价：", "$", totalPrice.toFixed(2));
if (totalPrice > MYMONEY) {
  console.log("you canot buy it");
}
