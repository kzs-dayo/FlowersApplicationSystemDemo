// 注文管理用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初期化
    initializeOrderManagement();
    
    // イベントリスナーの設定
    setupEventListeners();
    
    // データの更新
    updateOrderSummary();
    
    // 花代計算の初期化
    updateAllFlowerCalculations();
    
    // 設定モーダルの入力変更イベントリスナー
    const builtinLimitInput = document.getElementById('builtinLimitInput');
    if (builtinLimitInput) {
        builtinLimitInput.addEventListener('input', function() {
            if (currentEditingFlowerSettingsFuneralId) {
                updateSettingsPreview(currentEditingFlowerSettingsFuneralId);
            }
        });
    }
});

// 注文管理初期化
function initializeOrderManagement() {
    console.log('注文管理システムを初期化中...');
    
    // ご葬家グループの状態を初期化
    initializeFuneralGroups();
    
    // フィルター・検索機能の初期化
    initializeFilters();
    
    // チェックボックス機能の初期化
    initializeCheckboxes();
}

// ご葬家グループ初期化
function initializeFuneralGroups() {
    const funeralGroups = document.querySelectorAll('.funeral-group');
    
    funeralGroups.forEach((group, index) => {
        // 初期状態では全て展開
        group.classList.remove('collapsed');
        
        // 状態に応じてクラスを追加
        updateFuneralGroupStatus(group);
    });
}

// ご葬家グループの状態更新
function updateFuneralGroupStatus(group) {
    const orders = group.querySelectorAll('tbody tr');
    let hasActive = false;
    let hasCancelled = false;
    
    orders.forEach(order => {
        const status = order.getAttribute('data-status');
        
        if (status === 'active') {
            hasActive = true;
        } else if (status === 'cancelled') {
            hasCancelled = true;
        }
    });
    
    // 状態に応じてクラスを設定
    group.classList.remove('normal', 'has-cancelled', 'all-cancelled');
    
    if (!hasActive && hasCancelled) {
        group.classList.add('all-cancelled');
    } else if (hasCancelled) {
        group.classList.add('has-cancelled');
    } else {
        group.classList.add('normal');
    }
}

// イベントリスナー設定
function setupEventListeners() {
    // 全選択チェックボックス
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleSelectAll);
    }
    
    // グループチェックボックス
    const groupCheckboxes = document.querySelectorAll('.group-checkbox');
    groupCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleGroupSelection);
    });
    
    // 行チェックボックス
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleRowSelection);
    });
    
    // 一括操作ボタン
    setupBulkActionButtons();
}

// ご葬家グループの展開・収縮
function toggleFuneralGroup(groupId) {
    const group = document.querySelector(`[data-funeral-id="${groupId}"]`);
    if (!group) return;
    
    group.classList.toggle('collapsed');
    
    // アイコンの回転アニメーション
    const icon = group.querySelector('.expand-icon');
    if (icon) {
        icon.style.transform = group.classList.contains('collapsed') ? 
            'rotate(-90deg)' : 'rotate(0deg)';
    }
}

// 全ご葬家グループの展開
function expandAllGroups() {
    const groups = document.querySelectorAll('.funeral-group');
    groups.forEach(group => {
        group.classList.remove('collapsed');
        const icon = group.querySelector('.expand-icon');
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    });
}

// 全ご葬家グループの収縮
function collapseAllGroups() {
    const groups = document.querySelectorAll('.funeral-group');
    groups.forEach(group => {
        group.classList.add('collapsed');
        const icon = group.querySelector('.expand-icon');
        if (icon) {
            icon.style.transform = 'rotate(-90deg)';
        }
    });
}

// フィルター・検索機能初期化
function initializeFilters() {
    // フィルターイベントの設定は既存の関数を使用
    console.log('フィルター機能を初期化しました');
}

// チェックボックス機能初期化
function initializeCheckboxes() {
    updateBulkActionButtons();
}

// 全選択トグル
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const allCheckboxes = document.querySelectorAll('.row-checkbox');
    
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBulkActionButtons();
}

// グループ選択トグル
function toggleGroupSelection(event) {
    const groupCheckbox = event.target;
    const groupId = groupCheckbox.getAttribute('data-group');
    const groupCheckboxes = document.querySelectorAll(`[data-group="${groupId}"].row-checkbox`);
    
    groupCheckboxes.forEach(checkbox => {
        checkbox.checked = groupCheckbox.checked;
    });
    
    updateBulkActionButtons();
}

// 行選択トグル
function toggleRowSelection() {
    updateBulkActionButtons();
    updateGroupCheckboxes();
}

// グループチェックボックス状態更新
function updateGroupCheckboxes() {
    const groupCheckboxes = document.querySelectorAll('.group-checkbox');
    
    groupCheckboxes.forEach(groupCheckbox => {
        const groupId = groupCheckbox.getAttribute('data-group');
        const rowCheckboxes = document.querySelectorAll(`[data-group="${groupId}"].row-checkbox`);
        const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
        
        if (checkedCount === 0) {
            groupCheckbox.checked = false;
            groupCheckbox.indeterminate = false;
        } else if (checkedCount === rowCheckboxes.length) {
            groupCheckbox.checked = true;
            groupCheckbox.indeterminate = false;
        } else {
            groupCheckbox.checked = false;
            groupCheckbox.indeterminate = true;
        }
    });
}

// 一括操作ボタン設定
function setupBulkActionButtons() {
    const bulkCancelBtn = document.getElementById('bulkCancelBtn');
    const bulkReviveBtn = document.getElementById('bulkReviveBtn');
    
    if (bulkCancelBtn) {
        bulkCancelBtn.addEventListener('click', bulkCancel);
    }
    
    if (bulkReviveBtn) {
        bulkReviveBtn.addEventListener('click', bulkRevive);
    }
}

// 一括操作ボタン状態更新
function updateBulkActionButtons() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const bulkCancelBtn = document.getElementById('bulkCancelBtn');
    const bulkReviveBtn = document.getElementById('bulkReviveBtn');
    
    const hasSelection = checkedBoxes.length > 0;
    
    if (bulkCancelBtn) {
        bulkCancelBtn.disabled = !hasSelection;
        bulkCancelBtn.textContent = `一括キャンセル${hasSelection ? ` (${checkedBoxes.length}件)` : ''}`;
    }
    
    if (bulkReviveBtn) {
        bulkReviveBtn.disabled = !hasSelection;
        bulkReviveBtn.textContent = `一括復活${hasSelection ? ` (${checkedBoxes.length}件)` : ''}`;
    }
}

// 注文サマリー更新
function updateOrderSummary() {
    const groups = document.querySelectorAll('.funeral-group');
    
    groups.forEach(group => {
        updateGroupSummary(group);
    });
    
    updateOverallSummary();
}

// グループサマリー更新
function updateGroupSummary(group) {
    const orders = group.querySelectorAll('tbody tr');
    let totalAmount = 0;
    let orderCount = 0;
    let transferCount = 0;
    let onsiteCount = 0;
    let cancelledCount = 0;
    
    orders.forEach(order => {
        const status = order.getAttribute('data-status');
        const amountText = order.querySelector('.amount').textContent;
        const amount = parseInt(amountText.replace(/[¥,]/g, ''));
        const paymentBadge = order.querySelector('.payment-badge');
        const paymentMethod = paymentBadge ? paymentBadge.textContent : '';
        
        orderCount++;
        
        if (status === 'active') {
            totalAmount += amount;
            
            if (paymentMethod.includes('振込')) {
                transferCount++;
            } else if (paymentMethod.includes('現地')) {
                onsiteCount++;
            }
        } else if (status === 'cancelled') {
            cancelledCount++;
        }
    });
    
    // サマリー表示を更新
    const orderCountElement = group.querySelector('.summary-value');
    const totalAmountElement = group.querySelectorAll('.summary-value')[1];
    const paymentBadges = group.querySelector('.summary-badges');
    
    if (orderCountElement) {
        orderCountElement.textContent = `${orderCount}件`;
    }
    
    if (totalAmountElement) {
        totalAmountElement.textContent = `¥${totalAmount.toLocaleString()}`;
    }
    
    // 支払方法バッジを更新
    if (paymentBadges) {
        let badgeHTML = '';
        if (transferCount > 0) {
            badgeHTML += `<span class="payment-badge transfer">振込${transferCount}件</span>`;
        }
        if (onsiteCount > 0) {
            badgeHTML += `<span class="payment-badge onsite">現地${onsiteCount}件</span>`;
        }
        if (cancelledCount > 0) {
            badgeHTML += `<span class="payment-badge cancelled">キャンセル${cancelledCount}件</span>`;
        }
        paymentBadges.innerHTML = badgeHTML;
    }
}

// 全体サマリー更新
function updateOverallSummary() {
    const activeOrders = document.querySelectorAll('tr[data-status="active"]');
    const cancelledOrders = document.querySelectorAll('tr[data-status="cancelled"]');
    
    let totalAmount = 0;
    activeOrders.forEach(order => {
        const amountText = order.querySelector('.amount').textContent;
        const amount = parseInt(amountText.replace(/[¥,]/g, ''));
        totalAmount += amount;
    });
    
    // サマリーカードを更新
    updateElement('activeTotalOrders', activeOrders.length);
    updateElement('activeTotalAmount', `¥${totalAmount.toLocaleString()}`);
    updateElement('cancelledOrders', cancelledOrders.length);
}

// 要素更新ユーティリティ
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// 注文操作関数
function editOrder(orderNo) {
    console.log(`注文No.${orderNo}を修正`);
    showOrderEditModal(orderNo);
}

function cancelOrder(orderNo) {
    if (confirm(`注文No.${orderNo}をキャンセルしますか？`)) {
        console.log(`注文No.${orderNo}をキャンセル`);
        
        // 行の状態を更新
        const row = document.querySelector(`tr[data-order-id="${orderNo}"]`);
        if (row) {
            row.setAttribute('data-status', 'cancelled');
            row.classList.add('cancelled-row');
            
            // ステータスバッジを更新
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = 'status-badge cancelled';
                statusBadge.textContent = 'キャンセル';
            }
            
            // アクションボタンを更新
            const actionButtons = row.querySelector('.action-buttons');
            if (actionButtons) {
                actionButtons.innerHTML = `
                    <button class="btn btn-sm btn-outline" onclick="reviveOrder(${orderNo})">復活</button>
                    <button class="btn btn-sm btn-outline" onclick="viewOrderDetail(${orderNo})">詳細</button>
                `;
            }
            
            // グループ状態を更新
            const group = row.closest('.funeral-group');
            if (group) {
                updateFuneralGroupStatus(group);
                updateGroupSummary(group);
            }
            
            updateOverallSummary();
        }
        
        alert(`注文No.${orderNo}をキャンセルしました。`);
    }
}

function reviveOrder(orderNo) {
    if (confirm(`注文No.${orderNo}を復活させますか？`)) {
        console.log(`注文No.${orderNo}を復活`);
        
        // 行の状態を更新
        const row = document.querySelector(`tr[data-order-id="${orderNo}"]`);
        if (row) {
            row.setAttribute('data-status', 'active');
            row.classList.remove('cancelled-row');
            
            // ステータスバッジを更新
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = 'status-badge active';
                statusBadge.textContent = '有効';
            }
            
            // アクションボタンを更新
            const actionButtons = row.querySelector('.action-buttons');
            if (actionButtons) {
                actionButtons.innerHTML = `
                    <button class="btn btn-sm" onclick="editOrder(${orderNo})">修正</button>
                    <button class="btn btn-sm btn-outline" onclick="cancelOrder(${orderNo})">キャンセル</button>
                `;
            }
            
            // グループ状態を更新
            const group = row.closest('.funeral-group');
            if (group) {
                updateFuneralGroupStatus(group);
                updateGroupSummary(group);
            }
            
            updateOverallSummary();
        }
        
        alert(`注文No.${orderNo}を復活させました。`);
    }
}

function viewOrderDetail(orderNo) {
    console.log(`注文No.${orderNo}の詳細を表示`);
    // 詳細モーダルを表示
    showOrderDetailModal(orderNo);
}

// 詳細モーダル表示
function showOrderDetailModal(orderNo) {
    const modal = document.getElementById('orderDetailModal');
    if (modal) {
        document.getElementById('modalOrderNumber').textContent = orderNo;
        
        // 実際のアプリケーションではAPIからデータを取得
        // ここではサンプルデータを表示
        loadOrderDetailData(orderNo);
        
        openModal(modal);
    }
}

// 注文詳細データ読み込み
function loadOrderDetailData(orderNo) {
    // サンプルデータ
    const mockData = {
        orderDate: '2024/01/16',
        nameplate: '株式会社サンプル',
        amount: '¥16,500',
        fee: '¥2,200',
        payment: '振込',
        clientName: '山田花子',
        postalCode: '123-4567',
        address: '東京都渋谷区1-2-3',
        phone: '090-1234-5678',
        billingName: '株式会社サンプル',
        company: '株式会社サンプル',
        contact: '山田太郎',
        memo: '特記事項なし',
        status: '有効'
    };
    
    // モーダルにデータを設定
    document.getElementById('detailOrderDate').textContent = mockData.orderDate;
    document.getElementById('detailNameplate').textContent = mockData.nameplate;
    document.getElementById('detailAmount').textContent = mockData.amount;
    document.getElementById('detailFee').textContent = mockData.fee;
    document.getElementById('detailPayment').textContent = mockData.payment;
    document.getElementById('detailClientName').textContent = mockData.clientName;
    document.getElementById('detailPostalCode').textContent = mockData.postalCode;
    document.getElementById('detailAddress').textContent = mockData.address;
    document.getElementById('detailPhone').textContent = mockData.phone;
    document.getElementById('detailBillingName').textContent = mockData.billingName;
    document.getElementById('detailCompany').textContent = mockData.company;
    document.getElementById('detailContact').textContent = mockData.contact;
    document.getElementById('detailMemo').textContent = mockData.memo;
    document.getElementById('detailStatus').textContent = mockData.status;
}

// 一括操作
function bulkCancel() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const orderNos = Array.from(checkedBoxes).map(cb => {
        return cb.closest('tr').getAttribute('data-order-id');
    });
    
    if (orderNos.length === 0) {
        alert('キャンセルする注文を選択してください。');
        return;
    }
    
    if (confirm(`選択した${orderNos.length}件の注文をキャンセルしますか？`)) {
        orderNos.forEach(orderNo => {
            // キャンセル処理（UIの更新は個別のcancelOrder関数で実行）
            const row = document.querySelector(`tr[data-order-id="${orderNo}"]`);
            if (row && row.getAttribute('data-status') !== 'cancelled') {
                cancelOrderSilent(orderNo);
            }
        });
        
        // チェックボックスをクリア
        checkedBoxes.forEach(cb => cb.checked = false);
        updateBulkActionButtons();
        
        alert(`${orderNos.length}件の注文をキャンセルしました。`);
    }
}

function bulkRevive() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const orderNos = Array.from(checkedBoxes).map(cb => {
        return cb.closest('tr').getAttribute('data-order-id');
    });
    
    if (orderNos.length === 0) {
        alert('復活する注文を選択してください。');
        return;
    }
    
    if (confirm(`選択した${orderNos.length}件の注文を復活させますか？`)) {
        orderNos.forEach(orderNo => {
            // 復活処理（UIの更新は個別のreviveOrder関数で実行）
            const row = document.querySelector(`tr[data-order-id="${orderNo}"]`);
            if (row && row.getAttribute('data-status') === 'cancelled') {
                reviveOrderSilent(orderNo);
            }
        });
        
        // チェックボックスをクリア
        checkedBoxes.forEach(cb => cb.checked = false);
        updateBulkActionButtons();
        
        alert(`${orderNos.length}件の注文を復活させました。`);
    }
}

// サイレント操作（確認ダイアログなし）
function cancelOrderSilent(orderNo) {
    const row = document.querySelector(`tr[data-order-id="${orderNo}"]`);
    if (row) {
        row.setAttribute('data-status', 'cancelled');
        row.classList.add('cancelled-row');
        
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.className = 'status-badge cancelled';
            statusBadge.textContent = 'キャンセル';
        }
        
        const actionButtons = row.querySelector('.action-buttons');
        if (actionButtons) {
            actionButtons.innerHTML = `
                <button class="btn btn-sm btn-outline" onclick="reviveOrder(${orderNo})">復活</button>
                <button class="btn btn-sm btn-outline" onclick="viewOrderDetail(${orderNo})">詳細</button>
            `;
        }
        
        const group = row.closest('.funeral-group');
        if (group) {
            updateFuneralGroupStatus(group);
            updateGroupSummary(group);
        }
    }
}

function reviveOrderSilent(orderNo) {
    const row = document.querySelector(`tr[data-order-id="${orderNo}"]`);
    if (row) {
        row.setAttribute('data-status', 'active');
        row.classList.remove('cancelled-row');
        
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.className = 'status-badge active';
            statusBadge.textContent = '有効';
        }
        
        const actionButtons = row.querySelector('.action-buttons');
        if (actionButtons) {
            actionButtons.innerHTML = `
                <button class="btn btn-sm" onclick="editOrder(${orderNo})">修正</button>
                <button class="btn btn-sm btn-outline" onclick="cancelOrder(${orderNo})">キャンセル</button>
            `;
        }
        
        const group = row.closest('.funeral-group');
        if (group) {
            updateFuneralGroupStatus(group);
            updateGroupSummary(group);
        }
    }
}

// モーダル関連
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.add('show');
    // スタイルを強制的に設定
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '99999';
    document.body.style.overflow = 'hidden';
}

// 注文編集モーダル表示
function showOrderEditModal(orderNo) {
    const modal = document.getElementById('orderEditModal');
    if (!modal) return;
    
    // 注文番号を設定
    document.getElementById('editOrderNumber').textContent = orderNo;
    
    // 現在の注文データを取得
    const orderData = getOrderDataForEdit(orderNo);
    
    // フォームにデータを設定
    populateOrderEditForm(orderData);
    
    // 支払方法に応じて請求先セクションの表示/非表示を切り替え
    toggleBillingSection(orderData.paymentMethod);
    
    // 支払方法変更時のイベントリスナーを設定
    document.getElementById('editPaymentMethod').onchange = function() {
        toggleBillingSection(this.value);
    };
    
    // 注文編集モーダルのイベントリスナーを設定
    setupOrderEditModalEvents();
    
    openModal(modal);
}

// 編集用注文データ取得
function getOrderDataForEdit(orderNo) {
    // 実際のアプリケーションではAPIからデータを取得
    // ここではサンプルデータを返す
    const mockData = {
        12: {
            orderDate: '2024-01-16',
            nameplate: '株式会社サンプル',
            requester: '山田花子',
            contact: '090-1234-5678',
            amount: 16500,
            fee: 2200,
            paymentMethod: '振込',
            memo: '特記事項なし',
            billing: {
                name: '株式会社サンプル',
                company: '株式会社サンプル',
                contact: '山田太郎',
                address: '東京都渋谷区1-2-3'
            }
        },
        13: {
            orderDate: '2024-01-16',
            nameplate: '有限会社テスト商事',
            requester: '佐藤次郎',
            contact: '090-9876-5432',
            amount: 22000,
            fee: 0,
            paymentMethod: '現地',
            memo: '胡蝶蘭希望',
            billing: null
        }
    };
    
    return mockData[orderNo] || {
        orderDate: new Date().toISOString().split('T')[0],
        nameplate: '',
        requester: '',
        contact: '',
        amount: 0,
        fee: 0,
        paymentMethod: '振込',
        memo: '',
        billing: {
            name: '',
            company: '',
            contact: '',
            address: ''
        }
    };
}

// 編集フォームにデータを設定
function populateOrderEditForm(data) {
    document.getElementById('editOrderDate').value = data.orderDate;
    document.getElementById('editNameplate').value = data.nameplate;
    document.getElementById('editRequester').value = data.requester;
    document.getElementById('editContact').value = data.contact;
    document.getElementById('editAmount').value = data.amount;
    document.getElementById('editFee').value = data.fee;
    document.getElementById('editPaymentMethod').value = data.paymentMethod;
    document.getElementById('editMemo').value = data.memo;
    
    if (data.billing) {
        document.getElementById('editBillingName').value = data.billing.name || '';
        document.getElementById('editBillingCompany').value = data.billing.company || '';
        document.getElementById('editBillingContact').value = data.billing.contact || '';
        document.getElementById('editBillingAddress').value = data.billing.address || '';
    }
}

// 請求先セクションの表示/非表示切り替え
function toggleBillingSection(paymentMethod) {
    const billingSection = document.getElementById('billingSection');
    if (paymentMethod === '振込') {
        billingSection.style.display = 'block';
    } else {
        billingSection.style.display = 'none';
    }
}

// 注文編集保存
function saveOrderEdit() {
    const orderNo = document.getElementById('editOrderNumber').textContent;
    
    // フォームデータを取得
    const formData = {
        orderDate: document.getElementById('editOrderDate').value,
        nameplate: document.getElementById('editNameplate').value,
        requester: document.getElementById('editRequester').value,
        contact: document.getElementById('editContact').value,
        amount: parseInt(document.getElementById('editAmount').value),
        fee: parseInt(document.getElementById('editFee').value),
        paymentMethod: document.getElementById('editPaymentMethod').value,
        memo: document.getElementById('editMemo').value,
        billing: {
            name: document.getElementById('editBillingName').value,
            company: document.getElementById('editBillingCompany').value,
            contact: document.getElementById('editBillingContact').value,
            address: document.getElementById('editBillingAddress').value
        }
    };
    
    // バリデーション
    if (!formData.nameplate || !formData.requester || formData.amount <= 0) {
        alert('必須項目を入力してください。');
        return;
    }
    
    // 実際のアプリケーションではAPIにデータを送信
    console.log('注文編集データ:', formData);
    
    // テーブルの行を更新
    updateOrderRow(orderNo, formData);
    
    // モーダルを閉じる
    closeModal('orderEditModal');
    
    // 成功メッセージ
    alert(`注文No.${orderNo}を更新しました。`);
}

// テーブル行の更新
function updateOrderRow(orderNo, data) {
    const row = document.querySelector(`tr[data-order-id="${orderNo}"]`);
    if (!row) return;
    
    // 各セルの値を更新
    const cells = row.querySelectorAll('td');
    if (cells.length >= 7) {
        // 受注日
        cells[2].textContent = formatDate(data.orderDate);
        // 芳名板
        cells[3].textContent = data.nameplate;
        // 依頼者
        cells[4].textContent = data.requester;
        // 連絡先
        cells[5].textContent = data.contact;
        // 金額
        cells[6].querySelector('.amount').textContent = `¥${data.amount.toLocaleString()}`;
        // 手数料
        cells[7].querySelector('.fee').textContent = `¥${data.fee.toLocaleString()}`;
        // 支払方法
        const paymentBadge = cells[8].querySelector('.payment-badge');
        if (paymentBadge) {
            paymentBadge.className = `payment-badge ${data.paymentMethod === '振込' ? 'transfer' : 'onsite'}`;
            paymentBadge.textContent = data.paymentMethod;
        }
    }
    
    // グループサマリーを更新
    const group = row.closest('.funeral-group');
    if (group) {
        updateGroupSummary(group);
        updateOverallSummary();
    }
}

// 日付フォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
}

function editOrderFromModal() {
    const orderNo = document.getElementById('modalOrderNumber').textContent;
    closeModal('orderDetailModal');
    editOrder(orderNo);
}

function generateOrderFormFromModal() {
    const orderNo = document.getElementById('modalOrderNumber').textContent;
    closeModal('orderDetailModal');
    generateOrderForm(orderNo);
}

function printOrder() {
    const orderNo = document.getElementById('modalOrderNumber').textContent;
    console.log(`注文No.${orderNo}を印刷`);
    alert(`注文No.${orderNo}の印刷を実行します。`);
}

// モーダル外クリックで閉じる
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// その他のユーティリティ関数
function refreshOrderList() {
    console.log('注文一覧を更新中...');
    // 実際のアプリケーションではAPIからデータを再取得
    updateOrderSummary();
    alert('注文一覧を更新しました。');
}

function filterOrders() {
    console.log('注文をフィルタリング中...');
    // フィルタ機能の実装
}

function searchOrders() {
    console.log('注文を検索中...');
    // 検索機能の実装
}



