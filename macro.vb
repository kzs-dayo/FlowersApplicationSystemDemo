Sub 入力準備()
    '一時保管シートからファイルNo.，件数No.を取得
    Dim no As Integer, fno As Integer, tot As Integer, sumchrg As Long
    
    
    Sheets("②一覧表").Select
        ActiveSheet.Unprotect
        no = ActiveSheet.Cells(5, 64)
        If no = 0 Then
            stuff = InputBox("担当者名を入力してください｡")
            exday = InputBox("葬儀確定日" & Chr(13) & "YYMMDD")
            ActiveSheet.Cells(5, 74) = stuff
            ActiveSheet.Cells(5, 75) = exday

            no = 1
            ActiveSheet.Cells(5, 64) = no
            tot = 0
            ActiveSheet.Cells(5, 65) = tot
            ActiveSheet.Cells(3, 37) = tot
            sumchrg = 0
            ActiveSheet.Cells(5, 66) = sumchrg
            ActiveSheet.Cells(3, 43) = sumchrg
            adjtot = 0
            ActiveSheet.Cells(6, 65) = adjtot
            ActiveSheet.Cells(3, 49) = adjtot
            flwtot = 0
            ActiveSheet.Cells(7, 65) = flwtot
            ActiveSheet.Cells(2, 49) = flwtot
            '領収書用保存変数
            rcrw = 5
            ActiveSheet.Cells(5, 76) = rcrw
            rcc = 1
            ActiveSheet.Cells(5, 77) = rcc
            'ラベル印刷用変数
            lblrw = 2
            ActiveSheet.Cells(5, 78) = lblrw
            
        End If
        ActiveSheet.Protect
        
    Sheets("①注文書 (入力用)").Select
        ActiveSheet.Cells(7, 15) = "" '受注日
        ActiveSheet.Cells(9, 15) = 16500 '金額
        ActiveSheet.Cells(9, 25) = "" '付け花
        ActiveSheet.Cells(9, 29) = 2200 '手数料
        ActiveSheet.Cells(10, 9) = "" '芳名板
        ActiveSheet.Cells(12, 9) = "" '依頼者
        ActiveSheet.Cells(13, 11) = "" '〒1
        ActiveSheet.Cells(13, 15) = "" '〒2
        ActiveSheet.Cells(13, 24) = "" 'ご住所
        ActiveSheet.Cells(14, 13) = "" 'tel1
        ActiveSheet.Cells(14, 17) = "" 'tel2
        ActiveSheet.Cells(14, 21) = "" 'tel3
        ActiveSheet.Cells(16, 30) = "" '請求先
        ActiveSheet.Cells(17, 30) = "" '領収証の宛名
        ActiveSheet.Cells(18, 19) = "" '会社名・団体名
        ActiveSheet.Cells(19, 14) = "" '担当者名
        ActiveSheet.Cells(20, 11) = "" '送付先〒1
        ActiveSheet.Cells(20, 15) = "" '送付先〒2
        ActiveSheet.Cells(20, 24) = "" '送付先住所
        ActiveSheet.Cells(21, 13) = "" '送付先tel1
        ActiveSheet.Cells(21, 17) = "" '送付先tel2
        ActiveSheet.Cells(21, 21) = "" '送付先tel3
        ActiveSheet.Cells(22, 9) = "" '備考
        
        If no = 0 Then ActiveSheet.Cells(2, 7).Select Else ActiveSheet.Cells(7, 15).Select
        
        
    
        
End Sub
Sub 入力準備2()
    '一時保管シートからファイルNo.，件数No.を取得
    Dim no As Integer, fno As Integer, tot As Integer, sumchrg As Long
    
    
    Sheets("②一覧表").Select
        ActiveSheet.Unprotect
        no = ActiveSheet.Cells(5, 64)
        
        ActiveSheet.Protect
        
    Sheets("修正").Select
        ActiveSheet.Cells(2, 7) = ""
        ActiveSheet.Cells(2, 14) = ""
    
        ActiveSheet.Cells(7, 15) = "" '受注日
        ActiveSheet.Cells(9, 15) = 16500 '金額
        ActiveSheet.Cells(9, 25) = "" '付け花
        ActiveSheet.Cells(9, 29) = 2200 '手数料
        ActiveSheet.Cells(10, 9) = "" '芳名板
        ActiveSheet.Cells(12, 9) = "" '依頼者
        ActiveSheet.Cells(13, 11) = "" '〒1
        ActiveSheet.Cells(13, 15) = "" '〒2
        ActiveSheet.Cells(13, 24) = "" 'ご住所
        ActiveSheet.Cells(14, 13) = "" 'tel1
        ActiveSheet.Cells(14, 17) = "" 'tel2
        ActiveSheet.Cells(14, 21) = "" 'tel3
        ActiveSheet.Cells(16, 30) = "" '請求先
        ActiveSheet.Cells(17, 30) = "" '領収証の宛名
        ActiveSheet.Cells(18, 19) = "" '会社名・団体名
        ActiveSheet.Cells(19, 14) = "" '担当者名
        ActiveSheet.Cells(20, 11) = "" '送付先〒1
        ActiveSheet.Cells(20, 15) = "" '送付先〒2
        ActiveSheet.Cells(20, 24) = "" '送付先住所
        ActiveSheet.Cells(21, 13) = "" '送付先tel1
        ActiveSheet.Cells(21, 17) = "" '送付先tel2
        ActiveSheet.Cells(21, 21) = "" '送付先tel3
        ActiveSheet.Cells(22, 9) = "" '備考
        
        ActiveSheet.Cells(7, 15).Select
        
        
    
        
