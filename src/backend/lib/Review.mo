import Types "../types";
import List "mo:core/List";

module {
  public func getAll(reviews : List.List<Types.Review>) : [Types.Review] {
    reviews.toArray()
  };

  public func add(reviews : List.List<Types.Review>, review : Types.Review) : Text {
    reviews.add(review);
    review.id
  };
};