// ドロップダウンメニュー制御
function toggleDropdown(groupId) {
    // 他のドロップダウンを閉じる
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    allDropdowns.forEach(dropdown => {
        if (dropdown.id !== `dropdown-${groupId}`) {
            dropdown.classList.remove('show');
        }
    });
    
    // 指定されたドロップダウンを切り替え
    const dropdown = document.getElementById(`dropdown-${groupId}`);
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// ドロップダウン外クリックで閉じる
document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
        const allDropdowns = document.querySelectorAll('.dropdown-menu');
        allDropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// 注文書生成
function generateOrderForm(orderNo) {
    console.log(`注文No.${orderNo}の注文書を生成`);
    
    // 注文データを取得（実際のアプリケーションではAPIから取得）
    const orderData = getOrderData(orderNo);
    
    // モーダルに注文書を表示
    showOrderFormModal(orderNo, orderData);
}

// 注文データ取得（サンプル）
function getOrderData(orderNo) {
    const mockData = {
        12: {
            orderDate: '2024/01/16',
            funeralFamily: '輝家',
            deceased: '輝 太郎',
            funeralDate: '2024/01/20',
            venue: 'セレモニーホール青山',
            nameplate: '株式会社サンプル',
            amount: 16500,
            fee: 2200,
            paymentMethod: '振込',
            client: {
                name: '山田花子',
                postalCode: '123-4567',
                address: '東京都渋谷区1-2-3',
                phone: '090-1234-5678',
                fax: ''
            },
            billing: {
                name: '株式会社サンプル',
                company: '株式会社サンプル',
                contact: '山田太郎',
                postalCode: '123-4567',
                address: '東京都渋谷区1-2-3',
                phone: '03-1234-5678',
                fax: '03-1234-5679'
            },
            memo: '特記事項なし'
        }
    };
    
    return mockData[orderNo] || mockData[12]; // デフォルトデータ
}

// 注文書モーダル表示
function showOrderFormModal(orderNo, orderData) {
    const modal = document.getElementById('orderFormModal');
    const orderFormNumber = document.getElementById('orderFormNumber');
    const orderFormContent = document.getElementById('orderFormContent');
    
    if (!modal || !orderFormNumber || !orderFormContent) return;
    
    orderFormNumber.textContent = orderNo;
    
    // 注文書HTML生成
    const orderFormHTML = generateOrderFormHTML(orderNo, orderData);
    orderFormContent.innerHTML = orderFormHTML;
    
    openModal(modal);
}

// 注文書HTML生成
function generateOrderFormHTML(orderNo, data) {
    const currentDate = new Date();
    const orderDate = new Date(data.orderDate);
    
    return `
        <div class="japanese-order-form">
            <!-- ヘッダー -->
            <div class="form-header">
                <h1 class="form-title">生花寄贈注文書</h1>
            </div>
            
            <!-- 故人・遺族情報 -->
            <div class="form-section recipient-info">
                <div class="form-row">
                    <span class="label">故人</span>
                    <span class="value">
                        <input type="text" class="form-input" value="${data.deceased}" data-field="deceased" readonly>
                    </span>
                    <span class="suffix">様</span>
                </div>
                <div class="form-row">
                    <span class="label">遺族代表 (喪主)</span>
                    <span class="value">
                        <input type="text" class="form-input" value="${data.funeralFamily}" data-field="funeralFamily" readonly>
                    </span>
                    <span class="suffix">様</span>
                </div>
            </div>
            
            <!-- 葬儀情報 -->
            <div class="form-section funeral-info">
                <div class="form-row">
                    <span class="label">式名</span>
                    <span class="value">
                        <input type="text" class="form-input" value="${data.funeralFamily}家のご葬儀" data-field="ceremonyName" readonly>
                    </span>
                </div>
                <div class="form-row">
                    <span class="label">葬儀開式日時</span>
                    <div class="datetime-group">
                        <input type="date" class="form-date-input" value="${currentDate.toISOString().split('T')[0]}" data-field="funeralDate">
                        <span class="time-part">開式</span>
                    </div>
                </div>
                <div class="form-row">
                    <span class="label">葬儀式場</span>
                    <span class="value venue">
                        <input type="text" class="form-input" value="${data.venue}" data-field="venue" readonly>
                    </span>
                </div>
            </div>
            
            <!-- 注文詳細 -->
            <div class="form-section order-details">
                <div class="form-row">
                    <span class="label">ご注文日</span>
                    <div class="date-group">
                        <input type="date" class="form-date-input" value="${orderDate.toISOString().split('T')[0]}" data-field="orderDate">
                    </div>
                </div>
                <div class="form-row amount-row">
                    <span class="label">金額</span>
                    <div class="amount-details">
                        <div class="amount-main">1件 ${data.amount.toLocaleString()}円</div>
                        <div class="amount-breakdown">
                            内訳:本体価格${(data.amount / 1.1).toFixed(0)}円、消費税(10%) ${(data.amount - data.amount / 1.1).toFixed(0)}円
                        </div>
                        <div class="amount-note">(本体価格は変更できます。別途消費税10%)</div>
                    </div>
                </div>
                <div class="form-row nameplate-row">
                    <span class="label">芳名板 記載内容</span>
                    <div class="nameplate-content horizontal">
                        <textarea class="form-textarea" data-field="nameplate" readonly>${data.nameplate}</textarea>
                    </div>
                    <div class="nameplate-note">※実際の芳名板は縦書となります。</div>
                </div>
            </div>
            
            <!-- 依頼者情報 -->
            <div class="form-section requester-info">
                <div class="form-row">
                    <span class="label">ご依頼者区分</span>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="clientType" value="individual" class="radio-input" ${data.client.type === 'individual' ? 'checked' : ''} onchange="toggleClientType()">
                            <span class="radio-custom"></span>
                            個人
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="clientType" value="company" class="radio-input" ${data.client.type === 'company' ? 'checked' : ''} onchange="toggleClientType()">
                            <span class="radio-custom"></span>
                            企業・団体
                        </label>
                    </div>
                </div>
                <div class="form-row">
                    <span class="label" id="clientNameLabel">(お名前)</span>
                    <span class="value">
                        <input type="text" class="form-input" value="${data.client.name}" data-field="clientName" readonly>
                    </span>
                </div>
                <div class="form-row" id="contactPersonRow" style="display: ${data.client.type === 'company' ? 'flex' : 'none'};">
                    <span class="label">担当者名</span>
                    <span class="value">
                        <input type="text" class="form-input" value="${data.client.contactPerson || ''}" data-field="clientContactPerson" readonly>
                    </span>
                </div>
                <div class="form-row">
                    <span class="label">(ご住所) 〒</span>
                    <span class="value">
                        <input type="text" class="form-input" value="${data.client.postalCode} ${data.client.address}" data-field="clientAddress" readonly>
                    </span>
                </div>
                <div class="form-row">
                    <span class="label">連絡先</span>
                </div>
                <div class="form-row">
                    <span class="label">(TEL)</span>
                    <span class="value">
                        <input type="tel" class="form-input" value="${data.client.phone}" data-field="clientPhone" readonly>
                    </span>
                </div>
                <div class="form-row">
                    <span class="label">(FAX)</span>
                    <span class="value">
                        <input type="tel" class="form-input" value="${data.client.fax || '-'}" data-field="clientFax" readonly>
                    </span>
                </div>
            </div>
            
            <!-- 支払方法 -->
            <div class="form-section payment-method">
                <div class="form-row">
                    <span class="label">お支払い方法</span>
                </div>
                <div class="payment-options">
                    <div class="payment-option">
                        <input type="radio" name="payment" value="transfer" ${data.paymentMethod === '振込' ? 'checked' : ''} class="payment-radio">
                        <span class="option-text">1. お振込み(請求書必要)</span>
                        <span class="option-detail">請求書の宛名: ${data.billing ? data.billing.name : data.client.name}</span>
                    </div>
                    <div class="payment-note">
                        ※弊社では、金融機関の振込明細書を領収書の代わりとさせていただいております。
                    </div>
                    <div class="payment-option">
                        <input type="radio" name="payment" value="onsite" ${data.paymentMethod === '現地' ? 'checked' : ''} class="payment-radio">
                        <span class="option-text">2. 現地にてお支払い</span>
                        <span class="option-detail">領収証の宛名: ${data.client.name}</span>
                    </div>
                </div>
            </div>
            
            <!-- 請求書送付先 -->
            <div class="form-section invoice-delivery">
                <div class="form-row">
                    <span class="label">請求書 ご送付先</span>
                </div>
                <div class="form-row">
                    <span class="label">ご依頼者と同じ</span>
                    <label class="checkbox-label">
                        <input type="checkbox" class="checkbox-input" id="sameAsClient" onchange="toggleBillingInfo()">
                        <span class="checkbox-custom"></span>
                    </label>
                </div>
                <div class="form-row">
                    <span class="label">(会社名・団体名)</span>
                    <span class="value">
                        <input type="text" class="form-input billing-input" value="${data.billing ? data.billing.company : ''}" data-field="billingCompany" readonly>
                    </span>
                </div>
                <div class="form-row">
                    <span class="label">(ご担当)</span>
                    <span class="value">
                        <input type="text" class="form-input billing-input" value="${data.billing ? data.billing.contact : ''}" data-field="billingContact" readonly>
                    </span>
                </div>

                <div class="form-row">
                    <span class="label">(ご住所) 〒</span>
                    <span class="value">
                        <input type="text" class="form-input billing-input" value="${data.billing ? data.billing.postalCode + ' ' + data.billing.address : data.client.postalCode + ' ' + data.client.address}" data-field="billingAddress" readonly>
                    </span>
                </div>
                <div class="form-row">
                    <span class="label">(TEL)</span>
                    <span class="value">
                        <input type="tel" class="form-input billing-input" value="${data.billing ? data.billing.phone : data.client.phone}" data-field="billingPhone" readonly>
                    </span>
                </div>
                <div class="form-row">
                    <span class="label">(FAX)</span>
                    <span class="value">
                        <input type="tel" class="form-input billing-input" value="${data.billing ? (data.billing.fax || '-') : (data.client.fax || '-')}" data-field="billingFax" readonly>
                    </span>
                </div>
            </div>
            
            <!-- 備考 -->
            <div class="form-section remarks">
                <div class="form-row">
                    <span class="label">備考</span>
                    <div class="remarks-content">${data.memo || ''}</div>
                </div>
            </div>
            
            <!-- 注意事項 -->
            <div class="form-section instructions">
                <ul class="instruction-list">
                    <li>上記の太枠の中をご記入ください。(芳名板1件ごとにご注文ください)</li>
                    <li>ご注文は葬儀の前日17時までに下記のFAX番号、またはメールアドレスまでお送りください。</li>
                    <li>ご寄贈いただいた生花は祭壇に組み入れいたします。芳名板を別途掲示いたします。</li>
                    <li>お振込みは、ご注文日から10日以内に振込手数料をご負担の上お振込ください。</li>
                </ul>
            </div>
            
            <!-- 連絡先情報 -->
            <div class="form-section contact-info">
                <div class="contact-details">
                    <div class="company-info">
                        <div class="company-name">株式会社 輝 生花寄贈センター</div>
                        <div class="contact-methods">
                            <span>FAX: 048-610-8370</span>
                            <span>mail: seika@cfc-kagayaki.co.jp</span>
                            <span>TEL 049-298-5089 (9:00~18:00)</span>
                        </div>
                    </div>
                    <div class="bank-info">
                        <div class="bank-title">お振込先</div>
                        <div class="bank-details">
                            <div>埼玉りそな銀行 坂戸支店 (店番398)</div>
                            <div>普通 5262488 株式会社 輝(かがやき)</div>
                        </div>
                    </div>
                    <div class="funeral-home-info">
                        <div>担当葬儀社:株式会社 輝(かがやき)<br>本社: 〒350-0219 埼玉県坂戸市片柳2331-2</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 依頼者区分切り替え
function toggleClientType() {
    const clientTypeRadios = document.querySelectorAll('input[name="clientType"]');
    const clientNameLabel = document.getElementById('clientNameLabel');
    const contactPersonRow = document.getElementById('contactPersonRow');
    const clientNameInput = document.querySelector('input[data-field="clientName"]');
    
    clientTypeRadios.forEach(radio => {
        if (radio.checked) {
            if (radio.value === 'company') {
                // 企業・団体の場合
                contactPersonRow.style.display = 'flex';
                clientNameLabel.textContent = '(企業・団体名)';
                clientNameInput.placeholder = '例: 株式会社〇〇';
            } else {
                // 個人の場合
                contactPersonRow.style.display = 'none';
                clientNameLabel.textContent = '(お名前)';
                clientNameInput.placeholder = '例: 山田 太郎';
            }
        }
    });
}

// 請求書宛先切り替え
function toggleBillingInfo() {
    const sameAsClientCheckbox = document.getElementById('sameAsClient');
    const billingInputs = document.querySelectorAll('.billing-input');
    const clientNameInput = document.querySelector('input[data-field="clientName"]');
    const clientAddressInput = document.querySelector('input[data-field="clientAddress"]');
    const clientPhoneInput = document.querySelector('input[data-field="clientPhone"]');
    
    if (sameAsClientCheckbox.checked) {
        // 依頼者と同じ場合
        billingInputs.forEach(input => {
            input.disabled = true;
            input.style.backgroundColor = '#f5f5f5';
            input.style.color = '#999';
        });
        
        // 依頼者情報を自動入力
        const billingCompanyInput = document.querySelector('input[data-field="billingCompany"]');
        const billingContactInput = document.querySelector('input[data-field="billingContact"]');
        const billingAddressInput = document.querySelector('input[data-field="billingAddress"]');
        const billingPhoneInput = document.querySelector('input[data-field="billingPhone"]');
        
        if (billingCompanyInput) billingCompanyInput.value = clientNameInput.value;
        if (billingContactInput) billingContactInput.value = '';
        if (billingAddressInput) billingAddressInput.value = clientAddressInput.value;
        if (billingPhoneInput) billingPhoneInput.value = clientPhoneInput.value;
    } else {
        // 別の宛先の場合
        billingInputs.forEach(input => {
            input.disabled = false;
            input.style.backgroundColor = '#fff';
            input.style.color = '#333';
        });
    }
}

// 編集モード切り替え
function toggleEditMode() {
    const editBtn = document.getElementById('editToggleBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const inputs = document.querySelectorAll('.japanese-order-form input, .japanese-order-form textarea');
    
    if (editBtn && editBtn.textContent.includes('編集')) {
        // 編集モードに切り替え
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
        
        inputs.forEach(input => {
            input.removeAttribute('readonly');
        });
    }
}

// 編集キャンセル
function cancelEdit() {
    const editBtn = document.getElementById('editToggleBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const inputs = document.querySelectorAll('.japanese-order-form input, .japanese-order-form textarea');
    
    if (editBtn) editBtn.style.display = 'inline-block';
    if (saveBtn) saveBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'none';
    
    inputs.forEach(input => {
        input.setAttribute('readonly', 'readonly');
    });
    
    // 元の値に戻す（実際の実装では元のデータから復元）
    location.reload();
}

// 保存
function saveOrderForm() {
    const inputs = document.querySelectorAll('.japanese-order-form input, .japanese-order-form textarea');
    const formData = {};
    
    inputs.forEach(input => {
        if (input.dataset.field) {
            formData[input.dataset.field] = input.value;
        }
    });
    
    // ここで実際の保存処理を行う
    console.log('保存するデータ:', formData);
    alert('注文書の内容を保存しました。');
    
    // 編集モードを終了
    const editBtn = document.getElementById('editToggleBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    if (editBtn) editBtn.style.display = 'inline-block';
    if (saveBtn) saveBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'none';
    
    inputs.forEach(input => {
        input.setAttribute('readonly', 'readonly');
    });
}

// 注文書印刷
function printOrderForm() {
    const orderFormContent = document.getElementById('orderFormContent');
    if (!orderFormContent) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>注文書</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; margin: 20px; }
                .order-form-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                .order-form-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; }
                .form-section { margin-bottom: 25px; border: 1px solid #ddd; padding: 15px; }
                .form-section h3 { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
                .form-row { display: flex; margin-bottom: 8px; }
                .form-label { font-weight: bold; min-width: 120px; margin-right: 15px; }
                .form-value { flex: 1; }
                .form-value.important { background: #fff3cd; padding: 4px 8px; font-weight: bold; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            ${orderFormContent.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// 注文書PDF保存
function downloadOrderFormPDF() {
    const orderNo = document.getElementById('orderFormNumber').textContent;
    console.log(`注文No.${orderNo}の注文書PDFを生成中...`);
    
    // 実際のアプリケーションではPDF生成ライブラリを使用
    alert(`注文No.${orderNo}の注文書PDFを保存します。\n実装時にはPDF生成ライブラリ（jsPDF等）を使用します。`);
}

// ご葬家別帳票生成関数
function generateFuneralInvoices(funeralId) {
    try {
        console.log('請求書作成開始:', funeralId);
        const funeralName = getFuneralName(funeralId);
        const orders = getFuneralOrders(funeralId, 'transfer'); // 振込払いのみ
        
        if (orders.length === 0) {
            alert('振込払いの注文がありません。');
            return;
        }
        
        const invoiceData = getFuneralInvoiceData(funeralId);
        showDocumentModal('請求書', funeralName, invoiceData, 'invoice');
    } catch (error) {
        console.error('請求書作成エラー:', error);
        alert('請求書の作成中にエラーが発生しました。コンソールを確認してください。');
    }
}

function generateFuneralReceipts(funeralId) {
    try {
        console.log('領収書作成開始:', funeralId);
        const funeralName = getFuneralName(funeralId);
        const orders = getFuneralOrders(funeralId, 'onsite'); // 現地払いのみ
        
        if (orders.length === 0) {
            alert('現地払いの注文がありません。');
            return;
        }
        
        const receiptData = getFuneralReceiptData(funeralId);
        showDocumentModal('領収書', funeralName, receiptData, 'receipt');
    } catch (error) {
        console.error('領収書作成エラー:', error);
        alert('領収書の作成中にエラーが発生しました。コンソールを確認してください。');
    }
}





// 請求書用宛名ラベル生成
function generateFuneralInvoiceLabels(funeralId) {
    const funeralName = getFuneralName(funeralId);
    const orders = getFuneralOrders(funeralId, 'transfer'); // 振込払いのみ（請求書送付対象）
    
    if (orders.length === 0) {
        alert('請求書送付対象の注文がありません。');
        return;
    }
    
    const labelData = getFuneralInvoiceLabelData(funeralId);
    showAddressLabelModal(funeralName, labelData, 'invoice');
}

// 領収書用宛名ラベル生成
function generateFuneralReceiptLabels(funeralId) {
    const funeralName = getFuneralName(funeralId);
    const orders = getFuneralOrders(funeralId, 'onsite'); // 現地払いのみ（領収書送付対象）
    
    if (orders.length === 0) {
        alert('領収書送付対象の注文がありません。');
        return;
    }
    
    const labelData = getFuneralReceiptLabelData(funeralId);
    showAddressLabelModal(funeralName, labelData, 'receipt');
}

// 既存の関数は後方互換性のため残す
function generateFuneralLabels(funeralId) {
    generateFuneralInvoiceLabels(funeralId);
}

// 請求書用宛名ラベルデータ取得
function getFuneralInvoiceLabelData(funeralId) {
    // 請求書〔要〕の注文から宛名情報を抽出
    const orders = getFuneralOrders(funeralId, 'transfer'); // 振込のみ（請求書対象）
    const labelData = [];
    
    orders.forEach(order => {
        // モックデータから請求先情報を生成
        const mockBillingData = generateMockBillingData(order);
        
        // 重複チェック（同じ請求先は1つのラベルのみ）
        const existingLabel = labelData.find(label => 
            label.company === mockBillingData.company && 
            label.contact === mockBillingData.contact
        );
        
        if (!existingLabel) {
            labelData.push({
                orderNo: order.orderNo,
                postalCode: mockBillingData.postalCode,
                address: mockBillingData.address,
                company: mockBillingData.company,
                contact: mockBillingData.contact,
                phone: mockBillingData.phone,
                documentType: '請求書'
            });
        }
    });
    
    return labelData;
}

// 領収書用宛名ラベルデータ取得
function getFuneralReceiptLabelData(funeralId) {
    // 領収書〔要〕の注文から宛名情報を抽出
    const orders = getFuneralOrders(funeralId, 'onsite'); // 現地払いのみ（領収書対象）
    const labelData = [];
    
    orders.forEach(order => {
        // モックデータから請求先情報を生成
        const mockBillingData = generateMockBillingData(order);
        
        // 重複チェック（同じ請求先は1つのラベルのみ）
        const existingLabel = labelData.find(label => 
            label.company === mockBillingData.company && 
            label.contact === mockBillingData.contact
        );
        
        if (!existingLabel) {
            labelData.push({
                orderNo: order.orderNo,
                postalCode: mockBillingData.postalCode,
                address: mockBillingData.address,
                company: mockBillingData.company,
                contact: mockBillingData.contact,
                phone: mockBillingData.phone,
                documentType: '領収書'
            });
        }
    });
    
    return labelData;
}

// 既存の関数は後方互換性のため残す
function getFuneralLabelData(funeralId) {
    return getFuneralInvoiceLabelData(funeralId);
}

// モック請求先データ生成
function generateMockBillingData(order) {
    const companies = [
        {
            company: '株式会社サンプル',
            contact: '営業部 田中様',
            postalCode: '100-0001',
            address: '東京都千代田区千代田1-1-1 サンプルビル3F',
            phone: '03-1234-5678'
        },
        {
            company: '有限会社テスト商事',
            contact: '',
            postalCode: '150-0002',
            address: '東京都渋谷区渋谷2-2-2 テストビル5F',
            phone: '03-2345-6789'
        },
        {
            company: order.nameplate, // 芳名板記載内容をそのまま使用
            contact: '総務部御中',
            postalCode: '160-0023',
            address: '東京都新宿区西新宿1-3-3 新宿ビル10F',
            phone: '03-3456-7890'
        }
    ];
    
    // 注文番号に基づいてランダムに選択
    const index = parseInt(order.orderNo) % companies.length;
    return companies[index];
}

// 宛名ラベルモーダル表示
function showAddressLabelModal(funeralName, labelData, documentType = 'invoice') {
    const modal = document.getElementById('addressLabelModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = generateAddressLabelHTML(funeralName, labelData, documentType);
    modal.style.display = 'block';
    
    // 初期プレビュー更新
    setTimeout(() => updateEnvelopePreview(), 100);
}

// 宛名ラベルHTML生成
function generateAddressLabelHTML(funeralName, labelData, documentType = 'invoice') {
    const documentTypeText = documentType === 'invoice' ? '請求書用' : '領収書用';
    const iconClass = documentType === 'invoice' ? 'fa-file-invoice-dollar' : 'fa-receipt';
    
    return `
        <div class="address-label-container">
            <div class="address-label-header">
                <div class="address-label-title"><i class="fas ${iconClass}"></i> ${documentTypeText}宛名ラベル印刷プレビュー</div>
                <div class="address-label-subtitle">${funeralName} - ${labelData.length}件の宛名ラベル</div>
            </div>
            
            <div class="print-options">
                <div class="envelope-settings">
                    <label><i class="fas fa-envelope"></i> 封筒サイズ:</label>
                    <select id="envelopeSize" onchange="updateEnvelopePreview()">
                        <option value="chou3" selected>長形3号封筒 (120×235mm)</option>
                        <option value="chou4">長形4号封筒 (90×205mm)</option>
                        <option value="kaku2">角形2号封筒 (240×332mm)</option>
                    </select>
                </div>
                <div class="font-settings">
                    <label><i class="fas fa-font"></i> フォントサイズ:</label>
                    <select id="fontSize" onchange="updateEnvelopePreview()">
                        <option value="small">小 (10pt)</option>
                        <option value="medium" selected>中 (12pt)</option>
                        <option value="large">大 (14pt)</option>
                    </select>
                </div>
            </div>
            
            
            <div class="address-label-preview" id="addressLabelPreview">
                ${labelData.map((label, index) => generateSingleLabelHTML(label, index + 1)).join('')}
            </div>
            
            <div class="address-label-actions">
                <button class="btn btn-secondary" onclick="printAddressLabels()">
                    <i class="fas fa-print"></i> 印刷
                </button>
                <button class="btn btn-outline" onclick="downloadLabelPDF()">
                    <i class="fas fa-file-pdf"></i> PDF出力
                </button>
                <button class="btn btn-outline" onclick="updateEnvelopePreview()">
                    <i class="fas fa-sync"></i> プレビュー更新
                </button>
            </div>
        </div>
    `;
}

// 個別ラベルHTML生成
function generateSingleLabelHTML(label, index) {
    const honorific = label.contact ? '様' : '御中';
    const recipientName = label.contact ? 
        `${label.company}<br><span class="contact-name">${label.contact}</span>` :
        `${label.company} ${honorific}`;
    
    return `
        <div class="envelope-preview" data-label-index="${index}">
            <div class="envelope-header">
                <span class="label-number">ラベル ${index}</span>
                <span class="order-ref">注文No.${label.orderNo}関連</span>
            </div>
            <div class="envelope-body">
                <div class="recipient-area">
                    <div class="postal-code">${label.postalCode}</div>
                    <div class="address">${label.address}</div>
                    <div class="recipient-name">${recipientName}</div>
                </div>
                <div class="sender-area">
                    <div class="sender-info-display">差出人情報</div>
                </div>
            </div>
        </div>
    `;
}

// 封筒プレビュー更新
function updateEnvelopePreview() {
    const envelopeSize = document.getElementById('envelopeSize')?.value || 'chou3';
    const fontSize = document.getElementById('fontSize')?.value || 'medium';
    const preview = document.getElementById('addressLabelPreview');
    
    if (!preview) return;
    
    // 差出人情報（固定値）
    const senderData = {
        postal: '350-0219',
        address: '埼玉県坂戸市片柳2331‐2',
        company: '株式会社輝',
        contact: ''
    };
    
    // 封筒サイズクラス適用
    preview.className = `address-label-preview envelope-${envelopeSize} font-${fontSize}`;
    
    // 差出人情報更新
    document.querySelectorAll('.sender-info-display').forEach(element => {
        const senderName = senderData.contact ? 
            `${senderData.company}<br>${senderData.contact}` :
            senderData.company;
            
        element.innerHTML = `
            <div class="sender-postal">${senderData.postal}</div>
            <div class="sender-address">${senderData.address}</div>
            <div class="sender-name">${senderName}</div>
        `;
    });
}

// 宛名ラベル印刷
function printAddressLabels() {
    updateEnvelopePreview(); // 最新情報で更新
    
    const printWindow = window.open('', '_blank');
    const envelopeSize = document.getElementById('envelopeSize').value;
    const fontSize = document.getElementById('fontSize').value;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <title>宛名ラベル印刷</title>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                ${getAddressLabelPrintCSS(envelopeSize, fontSize)}
            </style>
        </head>
        <body>
            <div class="print-container">
                ${document.getElementById('addressLabelPreview').innerHTML}
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // 印刷ダイアログを開く
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// ラベルPDF出力
function downloadLabelPDF() {
    updateEnvelopePreview();
    alert('PDF出力機能は開発中です。\n現在は印刷機能をご利用ください。\n\n印刷時のコツ:\n1. プリンター設定で「余白なし」を選択\n2. 用紙サイズを封筒サイズに合わせる\n3. 印刷の向きを確認してください');
}

// 印刷用CSS取得
function getAddressLabelPrintCSS(envelopeSize, fontSize) {
    const sizeSettings = {
        chou3: { width: '120mm', height: '235mm', padding: '8mm' },
        chou4: { width: '90mm', height: '205mm', padding: '6mm' },
        kaku2: { width: '240mm', height: '332mm', padding: '12mm' }
    };
    
    const fontSettings = {
        small: '10pt',
        medium: '12pt',
        large: '14pt'
    };
    
    const setting = sizeSettings[envelopeSize];
    const baseFontSize = fontSettings[fontSize];
    
    return `
        @page {
            margin: 0;
            size: ${setting.width} ${setting.height};
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "ヒラギノ角ゴ Pro", "Hiragino Kaku Gothic Pro", "Meiryo", "MS Gothic", sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .print-container {
            display: block;
        }
        
        .envelope-preview {
            width: ${setting.width};
            height: ${setting.height};
            position: relative;
            page-break-after: always;
            box-sizing: border-box;
            padding: ${setting.padding};
            border: none;
        }
        
        .envelope-preview:last-child {
            page-break-after: auto;
        }
        
        .envelope-header {
            display: none;
        }
        
        .envelope-body {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            position: relative;
        }
        
        .recipient-area {
            flex: 1;
            text-align: left;
            margin-top: 20mm;
        }
        
        .postal-code {
            font-size: calc(${baseFontSize} + 1pt);
            font-weight: bold;
            margin-bottom: 6mm;
            letter-spacing: 3px;
            color: #000;
        }
        
        .address {
            font-size: ${baseFontSize};
            line-height: 1.8;
            margin-bottom: 10mm;
            color: #000;
            max-width: 80mm;
        }
        
        .recipient-name {
            font-size: calc(${baseFontSize} + 3pt);
            font-weight: bold;
            line-height: 1.5;
            color: #000;
        }
        
        .contact-name {
            display: block;
            margin-top: 4mm;
            font-size: calc(${baseFontSize} + 1pt);
        }
        
        .sender-area {
            position: absolute;
            bottom: ${setting.padding};
            right: ${setting.padding};
            text-align: right;
            max-width: 60mm;
        }
        
        .sender-postal,
        .sender-address,
        .sender-name {
            font-size: calc(${baseFontSize} - 1pt);
            line-height: 1.6;
            margin-bottom: 2mm;
            color: #000;
        }
        
        .sender-name {
            font-weight: bold;
        }
    `;
}

function generateFuneralSummary(funeralId) {
    try {
        console.log('一覧表作成開始:', funeralId);
        const funeralName = getFuneralName(funeralId);
        const orders = getFuneralOrders(funeralId, 'all'); // 全注文
        
        if (orders.length === 0) {
            alert('一覧表対象の注文がありません。');
            return;
        }
        
        const summaryData = getFuneralSummaryData(funeralId);
        showExcelSummaryModal(funeralName, summaryData);
    } catch (error) {
        console.error('一覧表作成エラー:', error);
        alert('一覧表の作成中にエラーが発生しました。コンソールを確認してください。');
    }
}

// 一覧表データ取得（Excel用）
function getFuneralSummaryData(funeralId) {
    try {
        console.log('一覧表データ取得開始:', funeralId);
        
        const orders = getFuneralOrders(funeralId, 'all');
        console.log('取得した注文データ:', orders);
        
        if (typeof funeralInfoData === 'undefined') {
            throw new Error('funeralInfoDataが初期化されていません');
        }
        
        const funeralInfo = funeralInfoData[funeralId];
        
        if (!funeralInfo) {
            throw new Error(`ご葬家情報が見つかりません: ${funeralId}`);
        }
        
        console.log('取得したご葬家情報:', funeralInfo);
        
        // Excel用のデータ構造に変換（指定された項目に合わせて）
        const excelData = orders.map((order, index) => {
            console.log(`注文データ ${index}:`, order);
            
            // 必要なプロパティの確認
            if (!order.orderNo || !order.nameplate || !order.requester || !order.amount) {
                console.warn(`注文データ ${index} に不足している項目があります:`, order);
            }
            
            // モックデータの生成（実際の実装時は実データから取得）
            const mockData = generateMockExcelDataForNewFormat(order, index);
            
            // 金額の数値計算
            const amountNum = parseInt(order.amount.replace(/[¥,]/g, '')) || 0;
            const feeNum = 2200; // 固定手数料
            const amountMinusFee = amountNum - feeNum;
            
            return {
                no: order.orderNo,
                orderDate: mockData.orderDate, // 受注月日
                nameplate: order.nameplate, // 芳名板記載内容
                requester: order.requester, // 依頼者名（敬称略）
                postalCode: mockData.postalCode, // 郵便番号
                address: mockData.address, // 住所
                phoneNumber: mockData.phoneNumber, // 電話番号
                amount: order.amount, // 領収額（税込み）
                fee: '¥' + feeNum.toLocaleString(), // 事務手数料（税込み）
                amountMinusFee: '¥' + amountMinusFee.toLocaleString(), // 領収額－手数料（税込み）
                paymentMethod: order.paymentMethod, // お支払い
                remarks: mockData.remarks, // 備考
                receiptName: mockData.receiptName, // 領収証宛名
                invoiceStatus: mockData.invoiceStatus, // 請求書
                shippingDate: mockData.shippingDate, // 郵送日
                invoiceName: mockData.invoiceName, // 請求書宛名
                invoiceCompanyName: mockData.invoiceCompanyName, // 請求書封筒宛名会社名
                invoiceContactPerson: mockData.invoiceContactPerson, // 請求書封筒宛名担当者名
                invoicePostalCode: mockData.invoicePostalCode, // 郵便番号（請求書）
                invoiceAddress: mockData.invoiceAddress, // 住所（請求書）
                invoicePhoneNumber: mockData.invoicePhoneNumber, // 電話番号（請求書）
                // 計算用数値
                amountNum: amountNum,
                feeNum: feeNum,
                amountMinusFeeNum: amountMinusFee
            };
        });
        
        // 合計計算
        const totalAmount = excelData.reduce((sum, item) => sum + item.amountNum, 0);
        const totalFee = excelData.reduce((sum, item) => sum + item.feeNum, 0);
        const totalAmountMinusFee = excelData.reduce((sum, item) => sum + item.amountMinusFeeNum, 0);
        const totalCount = excelData.length;
        
        // 支払方法別集計
        const paymentSummary = {
            transfer: excelData.filter(item => item.paymentMethod && item.paymentMethod.includes('振込')).length,
            onsite: excelData.filter(item => item.paymentMethod && item.paymentMethod.includes('現地')).length
        };
        
        return {
            funeralInfo: funeralInfo,
            orders: excelData,
            summary: {
                totalCount: totalCount,
                totalAmount: totalAmount,
                totalFee: totalFee,
                totalAmountMinusFee: totalAmountMinusFee,
                paymentSummary: paymentSummary
            },
            createdDate: new Date().toLocaleDateString('ja-JP'),
            createdTime: new Date().toLocaleTimeString('ja-JP')
        };
        
    } catch (error) {
        console.error('一覧表データ取得エラー:', error);
        throw error;
    }
}

// Excel用モックデータ生成（新形式）
function generateMockExcelDataForNewFormat(order, index) {
    // 実際の実装時は実際のデータベースから取得
    const postalCodes = ['100-0001', '150-0002', '160-0023', '107-0062'];
    const addresses = [
        '東京都千代田区千代田1-1',
        '東京都渋谷区渋谷2-2-2',
        '東京都新宿区西新宿3-3-3',
        '東京都港区南青山4-4-4'
    ];
    const phones = ['03-1234-5678', '03-9876-5432', '03-5555-1111', '090-1234-5678'];
    const remarks = ['', '急ぎ', '会場確認済', ''];
    const receiptNames = [order.requester, order.requester, order.requester, order.requester];
    const invoiceStatuses = ['発行済', '未発行', '発行済', '不要'];
    const shippingDates = ['2024/01/25', '', '2024/01/26', ''];
    const invoiceNames = [order.requester, order.requester, order.requester, order.requester];
    const companyNames = ['', order.nameplate, '', order.nameplate];
    const contactPersons = [order.requester, '', order.requester, ''];
    
    const invoicePostalCodes = ['100-0001', '150-0002', '160-0023', '107-0062'];
    const invoiceAddresses = [
        '東京都千代田区千代田1-1-1',
        '東京都渋谷区渋谷2-2-2 ○○ビル3F',
        '東京都新宿区西新宿3-3-3',
        '東京都港区南青山4-4-4'
    ];
    const invoicePhones = ['03-1234-5678', '03-9876-5432', '03-5555-1111', '090-1234-5678'];
    
    return {
        orderDate: '2024/01/' + ((15 + index) % 28 + 1), // 受注月日
        postalCode: postalCodes[index % postalCodes.length],
        address: addresses[index % addresses.length],
        phoneNumber: phones[index % phones.length],
        remarks: remarks[index % remarks.length],
        receiptName: receiptNames[index % receiptNames.length],
        invoiceStatus: invoiceStatuses[index % invoiceStatuses.length],
        shippingDate: shippingDates[index % shippingDates.length],
        invoiceName: invoiceNames[index % invoiceNames.length],
        invoiceCompanyName: companyNames[index % companyNames.length],
        invoiceContactPerson: contactPersons[index % contactPersons.length],
        invoicePostalCode: invoicePostalCodes[index % invoicePostalCodes.length],
        invoiceAddress: invoiceAddresses[index % invoiceAddresses.length],
        invoicePhoneNumber: invoicePhones[index % invoicePhones.length]
    };
}

// Excel用モックデータ生成（旧形式・互換性のため残す）
function generateMockExcelData(order, index) {
    // 実際の実装時は実際のデータベースから取得
    const fees = ['¥500', '¥300', '¥700', '¥400'];
    const remarks = ['特になし', '急ぎ対応', '会場指定あり', '配置注意'];
    const locations = ['東京都港区青山1-1-1', '東京都渋谷区表参道2-2-2', '東京都新宿区西新宿3-3-3'];
    const phones = ['03-1234-5678', '03-9876-5432', '03-5555-1111'];
    const flowerTypes = ['菊', 'カーネーション', '胡蝶蘭', '百合'];
    const flowerSizes = ['大', '中', '小'];
    const arrangements = ['中央', '左側', '右側', '入口'];
    const deliveryTimes = ['9:00', '10:00', '11:00', '13:00', '14:00'];
    
    return {
        fee: fees[index % fees.length],
        remarks: remarks[index % remarks.length],
        receiptRequired: index % 3 === 0 ? '要' : '不要',
        invoiceRequired: index % 2 === 0 ? '要' : '不要',
        invoiceAddress: index % 2 === 0 ? `${order.requester || '不明'}様宅` : '会場受取',
        deliveryDate: '2024/01/20', // 葬儀日と同じ
        deliveryTime: deliveryTimes[index % deliveryTimes.length],
        deliveryLocation: '式場',
        flowerType: flowerTypes[index % flowerTypes.length],
        flowerSize: flowerSizes[index % flowerSizes.length],
        arrangement: arrangements[index % arrangements.length],
        location: locations[index % locations.length],
        phoneNumber: phones[index % phones.length]
    };
}

// Excel一覧表モーダル表示
function showExcelSummaryModal(funeralName, summaryData) {
    try {
        console.log('Excel一覧表モーダル表示開始:', funeralName);
        
        const modal = document.getElementById('documentModal');
        if (!modal) {
            throw new Error('documentModalが見つかりません');
        }
        
        const modalHeader = modal.querySelector('.modal-header h2');
        const modalBody = modal.querySelector('.modal-body');
        
        if (!modalHeader || !modalBody) {
            throw new Error('モーダル要素が見つかりません');
        }
        
        modalHeader.textContent = `Excel一覧表 - ${funeralName}`;
        
        // サマリーデータをグローバル変数として保存（CSV/TSV出力で使用）
        window.currentSummaryData = summaryData;
        
        // Excel用のHTMLを生成
        const htmlContent = generateExcelSummaryHTML(summaryData);
        modalBody.innerHTML = htmlContent;
        openModal(modal);
        
        console.log('Excel一覧表モーダル表示完了');
        
    } catch (error) {
        console.error('Excel一覧表モーダル表示エラー:', error);
        alert(`Excel一覧表の表示中にエラーが発生しました: ${error.message}`);
    }
}

// Excel一覧表HTML生成
function generateExcelSummaryHTML(data) {
    return `
        <div class="excel-summary-container">
            <!-- ヘッダー情報 -->
            <div class="excel-header">
                <div class="excel-title">
                    <h2><i class="fas fa-file-excel"></i> ${data.funeralInfo.name}家 ご葬儀 注文一覧表</h2>
                    <div class="excel-info">
                        <span class="excel-date">作成日時: ${data.createdDate} ${data.createdTime}</span>
                        <span class="excel-count">対象件数: ${data.summary.totalCount}件</span>
                    </div>
                </div>
                <div class="excel-actions">
                    <button class="btn btn-success" onclick="copyTableToClipboard()">
                        <i class="fas fa-copy"></i> 表をコピー
                    </button>
                    <button class="btn btn-outline" onclick="downloadExcelCSV()">
                        <i class="fas fa-download"></i> CSV出力
                    </button>
                </div>
            </div>
            
            <!-- 基本情報 -->
            <div class="excel-funeral-info">
                <div class="info-grid">
                    <div class="info-item">
                        <label>ご葬家:</label>
                        <span>${data.funeralInfo.name}家</span>
                    </div>
                    <div class="info-item">
                        <label>故人:</label>
                        <span>${data.funeralInfo.deceased}様</span>
                    </div>
                    <div class="info-item">
                        <label>葬儀日:</label>
                        <span>${data.funeralInfo.funeralDate}</span>
                    </div>
                    <div class="info-item">
                        <label>会場:</label>
                        <span>${data.funeralInfo.venue}</span>
                    </div>
                </div>
            </div>
            
            <!-- コピー用テーブル -->
            <div class="excel-table-container">
                <div class="table-header">
                    <h3><i class="fas fa-table"></i> 注文一覧（Excelにコピペ可能）</h3>
                    <div class="copy-instructions">
                        <i class="fas fa-info-circle"></i>
                        <span>下記の表を選択してコピー（Ctrl+C）後、Excelに貼り付け（Ctrl+V）してください</span>
                    </div>
                </div>
                
                <table id="excel-copy-table" class="excel-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>受注月日</th>
                            <th>芳名板記載内容</th>
                            <th>依頼者名（敬称略）</th>
                            <th>郵便番号</th>
                            <th>住所</th>
                            <th>電話番号</th>
                            <th>領収額（税込み）</th>
                            <th>事務手数料（税込み）</th>
                            <th>領収額－手数料（税込み）</th>
                            <th>お支払い</th>
                            <th>備考</th>
                            <th>領収証宛名</th>
                            <th>請求書</th>
                            <th>郵送日</th>
                            <th>請求書宛名</th>
                            <th>請求書封筒宛名会社名</th>
                            <th>請求書封筒宛名担当者名</th>
                            <th>郵便番号（請求書）</th>
                            <th>住所（請求書）</th>
                            <th>電話番号（請求書）</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.orders.map(order => `
                            <tr>
                                <td>${order.no}</td>
                                <td>${order.orderDate}</td>
                                <td>${order.nameplate}</td>
                                <td>${order.requester}</td>
                                <td>${order.postalCode}</td>
                                <td>${order.address}</td>
                                <td>${order.phoneNumber}</td>
                                <td>${order.amount}</td>
                                <td>${order.fee}</td>
                                <td>${order.amountMinusFee}</td>
                                <td>${order.paymentMethod}</td>
                                <td>${order.remarks}</td>
                                <td>${order.receiptName}</td>
                                <td>${order.invoiceStatus}</td>
                                <td>${order.shippingDate}</td>
                                <td>${order.invoiceName}</td>
                                <td>${order.invoiceCompanyName}</td>
                                <td>${order.invoiceContactPerson}</td>
                                <td>${order.invoicePostalCode}</td>
                                <td>${order.invoiceAddress}</td>
                                <td>${order.invoicePhoneNumber}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td><strong>合計</strong></td>
                            <td><strong>${data.summary.totalCount}件</strong></td>
                            <td colspan="5"></td>
                            <td><strong>¥${data.summary.totalAmount.toLocaleString()}</strong></td>
                            <td><strong>¥${data.summary.totalFee.toLocaleString()}</strong></td>
                            <td><strong>¥${data.summary.totalAmountMinusFee.toLocaleString()}</strong></td>
                            <td colspan="11"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;
}

// TSVコンテンツ生成
function generateTSVContent(data) {
    // ヘッダー行（指定された項目に合わせて）
    const headers = [
        'No', '受注月日', '芳名板記載内容', '依頼者名（敬称略）', '郵便番号', '住所', '電話番号',
        '領収額（税込み）', '事務手数料（税込み）', '領収額－手数料（税込み）', 'お支払い', '備考',
        '領収証宛名', '請求書', '郵送日', '請求書宛名', '請求書封筒宛名会社名', '請求書封筒宛名担当者名',
        '郵便番号（請求書）', '住所（請求書）', '電話番号（請求書）'
    ];
    
    // データ行
    const rows = data.orders.map(order => [
        order.no,
        order.orderDate,
        order.nameplate,
        order.requester,
        order.postalCode,
        order.address,
        order.phoneNumber,
        order.amount,
        order.fee,
        order.amountMinusFee,
        order.paymentMethod,
        order.remarks,
        order.receiptName,
        order.invoiceStatus,
        order.shippingDate,
        order.invoiceName,
        order.invoiceCompanyName,
        order.invoiceContactPerson,
        order.invoicePostalCode,
        order.invoiceAddress,
        order.invoicePhoneNumber
    ]);
    
    // 合計行
    const totalRow = [
        '合計',
        `${data.summary.totalCount}件`,
        '', '', '', '', '',
        `¥${data.summary.totalAmount.toLocaleString()}`,
        `¥${data.summary.totalFee.toLocaleString()}`,
        `¥${data.summary.totalAmountMinusFee.toLocaleString()}`,
        '', '', '', '', '', '', '', '', '', '', ''
    ];
    
    // TSV形式で結合（タブ区切り）
    const allRows = [headers, ...rows, totalRow];
    return allRows.map(row => row.join('\t')).join('\n');
}

// CSVコンテンツ生成
function generateCSVContent(data) {
    // ヘッダー行（指定された項目に合わせて）
    const headers = [
        'No', '受注月日', '芳名板記載内容', '依頼者名（敬称略）', '郵便番号', '住所', '電話番号',
        '領収額（税込み）', '事務手数料（税込み）', '領収額－手数料（税込み）', 'お支払い', '備考',
        '領収証宛名', '請求書', '郵送日', '請求書宛名', '請求書封筒宛名会社名', '請求書封筒宛名担当者名',
        '郵便番号（請求書）', '住所（請求書）', '電話番号（請求書）'
    ];
    
    // データ行（CSV用にカンマを含む可能性があるためクォートで囲む）
    const rows = data.orders.map(order => [
        `"${order.no}"`,
        `"${order.orderDate}"`,
        `"${order.nameplate}"`,
        `"${order.requester}"`,
        `"${order.postalCode}"`,
        `"${order.address}"`,
        `"${order.phoneNumber}"`,
        `"${order.amount}"`,
        `"${order.fee}"`,
        `"${order.amountMinusFee}"`,
        `"${order.paymentMethod}"`,
        `"${order.remarks}"`,
        `"${order.receiptName}"`,
        `"${order.invoiceStatus}"`,
        `"${order.shippingDate}"`,
        `"${order.invoiceName}"`,
        `"${order.invoiceCompanyName}"`,
        `"${order.invoiceContactPerson}"`,
        `"${order.invoicePostalCode}"`,
        `"${order.invoiceAddress}"`,
        `"${order.invoicePhoneNumber}"`
    ]);
    
    // 合計行
    const totalRow = [
        '"合計"',
        `"${data.summary.totalCount}件"`,
        '""', '""', '""', '""', '""',
        `"¥${data.summary.totalAmount.toLocaleString()}"`,
        `"¥${data.summary.totalFee.toLocaleString()}"`,
        `"¥${data.summary.totalAmountMinusFee.toLocaleString()}"`,
        '""', '""', '""', '""', '""', '""', '""', '""', '""', '""', '""'
    ];
    
    // CSV形式で結合（カンマ区切り）
    const allRows = [headers.map(h => `"${h}"`), ...rows, totalRow];
    return allRows.map(row => row.join(',')).join('\n');
}

// 表をクリップボードにコピー（TSV形式）
function copyTableToClipboard() {
    try {
        // 現在のサマリーデータを取得
        const summaryData = window.currentSummaryData;
        if (!summaryData) {
            alert('データが見つかりません。');
            return;
        }
        
        // TSVデータを生成
        const tsvContent = generateTSVContent(summaryData);
        
        // Clipboard API を使用してコピー（推奨）
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(tsvContent)
                .then(() => {
                    showCopySuccess('表をクリップボードにコピーしました！Excelに貼り付け（Ctrl+V）してください。');
                })
                .catch(err => {
                    console.error('Clipboard API エラー:', err);
                    // フォールバック処理
                    copyTableFallback(tsvContent);
                });
        } else {
            // フォールバック処理（古いブラウザ用）
            copyTableFallback(tsvContent);
        }
        
    } catch (error) {
        console.error('表コピーエラー:', error);
        alert('表のコピーに失敗しました。手動で表を選択してコピーしてください。');
    }
}

// フォールバック用コピー処理
function copyTableFallback(tsvContent) {
    try {
        // 一時的なテキストエリアを作成
        const textArea = document.createElement('textarea');
        textArea.value = tsvContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        // execCommandでコピー
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (success) {
            showCopySuccess('表をクリップボードにコピーしました！Excelに貼り付け（Ctrl+V）してください。');
        } else {
            throw new Error('コピーに失敗しました');
        }
    } catch (error) {
        console.error('フォールバックコピーエラー:', error);
        alert('表のコピーに失敗しました。手動で表を選択してコピーしてください。');
    }
}

// TSVをクリップボードにコピー
function copyTSVToClipboard() {
    try {
        const tsvElement = document.getElementById('tsv-preview');
        if (!tsvElement) {
            alert('TSVデータが見つかりません。');
            return;
        }
        
        // TSVテキストの選択
        const range = document.createRange();
        range.selectNode(tsvElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // クリップボードにコピー
        const success = document.execCommand('copy');
        selection.removeAllRanges();
        
        if (success) {
            showCopySuccess('TSVデータをクリップボードにコピーしました！Excelに貼り付け可能です。');
        } else {
            throw new Error('TSVコピーに失敗しました');
        }
        
    } catch (error) {
        console.error('TSVコピーエラー:', error);
        alert('TSVのコピーに失敗しました。手動でテキストを選択してコピーしてください。');
    }
}

// コピー成功メッセージ表示
function showCopySuccess(message) {
    // 既存の成功メッセージを削除
    const existingMessage = document.querySelector('.copy-success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 新しい成功メッセージを作成
    const successDiv = document.createElement('div');
    successDiv.className = 'copy-success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // モーダルの上部に表示
    const modal = document.getElementById('documentModal');
    const modalBody = modal.querySelector('.modal-body');
    modalBody.insertBefore(successDiv, modalBody.firstChild);
    
    // 3秒後に自動削除
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

// CSV出力
function downloadExcelCSV() {
    try {
        // 現在のサマリーデータを取得（グローバル変数から）
        const summaryData = window.currentSummaryData;
        if (!summaryData) {
            alert('データが見つかりません。');
            return;
        }
        
        const csvContent = generateCSVContent(summaryData);
        const fileName = `${summaryData.funeralInfo.name}家_注文一覧_${summaryData.createdDate.replace(/\//g, '')}.csv`;
        
        downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
        
        console.log('CSV出力完了:', fileName);
        
    } catch (error) {
        console.error('CSV出力エラー:', error);
        alert('CSV出力に失敗しました。');
    }
}

// TSV出力
function downloadExcelTSV() {
    try {
        // 現在のサマリーデータを取得（グローバル変数から）
        const summaryData = window.currentSummaryData;
        if (!summaryData) {
            alert('データが見つかりません。');
            return;
        }
        
        const tsvContent = generateTSVContent(summaryData);
        const fileName = `${summaryData.funeralInfo.name}家_注文一覧_${summaryData.createdDate.replace(/\//g, '')}.tsv`;
        
        downloadFile(tsvContent, fileName, 'text/tab-separated-values;charset=utf-8;');
        
        console.log('TSV出力完了:', fileName);
        
    } catch (error) {
        console.error('TSV出力エラー:', error);
        alert('TSV出力に失敗しました。');
    }
}

// ファイルダウンロード共通関数
function downloadFile(content, fileName, mimeType) {
    // BOMを付加（Excelでの文字化け防止）
    const bom = '\uFEFF';
    const blob = new Blob([bom + content], { type: mimeType });
    
    // ダウンロードリンクを作成
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    // ダウンロード実行
    document.body.appendChild(link);
    link.click();
    
    // クリーンアップ
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 花屋送信用一覧生成
function generateFloristOrder(funeralId) {
    const funeralName = getFuneralName(funeralId);
    const funeralData = getFuneralData(funeralId);
    const orders = getFuneralOrdersForFlorist(funeralId);
    
    if (orders.length === 0) {
        alert('有効な注文がありません。');
        return;
    }
    
    console.log(`${funeralName}の花屋送信用一覧を生成`);
    showFloristOrderModal(funeralId, funeralName, funeralData, orders);
}

// ご葬家データ取得（花屋送信用）
function getFuneralData(funeralId) {
    const funeralInfo = funeralInfoData[funeralId];
    if (!funeralInfo) {
        return {
            name: `ご葬家${funeralId}`,
            deceased: '故人名',
            date: '未定',
            venue: '会場未定',
            address: '住所未定'
        };
    }
    
    // 日付フォーマットを変換（YYYY/MM/DD → YYYY年MM月DD日）
    const formatDate = (dateStr) => {
        if (!dateStr) return '未定';
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[0]}年${parts[1]}月${parts[2]}日`;
        }
        return dateStr;
    };
    
    return {
        name: funeralInfo.name,
        deceased: funeralInfo.deceased,
        date: formatDate(funeralInfo.funeralDate),
        venue: funeralInfo.venue,
        address: '東京都渋谷区神宮前1-2-3' // 仮の住所（実際のシステムでは住所データも管理）
    };
}

// 花屋送信用注文データ取得
function getFuneralOrdersForFlorist(funeralId) {
    const group = document.querySelector(`[data-funeral-id="${funeralId}"]`);
    if (!group) return [];
    
    const rows = group.querySelectorAll('tbody tr');
    const orders = [];
    
    rows.forEach(row => {
        const orderNo = row.getAttribute('data-order-id');
        const status = row.getAttribute('data-status');
        
        // キャンセルされていない注文のみ
        if (status !== 'cancelled') {
            const nameplate = row.querySelector('td:nth-child(4)').textContent.trim();
            const client = row.querySelector('td:nth-child(5)').textContent.trim();
            const amount = row.querySelector('.amount').textContent.trim();
            
            // サンプル備考データ（実際のアプリケーションではデータベースから取得）
            const memoMap = {
                12: '白菊中心、リボンは黒',
                13: '胡蝶蘭希望、供花台設置要',
                14: '特大サイズ、金額表示なし',
                15: '事前搬入希望（前日17時まで）',
                11: '通常サイズ、白系統',
                16: '現地支払い、領収書必要',
                10: 'キャンセル分（参考）',
                17: '小型、スタンド式'
            };
            
            orders.push({
                orderNo,
                nameplate,
                client,
                amount,
                memo: memoMap[orderNo] || '特記事項なし'
            });
        }
    });
    
    return orders;
}

// 花屋送信用一覧モーダル表示
function showFloristOrderModal(funeralId, funeralName, funeralData, orders) {
    const modal = document.getElementById('floristOrderModal');
    const funeralNameSpan = document.getElementById('floristFuneralName');
    const floristOrderContent = document.getElementById('floristOrderContent');
    
    if (!modal || !funeralNameSpan || !floristOrderContent) return;
    
    funeralNameSpan.textContent = funeralName;
    
    // 花屋送信用一覧HTML生成
    const floristOrderHTML = generateFloristOrderHTML(funeralData, orders);
    floristOrderContent.innerHTML = floristOrderHTML;
    
    openModal(modal);
}

// 花屋送信用一覧HTML生成
function generateFloristOrderHTML(funeralData, orders) {
    const currentDate = new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    return `
        <div class="florist-order-header">
            <div class="florist-order-title"><i class="fas fa-seedling"></i> 生花注文一覧</div>
            <div class="florist-order-subtitle">作成日: ${currentDate}</div>
        </div>
        
        <div class="florist-order-info">
            <h3>ご葬儀情報</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">ご葬家名</span>
                    <span class="info-value highlight">${funeralData.name}のご葬儀</span>
                </div>
                <div class="info-item">
                    <span class="info-label">故人名</span>
                    <span class="info-value highlight">${funeralData.deceased}様</span>
                </div>
                <div class="info-item">
                    <span class="info-label">葬儀日程</span>
                    <span class="info-value">${funeralData.date}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">会場</span>
                    <span class="info-value">${funeralData.venue}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">会場住所</span>
                    <span class="info-value">${funeralData.address}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">注文件数</span>
                    <span class="info-value highlight">${orders.length}件</span>
                </div>
            </div>
        </div>
        
        <table class="florist-orders-table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>芳名板記載内容</th>
                    <th>ご依頼者</th>
                    <th>金額</th>
                    <th>備考・特記事項</th>
                    <th>花屋送信状況</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => {
                    const emailStatus = getOrderEmailStatus(order.orderNo);
                    const statusBadge = getEmailStatusBadge(emailStatus);
                    return `
                    <tr data-order-id="${order.orderNo}">
                        <td><span class="order-number">${order.orderNo}</span></td>
                        <td><div class="nameplate-content">${order.nameplate}</div></td>
                        <td>${order.client}</td>
                        <td>${order.amount}</td>
                        <td><div class="order-memo ${order.memo === '特記事項なし' ? 'empty' : ''}">${order.memo}</div></td>
                        <td>
                            <div class="email-status-cell">
                                <span class="email-status-badge ${emailStatus}" id="email-status-${order.orderNo}">${statusBadge}</span>
                                <button class="btn-status-toggle" onclick="toggleEmailStatus(${order.orderNo})" title="ステータスを変更">
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `}).join('')}
            </tbody>
        </table>
        
        <div class="florist-order-footer">
            <div class="florist-contact-info">
                <strong>【重要】</strong><br>
                ・生花の搬入は葬儀開始の2時間前までにお願いいたします<br>
                ・芳名板の文字は楷書体で、読みやすく記載してください<br>
                ・ご不明な点がございましたら下記までご連絡ください<br><br>
                <strong>連絡先:</strong> 生花受注センター<br>
                <strong>電話:</strong> 03-1234-5678<br>
                <strong>メール:</strong> orders@example.com
            </div>
        </div>
    `;
}

// 花屋送信用一覧印刷
function printFloristOrder() {
    const floristOrderContent = document.getElementById('floristOrderContent');
    if (!floristOrderContent) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>花屋送信用注文一覧</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; margin: 20px; line-height: 1.4; }
                .florist-order-header { text-align: center; border-bottom: 3px solid #4CAF50; padding-bottom: 20px; margin-bottom: 30px; }
                .florist-order-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; color: #2E7D32; }
                .florist-order-info { margin-bottom: 25px; border: 1px solid #ddd; padding: 15px; }
                .florist-order-info h3 { margin-bottom: 15px; color: #2E7D32; border-bottom: 2px solid #4CAF50; padding-bottom: 8px; }
                .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
                .info-item { margin-bottom: 10px; }
                .info-label { font-weight: bold; color: #555; font-size: 0.9rem; }
                .info-value { margin-top: 5px; padding: 5px 8px; background: #f5f5f5; border-radius: 4px; }
                .info-value.highlight { background: #e8f5e8; font-weight: bold; color: #2E7D32; }
                .florist-orders-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .florist-orders-table th { background: #4CAF50; color: white; padding: 12px 8px; text-align: left; font-weight: bold; }
                .florist-orders-table td { padding: 10px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
                .florist-orders-table tr:nth-child(even) { background-color: #f9f9f9; }
                .order-number { font-weight: bold; color: #2E7D32; }
                .nameplate-content { font-weight: bold; }
                .order-memo { color: #666; }
                .order-memo.empty { color: #999; font-size: 0.9rem; }
                .email-status-cell { display: flex; align-items: center; gap: 8px; }
                .email-status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; text-align: center; min-width: 70px; }
                .email-status-badge.unsent { background: #f5f5f5; color: #666; border: 1px solid #ddd; }
                .email-status-badge.sent { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                .email-status-badge.pending { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
                .email-status-badge.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
                .btn-status-toggle { display: none; }
                .florist-order-footer { border: 1px solid #ddd; padding: 15px; text-align: center; background: #f9f9f9; }
                .florist-contact-info { font-size: 0.9rem; line-height: 1.6; }
                @media print { body { margin: 0; } .btn-status-toggle { display: none !important; } }
            </style>
        </head>
        <body>
            ${floristOrderContent.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// 花屋送信用一覧PDF保存
function downloadFloristOrderPDF() {
    const funeralName = document.getElementById('floristFuneralName').textContent;
    console.log(`${funeralName}の花屋送信用一覧PDFを生成中...`);
    
    // 実際のアプリケーションではPDF生成ライブラリを使用
    alert(`${funeralName}の花屋送信用一覧PDFを保存します。\n実装時にはPDF生成ライブラリ（jsPDF等）を使用します。`);
}

// 花屋送信用一覧メール送信（eFAX対応）
function emailFloristOrder() {
    const funeralName = document.getElementById('floristFuneralName').textContent;
    const floristContent = document.getElementById('floristOrderContent');
    
    if (!floristContent) {
        alert('花屋送信用一覧の内容が見つかりません。');
        return;
    }
    
    // テーブル内の注文番号を取得
    const orderRows = floristContent.querySelectorAll('tbody tr[data-order-id]');
    const orderNumbers = Array.from(orderRows).map(row => parseInt(row.getAttribute('data-order-id')));
    
    // eFAX送信の確認
    if (confirm(`${funeralName}の花屋送信用一覧をeFAXで送信します。\n\n1. PDFファイルをダウンロードします\n2. メーラーが起動します\n3. ダウンロードしたPDFを手動で添付してください\n\n対象注文: ${orderNumbers.length}件\n\nよろしいですか？`)) {
        // すべての注文を「送信中」に設定
        orderNumbers.forEach(orderNo => {
            setOrderEmailStatus(orderNo, 'pending');
            updateEmailStatusUI(orderNo, 'pending');
        });
        
        // 1. まずPDFをダウンロード
        console.log(`${funeralName}の花屋送信用一覧PDFをダウンロード`);
        
        // PDFダウンロード処理（実際のPDF生成）
        // 実装時にはjsPDFなどのライブラリを使用してPDFを生成
        const pdfFileName = `花屋送信用一覧_${funeralName}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // 仮のダウンロード処理（実装例）
        // 実際の実装では、floristContentの内容をPDF化してダウンロード
        simulateFloristPDFDownload(floristContent, pdfFileName);
        
        // 2. 短い遅延の後、件名なしでメーラーを起動
        setTimeout(() => {
            const to = 'fax@example.com'; // eFAXの宛先アドレス（必要に応じて変更）
            
            // 件名なし、本文なしでメーラーを起動
            const mailtoLink = `mailto:${to}`;
            
            window.location.href = mailtoLink;
            
            // 案内メッセージと送信完了確認
            setTimeout(() => {
                if (confirm(`メーラーが起動しました。\n\nダウンロードしたPDFファイル「${pdfFileName}」を添付してeFAXを送信してください。\n\n送信が完了したら「OK」を、キャンセルした場合は「キャンセル」を押してください。`)) {
                    // 送信完了 - すべての注文を「送信済み」に設定
                    orderNumbers.forEach(orderNo => {
                        setOrderEmailStatus(orderNo, 'sent');
                        updateEmailStatusUI(orderNo, 'sent');
                    });
                    alert(`${orderNumbers.length}件の注文を「送信済み」に更新しました。`);
                } else {
                    // キャンセル - すべての注文を「未送信」に戻す
                    orderNumbers.forEach(orderNo => {
                        setOrderEmailStatus(orderNo, 'unsent');
                        updateEmailStatusUI(orderNo, 'unsent');
                    });
                }
            }, 1500);
        }, 1000);
    }
}

// 花屋送信用一覧PDF生成・ダウンロード（シミュレーション）
function simulateFloristPDFDownload(content, fileName) {
    // 実際の実装では、jsPDFなどを使ってPDFを生成
    // ここでは実装の準備として、HTML内容を取得
    
    console.log('PDFダウンロード準備:', fileName);
    
    // 実装例（jsPDFを使用する場合）:
    // const { jsPDF } = window.jspdf;
    // const doc = new jsPDF();
    // 
    // // テーブル内容をPDFに追加
    // doc.html(content, {
    //     callback: function(doc) {
    //         doc.save(fileName);
    //     }
    // });
    
    // 現時点では、テキストファイルとして保存する代替実装
    let textContent = '';
    const table = content.querySelector('table');
    if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach((row) => {
            const cells = row.querySelectorAll('th, td');
            const rowData = Array.from(cells).map(cell => cell.textContent.trim()).join('\t');
            textContent += rowData + '\n';
        });
    } else {
        textContent = content.textContent;
    }
    
    // Blobを作成してダウンロード（テキスト版）
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.pdf', '.txt'); // 実装時は.pdfに変更
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('ファイルをダウンロードしました（実装時はPDF形式になります）');
}

// メール送信ステータス管理
// ステータス: 'unsent' (未送信), 'sent' (送信済み), 'error' (エラー), 'pending' (送信中)
const emailStatusData = {
    // orderNo: status
    // 例: 10: 'sent', 11: 'unsent', ...
};

// 注文のメール送信ステータスを取得
function getOrderEmailStatus(orderNo) {
    return emailStatusData[orderNo] || 'unsent';
}

// 注文のメール送信ステータスを設定
function setOrderEmailStatus(orderNo, status) {
    emailStatusData[orderNo] = status;
    // ローカルストレージに保存（実装時）
    try {
        localStorage.setItem('emailStatusData', JSON.stringify(emailStatusData));
    } catch (e) {
        console.error('ステータスの保存に失敗しました:', e);
    }
}

// メール送信ステータスのバッジテキストを取得
function getEmailStatusBadge(status) {
    const badges = {
        'unsent': '未送信',
        'sent': '送信済み',
        'error': 'エラー',
        'pending': '送信中'
    };
    return badges[status] || '未送信';
}

// メール送信ステータスを切り替え
function toggleEmailStatus(orderNo) {
    const currentStatus = getOrderEmailStatus(orderNo);
    const statusCycle = {
        'unsent': 'sent',
        'sent': 'unsent',
        'error': 'unsent',
        'pending': 'unsent'
    };
    
    const newStatus = statusCycle[currentStatus] || 'unsent';
    setOrderEmailStatus(orderNo, newStatus);
    
    // UIを更新
    updateEmailStatusUI(orderNo, newStatus);
}

// メール送信ステータスのUIを更新
function updateEmailStatusUI(orderNo, status) {
    const badge = document.getElementById(`email-status-${orderNo}`);
    if (badge) {
        // 古いステータスクラスを削除
        badge.classList.remove('unsent', 'sent', 'error', 'pending');
        // 新しいステータスクラスを追加
        badge.classList.add(status);
        // バッジテキストを更新
        badge.textContent = getEmailStatusBadge(status);
    }
}

// ローカルストレージからメール送信ステータスを読み込み
function loadEmailStatusData() {
    try {
        const saved = localStorage.getItem('emailStatusData');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(emailStatusData, parsed);
        }
    } catch (e) {
        console.error('ステータスの読み込みに失敗しました:', e);
    }
}

