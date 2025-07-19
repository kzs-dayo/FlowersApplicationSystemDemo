// サンプルデータ（実際の実装では API から取得）
const sampleApplications = [
    {
        id: 'A001',
        appliedAt: '2024/01/15 14:30',
        familyName: '輝家',
        deceasedName: '輝 太郎',
        funeralDate: '2024/01/20',
        applicantName: '輝 花子',
        phone: '090-1234-5678',
        postalCode: '150-0001',
        prefecture: '東京都',
        city: '渋谷区',
        address1: '1-2-3',
        address2: 'サンプルマンション101',
        amount: '16500',
        nameplate: '輝家一同',
        email: 'hanako@example.com',
        paymentMethod: '振り込み',
        remarks: '',
        excelStatus: 'success'
    },
    {
        id: 'A002',
        appliedAt: '2024/01/15 16:45',
        familyName: '山田家',
        deceasedName: '山田 一郎',
        funeralDate: '2024/01/22',
        applicantName: '山田 美香',
        phone: '080-9876-5432',
        postalCode: '160-0022',
        prefecture: '東京都',
        city: '新宿区',
        address1: '2-3-4',
        address2: '',
        amount: '20000',
        nameplate: '山田美香\n山田太郎',
        email: 'mika@example.com',
        paymentMethod: '現地払い',
        remarks: '朝一番でお願いします',
        excelStatus: 'pending'
    },
    {
        id: 'A003',
        appliedAt: '2024/01/16 09:15',
        familyName: '佐藤家',
        deceasedName: '佐藤 次郎',
        funeralDate: '2024/01/25',
        applicantName: '佐藤 明子',
        phone: '070-1111-2222',
        postalCode: '170-0013',
        prefecture: '東京都',
        city: '豊島区',
        address1: '3-4-5',
        address2: 'グリーンハイツ202',
        amount: '16500',
        nameplate: '佐藤明子',
        email: '',
        paymentMethod: '振り込み',
        remarks: '',
        excelStatus: 'failed'
    },
    {
        id: 'A004',
        appliedAt: '2024/01/16 11:30',
        familyName: '田中家',
        deceasedName: '田中 三郎',
        funeralDate: '2024/01/28',
        applicantName: '田中 由美',
        phone: '090-3333-4444',
        postalCode: '180-0004',
        prefecture: '東京都',
        city: '武蔵野市',
        address1: '4-5-6',
        address2: '',
        amount: '16500',
        nameplate: '田中家親族一同',
        email: 'yumi@example.com',
        paymentMethod: '現地払い',
        remarks: '',
        excelStatus: 'success'
    },
    {
        id: 'A005',
        appliedAt: '2024/01/16 13:45',
        familyName: '鈴木家',
        deceasedName: '鈴木 四郎',
        funeralDate: '2024/01/30',
        applicantName: '鈴木 恵子',
        phone: '080-5555-6666',
        postalCode: '190-0012',
        prefecture: '東京都',
        city: '立川市',
        address1: '5-6-7',
        address2: 'パークハイム303',
        amount: '25000',
        nameplate: '鈴木恵子\n鈴木健一\n鈴木美咲',
        email: 'keiko@example.com',
        paymentMethod: '振り込み',
        remarks: 'ご連絡はメールでお願いします',
        excelStatus: 'pending'
    }
];

// 現在表示中のデータ
let currentApplications = [...sampleApplications];
let currentModal = null;

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
});

// テーブルの描画
function renderTable() {
    const tbody = document.getElementById('applicationsBody');
    tbody.innerHTML = '';

    currentApplications.forEach(app => {
        const row = createTableRow(app);
        tbody.appendChild(row);
    });

    updatePagination();
}

// テーブル行の作成
function createTableRow(app) {
    const row = document.createElement('tr');
    
    const statusInfo = getStatusInfo(app.excelStatus);
    const amount = app.amount === 'other' ? '¥' + (app.customAmount || '0') : '¥' + parseInt(app.amount).toLocaleString();
    
    row.innerHTML = `
        <td>${app.id}</td>
        <td>${app.appliedAt}</td>
        <td>${app.familyName}</td>
        <td>${app.deceasedName}</td>
        <td>${app.funeralDate}</td>
        <td>${app.applicantName}</td>
        <td>${app.phone}</td>
        <td>${amount}</td>
        <td>${app.paymentMethod}</td>
        <td>
            <span class="status-badge ${statusInfo.class}">
                <span class="status-icon">${statusInfo.icon}</span>
                ${statusInfo.text}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-detail" onclick="viewDetail('${app.id}')">詳細</button>
                ${createExcelButton(app)}
            </div>
        </td>
    `;
    
    return row;
}

// ステータス情報の取得
function getStatusInfo(status) {
    switch(status) {
        case 'success':
            return { class: 'status-success', icon: '✓', text: '出力完了' };
        case 'pending':
            return { class: 'status-pending', icon: '⏳', text: '処理中' };
        case 'failed':
            return { class: 'status-failed', icon: '✗', text: '出力失敗' };
        default:
            return { class: 'status-pending', icon: '⏳', text: '処理中' };
    }
}