End Sub
Sub 入力()
    'データを入力し，一覧シートに追加する
    Dim no As Integer, tot As Long, charge As Long, sumchrg As Long, rw As Integer, pay As String, chk As String
    Dim reqday As String, Prce As Long, namplat As String, clntnam As String, clntpst1 As String, clntpst2 As String
    Dim clntad As String, clnttel1 As String, clnttel2 As String, clnttel3 As String, FlwrArg As String
    Dim chrgnam As String, recnam As String, chrgco As String, chrgmem As String, chrgpst1 As String, chrgpst2 As String
    Dim chrgad As String, chrgtel1 As String, chrgtel2 As String, chrgtel3 As String, memo As String
    
        
    
        
    Sheets("①注文書 (入力用)").Select
        '初回の時
    
        exdaynam1 = ActiveSheet.Cells(3, 2)
        exday1 = ActiveSheet.Cells(3, 7)
        exdaynam2 = ActiveSheet.Cells(4, 2)
        exday2 = ActiveSheet.Cells(4, 7)
        
        mainnam1 = ActiveSheet.Cells(2, 7)
        mainnam2 = ActiveSheet.Cells(2, 14)
        mcnam1 = ActiveSheet.Cells(2, 28)
        mcnam2 = ActiveSheet.Cells(2, 35)
        predate = ActiveSheet.Cells(3, 7)
        exdate = ActiveSheet.Cells(4, 7)
        explace = ActiveSheet.Cells(5, 7)
    
    
        '2回目以降
        reqday = ActiveSheet.Cells(7, 15)
        Prce = ActiveSheet.Cells(9, 15) '金額
        FlwrArg = ActiveSheet.Cells(9, 25) '付け花
        charge = ActiveSheet.Cells(9, 29) '手数料
        namplat = ActiveSheet.Cells(10, 9) '芳名板
        clntnam = ActiveSheet.Cells(12, 9) '依頼者
        clntpst1 = ActiveSheet.Cells(13, 11) '〒1
        clntpst2 = ActiveSheet.Cells(13, 15) '〒2
        clntad = ActiveSheet.Cells(13, 24) 'ご住所
        clnttel1 = ActiveSheet.Cells(14, 13) 'tel1
        clnttel2 = ActiveSheet.Cells(14, 17) 'tel2
        clnttel3 = ActiveSheet.Cells(14, 21) 'tel3
        
        If ActiveSheet.Cells(16, 30) <> "" Then
            pay = "振込"
            chk = "要"
            chrgnam = ActiveSheet.Cells(16, 30) '請求先
            chrgco = ActiveSheet.Cells(18, 19) '会社名・団体名
            chrgmem = ActiveSheet.Cells(19, 14) '担当者名
            chrgpst1 = ActiveSheet.Cells(20, 11) '送付先〒1
            chrgpst2 = ActiveSheet.Cells(20, 15) '送付先〒2
            If chrgpst1 <> "" Then chrgpst = chrgpst1 & "-" & chrgpst2
            chrgad = ActiveSheet.Cells(20, 24) '送付先住所
            chrgtel1 = ActiveSheet.Cells(21, 13) '送付先tel1
            chrgtel2 = ActiveSheet.Cells(21, 17) '送付先tel2
            chrgtel3 = ActiveSheet.Cells(21, 21) '送付先tel3
            If chrgtel1 <> "" Then chrgtel = chrgtel1 & "-" & chrgtel2 & "-" & chrgtel3
            
        ElseIf ActiveSheet.Cells(17, 30) <> "" Then
            pay = "現地"
            recnam = ActiveSheet.Cells(17, 30) '領収証の宛名
        Else
            pay = "振込"
            chk = "不要"

        End If
        
        memo = ActiveSheet.Cells(22, 9) '備考
        
    
    Sheets("②一覧表").Select
        ActiveSheet.Unprotect
        
        no = ActiveSheet.Cells(5, 64)
        tot = ActiveSheet.Cells(5, 65)
        sumchrg = ActiveSheet.Cells(5, 66)
        adjtot = ActiveSheet.Cells(6, 65)
        flwtot = ActiveSheet.Cells(7, 65)
        rw = no + 4
        
        ActiveSheet.Cells(3, 5) = exdate
        ActiveSheet.Cells(3, 13) = explace
        ActiveSheet.Cells(3, 23) = mainnam1
        ActiveSheet.Cells(3, 27) = mainnam2
        ActiveSheet.Cells(3, 55) = predate
    
        
        ActiveSheet.Cells(rw, 1) = no
        ActiveSheet.Cells(rw, 3) = reqday
        ActiveSheet.Cells(rw, 5) = namplat
        ActiveSheet.Cells(rw, 18) = clntnam
        If clntpst1 <> "" Then ActiveSheet.Cells(rw, 26) = clntpst1 & "-" & clntpst2
        ActiveSheet.Cells(rw, 29) = clntad
        If clnttel1 <> "" Then ActiveSheet.Cells(rw, 40) = clnttel1 & "-" & clnttel2 & "-" & clnttel3
        
        If FlwrArg = "Y" Or FlwrArg = "y" Then ActiveSheet.Cells(rw, 80) = "Y"
        
        ActiveSheet.Cells(rw, 43) = Prce
        If Prce <> 16500 Then ActiveSheet.Cells(rw, 43).Interior.Color = RGB(255, 255, 120) Else ActiveSheet.Cells(rw, 43).Interior.Color = RGB(255, 255, 255)
        ActiveSheet.Cells(rw, 46) = charge
        If charge <> 2200 Then ActiveSheet.Cells(rw, 46).Interior.Color = RGB(255, 255, 120) Else ActiveSheet.Cells(rw, 46).Interior.Color = RGB(255, 255, 255)
        If ActiveSheet.Cells(rw, 80) <> "Y" Then
            Prcesub = Prce
            chargesub = charge
            totsub = Prcesub - chargesub
        Else
            flwtotsub = Prce - charge
        End If
        ActiveSheet.Cells(rw, 49) = totsub
        ActiveSheet.Cells(rw, 53) = pay
        If pay = "現地" Then ActiveSheet.Cells(rw, 53).Interior.Color = RGB(255, 255, 120) Else ActiveSheet.Cells(rw, 53).Interior.Color = RGB(255, 255, 255)
            
        ActiveSheet.Cells(rw, 55) = recnam
        ActiveSheet.Cells(rw, 56) = chk
        ActiveSheet.Cells(rw, 58) = chrgnam
        ActiveSheet.Cells(rw, 59) = chrgco
        ActiveSheet.Cells(rw, 60) = chrgmem
        ActiveSheet.Cells(rw, 61) = chrgpst
        ActiveSheet.Cells(rw, 62) = chrgad
        ActiveSheet.Cells(rw, 63) = chrgtel
        ActiveSheet.Cells(rw, 54) = memo
        ActiveSheet.Cells(rw, 79) = 0
        
        'tot = tot + Prce
        tot = tot + Prce
        sumchrg = sumchrg + charge
        adjtot = adjtot + (Prcesub - chargesub)
        flwtot = flwtot + flwtotsub
        ActiveSheet.Cells(5, 65) = tot
        ActiveSheet.Cells(5, 66) = sumchrg
        ActiveSheet.Cells(6, 65) = adjtot
        ActiveSheet.Cells(7, 65) = flwtot
        ActiveSheet.Cells(3, 37) = tot
        ActiveSheet.Cells(3, 43) = sumchrg
        ActiveSheet.Cells(3, 49) = adjtot
        ActiveSheet.Cells(2, 49) = flwtot
        
        'ActiveSheet.Unprotect
      
        
        If no = 1 Then
            Sheets("③花屋送信用").Select
                ActiveSheet.Cells(3, 1) = exdaynam1
                ActiveSheet.Cells(3, 4) = exday1
                ActiveSheet.Cells(4, 1) = exdaynam2
                ActiveSheet.Cells(4, 4) = exday2
                ActiveSheet.Cells(3, 10) = explace
                ActiveSheet.Cells(3, 19) = mainnam1
                ActiveSheet.Cells(3, 22) = mainnam2
        
                ActiveSheet.Cells(7, 38) = stuff
        