// ページ読み込み時にステータスデータを読み込む
document.addEventListener('DOMContentLoaded', function() {
    loadEmailStatusData();
});

// ご葬家データ管理
const funeralInfoData = {
    1: {
        name: '輝家',
        deceased: '輝 太郎',
        funeralDate: '2024/01/20',
        venue: 'セレモニーホール青山',
        staff: '山田太郎',
        confirmedDate: '2024/01/18',
        flowerPayment: {
            mode: 'builtin', // 'builtin' or 'addon'
            builtinLimit: 50000 // 組込上限額（円）
        }
    },
    2: {
        name: '田中家',
        deceased: '田中 一郎',
        funeralDate: '2024/01/22',
        venue: '田中家自宅',
        staff: '佐藤花子',
        confirmedDate: '2024/01/19',
        flowerPayment: {
            mode: 'addon', // 'builtin' or 'addon'
            builtinLimit: 0
        }
    },
    3: {
        name: '佐藤家',
        deceased: '佐藤 次郎',
        funeralDate: '2024/01/25',
        venue: '佐藤記念会館',
        staff: '鈴木三郎',
        confirmedDate: '2024/01/22',
        flowerPayment: {
            mode: 'builtin',
            builtinLimit: 30000
        }
    }
};

// 花代処理設定変更（現在編集中のご葬家ID）
let currentEditingFlowerSettingsFuneralId = null;

