import MainLayout from "../../../components/layout/MainLayout";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <MainLayout>
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <div className="w-full max-w-md bg-gray-50  space-y-9 bg-background rounded-2xl shadow-sm p-8">
        <div className="text-center  space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
    </MainLayout>
  );
}
