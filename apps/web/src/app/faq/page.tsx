import FAQClientPage from "@/components/faq/FAQClientPage";
import { PARENT_SECTIONS, TEACHER_SECTIONS } from "@/data/faqData";

export default function FAQPage() {
  return (
    <FAQClientPage
      parentSections={PARENT_SECTIONS}
      teacherSections={TEACHER_SECTIONS}
    />
  );
}
