// 注文一覧用JavaScript

// サンプルデータ
const allOrders = [
    {
        id: 1,
        funeralName: '山田家',
        deceasedName: '山田 花子',
        orderDate: '2024-01-15',
        nameplate: '山田太郎・花子',
        requester: '山田太郎',
        contact: '090-1234-5678',
        amount: 15000,
        fee: 2200,
        paymentMethod: '振込',
        flowerMode: 'builtin', // 'builtin' or 'addon'
        status: 'active',
        memo: '白い百合でお願いします'
    },
    {
        id: 2,
        funeralName: '山田家',
        deceasedName: '山田 花子',
        orderDate: '2024-01-16',
        nameplate: '株式会社ABC商事',
        requester: '鈴木一郎',
        contact: '090-2345-6789',
        amount: 20000,
        fee: 2200,
        paymentMethod: '現地',
        flowerMode: 'builtin',
        status: 'active',
        memo: ''
    },
    {
        id: 3,
        funeralName: '佐藤家',
        deceasedName: '佐藤 太郎',
        orderDate: '2024-01-20',
        nameplate: '佐藤家一同',
        requester: '佐藤次郎',
        contact: '080-3456-7890',
        amount: 25000,
        fee: 2200,
        paymentMethod: '振込',
        flowerMode: 'builtin',
        status: 'active',
        memo: ''
    },
    {
        id: 4,
        funeralName: '佐藤家',
        deceasedName: '佐藤 太郎',
        orderDate: '2024-01-21',
        nameplate: '田中商店',
        requester: '田中三郎',
        contact: '090-4567-8901',
        amount: 18000,
        fee: 2200,
        paymentMethod: '振込',
        flowerMode: 'builtin',
        status: 'cancelled',
        memo: 'キャンセル理由: 日程変更'
    },
    {
        id: 5,
        funeralName: '鈴木家',
        deceasedName: '鈴木 春子',
        orderDate: '2024-02-01',
        nameplate: '鈴木家親族一同',
        requester: '鈴木五郎',
        contact: '080-5678-9012',
        amount: 30000,
        fee: 2200,
        paymentMethod: '振込',
        flowerMode: 'builtin',
        status: 'active',
        memo: '特別アレンジメント希望'
    },
    {
        id: 6,
        funeralName: '鈴木家',
        deceasedName: '鈴木 春子',
        orderDate: '2024-02-02',
        nameplate: '友人一同',
        requester: '高橋六子',
        contact: '090-6789-0123',
        amount: 15000,
        fee: 2200,
        paymentMethod: '現地',
        flowerMode: 'builtin',
        status: 'active',
        memo: ''
    },
    {
        id: 7,
        funeralName: '田中家',
        deceasedName: '田中 夏男',
        orderDate: '2024-02-10',
        nameplate: '田中家',
        requester: '田中七子',
        contact: '080-7890-1234',
        amount: 22000,
        fee: 2200,
        paymentMethod: '振込',
        flowerMode: 'addon',
        status: 'active',
        memo: ''
    },
    {
        id: 8,
        funeralName: '田中家',
        deceasedName: '田中 夏男',
        orderDate: '2024-02-11',
        nameplate: '株式会社XYZ',
        requester: '伊藤八郎',
        contact: '090-8901-2345',
        amount: 50000,
        fee: 2200,
        paymentMethod: '振込',
        flowerMode: 'addon',
        status: 'active',
        memo: '特大サイズ希望'
    },
    {
        id: 9,
        funeralName: '',
        deceasedName: '',
        deceasedLastName: '高橋',
        deceasedFirstName: '春男',
        funeralDate: '2024-03-01',
        orderDate: '2024-02-15',
        nameplate: '株式会社テスト',
        applicant: '株式会社テスト', // 代表者（申込者）
        contactPerson: '佐々木太郎', // 担当者（企業の場合）
        requester: '佐々木太郎', // ご依頼者（表示用）
        contact: '090-1111-2222',
        amount: 18000,
        fee: 2200,
        paymentMethod: '振込',
        flowerMode: null,
        status: 'active',
        memo: '自動振り分けテスト用（企業申込）'
    },
    {
        id: 10,
        funeralName: null,
        deceasedName: null,
        deceasedLastName: '山田',
        deceasedFirstName: null,
        funeralDate: '2024-01-15',
        orderDate: '2024-02-16',
        nameplate: '友人代表',
        applicant: '山本花子', // 代表者（申込者）
        contactPerson: null, // 担当者（個人申込なのでなし）
        requester: '山本花子', // ご依頼者（表示用）
        contact: '080-3333-4444',
        amount: 12000,
        fee: 2200,
        paymentMethod: '現地',
        flowerMode: null,
        status: 'active',
        memo: '自動振り分けテスト用（個人申込、名前なし）'
    },
    {
        id: 11,
        funeralName: null,
        deceasedName: null,
        deceasedLastName: '伊藤',
        deceasedFirstName: '秋子',
        funeralDate: '2024-03-15',
        orderDate: '2024-02-20',
        nameplate: '伊藤家親族一同',
        applicant: '伊藤太郎', // 代表者（申込者）
        contactPerson: null, // 担当者（個人申込なのでなし）
        requester: '伊藤太郎', // ご依頼者（表示用）
        contact: '090-5555-6666',
        amount: 20000,
        fee: 2200,
        paymentMethod: '振込',
        flowerMode: null,
        status: 'active',
        memo: 'ご葬家未振り分け（新規追加1）'
    },
    {
        id: 12,
        funeralName: '',
        deceasedName: '',
        deceasedLastName: '中村',
        deceasedFirstName: '冬樹',
        funeralDate: '2024-03-20',
        orderDate: '2024-02-22',
        nameplate: '株式会社サンプル商事',
        applicant: '株式会社サンプル商事', // 代表者（申込者）
        contactPerson: '中島花子', // 担当者（企業の場合）
        requester: '中島花子', // ご依頼者（表示用）
        contact: '080-7777-8888',
        amount: 35000,
        fee: 2200,
        paymentMethod: '振込',
        flowerMode: null,
        status: 'active',
        memo: 'ご葬家未振り分け（新規追加2・企業申込）'
    }
];

