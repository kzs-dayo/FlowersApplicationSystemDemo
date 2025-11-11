// ヘッダー共通JavaScript

// プリセットアカウント（デモ用）
const DEMO_ACCOUNTS = {
    admin: {
        name: '山田 太郎',
        role: '管理者',
        email: 'yamada@example.com',
        roleKey: 'admin'
    },
    staff: {
        name: '鈴木 一郎',
        role: '担当者',
        email: 'suzuki@example.com',
        roleKey: 'staff'
    }
};

// ヘッダーのHTMLテンプレート
const headerHTML = `
<header class="header">
    <div class="header-content">
        <h1 id="pageTitle">供花注文管理システム</h1>
        <div class="header-right">
            <div class="header-actions" id="headerActions">
                <!-- ページ固有のボタンがここに挿入されます -->
            </div>
            <div class="account-info">
                <div class="account-dropdown">
                    <button class="account-button" onclick="toggleAccountMenu()">
                        <i class="fas fa-user-circle"></i>
                        <span class="account-name" id="accountName">ゲスト</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="account-menu" id="accountMenu">
                        <div class="account-menu-header">
                            <div class="account-menu-name" id="accountMenuName">ゲスト</div>
                            <div class="account-menu-role" id="accountMenuRole">-</div>
                        </div>
                        <div class="account-menu-divider"></div>
                        <a href="#" class="account-menu-item" onclick="showAccountSwitcher(); return false;">
                            <i class="fas fa-users"></i>
                            アカウント切り替え（デモ）
                        </a>
                        <a href="#" class="account-menu-item" onclick="showAccountSettings(); return false;">
                            <i class="fas fa-cog"></i>
                            アカウント設定
                        </a>
                        <a href="#" class="account-menu-item" onclick="handleLogout(); return false;">
                            <i class="fas fa-sign-out-alt"></i>
                            ログアウト
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- アカウント切り替えモーダル -->
<div class="account-switcher-modal" id="accountSwitcherModal">
    <div class="account-switcher-overlay" onclick="closeAccountSwitcher()"></div>
    <div class="account-switcher-content">
        <div class="account-switcher-header">
            <h3><i class="fas fa-users"></i> アカウント切り替え（デモ）</h3>
            <button class="account-switcher-close" onclick="closeAccountSwitcher()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="account-switcher-body">
            <p class="account-switcher-note">
                <i class="fas fa-info-circle"></i> デモ画面用：以下のアカウントに切り替えることができます
            </p>
            <div class="account-cards">
                <div class="account-card" onclick="switchAccount('admin')">
                    <div class="account-card-icon admin">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div class="account-card-info">
                        <div class="account-card-name">山田 太郎</div>
                        <div class="account-card-role">管理者</div>
                        <div class="account-card-email">yamada@example.com</div>
                    </div>
                    <div class="account-card-check" id="check-admin">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <div class="account-card" onclick="switchAccount('staff')">
                    <div class="account-card-icon staff">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="account-card-info">
                        <div class="account-card-name">鈴木 一郎</div>
                        <div class="account-card-role">担当者</div>
                        <div class="account-card-email">suzuki@example.com</div>
                    </div>
                    <div class="account-card-check" id="check-staff">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// ページごとのヘッダー設定
const headerConfigs = {
    'order-management': {
        title: '注文一覧・管理',
        actions: `
            <button class="btn btn-primary" onclick="downloadOrderTemplatePDF()">
                <span class="btn-icon"><i class="fas fa-download"></i></span>
                注文書テンプレートをダウンロード
            </button>
            <button class="btn btn-success" onclick="showNewFuneralForm()">
                <span class="btn-icon"><i class="fas fa-plus"></i></span>
                新規ご葬家
            </button>
            <button class="btn btn-outline" onclick="showApproverSettings()">
                <span class="btn-icon"><i class="fas fa-user-cog"></i></span>
                承認者設定
            </button>
            <button class="btn btn-outline" onclick="refreshOrderList()">
                <span class="btn-icon"><i class="fas fa-sync"></i></span>
                更新
            </button>
        `
    },
    'order-list': {
        title: '注文一覧（全件表示）',
        actions: `
            <button class="btn btn-outline" onclick="refreshOrderList()">
                <span class="btn-icon"><i class="fas fa-sync"></i></span>
                更新
            </button>
        `
    },
    'application-form': {
        title: '生花寄贈申し込みフォーム',
        actions: ''
    }
};

// ヘッダーを読み込んで挿入
function loadHeader() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
        
        // 現在のページに応じてヘッダーをカスタマイズ
        customizeHeader();
        
        // アカウント情報を読み込み
        loadAccountInfo();
    }
}

// 現在のページに応じてヘッダーをカスタマイズ
function customizeHeader() {
    const currentPage = getCurrentPageName();
    const config = headerConfigs[currentPage];
    
    if (config) {
        // ページタイトルを設定
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            let title = config.title;
            
            // 権限に応じてタイトルにバッジを追加
            const role = getCurrentUserRole();
            if (role === 'staff') {
                title += ' <span style="font-size: 0.7em; color: #1976d2; font-weight: normal;">[担当者モード・閲覧のみ]</span>';
            }
            
            pageTitle.innerHTML = title;
        }
        
        // ヘッダーアクションを設定
        const headerActions = document.getElementById('headerActions');
        if (headerActions && config.actions) {
            headerActions.innerHTML = config.actions;
        }
    }
}

// 現在のページ名を取得
function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    // ファイル名から拡張子を除去
    return page.replace('.html', '');
}

// ========================================
// アカウント情報管理機能
// ========================================

// アカウント情報を読み込む
function loadAccountInfo() {
    try {
        const accountData = localStorage.getItem('currentUser');
        if (accountData) {
            const user = JSON.parse(accountData);
            updateAccountDisplay(user);
            updateAccountSwitcherCheck(user.roleKey || 'admin');
        } else {
            // デフォルトユーザー（デモ用：管理者）
            const defaultUser = DEMO_ACCOUNTS.admin;
            updateAccountDisplay(defaultUser);
            // デモ用にデフォルトユーザーを保存
            localStorage.setItem('currentUser', JSON.stringify(defaultUser));
            updateAccountSwitcherCheck('admin');
        }
    } catch (e) {
        console.error('アカウント情報の読み込みに失敗しました:', e);
    }
}

// アカウント表示を更新
function updateAccountDisplay(user) {
    const accountNameElements = document.querySelectorAll('#accountName');
    const accountMenuNameElements = document.querySelectorAll('#accountMenuName');
    const accountMenuRoleElements = document.querySelectorAll('#accountMenuRole');
    
    accountNameElements.forEach(el => {
        if (el) el.textContent = user.name;
    });
    
    accountMenuNameElements.forEach(el => {
        if (el) el.textContent = user.name;
    });
    
    accountMenuRoleElements.forEach(el => {
        if (el) el.textContent = user.role || '-';
    });
}

// アカウントメニューの表示切替
function toggleAccountMenu() {
    const dropdown = document.querySelector('.account-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// ページのどこかをクリックしたらメニューを閉じる
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.account-dropdown');
    
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// アカウント設定を表示
function showAccountSettings() {
    alert('アカウント設定画面は準備中です。');
    const dropdown = document.querySelector('.account-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// ログアウト処理
function handleLogout() {
    if (confirm('ログアウトしますか？')) {
        // ログアウト処理（必要に応じてカスタマイズ）
        localStorage.removeItem('currentUser');
        alert('ログアウトしました。');
        
        // ログイン画面へのリダイレクト（実装されている場合）
        // window.location.href = 'login.html';
        
        // デモ用：ページをリロード
        window.location.reload();
    }
    
    const dropdown = document.querySelector('.account-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// ========================================
// アカウント切り替え機能（デモ用）
// ========================================

// アカウント切り替えモーダルを表示
function showAccountSwitcher() {
    const modal = document.getElementById('accountSwitcherModal');
    if (modal) {
        modal.classList.add('show');
        
        // 現在のアカウントにチェックマークを表示
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        updateAccountSwitcherCheck(currentUser.roleKey || 'admin');
    }
    
    // アカウントメニューを閉じる
    const dropdown = document.querySelector('.account-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// アカウント切り替えモーダルを閉じる
function closeAccountSwitcher() {
    const modal = document.getElementById('accountSwitcherModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// アカウントを切り替え
function switchAccount(roleKey) {
    const account = DEMO_ACCOUNTS[roleKey];
    if (account) {
        // ローカルストレージに保存
        localStorage.setItem('currentUser', JSON.stringify(account));
        
        // モーダルを閉じる
        closeAccountSwitcher();
        
        // 通知を表示してからページをリロード
        showNotification(`アカウントを「${account.name}（${account.role}）」に切り替えました`);
        
        // 権限制御を反映するため、少し待ってからリロード
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// アカウント切り替えモーダルのチェックマークを更新
function updateAccountSwitcherCheck(roleKey) {
    // すべてのチェックマークを非表示
    document.querySelectorAll('.account-card-check').forEach(check => {
        check.style.display = 'none';
    });
    
    // 選択されたアカウントのチェックマークを表示
    const checkElement = document.getElementById(`check-${roleKey}`);
    if (checkElement) {
        checkElement.style.display = 'flex';
    }
    
    // 選択されたカードを強調
    document.querySelectorAll('.account-card').forEach(card => {
        card.classList.remove('active');
    });
    const activeCard = document.querySelector(`.account-card[onclick*="${roleKey}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
}

