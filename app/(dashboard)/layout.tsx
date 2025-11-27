import DashboardHeader from "@/components/common/DashboardHeader";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-10 py-5 h-screen w-full relative flex flex-col">
      <DashboardHeader />
      <span className="size-full">{children}</span>
      <ScrollToTop />
    </div>
  );
}