'            Sheets("修正").Select
'                ActiveSheet.Cells(2, 28) = mcnam1
'                ActiveSheet.Cells(2, 35) = mcnam2

        End If
        
        no = no + 1
        Sheets("②一覧表").Cells(5, 64) = no
      
        入力準備
        

End Sub
Sub 修正()
'修正が必要なデータを呼び出して修正
'一件ずつ修正する
Dim clntpst As String, clnttel As String, FlwrArg As String

    入力準備2

    Sheets("②一覧表").Select
        ActiveSheet.Unprotect
        
        ActiveSheet.Cells(1, 1).Select
        no = InputBox("修正するNo.？")
        ActiveSheet.Cells(5, 67) = no
        rw = no + 4
    
        tot = ActiveSheet.Cells(5, 65)
        'If ActiveSheet.Cells(rw, 80) <> "Y" Then tot = tot - ActiveSheet.Cells(rw, 43)
        tot = tot - ActiveSheet.Cells(rw, 43)
        ActiveSheet.Cells(5, 68) = tot
        sumchrg = ActiveSheet.Cells(5, 66)
        'If ActiveSheet.Cells(rw, 80) <> "Y" Then sumchrg = sumchrg - ActiveSheet.Cells(rw, 46)
        sumchrg = sumchrg - ActiveSheet.Cells(rw, 46)
        ActiveSheet.Cells(5, 69) = sumchrg
        
        adjtot = ActiveSheet.Cells(6, 65)
        If ActiveSheet.Cells(rw, 80) <> "Y" Then adjtot = adjtot - ActiveSheet.Cells(rw, 49)
        ActiveSheet.Cells(6, 68) = adjtot
        
        flwtot = ActiveSheet.Cells(7, 65)
        If ActiveSheet.Cells(rw, 80) = "Y" Then flwtot = flwtot - (ActiveSheet.Cells(rw, 43) - ActiveSheet.Cells(rw, 46))
        ActiveSheet.Cells(7, 68) = flwtot
    
        reqday = ActiveSheet.Cells(rw, 3)
        namplat = ActiveSheet.Cells(rw, 5)
        clntnam = ActiveSheet.Cells(rw, 18)
        '郵便番号
        clntpst = ActiveSheet.Cells(rw, 26)
        If clntpst <> "" Then
        '    pst1 = InStr(clntpst, "-")
            clntpst1 = Mid(clntpst, 1, 3)
            clntpst2 = Mid(clntpst, 5)
        End If
        '住所
        clntad = ActiveSheet.Cells(rw, 29)
        '電話番号
        clnttel = ActiveSheet.Cells(rw, 40)
        If clnttel <> "" Then
            c = 1
            cl = 1
            clnttel1 = ""
            clnttel2 = ""
            clnttel3 = ""
            lentel = Len(clnttel)
            While cl <= lentel
                If Mid(clnttel, cl, 1) <> "-" Then
                    If c = 1 Then
                        clnttel1 = clnttel1 & Mid(clnttel, cl, 1)
                        cl = cl + 1
                    End If
                    If c = 2 Then
                        clnttel2 = clnttel2 & Mid(clnttel, cl, 1)
                        cl = cl + 1
                    End If
                    If c = 3 Then
                        clnttel3 = clnttel3 & Mid(clnttel, cl, 1)
                        cl = cl + 1
                    End If
                Else
                    c = c + 1
                    cl = cl + 1
                End If
            
            Wend
        End If
        
        Prce = ActiveSheet.Cells(rw, 43)
        charge = ActiveSheet.Cells(rw, 46)
        pay = ActiveSheet.Cells(rw, 53)
        recnam = ActiveSheet.Cells(rw, 55)
        chk = ActiveSheet.Cells(rw, 56)
        chrgnam = ActiveSheet.Cells(rw, 58)
        chrgco = ActiveSheet.Cells(rw, 59)
        chrgmem = ActiveSheet.Cells(rw, 60)
        '請求先郵便番号
        chrgpst = ActiveSheet.Cells(rw, 61)
        If chrgpst <> "" Then
        '    pst1 = InStr(chrgpst, "-")
            chrgpst1 = Mid(chrgpst, 1, 3)
            chrgpst2 = Mid(chrgpst, 5)
        End If
        
        chrgad = ActiveSheet.Cells(rw, 62)
        '請求先電話番号
        chrgtel = ActiveSheet.Cells(rw, 63)
        If chrgtel <> "" Then
            c = 1
            cl = 1
            chrgtel1 = ""
            chrgtel2 = ""
            chrgtel3 = ""
            lentel = Len(chrgtel)
            While cl <= lentel
                If Mid(chrgtel, cl, 1) <> "-" Then
                    If c = 1 Then
                        chrgtel1 = chrgtel1 & Mid(chrgtel, cl, 1)
                        cl = cl + 1
                    End If
                    If c = 2 Then
                        chrgtel2 = chrgtel2 & Mid(chrgtel, cl, 1)
                        cl = cl + 1
                    End If
                    If c = 3 Then
                        chrgtel3 = chrgtel3 & Mid(chrgtel, cl, 1)
                        cl = cl + 1
                    End If
                Else
                    c = c + 1
                    cl = cl + 1
                End If
            
            Wend
        End If
        
        memo = ActiveSheet.Cells(rw, 54)
        cncl = ActiveSheet.Cells(rw, 79)
        FlwrArg = ActiveSheet.Cells(rw, 80)
        
        ActiveSheet.Protect
        
    Sheets("③花屋送信用").Select
        exdaynam1 = ActiveSheet.Cells(3, 1)
        exday1 = ActiveSheet.Cells(3, 4)
        exdaynam2 = ActiveSheet.Cells(4, 1)
        exday2 = ActiveSheet.Cells(4, 4)
        explace = ActiveSheet.Cells(3, 10)
        mainnam1 = ActiveSheet.Cells(3, 19)
        mainnam2 = ActiveSheet.Cells(3, 22)
        
        
        
    Sheets("修正").Select

        ActiveSheet.Cells(7, 15) = reqday
        ActiveSheet.Cells(9, 15) = Prce '金額
        If FlwrArg = "Y" Then ActiveSheet.Cells(9, 25) = "Y" '付け花
        ActiveSheet.Cells(9, 29) = charge '手数料
        ActiveSheet.Cells(10, 9) = namplat '芳名板
        ActiveSheet.Cells(12, 9) = clntnam '依頼者
        ActiveSheet.Cells(13, 11) = clntpst1 '〒1
        ActiveSheet.Cells(13, 15) = clntpst2 '〒2
        ActiveSheet.Cells(13, 24) = clntad 'ご住所
        ActiveSheet.Cells(14, 13) = clnttel1 'tel1
        ActiveSheet.Cells(14, 17) = clnttel2 'tel2
        ActiveSheet.Cells(14, 21) = clnttel3 'tel3
        
        If Trim(pay) = "振込" Then
            If Trim(chk) = "要" Then ActiveSheet.Cells(16, 30) = chrgnam '請求先
            ActiveSheet.Cells(18, 19) = chrgco '会社名・団体名
            ActiveSheet.Cells(19, 14) = chrgmem '担当者名
            ActiveSheet.Cells(20, 11) = chrgpst1 '送付先〒1
            ActiveSheet.Cells(20, 15) = chrgpst2 '送付先〒2
            ActiveSheet.Cells(20, 24) = chrgad '送付先住所
            ActiveSheet.Cells(21, 13) = chrgtel1 '送付先tel1
            ActiveSheet.Cells(21, 17) = chrgtel2 '送付先tel2
            ActiveSheet.Cells(21, 21) = chrgtel3 '送付先tel3
            
        ElseIf Trim(pay) = "現地" Then
            ActiveSheet.Cells(17, 30) = recnam '領収証の宛名
        End If
        
        ActiveSheet.Cells(3, 2) = exdaynam1
        ActiveSheet.Cells(3, 7) = exday1
        ActiveSheet.Cells(4, 2) = exdaynam2
        ActiveSheet.Cells(4, 7) = exday2
        ActiveSheet.Cells(2, 7) = mainnam1
        ActiveSheet.Cells(2, 14) = mainnam2
        ActiveSheet.Cells(5, 7) = explace

        
        ActiveSheet.Cells(22, 9) = memo '備考
        
        Sheets("修正").Cells(2, 7).Select
        
