import Types "../types";
import List "mo:core/List";

module {
  public func getAll(coupons : List.List<Types.Coupon>) : [Types.Coupon] {
    coupons.toArray()
  };

  public func validate(coupons : List.List<Types.Coupon>, code : Text) : ?Types.Coupon {
    coupons.find(func(c) {
      c.code == code and c.isActive and c.usedCount < c.maxUses
    })
  };

  public func add(coupons : List.List<Types.Coupon>, coupon : Types.Coupon) : Text {
    coupons.add(coupon);
    coupon.id
  };

  public func update(coupons : List.List<Types.Coupon>, coupon : Types.Coupon) : Bool {
    let idx = coupons.findIndex(func(c) { c.id == coupon.id });
    switch (idx) {
      case (?i) { coupons.put(i, coupon); true };
      case null { false };
    };
  };

  public func incrementUsage(coupons : List.List<Types.Coupon>, code : Text) {
    let idx = coupons.findIndex(func(c) { c.code == code });
    switch (idx) {
      case (?i) {
        let existing = coupons.at(i);
        coupons.put(i, { existing with usedCount = existing.usedCount + 1 });
      };
      case null {};
    };
  };
};
