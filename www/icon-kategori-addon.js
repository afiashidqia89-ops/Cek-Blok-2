(function () {
  'use strict';

  var incomeIcons = [
    '💼','💰','💵','💴','💶','💷','🪙','💳','🏦','🏧',
    '📈','📊','🧾','💹','🎁','🏆','🥇','💎','👛','🤑',
    '🤝','🧑‍💼','👨‍💼','👩‍💼','🏪','🏬','🏭','🚜','🌾','🌱',
    '🐄','🐓','🐟','🍯','🧺','📦','🚚','🛍️','🧑‍🍳','🍽️',
    '🛠️','🔧','💻','⌨️','📱','📷','🎨','🎵','🎤','🎬',
    '📚','🎓','🏠','🏢','🔑','🚗','🏍️','🚲','✈️','⛵',
    '💡','⚡','☀️','🌐','📡','🧑‍🏫','🧑‍⚕️','🧑‍🔧','🧑‍🌾','🧑‍🎨',
    '🧑‍💻','🧑‍🚀','🧑‍🚒','🧑‍✈️','🧑‍⚖️','🏅','⭐','✨','✅','➕'
  ];

  var expenseIcons = [
    '🍽️','🍚','🍜','🍲','🍛','🍱','🥗','🥘','🍔','🍕',
    '🌭','🍗','🥩','🐟','🥚','🥬','🥕','🍎','🍌','🍉',
    '☕','🥤','🧃','🍰','🍪','🛒','🛍️','👕','👖','👗',
    '👟','👜','💄','💇','🧴','🧼','🧹','🧺','🏠','🏡',
    '🛏️','🛋️','🚿','💡','⚡','🔥','💧','📱','🌐','📺',
    '🚗','🏍️','🚲','🚌','🚕','🚆','✈️','⛽','🅿️','🔧',
    '🏥','💊','🩺','🦷','👓','🧘','🏋️','🎓','📚','✏️',
    '👶','🍼','🧸','🐶','🐱','🐾','🎮','🎬','🎵','🎤',
    '🏖️','🏨','🎫','🎁','🕌','🤲','🤝','💸','🧾','💳',
    '🏦','📦','🚚','🔨','🪛','🧰','🌱','🎉','⚠️','➖'
  ];

  var labels = {
    '💼':'Pekerjaan','💰':'Uang','💵':'Uang tunai','💴':'Yen','💶':'Euro',
    '💷':'Pound','🪙':'Koin','💳':'Kartu','🏦':'Bank','🏧':'ATM',
    '📈':'Investasi naik','📊':'Laporan','🧾':'Tagihan','💹':'Keuntungan','🎁':'Hadiah',
    '🏆':'Penghargaan','💎':'Aset','🤝':'Kerja sama','🏪':'Toko','🏭':'Usaha',
    '🌾':'Pertanian','🐟':'Perikanan','📦':'Penjualan','💻':'Freelance','📱':'Digital',
    '🏠':'Properti','🚗':'Kendaraan','🍽️':'Makanan','🛒':'Belanja','⛽':'Bahan bakar',
    '🏥':'Kesehatan','💊':'Obat','🎓':'Pendidikan','👶':'Anak','🐾':'Hewan',
    '🎮':'Hiburan','🏖️':'Liburan','🕌':'Ibadah','💸':'Pengeluaran','⚡':'Listrik',
    '💧':'Air','🌐':'Internet','👕':'Pakaian','🔧':'Perbaikan','🎉':'Acara'
  };

  function unique(items) {
    var seen = {}, result = [], i, value;
    for (i = 0; i < items.length; i++) {
      value = items[i];
      if (!seen[value]) {
        seen[value] = true;
        result.push(value);
      }
    }
    return result;
  }

  function optionText(icon) {
    return icon + (labels[icon] ? '  ' + labels[icon] : '  Kategori');
  }

  function fillIconOptions() {
    var type = document.getElementById('catType');
    var select = document.getElementById('catIcon');
    if (!type || !select) return;

    var selected = select.value;
    var icons = type.value === 'income' ? incomeIcons : expenseIcons;
    icons = unique(icons);
    select.innerHTML = '';

    var group = document.createElement('optgroup');
    group.label = type.value === 'income' ? 'Ikon Pemasukan' : 'Ikon Pengeluaran';

    for (var i = 0; i < icons.length; i++) {
      var option = document.createElement('option');
      option.value = icons[i];
      option.textContent = optionText(icons[i]);
      group.appendChild(option);
    }

    select.appendChild(group);
    if (selected && icons.indexOf(selected) !== -1) select.value = selected;
    else select.value = type.value === 'income' ? '💼' : '🍽️';
  }

  function start() {
    var type = document.getElementById('catType');
    if (!type) {
      setTimeout(start, 300);
      return;
    }

    type.addEventListener('change', fillIconOptions, false);
    fillIconOptions();

    if (typeof window.openCat === 'function') {
      var originalOpenCat = window.openCat;
      window.openCat = function (id) {
        originalOpenCat(id);
        setTimeout(fillIconOptions, 0);
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, false);
  } else {
    start();
  }
})();