// 花代処理設定編集モーダル表示
function editFlowerSettings(funeralId, event) {
    event.stopPropagation();
    
    const funeralInfo = funeralInfoData[funeralId];
    if (!funeralInfo) {
        alert('ご葬家情報が見つかりません。');
        return;
    }
    
    currentEditingFlowerSettingsFuneralId = funeralId;
    
    // モーダルに現在の設定を反映
    document.getElementById('settingsFuneralName').textContent = `${funeralInfo.name}のご葬儀`;
    
    const mode = funeralInfo.flowerPayment?.mode || 'builtin';
    const builtinLimit = funeralInfo.flowerPayment?.builtinLimit || 50000;
    
    // ラジオボタンの選択
    if (mode === 'builtin') {
        document.getElementById('modeBuiltin').checked = true;
    } else {
        document.getElementById('modeAddon').checked = true;
    }
    
    // 組込上限額の設定
    document.getElementById('builtinLimitInput').value = builtinLimit;
    
    // 組込上限額セクションの表示/非表示
    toggleBuiltinLimit();
    
    // プレビュー計算を更新
    updateSettingsPreview(funeralId);
    
    // モーダルを表示
    const modal = document.getElementById('flowerSettingsModal');
    openModal(modal);
}

// 組込上限額セクションの表示/非表示切り替え
function toggleBuiltinLimit() {
    const mode = document.querySelector('input[name="flowerMode"]:checked').value;
    const builtinSection = document.getElementById('builtinLimitSection');
    
    if (mode === 'builtin') {
        builtinSection.classList.remove('hidden');
    } else {
        builtinSection.classList.add('hidden');
    }
    
    // プレビューも更新
    if (currentEditingFlowerSettingsFuneralId) {
        updateSettingsPreview(currentEditingFlowerSettingsFuneralId);
    }
}

// 設定モーダルのプレビュー計算更新
function updateSettingsPreview(funeralId) {
    const mode = document.querySelector('input[name="flowerMode"]:checked').value;
    const builtinLimit = parseInt(document.getElementById('builtinLimitInput').value) || 0;
    
    // 注文データを取得（有効なもののみ）
    const orders = getFuneralOrders(funeralId, 'all');
    const activeOrders = orders.filter(order => {
        const row = document.querySelector(`tr[data-order-id="${order.orderNo}"]`);
        return row && row.getAttribute('data-status') === 'active';
    });
    
    // 生花合計を計算
    const flowerTotal = activeOrders.reduce((sum, order) => {
        const amount = parseInt(order.amount.replace(/[¥,]/g, '')) || 0;
        return sum + amount;
    }, 0);
    
    // 手数料合計（¥2,200 × 注文数）
    const feeTotal = activeOrders.length * 2200;
    
    // 総合計
    const grandTotal = flowerTotal + feeTotal;
    
    // 計算
    let deductAmount = 0;
    let addonAmount = 0;
    
    if (mode === 'builtin') {
        // 組み込み式：上限額まで葬儀代から引く、超過分はつけ花
        deductAmount = Math.min(grandTotal, builtinLimit);
        addonAmount = Math.max(0, grandTotal - builtinLimit);
    } else {
        // つけ花式：すべてつけ花
        deductAmount = 0;
        addonAmount = grandTotal;
    }
    
    // 税金計算（10%内税）
    const calculateTax = (amount) => Math.floor(amount * 10 / 110);
    const calculateExcludingTax = (amount) => amount - calculateTax(amount);
    
    const grandTotalTax = calculateTax(grandTotal);
    const grandTotalExcludingTax = calculateExcludingTax(grandTotal);
    const deductTax = calculateTax(deductAmount);
    const addonTax = calculateTax(addonAmount);
    
    // プレビュー表示を更新
    document.getElementById('previewFlowerTotal').textContent = `¥${flowerTotal.toLocaleString()}`;
    document.getElementById('previewOrderCount').textContent = activeOrders.length;
    document.getElementById('previewFeeTotal').textContent = `¥${feeTotal.toLocaleString()}`;
    document.getElementById('previewGrandTotal').textContent = `¥${grandTotal.toLocaleString()}`;
    document.getElementById('previewTotalTax').textContent = `¥${grandTotalTax.toLocaleString()}`;
    document.getElementById('previewTotalExcludingTax').textContent = `¥${grandTotalExcludingTax.toLocaleString()}`;
    document.getElementById('previewDeduct').textContent = `-¥${deductAmount.toLocaleString()}`;
    document.getElementById('previewDeductTax').textContent = `¥${deductTax.toLocaleString()}`;
    document.getElementById('previewAddon').textContent = `¥${addonAmount.toLocaleString()}`;
    document.getElementById('previewAddonTax').textContent = `¥${addonTax.toLocaleString()}`;
}

// 花代処理設定保存
function saveFlowerSettings() {
    if (!currentEditingFlowerSettingsFuneralId) {
        alert('設定対象が選択されていません。');
        return;
    }
    
    const mode = document.querySelector('input[name="flowerMode"]:checked').value;
    const builtinLimit = parseInt(document.getElementById('builtinLimitInput').value) || 0;
    
    // バリデーション
    if (mode === 'builtin' && builtinLimit <= 0) {
        alert('組込上限額は1円以上を入力してください。');
        return;
    }
    
    // データを保存
    funeralInfoData[currentEditingFlowerSettingsFuneralId].flowerPayment = {
        mode: mode,
        builtinLimit: builtinLimit
    };
    
    // 表示を更新
    updateFlowerPaymentDisplay(currentEditingFlowerSettingsFuneralId);
    
    // モーダルを閉じる
    closeModal('flowerSettingsModal');
    
    // 成功メッセージ
    const funeralName = funeralInfoData[currentEditingFlowerSettingsFuneralId].name;
    alert(`${funeralName}の花代処理設定を更新しました。`);
    
    currentEditingFlowerSettingsFuneralId = null;
}