// 利用可能なご葬家リスト
const availableFunerals = [
    { 
        id: 1, 
        name: '山田家', 
        deceased: '山田 花子',
        deceasedLastName: '山田',
        deceasedFirstName: '花子',
        funeralDate: '2024-01-15',
        flowerMode: 'builtin' 
    },
    { 
        id: 2, 
        name: '佐藤家', 
        deceased: '佐藤 太郎',
        deceasedLastName: '佐藤',
        deceasedFirstName: '太郎',
        funeralDate: '2024-01-20',
        flowerMode: 'builtin' 
    },
    { 
        id: 3, 
        name: '鈴木家', 
        deceased: '鈴木 春子',
        deceasedLastName: '鈴木',
        deceasedFirstName: '春子',
        funeralDate: '2024-02-01',
        flowerMode: 'builtin' 
    },
    { 
        id: 4, 
        name: '田中家', 
        deceased: '田中 夏男',
        deceasedLastName: '田中',
        deceasedFirstName: '夏男',
        funeralDate: '2024-02-10',
        flowerMode: 'addon' 
    },
    { 
        id: 5, 
        name: '高橋家', 
        deceased: '高橋 春男',
        deceasedLastName: '高橋',
        deceasedFirstName: '春男',
        funeralDate: '2024-03-01',
        flowerMode: 'addon' 
    }
];

// グローバル変数
let filteredOrders = [...allOrders];
let currentPage = 1;
const itemsPerPage = 10;
let sortColumn = 'no';
let sortDirection = 'asc';

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('注文一覧画面を初期化中...');
    console.log('サンプルデータ件数:', allOrders.length);
    
    // ご葬家振り分けチェック
    checkUnassignedOrders();
    
    updateSummary();
    applyFilters();
    console.log('初期化完了');
});

