const daftarKeranjang = document.getElementById('daftarKeranjang');
const totalHargaElem = document.getElementById('totalHarga');

let keranjang = JSON.parse(localStorage.getItem('keranjangSnacknesia')) || [];

function formatRupiah(num) {
  return 'Rp' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function simpanKeLocalStorage() {
  localStorage.setItem('keranjangSnacknesia', JSON.stringify(keranjang));
}

function simpanDataPembeli() {
  const nama = document.getElementById('namaPembeli').value.trim();
  const alamat = document.getElementById('alamatPembeli').value.trim();
  localStorage.setItem('dataPembeliSnacknesia', JSON.stringify({ nama, alamat }));
}

function loadDataPembeli() {
  const data = JSON.parse(localStorage.getItem('dataPembeliSnacknesia'));
  if (data) {
    document.getElementById('namaPembeli').value = data.nama || '';
    document.getElementById('alamatPembeli').value = data.alamat || '';
  }
}

function renderKeranjang() {
  daftarKeranjang.innerHTML = '';
  let total = 0;

  keranjang.forEach((item, index) => {
    const hargaItem = item.harga * item.jumlah;
    total += hargaItem;

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.nama} - ${formatRupiah(item.harga)} x ${item.jumlah} = ${formatRupiah(hargaItem)}</span><br>
      <button onclick="ubahJumlah(${index}, -1)">➖</button>
      <button onclick="ubahJumlah(${index}, 1)">➕</button>
      <button onclick="hapusDariKeranjang(${index})" style="background:red;color:white;padding:2px 6px;border:none;border-radius:4px;margin-left:6px;">❌</button>
    `;
    daftarKeranjang.appendChild(li);
  });

  totalHargaElem.textContent = `Total: ${formatRupiah(total)}`;
  simpanKeLocalStorage();
}

function tambahKeKeranjang(nama, harga) {
  const index = keranjang.findIndex(item => item.nama === nama);
  if (index !== -1) {
    keranjang[index].jumlah += 1;
  } else {
    keranjang.push({ nama, harga, jumlah: 1 });
  }
  renderKeranjang();
  alert(`${nama} telah ditambahkan ke keranjang`);
}

function ubahJumlah(index, perubahan) {
  keranjang[index].jumlah += perubahan;
  if (keranjang[index].jumlah <= 0) {
    keranjang.splice(index, 1);
  }
  renderKeranjang();
}

function hapusDariKeranjang(index) {
  keranjang.splice(index, 1);
  renderKeranjang();
}

function kosongkanKeranjang() {
  if (confirm("Yakin ingin mengosongkan keranjang?")) {
    keranjang = [];
    renderKeranjang();
  }
}

function kirimPesanan() {
  if (keranjang.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const nama = document.getElementById('namaPembeli').value.trim();
  const alamat = document.getElementById('alamatPembeli').value.trim();

  if (!nama || !alamat) {
    alert("Harap isi nama dan alamat terlebih dahulu.");
    return;
  }

  simpanDataPembeli(); // simpan ke localStorage

  const pesan = keranjang
    .map(item => `• ${item.nama} (${item.jumlah}x) - ${formatRupiah(item.harga * item.jumlah)}`)
    .join('\n');

  const total = keranjang.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
  const fullPesan = `Halo! Saya ingin pesan:\n${pesan}\n\nTotal: ${formatRupiah(total)}\n\nNama: ${nama}\nAlamat: ${alamat}`;

 const waLink = `https://wa.me/6285281974112?text=${encodeURIComponent(fullPesan)}`;
  window.open(waLink, '_blank');

  setTimeout(() => {
    alert("Pesanan berhasil dikirim via WhatsApp!");
  }, 1500);
}

// Load data pembeli saat halaman dibuka
loadDataPembeli();

// Langsung render isi keranjang dari localStorage saat halaman dibuka
renderKeranjang();
