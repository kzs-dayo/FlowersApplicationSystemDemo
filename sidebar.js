// サイドバー共通JavaScript

// サイドバーのHTMLテンプレート
const sidebarHTML = `
<nav class="sidebar">
    <div class="sidebar-header">
        <h2>供花注文管理システム</h2>
    </div>
    <ul class="nav-menu">
        <li class="nav-item" data-page="application-form">
            <a href="application-form.html" class="nav-link">
                <span class="nav-icon"><i class="fas fa-edit"></i></span>
                申し込みフォーム
            </a>
        </li>
        <li class="nav-item" data-page="order-list">
            <a href="order-list.html" class="nav-link">
                <span class="nav-icon"><i class="fas fa-list"></i></span>
                注文一覧
            </a>
        </li>
        <li class="nav-item" data-page="order-management">
            <a href="order-management.html" class="nav-link">
                <span class="nav-icon"><i class="fas fa-list-alt"></i></span>
                注文管理（ご葬家別）
            </a>
        </li>
    </ul>
</nav>
`;

// サイドバーを読み込んで挿入
function loadSidebar() {
    // サイドバーコンテナを探して挿入
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = sidebarHTML;
        
        // 現在のページに対応するナビゲーション項目をアクティブにする
        setActiveNavItem();
        
        // 権限に応じてメニューを制御
        applyRoleBasedMenuRestrictions();
    }
}

// 権限に応じてメニュー項目を制御
function applyRoleBasedMenuRestrictions() {
    // header.jsのgetCurrentUserRole関数を使用
    if (typeof getCurrentUserRole !== 'function') {
        return; // 権限管理機能が読み込まれていない場合はスキップ
    }
    
    const role = getCurrentUserRole();
    
    // 承認者または担当者の場合、申し込みフォームと注文一覧を非表示
    if (role === 'approver' || role === 'staff') {
        // 申し込みフォームのメニュー項目を非表示
        const applicationFormItem = document.querySelector('.nav-item[data-page="application-form"]');
        if (applicationFormItem) {
            applicationFormItem.style.display = 'none';
        }
        
        // 注文一覧のメニュー項目を非表示
        const orderListItem = document.querySelector('.nav-item[data-page="order-list"]');
        if (orderListItem) {
            orderListItem.style.display = 'none';
        }
    }
}

// 現在のページに対応するナビゲーション項目をアクティブにする
function setActiveNavItem() {
    const currentPage = getCurrentPageName();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const pageName = item.getAttribute('data-page');
        if (pageName === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 現在のページ名を取得
function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    // ファイル名から拡張子を除去
    return page.replace('.html', '');
}

// DOMContentLoadedイベントでサイドバーを読み込む
document.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
});