// 自動振り分けを実行
function autoAssignOrders() {
    let assigned = 0;
    let failed = [];
    
    allOrders.forEach(order => {
        // 既に振り分け済みの場合はスキップ
        if (order.funeralName && order.funeralName !== '' && order.funeralName !== '不明') {
            return;
        }
        
        // 故人の苗字と葬儀日が必要
        if (!order.deceasedLastName || !order.funeralDate) {
            failed.push({
                order: order,
                reason: '故人の苗字または葬儀日が未入力'
            });
            return;
        }
        
        // 1. 苗字と日付でマッチするご葬家を検索
        let matches = availableFunerals.filter(funeral => 
            funeral.deceasedLastName === order.deceasedLastName &&
            funeral.funeralDate === order.funeralDate
        );
        
        if (matches.length === 0) {
            // マッチなし
            failed.push({
                order: order,
                reason: `該当するご葬家が見つかりません（${order.deceasedLastName}様、${order.funeralDate}）`
            });
            return;
        }
        
        if (matches.length === 1) {
            // 1件のみマッチ - 自動振り分け成功
            const funeral = matches[0];
            order.funeralName = funeral.name;
            order.deceasedName = funeral.deceased;
            order.flowerMode = funeral.flowerMode;
            assigned++;
            return;
        }
        
        // 2. 複数マッチした場合は名前でも絞り込み
        if (order.deceasedFirstName && order.deceasedFirstName.trim() !== '') {
            matches = matches.filter(funeral => 
                funeral.deceasedFirstName === order.deceasedFirstName
            );
            
            if (matches.length === 1) {
                // 名前で絞り込んで1件のみマッチ - 自動振り分け成功
                const funeral = matches[0];
                order.funeralName = funeral.name;
                order.deceasedName = funeral.deceased;
                order.flowerMode = funeral.flowerMode;
                assigned++;
                return;
            }
        }
        
        // 3. それでも複数マッチする、または名前が未入力で複数マッチ
        failed.push({
            order: order,
            reason: `複数の候補があります（${order.deceasedLastName}${order.deceasedFirstName || ''}様、${order.funeralDate}）`,
            matches: matches
        });
    });
    
    console.log(`自動振り分け完了: ${assigned}件成功`);
    if (failed.length > 0) {
        console.warn(`自動振り分け失敗: ${failed.length}件`, failed);
    }
    
    return { assigned, failed };
}

// ご葬家が未設定の注文をチェック
function checkUnassignedOrders() {
    // まず自動振り分けを試みる
    const result = autoAssignOrders();
    
    if (result.assigned > 0) {
        console.log(`${result.assigned}件の注文を自動振り分けしました`);
    }
    
    // 振り分け失敗した注文がある場合
    if (result.failed.length > 0) {
        console.warn('振り分け失敗した注文:', result.failed);
        
        // 警告バナーを表示
        showUnassignedWarning(result.failed.length);
        
        // 失敗理由を含むアラートを表示
        setTimeout(() => {
            let message = `ご葬家が未設定の注文が ${result.failed.length} 件あります。\n\n`;
            
            // 最初の3件の理由を表示
            const displayCount = Math.min(3, result.failed.length);
            for (let i = 0; i < displayCount; i++) {
                const item = result.failed[i];
                message += `\n【注文${item.order.id}】${item.order.nameplate}\n理由: ${item.reason}\n`;
            }
            
            if (result.failed.length > 3) {
                message += `\n...他 ${result.failed.length - 3} 件\n`;
            }
            
            message += '\n今すぐ手動で振り分けを行いますか？';
            
            if (confirm(message)) {
                const failedOrders = result.failed.map(item => item.order);
                showBulkAssignmentModal(failedOrders);
            }
        }, 1000);
    }
}

// 未振り分け警告バナーを表示
function showUnassignedWarning(count) {
    const content = document.querySelector('.content');
    if (!content) return;
    
    const warningBanner = document.createElement('div');
    warningBanner.className = 'unassigned-warning';
    warningBanner.innerHTML = `
        <div class="warning-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span><strong>注意:</strong> ご葬家が未設定の注文が ${count} 件あります。</span>
        </div>
        <button class="btn btn-sm btn-primary" onclick="showAllUnassignedOrders()">
            <i class="fas fa-edit"></i> 振り分ける
        </button>
    `;
    
    // サマリーカードの前に挿入
    const summaryCards = content.querySelector('.summary-cards');
    if (summaryCards) {
        content.insertBefore(warningBanner, summaryCards);
    }
}

// 未振り分け注文の一括振り分けモーダル表示
function showAllUnassignedOrders() {
    const unassigned = allOrders.filter(order => 
        !order.funeralName || 
        order.funeralName === '' || 
        order.funeralName === null || 
        order.funeralName === '不明'
    );
    
    showBulkAssignmentModal(unassigned);
}

