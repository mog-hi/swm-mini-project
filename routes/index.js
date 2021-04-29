// routes/index.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const libKakaoWork = require('../libs/kakaoWork');
const querystring = require('querystring');
const kakaoApiKey = require('../configs/kakaoapikey.json');
const Word = require('./word.js');
const word = Word.word;

const lang_dict = {
			"English":'en',
			"Japanese":'jp',
			"Chinese":'cn'
};

router.get('/', async (req, res, next) => {
  // 유저 목록 검색 (1)
  const users = await libKakaoWork.getUserList();

  // 검색된 모든 유저에게 각각 채팅방 생성 (2)
  const conversations = await Promise.all(
    users.map((user) => libKakaoWork.openConversations({ userId: user.id }))
  );

  const messages = await Promise.all([
    conversations.map((conversation) =>
      libKakaoWork.sendMessage({
        conversationId: conversation.id,
		  "text": "무엇이 하고 싶나요?",
		  "blocks": [
			{
			  "type": "header",
			  "text": "무엇이 하고 싶나요?",
			  "style": "yellow"
			},
			{
			  "type": "image_link",
			  "url": "https://user-images.githubusercontent.com/59961690/116557008-03fbdd80-a939-11eb-8bec-3e8a9a2a6b6b.png"
			},
			{
			  "type": "text",
			  "text": "번역할래요!🗣",
			  "markdown": true
			},
			{
			  "type": "button",
			  "action_type": "call_modal",
			  "value": "want_to_trans",
			  "text": "번역하기",
			  "style": "default"
			},
			{
			  "type": "text",
			  "text": "공부할래요!📖",
			  "markdown": true
			},
			{
			  "type": "button",
			  "action_type": "call_modal",
			  "value": "lang_test",
			  "text": "공부하기",
			  "style": "default"
			}
		  ]

      })
    ),
  ]);

  // 응답값은 자유롭게 작성하셔도 됩니다.
  res.json({
    users,
    conversations,
    messages,
  });
});

