# chaenggimi-web

챙기미 공개 페이지. 소스 저장소는 비공개이고, 여기에는 배포 결과물만 올라간다.

- `index.html` + `_expo/` — 초대 링크를 여는 웹 앱. `https://lodimsign.github.io/chaenggimi-web/?t=코드`
- `privacy.html` — 개인정보 처리방침
- `support.html` — 고객지원 (App Store 지원 URL)
- `.nojekyll` — `_expo/` 가 밑줄로 시작해 Jekyll 이 지우는 것을 막는다

원본은 비공개 저장소 `chaenggimi` 의 `docs/privacy.html` · `docs/support.html` 이고,
웹 앱은 `npm run export:web` 결과(`dist/`)다. 여기서 직접 고치지 말고 원본을 고친 뒤 다시 올린다.