// 一括振り分けモーダル表示
function showBulkAssignmentModal(orders) {
    if (orders.length === 0) {
        alert('振り分けが必要な注文はありません。');
        return;
    }
    
    const modal = document.getElementById('assignmentModal');
    const modalBody = document.getElementById('assignmentModalBody');
    
    const content = `
        <div class="assignment-instructions">
            <p><i class="fas fa-info-circle"></i> 以下の注文にご葬家を設定してください</p>
        </div>
        <div class="assignment-list">
            ${orders.map(order => `
                <div class="assignment-item" data-order-id="${order.id}">
                    <div class="assignment-order-info">
                        <div class="order-badge">No.${order.id}</div>
                        <div class="order-details">
                            <div class="order-nameplate"><strong>${order.nameplate}</strong></div>
                            <div class="order-meta">
                                <span>依頼者: ${order.requester}</span>
                                <span>金額: ¥${order.amount.toLocaleString()}</span>
                                <span>受注日: ${order.orderDate}</span>
                            </div>
                        </div>
                    </div>
                    <div class="assignment-select">
                        <label>ご葬家を選択:</label>
                        <select class="funeral-select" data-order-id="${order.id}" onchange="updateFuneralModeDisplay(this)">
                            <option value="">-- 選択してください --</option>
                            ${availableFunerals.map(funeral => `
                                <option value="${funeral.id}" data-mode="${funeral.flowerMode}">
                                    ${funeral.name}（故人: ${funeral.deceased}様）【${funeral.flowerMode === 'builtin' ? '組込式' : 'つけ花式'}】
                                </option>
                            `).join('')}
                        </select>
                        <div class="selected-funeral-mode" id="mode-display-${order.id}" style="margin-top: 8px; display: none;">
                            <i class="fas fa-info-circle"></i>
                            <span>花代処理: </span>
                            <span class="mode-badge-small" id="mode-badge-${order.id}"></span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    modalBody.innerHTML = content;
    openModal('assignmentModal');
}

// 振り分けを保存
function saveAssignments() {
    const selects = document.querySelectorAll('.funeral-select');
    let updated = 0;
    let skipped = 0;
    let newFuneralNeeded = false;
    
    selects.forEach(select => {
        const orderId = parseInt(select.dataset.orderId);
        const funeralId = select.value;
        
        if (funeralId === 'new') {
            newFuneralNeeded = true;
            return;
        }
        
        if (funeralId && funeralId !== '') {
            const order = allOrders.find(o => o.id === orderId);
            if (order) {
                const funeral = availableFunerals.find(f => f.id === parseInt(funeralId));
                if (funeral) {
                    order.funeralName = funeral.name;
                    order.deceasedName = funeral.deceased;
                    order.flowerMode = funeral.flowerMode; // 花代処理方式も設定
                    updated++;
                }
            }
        } else {
            skipped++;
        }
    });
    
    if (newFuneralNeeded) {
        alert('新規ご葬家の登録機能は実装予定です。\n現在は既存のご葬家から選択してください。');
        return;
    }
    
    if (updated > 0) {
        // 警告バナーを削除
        const warningBanner = document.querySelector('.unassigned-warning');
        if (warningBanner) {
            warningBanner.remove();
        }
        
        // テーブルを再描画
        applyFilters();
        
        // モーダルを閉じる
        closeModal('assignmentModal');
        
        alert(`${updated}件の注文をご葬家に振り分けました。${skipped > 0 ? `\n${skipped}件はスキップされました。` : ''}`);
    } else {
        alert('振り分けが選択されていません。');
    }
}

// サマリー更新
function updateSummary() {
    const totalOrders = allOrders.length;
    const activeOrders = allOrders.filter(o => o.status === 'active').length;
    const cancelledOrders = allOrders.filter(o => o.status === 'cancelled').length;

    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('activeOrders').textContent = activeOrders;
    document.getElementById('cancelledOrders').textContent = cancelledOrders;
}

// フィルター適用
function applyFilters() {
    const statusFilter = document.getElementById('filterStatus').value;
    const paymentFilter = document.getElementById('filterPayment').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();

    filteredOrders = allOrders.filter(order => {
        // ステータスフィルター
        if (statusFilter !== 'all' && order.status !== statusFilter) {
            return false;
        }

        // 支払方法フィルター
        if (paymentFilter !== 'all' && order.paymentMethod !== paymentFilter) {
            return false;
        }

        // 検索フィルター
        if (searchText) {
            const searchFields = [
                order.funeralName,
                order.deceasedName,
                order.requester,
                order.nameplate
            ].join(' ').toLowerCase();
            
            if (!searchFields.includes(searchText)) {
                return false;
            }
        }

        return true;
    });

    currentPage = 1;
    renderTable();
}

