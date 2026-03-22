import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { StatusChecker } from "@/components/public/status-checker";

export default function BantuanStatusPage() {
  return (
    <div>
      <PublicNavbar />
      <main className="container-shell py-14">
        <StatusChecker type="bantuan" />
      </main>
      <PublicFooter />
    </div>
  );
}
