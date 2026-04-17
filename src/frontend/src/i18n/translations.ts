import type { Language } from "../types";

type TranslationKey =
  | "nav_home"
  | "nav_about"
  | "nav_departments"
  | "nav_doctors"
  | "nav_contact"
  | "nav_reviews"
  | "nav_book"
  | "hero_title"
  | "hero_subtitle"
  | "hero_cta"
  | "book_title"
  | "book_step1"
  | "book_step2"
  | "book_step3"
  | "book_step4"
  | "book_step5"
  | "book_step6"
  | "book_step7";

type Translations = Record<Language, Record<TranslationKey, string>>;

export const translations: Translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_departments: "Departments",
    nav_doctors: "Doctors",
    nav_contact: "Contact",
    nav_reviews: "Reviews",
    nav_book: "Book Appointment",
    hero_title: "Your Health, Our Priority",
    hero_subtitle:
      "World-class healthcare at SmileCare Clinic. Expert doctors, advanced treatments, and compassionate care — all under one roof in Kolkata.",
    hero_cta: "Book an Appointment",
    book_title: "Book Your Appointment",
    book_step1: "Select Doctor",
    book_step2: "Choose Date & Time",
    book_step3: "Login / Sign Up",
    book_step4: "Patient Details",
    book_step5: "Payment",
    book_step6: "Apply Coupon",
    book_step7: "Confirmation",
  },
  hi: {
    nav_home: "होम",
    nav_about: "हमारे बारे में",
    nav_departments: "विभाग",
    nav_doctors: "डॉक्टर",
    nav_contact: "संपर्क",
    nav_reviews: "समीक्षाएं",
    nav_book: "अपॉइंटमेंट लें",
    hero_title: "आपका स्वास्थ्य, हमारी प्राथमिकता",
    hero_subtitle:
      "SmileCare क्लिनिक में विश्वस्तरीय स्वास्थ्य सेवा। विशेषज्ञ डॉक्टर, उन्नत उपचार और सहानुभूतिपूर्ण देखभाल — कोलकाता में एक छत के नीचे।",
    hero_cta: "अपॉइंटमेंट बुक करें",
    book_title: "अपॉइंटमेंट बुक करें",
    book_step1: "डॉक्टर चुनें",
    book_step2: "तारीख और समय चुनें",
    book_step3: "लॉगिन / साइन अप",
    book_step4: "मरीज की जानकारी",
    book_step5: "भुगतान",
    book_step6: "कूपन लगाएं",
    book_step7: "पुष्टि",
  },
  bn: {
    nav_home: "হোম",
    nav_about: "আমাদের সম্পর্কে",
    nav_departments: "বিভাগ",
    nav_doctors: "ডাক্তার",
    nav_contact: "যোগাযোগ",
    nav_reviews: "রিভিউ",
    nav_book: "অ্যাপয়েন্টমেন্ট নিন",
    hero_title: "আপনার স্বাস্থ্য, আমাদের অগ্রাধিকার",
    hero_subtitle:
      "SmileCare ক্লিনিকে বিশ্বমানের স্বাস্থ্যসেবা। বিশেষজ্ঞ ডাক্তার, আধুনিক চিকিৎসা এবং যত্নশীল সেবা — কলকাতায় এক ছাদের নিচে।",
    hero_cta: "অ্যাপয়েন্টমেন্ট বুক করুন",
    book_title: "অ্যাপয়েন্টমেন্ট বুক করুন",
    book_step1: "ডাক্তার নির্বাচন করুন",
    book_step2: "তারিখ ও সময় বেছে নিন",
    book_step3: "লগইন / সাইন আপ",
    book_step4: "রোগীর তথ্য",
    book_step5: "পেমেন্ট",
    book_step6: "কুপন দিন",
    book_step7: "নিশ্চিতকরণ",
  },
};

export function useTranslation(lang: Language) {
  const t = (key: TranslationKey): string =>
    translations[lang][key] ?? translations.en[key];
  return { t };
}
