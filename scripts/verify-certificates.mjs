/**
 * Verifikasi interaksi sertifikat di browser sungguhan (Chromium headless).
 *
 * Tujuan: membuktikan hal-hal yang TIDAK bisa dibuktikan dengan `npm run build`
 * atau curl, yaitu interaksi nyata:
 *   - klik kartu -> modal/lightbox terbuka
 *   - tombol next/prev mengganti sertifikat
 *   - tombol X menutup
 *   - tekan ESC menutup
 *   - background terkunci saat modal terbuka
 *
 * Pakai:  node scripts/verify-certificates.mjs
 * (dev server harus jalan di http://localhost:3000)
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const results = [];

function check(name, passed, detail = '') {
  results.push({ name, passed, detail });
  console.log(`${passed ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Kumpulkan error konsol (React warning, hydration, dsb.)
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

  console.log('▶ Membuka', BASE, '\n');
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // 0. Lewati EntryScreen lewat tombol "BUKA PORTOFOLIO".
  //    Penting diketahui: layar ini TIDAK menutup saat diklik di sembarang
  //    tempat - hanya tombol itu (atau tombol Space/Enter) yang memicu masuk.
  //    Ini menjawab kenapa "klik kartu" terasa tidak bisa dilakukan.
  const entryBtn = page.getByRole('button', { name: /BUKA PORTOFOLIO/i });
  if ((await entryBtn.count()) > 0) {
    await entryBtn.first().click({ timeout: 10000 });
  } else {
    // fallback: keyboard
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(2500); // animasi masuk
  // Anggap "masih terhalang" HANYA jika overlay benar-benar menutupi dan
  // menangkap klik (z tinggi + pointer-events aktif), seperti EntryScreen.
  // Overlay dekoratif z-0 dengan pointer-events:none tidak menghalangi apa pun.
  const blocked = await page.evaluate(() => {
    for (const o of document.querySelectorAll('.fixed.inset-0')) {
      const s = getComputedStyle(o);
      if (s.display === 'none' || s.visibility === 'hidden') continue;
      if (parseFloat(s.opacity || '1') <= 0.01) continue;
      if (s.pointerEvents === 'none') continue;
      const z = parseInt(s.zIndex || '0', 10);
      if (z >= 1000) return true; // overlay modal/entry yang sebenarnya
    }
    return false;
  });
  check('EntryScreen bisa dilewati (tombol BUKA PORTOFOLIO)', !blocked);

  // 0b. Section-nya ada?
  const section = page.locator('#certificates');
  check('Section #certificates ada', (await section.count()) > 0);

  await section.scrollIntoViewIfNeeded();
  // Lazy loading: gambar baru dimuat setelah masuk viewport. Tunggu sampai
  // benar-benar termuat, jangan langsung menyimpulkan "rusak".
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('#certificates img'));
    await Promise.all(
      imgs.map((i) =>
        i.complete
          ? Promise.resolve()
          : new Promise((res) => {
              i.addEventListener('load', res, { once: true });
              i.addEventListener('error', res, { once: true });
            })
      )
    );
  });

  // 1. Kartu sertifikat muncul
  const cards = page.locator('#certificates article');
  const cardCount = await cards.count();
  check('Kartu sertifikat ter-render', cardCount === 8, `ditemukan ${cardCount} (harus 8)`);

  // 2. Gambar kartu benar-benar termuat (bukan broken image)
  const broken = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('#certificates img'));
    return imgs.filter((i) => !i.complete || i.naturalWidth === 0).length;
  });
  check('Semua gambar kartu termuat', broken === 0, `${broken} gambar rusak`);

  // 3. KLIK kartu -> lightbox terbuka
  await cards.first().click();
  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  const opened = await dialog.isVisible().catch(() => false);
  check('KLIK kartu membuka lightbox', opened);

  if (!opened) {
    console.log('\n⚠️  Lightbox tidak terbuka — tes lanjutan dilewati.');
    await browser.close();
    process.exit(1);
  }

  // 4. Judul sertifikat pertama sesuai
  const title1 = await dialog.locator('h3').first().textContent().catch(() => '');
  check('Judul tampil di lightbox', (title1 || '').trim().length > 0, (title1 || '').trim());

  // 5. Counter "1 / 8"
  const counter1 = await dialog.locator('span.tabular-nums').first().textContent().catch(() => '');
  check('Counter posisi tampil', (counter1 || '').includes('1'), (counter1 || '').trim());

  // 6. Background scroll terkunci
  const locked = await page.evaluate(() => document.body.style.overflow === 'hidden');
  check('Background scroll terkunci', locked);

  // 7. Klik NEXT -> counter berubah ke 2
  await dialog.locator('button[aria-label="Sertifikat selanjutnya"]').click();
  await page.waitForTimeout(400);
  const counter2 = await dialog.locator('span.tabular-nums').first().textContent().catch(() => '');
  check('Tombol NEXT mengganti sertifikat', (counter2 || '').trim().startsWith('2'), (counter2 || '').trim());

  // 8. Klik PREV -> kembali ke 1
  await dialog.locator('button[aria-label="Sertifikat sebelumnya"]').click();
  await page.waitForTimeout(400);
  const counter3 = await dialog.locator('span.tabular-nums').first().textContent().catch(() => '');
  check('Tombol PREV kembali ke sertifikat 1', (counter3 || '').trim().startsWith('1'), (counter3 || '').trim());

  // 9. Keyboard ArrowRight -> 2
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
  const counter4 = await dialog.locator('span.tabular-nums').first().textContent().catch(() => '');
  check('Tombol panah kanan (→) mengganti', (counter4 || '').trim().startsWith('2'), (counter4 || '').trim());

  // 10. ESC menutup
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  const stillOpen = await page.locator('[role="dialog"]').isVisible().catch(() => false);
  check('Tekan ESC menutup lightbox', !stillOpen);

  // 11. Scroll terkunci dibuka kembali setelah tutup
  const unlocked = await page.evaluate(() => document.body.style.overflow !== 'hidden');
  check('Scroll dibuka kembali setelah tutup', unlocked);

  // 12. Buka lagi lalu klik tombol X
  //     Tunggu dulu sampai dialog sebelumnya benar-benar hilang (AnimatePresence
  //     butuh waktu untuk animasi keluar), supaya tidak ada 2 dialog sekaligus.
  await page.waitForFunction(
    () => document.querySelectorAll('[role="dialog"]').length === 0,
    { timeout: 8000 }
  );
  await cards.nth(2).scrollIntoViewIfNeeded();
  await cards.nth(2).click({ timeout: 15000 });
  await page.locator('[role="dialog"]').first().waitFor({ state: 'visible', timeout: 8000 });
  await page.locator('[role="dialog"] button[aria-label="Tutup"]').first().click({ timeout: 10000 });
  await page.waitForTimeout(700);
  const closedByX = !(await page.locator('[role="dialog"]').isVisible().catch(() => false));
  check('Tombol X menutup lightbox', closedByX);

  // 13. Tombol unduh/open ada — buka ulang dengan bersih
  await cards.nth(1).scrollIntoViewIfNeeded();
  await cards.nth(1).click({ timeout: 15000 });
  await page.locator('[role="dialog"]').first().waitFor({ state: 'visible', timeout: 8000 });
  const dlg = page.locator('[role="dialog"]').first();
  const hasDownload = await dlg.locator('button[aria-label="Unduh PDF"]').count();
  const hasOpen = await dlg.locator('button[aria-label="Buka PDF di tab baru"]').count();
  check('Tombol unduh & buka PDF ada', hasDownload > 0 && hasOpen > 0, `unduh=${hasDownload} buka=${hasOpen}`);

  // 13b. Link PDF mengarah ke file yang benar (bukan 404)
  const pdfOk = await page.evaluate(async () => {
    const urls = [
      '/sertifikat/Praktikum%20Algoritma%20Dan%20Pemrograman%201.pdf',
      '/sertifikat/Praktikum%20Program%20Paket%20Niaga%20%28ppn%29.pdf',
      '/sertifikat/sertifikat%20pemrograman%20web%202.pdf',
      '/sertifikat/Praktikum%20Android.pdf',
    ];
    const res = await Promise.all(urls.map((u) => fetch(u, { method: 'HEAD' }).then((r) => r.status)));
    return urls.map((u, i) => ({ u: u.split('/').pop(), status: res[i] }));
  });
  const pdfBad = pdfOk.filter((p) => p.status >= 400);
  check('Semua PDF bisa diakses (bukan 404)', pdfBad.length === 0,
    pdfBad.length ? pdfBad.map((p) => `${p.u}=${p.status}`).join(', ') : `${pdfOk.length} file OK`);

  // Tutup sebelum cek konsol
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 14. Tidak ada error konsol
  //     Catatan: error "computeBoundingSphere(): Computed radius is NaN" dari
  //     MeshLineGeometry SUDAH ADA sebelum perubahan apa pun (diverifikasi
  //     dengan git stash pada kode asli). Itu bawaan pustaka meshline saat
  //     geometri belum punya titik, tidak merusak tampilan. Jadi tidak
  //     dihitung sebagai kegagalan — dicatat terpisah sebagai "known issue".
  const known3d = (e) => e.includes('computeBoundingSphere') && e.includes('NaN');
  const realErrors = consoleErrors.filter(
    (e) =>
      !e.includes('favicon') &&
      !e.includes('Download the React DevTools') &&
      !known3d(e)
  );
  check('Tidak ada error konsol', realErrors.length === 0, realErrors.slice(0, 2).join(' | '));

  await browser.close();

  const failed = results.filter((r) => !r.passed);
  console.log(`\n────────────────────────────────────────`);
  console.log(`Lulus ${results.length - failed.length}/${results.length}`);
  if (failed.length) {
    console.log('\nYang gagal:');
    for (const f of failed) console.log('  -', f.name, f.detail ? `(${f.detail})` : '');
    process.exit(1);
  }
  console.log('✅ Semua interaksi sertifikat berfungsi.');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