End Sub
Sub 修正完了()
    '修正したデータを入力し，一覧シートに追加する
    Dim no As Integer, tot As Long, charge As Long, sumchrg As Long, rw As Integer, pay As String, chk As String
    Dim reqday As String, Prce As Long, namplat As String, clntnam As String, clntpst1 As String, clntpst2 As String
    Dim clntad As String, clnttel1 As String, clnttel2 As String, clnttel3 As String, FlwrArg As String
    Dim chrgnam As String, recnam As String, chrgco As String, chrgmem As String, chrgpst1 As String, chrgpst2 As String
    Dim chrgad As String, chrgtel1 As String, chrgtel2 As String, chrgtel3 As String, memo As String
        
    
    Sheets("修正").Select
        exdaynam1 = ActiveSheet.Cells(3, 2)
        exday1 = ActiveSheet.Cells(3, 7)
        exdaynam2 = ActiveSheet.Cells(4, 2)
        exday2 = ActiveSheet.Cells(4, 7)
        mainnam1 = ActiveSheet.Cells(2, 7)
        mainnam2 = ActiveSheet.Cells(2, 14)
        explace = ActiveSheet.Cells(5, 7)
   
        reqday = ActiveSheet.Cells(7, 15)
        Prce = ActiveSheet.Cells(9, 15) '金額
        FlwrArg = ActiveSheet.Cells(9, 25) '付け花
        charge = ActiveSheet.Cells(9, 29) '手数料
        namplat = ActiveSheet.Cells(10, 9) '芳名板
        clntnam = ActiveSheet.Cells(12, 9) '依頼者
        clntpst1 = ActiveSheet.Cells(13, 11) '〒1
        clntpst2 = ActiveSheet.Cells(13, 15) '〒2
        clntad = ActiveSheet.Cells(13, 24) 'ご住所
        clnttel1 = ActiveSheet.Cells(14, 13) 'tel1
        clnttel2 = ActiveSheet.Cells(14, 17) 'tel2
        clnttel3 = ActiveSheet.Cells(14, 21) 'tel3
        
        If ActiveSheet.Cells(16, 30) <> "" Then
            pay = "振込"
            chk = "要"
            chrgnam = ActiveSheet.Cells(16, 30) '請求先
            chrgco = ActiveSheet.Cells(18, 19) '会社名・団体名
            chrgmem = ActiveSheet.Cells(19, 14) '担当者名
            chrgpst1 = ActiveSheet.Cells(20, 11) '送付先〒1
            chrgpst2 = ActiveSheet.Cells(20, 15) '送付先〒2
            If chrgpst1 <> "" Then chrgpst = chrgpst1 & "-" & chrgpst2
            chrgad = ActiveSheet.Cells(20, 24) '送付先住所
            chrgtel1 = ActiveSheet.Cells(21, 13) '送付先tel1
            chrgtel2 = ActiveSheet.Cells(21, 17) '送付先tel2
            chrgtel3 = ActiveSheet.Cells(21, 21) '送付先tel3
            If chrgtel1 <> "" Then chrgtel = chrgtel1 & "-" & chrgtel2 & "-" & chrgtel3
            
        ElseIf ActiveSheet.Cells(17, 30) <> "" Then
            pay = "現地"
            recnam = ActiveSheet.Cells(17, 30) '領収証の宛名
        Else
            pay = "振込"
            chk = "不要"

        End If
        
        memo = ActiveSheet.Cells(22, 9) '備考
    
    Sheets("②一覧表").Select
        ActiveSheet.Unprotect
        
        ActiveSheet.Cells(3, 5) = exday2
        ActiveSheet.Cells(3, 13) = explace
        ActiveSheet.Cells(3, 23) = mainnam1
        ActiveSheet.Cells(3, 27) = mainnam2
        
        no = ActiveSheet.Cells(5, 67)
        tot = ActiveSheet.Cells(5, 68)
        sumchrg = ActiveSheet.Cells(5, 69)
        adjtot = ActiveSheet.Cells(6, 68)
        flwtot = ActiveSheet.Cells(7, 68)
        rw = no + 4
        ActiveSheet.Cells(rw, 3) = reqday
        ActiveSheet.Cells(rw, 5) = namplat
        ActiveSheet.Cells(rw, 18) = clntnam
        If clntpst1 <> "" Then ActiveSheet.Cells(rw, 26) = clntpst1 & "-" & clntpst2 Else ActiveSheet.Cells(rw, 26) = ""
        ActiveSheet.Cells(rw, 29) = clntad
        If clnttel1 <> "" Then ActiveSheet.Cells(rw, 40) = clnttel1 & "-" & clnttel2 & "-" & clnttel3 Else ActiveSheet.Cells(rw, 40) = ""
        
        If FlwrArg = "Y" Or FlwrArg = "y" Then ActiveSheet.Cells(rw, 80) = "Y" Else ActiveSheet.Cells(rw, 80) = ""
        ActiveSheet.Cells(rw, 43) = Prce
        If Prce <> 16500 Then
            ActiveSheet.Cells(rw, 43).Interior.Color = RGB(255, 255, 120)
        Else
            ActiveSheet.Cells(rw, 43).Interior.Color = RGB(255, 255, 255)
        End If
            
        ActiveSheet.Cells(rw, 46) = charge
        If charge <> 2200 Then
            ActiveSheet.Cells(rw, 46).Interior.Color = RGB(255, 255, 120)
        Else
            ActiveSheet.Cells(rw, 46).Interior.Color = RGB(255, 255, 255)
        End If
        
        If ActiveSheet.Cells(rw, 80) <> "Y" Then
            Prcesub = Prce
            chargesub = charge
            totsub = Prcesub - chargesub
        Else
            flwtotsub = Prce - charge
        End If
        ActiveSheet.Cells(rw, 49) = totsub
        ActiveSheet.Cells(rw, 53) = pay
        If pay = "現地" Then
            ActiveSheet.Cells(rw, 53).Interior.Color = RGB(255, 255, 120)
        Else
            ActiveSheet.Cells(rw, 53).Interior.Color = RGB(255, 255, 255)
        End If
        
        ActiveSheet.Cells(rw, 55) = recnam
        ActiveSheet.Cells(rw, 56) = chk
        ActiveSheet.Cells(rw, 58) = chrgnam
        ActiveSheet.Cells(rw, 59) = chrgco
        ActiveSheet.Cells(rw, 60) = chrgmem
        ActiveSheet.Cells(rw, 61) = chrgpst
        ActiveSheet.Cells(rw, 62) = chrgad
        ActiveSheet.Cells(rw, 63) = chrgtel
        ActiveSheet.Cells(rw, 54) = memo
