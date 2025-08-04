// 注文管理用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初期化
    initializeOrderManagement();
    
    // イベントリスナーの設定
    setupEventListeners();
    
    // データの更新
    updateOrderSummary();
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
    let hasSpecialAmount = false;
    
    orders.forEach(order => {
        const status = order.getAttribute('data-status');
        const hasSpecial = order.classList.contains('special-amount');
        
        if (status === 'active') {
            hasActive = true;
        } else if (status === 'cancelled') {
            hasCancelled = true;
        }
        
        if (hasSpecial) {
            hasSpecialAmount = true;
        }
    });
    
    // 状態に応じてクラスを設定
    group.classList.remove('normal', 'has-cancelled', 'all-cancelled', 'has-special-amount');
    
    if (!hasActive && hasCancelled) {
        group.classList.add('all-cancelled');
    } else if (hasCancelled) {
        group.classList.add('has-cancelled');
    } else if (hasSpecialAmount) {
        group.classList.add('has-special-amount');
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
    const flowerOrders = document.querySelectorAll('.flower-badge.yes');
    
    let totalAmount = 0;
    activeOrders.forEach(order => {
        const amountText = order.querySelector('.amount').textContent;
        const amount = parseInt(amountText.replace(/[¥,]/g, ''));
        totalAmount += amount;
    });
    
    // サマリーカードを更新
    updateElement('activeTotalOrders', activeOrders.length);
    updateElement('activeTotalAmount', `¥${totalAmount.toLocaleString()}`);
    updateElement('flowerOrders', flowerOrders.length);
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
        
        modal.style.display = 'block';
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
        flower: 'なし',
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
    document.getElementById('detailFlower').textContent = mockData.flower;
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
        modal.style.display = 'none';
    }
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
    
    modal.style.display = 'block';
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
            flower: 'no',
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
            flower: 'yes',
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
        flower: 'no',
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
    document.getElementById('editFlower').value = data.flower;
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
        flower: document.getElementById('editFlower').value,
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
        // 付け花
        const flowerBadge = cells[9].querySelector('.flower-badge');
        if (flowerBadge) {
            flowerBadge.className = `flower-badge ${data.flower}`;
            flowerBadge.textContent = data.flower === 'yes' ? 'あり' : 'なし';
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
            flower: false,
            client: {
                name: '山田花子',
                postalCode: '123-4567',
                address: '東京都渋谷区1-2-3',
                phone: '090-1234-5678'
            },
            billing: {
                name: '株式会社サンプル',
                company: '株式会社サンプル',
                contact: '山田太郎',
                postalCode: '123-4567',
                address: '東京都渋谷区1-2-3',
                phone: '03-1234-5678'
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
    
    modal.style.display = 'block';
}

// 注文書HTML生成
function generateOrderFormHTML(orderNo, data) {
    return `
        <div class="order-form-header">
            <div class="order-form-title">生花寄贈注文書</div>
            <div class="order-form-subtitle">注文番号: ${orderNo} | 作成日: ${new Date().toLocaleDateString('ja-JP')}</div>
        </div>
        
        <div class="order-form-body">
            <div class="form-section">
                <h3>ご葬儀情報</h3>
                <div class="form-row">
                    <span class="form-label">ご葬家名:</span>
                    <span class="form-value important">${data.funeralFamily}家のご葬儀</span>
                </div>
                <div class="form-row">
                    <span class="form-label">故人名:</span>
                    <span class="form-value important">${data.deceased}様</span>
                </div>
                <div class="form-row">
                    <span class="form-label">葬儀日程:</span>
                    <span class="form-value">${data.funeralDate}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">会場:</span>
                    <span class="form-value">${data.venue}</span>
                </div>
            </div>
            
            <div class="form-section">
                <h3>注文内容</h3>
                <div class="form-row">
                    <span class="form-label">受注日:</span>
                    <span class="form-value">${data.orderDate}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">芳名板:</span>
                    <span class="form-value important">${data.nameplate}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">金額:</span>
                    <span class="form-value important">¥${data.amount.toLocaleString()}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">手数料:</span>
                    <span class="form-value">¥${data.fee.toLocaleString()}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">付け花:</span>
                    <span class="form-value">${data.flower ? 'あり' : 'なし'}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">支払方法:</span>
                    <span class="form-value important">${data.paymentMethod}</span>
                </div>
            </div>
            
            <div class="form-section">
                <h3>ご依頼者情報</h3>
                <div class="form-row">
                    <span class="form-label">お名前:</span>
                    <span class="form-value">${data.client.name}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">郵便番号:</span>
                    <span class="form-value">${data.client.postalCode}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">ご住所:</span>
                    <span class="form-value">${data.client.address}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">電話番号:</span>
                    <span class="form-value">${data.client.phone}</span>
                </div>
            </div>
            
            ${data.paymentMethod === '振込' ? `
            <div class="form-section">
                <h3>請求先情報</h3>
                <div class="form-row">
                    <span class="form-label">請求先:</span>
                    <span class="form-value">${data.billing.name}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">会社・団体名:</span>
                    <span class="form-value">${data.billing.company}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">担当者:</span>
                    <span class="form-value">${data.billing.contact}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">住所:</span>
                    <span class="form-value">${data.billing.address}</span>
                </div>
            </div>
            ` : ''}
            
            ${data.memo ? `
            <div class="form-section">
                <h3>備考</h3>
                <div class="form-row">
                    <span class="form-value">${data.memo}</span>
                </div>
            </div>
            ` : ''}
        </div>
    `;
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

// ご葬家別見積書作成
function generateFuneralQuotes(funeralId) {
    try {
        console.log('見積書作成開始:', funeralId);
        const funeralName = getFuneralName(funeralId);
        console.log('ご葬家名:', funeralName);
        
        const orders = getFuneralOrders(funeralId, 'all'); // 全注文対象
        console.log('注文データ:', orders);
        
        if (orders.length === 0) {
            alert('見積対象の注文がありません。');
            return;
        }
        
        const quoteData = getFuneralQuoteData(funeralId);
        console.log('見積書データ:', quoteData);
        
        showDocumentModal('見積書', funeralName, quoteData, 'quote');
    } catch (error) {
        console.error('見積書作成エラー:', error);
        alert('見積書の作成中にエラーが発生しました。コンソールを確認してください。');
    }
}

// ご葬家別納品書作成
function generateFuneralDeliveryNotes(funeralId) {
    try {
        console.log('納品書作成開始:', funeralId);
        const funeralName = getFuneralName(funeralId);
        console.log('ご葬家名:', funeralName);
        
        const orders = getFuneralOrders(funeralId, 'all'); // 全注文対象
        console.log('注文データ:', orders);
        
        if (orders.length === 0) {
            alert('納品対象の注文がありません。');
            return;
        }
        
        const deliveryData = getFuneralDeliveryData(funeralId);
        console.log('納品書データ:', deliveryData);
        
        showDocumentModal('納品書', funeralName, deliveryData, 'delivery');
    } catch (error) {
        console.error('納品書作成エラー:', error);
        alert('納品書の作成中にエラーが発生しました。コンソールを確認してください。');
    }
}

function generateFuneralLabels(funeralId) {
    const funeralName = getFuneralName(funeralId);
    const orders = getFuneralOrders(funeralId, 'transfer'); // 振込払いのみ（宛名ラベル必要）
    
    if (orders.length === 0) {
        alert('請求書送付対象の注文がありません。');
        return;
    }
    
    const labelData = getFuneralLabelData(funeralId);
    showAddressLabelModal(funeralName, labelData);
}

// 宛名ラベルデータ取得
function getFuneralLabelData(funeralId) {
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
                phone: mockBillingData.phone
            });
        }
    });
    
    return labelData;
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
function showAddressLabelModal(funeralName, labelData) {
    const modal = document.getElementById('addressLabelModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = generateAddressLabelHTML(funeralName, labelData);
    modal.style.display = 'block';
    
    // 初期プレビュー更新
    setTimeout(() => updateEnvelopePreview(), 100);
}

// 宛名ラベルHTML生成
function generateAddressLabelHTML(funeralName, labelData) {
    return `
        <div class="address-label-container">
            <div class="address-label-header">
                <div class="address-label-title"><i class="fas fa-tags"></i> 宛名ラベル印刷プレビュー</div>
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
            
            <div class="sender-info">
                <h4><i class="fas fa-user"></i> 差出人情報</h4>
                <div class="sender-form">
                    <div class="form-row">
                        <label>郵便番号:</label>
                        <input type="text" id="senderPostal" value="100-0001" placeholder="例: 100-0001" onchange="updateEnvelopePreview()">
                    </div>
                    <div class="form-row">
                        <label>住所:</label>
                        <input type="text" id="senderAddress" value="東京都千代田区千代田1-1" placeholder="差出人住所" onchange="updateEnvelopePreview()">
                    </div>
                    <div class="form-row">
                        <label>会社名:</label>
                        <input type="text" id="senderCompany" value="○○生花店" placeholder="会社・店舗名" onchange="updateEnvelopePreview()">
                    </div>
                    <div class="form-row">
                        <label>担当者:</label>
                        <input type="text" id="senderContact" value="" placeholder="担当者名（任意）" onchange="updateEnvelopePreview()">
                    </div>
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
    
    // 差出人情報取得
    const senderData = {
        postal: document.getElementById('senderPostal')?.value || '',
        address: document.getElementById('senderAddress')?.value || '',
        company: document.getElementById('senderCompany')?.value || '',
        contact: document.getElementById('senderContact')?.value || ''
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
            const mockData = generateMockExcelData(order, index);
            
            return {
                no: order.orderNo,
                deceased: funeralInfo.deceased, // 故人
                nameplate: order.nameplate, // 芳名板記載内容
                requester: order.requester, // 依頼者名
                amount: order.amount, // 金額
                fee: mockData.fee, // 有料（手数料等）
                remarks: mockData.remarks, // 備考
                receiptRequired: mockData.receiptRequired, // 領収証要否
                invoiceRequired: mockData.invoiceRequired, // 請求書要否
                invoiceAddress: mockData.invoiceAddress, // 請求書送付先
                deliveryDate: mockData.deliveryDate, // 納品日
                deliveryTime: mockData.deliveryTime, // 納品時間
                deliveryLocation: mockData.deliveryLocation, // 納品場所
                flowerType: mockData.flowerType, // 花の種類
                flowerSize: mockData.flowerSize, // 花のサイズ
                arrangement: mockData.arrangement, // 配置
                location: mockData.location, // 住所
                phoneNumber: mockData.phoneNumber, // 電話番号
                paymentMethod: order.paymentMethod, // 支払方法
                // 計算用数値
                amountNum: parseInt(order.amount.replace(/[¥,]/g, '')) || 0,
                feeNum: parseInt(mockData.fee.replace(/[¥,]/g, '')) || 0
            };
        });
        
        // 合計計算
        const totalAmount = excelData.reduce((sum, item) => sum + item.amountNum, 0);
        const totalFee = excelData.reduce((sum, item) => sum + item.feeNum, 0);
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

// Excel用モックデータ生成
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
        modal.style.display = 'block';
        
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
                    <button class="btn btn-outline" onclick="downloadExcelTSV()">
                        <i class="fas fa-download"></i> TSV出力
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
                            <th>No.</th>
                            <th>故人</th>
                            <th>芳名板記載内容</th>
                            <th>依頼者名（依頼者）</th>
                            <th>金額</th>
                            <th>有料</th>
                            <th>備考</th>
                            <th>領収証要否</th>
                            <th>請求書要否</th>
                            <th>請求書送付先</th>
                            <th>納品日</th>
                            <th>納品時間</th>
                            <th>納品場所</th>
                            <th>花の種類</th>
                            <th>花のサイズ</th>
                            <th>配置</th>
                            <th>住所</th>
                            <th>電話番号</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.orders.map(order => `
                            <tr>
                                <td>${order.no}</td>
                                <td>${order.deceased}</td>
                                <td>${order.nameplate}</td>
                                <td>${order.requester}</td>
                                <td>${order.amount}</td>
                                <td>${order.fee}</td>
                                <td>${order.remarks}</td>
                                <td>${order.receiptRequired}</td>
                                <td>${order.invoiceRequired}</td>
                                <td>${order.invoiceAddress}</td>
                                <td>${order.deliveryDate}</td>
                                <td>${order.deliveryTime}</td>
                                <td>${order.deliveryLocation}</td>
                                <td>${order.flowerType}</td>
                                <td>${order.flowerSize}</td>
                                <td>${order.arrangement}</td>
                                <td>${order.location}</td>
                                <td>${order.phoneNumber}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td><strong>合計</strong></td>
                            <td><strong>${data.summary.totalCount}件</strong></td>
                            <td colspan="2"></td>
                            <td><strong>¥${data.summary.totalAmount.toLocaleString()}</strong></td>
                            <td><strong>¥${data.summary.totalFee.toLocaleString()}</strong></td>
                            <td colspan="12"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <!-- 集計情報 -->
            <div class="excel-summary">
                <h3><i class="fas fa-chart-pie"></i> 集計情報</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <label>総注文件数:</label>
                        <span class="summary-value">${data.summary.totalCount}件</span>
                    </div>
                    <div class="summary-item">
                        <label>総金額:</label>
                        <span class="summary-value">¥${data.summary.totalAmount.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <label>総手数料:</label>
                        <span class="summary-value">¥${data.summary.totalFee.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <label>振込払い:</label>
                        <span class="summary-value">${data.summary.paymentSummary.transfer}件</span>
                    </div>
                    <div class="summary-item">
                        <label>現地払い:</label>
                        <span class="summary-value">${data.summary.paymentSummary.onsite}件</span>
                    </div>
                </div>
            </div>
            
            <!-- TSV形式プレビュー -->
            <div class="excel-tsv-preview">
                <div class="tsv-header">
                    <h3><i class="fas fa-code"></i> TSV形式プレビュー</h3>
                    <button class="btn btn-sm btn-outline" onclick="copyTSVToClipboard()">
                        <i class="fas fa-copy"></i> TSVをコピー
                    </button>
                </div>
                <div class="tsv-content">
                    <pre id="tsv-preview">${generateTSVContent(data)}</pre>
                </div>
            </div>
        </div>
    `;
}

// TSVコンテンツ生成
function generateTSVContent(data) {
    // ヘッダー行（指定された項目に合わせて）
    const headers = [
        'No.', '故人', '芳名板記載内容', '依頼者名（依頼者）', '金額', '有料', 
        '備考', '領収証要否', '請求書要否', '請求書送付先', '納品日', '納品時間', 
        '納品場所', '花の種類', '花のサイズ', '配置', '住所', '電話番号'
    ];
    
    // データ行
    const rows = data.orders.map(order => [
        order.no,
        order.deceased,
        order.nameplate,
        order.requester,
        order.amount,
        order.fee,
        order.remarks,
        order.receiptRequired,
        order.invoiceRequired,
        order.invoiceAddress,
        order.deliveryDate,
        order.deliveryTime,
        order.deliveryLocation,
        order.flowerType,
        order.flowerSize,
        order.arrangement,
        order.location,
        order.phoneNumber
    ]);
    
    // 合計行
    const totalRow = [
        '合計',
        `${data.summary.totalCount}件`,
        '', '', 
        `¥${data.summary.totalAmount.toLocaleString()}`,
        `¥${data.summary.totalFee.toLocaleString()}`,
        '', '', '', '', '', '', '', '', '', '', '', ''
    ];
    
    // TSV形式で結合（タブ区切り）
    const allRows = [headers, ...rows, totalRow];
    return allRows.map(row => row.join('\t')).join('\n');
}

// CSVコンテンツ生成
function generateCSVContent(data) {
    // ヘッダー行（指定された項目に合わせて）
    const headers = [
        'No.', '故人', '芳名板記載内容', '依頼者名（依頼者）', '金額', '有料', 
        '備考', '領収証要否', '請求書要否', '請求書送付先', '納品日', '納品時間', 
        '納品場所', '花の種類', '花のサイズ', '配置', '住所', '電話番号'
    ];
    
    // データ行（CSV用にカンマを含む可能性があるためクォートで囲む）
    const rows = data.orders.map(order => [
        `"${order.no}"`,
        `"${order.deceased}"`,
        `"${order.nameplate}"`,
        `"${order.requester}"`,
        `"${order.amount}"`,
        `"${order.fee}"`,
        `"${order.remarks}"`,
        `"${order.receiptRequired}"`,
        `"${order.invoiceRequired}"`,
        `"${order.invoiceAddress}"`,
        `"${order.deliveryDate}"`,
        `"${order.deliveryTime}"`,
        `"${order.deliveryLocation}"`,
        `"${order.flowerType}"`,
        `"${order.flowerSize}"`,
        `"${order.arrangement}"`,
        `"${order.location}"`,
        `"${order.phoneNumber}"`
    ]);
    
    // 合計行
    const totalRow = [
        '"合計"',
        `"${data.summary.totalCount}件"`,
        '""', '""',
        `"¥${data.summary.totalAmount.toLocaleString()}"`,
        `"¥${data.summary.totalFee.toLocaleString()}"`,
        '""', '""', '""', '""', '""', '""', '""', '""', '""', '""', '""', '""'
    ];
    
    // CSV形式で結合（カンマ区切り）
    const allRows = [headers.map(h => `"${h}"`), ...rows, totalRow];
    return allRows.map(row => row.join(',')).join('\n');
}

// 表をクリップボードにコピー
function copyTableToClipboard() {
    try {
        const table = document.getElementById('excel-copy-table');
        if (!table) {
            alert('コピー対象の表が見つかりません。');
            return;
        }
        
        // 表の選択
        const range = document.createRange();
        range.selectNode(table);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // クリップボードにコピー
        const success = document.execCommand('copy');
        selection.removeAllRanges();
        
        if (success) {
            // 成功メッセージ
            showCopySuccess('表をクリップボードにコピーしました！Excelに貼り付け（Ctrl+V）してください。');
        } else {
            throw new Error('コピーに失敗しました');
        }
        
    } catch (error) {
        console.error('表コピーエラー:', error);
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
    
    modal.style.display = 'block';
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
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td><span class="order-number">${order.orderNo}</span></td>
                        <td><div class="nameplate-content">${order.nameplate}</div></td>
                        <td>${order.client}</td>
                        <td>${order.amount}</td>
                        <td><div class="order-memo ${order.memo === '特記事項なし' ? 'empty' : ''}">${order.memo}</div></td>
                    </tr>
                `).join('')}
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
                .order-memo { font-style: italic; color: #666; }
                .order-memo.empty { color: #999; font-size: 0.9rem; }
                .florist-order-footer { border: 1px solid #ddd; padding: 15px; text-align: center; background: #f9f9f9; }
                .florist-contact-info { font-size: 0.9rem; line-height: 1.6; }
                @media print { body { margin: 0; } }
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

// 花屋送信用一覧メール送信
function emailFloristOrder() {
    const funeralName = document.getElementById('floristFuneralName').textContent;
    
    if (confirm(`${funeralName}の花屋送信用一覧をメールで送信しますか？`)) {
        console.log(`${funeralName}の花屋送信用一覧をメール送信`);
        
        // 実際のアプリケーションではメール送信APIを使用
        alert(`${funeralName}の花屋送信用一覧をメール送信しました。\n送信先: florist@example.com\n実装時にはメール送信機能を組み込みます。`);
    }
}

// ご葬家データ管理
const funeralInfoData = {
    1: {
        name: '輝家',
        deceased: '輝 太郎',
        funeralDate: '2024/01/20',
        venue: 'セレモニーホール青山',
        staff: '山田太郎',
        confirmedDate: '2024/01/18'
    },
    2: {
        name: '田中家',
        deceased: '田中 一郎',
        funeralDate: '2024/01/22',
        venue: '田中家自宅',
        staff: '佐藤花子',
        confirmedDate: '2024/01/19'
    },
    3: {
        name: '佐藤家',
        deceased: '佐藤 次郎',
        funeralDate: '2024/01/25',
        venue: '佐藤記念会館',
        staff: '鈴木三郎',
        confirmedDate: '2024/01/22'
    }
};

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
            bankInfo: {
                bankName: 'みずほ銀行',
                branchName: '青山支店',
                accountType: '普通',
                accountNumber: '1234567',
                accountName: '株式会社花慶'
            },
            notes: [
                '下記の通りご請求申し上げます。',
                'お支払期限: ' + dueDate.toLocaleDateString('ja-JP'),
                '※お振込手数料はお客様負担でお願いいたします。',
                'ご不明な点がございましたらお気軽にお問い合わせください。'
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
            notes: [
                '上記金額を確かにお受け取りいたしました。',
                '受領日: ' + funeralInfo.funeralDate,
                '但し、生花代として',
                'ありがとうございました。'
            ]
        };
        
        console.log('領収書データ作成完了:', result);
        return result;
    } catch (error) {
        console.error('領収書データ取得エラー:', error);
        throw error;
    }
}

// 見積書データ取得
function getFuneralQuoteData(funeralId) {
    try {
        console.log('見積書データ取得開始:', funeralId);
        
        const orders = getFuneralOrders(funeralId, 'all');
        console.log('注文取得完了:', orders);
        
        const funeralInfo = funeralInfoData[funeralId];
        if (!funeralInfo) {
            throw new Error(`ご葬家情報が見つかりません: ${funeralId}`);
        }
        console.log('ご葬家情報:', funeralInfo);
        
        // 見積書の有効期限（葬儀日の前日まで）
        const funeralDate = new Date(funeralInfo.funeralDate);
        const validUntil = new Date(funeralDate);
        validUntil.setDate(validUntil.getDate() - 1);
        
        const totalAmount = orders.reduce((sum, order) => {
            const amount = parseInt(order.amount.replace(/[¥,]/g, '')) || 0;
            return sum + amount;
        }, 0);
        
        const totalFee = orders.reduce((sum, order) => {
            const fee = parseInt((order.fee || '¥0').replace(/[¥,]/g, '')) || 0;
            return sum + fee;
        }, 0);
        
        const result = {
            documentType: '見積書',
            documentNumber: `Q-${new Date().getFullYear()}-${String(funeralId).padStart(4, '0')}`,
            issueDate: new Date().toLocaleDateString('ja-JP'),
            validUntil: validUntil.toLocaleDateString('ja-JP'),
            funeralInfo: funeralInfo,
            orders: orders,
            totalAmount: totalAmount,
            totalFee: totalFee,
            notes: [
                '上記金額にて生花の手配をさせていただきます。',
                '本見積書は' + validUntil.toLocaleDateString('ja-JP') + 'まで有効です。',
                '価格は税込表示となっております。',
                'ご不明な点がございましたらお気軽にお問い合わせください。'
            ]
        };
        
        console.log('見積書データ作成完了:', result);
        return result;
    } catch (error) {
        console.error('見積書データ取得エラー:', error);
        throw error;
    }
}

// 納品書データ取得
function getFuneralDeliveryData(funeralId) {
    try {
        console.log('納品書データ取得開始:', funeralId);
        
        const orders = getFuneralOrders(funeralId, 'all');
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
            documentType: '納品書',
            documentNumber: `D-${new Date().getFullYear()}-${String(funeralId).padStart(4, '0')}`,
            issueDate: new Date().toLocaleDateString('ja-JP'),
            deliveryDate: funeralInfo.funeralDate,
            funeralInfo: funeralInfo,
            orders: orders,
            totalAmount: totalAmount,
            totalFee: totalFee,
            notes: [
                '下記の通り生花を納品いたしました。',
                '納品日: ' + funeralInfo.funeralDate,
                '設置場所: ' + funeralInfo.venue,
                'ご確認のほどよろしくお願いいたします。'
            ]
        };
        
        console.log('納品書データ作成完了:', result);
        return result;
    } catch (error) {
        console.error('納品書データ取得エラー:', error);
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
        modal.style.display = 'block';
        
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
    const isQuote = type === 'quote';
    const isDelivery = type === 'delivery';
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

// 書類HTML生成
function generateDocumentHTML(data, type) {
    const isQuote = type === 'quote';
    const isDelivery = type === 'delivery';
    const isInvoice = type === 'invoice';
    const isReceipt = type === 'receipt';
    
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
                        <label>${isQuote ? '見積日' : isReceipt ? '領収日' : '発行日'}:</label>
                        <span>${data.issueDate}</span>
                    </div>
                    ${isQuote ? `
                        <div class="date-row validity">
                            <label>有効期限:</label>
                            <span>${data.validUntil}</span>
                        </div>
                    ` : ''}
                    ${isDelivery ? `
                        <div class="date-row delivery">
                            <label>納品日:</label>
                            <span>${data.deliveryDate}</span>
                        </div>
                    ` : ''}
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
                <h3>${isQuote ? 'お見積り内容' : isDelivery ? '納品内容' : isInvoice ? 'ご請求内容' : isReceipt ? '領収内容' : '内容'}</h3>
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
            return;
        }
        
        // 選択された注文のみでデータを作成
        const selectedOrders = selectedIndices.map(index => originalData.orders[index]);
        
        // 金額を再計算（サマリー表示用）
        const totalAmount = selectedOrders.reduce((sum, order) => {
            const amount = parseInt(order.amount.replace(/[¥,]/g, '')) || 0;
            return sum + amount;
        }, 0);
        
        const totalFee = selectedOrders.reduce((sum, order) => {
            const fee = parseInt((order.fee || '¥0').replace(/[¥,]/g, '')) || 0;
            return sum + fee;
        }, 0);
        
        // 選択状態のサマリーを更新
        document.getElementById(`selected-count-${type}`).textContent = selectedOrders.length;
        document.getElementById(`selected-total-${type}`).textContent = `¥${totalAmount.toLocaleString()}`;
        document.getElementById(`selected-fee-${type}`).textContent = `¥${totalFee.toLocaleString()}`;
        
        // プレビューエリアを更新
        const previewContainer = document.getElementById(`document-preview-${type}`);
        if (previewContainer) {
            if (selectedOrders.length === 0) {
                previewContainer.innerHTML = `
                    <div class="no-selection-message">
                        <i class="fas fa-info-circle"></i>
                        <p>注文を選択してください</p>
                    </div>
                `;
            } else {
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
            }
        }
        
        console.log(`${type}プレビュー更新完了:`, selectedOrders.length, '件の個別帳票を生成');
        
    } catch (error) {
        console.error('プレビュー更新エラー:', error);
        alert('プレビューの更新中にエラーが発生しました。');
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
    alert(`${type === 'quote' ? '見積書' : '納品書'}のPDF出力機能は開発中です。\n現在は印刷機能をご利用ください。`);
}

// 書類メール送信
function emailDocument(type) {
    const documentType = type === 'quote' ? '見積書' : '納品書';
    alert(`${documentType}のメール送信機能は開発中です。\n現在は印刷機能をご利用ください。`);
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
        
        .date-row.validity {
            color: #d32f2f;
            font-weight: bold;
        }
        
        .date-row.delivery {
            color: #2e7d32;
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
        generateFuneralQuotes: generateFuneralQuotes,
        generateFuneralDeliveryNotes: generateFuneralDeliveryNotes,
        showAddressLabelModal: showAddressLabelModal,
        showDocumentModal: showDocumentModal,
        updateEnvelopePreview: updateEnvelopePreview,
        printAddressLabels: printAddressLabels,
        printDocument: printDocument,
        editFuneralInfo: editFuneralInfo,
        funeralInfoData: funeralInfoData,
        getFuneralOrders: getFuneralOrders,
        getFuneralQuoteData: getFuneralQuoteData,
        getFuneralDeliveryData: getFuneralDeliveryData,
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
        testQuote: () => generateFuneralQuotes(1),
        testDelivery: () => generateFuneralDeliveryNotes(1),
        testInvoice: () => generateFuneralInvoices(1),
        testReceipt: () => generateFuneralReceipts(1),
        testExcelSummary: () => generateFuneralSummary(1)
    };
    
    // コンソールでテストできるように関数をグローバルに追加
    window.testQuote = () => generateFuneralQuotes(1);
    window.testDelivery = () => generateFuneralDeliveryNotes(1);
    window.testInvoice = () => generateFuneralInvoices(1);
    window.testReceipt = () => generateFuneralReceipts(1);
    window.testExcelSummary = () => generateFuneralSummary(1);
}