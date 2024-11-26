## Back : Django 실행하기
1. venv 가상환경 생성
```bash
$ python -m venv venv
```

2. 가상환경 실행
```bash
$ source venv/Scripts/activate
```

2. `requirementst.txt` 파일 내용 다운로드
```bash
$ pip install -r requirements.txt
```

3. DB 생성 : migrate 실행
```bash
$ python manage.py migrate
```

4. 관리자 계정 생성 : createsuperuser 실행
```bash
$ python manage.py createsuperuser
```
- admin 계정 생성 후, 관리자 페이지 접속 가능
- 관리자 페이지 접속 주소 : http://127.0.0.1:8000/admin/
- `threads.json` 파일 `"user_id": 1`이므로 임시 계정 생성 필요

5. `threads.json` 파일 내용 DB에 저장
```bash
$ python manage.py loaddata threads.json
```

6. Django 서버 실행
```bash
$ python manage.py runserver
```

## 기타 환경 설정
> `pip install -r requirements.txt` 시 설치에 오류나는 경우 해결법
> 

**Visual C++ 빌드 도구 설치**

- **Visual C++ 빌드 도구 설치**
- Visual Studio Build Tools 다운로드 및 설치
- 설치 시 "C++ 빌드 도구" 선택
- https://visualstudio.microsoft.com/ko/visual-cpp-build-tools/



> env 파일 추가 설명
- 파일 형식
```
VITE_KAKAO_MAP_API_KEY=<카카오맵 API 키>
```



### API 키 발급 방법

> 카카오맵 API 키 발급 방법
1. 카카오 개발자 사이트에 접속  
  - https://apis.map.kakao.com/web/sample/categoryBasic/  
2. 로그인 후, `내 애플리케이션` > `애플리케이션 추가하기`  
3. 학습용이라면, `앱 이름 : Study, 사업자명 : Study` 로 작성 후 저장  
4. 내 애플리케이션 > 앱 설정 > 앱 키   
  - JavaScript 키 복사  
  - front 폴더 내 `.env` 파일에 붙여넣기   
  - 키 입력 시, 따옴표 없이 키 값만 입력  
5. 내 애플리케이션 > 앱 설정 > 플랫폼    
  - Web > 사이트 도메인 작성  
    ```
    http://127.0.0.1:8000
    http://localhost:5173
    ```

6. API KEY 작성
    ```html
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`
    ```

- 참고 사이트
  - https://apis.map.kakao.com/web/sample/keywordList/
<hr>  


> 한국 수출입 은행 API 키 발급 방법
1. 한국 수출입 은행 사이트에 접속
  - https://www.koreaexim.go.kr/index
2. 상단 메뉴바 : 정보공개 > 공공데이터개방 > OpenAPI
3. `현재환율API` 선택
4. 인증키 발급신청 항목 선택
5. 발급 신청 과정 진행
6. 인증키 발급 완료 후, 인증키 확인





- 참고 사이트
  https://www.koreaexim.go.kr/index