'        ActiveSheet.Cells(rw, 79) = cncl

        
        'tot = tot + Prce
        tot = tot + Prce
        sumchrg = sumchrg + charge
        adjtot = adjtot + (Prcesub - chargesub)
        flwtot = flwtot + flwtotsub
        
        ActiveSheet.Cells(5, 65) = tot
        ActiveSheet.Cells(5, 66) = sumchrg
        ActiveSheet.Cells(6, 65) = adjtot
        ActiveSheet.Cells(7, 65) = flwtot
        ActiveSheet.Cells(3, 37) = tot
        ActiveSheet.Cells(3, 43) = sumchrg
        ActiveSheet.Cells(3, 49) = adjtot
        ActiveSheet.Cells(2, 49) = flwtot
        
        ActiveSheet.Protect
        
    Sheets("③花屋送信用").Select
        ActiveSheet.Cells(3, 1) = exdaynam1
        ActiveSheet.Cells(3, 4) = exday1
        ActiveSheet.Cells(4, 1) = exdaynam2
        ActiveSheet.Cells(4, 4) = exday2
        ActiveSheet.Cells(3, 10) = explace
        ActiveSheet.Cells(3, 19) = mainnam1
        ActiveSheet.Cells(3, 22) = mainnam2

        
        
   入力準備2
    Sheets("②一覧表").Select
    
End Sub
Sub 請求書()
    Application.ScreenUpdating = False
    
    filenam = ThisWorkbook.Name
    

