# 2027 오믈렛 전사 KPI 성과 거버넌스 체계 (v12)

오믈렛 5대 핵심 조직(Research, Problem Solving, Business Development, Product Build, Business Management)의 2027년 전사 성과 거버넌스 체계 및 팀장 자율 세팅 대시보드입니다.

## 🔗 웹페이지 및 클라우드 연동 주소
- **대시보드 라이브 URL**: [https://link2scm.github.io/omelet-2027-kpi/](https://link2scm.github.io/omelet-2027-kpi/)
- **Airtable 성과 집계 뷰**: [Airtable Base (2027_전사_KPI_성과관리) 열기](https://airtable.com/appdF5ETllb7X4jU1/tbl7YNvxCkjbAasyu/viwbGaCCHSXgnc4fX?blocks=hide)
  - **Base ID**: `appdF5ETllb7X4jU1`
  - **Table ID / Name**: `tbl7YNvxCkjbAasyu` (`2027_전사_KPI_성과관리`)
- **Google 스프레드시트 백업 뷰**: [Google Spreadsheet (Omelet-KPI-Setup) 열기](https://docs.google.com/spreadsheets/d/1J5OTpZlyFP-rnutY8mYAYP1mz3U726smtTz5u09lnO0/edit?usp=sharing)
  - **Spreadsheet ID**: `1J5OTpZlyFP-rnutY8mYAYP1mz3U726smtTz5u09lnO0`
  - **Sheet 탭 명칭**: `2027_전사_KPI_성과관리`

## 🎯 핵심 평가 프레임워크 (100점 절대평가)
- **핵심 원칙**: 성과지표 I과 II는 단기적으로 결과지표를 달성하고, 중장기적으로 회사의 성장을 견인하는 지표가 되며, 결과지표는 전체 구성원의 결과가 균등 귀속됩니다.
- **결과지표 (50점)**: 팀 공동 단일 최상위 사업 실적 (신규 유상 프로젝트 수주 계약 건수 12건, 엔진 배포 건수 등 건수/지표 기반, 전체 구성원 균등 귀속)
- **성과지표 I - 결과지표 견인 선행 행동 (20점)**: 단기적으로 결과지표를 달성하기 위한 5대 정량 선행 직무 지표 (항목별 합산 = 20점)
- **성과지표 II - 결과지표 달성 핵심 역량 (30점)**: 결과지표 완결 및 중장기 성장을 견인하는 5대 정성 핵심 역량 (항목별 합산 = 30점)

## ☁️ 클라우드 이중화 실시간 동기화 (Airtable + Google Sheets)
1. **이중화 동시 저장**: [저장하기] 클릭 시 에어테이블과 구글 스프레드시트 두 곳에 실시간으로 데이터가 동시 전송됩니다.
2. **에어테이블 접속 장애 대비**: 네트워크 이슈나 계정 권한 등으로 에어테이블 접속이 불가하더라도 구글 스프레드시트에 영구 백업되어 누락이 발생하지 않습니다.
3. **무중복 인플레이스(In-place) 갱신**: 신규 행이 무한히 늘어나지 않고, 각 팀 고유 ID(`rd`, `bd`, `ps`, `pb`, `bm`)에 맞춰 해당 행이 덮어쓰기 갱신됩니다.
4. **수정 모드 동기화**: [수정하기] 클릭 시 두 클라우드 모두 '작성 중' 상태로 실시간 전환됩니다.

## 📁 주요 구성 파일
- `index.html`: 2027 오믈렛 전사 KPI 성과관리 인터랙티브 웹 대시보드 (v12)
- `google_apps_script_sync.js`: 구글 스프레드시트 전용 실시간 웹앱 동기화 스크립트
- `2027-오믈렛-KPI-팀장관리_version02.xlsx`: 오프라인/스프레드시트 취합용 실무 워크북