// request url을 통해 모달 뷰 띄우기
router.post('/request', async (req, res, next) => {
	const { message, actions, value } = req.body;
	console.log(req.body);
	if(value == 'lang_test'){ // 테스트
		return res.json({
        "view": {
		  "title": "공부하기",
		  "accept": "확인",
		  "decline": "취소",
		  "value": "lang_test",
		  "action_type" : "call_modal",
		  "blocks": [
			{
			  "type": "label",
			  "text": "테스트할 언어",
			  "markdown": true
			},
			{
			  "type": "select",
			  "name": "target_lang",
			  "options": [
				{
				  "text": "영어",
				  "value": "en"
				},
				{
				  "text": "일본",
				  "value": "jp"
				},
				{
				  "text": "중국어",
				  "value": "cn"
				}
			  ],
			  "required": false,
			  "placeholder": "옵션을 선택해주세요"
			},
			{
			  "type": "label",
			  "text": "레벨 선택",
			  "markdown": true
			},
			{
			  "type": "select",
			  "name": "select_level",
			  "options": [
				{
				  "text": "초등학교 저학년",
				  "value": "0"
				},
				{
				  "text": "초등학교 고학년",
				  "value": "1"
				},
				{
				  "text": "중학교",
				  "value": "2"
				},
				{
				  "text": "고등학교",
				  "value": "3"
				}
			  ],
			  "required": false,
			  "placeholder": "옵션을 선택해주세요"
			}
		  ]
		}
	  });
	}
	else if(value == 'want_to_trans'){ // 번역기
		return res.json({
        "view": {
		  "title": "번역기",
		  "accept": "번역하기",
		  "decline": "취소",
		  "value": "want_to_trans",
		  "blocks": [
			{
			  "type": "label",
			  "text": "번역될 언어",
			  "markdown": true
			},
			{
			  "type": "select",
			  "name": "src_lang",
			  "options": [
				{
				  "text": "한국어",
				  "value": "kr"
				},
				{
				  "text": "영어",
				  "value": "en"
				},
				{
				  "text": "일본",
				  "value": "jp"
				},
				{
				  "text": "중국어",
				  "value": "cn"
				}
			  ],
			  "required": false,
			  "placeholder": "옵션을 선택해주세요"
			},
			{
			  "type": "label",
			  "text": "번역할 언어",
			  "markdown": true
			},
			{
			  "type": "select",
			  "name": "target_lang",
			  "options": [
				{
				  "text": "한국어",
				  "value": "kr"
				},
				{
				  "text": "영어",
				  "value": "en"
				},
				{
				  "text": "일본어",
				  "value": "jp"
				},
				{
				  "text": "중국어",
				  "value": "cn"
				}
			  ],
			  "required": false,
			  "placeholder": "옵션을 선택해주세요"
			},
			{
			  "type": "label",
			  "text": "번역할 내용",
			  "markdown": true
			},
			{
			  "type": "input",
			  "name": "trans_content",
			  "required": false,
			  "placeholder": "내용을 입력해주세요"
			}
		  ]
      	}
	  });
	}
	else if(value == 'startSolvingButton'){//
		let selected_level_msg = message.blocks[2].text;
		let selected_lang_msg = message.blocks[1].text;
		selected_level_msg = selected_level_msg.split(": ")[1];
		selected_lang_msg = selected_lang_msg.split(": ")[1];
		
		const level_dict = {
			"초등학교 저학년": 0,
			"초등학교 고학년": 1,
			"중학교": 2,
			"고등학교": 3
		};
		// const lang_dict = {
		// 	"English":'en',
		// 	"Japanese":'jp',
		// 	"Chinese":'cn'
		// };
		const select_level = level_dict[selected_level_msg];
		const select_lang = lang_dict[selected_lang_msg];
		console.log('lev: ',select_level);
		console.log('lang: ',select_lang);
		

		//랜덤하게 단어 고르기
		var randomIndexArray = []
		let wordset = new Set();
		for (i=0; i < 5; i++) {
		  var randomNum = Math.floor(Math.random() * 100);
		  if(!wordset.has(randomNum)){
			  randomIndexArray.push(randomNum);
			  wordset.add(randomNum);
		  }
		  else{
			  i--;
		  }
		}
		
		var questions = [];
		for (let i = 0; i < 5; i++) {
			questions.push(word[select_level][randomIndexArray[i]]);
		}
		
		return res.json({
			"view" : {
			  "title": "Quiz",
			  "accept": "제출",
			  "decline": "취소",
			  "value": "goTestButton",
			  "action_type" : "call_modal",
			  "blocks": [
				{
				  "type": "label",
				  //"text": "1번 문제 " + `${word[select_level][randomIndexArray[0]]}`,
				  "text":`1번 문제: ${word[select_level][randomIndexArray[0]]}`,
				  "markdown": true
				},
				{
				  "type": "input",
				  "name": `${word[select_level][randomIndexArray[0]]}`,
				  "required": false,
				  "placeholder": "내용을 입력해주세요"
				},
				{
				  "type": "label",
				  //"text": "2번 문제 " + `${word[select_level][randomIndexArray[1]]}`,
				  "text":`2번 문제: ${word[select_level][randomIndexArray[1]]}`,
				  "markdown": true
				},
				{
				  "type": "input",
				  "name": `${word[select_level][randomIndexArray[1]]}`,
				  "required": false,
				  "placeholder": "내용을 입력해주세요"
				},
				{
				  "type": "label",
				  //"text": "3번 문제 " + `${word[select_level][randomIndexArray[2]]}`,
				  "text":`3번 문제: ${word[select_level][randomIndexArray[2]]}`,
				  "markdown": true
				},
				{
				  "type": "input",
				  "name": `${word[select_level][randomIndexArray[2]]}`,
				  "required": false,
				  "placeholder": "내용을 입력해주세요"
				},
				{
				  "type": "label",
				  //"text": "4번 문제 " + `${word[select_level][randomIndexArray[3]]}`,
				  "text":`4번 문제: ${word[select_level][randomIndexArray[3]]}`,
				  "markdown": true
				},
				{
				  "type": "input",
				  "name": `${word[select_level][randomIndexArray[3]]}`,
				  "required": false,
				  "placeholder": "내용을 입력해주세요"
				},
				{
				  "type": "label",
				  //"text": "5번 문제 " + `${word[select_level][randomIndexArray[4]]}`,
				  "text":`5번 문제: ${word[select_level][randomIndexArray[4]]}`,
				  "markdown": true
				},
				{
				  "type": "input",
				  "name": `${word[select_level][randomIndexArray[4]]}`,
				  "required": false,
				  "placeholder": "내용을 입력해주세요"
				}
			  ]
			},
		});
	}
});

