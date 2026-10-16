(function () {
  'use strict';

  var SYNC_KEY = 'dompet-sync';
  var db = null;
  var docRef = null;
  var unsubscribe = null;
  var remoteReady = false;
  var applyingRemote = false;
  var originalSaveLocal = window.saveLocal;
  var originalChooseProfile = window.chooseProfile;

  function byId(id) { return document.getElementById(id); }
  function parse(value) { try { return value ? JSON.parse(value) : null; } catch (e) { return null; } }
  function syncData() { return parse(localStorage.getItem(SYNC_KEY)); }
  function text(id, value) { var node = byId(id); if (node) node.textContent = value; }
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function appProfileId() {
    return window.profile && window.profile.name === 'Istri' ? 'istri' : 'suami';
  }
  function notify(message) {
    if (typeof window.toast === 'function') window.toast(message);
    else alert(message);
  }

  function addStyles() {
    var style = document.createElement('style');
    style.textContent = '.sync-box{margin-top:15px}.sync-status{padding:11px;margin-bottom:11px;border-radius:14px;background:#f0fdfa;color:#0f766e;font-size:13px;line-height:1.5}.sync-status.error{background:#fee2e2;color:#991b1b}.sync-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.sync-help{color:#64748b;font-size:12px;line-height:1.55}.sync-modal-text{color:#64748b;font-size:13px;line-height:1.55}';
    document.head.appendChild(style);
  }

  function injectUI() {
    var page = byId('categories');
    if (!page || byId('firebaseSyncCard')) return;
    var card = document.createElement('div');
    card.id = 'firebaseSyncCard';
    card.innerHTML = '<div class="title"><h2>Sinkronisasi Keluarga</h2><span class="badge">Firebase</span></div>' +
      '<div class="card sync-box"><div id="firebaseSyncStatus" class="sync-status">📱 Mode lokal. Data tersimpan di HP ini.</div>' +
      '<div class="sync-actions"><button type="button" class="primary" onclick="openFirebaseSync()">☁ Atur Sinkronisasi</button>' +
      '<button type="button" class="ghost" onclick="syncNow()">↻ Sinkron Sekarang</button></div>' +
      '<p class="sync-help">Gunakan kode keluarga dan Firebase Config yang sama pada kedua HP.</p></div>';
    page.appendChild(card);

    var modal = document.createElement('div');
    modal.id = 'firebaseSyncModal';
    modal.className = 'modal';
    modal.innerHTML = '<div class="sheet"><div class="head"><h3>Sinkronisasi Firebase</h3>' +
      '<button type="button" class="close" onclick="closeFirebaseSync()">×</button></div>' +
      '<p class="sync-modal-text">Data profil Suami dan Istri disimpan pada dokumen terpisah. Masukkan konfigurasi Web App Firebase dan kode keluarga yang sama di kedua perangkat.</p>' +
      '<form onsubmit="saveFirebaseSync(event)"><div class="field"><label>Kode Keluarga</label>' +
      '<input id="firebaseFamily" required placeholder="Contoh: IQBAL-KELUARGA"></div>' +
      '<div class="field"><label>Firebase Config dalam JSON</label>' +
      '<textarea id="firebaseConfig" rows="8" required placeholder=\'{"apiKey":"...","authDomain":"...","projectId":"...","appId":"..."}\'></textarea></div>' +
      '<button type="submit" class="primary full">Aktifkan Sinkronisasi</button>' +
      '<button type="button" class="danger full" style="margin-top:9px" onclick="disableFirebaseSync()">Matikan Sinkronisasi</button></form></div>';
    document.body.appendChild(modal);
  }

  function setStatus(message, isError) {
    var node = byId('firebaseSyncStatus');
    if (!node) return;
    node.textContent = message;
    node.className = isError ? 'sync-status error' : 'sync-status';
  }

  window.openFirebaseSync = function () {
    var saved = syncData();
    byId('firebaseFamily').value = saved ? saved.family : '';
    byId('firebaseConfig').value = saved && saved.config ? JSON.stringify(saved.config, null, 2) : '';
    byId('firebaseSyncModal').className = 'modal on';
  };

  window.closeFirebaseSync = function () {
    byId('firebaseSyncModal').className = 'modal';
  };

  window.saveFirebaseSync = function (event) {
    event.preventDefault();
    try {
      var family = byId('firebaseFamily').value.replace(/^\s+|\s+$/g, '');
      var config = JSON.parse(byId('firebaseConfig').value);
      if (!family) throw new Error('Kode keluarga belum diisi.');
      if (!config.apiKey || !config.projectId) throw new Error('Firebase Config belum lengkap.');
      localStorage.setItem(SYNC_KEY, JSON.stringify({ family: family, config: config }));
      closeFirebaseSync();
      connectFirebase();
    } catch (error) {
      notify(error.message || 'Firebase Config tidak valid.');
    }
    return false;
  };

  window.disableFirebaseSync = function () {
    if (unsubscribe) { unsubscribe(); unsubscribe = null; }
    db = null; docRef = null; remoteReady = false;
    localStorage.removeItem(SYNC_KEY);
    closeFirebaseSync();
    setStatus('📱 Mode lokal. Data tersimpan di HP ini.', false);
    notify('Sinkronisasi dimatikan.');
  };

  function writeRemote() {
    if (!remoteReady || !docRef || applyingRemote || !window.state || !window.profile) return Promise.resolve();
    return docRef.set({
      state: window.state,
      profile: window.profile.name,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true }).catch(function (error) {
      setStatus('❌ Gagal mengirim data: ' + error.message, true);
    });
  }

  window.syncNow = function () {
    if (!syncData()) { openFirebaseSync(); return; }
    if (!remoteReady) { connectFirebase(); return; }
    setStatus('⏳ Mengirim data terbaru...', false);
    writeRemote().then(function () {
      setStatus('☁ Sinkron aktif • ' + syncData().family + ' • ' + window.profile.name, false);
      notify('Data berhasil disinkronkan.');
    });
  };

  function connectFirebase() {
    var saved = syncData();
    if (!saved || !window.profile) return;
    if (typeof firebase === 'undefined') {
      setStatus('❌ Firebase SDK tidak termuat. Periksa internet dan whitelist Cordova.', true);
      return;
    }
    setStatus('⏳ Menghubungkan ke Firebase...', false);
    try {
      if (unsubscribe) { unsubscribe(); unsubscribe = null; }
      var appName = 'saku-' + saved.config.projectId;
      var app;
      try { app = firebase.app(appName); }
      catch (e) { app = firebase.initializeApp(saved.config, appName); }
      db = app.firestore();
      docRef = db.collection('families').doc(saved.family).collection('profiles').doc(appProfileId());
      remoteReady = false;
      unsubscribe = docRef.onSnapshot(function (snapshot) {
        if (snapshot.exists && snapshot.data().state) {
          applyingRemote = true;
          window.state = snapshot.data().state;
          localStorage.setItem(window.profileKey(), JSON.stringify(window.state));
          if (typeof window.render === 'function') window.render();
          applyingRemote = false;
        } else {
          remoteReady = true;
          writeRemote();
        }
        remoteReady = true;
        setStatus('☁ Sinkron aktif • ' + saved.family + ' • ' + window.profile.name, false);
      }, function (error) {
        remoteReady = false;
        setStatus('❌ Sinkron gagal: ' + error.message, true);
      });
    } catch (error) {
      setStatus('❌ Sinkron gagal: ' + error.message, true);
    }
  }

  window.saveLocal = function () {
    originalSaveLocal.apply(window, arguments);
    writeRemote();
  };

  window.chooseProfile = function (name, icon) {
    originalChooseProfile(name, icon);
    setTimeout(connectFirebase, 100);
  };

  addStyles();
  injectUI();
  if (syncData() && window.profile) connectFirebase();
})();
