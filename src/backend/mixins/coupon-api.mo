import Types "../types";
import CouponLib "../lib/Coupon";
import List "mo:core/List";

mixin (coupons : List.List<Types.Coupon>) {
  public query func getCoupons() : async [Types.Coupon] {
    CouponLib.getAll(coupons)
  };

  public query func validateCoupon(code : Text) : async ?Types.Coupon {
    CouponLib.validate(coupons, code)
  };

  public func createCoupon(coupon : Types.Coupon) : async Text {
    CouponLib.add(coupons, coupon)
  };

  public func updateCoupon(coupon : Types.Coupon) : async Bool {
    CouponLib.update(coupons, coupon)
  };
};