'1.担当者名、葬儀日を入力
    ' 新規請求書ファイルを作成，または既存のファイルを開く
    Dim stuff As String, exday As String
    Dim buf As String, fname As String, objWb As Workbook, no As Integer, fno As Integer, nam As String
    Dim prc As Integer, nosub As Integer, tot As Integer, foldr As String, fldnam As String
    Dim c As Integer, rw As Integer
    
    'ファイルNo.初期値
    Windows(filenam).Activate
    foldr = ThisWorkbook.Path 'フォルダの位置
    fldnam = Mid(foldr, InStrRev(foldr, "\") + 1)
    buf = Dir(foldr & "\*.xlsx")
    If buf = "" Then
    
            fno = 1
            rw = 5
            c = 1
            fname = fldnam '& "様" 'InputBox("ファイル名")
            MsgBox ("請求書ファイル [" & fname & "_請求書" & fno & "]として保存します")
            Set objWb = Workbooks.Add
            objWb.SaveAs (foldr & "\" & fname & "_請求書" & fno & ".xlsx")
            Windows(filenam).Activate
        Sheets("②一覧表").Select
            ActiveSheet.Unprotect
            
            ActiveSheet.Cells(5, 70) = fno
            ActiveSheet.Cells(5, 71) = fname
            ActiveSheet.Cells(5, 72) = rw '初期作成行を保存
            ActiveSheet.Cells(5, 73) = c
            
     Else
        Windows(filenam).Activate
        Sheets("②一覧表").Select
            ActiveSheet.Unprotect
            
            fno = ActiveSheet.Cells(5, 70)
            fname = ActiveSheet.Cells(5, 71)
            rw = ActiveSheet.Cells(5, 72)
            c = ActiveSheet.Cells(5, 73)
            
                        
            Workbooks.Open foldr & "\" & fname & "_請求書" & fno & ".xlsx"
    End If
    

    Windows(filenam).Activate

    stuff = Sheets("②一覧表").Cells(5, 74)
    exday = Sheets("②一覧表").Cells(5, 75)


        Sheets("④請求書").Cells(24, 22) = stuff
    '    Sheets("⑤領収書").Cells(2, 29) = stuff
        Sheets("④請求書").Cells(24, 24) = exday
    '    Sheets("⑤領収書").Cells(2, 31) = exday


    '2.一覧表シートより一件分のデータを請求書シートにコピー
        rw = Sheets("②一覧表").Cells(5, 72)
        Do While Sheets("②一覧表").Cells(rw, 1) <> ""
            If Sheets("②一覧表").Cells(rw, 56) = "要" And Sheets("②一覧表").Cells(rw, 79) <> 1 Then '"要"+[Cancelなし]のものだけを作成
                atena = Sheets("②一覧表").Cells(rw, 58) & "    様"
                Sheets("④請求書").Cells(2, 1) = atena
                no = Sheets("②一覧表").Cells(rw, 1)
                Sheets("④請求書").Cells(24, 28) = no
                conts = Sheets("②一覧表").Cells(rw, 5)
                Sheets("④請求書").Cells(33, 9) = conts
                Price = Sheets("②一覧表").Cells(rw, 43)
                Sheets("④請求書").Cells(29, 13) = Price
     '           Sheets("⑤領収書").Cells(rw2 + (no - 1) * 12, 3) = Price
                
                namae1 = Sheets("②一覧表").Cells(3, 23)
                Sheets("④請求書").Cells(14, 6) = namae1
                namae2 = Sheets("②一覧表").Cells(3, 27)
                Sheets("④請求書").Cells(14, 9) = namae2
        
            '3.請求書シートを別のエクセルブックに保存
                Sheets("④請求書").Select
                Sheets("④請求書").Copy Before:=Workbooks(fname & "_請求書" & fno & ".xlsx").Sheets(1)
                Sheets("④請求書").Select
                Sheets("④請求書").Name = no
              '宛名ラベルシートにデータを保存
                Call 宛名ラベル作成(rw)
                
                c = c + 1
            End If
            rw = rw + 1
            If c > 50 Then
                '50件に達したら請求書ファイルを保存し閉じる
                Windows(fname & "_請求書" & fno & ".xlsx").Activate
                ActiveWorkbook.Save
                ActiveWindow.Close
                '新たなファイルを作成し，カウントを初期化
                fno = fno + 1
                ActiveSheet.Cells(4, 70) = fno '新たな請求書ファイル番号を保存
                Set objWb = Workbooks.Add
                objWb.SaveAs (foldr & "\" & fname & "_請求書" & fno & ".xlsx")
                c = 1
            End If
            
            Windows(filenam).Activate
            Sheets("②一覧表").Select
            ActiveSheet.Unprotect

        Loop
        ActiveSheet.Cells(5, 72) = rw '最終作成行+1を保存
        ActiveSheet.Cells(5, 73) = c    'カウントを保存
        
        ActiveSheet.Protect

'4.まとめて（手動で）印刷


    Application.ScreenUpdating = True

End Sub
Sub 領収書()
'"現場"のあるものだけを作成
    Application.ScreenUpdating = False


'1. 一覧表より担当者、実施日、領収証の日付を領収書にコピー
    Dim stuff As String, exday As String
    Dim buf As String, fname As String, objWb As Workbook, no As Integer, fno As Integer, nam As String
    Dim prc As Integer, nosub As Integer, tot As Integer, foldr As String, fldnam As String
    Dim c As Integer, msg As String
    
    Sheets("②一覧表").Select
        ActiveSheet.Unprotect
        stuff = ActiveSheet.Cells(5, 74)
        exday = ActiveSheet.Cells(5, 75)
        rcdate = ActiveSheet.Cells(3, 55)

        Sheets("⑤領収書").Cells(2, 29) = stuff
        Sheets("⑤領収書").Cells(2, 31) = exday
        Sheets("⑤領収書").Cells(9, 5) = rcdate
        


    '2.一覧表シートより一件分のデータを領収書シートにコピー
        rcrw = Sheets("②一覧表").Cells(5, 76)
        'rw1 = rcrw - 2
        rw1 = 2
        'rw2 = rcrw + 1
        rw2 = rw1 + 3
        rcc = Sheets("②一覧表").Cells(5, 77)
        
        
        namae1 = Sheets("②一覧表").Cells(3, 23) & "  " & Sheets("②一覧表").Cells(3, 27)
        Sheets("⑤領収書").Cells(8, 5) = namae1
        
        
        msg = MsgBox("印刷してないすべての領収書を印刷しますか？", vbYesNoCancel)
        
        If msg = vbYes Then
        
            Do While Sheets("②一覧表").Cells(rcrw, 1) <> ""
                Sheets("⑤領収書").Cells(rw1 + (rcc - 1) * 12, 1) = rcc
                If Sheets("②一覧表").Cells(rcrw, 53) = "現地" And Sheets("②一覧表").Cells(rcrw, 79) <> 1 Then '"現地"+[Cancelなし]のものだけを作成
                    atena = Sheets("②一覧表").Cells(rcrw, 55)
                    Sheets("⑤領収書").Cells(rw1 + (rcc - 1) * 12, 11) = atena
                    no = Sheets("②一覧表").Cells(rcrw, 1)
                    Sheets("⑤領収書").Cells(rw1 + (rcc - 1) * 12, 35) = no
                    Price = Sheets("②一覧表").Cells(rcrw, 43)
                    Sheets("⑤領収書").Cells(rw2 + (rcc - 1) * 12, 3) = Price
                    If Price >= 50000 Then Sheets("⑤領収書").Cells(rw2 + (rcc - 1) * 12, 28) = "印紙"
                    
                    rcc = rcc + 1
                End If
                rcrw = rcrw + 1
                
                Sheets("②一覧表").Select
            Loop
            ActiveSheet.Cells(5, 76) = rcrw '最終作成行+1を保存
            ActiveSheet.Cells(5, 77) = rcc    'カウントを保存
            
        ElseIf msg = vbNo Then
            prntno = InputBox("印刷するNo.？")
            prntno2 = prntno + 4 '一覧表の行
            
            prntrw1 = prntno + 1 '領収証の宛名の行
            prntrw2 = prntrw1 + 3 '領収証の金額の行


            If Sheets("②一覧表").Cells(prntno2, 53) = "現地" And Sheets("②一覧表").Cells(prntno2, 79) <> 1 Then '"現地"+[Cancelなし]のものだけを作成
                atena = Sheets("②一覧表").Cells(prntno2, 55)
                Sheets("⑤領収書").Cells(prntrw1 + (prntno - 1) * 12, 11) = atena
                no = Sheets("②一覧表").Cells(prntno2, 1)
                Sheets("⑤領収書").Cells(prntrw1 + (prntno - 1) * 12, 35) = no
                Price = Sheets("②一覧表").Cells(prntno2, 43)
                Sheets("⑤領収書").Cells(prntrw2 + (prntno - 1) * 12, 3) = Price
                If Price >= 50000 Then Sheets("⑤領収書").Cells(prntrw2 + (prntno - 1) * 12, 28) = "印紙"
            Else
                MsgBox ("現地払いではないようです。確認してください。")
            End If
            
        End If
        
        ActiveSheet.Protect

'4.まとめて（手動で）印刷

    Application.ScreenUpdating = True


End Sub
Sub 宛名ラベル作成(ByVal rw As Integer)
    '宛名ラベル印刷用リストを作成
    '請求書〔要〕の件について作成する
    '郵便番号、住所、会社・団体名、担当者
    Application.ScreenUpdating = False
    filenam = ThisWorkbook.Name
    
    Windows(filenam).Activate
    
    Sheets("②一覧表").Select
        ActiveSheet.Unprotect
        
        chrgpst = ActiveSheet.Cells(rw, 61) '請求先郵便番号
        chrgad = ActiveSheet.Cells(rw, 62) '住所
        chrgco = ActiveSheet.Cells(rw, 59) '会社・団体名
        chrgmem = ActiveSheet.Cells(rw, 60) '担当者
        lblrw = ActiveSheet.Cells(5, 78)
        
        ActiveSheet.Protect
        
    
    Sheets("住所ラベル").Select
        ActiveSheet.Cells(lblrw, 1) = chrgpst '請求先郵便番号
        ActiveSheet.Cells(lblrw, 2) = chrgad '住所
        If chrgmem = "" Then ActiveSheet.Cells(lblrw, 3) = chrgco & "  御中" Else ActiveSheet.Cells(lblrw, 3) = chrgco  '会社・団体名
            
        If chrgmem <> "" Then ActiveSheet.Cells(lblrw, 4) = chrgmem & "  様" '担当者
        
        lblrw = lblrw + 1
    Sheets("②一覧表").Select
        ActiveSheet.Unprotect
        
        ActiveSheet.Cells(5, 78) = lblrw
        
        ActiveSheet.Protect

    Application.ScreenUpdating = True

End Sub

Sub 顧客用一覧表()
    'Cancel以外のデータを一覧表にコピー
    Application.ScreenUpdating = False
    
    rw = 5 '②一覧表の最初の行
    c = 1 '顧客用一覧表用カウンター
    
    Sheets("②一覧表").Select
        ActiveSheet.Unprotect
        
    While Sheets("②一覧表").Cells(rw, 1) >= 1
        cncl = Sheets("②一覧表").Cells(rw, 79)
        If cncl <> 1 Then
            Sheets("②一覧表").Select
                reqday = ActiveSheet.Cells(rw, 3)
                namplat = ActiveSheet.Cells(rw, 5)
                clntnam = ActiveSheet.Cells(rw, 18)
                '郵便番号
                clntpst = ActiveSheet.Cells(rw, 26)
                '住所
                clntad = ActiveSheet.Cells(rw, 29)
                '電話番号
                clnttel = ActiveSheet.Cells(rw, 40)
                Prce = ActiveSheet.Cells(rw, 43)
                charge = ActiveSheet.Cells(rw, 46)
                pay = ActiveSheet.Cells(rw, 49)
                
                tot = ActiveSheet.Cells(3, 37)
                sumchrg = ActiveSheet.Cells(3, 43)
                sumpay = ActiveSheet.Cells(3, 49)
                sumpayc0 = StrReverse(LTrim(Str(sumpay)))
                lenpay = Len(sumpayc0)
                nlenpay = Int(lenpay / 3)
                If nlenpay > 0 Then
                    For i_ = 1 To nlenpay
                        sumpayc0 = Left(sumpayc0, 3 * i_ + (i_ - 1)) & "," & Mid(sumpayc0, 3 * i_ + (i_ - 1) + 1)
                    Next i_
                    sumpayc = StrReverse(sumpayc0)
                Else
                    sumpayc = "0"
                End If
                    
                sumflwpay = ActiveSheet.Cells(2, 49)
                sumflwpayc0 = StrReverse(LTrim(Str(sumflwpay)))
                lenflw = Len(sumflwpayc0)
                nlenflw = Int(lenflw / 3)
                If nlenflw > 0 Then
                    For i_ = 1 To nlenflw
                        sumflwpayc0 = Left(sumflwpayc0, 3 * i_ + (i_ - 1)) & "," & Mid(sumflwpayc0, 3 * i_ + (i_ - 1) + 1)
                    Next i_
                    sumflwpayc = StrReverse(sumflwpayc0)
                Else
                    sumflwpayc = "0"
                End If
                
                
                sumpayc = "\" & sumpayc & vbLf & "\" & sumflwpayc
                
                exdate = ActiveSheet.Cells(3, 5)
                explace = ActiveSheet.Cells(3, 13)
                mainnam1 = ActiveSheet.Cells(3, 23)
                mainnam2 = ActiveSheet.Cells(3, 27)
                
                
            Sheets("顧客用一覧表").Select
            
                ActiveSheet.Cells(2, 5) = exdate
                ActiveSheet.Cells(2, 13) = explace
                ActiveSheet.Cells(2, 23) = mainnam1
                ActiveSheet.Cells(2, 27) = mainnam2
                
                ActiveSheet.Cells(2, 37) = tot
                ActiveSheet.Cells(2, 43) = sumchrg
                ActiveSheet.Cells(2, 49) = sumpayc
                
                rw2 = c + 3 '顧客用一覧表の行
                
                ActiveSheet.Cells(rw2, 1) = c
                ActiveSheet.Cells(rw2, 3) = reqday
                ActiveSheet.Cells(rw2, 5) = namplat
                ActiveSheet.Cells(rw2, 18) = clntnam
                '郵便番号
                ActiveSheet.Cells(rw2, 26) = clntpst
                '住所
                ActiveSheet.Cells(rw2, 29) = clntad
                '電話番号
                ActiveSheet.Cells(rw2, 40) = clnttel
                ActiveSheet.Cells(rw2, 43) = Prce
                ActiveSheet.Cells(rw2, 46) = charge
                ActiveSheet.Cells(rw2, 49) = pay
                
                c = c + 1
            
        End If
        rw = rw + 1
            
    Wend
    
    Sheets("②一覧表").Protect
    
    Application.ScreenUpdating = True

    
End Sub
Sub 生花発注()

    Application.ScreenUpdating = False

    'Cancel以外のデータを一覧表にコピー
    rw = 5 '②一覧表の最初の行
    c = 1 '顧客用一覧表用カウンター
    
    Sheets("②一覧表").Select
        ActiveSheet.Unprotect

    
    While Sheets("②一覧表").Cells(rw, 1) >= 1
        cncl = Sheets("②一覧表").Cells(rw, 79)
        If cncl <> 1 Then
            Sheets("②一覧表").Select
                namplat = ActiveSheet.Cells(rw, 5)
                
            Sheets("③花屋送信用").Select
            
                rw2 = c + 6 '顧客用一覧表の行
                
                ActiveSheet.Cells(rw2, 1) = c
                ActiveSheet.Cells(rw2, 3) = namplat
                
                c = c + 1
            
        End If
        rw = rw + 1
            
    Wend
    
    Sheets("②一覧表").Protect

    Application.ScreenUpdating = True


End Sub

Sub Cancel() 'キャンセルされた依頼を一覧表から削除
Sheets("②一覧表").Select
    ActiveSheet.Unprotect
cancl:
    noc = Application.InputBox("キャンセルするNo.？", Type:=2)
    If Val(noc) >= 1 Then
        GoTo excncl:
    Else
        GoTo end0:
    End If
excncl:
    no = Val(noc)
    rw = no + 4
    
    cncl = ActiveSheet.Cells(rw, 79)
    If cncl <> 1 Then
        tot = ActiveSheet.Cells(5, 65)
        tot2 = tot - ActiveSheet.Cells(rw, 43)
        sumchrg = ActiveSheet.Cells(5, 66)
        sumchrg2 = sumchrg - ActiveSheet.Cells(rw, 46)
        adjtot = ActiveSheet.Cells(6, 65)
        adjtot2 = adjtot - ActiveSheet.Cells(rw, 49)
        flwtot = ActiveSheet.Cells(7, 65)
        If ActiveSheet.Cells(rw, 80) = "Y" Then
            flwtot2 = flwtot - (ActiveSheet.Cells(rw, 43) - ActiveSheet.Cells(rw, 46))
        Else
            flwtot2 = flwtot
        End If
        
        
        Range(ActiveSheet.Cells(rw, 1), ActiveSheet.Cells(rw, 63)).Select
        With Selection.Font
            .Color = 7829367
        End With
    Else
        MsgBox ("このNo.は既にキャンセルされています。")
        GoTo cancl:
    End If
    
    qs = MsgBox("このNo.をキャンセルしますか？", vbYesNo)
    If qs = vbYes Then
        cncl = 1
        ActiveSheet.Cells(rw, 79) = cncl
        ActiveSheet.Cells(5, 65) = tot2
        tot = tot2
        ActiveSheet.Cells(5, 66) = sumchrg2
        sumchrg = sumchrg2
        ActiveSheet.Cells(6, 65) = adjtot2
        adjtot = adjtot2
        ActiveSheet.Cells(7, 65) = flwtot2
        flwtot = flwtot2
    ElseIf qs = vbNo Then
        cncl = 0
        ActiveSheet.Cells(rw, 79) = cncl
        Range(ActiveSheet.Cells(rw, 1), ActiveSheet.Cells(rw, 63)).Select
        With Selection.Font
            .ColorIndex = xlAutomatic
        End With
        GoTo cancl:
    Else
        GoTo end0:
    End If
    
end0:
    ActiveSheet.Cells(3, 37) = tot
    ActiveSheet.Cells(3, 43) = sumchrg
    ActiveSheet.Cells(3, 49) = adjtot
    ActiveSheet.Cells(2, 49) = flwtot
    
    ActiveSheet.Protect
    
End Sub

Sub revival() '削除した依頼を復活
Sheets("②一覧表").Select
    ActiveSheet.Unprotect
rev:
    noc = Application.InputBox("復活するNo.？", Type:=2)
    If Val(noc) >= 1 Then
        GoTo exrev:
    Else
        GoTo end1:
    End If
    
exrev:
    no = Val(noc)
    rw = no + 4
    
    cncl = ActiveSheet.Cells(rw, 79)
    
    If cncl = 1 Then
        tot = ActiveSheet.Cells(5, 65)
        tot2 = tot + ActiveSheet.Cells(rw, 43)
        sumchrg = ActiveSheet.Cells(5, 66)
        sumchrg2 = sumchrg + ActiveSheet.Cells(rw, 46)
        adjtot = ActiveSheet.Cells(6, 65)
        adjtot2 = adjtot + ActiveSheet.Cells(rw, 49)
        flwtot = ActiveSheet.Cells(7, 65)
        If ActiveSheet.Cells(rw, 80) = "Y" Then
            flwtot2 = flwtot + (ActiveSheet.Cells(rw, 43) - ActiveSheet.Cells(rw, 46))
        Else
            flwtot2 = flwtot
        End If
        
        Range(ActiveSheet.Cells(rw, 1), ActiveSheet.Cells(rw, 63)).Select
        With Selection.Font
            .ColorIndex = xlAutomatic
        End With
        
        cncl = 0
        ActiveSheet.Cells(rw, 79) = cncl
        ActiveSheet.Cells(5, 65) = tot2
        tot = tot2
        ActiveSheet.Cells(5, 66) = sumchrg2
        sumchrg = sumchrg2
        ActiveSheet.Cells(6, 65) = adjtot2
        adjtot = adjtot2
        ActiveSheet.Cells(7, 65) = flwtot2
        flwtot = flwtot2
        
        GoTo end0:
    Else
        MsgBox ("このNo.はキャンセルされていません！")
        GoTo rev:
    End If
    
    
end0:
    ActiveSheet.Cells(3, 37) = tot
    ActiveSheet.Cells(3, 43) = sumchrg
    ActiveSheet.Cells(3, 49) = adjtot
    ActiveSheet.Cells(2, 49) = flwtot
    
end1:
    ActiveSheet.Protect

End Sub


