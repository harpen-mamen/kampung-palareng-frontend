export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-sky-100 bg-slate-950 text-slate-100">
      <div className="container-shell grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Kontak Kampung
          </p>
          <h3 className="mt-3 font-serif text-2xl font-bold">Portal Kampung Palareng</h3>
        </div>
        <div>
          <p className="text-sm text-slate-300">Alamat</p>
          <p className="mt-2 text-sm leading-7 text-slate-100">
            Kampung Palareng, Kabupaten Kepulauan Sangihe
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-300">Pelayanan</p>
          <p className="mt-2 text-sm leading-7 text-slate-100">
            Senin - Kamis, 08.00 - 14.00 WITA
          </p>
        </div>
      </div>
    </footer>
  );
}
