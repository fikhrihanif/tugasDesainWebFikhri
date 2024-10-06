let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Mencegah prompt otomatis muncul
  event.preventDefault();
  // Simpan event untuk digunakan nanti
  deferredPrompt = event;

  // Tampilkan tombol atau UI yang meminta pengguna untuk install aplikasi
  const installButton = document.getElementById('installButton');
  installButton.style.display = 'block';

  // Tambahkan event listener untuk tombol install
  installButton.addEventListener('click', () => {
    // Tampilkan verifikasi instalasi ke pengguna
    const userConfirmation = confirm('Apakah Anda ingin menginstal aplikasi ini?');

    if (userConfirmation && deferredPrompt) {
      // Jika pengguna menyetujui, tampilkan prompt instalasi
      deferredPrompt.prompt();
      
      // Tunggu pengguna untuk merespon prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Pengguna menyetujui instalasi');
          // Mulai cache file untuk penggunaan offline setelah instalasi disetujui
          cacheFiles();
        } else {
          console.log('Pengguna menolak instalasi');
        }
        deferredPrompt = null;
      });
    } else {
      console.log('Pengguna membatalkan verifikasi instalasi');
    }
  });
});

// Fungsi untuk cache file setelah instalasi berhasil
function cacheFiles() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Buka cache yang diinginkan
      caches.open('site-cache-v1').then(cache => {
        // Daftar file yang akan dicache
        const assetsToCache = [
          '/tugasDesainWebFikhri/index.html',
          '/tugasDesainWebFikhri/about.html',
          '/tugasDesainWebFikhri/confirmation.html',
          '/tugasDesainWebFikhri/contact.html',
          '/tugasDesainWebFikhri/foto.jpg',
          '/tugasDesainWebFikhri/image.jpg',
          '/tugasDesainWebFikhri/Logo192.png',
          '/tugasDesainWebFikhri/Logo512.png',
          '/tugasDesainWebFikhri/manifest.json',
          '/tugasDesainWebFikhri/style.css',
          '/tugasDesainWebFikhri/offline.html'
        ];
        // Tambahkan semua file ke cache
        cache.addAll(assetsToCache).then(() => {
          console.log('Semua aset telah di-cache dan siap untuk offline');
        }).catch(error => {
          console.error('Gagal mencache file:', error);
        });
      });
    });
  } else {
    console.log('Service worker tidak didukung di browser ini.');
  }
}
