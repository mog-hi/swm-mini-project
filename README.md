# 야너두
<img src="https://user-images.githubusercontent.com/59961690/116557008-03fbdd80-a939-11eb-8bec-3e8a9a2a6b6b.png">  

>너두 새해목표가 외국어 공부야?  
>
>모르는 문장 그때그때 번역기 돌려보고,  
>하루에 5문제씩 원하는 언어로 테스트해보고.
>
>걱정마  
>***야, 너두 외국어 할 수 있어***  

## 기획 의도
원하는 문장을 그때그때 번역하며 배우고, 짬나는 시간에 단어 시험을 볼 수 있도록 두 가지 기능을 동시에 제공합니다.  
번역사이트, 외국어 단어 공부 어플 따로 사용하지 말고 한 번에, 그것도 **카카오워크 챗봇**으로!  

## 기능
1. 원하는 언어로 원하는 문장 번역기 돌리기
2. 원하는 언어로 단어 시험보기

## 시나리오
### 초기 화면
1. 야너두에게 메세지를 받습니다.  
2. 번역이 필요하다면 `번역할래요!`를, 단어시험을 보고 싶다면 `공부할래요!`를 선택합니다.  
<img src="https://user-images.githubusercontent.com/59961690/116539649-11f33380-a924-11eb-9146-023955e1a5b3.png" width="35%">

### 번역할래요!  
<img src="https://user-images.githubusercontent.com/59961690/116540778-91353700-a925-11eb-9198-8cb68b9c0279.png" width="35%">


|1. 번역될 언어, 번역할 언어를 선택하고 번역할 내용을 입력합니다.|2. 야너두가 번역을 하여 번역결과를 알려줍니다.|
|---|---|
|<img src="https://user-images.githubusercontent.com/59961690/116545550-8da4ae80-a92b-11eb-80c4-be36ebe24184.PNG" width="1000">|<img src="https://user-images.githubusercontent.com/59961690/116545526-841b4680-a92b-11eb-8339-9c58a116748b.PNG" width="1000">|

### 공부할래요!  
<img src="https://user-images.githubusercontent.com/59961690/116540680-7498ff00-a925-11eb-8168-c8bfa20bb462.png" width="35%">

|1. 테스트를 시작할 언어와 레벨을 선택합니다.|2. 야너두로부터 도착한 메세지의 `테스트 하러가기` 버튼을 클릭합니다.|3. 출제된 문제 5개의 정답을 입력한 후 `제출`버튼을 클릭합니다.|4. 야너두가 채점결과와 오답노트를 정리하여 알려줍니다.|
|---|---|---|---|
|<img src="https://user-images.githubusercontent.com/59961690/116541001-d9545980-a925-11eb-8727-e48eeb4d6f7f.png" width="1000"> |<img src="https://user-images.githubusercontent.com/59961690/116541372-58e22880-a926-11eb-8233-26d11e61f1ba.png" width="1000">|<img src="https://user-images.githubusercontent.com/59961690/116541083-f7ba5500-a925-11eb-809f-ed158d712da2.png" width="1000">|<img src="https://user-images.githubusercontent.com/59961690/116541502-7f07c880-a926-11eb-8792-44cc38a35e0b.png" width="1000">|  


## 개발자 '콩나물 대가리'
|팀원|역할|
|---|---|
|[김영현](https://github.com/portfolioExpert), [진유진](https://github.com/wishJinit)|난이도별 단어 선택, 학습할 언어 선택창|
|[서청운](https://github.com/newdeal123), [홍민정](https://github.com/meanjung)|번역기 구현, 사용자로부터 답변 받는 창|
|[임해경](https://github.com/iamhge), [현주희](https://github.com/Hyun-juhee)|채점 기능 구현, 틀린 문제 정답 보내주기|  

## 개발환경  
|IDE|프레임워크|
|---|---|
|goormide|express|  

## API
- [카카오 번역 API](https://developers.kakao.com/docs/latest/ko/translate/common)
- [카카오워크 봇 API](https://docs.kakaoi.ai/kakao_work)
