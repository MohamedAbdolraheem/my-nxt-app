import DrawerNav from "../components/DrawerNav";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <DrawerNav />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
} 