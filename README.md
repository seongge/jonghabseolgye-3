## 📢 실시간 학과 공지 및 소통 플랫폼

---

## 1. 프로젝트 개요

본 프로젝트는 학교 및 학과 홈페이지에 흩어져 있는 공지사항을 자동으로 수집하고, 사용자가 보다 편리하게 공지를 확인하며 커뮤니티 기능을 통해 소통할 수 있도록 만든 웹 서비스이다.

기존에는 공지를 확인하기 위해 학교 홈페이지와 학과 홈페이지를 각각 직접 방문해야 하는 불편함이 있었다. 이를 해결하기 위해 공지 크롤링 기능과 커뮤니티 게시판 기능을 결합한 통합 플랫폼을 개발하였다.

---

## 2. 개발 기간 및 팀원

### 📅 개발 기간
- 2026.04.08 ~ 2026.05.05

### 👨‍💻 팀원 및 역할

#### Frontend
- 공지 목록 / 상세 UI 구현
- 게시판 및 댓글 UI 개발
- 검색 및 필터 기능 구현
- 알림 UI 구현
- API 연동 및 사용자 인터페이스 개선

#### Backend
- REST API 설계 및 개발
- 사용자 인증 기능 구현
- 게시글 / 댓글 / 좋아요 기능 구현
- 알림 기능 구현
- MongoDB 데이터 연동

#### Crawling
- 학교 및 학과 공지 크롤링 기능 구현
- 데이터 정제 및 중복 제거 처리
- 공지 데이터 DB 저장

---

## 3. 기술 스택

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Crawling**: Cheerio, Puppeteer
- **협업 도구**: GitHub, VS Code

---

## 4. 주요 기능

### 👤 사용자 기능
- 회원가입 및 로그인
- 로그인 사용자만 서비스 이용 가능
- 자유 게시판 이용
- 전공 게시판 이용
- 게시글 작성 / 수정 / 삭제
- 댓글 작성 / 삭제
- 게시글 좋아요
- 게시글 검색 및 필터링

### 📢 공지 기능
- 학교 공지 자동 수집 및 조회
- 학과 공지 자동 수집 및 조회
- 사용자의 학과에 맞는 공지 제공
- 공지 상세 조회
- 공지 검색 및 카테고리 필터

### 🔔 알림 기능
- 댓글 알림
- 공지 알림
- 사용자별 알림 목록 조회
- 알림 생성 시간 저장

---

## 5. 요구사항 분석

### ✔ 기능 요구사항
- 사용자는 회원가입 후 로그인해야 서비스를 이용할 수 있다.
- 사용자는 자유 게시판에서 게시글을 작성할 수 있다.
- 사용자는 같은 전공 사용자들과 전공 게시판을 이용할 수 있다.
- 사용자는 게시글에 댓글을 작성할 수 있다.
- 사용자는 게시글에 좋아요를 누를 수 있다.
- 사용자는 학교 공지를 조회할 수 있다.
- 사용자는 자신의 학과 공지만 조회할 수 있다.
- 공지 데이터는 크롤링을 통해 자동으로 수집된다.
- 사용자는 알림을 받을 수 있다.

### ✔ 비기능 요구사항
- 로그인 사용자만 접근 가능
- 공지 데이터 중복 저장 방지
- API 응답 구조 일관성 유지
- 직관적인 UI 제공
- 알림 데이터 안정적 관리

---

## 6. 시스템 설계

### 📌 시스템 구조
- React 기반 클라이언트
- Node.js / Express 서버
- MongoDB 데이터베이스
- 크롤링 모듈
- REST API 통신 구조

<img width="1200" height="911" alt="Image" src="https://github.com/user-attachments/assets/d78c53da-b9ae-46cf-a2fe-4a07f756d4d0" />

---

### 📌 유스케이스 다이어그램
👉 사진첨부

---

### 📌 ERD

<img width="861" height="1068" alt="Image" src="https://github.com/user-attachments/assets/068dc9fd-96df-4587-a77d-27f4df0441c4" />

---

### 📌 API 구조
<img width="1735" height="905" alt="image" src="https://github.com/user-attachments/assets/b5e67178-c4e0-4e7a-98d8-6dcb99619dc1" />

---

## 7. 데이터베이스 설계

### 1. users
사용자 정보를 저장하는 컬렉션이다.
- 이메일
- 비밀번호
- 닉네임
- 학과
- 학년
- 역할
- 생성일
- 수정일

---

### 2. posts
게시글 정보를 저장하는 컬렉션이다.
- 게시글 제목
- 게시글 내용
- 게시판 종류
- 작성자
- 대상 전공
- 학년 필터
- 생성일
- 수정일

---

### 3. comments
댓글 정보를 저장하는 컬렉션이다.
- 게시글 ID
- 작성자 ID
- 댓글 내용
- 생성일
- 수정일

---

### 4. notices
공지 정보를 저장하는 컬렉션이다.
- 공지 제목
- 공지 내용
- 공지 카테고리
- 공지 출처
- 학과 정보
- 원문 링크
- 게시일
- 생성일

---

### 5. post_likes
게시글 좋아요 정보를 저장하는 컬렉션이다.
- 사용자 ID
- 게시글 ID
- 생성일

---

