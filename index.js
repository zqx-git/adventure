
// 逐渐显示，逐渐隐藏应该封装起来，还要封装一个弹框。
// 打字机效果结束后，再逐渐显示提示用户输入框和按钮
// 分屏显示加载的效果
// 开始游戏之后，有一个屏幕逐渐变暗的动画效果，同时游戏屏逐渐显示，游戏屏完全显示后再出现文字


let pageStart = document.getElementById("pageStart") // 游戏提示屏
let pageStartContent1 = document.getElementById("pageStartContent1") // 游戏提示屏文字一
let pageStartContent2 = document.getElementById("pageStartContent2") // 游戏提示屏文字二
let pageStartInfo = document.getElementById("pageStartInfo") // 游戏提示屏角色信息
let pagePlaying = document.getElementById("pagePlaying") // 游戏开始屏
let name,occupation,gender // 角色的姓名，职业，性别
let text1 = "在过去人生的岔路口，你曾经有很多个选择，无数个不同的选择加起来组成了现在你的人生。也许你成为了自己曾经心目中的模样，也许还没有……"
let text2 = "而现在你得到了时光倒流的机会，你可以重新做出一个又一个的选择，看看你是否能成为自己心目中要成为的样子～"
// let text1 = "xdsa"
// let text2 = "fasfas"
// 调用介绍文字2
let showPageStartContent2 = ()=>{daziji(pageStartContent2,text2,showPageStartInfo)}
// 调用角色信息的显示
let showPageStartInfo = ()=>{changeOpacity(pageStartInfo,0,100,false,"时光倒流的奇遇介绍","填写角色信息")}
// 隐藏游戏提示屏
let hidePageStart = ()=>{changeOpacity(pageStart,100,0,true,"进入游戏中......","进入游戏中......",showPagePlaying)}
// 加载游戏开始屏
let showPagePlaying = ()=>{
	changeOpacity(pagePlaying,0,100,false,"进入游戏中......",name+"的时光倒流奇遇记")}
// 点击开始游戏按钮，校验用户输入，完成校验获取游戏数据，进入下一屏
let play = ()=>{
	console.log("1111")
	document.getElementById("pageStartBtn").disabled = true
	setTimeout(() => {
		if(document.getElementById("pageStartBtn"))document.getElementById("pageStartBtn").disabled = false
	}, 1500);
	name = document.getElementById("name").value
    occupation = document.getElementById("occupation").value
    gender = document.getElementById("gender").value
    let regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){2,5}$")
    if(!regex.test(name)){
     	tipsBoxs("error","名字要输入2-5个中文或英文字母哦~")
		return
	}
	if(!regex.test(occupation)){
		tipsBoxs("error","职业要输入2-5个中文或英文字母哦~")
		return
	}
	if(gender == 0){
		tipsBoxs("error","请选择角色的性别哦~")
		return
	}
	hidePageStart()
	getStory(0)
}

// 封装打字机方法
// 传参：作用节点，节点展示文字，完成后的回调函数
let daziji = (node,text,callback)=> {
	let that = this
	let i = 0
    let dazi = setInterval(() => {
        i++
        node.innerHTML = text.slice(0,i)
		// obj.innerText= "knowledge"; 
        if(i==text.length){
			clearInterval(dazi)
			console.log("进入回调")
			console.log(callback)
			callback? callback() : ""
        }
    }, 10);
}
// 封装节点透明度调整的方法
// 传参：作用节点，当前透明度，最终透明度(0-100),完成后节点是否删除掉(true,false)，进行中title的显示(string),完成后title的显示(string),完成后的回调函数(function)
let changeOpacity = (node,present,opacity,del,title1,title2,callback)=>{
	let speed,timer
	// page2逐渐显示出来，直至覆盖page1，然后page1完全隐藏掉
	clearInterval(timer);
	timer = setInterval(()=>{
		// 当前node透明度为0的，先把display调为block
		present == 0? node.style.display = "block" : ""
		// 当前透明度小于目标透明度，说明是要逐渐显示,否则就是逐渐消失
		present < opacity? speed = 2 : speed = -2
		present += speed;
		node.style.filter = 'opacity(opacity='+present+')';
		node.style.opacity = present/100;
		document.title = title1
		if(present == opacity){
			clearInterval(timer);
			document.title = title2
			// 是否删除当前作用节点
			if(!!del){
				node.remove()
			}
			callback? callback() : ""
		}
	},20)
}
// 封装提示弹框
// 传参：提示类型(success,error)，提示内容，显示时间(毫秒)
let tipsBoxs = (status,text,times=2000)=>{
	let node = document.createElement("div")
	node.className = "tips-boxs"
	node.innerHTML = `<div class="tips-boxs-content tips-boxs-content-${status}"><p class="tips-boxs-content-text">${text}</p></div>`
	document.body.appendChild(node)
	setTimeout(() => {
		node.remove()
	}, times);
}
// 点击选择方法
// 自身按钮变色，其他兄弟按钮隐藏，发送请求获取下一个数据
// 传参：当前选择的id
let makeChoice = (e,id)=>{
	console.log(e)
	console.log(id)
}
// 获取故事情节，并显示在页面上
let getStory = (id)=>{
    console.log("获取json")
    let url = "./index.json"
    let request = new XMLHttpRequest()
    request.open("get", url)
    request.send(null)
    request.onload = function () {
        if (request.status == 200) {
            let json = JSON.parse(request.responseText)
			let items = json.story.find(e => e.id === id)
			let htmlOne = ''
			let htmlTwo = ''
			items.text.forEach((item)=>{htmlOne += `<p class="page-playing-item">${item}</p>`})
			items.select.forEach((item)=>{htmlTwo+=`<button class="btn-confirm">${item}</button>`})
			let node = document.createElement("section")
			node.innerHTML = htmlOne+'<div class="page-playing-btns">'+htmlTwo+'</div>'
			document.getElementById("playPageContent").appendChild(node)
        }
    }
}

// 进入页面，首先游戏提示屏的文字开始显示
daziji(pageStartContent1,text1,showPageStartContent2)





// 通过天行接口调用毒鸡汤
// function getOne() {
//   $.ajax({
//     type: "get",
//     url:
//       "http://api.tianapi.com/txapi/dujitang/index?key=62e4d5c2404d3b1e6f6e33b78c9d9b29",
//     // "http://api.tianapi.com/txapi/one/index?key=62e4d5c2404d3b1e6f6e33b78c9d9b29", one的每日一句
//     success: function(success) {
//       console.log(success)
//       if (success.code == 200) {
//         text = success.newslist[0].content
//         var reg = /[,；|，；|;;|；;|:；|：；|。；|.；|？；|?；| ；]/g
//         arr = text.split(reg)
//         for (var j = 0; j < arr.length; j++) {
//           let pp = "<p><span></span><span></span></p>"
//           document.getElementsByClassName(".page-start-content").append(pp)
//         }
//         daziji(i)
//       } else {
//         text = `黑夜给了我黑色的眼睛 我却用它寻找光明`
//         daziji(i)
//       }
//     },
//     error: function(error) {
//       console.error("获取数据错误" + error)
//       text = `黑夜给了我黑色的眼睛 ,我却用它寻找光明`
//       daziji(i)
//     }
//   })
// }
// getOne()