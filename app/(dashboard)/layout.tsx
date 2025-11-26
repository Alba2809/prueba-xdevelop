import DashboardHeader from "@/components/common/DashboardHeader";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-10 my-5">
      <DashboardHeader />
      {children}
    </div>
  );
}