// テーブル描画
function renderTable() {
    console.log('テーブル描画開始:', filteredOrders.length, '件');
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) {
        console.error('ordersTableBodyが見つかりません');
        return;
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageOrders = filteredOrders.slice(start, end);
    console.log('ページ表示:', pageOrders.length, '件');

    tbody.innerHTML = '';

    if (pageOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="14" style="text-align: center; padding: 40px;">該当する注文が見つかりません</td></tr>';
        updatePagination();
        return;
    }

    pageOrders.forEach(order => {
        const row = document.createElement('tr');
        row.className = order.status === 'cancelled' ? 'cancelled-row' : '';
        
        // 未振り分けの注文を強調表示
        const isUnassigned = !order.funeralName || order.funeralName === '' || order.funeralName === null || order.funeralName === '不明';
        if (isUnassigned) {
            row.classList.add('unassigned-row');
        }

        // 税金計算（10%内税）
        const calculateTax = (amount) => Math.floor(amount * 10 / 110);
        const amountTax = calculateTax(order.amount);
        const feeTax = calculateTax(order.fee);
        const total = order.amount + order.fee;
        const totalTax = calculateTax(total);
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>
                ${isUnassigned ? '<span class="unassigned-label"><i class="fas fa-exclamation-triangle"></i> 未設定</span>' : order.funeralName}
            </td>
            <td>${order.deceasedName || '-'}</td>
            <td>${order.orderDate}</td>
            <td>${order.nameplate}</td>
            <td>${order.requester}</td>
            <td>${order.contact}</td>
            <td>
                ¥${order.amount.toLocaleString()}<br>
                <span style="font-size: 0.85em; color: #666;">(内税¥${amountTax.toLocaleString()})</span>
            </td>
            <td>
                ¥${order.fee.toLocaleString()}<br>
                <span style="font-size: 0.85em; color: #666;">(内税¥${feeTax.toLocaleString()})</span>
            </td>
            <td>
                <strong>¥${total.toLocaleString()}</strong><br>
                <span style="font-size: 0.85em; color: #666;">(内税¥${totalTax.toLocaleString()})</span>
            </td>
            <td><span class="payment-badge ${order.paymentMethod === '振込' ? 'transfer' : 'onsite'}">${order.paymentMethod}</span></td>
            <td>
                ${order.flowerMode 
                    ? `<span class="mode-badge-small ${order.flowerMode}">${order.flowerMode === 'builtin' ? '組込式' : 'つけ花'}</span>`
                    : '<span class="unassigned-label">-</span>'
                }
            </td>
            <td><span class="status-badge ${order.status}">${order.status === 'active' ? '有効' : 'キャンセル'}</span></td>
            <td class="action-buttons">
                ${isUnassigned ? `
                    <button class="btn btn-small btn-primary" onclick="assignSingleOrder(${order.id})">
                        <i class="fas fa-edit"></i> 振り分け
                    </button>
                ` : `
                    <button class="btn btn-small btn-outline" onclick="showOrderDetail(${order.id})">
                        <i class="fas fa-eye"></i> 詳細
                    </button>
                `}
            </td>
        `;

        tbody.appendChild(row);
    });

    updatePagination();
}

// ページネーション更新
function updatePagination() {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

// ページ変更
function changePage(delta) {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const newPage = currentPage + delta;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// テーブルソート
function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    const columnMap = {
        'no': 'id',
        'funeral': 'funeralName',
        'deceased': 'deceasedName',
        'date': 'orderDate',
        'nameplate': 'nameplate',
        'requester': 'requester',
        'contact': 'contact',
        'amount': 'amount',
        'fee': 'fee',
        'total': 'total',
        'payment': 'paymentMethod',
        'flowerMode': 'flowerMode',
        'status': 'status'
    };

    const sortKey = columnMap[column];

    filteredOrders.sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        
        // 合計列の場合は動的に計算
        if (sortKey === 'total') {
            aVal = a.amount + a.fee;
            bVal = b.amount + b.fee;
        }

        if (typeof aVal === 'number') {
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();

        if (sortDirection === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });

    renderTable();
}

// 注文詳細表示
function showOrderDetail(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    const isUnassigned = !order.funeralName || order.funeralName === '' || order.funeralName === null || order.funeralName === '不明';

    const content = `
        <div class="detail-section">
            <h3>基本情報</h3>
            <div class="detail-row">
                <label>注文No:</label>
                <span>${order.id}</span>
            </div>
            <div class="detail-row funeral-assignment-row">
                <label>ご葬家名:</label>
                <div class="funeral-assignment-field">
                    ${isUnassigned 
                        ? '<span class="unassigned-label"><i class="fas fa-exclamation-triangle"></i> 未設定</span>'
                        : `<span>${order.funeralName}</span>`
                    }
                    <button class="btn btn-xs btn-outline" onclick="changeFuneralFromDetail(${order.id})">
                        <i class="fas fa-exchange-alt"></i> 変更
                    </button>
                </div>
            </div>
            <div class="detail-row">
                <label>故人名:</label>
                <span>${order.deceasedName || '-'}</span>
            </div>
            <div class="detail-row">
                <label>受注日:</label>
                <span>${order.orderDate}</span>
            </div>
            <div class="detail-row">
                <label>ステータス:</label>
                <span class="status-badge ${order.status}">${order.status === 'active' ? '有効' : 'キャンセル'}</span>
            </div>
        </div>

        <div class="detail-section">
            <h3>注文内容</h3>
            <div class="detail-row">
                <label>芳名板記載:</label>
                <span>${order.nameplate}</span>
            </div>
            <div class="detail-row">
                <label>依頼者:</label>
                <span>${order.requester}</span>
            </div>
            <div class="detail-row">
                <label>連絡先:</label>
                <span>${order.contact}</span>
            </div>
            <div class="detail-row">
                <label>花代処理方式:</label>
                <span>
                    ${order.flowerMode 
                        ? `<span class="mode-badge-small ${order.flowerMode}">${order.flowerMode === 'builtin' ? '組込式' : 'つけ花式'}</span>`
                        : '<span class="unassigned-label">未設定</span>'
                    }
                </span>
            </div>
        </div>

        <div class="detail-section">
            <h3>金額情報</h3>
            <div class="detail-row">
                <label>金額（税込）:</label>
                <span>¥${order.amount.toLocaleString()}<br><small style="color: #666;">(内税¥${Math.floor(order.amount * 10 / 110).toLocaleString()})</small></span>
            </div>
            <div class="detail-row">
                <label>手数料（税込）:</label>
                <span>¥${order.fee.toLocaleString()}<br><small style="color: #666;">(内税¥${Math.floor(order.fee * 10 / 110).toLocaleString()})</small></span>
            </div>
            <div class="detail-row">
                <label>合計（税込）:</label>
                <span><strong>¥${(order.amount + order.fee).toLocaleString()}</strong><br><small style="color: #666;">(内税¥${Math.floor((order.amount + order.fee) * 10 / 110).toLocaleString()})</small></span>
            </div>
            <div class="detail-row">
                <label>支払方法:</label>
                <span class="payment-badge ${order.paymentMethod === '振込' ? 'transfer' : 'onsite'}">${order.paymentMethod}</span>
            </div>
        </div>

        ${order.memo ? `
        <div class="detail-section">
            <h3>備考</h3>
            <div class="detail-row">
                <span>${order.memo}</span>
            </div>
        </div>
        ` : ''}
    `;

    document.getElementById('orderDetailContent').innerHTML = content;
    openModal('orderDetailModal');
}

// モーダル開く
function openModal(modalId) {
    const modal = document.getElementById(modalId);
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

// モーダル閉じる
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('show');
    // インラインスタイルをすべてクリア
    modal.style.cssText = '';
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 更新
function refreshOrderList() {
    applyFilters();
    // アニメーション効果
    const btn = event.target.closest('button');
    btn.querySelector('i').classList.add('fa-spin');
    setTimeout(() => {
        btn.querySelector('i').classList.remove('fa-spin');
    }, 1000);
}

// Excel出力（簡易版）
function exportToExcel() {
    alert('Excel出力機能は実装予定です。\n現在のフィルター結果をエクスポートします。');
    // 実際の実装では、SheetJSなどのライブラリを使用してExcelファイルを生成
}

// 単一注文の振り分け
function assignSingleOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    showBulkAssignmentModal([order]);
}

// 詳細画面からご葬家を変更
function changeFuneralFromDetail(orderId) {
    // 詳細モーダルを閉じる
    closeModal('orderDetailModal');
    
    // 少し待ってから振り分けモーダルを開く
    setTimeout(() => {
        const order = allOrders.find(o => o.id === orderId);
        if (order) {
            showBulkAssignmentModal([order]);
        }
    }, 300);
}

// ご葬家選択時に花代処理方式を表示
function updateFuneralModeDisplay(selectElement) {
    const orderId = selectElement.dataset.orderId;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const mode = selectedOption.dataset.mode;
    
    const modeDisplay = document.getElementById(`mode-display-${orderId}`);
    const modeBadge = document.getElementById(`mode-badge-${orderId}`);
    
    if (mode && modeDisplay && modeBadge) {
        modeDisplay.style.display = 'flex';
        modeBadge.textContent = mode === 'builtin' ? '①組込式' : '②つけ花式';
        modeBadge.className = `mode-badge-small ${mode}`;
    } else if (modeDisplay) {
        modeDisplay.style.display = 'none';
    }
}

// ========================================
// 権限制御機能（注文一覧ページ用）
// ========================================

// ページ読み込み後に権限制御を適用
document.addEventListener('DOMContentLoaded', function() {
    // 少し遅延させて、データが読み込まれた後に適用
    setTimeout(() => {
        applyRoleBasedRestrictionsForList();
    }, 100);
});

// 権限に応じた表示制御を適用（注文一覧ページ）
function applyRoleBasedRestrictionsForList() {
    const role = getCurrentUserRole();
    
    console.log('注文一覧: 現在のユーザー権限:', role);
    
    if (role === 'staff') {
        applyStaffRestrictionsForList();
    }
}

// 担当者用の制限を適用（注文一覧ページ）
function applyStaffRestrictionsForList() {
    console.log('担当者モード: 自分が担当の注文のみ表示（読取専用）');
    
    // 注文一覧ページでは、自分が担当の注文のみ表示
    filterOrdersForStaff();
    
    // すべての編集機能を無効化
    disableAllEditFunctionsForList();
}

// 担当者用の注文フィルタリング
function filterOrdersForStaff() {
    const currentUser = getCurrentUser();
    
    // テーブルの各行をチェック
    const tableRows = document.querySelectorAll('#ordersTableBody tr');
    let visibleCount = 0;
    
    tableRows.forEach(row => {
        // 担当者情報を取得
        const staffCell = row.querySelector('td:nth-child(6)'); // 依頼者列（仮）
        const staffName = staffCell ? staffCell.textContent.trim() : '';
        
        // 現在のユーザーが担当かチェック
        const isAssigned = staffName.includes(currentUser.name);
        
        if (isAssigned) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    console.log(`担当者として表示する注文: ${visibleCount}件`);
    updateFilteredSummary();
}

// すべての編集機能を無効化（注文一覧ページ）
function disableAllEditFunctionsForList() {
    // すべての入力欄とボタンを無効化
    const inputs = document.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        // アカウント関連のボタンは常に有効
        if (input.closest('.account-info') || 
            input.closest('.account-dropdown') || 
            input.closest('.account-switcher-modal') ||
            input.classList.contains('account-button') ||
            input.classList.contains('account-switcher-close')) {
            return; // アカウント関連は無効化しない
        }
        
        // 検索、フィルター、更新ボタンは有効のまま
        const allowedIds = ['searchInput', 'filterStatus', 'filterPayment'];
        const allowedActions = ['refresh', 'close', 'Modal', 'Filter', 'search', 'sort'];
        const onclick = input.getAttribute('onclick') || '';
        const id = input.id || '';
        
        const isAllowed = allowedIds.includes(id) || 
                         allowedActions.some(action => onclick.includes(action));
        
        if (!isAllowed && input.tagName === 'BUTTON') {
            input.disabled = true;
            input.style.opacity = '0.5';
            input.style.cursor = 'not-allowed';
        }
    });
}

// フィルタ後のサマリーを更新
function updateFilteredSummary() {
    const visibleRows = document.querySelectorAll('#ordersTableBody tr:not([style*="display: none"])');
    
    // サマリーの更新（実装されている場合）
    const totalOrdersElement = document.getElementById('totalOrders');
    if (totalOrdersElement) {
        totalOrdersElement.textContent = visibleRows.length;
    }
}

