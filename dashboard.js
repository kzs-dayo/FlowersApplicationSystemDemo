// ダッシュボード用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初期化
    initializeDashboard();
    
    // ナビゲーションの設定
    setupNavigation();
    
    // データの更新
    updateDashboardData();
});

// ダッシュボード初期化
function initializeDashboard() {
    console.log('ダッシュボードを初期化中...');
    
    // 設定値の読み込み
    loadSettings();
    
    // イベントリスナーの設定
    setupEventListeners();
}

// ナビゲーション設定
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // ハッシュリンクの場合は現在のページ内で処理
            if (href.startsWith('#')) {
                e.preventDefault();
                navigateToSection(href.substring(1));
            }
        });
    });
}

// セクション切り替え
function navigateToSection(sectionId) {
    console.log(`セクション ${sectionId} に移動`);
    
    switch(sectionId) {
        case 'dashboard':
            // すでにダッシュボードにいる場合はデータ更新
            updateDashboardData();
            break;
        case 'new-order':
            window.location.href = 'index.html';
            break;
        case 'order-list':
            window.location.href = 'order-management.html';
            break;
        case 'reports':
            window.location.href = 'reports.html';
            break;
        case 'settings':
            showSettingsModal();
            break;
        default:
            console.log('未知のセクション:', sectionId);
    }
}

// イベントリスナー設定
function setupEventListeners() {
    // 設定保存ボタン
    const saveSettingsBtn = document.querySelector('#saveSettings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
}

// ダッシュボードデータ更新
function updateDashboardData() {
    // 実際のアプリケーションではAPIからデータを取得
    const mockData = {
        totalOrders: 12,
        totalAmount: 218500,
        invoicePending: 5,
        onsitePayment: 3,
        staffName: '山田太郎',
        funeralDate: '2024/01/20'
    };
    
    // 統計データの更新
    updateElement('totalOrders', mockData.totalOrders);
    updateElement('totalAmount', `¥${mockData.totalAmount.toLocaleString()}`);
    updateElement('invoicePending', mockData.invoicePending);
    updateElement('onsitePayment', mockData.onsitePayment);
    updateElement('staffName', mockData.staffName);
    updateElement('funeralDate', mockData.funeralDate);
    
    console.log('ダッシュボードデータを更新しました');
}

// 要素の更新
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// クイックアクション関数
function showNewOrderForm() {
    window.location.href = 'application-form.html';
}

function showOrderList() {
    window.location.href = 'order-management.html';
}

function generateFlowerOrder() {
    if (confirm('生花発注リストを作成しますか？')) {
        showProgress('発注リスト作成中...', () => {
            setTimeout(() => {
                hideProgress();
                alert('生花発注リストの作成が完了しました。');
            }, 1000);
        });
    }
}

function showInvoiceGeneration() {
    window.location.href = 'reports.html#invoice';
}

function showReceiptGeneration() {
    window.location.href = 'reports.html#receipt';
}

// 注文関連関数
function editOrder(orderNo) {
    console.log(`注文 ${orderNo} を修正`);
    // 実際のアプリケーションでは修正画面に遷移
    alert(`注文No.${orderNo}の修正画面に移動します。`);
}

function reviveOrder(orderNo) {
    if (confirm(`注文No.${orderNo}を復活させますか？`)) {
        console.log(`注文 ${orderNo} を復活`);
        // 実際のアプリケーションではAPIを呼び出し
        alert(`注文No.${orderNo}を復活させました。`);
        updateDashboardData();
    }
}

// 設定関連関数
function showSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'block';
        loadSettingsToModal();
    }
}

function loadSettingsToModal() {
    // 現在の設定値をモーダルに読み込み
    const staffName = document.getElementById('staffName').textContent;
    const funeralDate = document.getElementById('funeralDate').textContent;
    
    document.getElementById('staffNameInput').value = staffName;
    document.getElementById('funeralDateInput').value = funeralDate.replace(/\//g, '-');
}

function saveSettings() {
    const staffName = document.getElementById('staffNameInput').value;
    const funeralDate = document.getElementById('funeralDateInput').value;
    const defaultAmount = document.getElementById('defaultAmount').value;
    const defaultFee = document.getElementById('defaultFee').value;
    
    if (!staffName || !funeralDate) {
        alert('担当者名と葬儀確定日は必須です。');
        return;
    }
    
    // 設定を保存（実際のアプリケーションではAPIに送信）
    const settings = {
        staffName,
        funeralDate,
        defaultAmount: parseInt(defaultAmount),
        defaultFee: parseInt(defaultFee)
    };
    
    localStorage.setItem('flowerSystemSettings', JSON.stringify(settings));
    
    // 画面の表示を更新
    document.getElementById('staffName').textContent = staffName;
    document.getElementById('funeralDate').textContent = funeralDate.replace(/-/g, '/');
    
    closeModal('settingsModal');
    alert('設定を保存しました。');
}

function loadSettings() {
    const settings = localStorage.getItem('flowerSystemSettings');
    if (settings) {
        const parsedSettings = JSON.parse(settings);
        console.log('設定を読み込みました:', parsedSettings);
    }
}

// 進捗表示
function showProgress(message, callback) {
    // 簡易的な進捗表示
    const progressOverlay = document.createElement('div');
    progressOverlay.id = 'progressOverlay';
    progressOverlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
                <div style="margin-bottom: 15px; font-size: 1.2rem;">${message}</div>
                <div class="progress-bar" style="width: 200px; height: 10px; background: #f0f0f0; border-radius: 5px; overflow: hidden;">
                    <div class="progress-fill" style="height: 100%; background: #667eea; width: 0%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(progressOverlay);
    
    // 進捗アニメーション
    let progress = 0;
    const progressFill = progressOverlay.querySelector('.progress-fill');
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 200);
}

function hideProgress() {
    const progressOverlay = document.getElementById('progressOverlay');
    if (progressOverlay) {
        progressOverlay.remove();
    }
}

// モーダル関連
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// モーダル外クリックで閉じる
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// ユーティリティ関数
function formatCurrency(amount) {
    return `¥${amount.toLocaleString()}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}

// エラーハンドリング
window.addEventListener('error', function(event) {
    console.error('エラーが発生しました:', event.error);
});

// レスポンシブ対応
function checkMobile() {
    return window.innerWidth <= 768;
}

window.addEventListener('resize', function() {
    // ウィンドウサイズ変更時の処理
    if (checkMobile()) {
        // モバイル用の調整
        console.log('モバイル表示に切り替え');
    } else {
        // デスクトップ用の調整
        console.log('デスクトップ表示に切り替え');
    }
});

// デバッグ用
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('開発モードで実行中');
    window.debugDashboard = {
        updateData: updateDashboardData,
        showSettings: showSettingsModal,
        generateInvoices: generateAllInvoices
    };
}