// 通知を表示
function showNotification(message) {
    // 既存の通知があれば削除
    const existingNotification = document.querySelector('.account-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知要素を作成
    const notification = document.createElement('div');
    notification.className = 'account-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // ボディに追加
    document.body.appendChild(notification);
    
    // アニメーションで表示
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3秒後に非表示
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// 権限管理機能（グローバル）
// ========================================

// 現在のユーザー情報を取得
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            return JSON.parse(userData);
        }
    } catch (e) {
        console.error('ユーザー情報の取得に失敗しました:', e);
    }
    return DEMO_ACCOUNTS.admin; // デフォルトは管理者
}

// 現在のユーザーの権限レベルを取得
function getCurrentUserRole() {
    const user = getCurrentUser();
    return user.roleKey || 'admin';
}

// 権限チェック関数
function hasPermission(permission) {
    const role = getCurrentUserRole();
    
    const permissions = {
        admin: ['view', 'edit', 'delete', 'approve', 'approve_settings', 'all'],
        staff: ['view']
    };
    
    return permissions[role] && permissions[role].includes(permission);
}

// 管理者かどうか
function isAdmin() {
    return getCurrentUserRole() === 'admin';
}

// 担当者かどうか
function isStaff() {
    return getCurrentUserRole() === 'staff';
}

// DOMContentLoadedイベントでヘッダーを読み込む
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
});