// EXCEL出力ボタンの作成
function createExcelButton(app) {
    switch(app.excelStatus) {
        case 'success':
            return `<button class="btn btn-excel" onclick="downloadExcel('${app.id}')">再出力</button>`;
        case 'pending':
            return `<button class="btn btn-excel" onclick="downloadExcel('${app.id}')" disabled>出力中</button>`;
        case 'failed':
            return `<button class="btn btn-excel btn-retry" onclick="retryExcel('${app.id}')">再試行</button>`;
        default:
            return `<button class="btn btn-excel" onclick="downloadExcel('${app.id}')">出力</button>`;
    }
}

// フィルタリング機能
function filterApplications() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    currentApplications = sampleApplications.filter(app => {
        // ステータスフィルター
        if (statusFilter && app.excelStatus !== statusFilter) {
            return false;
        }
        
        // 日付フィルター
        if (dateFilter) {
            const appDate = app.appliedAt.split(' ')[0];
            const filterDate = dateFilter.replace(/-/g, '/');
            if (appDate !== filterDate) {
                return false;
            }
        }
        
        return true;
    });
    
    renderTable();
}

// 検索機能
function searchApplications() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        currentApplications = [...sampleApplications];
    } else {
        currentApplications = sampleApplications.filter(app => 
            app.familyName.toLowerCase().includes(searchTerm) ||
            app.deceasedName.toLowerCase().includes(searchTerm) ||
            app.applicantName.toLowerCase().includes(searchTerm)
        );
    }
    
    renderTable();
}

// 詳細表示
function viewDetail(id) {
    const app = sampleApplications.find(a => a.id === id);
    if (!app) return;
    
    currentModal = id;
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = createDetailContent(app);
    modal.style.display = 'block';
}

// 詳細内容の作成
function createDetailContent(app) {
    const amount = app.amount === 'other' ? '¥' + (app.customAmount || '0') : '¥' + parseInt(app.amount).toLocaleString();
    const fullAddress = `${app.postalCode} ${app.prefecture}${app.city}${app.address1}${app.address2 ? ' ' + app.address2 : ''}`;
    
    return `
        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-label">申込ID</div>
                <div class="detail-value">${app.id}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">申込日時</div>
                <div class="detail-value">${app.appliedAt}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">ご葬家名</div>
                <div class="detail-value">${app.familyName}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">故人名</div>
                <div class="detail-value">${app.deceasedName}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">ご葬儀日程</div>
                <div class="detail-value">${app.funeralDate}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">ご依頼者名</div>
                <div class="detail-value">${app.applicantName}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">連絡先</div>
                <div class="detail-value">${app.phone}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">住所</div>
                <div class="detail-value">${fullAddress}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">金額</div>
                <div class="detail-value">${amount}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">支払い方法</div>
                <div class="detail-value">${app.paymentMethod}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">芳名板のお名前</div>
                <div class="detail-value">${app.nameplate.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">メールアドレス</div>
                <div class="detail-value">${app.email || '未設定'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">備考</div>
                <div class="detail-value">${app.remarks || 'なし'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">EXCEL出力ステータス</div>
                <div class="detail-value">
                    <span class="status-badge ${getStatusInfo(app.excelStatus).class}">
                        <span class="status-icon">${getStatusInfo(app.excelStatus).icon}</span>
                        ${getStatusInfo(app.excelStatus).text}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// モーダルを閉じる
function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
    currentModal = null;
}

// モーダル外クリックで閉じる
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        closeModal();
    }
}

// EXCEL出力
function downloadExcel(id) {
    const app = sampleApplications.find(a => a.id === id);
    if (!app) return;
    
    // 実際の実装では API を呼び出し
    console.log(`EXCEL出力開始: ${id}`);
    
    // ステータスを処理中に変更
    updateExcelStatus(id, 'pending');
    
    // 模擬的な処理時間
    setTimeout(() => {
        // ランダムで成功/失敗を決定（実際はサーバーの処理結果）
        const success = Math.random() > 0.2; // 80%の確率で成功
        const newStatus = success ? 'success' : 'failed';
        updateExcelStatus(id, newStatus);
        
        if (success) {
            // 実際の実装では EXCEL ファイルをダウンロード
            alert(`申込ID: ${id} のEXCELファイルが出力されました。`);
        } else {
            alert(`申込ID: ${id} のEXCEL出力に失敗しました。`);
        }
    }, 2000);
}

// EXCEL出力再試行
function retryExcel(id) {
    downloadExcel(id);
}

// モーダルからのEXCEL出力
function downloadExcelFromModal() {
    if (currentModal) {
        downloadExcel(currentModal);
    }
}

// EXCEL出力ステータスの更新
function updateExcelStatus(id, status) {
    const app = sampleApplications.find(a => a.id === id);
    if (app) {
        app.excelStatus = status;
        renderTable();
        
        // モーダルが開いている場合は更新
        if (currentModal === id) {
            viewDetail(id);
        }
    }
}

// ページネーション（現在は模擬実装）
function updatePagination() {
    const totalItems = currentApplications.length;
    const pageInfo = document.querySelector('.page-info');
    pageInfo.textContent = `ページ 1 / 1 (${totalItems}件中 1-${totalItems}件を表示)`;
}

function changePage(direction) {
    // 実際の実装では API からページごとのデータを取得
    console.log('ページ変更:', direction);
}

// リスト更新
function refreshList() {
    // 実際の実装では API から最新データを取得
    console.log('リスト更新');
    
    // フィルターをリセット
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('searchInput').value = '';
    
    currentApplications = [...sampleApplications];
    renderTable();
    
    alert('リストを更新しました。');
}

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}); 