// 花代処理設定表示更新
function updateFlowerPaymentDisplay(funeralId) {
    const funeralInfo = funeralInfoData[funeralId];
    if (!funeralInfo) return;
    
    const mode = funeralInfo.flowerPayment?.mode || 'builtin';
    
    // モードバッジを更新
    const modeBadgeElement = document.getElementById(`mode-badge-${funeralId}`);
    if (modeBadgeElement) {
        modeBadgeElement.textContent = mode === 'builtin' ? '組込式' : 'つけ花';
        modeBadgeElement.className = mode === 'builtin' 
            ? 'mode-badge-small builtin' 
            : 'mode-badge-small addon';
    }
    
    // 計算を実行して表示を更新
    updateFlowerCalculation(funeralId);
}

// 花代計算の実行と表示更新
function updateFlowerCalculation(funeralId) {
    const funeralInfo = funeralInfoData[funeralId];
    if (!funeralInfo) return;
    
    const mode = funeralInfo.flowerPayment?.mode || 'builtin';
    const builtinLimit = funeralInfo.flowerPayment?.builtinLimit || 50000;
    
    // 注文データを取得（有効なもののみ）
    const orders = getFuneralOrders(funeralId, 'all');
    const activeOrders = orders.filter(order => {
        const row = document.querySelector(`tr[data-order-id="${order.orderNo}"]`);
        return row && row.getAttribute('data-status') === 'active';
    });
    
    // 生花合計を計算
    const flowerTotal = activeOrders.reduce((sum, order) => {
        const amount = parseInt(order.amount.replace(/[¥,]/g, '')) || 0;
        return sum + amount;
    }, 0);
    
    // 手数料合計（¥2,200 × 有効注文数）
    const feeTotal = activeOrders.length * 2200;
    
    // 総合計（生花 + 手数料）
    const grandTotal = flowerTotal + feeTotal;
    
    // 計算
    let deductAmount = 0;
    let addonAmount = 0;
    
    if (mode === 'builtin') {
        // 組み込み式：上限額まで葬儀代から引く、超過分はつけ花
        deductAmount = Math.min(grandTotal, builtinLimit);
        addonAmount = Math.max(0, grandTotal - builtinLimit);
    } else {
        // つけ花式：すべてつけ花
        deductAmount = 0;
        addonAmount = grandTotal;
    }
    
    // 税金計算（10%内税）
    const calculateTax = (amount) => Math.floor(amount * 10 / 110);
    const deductTax = calculateTax(deductAmount);
    const addonTax = calculateTax(addonAmount);
    
    // インライン表示を更新（サマリー内）
    const deductElement = document.getElementById(`inline-deduct-${funeralId}`);
    const addonElement = document.getElementById(`inline-addon-${funeralId}`);
    const deductTaxElement = document.getElementById(`inline-deduct-tax-${funeralId}`);
    const addonTaxElement = document.getElementById(`inline-addon-tax-${funeralId}`);
    const deductItem = document.getElementById(`deduct-item-${funeralId}`);
    const addonItem = document.getElementById(`addon-item-${funeralId}`);
    const divider = document.getElementById(`divider-${funeralId}`);
    
    if (mode === 'builtin') {
        // 組込式：減額を常に表示、つけ花は超過分がある場合のみ
        if (deductElement) {
            deductElement.textContent = `-¥${deductAmount.toLocaleString()}`;
        }
        if (deductTaxElement) {
            deductTaxElement.textContent = `(内税¥${deductTax.toLocaleString()})`;
        }
        if (deductItem) {
            deductItem.style.display = 'flex';
        }
        
        if (addonAmount > 0) {
            // つけ花（超過分）あり
            if (addonElement) {
                addonElement.textContent = `¥${addonAmount.toLocaleString()}`;
            }
            if (addonTaxElement) {
                addonTaxElement.textContent = `(内税¥${addonTax.toLocaleString()})`;
            }
            if (addonItem) {
                addonItem.style.display = 'flex';
                // ラベルを「超過分・税込」に
                const label = addonItem.querySelector('.calc-detail-label');
                if (label) {
                    label.textContent = 'つけ花（超過分・税込）';
                }
            }
            if (divider) {
                divider.style.display = 'block';
            }
        } else {
            // つけ花なし（上限内に収まっている）
            if (addonItem) {
                addonItem.style.display = 'none';
            }
            if (divider) {
                divider.style.display = 'none';
            }
        }
    } else {
        // つけ花式：減額なし、すべてつけ花
        if (deductItem) {
            deductItem.style.display = 'none';
        }
        if (divider) {
            divider.style.display = 'none';
        }
        if (addonElement) {
            addonElement.textContent = `¥${addonAmount.toLocaleString()}`;
        }
        if (addonTaxElement) {
            addonTaxElement.textContent = `(内税¥${addonTax.toLocaleString()})`;
        }
        if (addonItem) {
            addonItem.style.display = 'flex';
            // ラベルを「全額・税込」に
            const label = addonItem.querySelector('.calc-detail-label');
            if (label) {
                label.textContent = 'つけ花（全額・税込）';
            }
        }
    }
}

// 全ご葬家の花代計算を更新
function updateAllFlowerCalculations() {
    Object.keys(funeralInfoData).forEach(funeralId => {
        updateFlowerCalculation(parseInt(funeralId));
    });
}

// 請求書データ取得
function getFuneralInvoiceData(funeralId) {
    try {
        console.log('請求書データ取得開始:', funeralId);
        
        const orders = getFuneralOrders(funeralId, 'transfer'); // 振込払いのみ
        console.log('注文取得完了:', orders);
        
        const funeralInfo = funeralInfoData[funeralId];
        if (!funeralInfo) {
            throw new Error(`ご葬家情報が見つかりません: ${funeralId}`);
        }
        console.log('ご葬家情報:', funeralInfo);
        
        // 支払期限（請求日から30日後）
        const issueDate = new Date();
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + 30);
        
        const totalAmount = orders.reduce((sum, order) => {
            const amount = parseInt(order.amount.replace(/[¥,]/g, '')) || 0;
            return sum + amount;
        }, 0);
        
        const totalFee = orders.reduce((sum, order) => {
            const fee = parseInt((order.fee || '¥0').replace(/[¥,]/g, '')) || 0;
            return sum + fee;
        }, 0);
        
        const result = {
            documentType: '請求書',
            documentNumber: `I-${new Date().getFullYear()}-${String(funeralId).padStart(4, '0')}`,
            issueDate: issueDate.toLocaleDateString('ja-JP'),
            dueDate: dueDate.toLocaleDateString('ja-JP'),
            funeralInfo: funeralInfo,
            orders: orders,
            totalAmount: totalAmount,
            totalFee: totalFee,
            paymentMethod: '銀行振込',
            companyInfo: {
                name: '株式会社 輝',
                address: '埼玉県坂戸市片柳2331-2',
                representative: '代表取締役 松崎充彦',
                phone: 'TEL 049-298-5089',
                registrationNumber: '登録番号 T3030001070615'
            },
            bankInfo: {
                bankName: '埼玉りそな銀行',
                branchName: '坂戸支店',
                branchCode: '(398)',
                accountType: '普通',
                accountNumber: '5262488',
                accountName: '株式会社 輝'
            },
            notes: [
                'このたびは、様ご葬儀に生花のご寄贈をご用命いただきありがとうございます。',
                '下記の通りご生花寄贈代金をご請求申し上げます。',
                'お振込みは、請求日から15日以内に振込手数料をご負担の上、お手配くださるよう宜しくお願い申し上げます。',
                '* 既にお振込みいただいておりましたら、失礼をご容赦ください。',
                'お振込みの際は、お振込人名の前に請求書の番号を入れてください。',
                '例) アS-123456-1 カガヤキ ハナコ'
            ]
        };
        
        console.log('請求書データ作成完了:', result);
        return result;
    } catch (error) {
        console.error('請求書データ取得エラー:', error);
        throw error;
    }
}

// 領収書データ取得
function getFuneralReceiptData(funeralId) {
    try {
        console.log('領収書データ取得開始:', funeralId);
        
        const orders = getFuneralOrders(funeralId, 'onsite'); // 現地払いのみ
        console.log('注文取得完了:', orders);
        
        const funeralInfo = funeralInfoData[funeralId];
        if (!funeralInfo) {
            throw new Error(`ご葬家情報が見つかりません: ${funeralId}`);
        }
        console.log('ご葬家情報:', funeralInfo);
        
        const totalAmount = orders.reduce((sum, order) => {
            const amount = parseInt(order.amount.replace(/[¥,]/g, '')) || 0;
            return sum + amount;
        }, 0);
        
        const totalFee = orders.reduce((sum, order) => {
            const fee = parseInt((order.fee || '¥0').replace(/[¥,]/g, '')) || 0;
            return sum + fee;
        }, 0);
        
        const result = {
            documentType: '領収書',
            documentNumber: `R-${new Date().getFullYear()}-${String(funeralId).padStart(4, '0')}`,
            issueDate: new Date().toLocaleDateString('ja-JP'),
            receiptDate: funeralInfo.funeralDate,
            funeralInfo: funeralInfo,
            orders: orders,
            totalAmount: totalAmount,
            totalFee: totalFee,
            paymentMethod: '現金',
            companyInfo: {
                name: '株式会社 輝',
                nameKana: '(かがやき)',
                address: '埼玉県坂戸市片柳2331-2',
                representative: '代表取締役 松崎充彦',
                phone: 'TEL049-298-5089',
                registrationNumber: '登録番号 T3030001070615'
            },
            notes: [
                '上記正に領収いたしました。'
            ]
        };
        
        console.log('領収書データ作成完了:', result);
        return result;
    } catch (error) {
        console.error('領収書データ取得エラー:', error);
        throw error;
    }
}





// 書類モーダル表示
function showDocumentModal(documentType, funeralName, documentData, modalType) {
    try {
        console.log('モーダル表示開始:', documentType, funeralName, modalType);
        
        const modal = document.getElementById('documentModal');
        if (!modal) {
            throw new Error('documentModalが見つかりません');
        }
        console.log('モーダル要素取得成功:', modal);
        
        const modalHeader = modal.querySelector('.modal-header h2');
        if (!modalHeader) {
            throw new Error('モーダルヘッダーが見つかりません');
        }
        
        const modalBody = modal.querySelector('.modal-body');
        if (!modalBody) {
            throw new Error('モーダルボディが見つかりません');
        }
        
        modalHeader.textContent = `${documentType} - ${funeralName}`;
        console.log('HTML生成開始...');
        
        // 元のデータをグローバル変数として保存（プレビュー更新で使用）
        window.currentDocumentData = documentData;
        
        // 注文選択機能付きのHTMLを生成
        const htmlContent = generateDocumentSelectionHTML(documentData, modalType);
        console.log('HTML生成完了');
        
        modalBody.innerHTML = htmlContent;
        openModal(modal);
        
        // 初期状態で全選択してプレビュー表示
        setTimeout(() => {
            selectAllOrders(modalType);
        }, 100);
        
        console.log('モーダル表示完了');
    } catch (error) {
        console.error('モーダル表示エラー:', error);
        alert(`モーダルの表示中にエラーが発生しました: ${error.message}`);
    }
}

// 注文選択機能付き書類HTML生成
function generateDocumentSelectionHTML(data, type) {
    const isInvoice = type === 'invoice';
    const isReceipt = type === 'receipt';
    
    return `
        <div class="document-selection-container">
            <!-- 注文選択セクション -->
            <div class="order-selection-section">
                <div class="selection-header">
                    <h3><i class="fas fa-list-check"></i> 対象注文の選択</h3>
                    <div class="selection-controls">
                        <button class="btn btn-sm btn-outline" onclick="selectAllOrders('${type}')">
                            <i class="fas fa-check-square"></i> 全選択
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="deselectAllOrders('${type}')">
                            <i class="fas fa-square"></i> 全解除
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="updateDocumentPreview('${type}')">
                            <i class="fas fa-sync"></i> プレビュー更新
                        </button>
                    </div>
                </div>
                
                <div class="order-selection-list">
                    <table class="selection-table">
                        <thead>
                            <tr>
                                <th width="50">選択</th>
                                <th width="80">No.</th>
                                <th>芳名板記載内容</th>
                                <th width="120">依頼者</th>
                                <th width="100">金額</th>
                                <th width="80">手数料</th>
                                <th width="100">支払方法</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.orders.map((order, index) => `
                                <tr>
                                    <td class="text-center">
                                        <input type="checkbox" 
                                               id="order-${index}" 
                                               class="order-checkbox" 
                                               data-order-index="${index}"
                                               onchange="updateDocumentPreview('${type}')"
                                               checked>
                                    </td>
                                    <td>${order.orderNo}</td>
                                    <td>${order.nameplate}</td>
                                    <td>${order.requester}</td>
                                    <td class="amount">${order.amount}</td>
                                    <td class="fee">${order.fee}</td>
                                    <td>
                                        <span class="payment-badge ${order.paymentMethod.includes('振込') ? 'transfer' : 'onsite'}">
                                            ${order.paymentMethod}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="selection-summary">
                    <div class="summary-info">
                        <span class="selected-count">選択: <strong id="selected-count-${type}">0</strong>件</span>
                        <span class="selected-total">合計: <strong id="selected-total-${type}">¥0</strong></span>
                        <span class="selected-fee">手数料計: <strong id="selected-fee-${type}">¥0</strong></span>
                    </div>
                </div>
            </div>
            
            <!-- プレビューセクション -->
            <div class="document-preview-section">
                <div class="preview-header">
                    <h3><i class="fas fa-eye"></i> ${data.documentType}プレビュー</h3>
                </div>
                <div id="document-preview-${type}" class="document-preview-content">
                    <!-- プレビュー内容はJavaScriptで動的に更新 -->
                </div>
            </div>
        </div>
        
        <!-- 操作ボタン -->
        <div class="document-actions">
            <button class="btn btn-secondary" onclick="printSelectedDocument('${type}')">
                <i class="fas fa-print"></i> 選択した注文の個別帳票を印刷
            </button>
            <button class="btn btn-outline" onclick="downloadSelectedDocumentPDF('${type}')">
                <i class="fas fa-file-pdf"></i> 個別PDF出力
            </button>
            <button class="btn btn-outline" onclick="emailSelectedDocument('${type}')">
                <i class="fas fa-envelope"></i> 個別メール送信
            </button>
        </div>
    `;
}

// 請求書HTML生成（画像レイアウト準拠）
function generateInvoiceHTML(data) {
    const totalAmount = data.totalAmount || 0;
    const taxAmount = Math.floor(totalAmount * 0.1);
    const subtotal = totalAmount - taxAmount;
    
    return `
        <div class="invoice-container">
            <!-- 日付 -->
            <div class="invoice-date">${data.issueDate}</div>
            
            <!-- 会社情報（右上） -->
            <div class="company-info-section">
                <div class="company-details">
                    <div class="company-name">${data.companyInfo.name}</div>
                    <div class="company-address">${data.companyInfo.address}</div>
                    <div class="company-representative">${data.companyInfo.representative}</div>
                    <div class="company-phone">${data.companyInfo.phone}</div>
                    <div class="company-registration">${data.companyInfo.registrationNumber}</div>
                </div>
                <div class="company-stamp">
                    <img src="image/印.png" alt="株式会社 輝 之印" class="stamp-image">
                </div>
            </div>
            
            <!-- メッセージセクション -->
            <div class="message-section">
                <div class="message-content">
                    <p>このたびは、${data.funeralInfo.deceased}様ご葬儀に生花のご寄贈をご用命いただきありがとうございます。</p>
                    <p>下記の通りご生花寄贈代金をご請求申し上げます。</p>
                    <p>お振込みは、請求日から15日以内に振込手数料をご負担の上、お手配くださるよう宜しくお願い申し上げます。</p>
                    <p class="apology-note">* 既にお振込みいただいておりましたら、失礼をご容赦ください。</p>
                </div>
            </div>
            
            <!-- 請求書タイトルセクション -->
            <div class="invoice-title-section">
                <div class="invoice-title">
                    <div class="title-mark">記</div>
                    <div class="title-text">請求書</div>
                    <div class="invoice-number-field">No. _____________</div>
                </div>
            </div>
            
            <!-- 請求詳細セクション -->
            <div class="billing-details-section">
                <div class="billing-amount">
                    <span class="amount-label">ご請求額</span>
                    <div class="amount-line"></div>
                </div>
                
                <div class="price-breakdown">
                    <div class="breakdown-box">
                        <div class="breakdown-row">
                            <span class="breakdown-label">内訳</span>
                            <span class="unit-price-label">本体価格</span>
                            <span class="unit-price-value">¥${subtotal.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-row">
                            <span class="tax-label">消費税10%</span>
                            <span class="tax-value">¥${taxAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="item-description">
                    <span class="description-prefix">但し、</span>
                    <span class="description-content">${data.funeralInfo.deceased} 様葬儀、生花寄贈 1 件分として</span>
                </div>
                
                <div class="nameplate-section">
                    <span class="nameplate-label">芳名板記載内容:</span>
                    <div class="nameplate-content">${data.orders.map(order => order.nameplate).join(', ')}</div>
                </div>
            </div>
            
            <!-- 銀行情報（枠付き） -->
            <div class="bank-info-section">
                <div class="bank-details">
                    <div class="bank-name">${data.bankInfo.bankName} ${data.bankInfo.branchName} ${data.bankInfo.branchCode} ${data.bankInfo.accountType}
                    <br>口座番号:${data.bankInfo.accountNumber} ${data.bankInfo.accountName}</div>
                </div>
            </div>
            
            <!-- 支払い指示 -->
            <div class="payment-instructions">
                <p>お振込みの際は、お振込人名の前に請求書の番号を入れてください。</p>
                <p class="payment-example">例) アS-123456-1 カガヤキ ハナコ</p>
            </div>
        </div>
    `;
}

// 領収書HTML生成（画像レイアウト準拠）
function generateReceiptHTML(data) {
    const totalAmount = data.totalAmount || 0;
    const taxAmount = Math.floor(totalAmount * 0.1);
    const subtotal = totalAmount - taxAmount;
    
    // 日付の曜日を取得
    const receiptDate = new Date(data.receiptDate);
    const dayOfWeek = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'][receiptDate.getDay()];
    const formattedDate = `${receiptDate.getFullYear()}年${receiptDate.getMonth() + 1}月${receiptDate.getDate()}日 ${dayOfWeek}`;
    
    return `
        <div class="receipt-container">
            <!-- ヘッダー部分 -->
            <div class="receipt-header">
                <div class="receipt-title">領収書</div>
                <div class="receipt-number-section">
                    <span class="recipient-label">様</span>
                    <span class="receipt-number">No ${data.documentNumber}</span>
                </div>
                <div class="tax-banner">
                    <span class="tax-text">(消費税10%込)</span>
                </div>
            </div>
            
            <!-- メインコンテンツ -->
            <div class="receipt-content">
                <!-- 左側：受領内容 -->
                <div class="receipt-left">
                    <div class="amount-section">
                        <span class="amount-label">但</span>
                        <span class="amount-value">¥${totalAmount.toLocaleString()}-</span>
                    </div>
                    
                    <div class="date-section">
                        ${formattedDate}
                    </div>
                    
                    <div class="description-section">
                        ${data.funeralInfo.deceased}様葬儀、生花寄贈代として
                    </div>
                    
                    <div class="receipt-confirmation">
                        ${data.notes[0]}
                    </div>
                    
                    <div class="breakdown-section">
                        <div class="breakdown-table">
                            <div class="breakdown-row">
                                <div class="breakdown-cell">消費税10%対象本体価格</div>
                                <div class="breakdown-cell amount">¥${subtotal.toLocaleString()}-</div>
                                <div class="breakdown-cell">消費税</div>
                                <div class="breakdown-cell amount">¥${taxAmount.toLocaleString()}-</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 右側：会社情報 -->
                <div class="receipt-right">
                    <div class="company-info">
                        <div class="company-name">${data.companyInfo.name}${data.companyInfo.nameKana}</div>
                        <div class="company-address">${data.companyInfo.address}</div>
                        <div class="company-representative">${data.companyInfo.representative}</div>
                        <div class="company-phone">${data.companyInfo.phone}</div>
                        <div class="company-registration">${data.companyInfo.registrationNumber}</div>
                    </div>
                    <div class="company-stamp">
                        <img src="image/印.png" alt="株式会社 輝 之印" class="stamp-image">
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 書類HTML生成
function generateDocumentHTML(data, type) {
    const isInvoice = type === 'invoice';
    const isReceipt = type === 'receipt';
    
    if (isInvoice) {
        return generateInvoiceHTML(data);
    }
    
    if (isReceipt) {
        return generateReceiptHTML(data);
    }
    
    return `
        <div class="document-container">
            <div class="document-header">
                <div class="document-title">
                    <h1>${data.documentType}</h1>
                    <div class="document-number">No. ${data.documentNumber}</div>
                </div>
                <div class="company-info">
                    <div class="company-name">○○生花店</div>
                    <div class="company-address">〒100-0001 東京都千代田区千代田1-1</div>
                    <div class="company-contact">TEL: 03-1234-5678 / FAX: 03-1234-5679</div>
                </div>
            </div>
            
            <div class="document-info">
                <div class="client-info">
                    <h3>お客様情報</h3>
                    <div class="info-row">
                        <label>ご葬家:</label>
                        <span>${data.funeralInfo.name}家</span>
                    </div>
                    <div class="info-row">
                        <label>故人:</label>
                        <span>${data.funeralInfo.deceased}様</span>
                    </div>
                    <div class="info-row">
                        <label>葬儀日:</label>
                        <span>${data.funeralInfo.funeralDate}</span>
                    </div>
                    <div class="info-row">
                        <label>会場:</label>
                        <span>${data.funeralInfo.venue}</span>
                    </div>
                </div>
                
                <div class="document-dates">
                    <div class="date-row">
                        <label>${isReceipt ? '領収日' : '発行日'}:</label>
                        <span>${data.issueDate}</span>
                    </div>
                    ${isInvoice ? `
                        <div class="date-row due">
                            <label>支払期限:</label>
                            <span class="due-date">${data.dueDate}</span>
                        </div>
                    ` : ''}
                    ${isReceipt ? `
                        <div class="date-row receipt">
                            <label>受領日:</label>
                            <span>${data.receiptDate}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            ${isInvoice ? `
                <div class="bank-info">
                    <h3>お振込先</h3>
                    <div class="bank-details">
                        <div class="bank-row">
                            <label>銀行名:</label>
                            <span>${data.bankInfo.bankName}</span>
                        </div>
                        <div class="bank-row">
                            <label>支店名:</label>
                            <span>${data.bankInfo.branchName}</span>
                        </div>
                        <div class="bank-row">
                            <label>口座種別:</label>
                            <span>${data.bankInfo.accountType}</span>
                        </div>
                        <div class="bank-row">
                            <label>口座番号:</label>
                            <span>${data.bankInfo.accountNumber}</span>
                        </div>
                        <div class="bank-row">
                            <label>口座名義:</label>
                            <span>${data.bankInfo.accountName}</span>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="document-content">
                <h3>${isInvoice ? 'ご請求内容' : isReceipt ? '領収内容' : '内容'}</h3>
                <table class="document-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>芳名板記載内容</th>
                            <th>依頼者</th>
                            <th>金額</th>
                            <th>手数料</th>
                            <th>支払方法</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.orders.map(order => `
                            <tr>
                                <td>${order.orderNo}</td>
                                <td>${order.nameplate}</td>
                                <td>${order.requester}</td>
                                <td class="amount">${order.amount}</td>
                                <td class="fee">${order.fee}</td>
                                <td>
                                    <span class="payment-badge ${order.paymentMethod === '振込' ? 'transfer' : 'onsite'}">
                                        ${order.paymentMethod}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="3"><strong>合計</strong></td>
                            <td class="amount"><strong>¥${data.totalAmount.toLocaleString()}</strong></td>
                            <td class="fee"><strong>¥${data.totalFee.toLocaleString()}</strong></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <div class="document-notes">
                <h4>備考</h4>
                <ul>
                    ${data.notes.map(note => `<li>${note}</li>`).join('')}
                </ul>
            </div>
            
            <div class="document-actions">
                <button class="btn btn-secondary" onclick="printDocument('${type}')">
                    <i class="fas fa-print"></i> 印刷
                </button>
                <button class="btn btn-outline" onclick="downloadDocumentPDF('${type}')">
                    <i class="fas fa-file-pdf"></i> PDF出力
                </button>
                <button class="btn btn-outline" onclick="emailDocument('${type}')">
                    <i class="fas fa-envelope"></i> メール送信
                </button>
            </div>
        </div>
    `;
}

// 注文選択制御関数
function selectAllOrders(type) {
    const checkboxes = document.querySelectorAll('.order-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    updateDocumentPreview(type);
}

function deselectAllOrders(type) {
    const checkboxes = document.querySelectorAll('.order-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateDocumentPreview(type);
}

// 選択状態に基づくプレビュー更新（個別帳票として生成）
function updateDocumentPreview(type) {
    try {
        const checkboxes = document.querySelectorAll('.order-checkbox:checked');
        const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.orderIndex));
        
        // 元のデータを取得（グローバル変数として保存）
        const originalData = window.currentDocumentData;
        if (!originalData) {
            console.error('元のドキュメントデータが見つかりません');
            console.error('window.currentDocumentData:', window.currentDocumentData);
            return;
        }
        
        console.log('プレビュー更新開始:', {
            type: type,
            originalData: originalData,
            ordersCount: originalData.orders?.length || 0
        });
        
        // 選択された注文のみでデータを作成
        const selectedOrders = selectedIndices.map(index => {
            const order = originalData.orders[index];
            if (!order) {
                console.warn(`注文データが見つかりません: index=${index}`);
                return null;
            }
            return order;
        }).filter(order => order !== null);
        
        console.log('選択された注文:', {
            selectedIndices: selectedIndices,
            selectedOrders: selectedOrders,
            originalOrdersCount: originalData.orders?.length || 0
        });
        
        // 金額を再計算（サマリー表示用）
        const totalAmount = selectedOrders.reduce((sum, order) => {
            const amount = parseInt(order.amount.replace(/[¥,]/g, '')) || 0;
            return sum + amount;
        }, 0);
        
        const totalFee = selectedOrders.reduce((sum, order) => {
            const fee = parseInt((order.fee || '¥0').replace(/[¥,]/g, '')) || 0;
            return sum + fee;
        }, 0);
        
        // 選択状態のサマリーを更新（要素が存在する場合のみ）
        const countElement = document.getElementById(`selected-count-${type}`);
        const totalElement = document.getElementById(`selected-total-${type}`);
        const feeElement = document.getElementById(`selected-fee-${type}`);
        
        if (countElement) countElement.textContent = selectedOrders.length;
        if (totalElement) totalElement.textContent = `¥${totalAmount.toLocaleString()}`;
        if (feeElement) feeElement.textContent = `¥${totalFee.toLocaleString()}`;
        
        // プレビューエリアを更新
        const previewContainer = document.getElementById(`document-preview-${type}`);
        if (!previewContainer) {
            console.warn(`プレビューエリアが見つかりません: document-preview-${type}`);
            return;
        }
        
        if (selectedOrders.length === 0) {
            previewContainer.innerHTML = `
                <div class="no-selection-message">
                    <i class="fas fa-info-circle"></i>
                    <p>注文を選択してください</p>
                </div>
            `;
        } else {
            try {
                // 各注文に対して個別の帳票を生成
                const individualDocuments = selectedOrders.map((order, index) => {
                    const orderAmount = parseInt(order.amount.replace(/[¥,]/g, '')) || 0;
                    const orderFee = parseInt((order.fee || '¥0').replace(/[¥,]/g, '')) || 0;
                    
                    // 個別注文用のデータオブジェクトを作成
                    const individualData = {
                        ...originalData,
                        orders: [order], // 1つの注文のみ
                        totalAmount: orderAmount,
                        totalFee: orderFee,
                        documentNumber: generateIndividualDocumentNumber(originalData.documentNumber, index + 1, selectedOrders.length)
                    };
                    
                    return `
                        <div class="individual-document" data-order-no="${order.orderNo}">
                            <div class="document-separator">
                                <h4><i class="fas fa-file-alt"></i> ${originalData.documentType} ${index + 1}/${selectedOrders.length} - 注文No.${order.orderNo}</h4>
                                <div class="separator-actions">
                                    <button class="btn btn-sm btn-outline" onclick="printIndividualDocument('${type}', '${order.orderNo}')">
                                        <i class="fas fa-print"></i> この帳票を印刷
                                    </button>
                                </div>
                            </div>
                            ${generateDocumentHTML(individualData, type)}
                        </div>
                    `;
                }).join('');
                
                previewContainer.innerHTML = `
                    <div class="multiple-documents-container">
                        <div class="documents-summary">
                            <div class="summary-header">
                                <i class="fas fa-list-alt"></i> 
                                <span>選択された${selectedOrders.length}件の注文に対して、それぞれ個別の${originalData.documentType}を作成します</span>
                            </div>
                        </div>
                        ${individualDocuments}
                    </div>
                `;
            } catch (innerError) {
                console.error('個別帳票生成エラー:', innerError);
                previewContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>帳票の生成中にエラーが発生しました。ページを再読み込みしてください。</p>
                    </div>
                `;
            }
        }
        
        console.log(`${type}プレビュー更新完了:`, selectedOrders.length, '件の個別帳票を生成');
        
    } catch (error) {
        console.error('プレビュー更新エラー:', error);
        console.error('エラー詳細:', {
            type: type,
            selectedOrders: selectedOrders?.length || 0,
            originalData: originalData ? '存在' : 'なし',
            previewContainer: document.getElementById(`document-preview-${type}`) ? '存在' : 'なし'
        });
        alert(`プレビューの更新中にエラーが発生しました。\n\nエラー: ${error.message}\n\n詳細はコンソールを確認してください。`);
    }
}