router.post('/callback', async (req, res, next) => {
	//console.log('body: ', req.body);
	const { message, actions, action_time, value} = req.body;
	//const sentence = actions.trans_content;
	const src_lang = 'kr';
	const conversation_id = message.conversation_id;
	
	if(value == 'lang_test'){
		const target_lang = actions.target_lang;
		const select_level = actions.select_level;
		var extend = new Object();
		extend.en = "English";
		extend.jp = "Japanese";
		extend.cn = "Chinese";
		var level = new Array();
		level=["초등학교 저학년","초등학교 고학년","중학교","고등학교"];
		console.log("actions : ", actions);
		await libKakaoWork.sendMessage({
			"conversationId": conversation_id,
			"text": "언어, 레벨이 선택되었습니다.",
			"blocks": [
				{
					"type": "header",
					"text": "언어선택 완료",
					"style": "blue"
				},
				{
					"type": "text",
					"text": `👨‍🎓 테스트 할 언어 : ${extend[target_lang]}`,
					"markdown": true
				},
				{
					"type": "text",
					"text": `🏷️ 레벨 : ${level[select_level]}`,
					"markdown": true
				},
				{
					"type": "button",
					"text": "테스트 하러가기",
					"style": "default",
					"action_type": "call_modal",
					"value":"startSolvingButton"
				}
			]
		});
	}
	else if(value == 'want_to_trans') {
		const apiKey = kakaoApiKey.apiKey;
		const response = await axios.post('https://dapi.kakao.com/v2/translation/translate',
			querystring.stringify({
				src_lang: `${actions.src_lang}`,
				target_lang: `${actions.target_lang}`,
				query: `${actions.trans_content}`
			}),
			{
				headers:{
					'Authorization': `KakaoAK ${apiKey}`,
					'content-type': 'application/x-www-form-urlencoded'
				}
			}
		);
		
		const resMessage = response.data.translated_text[0][0];
		console.log('resMessage: ', resMessage);
		
		await libKakaoWork.sendMessage({
			"conversationId": conversation_id,
		    "text": "번역 결과",
		    "blocks": [
				{
				  "type": "header",
				  "text": "번역 결과",
				  "style": "red"
				},
				{
				  "type": "text",
				  "text": resMessage,
				  "markdown": true
				}
		    ]
		});
	}
	else if(value == 'goTestButton'){ // 테스트 제출 후 오는 곳
		console.log('actions: ', actions);
		console.log('message: ', message);
		const target_lang = lang_dict[`${message.blocks[1].text.split(': ')[1]}`];
		const apiKey = kakaoApiKey.apiKey;
		let right_cnt = 0;
		let wrong_ans = [];
		for(var key in actions){
			//key: 한글 단어
			// actions[key]: 사용자의 입력단어
			const response = await axios.post('https://dapi.kakao.com/v2/translation/translate',
				querystring.stringify({
					src_lang: 'kr',
					target_lang: target_lang,
					query: key
				}),
				{
					headers:{
						'Authorization': `KakaoAK ${apiKey}`,
						'content-type': 'application/x-www-form-urlencoded'
					}
				}
			);
			const resMessage = response.data.translated_text[0][0];
			console.log('resMessage: ', resMessage);
			if (resMessage == actions[key]) {
				right_cnt += 1;
			}
			else {
				wrong_ans.push([key, resMessage]);
			}
		}
		
		let option = {
			"conversationId": conversation_id,
			"text": "채점 결과",
			"blocks": [
				{
				  "type": "header",
				  "text": "채점 결과✍",
				  "style": "blue"
				},
				{
				  "type": "description",
				  "term": "점수",
				  "content": {
					"type": "text",
					"text": `${20*right_cnt}점`,
					"markdown": false
				  },
				  "accent": true
				},
				{
				  "type": "divider"
				}
			  ]
		}
		for (let i = 0; i < wrong_ans.length; i++) {
			option.blocks.push({
				"type": "description",
				  "term": wrong_ans[i][0],
				  "content": {
					"type": "text",
					"text": wrong_ans[i][1],
					"markdown": false
				  },
				  "accent": true
			})
		}
		
		await libKakaoWork.sendMessage(option);
	}
	return res.json({ result: true });
	
});

module.exports = router;