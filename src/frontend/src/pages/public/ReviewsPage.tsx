import { Link } from "@tanstack/react-router";
import { ChevronRight, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useReviews } from "../../hooks/useQueries";
import type { Review } from "../../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  const cls = size === "lg" ? "w-6 h-6" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${s <= rating ? "fill-accent text-accent" : "text-muted-foreground/30 fill-muted/30"}`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const total = reviews.length;
  const avg =
    total > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / total
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Number(r.rating) === star).length,
    pct:
      total > 0
        ? Math.round(
            (reviews.filter((r) => Number(r.rating) === star).length / total) *
              100,
          )
        : 0,
  }));

  return (
    <Card
      className="shadow-elevated border-border max-w-2xl mx-auto"
      data-ocid="reviews.rating_summary"
    >
      <CardContent className="p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Big avg score */}
          <div className="text-center shrink-0">
            <p className="text-7xl font-display font-black text-primary leading-none">
              {avg.toFixed(1)}
            </p>
            <StarRating rating={Math.round(avg)} size="lg" />
            <p className="mt-2 text-sm text-muted-foreground">
              {total} {total === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 w-full space-y-2">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground w-6 text-right shrink-0">
                  {star}
                </span>
                <Star className="w-3.5 h-3.5 text-accent fill-accent shrink-0" />
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 shrink-0">
                  {count} ({pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: Review;
  index: number;
}) {
  return (
    <Card
      className="card-lift border-border bg-card h-full"
      data-ocid={`reviews.review.item.${index + 1}`}
    >
      <CardContent className="p-6 flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-md">
              <span className="text-sm font-bold text-primary-foreground">
                {getInitials(review.patientName)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground leading-tight">
                {review.patientName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(review.date)}
              </p>
            </div>
          </div>
          <StarRating rating={Number(review.rating)} />
        </div>

        {/* Comment */}
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">
          "{review.comment}"
        </p>

        {/* Badge if available */}
        {review.clinicId && (
          <div>
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-primary/8 text-primary border-primary/20"
            >
              SmileCare Clinic
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Fallback seed reviews for first-load richness ────────────────────────────

const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    clinicId: "clinic1",
    patientId: "p1",
    patientName: "Srabanti Mukherjee",
    rating: BigInt(5),
    comment:
      "Dr. Priya Sen was incredibly thorough and kind. The clinic is spotless, and the staff were welcoming from the moment I walked in. Highly recommended for anyone in Kolkata!",
    date: "2026-03-12",
  },
  {
    id: "r2",
    clinicId: "clinic1",
    patientId: "p2",
    patientName: "Rajesh Kumar",
    rating: BigInt(5),
    comment:
      "Best dental experience I've had. Dr. Rahul Sharma explained everything clearly and the treatment was painless. The queue system is smart — no long waits!",
    date: "2026-02-28",
  },
  {
    id: "r3",
    clinicId: "clinic1",
    patientId: "p3",
    patientName: "Poulomi Dey",
    rating: BigInt(4),
    comment:
      "Dr. Anika Gupta is very knowledgeable. Got great advice for my skin concerns. The online booking was seamless. Would give 5 stars if parking was a bit easier.",
    date: "2026-01-15",
  },
  {
    id: "r4",
    clinicId: "clinic1",
    patientId: "p4",
    patientName: "Amit Chowdhury",
    rating: BigInt(5),
    comment:
      "Visited with my elderly mother and was impressed by the compassionate care. The reception staff went out of their way to make her comfortable. Excellent clinic!",
    date: "2026-03-05",
  },
  {
    id: "r5",
    clinicId: "clinic1",
    patientId: "p5",
    patientName: "Debarati Banerjee",
    rating: BigInt(4),
    comment:
      "Clean, modern facility with courteous staff. My appointment was on time and Dr. Sen's diagnosis was spot-on. The digital prescription was a nice touch.",
    date: "2025-12-20",
  },
  {
    id: "r6",
    clinicId: "clinic1",
    patientId: "p6",
    patientName: "Souvik Ghosh",
    rating: BigInt(5),
    comment:
      "Outstanding experience. Booking an appointment online was effortless and the UPI payment option made everything smooth. Dr. Sharma fixed my tooth perfectly!",
    date: "2026-02-10",
  },
];

type StarFilter = "all" | "5" | "4" | "3";
type SortOrder = "newest" | "highest";

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ReviewsPage() {
  const { data: backendReviews, isLoading } = useReviews();
  const [starFilter, setStarFilter] = useState<StarFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const allReviews: Review[] = useMemo(() => {
    if (backendReviews && backendReviews.length > 0) return backendReviews;
    return SEED_REVIEWS;
  }, [backendReviews]);

  const filtered = useMemo(() => {
    let list = [...allReviews];
    if (starFilter !== "all") {
      const n = Number(starFilter);
      list = list.filter((r) => Number(r.rating) === n);
    }
    if (sortOrder === "newest") {
      list.sort((a, b) => (a.date < b.date ? 1 : -1));
    } else {
      list.sort((a, b) => Number(b.rating) - Number(a.rating));
    }
    return list;
  }, [allReviews, starFilter, sortOrder]);

  const starFilterOptions: { value: StarFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "5", label: "5 ★" },
    { value: "4", label: "4 ★" },
    { value: "3", label: "3 ★" },
  ];

  const sortOptions: { value: SortOrder; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "highest", label: "Highest Rated" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Hero */}
      <section
        className="gradient-hero py-14 px-4"
        data-ocid="reviews.hero_section"
      >
        <div className="max-w-7xl mx-auto">
          <nav
            className="flex items-center gap-1.5 text-sm text-primary-foreground/70 mb-4"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-primary-foreground transition-smooth"
              data-ocid="reviews.breadcrumb_home"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary-foreground font-medium">
              Patient Reviews
            </span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary-foreground leading-tight">
            Patient Reviews
          </h1>
          <p className="mt-3 text-primary-foreground/80 max-w-xl text-lg">
            Real experiences from our patients. See why thousands trust
            SmileCare Clinic.
          </p>
        </div>
      </section>

      {/* Overall Rating Summary */}
      <section
        className="py-16 px-4 bg-background"
        data-ocid="reviews.summary_section"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">
            Overall Patient Satisfaction
          </h2>
          {isLoading ? (
            <div className="max-w-2xl mx-auto">
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          ) : (
            <RatingSummary reviews={allReviews} />
          )}
        </div>
      </section>

      {/* Reviews Grid */}
      <section
        className="py-16 px-4 bg-muted/30"
        data-ocid="reviews.grid_section"
      >
        <div className="max-w-7xl mx-auto">
          {/* Filter Bar */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            data-ocid="reviews.filter_bar"
          >
            {/* Star filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {starFilterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStarFilter(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth border ${
                    starFilter === opt.value
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                  data-ocid={`reviews.star_filter.${opt.value}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground shrink-0">
                Sort:
              </span>
              <div className="flex gap-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSortOrder(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth border ${
                      sortOrder === opt.value
                        ? "bg-secondary text-secondary-foreground border-border"
                        : "bg-card text-muted-foreground border-border hover:text-foreground"
                    }`}
                    data-ocid={`reviews.sort.${opt.value}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-52 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16" data-ocid="reviews.empty_state">
              <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-lg font-semibold text-foreground mb-1">
                No reviews for this filter
              </p>
              <p className="text-muted-foreground text-sm">
                Try selecting a different star rating.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leave a Review CTA Strip */}
      <section
        className="py-14 px-4 gradient-hero"
        data-ocid="reviews.cta_section"
      >
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-3xl font-display font-bold text-primary-foreground">
            Share Your Experience
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Your feedback helps us improve and helps others make informed
            decisions. Book an appointment and share your story.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-gold px-8 transition-smooth"
            data-ocid="reviews.book_appointment_button"
          >
            <Link to="/smilecare/book" search={{ doctorId: "" }}>
              Book an Appointment
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