### 6. alarm
사용자 알림 정보를 저장하는 컬렉션이다.
- 사용자 ID
- 알림 종류 (comment, notice)
- 공지 ID
- 댓글 ID
- 게시글 ID
- 알림 내용
- 생성 시간

알림은 댓글 알림과 공지 알림으로 구분되며,  
알림 유형에 따라 게시글, 댓글 또는 공지 데이터와 연결된다.

---

## 8. API 명세

### Auth API
| Method | URL | 설명 |
|---|---|---|
| POST | /api/auth/register | 회원가입 |
| POST | /api/auth/login | 로그인 |
| GET | /api/auth/me | 사용자 정보 조회 |

---

### Post API
| Method | URL | 설명 |
|---|---|---|
| GET | /api/posts | 게시글 목록 |
| GET | /api/posts/:id | 게시글 상세 |
| POST | /api/posts | 게시글 작성 |
| PUT | /api/posts/:id | 게시글 수정 |
| DELETE | /api/posts/:id | 게시글 삭제 |

---

### Comment API
| Method | URL | 설명 |
|---|---|---|
| GET | /api/posts/:postId/comments | 댓글 조회 |
| POST | /api/posts/:postId/comments | 댓글 작성 |
| DELETE | /api/comments/:id | 댓글 삭제 |

---

### Like API
| Method | URL | 설명 |
|---|---|---|
| POST | /api/posts/:postId/likes | 좋아요 |
| DELETE | /api/posts/:postId/likes | 좋아요 취소 |

---

### Notice API
| Method | URL | 설명 |
|---|---|---|
| GET | /api/notices | 공지 목록 |
| GET | /api/notices/:id | 공지 상세 |
| GET | /api/notices/school | 학교 공지 |
| GET | /api/notices/department | 학과 공지 |
| POST | /api/internal/notices/crawl | 크롤링 |

---

### Alarm API
| Method | URL | 설명 |
|---|---|---|
| GET | /api/alarms | 알림 목록 |
| GET | /api/alarms/:id | 알림 상세 |
| POST | /api/alarms | 알림 생성 |
| DELETE | /api/alarms/:id | 알림 삭제 |
| DELETE | /api/alarms | 전체 삭제 |

---

## 9. 구현 내용

### 🖥 프론트엔드
- 게시판 UI 구현
- 공지 화면 구현
- 알림 UI 구현
- 검색 및 필터 구현

<table>
  <!-- 1. 게시판 UI -->
  <tr>
    <td colspan="3" align="center"><b>게시판 UI 구현</b></td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/75dd23d7-8e1f-440c-a3b1-69451905969e" width="300" height="650" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/56f80239-ebe0-40e5-95e0-1e18734a7c74" width="300" height="650" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/0aaba724-87c8-4adc-a24a-d344f25591c6" width="300" height="650" />
    </td>
  </tr>

  <!-- 2. 공지 화면 -->
  <tr>
    <td colspan="3" align="center"><b>공지 화면 구현</b></td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/7e461815-0bfb-483d-b92d-e56231176077" width="300" height="650" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/60e3e486-5fce-49dc-bbc4-70448c50aacf" width="300" height="650" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/a6dab1de-7d72-4f7f-aaca-d47e6878dffa" width="300" height="650" />
    </td>
  </tr>

  <!-- 3. 알림 UI -->
  <tr>
    <td colspan="3" align="center"><b>알림 UI 구현</b></td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/bd4fb72a-d053-4d2c-9b2c-f611a8e1b42d" width="300" height="650" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/6c1f666d-9371-43e0-97eb-d63dc9f92e92" width="300" height="650" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/e6e6354a-5a21-4941-a72f-ff60aa987246" width="300" height="650" />
    </td>
  </tr>

  <!-- 4. 검색 및 필터  -->
  <tr>
    <td colspan="3" align="center"><b>검색 및 필터 구현</b></td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/f45fbf06-f92b-427a-84f3-e3cb3f646023" width="300" height="650" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/c7879c86-f674-4915-a8bd-6e6e7619da61" width="300" height="650" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/767ef9be-f5c3-484d-8030-505fca04684a" width="300" height="650" />
    </td>
  </tr>
</table>


---

### ⚙ 백엔드
- REST API 구현
- JWT 인증 구현
- 게시글 / 댓글 / 좋아요 기능
- 알림 기능

👉 사진첨부

---

### 🕷 크롤링
- 공지 수집
- 데이터 정제
- 중복 제거

👉 사진첨부

---

## 10. 테스트

| 기능 | 결과 |
|---|---|
| 회원가입 | 성공 |
| 로그인 | 성공 |
| 게시글 | 성공 |
| 댓글 | 성공 |
| 좋아요 | 성공 |
| 공지 조회 | 성공 |
| 알림 | 성공 |

---

## 11. 결과 화면

👉 사진첨부

---

## 12. 문제 해결

- 공지 중복 문제 → URL 기준 필터링
- 인증 문제 → JWT 적용
- 학과 필터 문제 → 사용자 정보 기반 필터링
- 알림 구조 문제 → 타입 기반 설계

---

## 13. 결론

공지 크롤링 + 커뮤니티 기능을 결합하여  
실제 사용자에게 유용한 서비스를 구현하였다.