// 個別帳票の文書番号生成
function generateIndividualDocumentNumber(baseNumber, index, total) {
    // 元の番号に連番を付加（例：I-2024-0001-1, I-2024-0001-2）
    return `${baseNumber}-${index}`;
}

// 個別帳票の印刷
function printIndividualDocument(type, orderNo) {
    const documentElement = document.querySelector(`[data-order-no="${orderNo}"]`);
    if (!documentElement) {
        alert('帳票が見つかりません。');
        return;
    }
    
    // 個別帳票のHTML取得（separatorを除く）
    const documentContainer = documentElement.querySelector('.document-container');
    if (!documentContainer) {
        alert('印刷用コンテンツが見つかりません。');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>印刷 - ${type} - 注文No.${orderNo}</title>
                <style>
                    ${getDocumentPrintCSS(type)}
                    .document-separator { display: none; }
                    .no-selection-message { display: none; }
                </style>
            </head>
            <body onload="window.print(); window.close();">
                ${documentContainer.outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    
    console.log(`注文No.${orderNo}の${type}を印刷中...`);
}

// 選択された注文での印刷（全個別帳票）
function printSelectedDocument(type) {
    const checkboxes = document.querySelectorAll('.order-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('印刷する注文を選択してください。');
        return;
    }
    
    // 確認ダイアログ
    const selectedCount = checkboxes.length;
    if (!confirm(`選択された${selectedCount}件の注文に対して、それぞれ個別の${type}を${selectedCount}枚印刷します。\n\n印刷を実行しますか？`)) {
        return;
    }
    
    // 個別帳票をまとめて印刷用HTMLを生成
    const individualDocuments = Array.from(checkboxes).map(checkbox => {
        const orderNo = checkbox.dataset.orderIndex;
        const documentElement = document.querySelector(`[data-order-no]`);
        // 実際の注文番号で検索
        const orderElements = document.querySelectorAll('.individual-document');
        const targetElement = Array.from(orderElements).find(el => {
            const orderNoAttr = el.getAttribute('data-order-no');
            return orderNoAttr && el.querySelector('.document-container');
        });
        
        if (targetElement) {
            const documentContainer = targetElement.querySelector('.document-container');
            return documentContainer ? documentContainer.outerHTML : '';
        }
        return '';
    }).filter(html => html).join('<div style="page-break-after: always;"></div>');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>印刷 - ${type} - ${selectedCount}件の個別帳票</title>
                <style>
                    ${getDocumentPrintCSS(type)}
                    .document-separator { display: none; }
                    .no-selection-message { display: none; }
                    .multiple-documents-container { display: none; }
                    @media print {
                        .document-container { page-break-after: always; }
                        .document-container:last-child { page-break-after: avoid; }
                    }
                </style>
            </head>
            <body onload="window.print(); window.close();">
                ${individualDocuments}
            </body>
        </html>
    `);
    printWindow.document.close();
    
    console.log(`${selectedCount}件の個別${type}を印刷中...`);
}

// 選択された注文でのPDF出力（個別帳票）
function downloadSelectedDocumentPDF(type) {
    const checkboxes = document.querySelectorAll('.order-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('PDF出力する注文を選択してください。');
        return;
    }
    
    const selectedCount = checkboxes.length;
    console.log(`${type}の選択注文PDFを生成中...`);
    
    if (selectedCount === 1) {
        alert(`選択された1件の注文で個別の${type}PDFを保存します。\n実装時にはPDF生成ライブラリ（jsPDF等）を使用します。`);
    } else {
        alert(`選択された${selectedCount}件の注文で、それぞれ個別の${type}PDF（計${selectedCount}ファイル）を保存します。\n実装時にはPDF生成ライブラリ（jsPDF等）を使用します。`);
    }
}

// 選択された注文でのメール送信（個別帳票）
function emailSelectedDocument(type) {
    const checkboxes = document.querySelectorAll('.order-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('メール送信する注文を選択してください。');
        return;
    }
    
    const selectedCount = checkboxes.length;
    console.log(`${type}の選択注文をメール送信中...`);
    
    if (selectedCount === 1) {
        alert(`選択された1件の注文で個別の${type}をメール送信します。\n実装時にはメール送信機能を追加します。`);
    } else {
        alert(`選択された${selectedCount}件の注文で、それぞれ個別の${type}をメール送信します（計${selectedCount}通）。\n実装時にはメール送信機能を追加します。`);
    }
}

// 書類印刷
function printDocument(type) {
    const printWindow = window.open('', '_blank');
    const documentContainer = document.querySelector('.document-container');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <title>書類印刷</title>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                ${getDocumentPrintCSS(type)}
            </style>
        </head>
        <body>
            ${documentContainer.outerHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// 書類PDF出力
function downloadDocumentPDF(type) {
    alert('PDF出力機能は開発中です。\n現在は印刷機能をご利用ください。');
}

// 書類メール送信
function emailDocument(type) {
    alert('メール送信機能は開発中です。\n現在は印刷機能をご利用ください。');
}

// 書類印刷用CSS
function getDocumentPrintCSS(type) {
    return `
        @page {
            size: A4;
            margin: 15mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "ヒラギノ角ゴ Pro", "Hiragino Kaku Gothic Pro", "Meiryo", sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
        }
        
        .document-container {
            max-width: 100%;
        }
        
        .document-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20mm;
            border-bottom: 2px solid #000;
            padding-bottom: 5mm;
        }
        
        .document-title h1 {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 5mm;
        }
        
        .document-number {
            font-size: 12pt;
            color: #666;
        }
        
        .company-info {
            text-align: right;
            font-size: 10pt;
            line-height: 1.6;
        }
        
        .company-name {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 3mm;
        }
        
        .document-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15mm;
        }
        
        .client-info h3,
        .document-dates h3 {
            font-size: 12pt;
            margin-bottom: 8mm;
            border-bottom: 1px solid #333;
            padding-bottom: 2mm;
        }
        
        .info-row,
        .date-row {
            display: flex;
            margin-bottom: 3mm;
        }
        
        .info-row label,
        .date-row label {
            min-width: 60mm;
            font-weight: bold;
        }
        

        
        .document-content h3 {
            font-size: 14pt;
            margin-bottom: 8mm;
            border-bottom: 1px solid #333;
            padding-bottom: 2mm;
        }
        
        .document-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10mm;
        }
        
        .document-table th,
        .document-table td {
            border: 1px solid #333;
            padding: 3mm;
            text-align: left;
            font-size: 10pt;
        }
        
        .document-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        
        .document-table .amount,
        .document-table .fee {
            text-align: right;
            font-weight: bold;
        }
        
        .payment-badge {
            padding: 1mm 3mm;
            border-radius: 2mm;
            font-size: 9pt;
            font-weight: bold;
        }
        
        .payment-badge.transfer {
            background-color: #e3f2fd;
            color: #1976d2;
        }
        
        .payment-badge.onsite {
            background-color: #fff3e0;
            color: #f57c00;
        }
        
        .total-row {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        
        .document-notes h4 {
            font-size: 12pt;
            margin-bottom: 5mm;
            border-bottom: 1px solid #333;
            padding-bottom: 2mm;
        }
        
        .document-notes ul {
            padding-left: 15mm;
        }
        
        .document-notes li {
            margin-bottom: 2mm;
            font-size: 10pt;
        }
        
        .document-actions {
            display: none;
        }
        
        @media print {
            .document-actions {
                display: none !important;
            }
        }
    `;
}

// ご葬家名取得
function getFuneralName(funeralId) {
    return funeralInfoData[funeralId]?.name || `ご葬家${funeralId}`;
}

// ご葬家情報編集
function editFuneralInfo(funeralId, event) {
    // イベントの伝播を停止（グループの展開・折りたたみを防ぐ）
    event.stopPropagation();
    
    const funeralInfo = funeralInfoData[funeralId];
    if (!funeralInfo) {
        alert('ご葬家情報が見つかりません。');
        return;
    }
    
    // モーダルにデータを設定
    document.getElementById('editFuneralName').textContent = `${funeralInfo.name}のご葬儀`;
    document.getElementById('editStaffName').value = funeralInfo.staff;
    document.getElementById('editConfirmedDate').value = funeralInfo.confirmedDate;
    
    // 参考情報を表示
    document.getElementById('editFuneralDate').textContent = funeralInfo.funeralDate;
    document.getElementById('editFuneralVenue').textContent = funeralInfo.venue;
    document.getElementById('editDeceasedName').textContent = `${funeralInfo.deceased}様`;
    
    // 現在編集中のご葬家IDを保存
    currentEditingFuneralId = funeralId;
    
    // モーダルを表示
    document.getElementById('funeralInfoModal').style.display = 'block';
}

// 現在編集中のご葬家ID
let currentEditingFuneralId = null;

// ご葬家情報保存
function saveFuneralInfo() {
    if (!currentEditingFuneralId) {
        alert('編集対象が選択されていません。');
        return;
    }
    
    const staffName = document.getElementById('editStaffName').value.trim();
    const confirmedDate = document.getElementById('editConfirmedDate').value;
    
    // バリデーション
    if (!staffName) {
        alert('担当者名を入力してください。');
        document.getElementById('editStaffName').focus();
        return;
    }
    
    if (!confirmedDate) {
        alert('葬儀確定日を選択してください。');
        document.getElementById('editConfirmedDate').focus();
        return;
    }
    
    // データを更新
    funeralInfoData[currentEditingFuneralId].staff = staffName;
    funeralInfoData[currentEditingFuneralId].confirmedDate = confirmedDate;
    
    // 画面の表示を更新
    updateFuneralInfoDisplay(currentEditingFuneralId);
    
    // モーダルを閉じる
    closeModal('funeralInfoModal');
    
    // 成功メッセージ
    const funeralName = funeralInfoData[currentEditingFuneralId].name;
    alert(`${funeralName}のご葬儀情報を更新しました。\n担当者: ${staffName}\n確定日: ${confirmedDate}`);
    
    // 編集中IDをリセット
    currentEditingFuneralId = null;
}

// ご葬家情報表示更新
function updateFuneralInfoDisplay(funeralId) {
    const funeralInfo = funeralInfoData[funeralId];
    if (!funeralInfo) return;
    
    // 担当者名の更新
    const staffElement = document.getElementById(`staff-${funeralId}`);
    if (staffElement) {
        staffElement.textContent = funeralInfo.staff;
    }
    
    // 確定日の更新
    const confirmedElement = document.getElementById(`confirmed-${funeralId}`);
    if (confirmedElement) {
        confirmedElement.textContent = funeralInfo.confirmedDate;
    }
}

// ご葬家情報取得（花屋送信などで使用）
function getFuneralInfoById(funeralId) {
    return funeralInfoData[funeralId] || null;
}

// ご葬家の注文取得
function getFuneralOrders(funeralId, paymentFilter) {
    const group = document.querySelector(`[data-funeral-id="${funeralId}"]`);
    if (!group) return [];
    
    const rows = group.querySelectorAll('tbody tr');
    const orders = [];
    
    rows.forEach(row => {
        const orderNo = row.getAttribute('data-order-id');
        const status = row.getAttribute('data-status');
        const nameplate = row.querySelector('td:nth-child(4)').textContent;
        const amount = row.querySelector('.amount').textContent;
        const paymentBadge = row.querySelector('.payment-badge');
        const paymentMethod = paymentBadge ? paymentBadge.textContent : '';
        
        // キャンセルされていない注文のみ
        if (status !== 'cancelled') {
            // 支払方法フィルタ
            if (paymentFilter === 'all' || 
                (paymentFilter === 'transfer' && paymentMethod.includes('振込')) ||
                (paymentFilter === 'onsite' && paymentMethod.includes('現地'))) {
                
                // 依頼者と手数料の情報も取得
                const requester = row.querySelector('td:nth-child(5)')?.textContent || '依頼者未記入';
                const fee = row.querySelector('.fee')?.textContent || '¥0';
                
                orders.push({
                    orderNo,
                    nameplate,
                    requester,
                    amount,
                    fee,
                    paymentMethod
                });
            }
        }
    });
    
    return orders;
}

// ご葬家別帳票作成進捗表示
function showFuneralReportProgress(reportType, funeralName, orders, callback) {
    const modal = document.getElementById('funeralReportModal');
    const title = document.getElementById('funeralReportTitle');
    const progressFill = document.getElementById('funeralProgressFill');
    const progressText = document.getElementById('funeralProgressText');
    const progressMessage = document.getElementById('funeralProgressMessage');
    const reportDetails = document.getElementById('funeralReportDetails');
    
    if (!modal) return;
    
    // モーダル設定
    title.textContent = `${reportType}中...`;
    progressMessage.textContent = `${funeralName}の${reportType}を実行しています...`;
    
    // 対象詳細表示
    const detailsHTML = `
        <h4>${funeralName}の${reportType}対象（${orders.length}件）</h4>
        <ul class="report-target-list">
            ${orders.map(order => `
                <li class="report-target-item">
                    <span class="target-name">No.${order.orderNo}: ${order.nameplate}</span>
                    <span class="target-amount">${order.amount}</span>
                </li>
            `).join('')}
        </ul>
    `;
    reportDetails.innerHTML = detailsHTML;
    
    modal.style.display = 'block';
    
    // 進捗アニメーション
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                modal.style.display = 'none';
                if (callback) callback();
            }, 500);
        }
    }, 200);
}

// デバッグ用
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('注文管理システム開発モードで実行中');
    window.debugOrderManagement = {
        updateSummary: updateOrderSummary,
        expandAll: expandAllGroups,
        collapseAll: collapseAllGroups,
        toggleGroup: toggleFuneralGroup,
        generateOrderForm: generateOrderForm,
        toggleDropdown: toggleDropdown,
        generateFloristOrder: generateFloristOrder,
        generateFuneralLabels: generateFuneralLabels,
        generateFuneralInvoiceLabels: generateFuneralInvoiceLabels,
        generateFuneralReceiptLabels: generateFuneralReceiptLabels,

        showAddressLabelModal: showAddressLabelModal,
        showDocumentModal: showDocumentModal,
        updateEnvelopePreview: updateEnvelopePreview,
        printAddressLabels: printAddressLabels,
        printDocument: printDocument,
        editFuneralInfo: editFuneralInfo,
        funeralInfoData: funeralInfoData,
        getFuneralOrders: getFuneralOrders,

        getFuneralInvoiceData: getFuneralInvoiceData,
        getFuneralReceiptData: getFuneralReceiptData,
        // 注文選択関連
        selectAllOrders: selectAllOrders,
        deselectAllOrders: deselectAllOrders,
        updateDocumentPreview: updateDocumentPreview,
        printSelectedDocument: printSelectedDocument,
        printIndividualDocument: printIndividualDocument,
        generateIndividualDocumentNumber: generateIndividualDocumentNumber,
        // Excel一覧表関連
        generateFuneralSummary: generateFuneralSummary,
        getFuneralSummaryData: getFuneralSummaryData,
        showExcelSummaryModal: showExcelSummaryModal,
        copyTableToClipboard: copyTableToClipboard,
        copyTSVToClipboard: copyTSVToClipboard,
        downloadExcelCSV: downloadExcelCSV,
        downloadExcelTSV: downloadExcelTSV,
        // テスト用関数
        testInvoice: () => generateFuneralInvoices(1),
        testReceipt: () => generateFuneralReceipts(1),
        testExcelSummary: () => generateFuneralSummary(1)
    };
    
    // コンソールでテストできるように関数をグローバルに追加
    window.testInvoice = () => generateFuneralInvoices(1);
    window.testReceipt = () => generateFuneralReceipts(1);
    window.testExcelSummary = () => generateFuneralSummary(1);
}

// ================================
// 新規ご葬家作成機能
// ================================

let nextFuneralId = 4; // 既存のご葬家が3つあるため、次のIDは4

// 新規ご葬家作成フォームを表示
function showNewFuneralForm() {
    const modal = document.getElementById('newFuneralModal');
    if (!modal) return;
    
    // フォームをリセット
    document.getElementById('newFuneralForm').reset();
    
    // 花代処理方式のラジオボタンのイベントリスナーを設定
    const radios = document.querySelectorAll('input[name="newFlowerMode"]');
    radios.forEach(radio => {
        radio.addEventListener('change', toggleNewBuiltinLimit);
    });
    
    // 初期状態で組込上限額を表示
    toggleNewBuiltinLimit();
    
    openModal(modal);
}

// 組込上限額の表示/非表示を切り替え
function toggleNewBuiltinLimit() {
    const modeBuiltin = document.getElementById('newFlowerMode');
    const builtinLimitRow = document.getElementById('newBuiltinLimitRow');
    const selectedMode = document.querySelector('input[name="newFlowerMode"]:checked').value;
    
    if (builtinLimitRow) {
        builtinLimitRow.style.display = selectedMode === 'builtin' ? 'flex' : 'none';
    }
}

// 新規ご葬家を保存
function saveNewFuneral() {
    // フォームのバリデーション
    const form = document.getElementById('newFuneralForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // フォームデータを取得
    const funeralFamily = document.getElementById('newFuneralFamily').value.trim();
    const deceased = document.getElementById('newDeceased').value.trim();
    const funeralDate = document.getElementById('newFuneralDate').value;
    const venue = document.getElementById('newVenue').value.trim();
    const staff = document.getElementById('newStaff').value.trim() || '未設定';
    const confirmedDate = document.getElementById('newConfirmedDate').value || new Date().toISOString().split('T')[0];
    const flowerMode = document.querySelector('input[name="newFlowerMode"]:checked').value;
    const builtinLimit = parseInt(document.getElementById('newBuiltinLimit').value) || 50000;
    
    // 新しいご葬家IDを生成
    const funeralId = nextFuneralId++;
    
    // ご葬家情報を保存
    funeralInfoData[funeralId] = {
        family: funeralFamily,
        deceased: deceased,
        funeralDate: funeralDate,
        venue: venue,
        staff: staff,
        confirmedDate: confirmedDate,
        flowerPayment: {
            mode: flowerMode,
            builtinLimit: builtinLimit
        }
    };
    
    // 新しいご葬家グループのHTMLを生成
    const funeralGroupHTML = createFuneralGroupHTML(funeralId);
    
    // ご葬家グループを追加
    const funeralGroups = document.getElementById('funeralGroups');
    if (funeralGroups) {
        funeralGroups.insertAdjacentHTML('beforeend', funeralGroupHTML);
    }
    
    // モーダルを閉じる
    closeModal('newFuneralModal');
    
    // 成功メッセージ
    alert(`${funeralFamily}のご葬儀を登録しました。`);
}

// ご葬家グループのHTMLを生成
function createFuneralGroupHTML(funeralId) {
    const info = funeralInfoData[funeralId];
    const mode = info.flowerPayment?.mode || 'builtin';
    const modeBadgeClass = mode === 'builtin' ? 'builtin' : 'addon';
    const modeBadgeText = mode === 'builtin' ? '組込式' : 'つけ花';
    
    // 日付フォーマット
    const formattedFuneralDate = info.funeralDate.replace(/-/g, '/');
    
    return `
        <!-- ${info.family}のご葬儀 -->
        <div class="funeral-group" data-funeral-id="${funeralId}">
            <div class="funeral-header">
                <div class="funeral-info" onclick="toggleFuneralGroup(${funeralId})">
                    <div class="funeral-title">
                        <span class="expand-icon"><i class="fas fa-chevron-down"></i></span>
                        <h3>${info.family}のご葬儀</h3>
                        <span class="deceased-name">（故人: ${info.deceased}様）</span>
                    </div>
                    <div class="funeral-details">
                        <span class="funeral-date">葬儀日: ${formattedFuneralDate}</span>
                        <span class="funeral-venue">会場: ${info.venue}</span>
                    </div>
                    <div class="funeral-management">
                        <div class="funeral-management-info">
                            <span class="funeral-staff">担当者: <span class="staff-name" id="staff-${funeralId}">${info.staff}</span></span>
                            <span class="funeral-confirmed-date">確定日: <span class="confirmed-date" id="confirmed-${funeralId}">${info.confirmedDate}</span></span>
                        </div>
                        <button class="btn-edit-funeral" onclick="editFuneralInfo(${funeralId}, event)"></button>
                    </div>
                </div>
                <div class="funeral-summary">
                    <div class="summary-item flower-calc">
                        <div class="flower-calc-header">
                            <span class="summary-label">
                                <i class="fas fa-calculator"></i> 花代処理: 
                                <span class="mode-badge-small ${modeBadgeClass}" id="mode-badge-${funeralId}">${modeBadgeText}</span>
                            </span>
                            <button class="btn-edit-inline" onclick="editFlowerSettings(${funeralId}, event)" title="設定変更">
                                <i class="fas fa-edit"></i> 設定
                            </button>
                        </div>
                        <div class="flower-calc-details">
                            <div class="calc-detail-item" id="deduct-item-${funeralId}" style="display: none;">
                                <i class="fas fa-arrow-down calc-icon deduct"></i>
                                <div class="calc-detail-content">
                                    <span class="calc-detail-label">葬儀代金から減額（税込）</span>
                                    <span class="calc-detail-value deduct" id="inline-deduct-${funeralId}">¥0</span>
                                    <span class="calc-detail-tax" id="inline-deduct-tax-${funeralId}" style="font-size: 0.85em; color: #666; margin-left: 8px;">(内税¥0)</span>
                                </div>
                            </div>
                            <div class="calc-detail-divider" id="divider-${funeralId}" style="display: none;"></div>
                            <div class="calc-detail-item" id="addon-item-${funeralId}" style="display: none;">
                                <i class="fas fa-plus-circle calc-icon addon"></i>
                                <div class="calc-detail-content">
                                    <span class="calc-detail-label">つけ花（${mode === 'builtin' ? '超過分・税込' : '全額・税込'}）</span>
                                    <span class="calc-detail-value addon" id="inline-addon-${funeralId}">¥0</span>
                                    <span class="calc-detail-tax" id="inline-addon-tax-${funeralId}" style="font-size: 0.85em; color: #666; margin-left: 8px;">(内税¥0)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">注文数:</span>
                        <span class="summary-value">0件</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">支払方法:</span>
                        <span class="summary-badges">
                            <span class="payment-badge">注文なし</span>
                        </span>
                    </div>
                </div>
                <div class="funeral-actions">
                    <div class="dropdown">
                        <button class="btn btn-sm btn-primary dropdown-toggle" onclick="toggleDropdown(${funeralId})">
                            <i class="fas fa-file-alt"></i> 帳票作成
                        </button>
                        <div class="dropdown-menu" id="dropdown-${funeralId}">
                            <button class="dropdown-item" onclick="generateFuneralInvoices(${funeralId})">
                                <i class="fas fa-file-invoice-dollar"></i> 請求書作成
                            </button>
                            <button class="dropdown-item" onclick="generateFuneralReceipts(${funeralId})">
                                <i class="fas fa-receipt"></i> 領収書作成
                            </button>
                            <button class="dropdown-item" onclick="generateFuneralInvoiceLabels(${funeralId})">
                                <i class="fas fa-file-invoice-dollar"></i> 請求書用宛名ラベル
                            </button>
                            <button class="dropdown-item" onclick="generateFuneralReceiptLabels(${funeralId})">
                                <i class="fas fa-receipt"></i> 領収書用宛名ラベル
                            </button>
                            <button class="dropdown-item" onclick="generateFuneralSummary(${funeralId})">
                                <i class="fas fa-chart-bar"></i> 一覧表
                            </button>
                            <button class="dropdown-item" onclick="generateFloristOrder(${funeralId})">
                                <i class="fas fa-seedling"></i> 花屋送信用一覧
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="funeral-orders">
                <table class="orders-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" class="group-checkbox" data-group="${funeralId}"></th>
                            <th>No.</th>
                            <th>受注日</th>
                            <th>芳名板</th>
                            <th>依頼者</th>
                            <th>連絡先</th>
                            <th>金額</th>
                            <th>手数料</th>
                            <th>支払方法</th>
                            <th>ステータス</th>
                            <th>承認状況</th>
                            <th>花屋送信状況</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="no-orders">
                            <td colspan="13" style="text-align: center; padding: 40px; color: #999;">
                                まだ注文がありません
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
// ================================
// 注文編集モーダルのイベント制御
// ================================

// イベントリスナー設定済みフラグ
let orderEditModalEventsInitialized = false;

// 注文編集モーダルのイベントハンドラー
function handleApplicantTypeChange(event) {
    const contactPersonRow = document.getElementById('editContactPersonRow');
    const contactPersonInput = document.getElementById('editContactPerson');
    const applicantNameLabel = document.getElementById('editApplicantNameLabel');
    const applicantNameInput = document.getElementById('editApplicantName');
    const invoiceNameLabel = document.getElementById('editInvoiceNameLabel');
    const invoiceNameInput = document.getElementById('editInvoiceName');
    const invoiceContactPersonRow = document.getElementById('editInvoiceContactPersonRow');
    const invoiceContactPersonInput = document.getElementById('editInvoiceContactPerson');
    const sameAsApplicantCheckbox = document.getElementById('editSameAsApplicant');
    
    if (event.target.value === 'company') {
        // 企業・団体の場合
        if (contactPersonRow) contactPersonRow.style.display = 'block';
        if (applicantNameLabel) applicantNameLabel.textContent = '企業・団体名:';
        if (applicantNameInput) applicantNameInput.placeholder = '例: 株式会社〇〇';
        
        // 請求書送付先も企業・団体用に変更
        if (invoiceNameLabel) invoiceNameLabel.textContent = '企業・団体名:';
        if (invoiceNameInput) invoiceNameInput.placeholder = '例: 株式会社〇〇';
        if (invoiceContactPersonRow) invoiceContactPersonRow.style.display = 'block';
    } else {
        // 個人の場合
        if (contactPersonRow) contactPersonRow.style.display = 'none';
        if (contactPersonInput) contactPersonInput.value = '';
        if (applicantNameLabel) applicantNameLabel.textContent = 'ご依頼者のお名前:';
        if (applicantNameInput) applicantNameInput.placeholder = '例: 輝 花子';
        
        // 請求書送付先も個人用に変更
        if (invoiceNameLabel) invoiceNameLabel.textContent = 'お名前:';
        if (invoiceNameInput) invoiceNameInput.placeholder = '例: 輝 花子';
        if (invoiceContactPersonRow) invoiceContactPersonRow.style.display = 'none';
        if (invoiceContactPersonInput) invoiceContactPersonInput.value = '';
    }
    
    // 「依頼者と同じ」がチェックされている場合は、変更を反映
    if (sameAsApplicantCheckbox && sameAsApplicantCheckbox.checked) {
        if (invoiceNameInput && applicantNameInput) invoiceNameInput.value = applicantNameInput.value;
        if (invoiceContactPersonInput && contactPersonInput) invoiceContactPersonInput.value = contactPersonInput.value;
        
        // 担当者フィールドの非活性化状態も更新
        if (event.target.value === 'company' && invoiceContactPersonInput) {
            invoiceContactPersonInput.disabled = true;
        }
    }
}

// 注文編集モーダルのイベントリスナー設定
// 初期状態を設定する関数
function updateInitialState() {
    const contactPersonRow = document.getElementById('editContactPersonRow');
    const invoiceContactPersonRow = document.getElementById('editInvoiceContactPersonRow');
    const selectedApplicantType = document.querySelector('input[name="editApplicantType"]:checked');
    
    if (selectedApplicantType && selectedApplicantType.value === 'individual') {
        if (contactPersonRow) contactPersonRow.style.display = 'none';
        if (invoiceContactPersonRow) invoiceContactPersonRow.style.display = 'none';
    }
}

// 注文編集モーダルのイベントリスナー設定
function setupOrderEditModalEvents() {
    // 初期状態を設定（個人が選択されている場合、担当者フィールドを非表示にする）
    updateInitialState();
    
    // 既にイベントリスナーが設定済みの場合は初期状態設定のみ
    if (orderEditModalEventsInitialized) {
        return;
    }
    
    // ご依頼者区分のラジオボタン
    const applicantTypeRadios = document.querySelectorAll('input[name="editApplicantType"]');
    
    applicantTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleApplicantTypeChange);
    });
    
    // 「依頼者と同じ」チェックボックスの制御
    const sameAsApplicantCheckbox = document.getElementById('editSameAsApplicant');
    
    if (sameAsApplicantCheckbox) {
        const invoiceFields = {
            name: document.getElementById('editInvoiceName'),
            contactPerson: document.getElementById('editInvoiceContactPerson'),
            postalCode: document.getElementById('editInvoicePostalCode'),
            prefecture: document.getElementById('editInvoicePrefecture'),
            city: document.getElementById('editInvoiceCity'),
            address1: document.getElementById('editInvoiceAddress1'),
            address2: document.getElementById('editInvoiceAddress2'),
            phone: document.getElementById('editInvoicePhone'),
            fax: document.getElementById('editInvoiceFax')
        };
        
        const applicantFields = {
            name: document.getElementById('editApplicantName'),
            contactPerson: document.getElementById('editContactPerson'),
            postalCode: document.getElementById('editPostalCode'),
            prefecture: document.getElementById('editPrefecture'),
            city: document.getElementById('editCity'),
            address1: document.getElementById('editAddress1'),
            address2: document.getElementById('editAddress2'),
            phone: document.getElementById('editPhone'),
            fax: document.getElementById('editFax')
        };
        
        sameAsApplicantCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // 依頼者情報をコピー
                invoiceFields.name.value = applicantFields.name.value;
                invoiceFields.contactPerson.value = applicantFields.contactPerson.value;
                invoiceFields.postalCode.value = applicantFields.postalCode.value;
                invoiceFields.prefecture.value = applicantFields.prefecture.value;
                invoiceFields.city.value = applicantFields.city.value;
                invoiceFields.address1.value = applicantFields.address1.value;
                invoiceFields.address2.value = applicantFields.address2.value;
                invoiceFields.phone.value = applicantFields.phone.value;
                invoiceFields.fax.value = applicantFields.fax.value;
                
                // フィールドを非活性化
                invoiceFields.name.disabled = true;
                invoiceFields.postalCode.disabled = true;
                invoiceFields.prefecture.disabled = true;
                invoiceFields.city.disabled = true;
                invoiceFields.address1.disabled = true;
                invoiceFields.address2.disabled = true;
                invoiceFields.phone.disabled = true;
                invoiceFields.fax.disabled = true;
                const invoiceContactPersonRow = document.getElementById('editInvoiceContactPersonRow');
                if (invoiceContactPersonRow && invoiceContactPersonRow.style.display !== 'none') {
                    invoiceFields.contactPerson.disabled = true;
                }
            } else {
                // フィールドを活性化
                invoiceFields.name.disabled = false;
                invoiceFields.postalCode.disabled = false;
                invoiceFields.prefecture.disabled = false;
                invoiceFields.city.disabled = false;
                invoiceFields.address1.disabled = false;
                invoiceFields.address2.disabled = false;
                invoiceFields.phone.disabled = false;
                invoiceFields.fax.disabled = false;
                const invoiceContactPersonRow = document.getElementById('editInvoiceContactPersonRow');
                if (invoiceContactPersonRow && invoiceContactPersonRow.style.display !== 'none') {
                    invoiceFields.contactPerson.disabled = false;
                }
            }
        });
        
        // 依頼者情報が変更されたときに、チェックボックスがONの場合は自動更新
        Object.keys(applicantFields).forEach(key => {
            if (applicantFields[key]) {
                applicantFields[key].addEventListener('input', function() {
                    if (sameAsApplicantCheckbox.checked && invoiceFields[key]) {
                        invoiceFields[key].value = this.value;
                    }
                });
            }
        });
    }
    
    // フラグを設定
    orderEditModalEventsInitialized = true;
}

