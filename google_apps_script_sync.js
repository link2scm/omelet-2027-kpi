/**
 * ===================================================================
 * 2027 오믈렛 전사 KPI 성과 거버넌스 - 구글 스프레드시트 실시간 동기화 스크립트
 * ===================================================================
 * 
 * 스프레드시트 주소:
 * https://docs.google.com/spreadsheets/d/1J5OTpZlyFP-rnutY8mYAYP1mz3U726smtTz5u09lnO0/edit
 * 
 * [배포 및 연동 3단계 가이드]
 * 1. 위 구글 스프레드시트 접속 ➔ 상단 메뉴 [확장 프로그램] ➔ [Apps Script] 클릭
 * 2. 기존 코드를 모두 지우고 본 파일의 전체 코드를 복사하여 붙여넣기 후 저장 (Ctrl+S)
 * 3. 우측 상단 파란색 [배포] ➔ [새 배포] 클릭
 *    - 유형 선택(톱니바퀴): "웹 앱 (Web App)"
 *    - 설명: "2027 KPI 웹앱 실시간 동기화"
 *    - 다음 사용자 권한으로 실행: "나(내 계정)"
 *    - 액세스 권한이 있는 사용자: "모든 사용자 (Anyone)" ★ 필수!
 *    - [배포] 클릭 ➔ 생성된 "웹 앱 URL (https://script.google.com/macros/s/.../exec)" 복사
 * 4. 복사한 URL을 웹 대시보드의 Google 시트 뱃지 클릭 시 나타나는 입력창에 입력하거나
 *    저에게 알려주시면 웹 대시보드에 영구 내장 배포됩니다!
 */

const TARGET_SPREADSHEET_ID = "1J5OTpZlyFP-rnutY8mYAYP1mz3U726smtTz5u09lnO0";
const SHEET_TAB_NAME = "2027_전사_KPI_성과관리";

const HEADERS = [
  "조직 코드 (Team ID)",
  "조직명 (Team Name)",
  "작성 상태 (Status)",
  "최종 저장 일시 (Saved At)",
  "핵심 미션 (Leader Role)",
  "역할 및 미션 상세 (Role Description)",
  "결과지표 항목명 (Result Metric)",
  "결과지표 목표치 (Result Target)",
  "결과지표 단위 (Result Unit)",
  "결과지표 선정 이유 (Result Reason)",
  "결과지표 달성 기준 (Result Criteria)",
  "성과지표I 요약 (P1 Activities)",
  "성과지표I 총배점 (P1 Score)",
  "성과지표II 요약 (P2 Competencies)",
  "성과지표II 총배점 (P2 Score)",
  "종합 배점 (Total Score)",
  "전체 데이터 (Raw JSON)"
];

function getOrCreateTargetSheet() {
  const ss = SpreadsheetApp.openById(TARGET_SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_TAB_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TAB_NAME);
  }
  
  // 헤더가 없을 경우 자동 초기화
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#E2EAF4");
    headerRange.setFontColor("#173F5F");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  
  return sheet;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  // 동시 저장 충돌 방지 (최대 10초 대기)
  lock.tryLock(10000);
  
  try {
    const sheet = getOrCreateTargetSheet();
    let data;
    
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter || {};
    }
    
    const teamId = data.teamId;
    if (!teamId) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "teamId is required" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const values = sheet.getDataRange().getValues();
    let targetRowIndex = -1;
    
    // 기존에 저장된 동일 Team ID 행이 있는지 탐색 (1행 헤더 제외)
    for (let r = 1; r < values.length; r++) {
      if (String(values[r][0]).toLowerCase().trim() === String(teamId).toLowerCase().trim()) {
        targetRowIndex = r + 1; // 1-based index
        break;
      }
    }
    
    // [수정하기] 모드 전환 액션 처리
    if (data.action === "edit") {
      if (targetRowIndex > 0) {
        sheet.getRange(targetRowIndex, 3).setValue("작성 중");
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "edit", teamId: teamId }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // [저장하기] 데이터 조립 (17개 필드)
    const rowRecord = [
      data.teamId || "",
      data.teamName || "",
      data.status || "저장 완료",
      data.savedAt || new Date().toLocaleString("ko-KR"),
      data.leaderRole || "",
      data.roleDesc || "",
      data.resultMetric || "",
      data.resultTarget || "",
      data.resultUnit || "",
      data.resultReason || "",
      data.resultCriteria || "",
      data.p1Summary || "",
      data.p1Score !== undefined ? Number(data.p1Score) : 20,
      data.p2Summary || "",
      data.p2Score !== undefined ? Number(data.p2Score) : 30,
      data.totalScore !== undefined ? Number(data.totalScore) : 100,
      typeof data.raw === "string" ? data.raw : JSON.stringify(data.raw || {})
    ];
    
    if (targetRowIndex > 0) {
      // 기존 행 덮어쓰기 (In-place Update)
      sheet.getRange(targetRowIndex, 1, 1, rowRecord.length).setValues([rowRecord]);
    } else {
      // 신규 행 추가
      sheet.appendRow(rowRecord);
      targetRowIndex = sheet.getLastRow();
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Google Spreadsheet in-place sync completed",
      teamId: teamId,
      rowIndex: targetRowIndex
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    const sheet = getOrCreateTargetSheet();
    const values = sheet.getDataRange().getValues();
    const records = [];
    
    if (values.length > 1) {
      for (let r = 1; r < values.length; r++) {
        const row = values[r];
        records.push({
          teamId: row[0],
          teamName: row[1],
          status: row[2],
          savedAt: row[3],
          leaderRole: row[4],
          roleDesc: row[5],
          resultMetric: row[6],
          resultTarget: row[7],
          resultUnit: row[8],
          resultReason: row[9],
          resultCriteria: row[10],
          p1Summary: row[11],
          p1Score: row[12],
          p2Summary: row[13],
          p2Score: row[14],
          totalScore: row[15],
          raw: row[16]
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      totalRecords: records.length,
      records: records
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

