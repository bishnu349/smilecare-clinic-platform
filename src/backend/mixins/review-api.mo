import Types "../types";
import ReviewLib "../lib/Review";
import List "mo:core/List";

mixin (reviews : List.List<Types.Review>) {
  public query func getReviews() : async [Types.Review] {
    ReviewLib.getAll(reviews)
  };

  public func addReview(review : Types.Review) : async Text {
    ReviewLib.add(reviews, review)
  };
};