// 新規注文フォーム表示
function showNewOrderForm() {
    // 注文編集モーダルを新規作成モードで開く
    const modal = document.getElementById('orderEditModal');
    if (!modal) return;
    
    // タイトルを変更
    const titleElement = document.querySelector('#orderEditModal .modal-header h2');
    if (titleElement) {
        titleElement.innerHTML = '新規注文作成';
    }
    
    // フォームをリセット
    const form = document.getElementById('orderEditForm');
    if (form) {
        form.reset();
    }
    
    // 注文番号を空にする
    const orderNumberElement = document.getElementById('editOrderNumber');
    if (orderNumberElement) {
        orderNumberElement.textContent = '';
    }
    
    // イベントリスナーを設定
    setupOrderEditModalEvents();
    
    openModal(modal);
}

// ================================
// 承認フロー機能
// ================================

// システムユーザーマスターデータ（全ユーザーアカウント）
const systemUsers = {
    1: { name: '山田 太郎', email: 'yamada@example.com', title: '営業部長', department: '営業部' },
    2: { name: '佐藤 花子', email: 'sato@example.com', title: '総務部長', department: '総務部' },
    3: { name: '鈴木 一郎', email: 'suzuki@example.com', title: '取締役', department: '経営企画' },
    4: { name: '田中 次郎', email: 'tanaka@example.com', title: '課長', department: '営業部' },
    5: { name: '高橋 美咲', email: 'takahashi@example.com', title: '主任', department: '総務部' },
    6: { name: '伊藤 健太', email: 'ito@example.com', title: '部長', department: '営業部' },
    7: { name: '渡辺 麻衣', email: 'watanabe@example.com', title: '課長', department: '経理部' },
    8: { name: '中村 大輔', email: 'nakamura@example.com', title: '係長', department: '総務部' }
};

// 承認者データ管理（承認者ロールとして選択されたユーザー）
const approverData = {
    // userId: true (承認者として設定されている)
    1: true, // 山田 太郎
    2: true, // 佐藤 花子
    3: true  // 鈴木 一郎
};

const MAX_APPROVERS = 3; // 最大承認者数

// 注文の承認状況データ
// status: 'pending' (承認待ち), 'approved' (承認済み), 'rejected' (却下), 'partial' (一部承認)
const approvalStatusData = {
    // デモ用：承認者（佐藤 花子）に承認依頼が来ている注文
    '12': {
        approvers: [
            {
                approverId: 'approver1',
                approverName: '佐藤 花子',
                approverEmail: 'sato@example.com',
                approverTitle: '承認者',
                status: 'pending',
                comment: '',
                timestamp: null
            }
        ],
        overallStatus: 'pending',
        requestComment: 'ご確認をお願いいたします',
        requestDate: '2024-01-16T10:00:00'
    },
    '13': {
        approvers: [
            {
                approverId: 'approver1',
                approverName: '佐藤 花子',
                approverEmail: 'sato@example.com',
                approverTitle: '承認者',
                status: 'pending',
                comment: '',
                timestamp: null
            }
        ],
        overallStatus: 'pending',
        requestComment: 'ご確認をお願いいたします',
        requestDate: '2024-01-16T11:00:00'
    }
};

// 承認者設定モーダル表示
function showApproverSettings() {
    const modal = document.getElementById('approverSettingsModal');
    if (!modal) return;
    
    // 承認者リストを更新
    updateApproverList();
    
    // ユーザー選択ドロップダウンを更新
    updateUserSelectionDropdown();
    
    // 承認者数の表示を更新
    updateApproverCountDisplay();
    
    openModal(modal);
}

// ユーザー選択ドロップダウンを更新
function updateUserSelectionDropdown() {
    const selectElement = document.getElementById('selectUserForApprover');
    if (!selectElement) return;
    
    // まだ承認者として設定されていないユーザーのみ表示
    const availableUsers = Object.entries(systemUsers).filter(([userId, user]) => 
        !approverData[userId]
    );
    
    if (availableUsers.length === 0) {
        selectElement.innerHTML = '<option value="">すべてのユーザーが承認者に設定済みです</option>';
        selectElement.disabled = true;
        return;
    }
    
    selectElement.disabled = false;
    selectElement.innerHTML = '<option value="">選択してください</option>' +
        availableUsers.map(([userId, user]) => 
            `<option value="${userId}">${user.name} (${user.title || '役職なし'} - ${user.department || '部署なし'})</option>`
        ).join('');
}

// 選択されたユーザー情報を表示
function updateSelectedUserInfo() {
    const selectElement = document.getElementById('selectUserForApprover');
    const infoContainer = document.getElementById('selectedUserInfo');
    
    if (!selectElement || !infoContainer) return;
    
    const userId = selectElement.value;
    
    if (!userId) {
        infoContainer.style.display = 'none';
        return;
    }
    
    const user = systemUsers[userId];
    if (!user) {
        infoContainer.style.display = 'none';
        return;
    }
    
    // ユーザー情報を表示
    document.getElementById('selectedUserName').textContent = user.name;
    document.getElementById('selectedUserTitle').textContent = user.title || '（なし）';
    document.getElementById('selectedUserDepartment').textContent = user.department || '（なし）';
    document.getElementById('selectedUserEmail').textContent = user.email;
    
    infoContainer.style.display = 'block';
}

// 選択されたユーザーを承認者として追加
function addSelectedUserAsApprover() {
    const selectElement = document.getElementById('selectUserForApprover');
    if (!selectElement) return;
    
    const userId = selectElement.value;
    
    if (!userId) {
        alert('ユーザーを選択してください。');
        return;
    }
    
    // 最大数チェック
    const currentCount = Object.keys(approverData).filter(id => approverData[id]).length;
    if (currentCount >= MAX_APPROVERS) {
        alert(`承認者は最大${MAX_APPROVERS}人まで設定できます。`);
        return;
    }
    
    const user = systemUsers[userId];
    if (!user) {
        alert('ユーザー情報が見つかりません。');
        return;
    }
    
    // 承認者として設定
    approverData[userId] = true;
    
    // ローカルストレージに保存
    saveApproverData();
    
    // リストと表示を更新
    updateApproverList();
    updateUserSelectionDropdown();
    updateApproverCountDisplay();
    
    // 選択情報をクリア
    selectElement.value = '';
    document.getElementById('selectedUserInfo').style.display = 'none';
    
    alert(`「${user.name}」を承認者として追加しました。`);
}

// 承認者リスト更新
function updateApproverList() {
    const listContainer = document.getElementById('approverList');
    if (!listContainer) return;
    
    // 承認者として設定されているユーザーIDを取得
    const approverUserIds = Object.keys(approverData).filter(id => approverData[id]);
    
    if (approverUserIds.length === 0) {
        listContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">承認者が設定されていません<br><small>下記のドロップダウンからユーザーを選択して追加してください</small></p>';
        return;
    }
    
    listContainer.innerHTML = approverUserIds.map((userId, index) => {
        const user = systemUsers[userId];
        if (!user) return '';
        
        return `
        <div class="approver-item" data-approver-id="${userId}">
            <div class="approver-order">
                <span class="order-number">${index + 1}</span>
            </div>
            <div class="approver-info">
                <div class="approver-name">
                    <i class="fas fa-user-check"></i> ${user.name}
                    ${user.title ? `<span class="approver-title">${user.title}</span>` : ''}
                </div>
                <div class="approver-details">
                    <span class="approver-email">
                        <i class="fas fa-envelope"></i> ${user.email}
                    </span>
                    ${user.department ? `<span class="approver-department"><i class="fas fa-building"></i> ${user.department}</span>` : ''}
                </div>
            </div>
            <div class="approver-actions">
                <button class="btn btn-sm btn-outline" onclick="removeApprover('${userId}')">
                    <i class="fas fa-trash"></i> 削除
                </button>
            </div>
        </div>
    `}).join('');
}

// 承認者数の表示を更新
function updateApproverCountDisplay() {
    const count = Object.keys(approverData).filter(id => approverData[id]).length;
    const addBtn = document.getElementById('addApproverBtn');
    const selectUser = document.getElementById('selectUserForApprover');
    
    // 最大数に達したら追加を無効化
    if (count >= MAX_APPROVERS) {
        if (addBtn) {
            addBtn.disabled = true;
            addBtn.innerHTML = `<i class="fas fa-ban"></i> 承認者数が上限に達しました（${MAX_APPROVERS}人）`;
        }
        if (selectUser) {
            selectUser.disabled = true;
        }
    } else {
        if (addBtn) {
            addBtn.disabled = false;
            addBtn.innerHTML = '<i class="fas fa-plus"></i> 承認者として追加';
        }
        if (selectUser) {
            selectUser.disabled = false;
        }
    }
}

// 承認者削除
function removeApprover(userId) {
    const user = systemUsers[userId];
    if (!user) return;
    
    if (confirm(`「${user.name}」を承認者から削除しますか？`)) {
        delete approverData[userId];
        saveApproverData();
        updateApproverList();
        updateUserSelectionDropdown();
        updateApproverCountDisplay();
        alert(`「${user.name}」を承認者から削除しました。`);
    }
}

// 承認者データをローカルストレージに保存
function saveApproverData() {
    try {
        localStorage.setItem('approverData', JSON.stringify(approverData));
    } catch (e) {
        console.error('承認者データの保存に失敗しました:', e);
    }
}

// 承認者データをローカルストレージから読み込み
function loadApproverData() {
    try {
        const saved = localStorage.getItem('approverData');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(approverData, parsed);
        }
    } catch (e) {
        console.error('承認者データの読み込みに失敗しました:', e);
    }
}

