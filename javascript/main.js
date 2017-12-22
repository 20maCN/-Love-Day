window.onload = function(){
	var canvas = document.getElementById('loveContainer');
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	if(window.requestAnimationFrame == undefined || canvas.getContext == undefined){
		alert('亲，遇到了一个问题！你的浏览器处于IE兼容模式或者版本太低了！^_^');
	}
	var ctx = canvas.getContext('2d');	
	var innerHeight = canvas.height;
	var innerWidth = canvas.width;

	// 状态跟踪变量
	var bigHeart = {x:[],y:[]};
	var smallHeart = {x:[],y:[]};
	var currentHeart = null;
	var t = [];
	var flag = false;
	var flag1 = false;
	var taggle = 0;
	var myRequestAnimationFrame1  = null;
	var myRequestAnimationFrame2  = null;
	var myRequestAnimationFrame3  = null;
	var myRequestAnimationFrame4  = null;
	var scaleFlag = true;
	var splitMoveConfig1 = {moveStepX:0,moveStepY:0,rotate:0,scale:0,shadowBlur:1,lineWidth:1,style:'#BE1A25'};
	var splitMoveConfig2 = {moveStepX:0,moveStepY:0,rotate:0,scale:1,shadowBlur:1,lineWidth:4,style:'#BE1A25'};
	var textConfig = {stepY:250,alpha:0};
	var hearts = [];
	var heartConfigs = []
	var initialSize = 0;
	var initialSize1 = 0;
	var startTime = new Date();
	startTime.setFullYear(2016);
	startTime.setMonth(3);
	startTime.setDate(12);
	startTime.setHours(20);
	startTime.setMinutes(20);
	startTime.setSeconds(20);


	// 工具  设置heart大小
	function getPoints(heart,size){
		for(var i=0,j=0;i<2*Math.PI;i+=0.01,j++){
			t[j] = i;
			heart.x[j] = (size||2)*(16*Math.pow(Math.sin(i),3));
			heart.y[j] = (size||2)*(13*Math.cos(i) - 5*Math.cos(2*i) - 2*Math.cos(3*i) - Math.cos(4*i));
			// heart.x[j] = (size||2)*(Math.sqrt(2*Math.sqrt(i*i)-i*i));
			// heart.y[j] = (size||2)*(-2.14*Math.sqrt(Math.sqrt(2)-Math.sqrt(Math.abs(i))));
		}
		return heart;
	}
	// 工具  画heart轮廓
	function drawHeartoutline(){
		ctx.save();
		ctx.translate(innerWidth/2+splitMoveConfig2.moveStepX,innerHeight/2+splitMoveConfig2.moveStepY);
		ctx.rotate(Math.PI);
		ctx.scale(splitMoveConfig2.scale,splitMoveConfig2.scale);
		ctx.beginPath();
		for(var j=0;j<t.length;j++){
			ctx.lineTo(bigHeart.x[j],bigHeart.y[j]);
		}
		ctx.lineWidth = splitMoveConfig2.lineWidth;
		ctx.strokeStyle = splitMoveConfig2.style;
		ctx.stroke();
		ctx.restore()
	}
	// 工具  画一个实心
	function drawFillHeart(){
		ctx.save();
		ctx.translate(innerWidth/2+splitMoveConfig1.moveStepX,innerHeight/2+splitMoveConfig1.moveStepY);
		ctx.rotate(Math.PI+splitMoveConfig1.rotate);
		ctx.scale(splitMoveConfig1.scale,splitMoveConfig1.scale);
		ctx.beginPath();

		for(var i = 0;i < t.length;i++){
			ctx.lineTo(smallHeart.x[i],smallHeart.y[i]);
		}
		ctx.shadowColor = splitMoveConfig1.style;
      	ctx.shadowBlur = splitMoveConfig1.shadowBlur;
		ctx.fillStyle = splitMoveConfig1.style;
		ctx.fill();
		ctx.restore();
	}




	// 场景一 进入动画
	function draw(){
		ctx.clearRect(0,0,innerWidth,innerHeight);

		ctx.save();
		ctx.translate(innerWidth/2,innerHeight/2);
		ctx.rotate(Math.PI);
		// ctx.scale(4,4);
		ctx.beginPath();
		// ctx.moveTo(0,0);
		lineTo(5);
		ctx.lineWidth = 4;
		// ctx.shadowColor = '#D82C1F';
 		// ctx.shadowBlur = 20;
		ctx.strokeStyle = '#BE1A25';
		ctx.stroke();
		ctx.restore();

		function lineTo(duration){
			var pointsLenth = t.length;
			var step = Math.ceil(pointsLenth/(duration*60));
			for(var i = 0;i < step*taggle;i++){
				ctx.lineTo(bigHeart.x[i],bigHeart.y[i]);	
			}
			taggle++;
			if(taggle*step > pointsLenth){
				flag = true;
			}
		}

		myRequestAnimationFrame1 = window.requestAnimationFrame(draw);
		if(flag){
			window.cancelAnimationFrame(myRequestAnimationFrame1);
			drawBumpHeart();
			canvas.onclick = function(e){
		        var rect = canvas.getBoundingClientRect();
		       	var location = {
		          x: e.clientX - rect.left,
		          y: e.clientY - rect.top
		        };
		        if(innerWidth/2-50<location.x&&location.x<innerWidth/2+50&&innerHeight/2-50<location.y&&location.y<innerHeight/2+50){
	    			window.cancelAnimationFrame(myRequestAnimationFrame2);
	    			splitMove();
    			}
   			 }
		}		
	}
	// 场景二 实心大小变换
	function drawBumpHeart(){
		ctx.clearRect(0,0,innerWidth,innerHeight);
		if(scaleFlag){
			splitMoveConfig1.scale+=0.008;
			splitMoveConfig1.shadowBlur+=0.16;
			if(splitMoveConfig1.scale>1.5){
				scaleFlag = false;
			}
		}else{
			splitMoveConfig1.scale-=0.004;
			splitMoveConfig1.shadowBlur-=0.08;
			if(splitMoveConfig1.scale<1){
				scaleFlag = true;
			}
		}
		drawHeartoutline()
		drawFillHeart();

		myRequestAnimationFrame2 = window.requestAnimationFrame(drawBumpHeart);
	}
	// 场景三 左右移动
	function splitMove(){
		ctx.clearRect(0,0,innerWidth,innerHeight);
		drawHeartoutline()
		drawFillHeart();
		if(splitMoveConfig1.moveStepX>-300){
			splitMoveConfig1.moveStepX-=4;
			splitMoveConfig2.moveStepX+=2;
			myRequestAnimationFrame3 = window.requestAnimationFrame(splitMove);
		}else{
			window.cancelAnimationFrame(myRequestAnimationFrame3);
			canvas.onclick = null;
			updownMove();
		}
		
	}
	// 场景四 上下移动 放大bigHeart
	function updownMove(){
		ctx.clearRect(0,0,innerWidth,innerHeight);
		drawHeartoutline()
		drawFillHeart();
		if(splitMoveConfig1.moveStepY<380){
			splitMoveConfig1.moveStepY+=2;
			splitMoveConfig1.rotate+=Math.PI*0.02;
			splitMoveConfig2.scale-=0.005;
			splitMoveConfig2.lineWidth-=0.02;
			splitMoveConfig2.moveStepY-=0.4;
			myRequestAnimationFrame4 = window.requestAnimationFrame(updownMove);
		}else{
			window.cancelAnimationFrame(myRequestAnimationFrame4);
			// getManyHearts();
			flag=false;
			backgroundHeart();
		}
	}

	// 场景五工具函数
	function drawBGHeart(heart,heartConfig){
		ctx.save();
		ctx.translate(heartConfig.tX,heartConfig.tY);
		ctx.rotate(heartConfig.rotate);
		ctx.scale(heartConfig.scale,heartConfig.scale);
		ctx.beginPath();
		for(var i = 0;i<heart.x.length;i++){
			ctx.lineTo(heart.x[i],heart.y[i]);
		}
		ctx.fillStyle = heartConfig.style;
		ctx.fill();
		ctx.restore();
	}
	function drawBGOutline(){
		ctx.save();
		ctx.translate(innerWidth/2+splitMoveConfig2.moveStepX,innerHeight/2+splitMoveConfig2.moveStepY);
		ctx.rotate(Math.PI);
		ctx.scale(4,4);
		ctx.beginPath();
		for(var j=0;j<t.length;j++){
			ctx.lineTo(bigHeart.x[j]*initialSize1,bigHeart.y[j]*initialSize1);
		}
		ctx.lineWidth = splitMoveConfig2.lineWidth;
		ctx.shadowColor = '#FF524A';
      	ctx.shadowBlur = 40;
		ctx.fillStyle = '#FF524A';
		ctx.fill();
		ctx.restore()
	}
	function getManyHearts(){
		var tempP = {x:[],y:[]};
		var R = 255;
		var G = Math.floor(Math.random()*80+20);
		var B = Math.floor(Math.random()*80+20);
		var heartConfig = {tX:Math.floor(Math.random()*(innerWidth-60))+30,tY:Math.floor(Math.random()*(innerHeight-60))+30,flag:false,scale:0,style:'rgb('+R+','+G+','+B+')',rotate:(Math.random()*Math.PI).toFixed(2)};
		tempP = getPoints(tempP,(Math.random()*1.5+0.5));
		hearts.push(tempP);
		heartConfigs.push(heartConfig);
	}
	function filltime(){
		var date = new Date();
		var diff= date.getTime()-startTime.getTime();
		var d = Math.floor(diff/(1000*60*60*24));
		var h = Math.floor((diff-(1000*60*60*24)*d)/(1000*60*60));
		var m = Math.floor((diff-(1000*60*60*24)*d-(1000*60*60)*h)/(1000*60));
		var s = Math.floor((diff-(1000*60*60*24)*d-(1000*60*60)*h-(1000*60)*m)/(1000));
		ctx.save();
		ctx.beginPath();
		ctx.font = '18pt Arial';
		ctx.globalAlpha = textConfig.alpha;
      	ctx.fillStyle = 'white';
      	ctx.fillText('亲爱的，我们已经相恋了', innerWidth/2+10, innerHeight/2+30-textConfig.stepY);

      	ctx.font = '24pt Arial';
      	ctx.fillStyle = 'white';
      	ctx.fillText('第 '+d+' 天 '+h+' 个小时 '+m+' 分钟 '+s+' 秒 ', innerWidth/2-75, innerHeight/2+10-textConfig.stepY/2);
      	ctx.font = '18pt Arial';
      	// ctx.fillText('过了第一个我们的节日~~^_^~~ ', innerWidth/2+30, innerHeight/2+70-textConfig.stepY/2);
      	// ctx.fillText('第 '+0+' 天 '+0+' 个小时 '+0+' 分钟 '+0+' 秒 ', innerWidth/2-75, innerHeight/2+10-textConfig.stepY/2);
		ctx.restore();
	}
	// 场景五 背景显示 时间显示
	function backgroundHeart(){
		if(hearts.length<134){
			getManyHearts();
		}
		ctx.clearRect(0,0,innerWidth,innerHeight);
		ctx.save();
		ctx.globalCompositeOperation = 'destination-over';
		drawBGOutline();
		var length = hearts.length;
		for(var i = 0;i < length;i++){
			drawBGHeart(hearts[i],heartConfigs[i]);
		}
		ctx.restore();
		for(var j = 0;j < length;j++){
			if(!heartConfigs[j].flag){
				if(heartConfigs[j].scale<1){
					heartConfigs[j].scale+=0.008;
				}else{
					heartConfigs[j].flag = !heartConfigs[j].flag;
				}
			}else{
				if(heartConfigs[j].scale>0.5){
					heartConfigs[j].scale-=0.004;
				}else{
					heartConfigs[j].flag = !heartConfigs[j].flag;
				}
			}
		}
		if(initialSize < 1){
			initialSize+=0.001;
			if(initialSize1 < 1){
				initialSize1+=0.01;
			}else{
				if(textConfig.stepY>180){
					textConfig.stepY-=1;
					textConfig.alpha+=0.01;
				}
				filltime();
			}
		}else{
			filltime();
		}
		window.requestAnimationFrame(backgroundHeart);
	}

	canvas.onmousemove = function(e){
		var rect = canvas.getBoundingClientRect();
       	var location = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        if(innerWidth/2-50<location.x&&location.x<innerWidth/2+50&&innerHeight/2-50<location.y&&location.y<innerHeight/2+50){
			canvas.style.cursor = 'pointer';
		}else{
			canvas.style.cursor = 'inherit';
		}

	}
	// 初始化
	function init(){
		getPoints(smallHeart,1);
		getPoints(bigHeart,5);
		draw();
	}
	init();
}