// 承認依頼モーダル表示
function requestApproval(orderNo) {
    const modal = document.getElementById('approvalRequestModal');
    if (!modal) return;
    
    // 注文番号を設定
    document.getElementById('approvalOrderNumber').textContent = orderNo;
    
    // 現在の承認状況を表示
    const approvalData = approvalStatusData[orderNo];
    const currentStatusSection = document.getElementById('currentApprovalSection');
    const currentStatusContainer = document.getElementById('currentApprovalStatus');
    
    if (approvalData && approvalData.approvers && approvalData.approvers.length > 0) {
        // 承認依頼済みの場合、現在の状況を表示
        currentStatusSection.style.display = 'block';
        
        currentStatusContainer.innerHTML = `
            <div class="approval-summary-info">
                <p><i class="fas fa-info-circle"></i> 初回依頼日時: ${new Date(approvalData.requestTimestamp).toLocaleString('ja-JP')}</p>
                ${approvalData.requestComment ? `<p><i class="fas fa-comment"></i> 依頼コメント: ${approvalData.requestComment}</p>` : ''}
            </div>
            <div class="approver-status-list">
                ${approvalData.approvers.map((approver, index) => {
                    const statusClass = approver.status === 'approved' ? 'approved' : 
                                       approver.status === 'rejected' ? 'rejected' : 'pending';
                    const statusText = approver.status === 'approved' ? '承認済み' : 
                                      approver.status === 'rejected' ? '却下' : '承認待ち';
                    const statusIcon = approver.status === 'approved' ? 'fa-check-circle' : 
                                      approver.status === 'rejected' ? 'fa-times-circle' : 'fa-clock';
                    
                    return `
                        <div class="approver-status-item-compact ${statusClass}">
                            <div class="approver-status-header">
                                <div class="approver-info">
                                    <span class="approver-number">${index + 1}</span>
                                    <strong>${approver.approverName}</strong>
                                    ${approver.approverTitle ? `<span class="title-badge">${approver.approverTitle}</span>` : ''}
                                </div>
                                <div class="status-actions">
                                    <span class="approval-badge ${statusClass}">
                                        <i class="fas ${statusIcon}"></i> ${statusText}
                                    </span>
                                    <button class="btn btn-sm btn-outline" onclick="resendToApprover('${orderNo}', '${approver.approverId}')" title="この承認者に再送信">
                                        <i class="fas fa-redo"></i> 再送
                                    </button>
                                </div>
                            </div>
                            ${approver.comment ? 
                                `<div class="approver-comment-compact">
                                    <i class="fas fa-comment"></i> ${approver.comment}
                                </div>` : 
                                ''}
                            ${approver.timestamp ? 
                                `<div class="approver-timestamp-compact">
                                    <i class="fas fa-clock"></i> ${new Date(approver.timestamp).toLocaleString('ja-JP')}
                                </div>` : 
                                ''}
                            ${approver.lastResent ? 
                                `<div class="approver-timestamp-compact" style="color: #ffc107;">
                                    <i class="fas fa-redo"></i> 最終再送: ${new Date(approver.lastResent).toLocaleString('ja-JP')}
                                </div>` : 
                                ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        // 未送信の場合
        currentStatusSection.style.display = 'block';
        currentStatusContainer.innerHTML = `
            <div class="no-approval-message">
                <i class="fas fa-info-circle"></i>
                <p>この注文はまだ承認依頼が送信されていません。</p>
                <p>注文が作成されると、設定された承認者に自動的に承認依頼が送信されます。</p>
            </div>
        `;
    }
    
    openModal(modal);
}

// 個別の承認者に再送信
function resendToApprover(orderNo, approverId) {
    const approvalData = approvalStatusData[orderNo];
    if (!approvalData || !approvalData.approvers) {
        alert('承認依頼データが見つかりません。');
        return;
    }
    
    const approver = approvalData.approvers.find(a => a.approverId === approverId);
    if (!approver) {
        alert('承認者が見つかりません。');
        return;
    }
    
    if (confirm(`${approver.approverName}に承認依頼を再送信しますか？\n\nメール送信先: ${approver.approverEmail}`)) {
        // 実装時はメール送信APIを呼び出し
        console.log(`承認依頼を再送信: 注文No.${orderNo}, 承認者: ${approver.approverName}`);
        
        // 再送信のタイムスタンプを更新（承認状況はリセットしない）
        const approverIndex = approvalData.approvers.findIndex(a => a.approverId === approverId);
        if (approverIndex !== -1) {
            approvalData.approvers[approverIndex].lastResent = new Date().toISOString();
        }
        
        // ローカルストレージに保存
        saveApprovalStatusData();
        
        alert(`${approver.approverName}に承認依頼を再送信しました。\n\nメール送信: ${approver.approverEmail}`);
        
        // モーダルの表示を更新
        requestApproval(orderNo);
    }
}

// 全承認者に一括再送
function resendToAllApprovers() {
    const orderNo = document.getElementById('approvalOrderNumber').textContent;
    const approvalData = approvalStatusData[orderNo];
    
    if (!approvalData || !approvalData.approvers || approvalData.approvers.length === 0) {
        alert('承認依頼が送信されていません。');
        return;
    }
    
    const approverNames = approvalData.approvers.map(a => a.approverName).join('\n  • ');
    const approverEmails = approvalData.approvers.map(a => a.approverEmail).join('\n');
    
    if (confirm(`すべての承認者に承認依頼を再送信しますか？\n\n承認者（${approvalData.approvers.length}名）:\n  • ${approverNames}\n\nメール送信先:\n${approverEmails}`)) {
        // 実装時はメール送信APIを呼び出し
        console.log(`全承認者に再送信: 注文No.${orderNo}`);
        
        // すべての承認者の再送信タイムスタンプを更新
        const now = new Date().toISOString();
        approvalData.approvers.forEach((approver, index) => {
            approvalData.approvers[index].lastResent = now;
        });
        
        // ローカルストレージに保存
        saveApprovalStatusData();
        
        alert(`${approvalData.approvers.length}名の承認者に承認依頼を再送信しました。`);
        
        // モーダルの表示を更新
        requestApproval(orderNo);
    }
}

// 承認モーダル表示
function showApprovalModal(orderNo) {
    const modal = document.getElementById('approvalActionModal');
    if (!modal) return;
    
    // 注文番号を設定
    document.getElementById('actionOrderNumber').textContent = orderNo;
    
    // コメントをクリア
    document.getElementById('actionComment').value = '';
    
    openModal(modal);
}

// 承認処理
function approveOrderAction() {
    const orderNo = document.getElementById('actionOrderNumber').textContent;
    const comment = document.getElementById('actionComment').value.trim();
    
    const approvalData = approvalStatusData[orderNo];
    if (!approvalData || !approvalData.approvers || approvalData.approvers.length === 0) {
        alert('承認依頼が送信されていません。');
        return;
    }
    
    // 実装時は実際のログインユーザーを取得して承認者と照合
    // ここでは承認者を選択させる
    const pendingApprovers = approvalData.approvers.filter(a => a.status === 'pending');
    
    if (pendingApprovers.length === 0) {
        alert('すべての承認者が既に承認/却下を完了しています。');
        return;
    }
    
    // 承認者を選択（実装時はログインユーザーで自動判定）
    let selectedApproverIndex = 0;
    if (pendingApprovers.length > 1) {
        const approverNames = pendingApprovers.map((a, i) => `${i + 1}. ${a.approverName}`).join('\n');
        const selection = prompt(`承認者を選択してください（番号を入力）:\n\n${approverNames}\n\n※実装時は自動判定されます`);
        
        if (!selection || isNaN(selection)) {
            return;
        }
        
        selectedApproverIndex = parseInt(selection) - 1;
        if (selectedApproverIndex < 0 || selectedApproverIndex >= pendingApprovers.length) {
            alert('無効な選択です。');
            return;
        }
    }
    
    const selectedApprover = pendingApprovers[selectedApproverIndex];
    
    if (!comment) {
        if (!confirm('コメントなしで承認しますか？')) {
            return;
        }
    }
    
    // 該当する承認者の状況を更新
    const approverIndex = approvalData.approvers.findIndex(a => 
        a.approverId === selectedApprover.approverId
    );
    
    if (approverIndex !== -1) {
        approvalData.approvers[approverIndex].status = 'approved';
        approvalData.approvers[approverIndex].comment = comment;
        approvalData.approvers[approverIndex].timestamp = new Date().toISOString();
    }
    
    // 全体のステータスを更新
    updateOverallApprovalStatus(orderNo);
    
    // ローカルストレージに保存
    saveApprovalStatusData();
    
    // UIを更新
    updateApprovalStatusUI(orderNo);
    
    // モーダルを閉じる
    closeModal('approvalActionModal');
    
    // 成功メッセージ
    const overall = approvalStatusData[orderNo].overallStatus;
    if (overall === 'approved') {
        alert(`注文No.${orderNo}を承認しました。\n\nすべての承認者の承認が完了しました！`);
    } else {
        alert(`注文No.${orderNo}を承認しました。\n\n残り${approvalData.approvers.filter(a => a.status === 'pending').length}人の承認待ちです。`);
    }
}

// 却下処理
function rejectOrderAction() {
    const orderNo = document.getElementById('actionOrderNumber').textContent;
    const comment = document.getElementById('actionComment').value.trim();
    
    if (!comment) {
        alert('却下の理由を入力してください。');
        document.getElementById('actionComment').focus();
        return;
    }
    
    if (!confirm('この注文を却下しますか？\n\n※1人でも却下すると、注文全体が却下されます。')) {
        return;
    }
    
    const approvalData = approvalStatusData[orderNo];
    if (!approvalData || !approvalData.approvers || approvalData.approvers.length === 0) {
        alert('承認依頼が送信されていません。');
        return;
    }
    
    // 承認者を選択（実装時はログインユーザーで自動判定）
    const pendingApprovers = approvalData.approvers.filter(a => a.status === 'pending');
    
    if (pendingApprovers.length === 0) {
        alert('すべての承認者が既に承認/却下を完了しています。');
        return;
    }
    
    let selectedApproverIndex = 0;
    if (pendingApprovers.length > 1) {
        const approverNames = pendingApprovers.map((a, i) => `${i + 1}. ${a.approverName}`).join('\n');
        const selection = prompt(`承認者を選択してください（番号を入力）:\n\n${approverNames}\n\n※実装時は自動判定されます`);
        
        if (!selection || isNaN(selection)) {
            return;
        }
        
        selectedApproverIndex = parseInt(selection) - 1;
        if (selectedApproverIndex < 0 || selectedApproverIndex >= pendingApprovers.length) {
            alert('無効な選択です。');
            return;
        }
    }
    
    const selectedApprover = pendingApprovers[selectedApproverIndex];
    
    // 該当する承認者の状況を更新
    const approverIndex = approvalData.approvers.findIndex(a => 
        a.approverId === selectedApprover.approverId
    );
    
    if (approverIndex !== -1) {
        approvalData.approvers[approverIndex].status = 'rejected';
        approvalData.approvers[approverIndex].comment = comment;
        approvalData.approvers[approverIndex].timestamp = new Date().toISOString();
    }
    
    // 1人でも却下したら全体を却下
    approvalData.overallStatus = 'rejected';
    
    // ローカルストレージに保存
    saveApprovalStatusData();
    
    // UIを更新
    updateApprovalStatusUI(orderNo);
    
    // モーダルを閉じる
    closeModal('approvalActionModal');
    
    // 成功メッセージ
    alert(`注文No.${orderNo}を却下しました。`);
}

// 全体の承認ステータスを更新
function updateOverallApprovalStatus(orderNo) {
    const approvalData = approvalStatusData[orderNo];
    if (!approvalData || !approvalData.approvers) return;
    
    const approvers = approvalData.approvers;
    const approvedCount = approvers.filter(a => a.status === 'approved').length;
    const rejectedCount = approvers.filter(a => a.status === 'rejected').length;
    const pendingCount = approvers.filter(a => a.status === 'pending').length;
    
    if (rejectedCount > 0) {
        // 1人でも却下したら全体を却下
        approvalData.overallStatus = 'rejected';
    } else if (approvedCount === approvers.length) {
        // 全員が承認したら承認済み
        approvalData.overallStatus = 'approved';
    } else if (approvedCount > 0 && pendingCount > 0) {
        // 一部承認、一部承認待ち
        approvalData.overallStatus = 'partial';
    } else {
        // 全員承認待ち
        approvalData.overallStatus = 'pending';
    }
}

// 承認状況UIを更新
function updateApprovalStatusUI(orderNo) {
    const badge = document.getElementById(`approval-status-${orderNo}`);
    if (!badge) return;
    
    const approval = approvalStatusData[orderNo];
    
    if (!approval || !approval.approvers || approval.approvers.length === 0) {
        // 承認依頼未送信
        badge.className = 'approval-badge not-requested';
        badge.textContent = '未依頼';
    } else {
        const totalApprovers = approval.approvers.length;
        const approvedCount = approval.approvers.filter(a => a.status === 'approved').length;
        const rejectedCount = approval.approvers.filter(a => a.status === 'rejected').length;
        const status = approval.overallStatus || 'pending';
        
        if (status === 'rejected') {
            // 却下
            badge.className = 'approval-badge rejected';
            badge.textContent = `却下 (${approvedCount}/${totalApprovers}人承認済み)`;
        } else if (status === 'approved') {
            // 全員承認済み
            badge.className = 'approval-badge approved';
            badge.textContent = `承認済み (${approvedCount}/${totalApprovers}人)`;
        } else if (status === 'partial') {
            // 一部承認済み
            badge.className = 'approval-badge partial';
            badge.textContent = `${approvedCount}/${totalApprovers}人承認済み`;
        } else {
            // 全員承認待ち
            badge.className = 'approval-badge pending';
            badge.textContent = `承認待ち (0/${totalApprovers}人)`;
        }
    }
}

// 承認状況データを取得
function getApprovalStatus(orderNo) {
    return approvalStatusData[orderNo] || { status: 'pending' };
}

// 注文情報を取得（承認用）
function getOrderInfoForApproval(orderNo) {
    const row = document.querySelector(`tr[data-order-id="${orderNo}"]`);
    if (!row) {
        return {
            orderNo: orderNo,
            nameplate: '不明',
            requester: '不明',
            amount: '¥0',
            paymentMethod: '不明'
        };
    }
    
    return {
        orderNo: orderNo,
        nameplate: row.querySelector('td:nth-child(4)')?.textContent || '不明',
        requester: row.querySelector('td:nth-child(5)')?.textContent || '不明',
        amount: row.querySelector('.amount')?.textContent || '¥0',
        paymentMethod: row.querySelector('.payment-badge')?.textContent || '不明'
    };
}

// 承認状況データをローカルストレージに保存
function saveApprovalStatusData() {
    try {
        localStorage.setItem('approvalStatusData', JSON.stringify(approvalStatusData));
    } catch (e) {
        console.error('承認状況データの保存に失敗しました:', e);
    }
}

// 承認状況データをローカルストレージから読み込み
function loadApprovalStatusData() {
    try {
        const saved = localStorage.getItem('approvalStatusData');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(approvalStatusData, parsed);
        }
    } catch (e) {
        console.error('承認状況データの読み込みに失敗しました:', e);
    }
}

// ページ読み込み時に承認データを読み込む
document.addEventListener('DOMContentLoaded', function() {
    loadApproverData();
    loadApprovalStatusData();
    
    // すべての注文の承認状況UIを更新
    const allOrders = document.querySelectorAll('[data-order-id]');
    allOrders.forEach(row => {
        const orderNo = row.getAttribute('data-order-id');
        if (orderNo) {
            updateApprovalStatusUI(orderNo);
        }
    });
    
    // 権限に応じた表示制御を適用
    applyRoleBasedRestrictions();
});

// ========================================
// 権限制御機能
// ========================================

// 権限に応じた表示制御を適用
function applyRoleBasedRestrictions() {
    const role = getCurrentUserRole();
    
    console.log('現在のユーザー権限:', role);
    
    if (role === 'admin') {
        applyAdminRestrictions();
    } else if (role === 'approver') {
        applyApproverRestrictions();
    } else if (role === 'staff') {
        applyStaffRestrictions();
    }
}

// 管理者用の制限を適用
function applyAdminRestrictions() {
    console.log('管理者モード: 承認ボタンを非表示');
    
    // 承認処理ボタンを非表示
    hideApprovalActionButtons();
}

// 承認者用の制限を適用
function applyApproverRestrictions() {
    console.log('承認者モード: 承認依頼が来ている注文のみ表示');
    
    const currentUser = getCurrentUser();
    
    // すべての注文行を取得
    const allOrders = document.querySelectorAll('tbody tr[data-order-id]');
    let visibleCount = 0;
    
    allOrders.forEach(row => {
        const orderNo = row.getAttribute('data-order-id');
        const approvalData = approvalStatusData[orderNo];
        
        // 承認依頼があり、かつ現在のユーザーが承認者に含まれているかチェック
        let shouldShow = false;
        if (approvalData && approvalData.approvers) {
            const isAssignedApprover = approvalData.approvers.some(a => 
                a.approverEmail === currentUser.email && a.status === 'pending'
            );
            shouldShow = isAssignedApprover;
        }
        
        if (shouldShow) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // ご葬家グループの表示も制御
    updateFuneralGroupsVisibility();
    
    // 編集・削除機能を無効化
    disableEditDeleteButtons();
    
    // 新規作成ボタンを非表示
    hideNewFuneralButton();
    
    // 承認者設定ボタンを非表示
    hideApproverSettingsButton();
    
    console.log(`承認者として表示する注文: ${visibleCount}件`);
    
    // 統計サマリーを更新
    updateOrderSummary();
}

// 担当者用の制限を適用
function applyStaffRestrictions() {
    console.log('担当者モード: 自分が担当の注文のみ表示（読取専用）');
    
    const currentUser = getCurrentUser();
    
    // すべての注文行を取得
    const allOrders = document.querySelectorAll('tbody tr[data-order-id]');
    let visibleCount = 0;
    
    allOrders.forEach(row => {
        const orderNo = row.getAttribute('data-order-id');
        // 担当者情報を取得（data属性から）
        const assignedStaff = row.getAttribute('data-staff') || '';
        
        // 現在のユーザーが担当者に含まれているかチェック
        const isAssigned = assignedStaff.includes(currentUser.name);
        
        if (isAssigned) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // ご葬家グループの表示も制御
    updateFuneralGroupsVisibility();
    
    // すべての編集機能を無効化
    disableAllEditFunctions();
    
    // 新規作成ボタンを非表示
    hideNewFuneralButton();
    
    // 承認者設定ボタンを非表示
    hideApproverSettingsButton();
    
    // 承認処理ボタンを非表示
    hideApprovalActionButtons();
    
    console.log(`担当者として表示する注文: ${visibleCount}件`);
    
    // 統計サマリーを更新
    updateOrderSummary();
}

// 承認処理ボタンを非表示
function hideApprovalActionButtons() {
    // 承認処理ボタン（各行）
    const approvalButtons = document.querySelectorAll('[onclick^="showApprovalModal"]');
    approvalButtons.forEach(btn => {
        btn.style.display = 'none';
    });
}

// 編集・削除ボタンを無効化
function disableEditDeleteButtons() {
    // 編集ボタン
    const editButtons = document.querySelectorAll('[onclick^="editOrder"], .btn-edit');
    editButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.title = '編集権限がありません';
    });
    
    // 削除・キャンセルボタン
    const deleteButtons = document.querySelectorAll('[onclick^="cancelOrder"], [onclick^="deleteOrder"], .btn-delete');
    deleteButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.title = '削除権限がありません';
    });
    
    // 一括操作ボタン
    const bulkButtons = document.querySelectorAll('#bulkCancelBtn, #bulkReviveBtn');
    bulkButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });
    
    // チェックボックスを無効化
    const checkboxes = document.querySelectorAll('.row-checkbox, .group-checkbox, #selectAll');
    checkboxes.forEach(cb => {
        cb.disabled = true;
        cb.style.cursor = 'not-allowed';
    });
}

// すべての編集機能を無効化（担当者用）
function disableAllEditFunctions() {
    // 編集・削除ボタンを無効化
    disableEditDeleteButtons();
    
    // すべての入力欄を読取専用に（アカウント関連以外）
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // アカウント関連の入力は除外
        if (!input.closest('.account-info') && !input.closest('.account-dropdown')) {
            input.disabled = true;
        }
    });
    
    // すべてのボタンを無効化（表示ボタン・アカウント関連以外）
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        // アカウント関連のボタンは常に有効
        if (btn.closest('.account-info') || 
            btn.closest('.account-dropdown') || 
            btn.closest('.account-switcher-modal') ||
            btn.classList.contains('account-button') ||
            btn.classList.contains('account-switcher-close')) {
            return; // アカウント関連は無効化しない
        }
        
        // 表示・閉じる・更新・注文書ボタンは有効のまま
        const allowedActions = ['show', 'close', 'refresh', 'Modal', 'generateOrderForm'];
        const onclick = btn.getAttribute('onclick') || '';
        const isAllowed = allowedActions.some(action => onclick.includes(action));
        
        if (!isAllowed && !btn.classList.contains('modal-close')) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    });
}

// 新規ご葬家ボタンを非表示
function hideNewFuneralButton() {
    const newFuneralButton = document.querySelector('[onclick="showNewFuneralForm()"]');
    if (newFuneralButton) {
        newFuneralButton.style.display = 'none';
    }
}

// 承認者設定ボタンを非表示
function hideApproverSettingsButton() {
    const approverSettingsButton = document.querySelector('[onclick="showApproverSettings()"]');
    if (approverSettingsButton) {
        approverSettingsButton.style.display = 'none';
    }
}

// ご葬家グループの表示を更新（空のグループを非表示）
function updateFuneralGroupsVisibility() {
    const funeralGroups = document.querySelectorAll('.funeral-group');
    
    funeralGroups.forEach(group => {
        const visibleOrders = group.querySelectorAll('tbody tr[data-order-id]:not([style*="display: none"])');
        
        if (visibleOrders.length === 0) {
            group.style.display = 'none';
        } else {
            group.style.display = '';
        }
    });
}

// 顧客一覧帳票生成
function generateCustomerList(funeralId) {
    // ご葬儀情報を取得
    const funeralGroup = document.querySelector(`[data-funeral-id="${funeralId}"]`);
    if (!funeralGroup) {
        alert('ご葬儀情報が見つかりません。');
        return;
    }
    
    const funeralTitle = funeralGroup.querySelector('.funeral-title h3').textContent;
    const deceasedName = funeralGroup.querySelector('.deceased-name').textContent;
    
    // 顧客データを取得
    const customers = getCustomersByFuneralId(funeralId);
    
    if (customers.length === 0) {
        alert('選択されたご葬儀に顧客データがありません。');
        return;
    }
    
    // モーダルに表示する内容を生成
    generateCustomerListContent(funeralTitle, deceasedName, customers);
    
    // モーダルを表示
    const modal = document.getElementById('customerListModal');
    openModal(modal);
}

// ご葬儀IDに基づいて顧客データを取得
function getCustomersByFuneralId(funeralId) {
    const customers = [];
    const funeralGroup = document.querySelector(`[data-funeral-id="${funeralId}"]`);
    
    if (!funeralGroup) return customers;
    
    const orders = funeralGroup.querySelectorAll('.orders-table tbody tr');
    orders.forEach((order, index) => {
        const orderId = order.dataset.orderId;
        const status = order.dataset.status;
        
        // 有効な注文のみを対象とする
        if (status === 'active') {
            const customer = {
                id: orderId,
                funeralId: funeralId,
                orderNumber: order.cells[1].textContent,
                orderDate: order.cells[2].textContent,
                nameplate: order.cells[3].textContent,
                clientName: order.cells[4].textContent,
                phone: order.cells[5].textContent,
                amount: parseAmount(order.cells[6].textContent),
                fee: parseAmount(order.cells[7].textContent),
                paymentMethod: order.cells[8].textContent,
                status: status
            };
            
            // 住所情報を取得（実際のシステムでは別途取得が必要）
            customer.postalCode = '123-4567'; // 仮のデータ
            customer.address = '東京都渋谷区○○1-2-3'; // 仮のデータ
            
            customers.push(customer);
        }
    });
    
    return customers;
}

// 金額の解析
function parseAmount(amountText) {
    const cleaned = amountText.replace(/[¥,]/g, '');
    return parseInt(cleaned) || 0;
}

// 金額のフォーマット
function formatAmount(amount) {
    return `¥${amount.toLocaleString()}`;
}

// 顧客一覧帳票の内容生成
function generateCustomerListContent(funeralTitle, deceasedName, customers) {
    const content = document.getElementById('customerListContent');
    const funeralNameDisplay = document.getElementById('funeralNameDisplay');
    
    // ご葬儀名を表示
    funeralNameDisplay.textContent = `${funeralTitle} ${deceasedName}`;
    
    // 合計金額の計算
    const totalAmount = customers.reduce((sum, customer) => sum + customer.amount, 0);
    const totalFee = customers.reduce((sum, customer) => sum + customer.fee, 0);
    const totalSettlement = totalAmount + totalFee;
    
    // 帳票のHTMLを生成
    content.innerHTML = `
        <div class="customer-list-container">
            <div class="customer-list-header">
                <div class="header-left">
                    <div class="implementation-date">【実施日】${getCurrentDate()}</div>
                    <div class="church-name">【教会名】</div>
                    <div class="funeral-name">${funeralTitle}様ご葬儀</div>
                    <div class="amount-summary">
                        <div class="amount-item">
                            <span class="amount-label">領収金額 合計</span>
                            <span class="amount-value">${formatAmount(totalAmount)}</span>
                        </div>
                        <div class="amount-item">
                            <span class="amount-label">事務手数料 合計</span>
                            <span class="amount-value">${formatAmount(totalFee)}</span>
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    <div class="settlement-summary">
                        精算額合計 付け花合計<br>
                        ${formatAmount(totalSettlement)}
                    </div>
                </div>
            </div>
            
            <table class="customer-list-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>受注<br>月日</th>
                        <th>芳名板記載内容</th>
                        <th>依頼者名<br>(敬称略)</th>
                        <th>郵便番号</th>
                        <th>住所</th>
                        <th>電話番号</th>
                        <th>領収<br>金額</th>
                        <th>事務<br>手数料</th>
                        <th>精算額</th>
                    </tr>
                </thead>
                <tbody>
                    ${customers.map((customer, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${customer.orderDate}</td>
                            <td>${customer.nameplate}</td>
                            <td>${customer.clientName}</td>
                            <td>${customer.postalCode}</td>
                            <td>${customer.address}</td>
                            <td>${customer.phone}</td>
                            <td class="amount-cell">${formatAmount(customer.amount)}</td>
                            <td class="amount-cell">${formatAmount(customer.fee)}</td>
                            <td class="amount-cell">${formatAmount(customer.amount + customer.fee)}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="7">合計</td>
                        <td class="amount-cell">${formatAmount(totalAmount)}</td>
                        <td class="amount-cell">${formatAmount(totalFee)}</td>
                        <td class="amount-cell">${formatAmount(totalSettlement)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// 現在の日付を取得
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

// 印刷機能
function printCustomerList() {
    const printContent = document.getElementById('customerListContent').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>顧客一覧帳票</title>
            <style>
                body { font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif; margin: 0; padding: 20px; }
                .customer-list-container { border: 2px solid #000; padding: 20px; }
                .customer-list-table { width: 100%; border-collapse: collapse; }
                .customer-list-table th, .customer-list-table td { border: 1px solid #000; padding: 8px 6px; }
                .customer-list-table th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
                .amount-cell { text-align: right; font-weight: bold; }
                .total-row { background-color: #f8f8f8; font-weight: bold; }
                @media print { body { margin: 0; padding: 10px; } }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// PDF保存機能
function downloadCustomerListPDF() {
    // 実際の実装では、PDF生成ライブラリ（jsPDF等）を使用
    alert('PDF保存機能は実装中です。');
}
